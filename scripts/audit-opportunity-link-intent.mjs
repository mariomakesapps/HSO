import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPORT_DIR = path.join(ROOT, "reports");
const BUNDLE_FILE = path.join(REPORT_DIR, "opportunities.intent.bundle.mjs");
const JSON_REPORT = path.join(REPORT_DIR, "link-intent-audit.json");
const SUMMARY_REPORT = path.join(REPORT_DIR, "link-intent-audit-summary.txt");
const CONCURRENCY = 12;
const REQUEST_TIMEOUT_MS = 16000;
const BODY_SNIFF_BYTES = 140000;

const GENERATED_EXACT_PATTERNS = [
  /^nyc-dycd-/,
  /^sf-our415-/,
  /^nps-/,
];

const OFFICIAL_ROOT_PROGRAM_IDS = new Set([
  "pioneer",
  "promys",
  "hmmt",
  "pumac",
  "usaco",
  "ipho",
  "usabo",
  "icho",
  "usaaao",
  "ieso",
  "ssp",
  "brown-pre-college",
  "syp-uchicago",
  "hampshire",
  "ill-mathematics",
  "ai4all",
  "yale-mun",
  "khan-academy",
  "brilliant",
  "aops",
  "picoctf",
  "idealab",
  "volunteer-match",
  "stem-saturday",
  "girls-write",
  "youth-for-understanding",
  "worldquant-uni",
  "state-arizona-keys",
  "state-new-jersey-stem-scholars",
  "state-pennsylvania-pgss",
  "state-rhode-island-brown-precollege",
  "state-vermont-giv",
  "state-wisconsin-badger",
]);

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "high",
  "school",
  "student",
  "students",
  "program",
  "programs",
  "summer",
  "academy",
  "internship",
  "internships",
  "opportunity",
  "opportunities",
  "college",
  "precollege",
  "pre",
  "youth",
  "teen",
  "teens",
  "research",
  "scholarship",
  "competition",
  "fellowship",
  "volunteer",
  "online",
  "national",
  "international",
  "university",
  "institute",
  "center",
  "centre",
]);

const aliasPlugin = {
  name: "hso-alias",
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => {
      const resolved = path.join(ROOT, "src", args.path.slice(2));
      return { path: /\.(ts|tsx|js|jsx|mjs|cjs|json)$/i.test(resolved) ? resolved : `${resolved}.ts` };
    });
  },
};

async function loadOpportunities() {
  await mkdir(REPORT_DIR, { recursive: true });
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, "src/data/opportunities.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    plugins: [aliasPlugin],
    logLevel: "silent",
  });
  await writeFile(BUNDLE_FILE, result.outputFiles[0].text);
  const mod = await import(`${pathToFileURL(BUNDLE_FILE).href}?t=${Date.now()}`);
  return mod.opportunities;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return normalize(value)
    .split(" ")
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));
}

function unique(values) {
  return [...new Set(values)];
}

