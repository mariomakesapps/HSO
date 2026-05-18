import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPORT_DIR = path.join(ROOT, "reports");
const BUNDLE_FILE = path.join(REPORT_DIR, "opportunities.verification.bundle.mjs");
const JSON_REPORT = path.join(REPORT_DIR, "link-verification-report.json");
const SUMMARY_REPORT = path.join(REPORT_DIR, "link-verification-summary.txt");
const VERIFICATION_MODULE = path.join(ROOT, "src/data/linkVerification.generated.ts");
const APPLY = process.argv.includes("--apply");

const REQUEST_TIMEOUT_MS = 15000;
const BODY_SNIFF_BYTES = 90000;
const VERIFY_CONCURRENCY = 16;
const SEARCH_CONCURRENCY = 4;

const EDITABLE_DATA_FILES = [
  "src/data/opportunities.ts",
  "src/data/stateOpportunities.ts",
  "src/data/additionalUsOpportunities.ts",
  "src/data/generatedBulkOpportunities.ts",
];

const SEARCH_BLOCKLIST = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "pinterest.com",
  "reddit.com",
  "tiktok.com",
  "wikipedia.org",
  "youtube.com",
  "x.com",
];

const CURATED_OFFICIAL_FALLBACKS = new Map([
  ["nih-hi-step", "https://www.training.nih.gov/programs/hs-si"],
  ["state-maryland-histep", "https://www.training.nih.gov/programs/hs-si"],
  ["teen-treks", "https://arccprograms.com/summer-overview/summer-programs-high-school/"],
]);

