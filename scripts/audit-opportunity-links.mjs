import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPORT_DIR = path.join(ROOT, "reports");
const BUNDLE_FILE = path.join(REPORT_DIR, "opportunities.bundle.mjs");
const JSON_REPORT = path.join(REPORT_DIR, "link-audit.json");
const SUMMARY_REPORT = path.join(REPORT_DIR, "link-audit-summary.txt");
const CONCURRENCY = 16;
const REQUEST_TIMEOUT_MS = 15000;
const BODY_SNIFF_BYTES = 90000;

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

function normalizeUrl(url) {
  try {
    return new URL(String(url).trim()).href;
  } catch {
    return null;
  }
}

function classifyUrl(url, count) {
  const reasons = [];
  if (!/^https?:\/\//i.test(url)) reasons.push("not-http-url");
  if (count > 20) reasons.push(`shared-by-${count}-entries`);
  if (/discoverdycd\.dycdconnect\.nyc\/program-public\/?$/i.test(url)) reasons.push("generic-dycd-finder");
  if (/nps\.gov\/[a-z0-9]+\/index\.htm$/i.test(url)) reasons.push("generic-nps-homepage");
  return reasons;
}

function isAuditBlocked(item) {
  return item.status === 403 || item.status === 429;
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; HSOOpportunityAudit/1.0; +https://localhost)",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
    });
    const snippet = response.status >= 200 && response.status < 400 ? await readSnippet(response) : "";
    if (!snippet) await response.body?.cancel();
    const softNotFound = response.status >= 200 && response.status < 400 ? detectSoftNotFound(snippet, response.url) : null;
    return {
      ok: response.status >= 200 && response.status < 400 && !softNotFound,
      status: response.status,
      finalUrl: response.url,
      softNotFound,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      finalUrl: null,
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
      // Ignore stream cancel errors from servers that already closed.
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

function detectSoftNotFound(snippet, finalUrl) {
  const title = stripTags(snippet.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const h1 = stripTags(snippet.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
  const h2 = stripTags(snippet.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "");
  const earlyText = stripTags(snippet.slice(0, 12000));
  const signal = `${title} ${h1} ${h2}`.trim();
  const broadSignal = `${signal} ${earlyText.slice(0, 1600)}`;

  if (/\/404(?:[/?#]|$)|\/not-found(?:[/?#]|$)/i.test(finalUrl)) return "not-found-url";
  if (/\b(404|page not found|not found|page unavailable|does not exist|can't find this page|cannot find this page|oops.*wrong|we couldn't find)\b/i.test(signal)) {
    return signal.slice(0, 180) || "not-found-title";
  }
  if (/\b(page not found|the page you requested could not be found|does not exist|can't find this page|cannot find this page)\b/i.test(broadSignal)) {
    return "not-found-copy";
  }
  return null;
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
  const invalid = [];

  for (const opportunity of opportunities) {
    const normalized = normalizeUrl(opportunity.url);
    if (!normalized) {
      invalid.push({
        id: opportunity.id,
        title: opportunity.title,
        url: opportunity.url,
        reason: "invalid-url",
      });
      continue;
    }

    if (!byUrl.has(normalized)) byUrl.set(normalized, []);
    byUrl.get(normalized).push({
      id: opportunity.id,
      title: opportunity.title,
      org: opportunity.org,
      category: opportunity.category,
    });
  }

  const urls = [...byUrl.keys()].sort();
  const checks = await mapLimit(urls, CONCURRENCY, async (url) => {
    const entries = byUrl.get(url);
    const result = await checkUrl(url);
    const suspicionReasons = classifyUrl(url, entries.length);
    return {
      url,
      count: entries.length,
      sampleEntries: entries.slice(0, 5),
      suspicionReasons,
      ...result,
    };
  });

  const failed = checks.filter((item) => !item.ok);
  const blocked = failed.filter(isAuditBlocked);
  const softNotFound = failed.filter((item) => item.softNotFound && !isAuditBlocked(item));
  const hardBroken = failed.filter((item) => !item.softNotFound && !isAuditBlocked(item));
  const suspicious = checks.filter((item) => item.suspicionReasons.length);
  const report = {
    generatedAt: new Date().toISOString(),
    totalOpportunities: opportunities.length,
    uniqueUrls: urls.length,
    invalidUrlCount: invalid.length,
    blockedByAuditCount: blocked.length,
    softNotFoundCount: softNotFound.length,
    hardBrokenCount: hardBroken.length,
    suspiciousUrlCount: suspicious.length,
    invalid,
    blocked,
    softNotFound,
    hardBroken,
    suspicious,
  };

  const summary = [
    `Generated at: ${report.generatedAt}`,
    `Opportunities: ${report.totalOpportunities}`,
    `Unique URLs: ${report.uniqueUrls}`,
    `Invalid URL strings: ${report.invalidUrlCount}`,
    `Hard broken URLs: ${report.hardBrokenCount}`,
    `Soft not-found pages: ${report.softNotFoundCount}`,
    `Bot-blocked/check-limited URLs: ${report.blockedByAuditCount}`,
    `Suspicious/generic repeated URLs: ${report.suspiciousUrlCount}`,
    "",
    "Top hard-broken examples:",
    ...hardBroken.slice(0, 25).map((item) => {
      const sample = item.sampleEntries[0];
      return `- ${item.status || item.error}: ${item.url} (${sample?.title || "unknown"})`;
    }),
    "",
    "Top soft not-found examples:",
    ...softNotFound.slice(0, 25).map((item) => {
      const sample = item.sampleEntries[0];
      return `- ${item.status} ${item.softNotFound}: ${item.url} (${sample?.title || "unknown"})`;
    }),
    "",
    "Top bot-blocked/check-limited examples:",
    ...blocked.slice(0, 25).map((item) => {
      const sample = item.sampleEntries[0];
      return `- ${item.status || item.error}: ${item.url} (${sample?.title || "unknown"})`;
    }),
    "",
    "Top suspicious examples:",
    ...suspicious.slice(0, 25).map((item) => {
      const sample = item.sampleEntries[0];
      return `- ${item.suspicionReasons.join(", ")}: ${item.url} (${sample?.title || "unknown"})`;
    }),
  ].join("\n");

  await writeFile(JSON_REPORT, JSON.stringify(report, null, 2));
  await writeFile(SUMMARY_REPORT, summary);

  console.log(summary);

  if (invalid.length || hardBroken.length || softNotFound.length || suspicious.length) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