async function fetchSnippet(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; HSOIntentAudit/1.0; +https://localhost)",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
    });

    const snippet = response.status >= 200 && response.status < 400 ? await readSnippet(response) : "";
    if (!snippet) await response.body?.cancel();
    return { status: response.status, finalUrl: response.url, snippet, error: null };
  } catch (error) {
    return {
      status: null,
      finalUrl: null,
      snippet: "",
      error: error?.name === "AbortError" ? "timeout" : String(error?.message || error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function readSnippet(response) {
  const reader = response.body?.getReader?.();
  if (!reader) return "";
  const chunks = [];
  let total = 0;
  try {
    while (total < BODY_SNIFF_BYTES) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      total += value.byteLength;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // Ignore servers that already closed the stream.
    }
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(snippet) {
  return stripTags(snippet.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function urlInfo(url) {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const broadRoot = pathParts.length === 0 || (pathParts.length === 1 && /^index\.(html?|php)$/i.test(pathParts[0]));
    return {
      ok: true,
      host: parsed.hostname.replace(/^www\./, ""),
      pathname: parsed.pathname,
      pathParts,
      broadRoot,
      normalizedUrl: normalize(`${parsed.hostname} ${parsed.pathname} ${parsed.search}`),
    };
  } catch {
    return { ok: false, host: "", pathname: "", pathParts: [], broadRoot: true, normalizedUrl: "" };
  }
}

function isGeneratedExact(id) {
  return GENERATED_EXACT_PATTERNS.some((pattern) => pattern.test(id));
}

function isOfficialRootProgram(id) {
  return OFFICIAL_ROOT_PROGRAM_IDS.has(id);
}

function classifyIntent(opp, fetchResult) {
  const info = urlInfo(opp.url);
  const titleTokens = unique(tokens(opp.title));
  const orgTokens = unique(tokens(opp.org));
  const text = normalize(`${extractTitle(fetchResult.snippet)} ${stripTags(fetchResult.snippet.slice(0, BODY_SNIFF_BYTES))}`);
  const urlText = info.normalizedUrl;

  const titleHits = titleTokens.filter((token) => text.includes(token) || urlText.includes(token));
  const orgHits = orgTokens.filter((token) => text.includes(token) || urlText.includes(token));
  const titleOnlyHits = titleTokens.filter((token) => text.includes(token));
  const urlTitleHits = titleTokens.filter((token) => urlText.includes(token));

  const exactSource = isGeneratedExact(opp.id) || isOfficialRootProgram(opp.id);
  const botBlocked = fetchResult.status === 403 || fetchResult.status === 429;
  const broadProgramDirectory =
    /apply|admission|program|course|summer|precollege|intern|volunteer|education|high-school|teen|youth|academy|scholar/i.test(
      info.pathname,
    );

  const reasons = [];
  let score = 0;

  if (exactSource) score += 4;
  if (titleOnlyHits.length >= 2) score += 3;
  else if (titleOnlyHits.length === 1) score += 1;
  if (urlTitleHits.length >= 1) score += 2;
  if (orgHits.length >= 1) score += 1;
  if (info.pathParts.length >= 2) score += 1;
  if (broadProgramDirectory) score += 1;
  if (info.broadRoot) score -= 3;
  if (!fetchResult.status || fetchResult.status >= 400) score -= 1;

  if (isGeneratedExact(opp.id)) reasons.push("generated-exact-source");
  if (isOfficialRootProgram(opp.id)) reasons.push("official-root-program-site");
  if (info.broadRoot) reasons.push("homepage-or-root-url");
  if (titleHits.length === 0 && !botBlocked) reasons.push("no-title-token-match");
  if (info.pathParts.length <= 1 && !broadProgramDirectory && !exactSource) reasons.push("shallow-url-path");
  if (botBlocked) reasons.push("bot-blocked-verification");

  const needsReview =
    !exactSource &&
    !botBlocked &&
    (score < 2 || (info.broadRoot && titleHits.length < 2) || (titleHits.length === 0 && info.pathParts.length <= 2));

  const likelyBroad =
    !exactSource &&
    !botBlocked &&
    (info.broadRoot || reasons.includes("shallow-url-path")) &&
    titleHits.length < 2;

  return {
    id: opp.id,
    title: opp.title,
    org: opp.org,
    url: opp.url,
    status: fetchResult.status,
    finalUrl: fetchResult.finalUrl,
    pageTitle: extractTitle(fetchResult.snippet),
    score,
    titleTokens,
    titleHits,
    orgHits,
    reasons,
    needsReview,
    likelyBroad,
  };
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const opportunities = await loadOpportunities();
  const byUrl = new Map();
  for (const opp of opportunities) {
    if (!byUrl.has(opp.url)) byUrl.set(opp.url, []);
    byUrl.get(opp.url).push(opp);
  }

  const uniqueUrls = [...byUrl.keys()];
  const urlChecks = new Map();
  await mapLimit(uniqueUrls, CONCURRENCY, async (url) => {
    urlChecks.set(url, await fetchSnippet(url));
  });

  const results = opportunities.map((opp) => classifyIntent(opp, urlChecks.get(opp.url)));
  const needsReview = results.filter((item) => item.needsReview);
  const likelyBroad = results.filter((item) => item.likelyBroad);
  const botBlocked = results.filter((item) => item.reasons.includes("bot-blocked-verification"));

  const report = {
    generatedAt: new Date().toISOString(),
    totalOpportunities: opportunities.length,
    uniqueUrls: uniqueUrls.length,
    needsReviewCount: needsReview.length,
    likelyBroadCount: likelyBroad.length,
    botBlockedCount: botBlocked.length,
    needsReview,
    likelyBroad,
    botBlocked,
  };

  const summary = [
    `Generated at: ${report.generatedAt}`,
    `Opportunities: ${report.totalOpportunities}`,
    `Unique URLs: ${report.uniqueUrls}`,
    `Needs review: ${report.needsReviewCount}`,
    `Likely broad/non-specific: ${report.likelyBroadCount}`,
    `Bot-blocked verification: ${report.botBlockedCount}`,
    "",
    "Top likely broad/non-specific links:",
    ...likelyBroad.slice(0, 80).map((item) => `- score ${item.score}: ${item.title} | ${item.url} | ${item.reasons.join(", ")}`),
    "",
    "Top needs-review links:",
    ...needsReview.slice(0, 80).map((item) => `- score ${item.score}: ${item.title} | ${item.url} | ${item.reasons.join(", ")}`),
  ].join("\n");

  await writeFile(JSON_REPORT, JSON.stringify(report, null, 2));
  await writeFile(SUMMARY_REPORT, summary);
  console.log(summary);
  if (needsReview.length) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