const aliasPlugin = {
  name: "hso-alias",
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => {
      const resolved = path.join(ROOT, "src", args.path.slice(2));
      return {
        path: /\.(ts|tsx|js|jsx|mjs|cjs|json)$/i.test(resolved) ? resolved : `${resolved}.ts`,
      };
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

function isMissingLink(value) {
  const text = String(value ?? "").trim();
  return !text || /^(#|tbd|tba|null|none|n\/a)$/i.test(text);
}

function normalizeUrl(value) {
  if (isMissingLink(value)) return null;
  try {
    const url = new URL(String(value).trim());
    if (!/^https?:$/i.test(url.protocol)) return null;
    return url.href;
  } catch {
    return null;
  }
}

function tokenize(value) {
  const stop = new Set([
    "academy",
    "association",
    "center",
    "centre",
    "college",
    "competition",
    "foundation",
    "global",
    "high",
    "inc",
    "institute",
    "international",
    "national",
    "official",
    "program",
    "programme",
    "school",
    "student",
    "summer",
    "the",
    "university",
    "youth",
  ]);
  return [...String(value || "").toLowerCase().matchAll(/[a-z0-9]{3,}/g)]
    .map((match) => match[0])
    .filter((word) => !stop.has(word));
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pageTitle(snippet) {
  return stripTags(snippet.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function detectSoftNotFound(snippet, finalUrl) {
  const title = pageTitle(snippet);
  const h1 = stripTags(snippet.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const earlyText = stripTags(snippet.slice(0, 10000));
  const signal = `${title} ${h1}`.trim();
  const broadSignal = `${signal} ${earlyText.slice(0, 1400)}`;

  if (/\/404(?:[/?#]|$)|\/not-found(?:[/?#]|$)/i.test(finalUrl)) return "not-found-url";
  if (/\b(404|page not found|not found|page unavailable|does not exist|can't find this page|cannot find this page|we couldn't find)\b/i.test(signal)) {
    return signal.slice(0, 180) || "not-found-title";
  }
  if (/\b(page not found|the page you requested could not be found|does not exist|can't find this page|cannot find this page)\b/i.test(broadSignal)) {
    return "not-found-copy";
  }
  return null;
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
      // Some servers close the stream before we cancel it.
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

async function fetchPage(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) {
    return {
      ok: false,
      invalid: true,
      status: null,
      finalUrl: null,
      title: "",
      snippet: "",
      reason: isMissingLink(url) ? "missing-link" : "invalid-url",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(normalized, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; HSOOpportunityLinkRepair/1.0; +https://localhost)",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
    });
    const snippet = response.status >= 200 && response.status < 400 ? await readSnippet(response) : "";
    if (!snippet) await response.body?.cancel?.();
    const softNotFound = response.status >= 200 && response.status < 400 ? detectSoftNotFound(snippet, response.url) : null;
    const auditBlocked = response.status === 403 || response.status === 429;
    const hardBroken = response.status >= 400 && !auditBlocked;
    return {
      ok: response.status >= 200 && response.status < 400 && !softNotFound,
      invalid: hardBroken || Boolean(softNotFound),
      auditBlocked,
      status: response.status,
      finalUrl: response.url,
      title: pageTitle(snippet),
      snippet,
      softNotFound,
      reason: softNotFound || (hardBroken ? `http-${response.status}` : auditBlocked ? `audit-blocked-${response.status}` : null),
    };
  } catch (error) {
    return {
      ok: false,
      invalid: false,
      status: null,
      finalUrl: null,
      title: "",
      snippet: "",
      reason: error?.name === "AbortError" ? "timeout" : String(error?.message || error),
    };
  } finally {
    clearTimeout(timeout);
  }
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

function parseSearchLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    let href = match[1].replace(/&amp;/g, "&");
    if (href.includes("duckduckgo.com/l/?")) {
      const wrapped = new URL(href, "https://duckduckgo.com");
      href = wrapped.searchParams.get("uddg") || href;
    }
    if (!/^https?:\/\//i.test(href)) continue;
    try {
      const url = new URL(href);
      if (SEARCH_BLOCKLIST.some((domain) => url.hostname.includes(domain))) continue;
      links.add(url.href);
    } catch {
      // Ignore malformed result links.
    }
  }
  return [...links];
}

function officialHostScore(opp, candidateUrl) {
  const url = new URL(candidateUrl);
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const haystack = `${host} ${url.pathname.toLowerCase()}`;
  const orgTokens = tokenize(opp.org);
  const titleTokens = tokenize(opp.title);
  let score = 0;
  if (host.endsWith(".edu") || host.endsWith(".gov")) score += 35;
  if (orgTokens.some((token) => haystack.includes(token))) score += 35;
  if (titleTokens.some((token) => haystack.includes(token))) score += 20;
  if (/(apply|application|admission|program|internship|scholarship|competition|students?|teens?|youth|precollege|summer)/i.test(url.pathname)) score += 15;
  return score;
}

function relevanceScore(opp, candidateUrl, check) {
  const text = `${candidateUrl} ${check.title} ${stripTags(check.snippet).slice(0, 5000)}`.toLowerCase();
  const titleTokens = tokenize(opp.title);
  const orgTokens = tokenize(opp.org);
  const titleHits = titleTokens.filter((token) => text.includes(token)).length;
  const orgHits = orgTokens.filter((token) => text.includes(token)).length;
  return officialHostScore(opp, candidateUrl) + titleHits * 14 + orgHits * 12;
}

async function searchOfficialUrl(opp) {
  const queries = [
    `${opp.title} ${opp.org} official ${opp.category} high school`,
    `${opp.title} ${opp.org} application`,
    `${opp.title} ${opp.org} program`,
  ];

  const seen = new Set();
  const candidates = [];
  for (const query of queries) {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const search = await fetchPage(searchUrl);
    if (!search.ok && !search.snippet) continue;
    for (const link of parseSearchLinks(search.snippet)) {
      if (seen.has(link)) continue;
      seen.add(link);
      try {
        if (officialHostScore(opp, link) >= 35) candidates.push(link);
      } catch {
        // Ignore malformed candidate URLs.
      }
    }
    if (candidates.length >= 8) break;
  }

  const scored = [];
  for (const candidate of candidates.slice(0, 12)) {
    const check = await fetchPage(candidate);
    if (!check.ok) continue;
    const score = relevanceScore(opp, candidate, check);
    if (score >= 55) scored.push({ url: check.finalUrl || candidate, score, title: check.title });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

function shouldBlankBrokenUrl(check) {
  if (check.reason === "missing-link" || check.reason === "invalid-url") return true;
  if (check.softNotFound) return true;
  return check.status === 404 || check.status === 410;
}

function verificationFor(opp, check, change) {
  if (change?.new_link) {
    return { verified: true, requiresReview: false };
  }
  if (change?.new_link === "") {
    return {
      verified: false,
      requiresReview: true,
      review_note: change.reason,
    };
  }
  if (check.ok && opp.link_quality !== "broken" && opp.link_quality !== "generic_homepage") {
    return { verified: true, requiresReview: false };
  }
  const note = [
    check.reason,
    opp.link_quality === "generic_homepage" ? "generic-homepage" : null,
    opp.link_quality === "broken" ? "broken-link-quality" : null,
  ].filter(Boolean).join(", ");
  return {
    verified: false,
    requiresReview: true,
    review_note: note || "needs-manual-review",
  };
}

async function applyUrlChanges(changes) {
  if (!changes.length) return [];
  const applied = [];
  for (const relativeFile of EDITABLE_DATA_FILES) {
    const file = path.join(ROOT, relativeFile);
    let content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    let changed = false;

    for (const change of changes) {
      if (applied.some((item) => item.id === change.id)) continue;
      const idPattern = new RegExp(`["']id["']?\\s*:\\s*["']${escapeRegExp(change.id)}["']|\\bid\\s*:\\s*["']${escapeRegExp(change.id)}["']`);
      const idLine = lines.findIndex((line) => idPattern.test(line));
      if (idLine === -1) continue;

      for (let i = idLine; i < Math.min(lines.length, idLine + 90); i += 1) {
        if (/(?:\burl\s*:|"url"\s*:)\s*"/.test(lines[i])) {
          const nextLine = lines[i]
            .replace(/(\burl\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(change.new_link)}$3`)
            .replace(/("url"\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(change.new_link)}$3`);
          if (nextLine !== lines[i]) {
            lines[i] = nextLine;
            changed = true;
            applied.push({ ...change, file: relativeFile });
          }
          break;
        }
      }
    }

    if (changed) {
      content = lines.join("\n");
      await writeFile(file, content, "utf8");
    }
  }
  return applied;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeReplacement(value) {
  return String(value).replace(/\$/g, "$$$$");
}

async function writeVerificationModule(verifications) {
  const rows = Object.fromEntries(
    verifications
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((item) => [
        item.id,
        item.review_note
          ? { verified: item.verified, requiresReview: item.requiresReview, review_note: item.review_note }
          : { verified: item.verified, requiresReview: item.requiresReview },
      ]),
  );
  const content = [
    "// Generated by scripts/repair-missing-opportunity-links.mjs. Do not edit by hand.",
    "",
    "export const opportunityLinkVerification: Record<string, { verified: boolean; requiresReview: boolean; review_note?: string }> = ",
    `${JSON.stringify(rows, null, 2)} as const;`,
    "",
  ].join("\n");
  await writeFile(VERIFICATION_MODULE, content, "utf8");
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  const opportunities = await loadOpportunities();
  const byUrl = new Map();
  for (const opp of opportunities) {
    const normalized = normalizeUrl(opp.url) || `invalid:${opp.id}`;
    if (!byUrl.has(normalized)) byUrl.set(normalized, []);
    byUrl.get(normalized).push(opp);
  }

  const checksByKey = new Map();
  await mapLimit([...byUrl.keys()], VERIFY_CONCURRENCY, async (key) => {
    const sample = byUrl.get(key)[0];
    checksByKey.set(key, await fetchPage(sample.url));
  });

  const records = opportunities.map((opp) => {
    const key = normalizeUrl(opp.url) || `invalid:${opp.id}`;
    return { opp, check: checksByKey.get(key) };
  });

  const invalidRecords = records.filter(({ opp, check }) =>
    check.invalid ||
    check.auditBlocked ||
    opp.link_quality === "broken" ||
    opp.link_quality === "generic_homepage"
  );

  const proposedChanges = [];
  await mapLimit(invalidRecords.filter(({ check }) => check.invalid), SEARCH_CONCURRENCY, async ({ opp, check }) => {
    const curatedFallback = CURATED_OFFICIAL_FALLBACKS.get(opp.id);
    if (curatedFallback && curatedFallback !== opp.url) {
      const fallbackCheck = await fetchPage(curatedFallback);
      if (fallbackCheck.ok || fallbackCheck.auditBlocked) {
        proposedChanges.push({
          id: opp.id,
          title: opp.title,
          old_link: opp.url || "",
          new_link: curatedFallback,
          action: "fixed",
          reason: fallbackCheck.auditBlocked ? `curated-official-fallback: ${fallbackCheck.reason}` : "curated-official-fallback",
        });
        return;
      }
    }

    const match = await searchOfficialUrl(opp);
    if (match) {
      proposedChanges.push({
        id: opp.id,
        title: opp.title,
        old_link: opp.url || "",
        new_link: match.url,
        action: "fixed",
        reason: `official-search-match: ${match.title || match.score}`,
      });
      return;
    }
    if (shouldBlankBrokenUrl(check)) {
      proposedChanges.push({
        id: opp.id,
        title: opp.title,
        old_link: opp.url || "",
        new_link: "",
        action: "cleared",
        reason: check.reason || "invalid-link-no-official-page-found",
      });
    }
  });

  const appliedChanges = APPLY ? await applyUrlChanges(proposedChanges) : [];
  const changeById = new Map((APPLY ? appliedChanges : proposedChanges).map((change) => [change.id, change]));
  const verifications = records.map(({ opp, check }) => ({
    id: opp.id,
    ...verificationFor(opp, check, changeById.get(opp.id)),
  }));

  if (APPLY) {
    await writeVerificationModule(verifications);
  }

  const manualReview = records
    .map(({ opp, check }) => ({
      id: opp.id,
      title: opp.title,
      org: opp.org,
      link: opp.url || "",
      status: check.status,
      reason: check.reason || (opp.link_quality === "generic_homepage" ? "generic-homepage" : opp.link_quality === "broken" ? "broken-link-quality" : "needs-manual-review"),
      link_quality: opp.link_quality || null,
      suggested_search_query: `${opp.title} ${opp.org} official ${opp.category} high school`,
    }))
    .filter((item) => {
      const verification = verifications.find((entry) => entry.id === item.id);
      return verification?.requiresReview;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  const changed = APPLY ? appliedChanges : proposedChanges;
  const report = {
    generated_at: new Date().toISOString(),
    applied: APPLY,
    totals: {
      opportunities: opportunities.length,
      unique_links_checked: byUrl.size,
      invalid_or_review_candidates: invalidRecords.length,
      links_changed: changed.length,
      verified: verifications.filter((item) => item.verified).length,
      requires_review: manualReview.length,
    },
    verification_counts: countBy(verifications, "verified"),
    changed,
    manual_review: manualReview,
  };

  const summary = [
    `Generated at: ${report.generated_at}`,
    `Apply mode: ${APPLY ? "yes" : "no"}`,
    `Opportunities scanned: ${report.totals.opportunities}`,
    `Unique links checked: ${report.totals.unique_links_checked}`,
    `Invalid/review candidates: ${report.totals.invalid_or_review_candidates}`,
    `Links changed: ${report.totals.links_changed}`,
    `Verified links: ${report.totals.verified}`,
    `Requires manual review: ${report.totals.requires_review}`,
    "",
    "Changed opportunities:",
    ...(changed.length
      ? changed.map((item) => `- ${item.action}: ${item.title} | ${item.old_link || "(blank)"} -> ${item.new_link || "(blank)"} | ${item.reason}`)
      : ["- None"]),
    "",
    "Manual review queue:",
    ...manualReview.slice(0, 80).map((item) => `- ${item.title} | ${item.link || "(blank)"} | ${item.reason} | search: ${item.suggested_search_query}`),
  ].join("\n");

  await writeFile(JSON_REPORT, JSON.stringify(report, null, 2));
  await writeFile(SUMMARY_REPORT, summary);
  console.log(summary);

  if (manualReview.some((item) => /^http-4|not-found|missing-link|invalid-url/i.test(item.reason))) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
