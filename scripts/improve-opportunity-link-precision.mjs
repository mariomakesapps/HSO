import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPORT_DIR = path.join(ROOT, "reports");
const BUNDLE_FILE = path.join(REPORT_DIR, "opportunities.link-precision.bundle.mjs");
const JSON_REPORT = path.join(REPORT_DIR, "link-precision-report.json");
const SUMMARY_REPORT = path.join(REPORT_DIR, "link-precision-summary.txt");
const PRECISION_MODULE = path.join(ROOT, "src/data/linkPrecision.generated.ts");
const APPLY = process.argv.includes("--apply");
const ALLOW_LIVE_RESEARCH = process.argv.includes("--research");

const REQUEST_TIMEOUT_MS = 11000;
const BODY_SNIFF_BYTES = 120000;
const FETCH_CONCURRENCY = 18;
const RESEARCH_CONCURRENCY = 8;

const PRECISION = {
  directApplication: "direct_application_page",
  exactProgram: "exact_program_page",
  broadDirectory: "broad_directory",
  genericHomepage: "generic_homepage",
};

const EDITABLE_DATA_FILES = [
  "src/data/opportunities.ts",
  "src/data/stateOpportunities.ts",
  "src/data/additionalUsOpportunities.ts",
  "src/data/generatedBulkOpportunities.ts",
];

const STRONG_PATH_TERMS = /(apply|application|admission|admissions|internship|internships|program|programs|opportunity|opportunities|volunteer-opportun|individual-volunteer|research|students?|teens?|youth|summer|scholarship|competition|contest|fellowship|precollege|pre-college|work-with-us)/i;
const APPLICATION_PATH_TERMS = /(apply|application|applications|admission|admissions|how-to-apply|signup|sign-up|register|registration|student-registration|applicant|portal)/i;
const BROAD_PATH_PATTERNS = [
  /\/getinvolved\/volunteer\.htm$/i,
  /\/high-school-programs\/?$/i,
  /\/get-involved\/?$/i,
  /\/volunteer\/?$/i,
  /\/programs\/?$/i,
  /\/our-programs\/?$/i,
  /\/student-programs\/?$/i,
  /\/youth-programs\/?$/i,
  /\/precollege\/?$/i,
  /\/pre-college\/?$/i,
  /\/education\/?$/i,
  /\/students\/?$/i,
  /\/careers\/?$/i,
  /\/workwithus\.htm$/i,
  /\/about\/?$/i,
  /\/index\.(html?|php)$/i,
];

const REJECT_CANDIDATE_PATH = /(login|auth|oauth|wp-login|sponsor|faculty|staff|people|about|news|blog|calendar|results?|history|financials|roster|archive|category\/news|student-life\/enrolled|md-admissions|research-postgraduate|college-student|higher-education|international-applicants|personaltours|middle-school|financial-aid|tuition|from-momentum|scholarships?\/?$)/i;
const REJECT_CANDIDATE_FILE = /\.(?:jpe?g|png|gif|webp|svg|pdf|docx?|xlsx?)(?:[?#].*)?$/i;

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

// Conservative, human-reviewed precision upgrades. These are exact official program,
// application, or how-to-apply pages and avoid broad landing pages.
const CURATED_PRECISE_REPLACEMENTS = [
  ["bu-summer", "https://www.bu.edu/summer/high-school-programs/", "https://www.bu.edu/summer/high-school-programs/summer-challenge/how-to-apply/", "BU Summer Challenge how-to-apply page"],
  ["congressional-app", "https://www.congressionalappchallenge.us", "https://www.congressionalappchallenge.us/students/student-registration/", "student registration page"],
  ["usra", "https://heliophysics.ucar.edu/summer-school", "https://heliophysics.ucar.edu/summer-school/how-to-apply", "how-to-apply page"],
  ["yyas-online", "https://africanscholars.yale.edu", "https://africanscholars.yale.edu/admissions/how-apply", "YYAS how-to-apply page"],
  ["idealab", "https://precollege.risd.edu", "https://precollege.risd.edu/on-campus/application-information", "RISD Pre-College application information page"],
  ["cuny-hires", "https://crest.cuny.edu/hires/", "https://crest.cuny.edu/hires/research-training/", "HIRES research training page"],
  ["state-kentucky-gsp", "https://gsp.ky.gov/Pages/index.aspx", "https://gsp.ky.gov/applicants/Pages/Application-Selection-Process.aspx", "GSP application and selection page"],
  ["state-mississippi-governors-school", "https://www.muw.edu/education/govschool/", "https://www.muw.edu/education/govschool/application/", "Mississippi Governor's School application page"],
  ["state-nebraska-yns", "https://yns.nebraska.edu/", "https://yns.nebraska.edu/gain-hands-on-experience-in-stem/high-school-research", "Young Nebraska Scientists high school research page"],
  ["cfar", "https://cosmos-ucop.ucdavis.edu/app/main", "https://cosmos-ucop.ucdavis.edu/app/main/page/program-overview", "UC COSMOS program overview page"],
  ["uci-cosmos", "https://cosmos-ucop.ucdavis.edu/app/main", "https://cosmos-ucop.ucdavis.edu/app/main/page/program-overview", "UC COSMOS program overview page"],
  ["state-california-cosmos", "https://cosmos-ucop.ucdavis.edu/app/main", "https://cosmos-ucop.ucdavis.edu/app/main/page/program-overview", "UC COSMOS program overview page"],
];

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

function safeUrl(value, base = undefined) {
  if (isMissingLink(value)) return null;
  try {
    const url = new URL(String(value).trim(), base);
    if (!/^https?:$/i.test(url.protocol)) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function urlParts(value) {
  const url = safeUrl(value);
  if (!url) return null;
  const parsed = new URL(url);
  const pathParts = parsed.pathname.split("/").filter(Boolean);
  return {
    href: parsed.href,
    host: parsed.hostname.replace(/^www\./, "").toLowerCase(),
    pathname: parsed.pathname,
    pathParts,
    shallow: pathParts.length <= 1,
    broad: pathParts.length <= 1 || BROAD_PATH_PATTERNS.some((pattern) => pattern.test(parsed.pathname)),
  };
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&amp;/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    "opportunities",
    "opportunity",
    "program",
    "programme",
    "school",
    "student",
    "students",
    "summer",
    "the",
    "university",
    "volunteer",
    "youth",
  ]);
  return [...normalize(value).matchAll(/[a-z0-9]{3,}/g)]
    .map((match) => match[0])
    .filter((word) => !stop.has(word));
}

function specificTitleTokens(value) {
  const generic = new Set([
    "academy",
    "challenge",
    "college",
    "competition",
    "education",
    "engineering",
    "foundation",
    "global",
    "high",
    "internship",
    "leadership",
    "math",
    "mathematics",
    "national",
    "opportunities",
    "opportunity",
    "program",
    "programs",
    "research",
    "scholar",
    "scholars",
    "scholarship",
    "school",
    "science",
    "student",
    "students",
    "summer",
    "university",
    "volunteer",
    "youth",
  ]);
  return tokenize(value).filter((token) => !generic.has(token));
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
      // Some servers close early.
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
  const normalized = safeUrl(url);
  if (!normalized) {
    return { ok: false, status: null, finalUrl: null, snippet: "", title: "", error: "invalid-url" };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(normalized, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; HSOLinkPrecision/1.0; +https://localhost)",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
    });
    const snippet = response.status >= 200 && response.status < 400 ? await readSnippet(response) : "";
    if (!snippet) await response.body?.cancel?.();
    return {
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: response.url,
      snippet,
      title: pageTitle(snippet),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      finalUrl: null,
      snippet: "",
      title: "",
      error: error?.name === "AbortError" ? "timeout" : String(error?.message || error),
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

function titleAndContentHits(opp, check, url) {
  const titleTokens = tokenize(opp.title);
  const orgTokens = tokenize(opp.org);
  const titleText = normalize(check.title);
  const fullText = normalize(`${url} ${check.title} ${stripTags(check.snippet).slice(0, 9000)}`);
  return {
    titleTokens,
    orgTokens,
    titleHits: titleTokens.filter((token) => fullText.includes(token)),
    titleInPageTitle: titleTokens.filter((token) => titleText.includes(token)),
    orgHits: orgTokens.filter((token) => fullText.includes(token)),
  };
}

function scorePrecision(opp, url, check) {
  const parts = urlParts(url);
  if (!parts || !url) {
    return {
      link_precision: PRECISION.genericHomepage,
      link_precision_score: 0,
      reasons: ["missing-or-invalid-url"],
      title_hits: [],
      org_hits: [],
    };
  }

  const hits = titleAndContentHits(opp, check, url);
  const pathSpecific = STRONG_PATH_TERMS.test(parts.pathname);
  const officialDirectoryServicePage =
    parts.host === "our415.org" &&
    /^\/services\/\d+\/?$/i.test(parts.pathname);
  const officialDatasetRowPage =
    parts.host === "data.cityofnewyork.us" &&
    /row_id=/i.test(new URL(parts.href).search);
  const samePageWorks = check.ok || check.status === 403 || check.status === 429 || check.error === "timeout";
  let score = 0;
  const reasons = [];

  if (officialDirectoryServicePage) {
    return {
      link_precision: PRECISION.exactProgram,
      link_precision_score: 82,
      reasons: ["official-directory-service-page"],
      title_hits: hits.titleHits,
      org_hits: hits.orgHits,
    };
  }

  if (officialDatasetRowPage) {
    return {
      link_precision: PRECISION.exactProgram,
      link_precision_score: 78,
      reasons: ["official-dataset-row-page"],
      title_hits: hits.titleHits,
      org_hits: hits.orgHits,
    };
  }

  if (!samePageWorks) {
    score -= 35;
    reasons.push(check.status ? `http-${check.status}` : check.error || "fetch-failed");
  }
  if (parts.shallow) {
    score -= 22;
    reasons.push("shallow-url-path");
  }
  if (parts.broad) {
    score -= 18;
    reasons.push("broad-url-path");
  }
  if (pathSpecific) score += 24;
  if (parts.pathParts.length >= 3) score += 16;
  else if (parts.pathParts.length === 2) score += 8;
  if (/\.(edu|gov)$/i.test(parts.host) || parts.host.includes(".edu.") || parts.host.includes(".gov.")) score += 8;
  if (hits.titleInPageTitle.length >= 2) score += 34;
  else if (hits.titleInPageTitle.length === 1) score += 18;
  if (hits.titleHits.length >= 2) score += 24;
  else if (hits.titleHits.length === 1) score += 12;
  if (hits.orgHits.length >= 1) score += 10;

  if (/\/getinvolved\/volunteer\.htm$/i.test(parts.pathname)) {
    score -= 18;
    reasons.push("park-volunteer-page-not-listing");
  }
  if (hits.titleHits.length === 0 && hits.orgHits.length === 0) {
    score -= 16;
    reasons.push("low-title-org-match");
  }

  const applicationSpecific = APPLICATION_PATH_TERMS.test(parts.pathname);
  const hasMeaningfulMatch = hits.titleHits.length >= 1 || hits.orgHits.length >= 1;
  let link_precision = parts.shallow ? PRECISION.genericHomepage : PRECISION.broadDirectory;

  if (parts.broad) {
    link_precision = parts.shallow ? PRECISION.genericHomepage : PRECISION.broadDirectory;
  } else if (score >= 72 && pathSpecific && hasMeaningfulMatch) {
    link_precision = applicationSpecific
      ? PRECISION.directApplication
      : PRECISION.exactProgram;
  } else if (score >= 54 && pathSpecific && hits.titleHits.length >= 1) {
    link_precision = PRECISION.exactProgram;
  } else if (score >= 28) {
    link_precision = PRECISION.broadDirectory;
  }

  return {
    link_precision,
    link_precision_score: Math.max(0, Math.min(100, score)),
    reasons,
    title_hits: hits.titleHits,
    org_hits: hits.orgHits,
  };
}

function precisionRank(value) {
  return {
    generic_homepage: 0,
    broad_directory: 1,
    exact_program_page: 2,
    direct_application_page: 3,
  }[value] ?? 0;
}

function parseLinks(html, baseUrl) {
  const links = [];
  const seen = new Set();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = safeUrl(match[1].replace(/&amp;/g, "&"), baseUrl);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    links.push({ url: href, text: stripTags(match[2]) });
  }
  return links;
}

function sameOfficialHost(a, b) {
  const left = urlParts(a);
  const right = urlParts(b);
  if (!left || !right) return false;
  return left.host === right.host;
}

function sameDomainCandidates(opp, currentUrl, check) {
  const parts = urlParts(currentUrl);
  if (!parts) return [];
  const candidates = new Map();

  for (const link of parseLinks(check.snippet, check.finalUrl || currentUrl)) {
    if (!sameOfficialHost(currentUrl, link.url)) continue;
    const candidateParts = urlParts(link.url);
    if (!candidateParts) continue;
    const candidateText = normalize(`${link.url} ${link.text}`);
    const titleHits = tokenize(opp.title).filter((token) => candidateText.includes(token)).length;
    const orgHits = tokenize(opp.org).filter((token) => candidateText.includes(token)).length;
    if (STRONG_PATH_TERMS.test(candidateParts.pathname) || titleHits || orgHits) {
      candidates.set(link.url, link.url);
    }
  }

  const npsMatch = parts.host.endsWith("nps.gov") && parts.pathname.match(/^\/([a-z0-9]{4})\/getinvolved\/volunteer\.htm$/i);
  if (npsMatch) {
    const code = npsMatch[1].toLowerCase();
    [
      `https://www.nps.gov/${code}/getinvolved/supportyourpark/individual-volunteer-opportunities.htm`,
      `https://www.nps.gov/${code}/getinvolved/volunteer-opportunities.htm`,
      `https://www.nps.gov/${code}/getinvolved/supportyourpark/volunteer.htm`,
      `https://www.nps.gov/${code}/getinvolved/workwithus.htm`,
      `https://www.nps.gov/${code}/getinvolved/youth-programs.htm`,
    ].forEach((url) => candidates.set(url, url));
  }

  return [...candidates.keys()].filter((url) => url !== currentUrl).slice(0, 10);
}

function parseSearchLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    let href = match[1].replace(/&amp;/g, "&");
    if (href.includes("duckduckgo.com/l/?")) {
      const wrapped = new URL(href, "https://duckduckgo.com");
      href = wrapped.searchParams.get("uddg") || href;
    }
    const normalized = safeUrl(href);
    if (!normalized) continue;
    const parsed = new URL(normalized);
    if (SEARCH_BLOCKLIST.some((domain) => parsed.hostname.includes(domain))) continue;
    links.add(normalized);
  }
  return [...links];
}

async function searchSameDomain(opp, currentUrl) {
  const parts = urlParts(currentUrl);
  if (!parts) return [];
  const query = `site:${parts.host} "${opp.title}" ${opp.org} apply OR program OR internship OR volunteer`;
  const search = await fetchPage(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  if (!search.ok && !search.snippet) return [];
  return parseSearchLinks(search.snippet)
    .filter((url) => sameOfficialHost(currentUrl, url))
    .slice(0, 8);
}

async function researchBetterLink(opp, currentUrl, currentCheck, currentPrecision, fetchCache) {
  const candidates = [
    ...sameDomainCandidates(opp, currentUrl, currentCheck),
    ...(precisionRank(currentPrecision.link_precision) < precisionRank(PRECISION.exactProgram) ? await searchSameDomain(opp, currentUrl) : []),
  ];
  const uniqueCandidates = [...new Set(candidates)].slice(0, 14);
  const evaluated = [];

  await mapLimit(uniqueCandidates, 5, async (candidateUrl) => {
    if (!fetchCache.has(candidateUrl)) fetchCache.set(candidateUrl, await fetchPage(candidateUrl));
    const check = fetchCache.get(candidateUrl);
    if (!check.ok && check.status !== 403 && check.status !== 429) return;
    const precision = scorePrecision(opp, check.finalUrl || candidateUrl, check);
    if (!isSafePrecisionUpgrade(opp, currentPrecision, check.finalUrl || candidateUrl, check, precision)) return;
    if (precisionRank(precision.link_precision) > precisionRank(currentPrecision.link_precision)) {
      evaluated.push({
        url: check.finalUrl || candidateUrl,
        precision,
        page_title: check.title,
      });
    }
  });

  evaluated.sort((a, b) => {
    const rankDiff = precisionRank(b.precision.link_precision) - precisionRank(a.precision.link_precision);
    if (rankDiff) return rankDiff;
    return b.precision.link_precision_score - a.precision.link_precision_score;
  });
  return evaluated[0] || null;
}

function isSafePrecisionUpgrade(opp, currentPrecision, candidateUrl, check, candidatePrecision) {
  const parts = urlParts(candidateUrl);
  if (!parts) return false;
  if (REJECT_CANDIDATE_PATH.test(parts.pathname)) return false;
  if (REJECT_CANDIDATE_FILE.test(parts.pathname)) return false;
  if (!STRONG_PATH_TERMS.test(parts.pathname)) return false;
  if (precisionRank(candidatePrecision.link_precision) < precisionRank(PRECISION.exactProgram)) return false;
  if (candidatePrecision.link_precision_score < currentPrecision.link_precision_score + 10) return false;

  const candidateSignal = normalize(`${parts.pathname} ${check.title}`);
  const specific = specificTitleTokens(opp.title);
  const specificHits = specific.filter((token) => candidateSignal.includes(token));

  // Single-token brand names are too easy to misroute on a large official site.
  // Keep those in the review queue unless a human-curated replacement exists.
  if (specific.length <= 1) {
    return false;
  }

  if (specificHits.length < Math.min(2, specific.length)) {
    return false;
  }

  return true;
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
            .replace(/(\burl\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(change.new_url)}$3`)
            .replace(/("url"\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(change.new_url)}$3`);
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
      await writeFile(file, lines.join("\n"), "utf8");
    }
  }
  return applied;
}

async function applyCuratedPreciseReplacements() {
  const replacements = new Map(CURATED_PRECISE_REPLACEMENTS.map(([id, oldUrl, newUrl, reason]) => [id, { oldUrl, newUrl, reason }]));
  const applied = [];

  for (const relativeFile of EDITABLE_DATA_FILES) {
    const file = path.join(ROOT, relativeFile);
    let content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    let changed = false;

    for (const [id, replacement] of replacements.entries()) {
      if (applied.some((item) => item.id === id)) continue;
      const idPattern = new RegExp(`["']id["']?\\s*:\\s*["']${escapeRegExp(id)}["']|\\bid\\s*:\\s*["']${escapeRegExp(id)}["']`);
      const idLine = lines.findIndex((line) => idPattern.test(line));
      if (idLine === -1) continue;

      for (let i = idLine; i < Math.min(lines.length, idLine + 90); i += 1) {
        if (!/(?:\burl\s*:|"url"\s*:)\s*"/.test(lines[i])) continue;
        const current =
          lines[i].match(/\burl\s*:\s*"([^"]*)"/)?.[1] ||
          lines[i].match(/"url"\s*:\s*"([^"]*)"/)?.[1] ||
          "";
        if (current === replacement.newUrl) {
          applied.push({
            id,
            title: id,
            old_url: replacement.oldUrl,
            new_url: replacement.newUrl,
            old_precision: "unknown",
            new_precision: APPLICATION_PATH_TERMS.test(replacement.newUrl) ? PRECISION.directApplication : PRECISION.exactProgram,
            old_score: null,
            new_score: null,
            status: "already_applied",
            reason: replacement.reason,
          });
          break;
        }
        if (current !== replacement.oldUrl) break;
        const nextLine = lines[i]
          .replace(/(\burl\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(replacement.newUrl)}$3`)
          .replace(/("url"\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(replacement.newUrl)}$3`);
        if (nextLine !== lines[i]) {
          lines[i] = nextLine;
          changed = true;
          applied.push({
            id,
            title: id,
            old_url: current,
            new_url: replacement.newUrl,
            old_precision: "unknown",
            new_precision: APPLICATION_PATH_TERMS.test(replacement.newUrl) ? PRECISION.directApplication : PRECISION.exactProgram,
            old_score: null,
            new_score: null,
            status: APPLY ? "applied" : "would_apply",
            reason: replacement.reason,
          });
        }
        break;
      }
    }

    if (APPLY && changed) {
      await writeFile(file, lines.join("\n"), "utf8");
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

async function writePrecisionModule(audits) {
  const rows = Object.fromEntries(
    audits
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((item) => [
        item.id,
        {
          link_precision: item.link_precision,
          link_precision_score: item.link_precision_score,
        },
      ]),
  );
  const content = [
    "// Generated by scripts/improve-opportunity-link-precision.mjs. Do not edit by hand.",
    "",
    'export const opportunityLinkPrecision: Record<string, { link_precision: "direct_application_page" | "exact_program_page" | "broad_directory" | "generic_homepage"; link_precision_score: number }> = ',
    `${JSON.stringify(rows, null, 2)} as const;`,
    "",
  ].join("\n");
  await writeFile(PRECISION_MODULE, content, "utf8");
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

async function main() {
  await mkdir(REPORT_DIR, { recursive: true });
  const curatedChanges = await applyCuratedPreciseReplacements();
  const opportunities = await loadOpportunities();
  const fetchCache = new Map();
  const uniqueUrls = [...new Set(opportunities.map((opp) => opp.url).filter(Boolean))];

  await mapLimit(uniqueUrls, FETCH_CONCURRENCY, async (url) => {
    fetchCache.set(url, await fetchPage(url));
  });

  const initialAudits = opportunities.map((opp) => {
    const check = fetchCache.get(opp.url) || { ok: false, status: null, finalUrl: null, snippet: "", title: "", error: "missing-link" };
    const precision = scorePrecision(opp, check.finalUrl || opp.url, check);
    return {
      id: opp.id,
      title: opp.title,
      org: opp.org,
      category: opp.category,
      old_url: opp.url,
      page_title: check.title,
      status: check.status,
      ...precision,
    };
  });

  const researchTargets = initialAudits
    .filter((item) => item.old_url && precisionRank(item.link_precision) < precisionRank(PRECISION.exactProgram))
    .sort((a, b) => a.link_precision_score - b.link_precision_score || a.title.localeCompare(b.title));

  const improvements = [];
  if (ALLOW_LIVE_RESEARCH) {
    await mapLimit(researchTargets.slice(0, 250), RESEARCH_CONCURRENCY, async (audit) => {
      const opp = opportunities.find((item) => item.id === audit.id);
      const check = fetchCache.get(opp.url) || { ok: false, status: null, finalUrl: null, snippet: "", title: "", error: "missing-link" };
      const better = await researchBetterLink(opp, opp.url, check, audit, fetchCache);
      if (better && better.url !== opp.url) {
        improvements.push({
          id: opp.id,
          title: opp.title,
          old_url: opp.url,
          new_url: better.url,
          old_precision: audit.link_precision,
          new_precision: better.precision.link_precision,
          old_score: audit.link_precision_score,
          new_score: better.precision.link_precision_score,
          page_title: better.page_title,
        });
      }
    });
  }

  const applied = APPLY ? await applyUrlChanges(improvements) : [];
  const finalOpportunities = APPLY && applied.length ? await loadOpportunities() : opportunities;
  const finalAudits = finalOpportunities.map((opp) => {
    const check = fetchCache.get(opp.url) || { ok: false, status: null, finalUrl: null, snippet: "", title: "", error: "missing-link" };
    const precision = scorePrecision(opp, check.finalUrl || opp.url, check);
    return {
      id: opp.id,
      title: opp.title,
      org: opp.org,
      category: opp.category,
      url: opp.url,
      page_title: check.title,
      status: check.status,
      ...precision,
      needs_manual_review:
        precisionRank(precision.link_precision) < precisionRank(PRECISION.exactProgram) ||
        precision.reasons.includes("low-title-org-match"),
      suggested_search_query: `${opp.title} ${opp.org} official ${opp.category} exact application program`,
    };
  });

  if (APPLY) {
    await writePrecisionModule(finalAudits);
  }

  const changed = [...curatedChanges, ...(APPLY ? applied : improvements)];
  const manualReview = finalAudits
    .filter((item) => item.needs_manual_review)
    .sort((a, b) => a.link_precision_score - b.link_precision_score || a.title.localeCompare(b.title));

  const report = {
    generated_at: new Date().toISOString(),
    applied: APPLY,
    totals: {
      opportunities: finalOpportunities.length,
      unique_urls: uniqueUrls.length,
      research_targets: researchTargets.length,
      live_research_enabled: ALLOW_LIVE_RESEARCH,
      opportunities_improved: changed.length,
      manual_review: manualReview.length,
    },
    precision_counts: countBy(finalAudits, "link_precision"),
    improved: changed,
    manual_review: manualReview,
  };

  const summary = [
    `Generated at: ${report.generated_at}`,
    `Apply mode: ${APPLY ? "yes" : "no"}`,
    `Opportunities scanned: ${report.totals.opportunities}`,
    `Unique URLs scanned: ${report.totals.unique_urls}`,
    `Precision research targets: ${report.totals.research_targets}`,
    `Live same-domain research: ${ALLOW_LIVE_RESEARCH ? "yes" : "no"}`,
    `Opportunities improved: ${report.totals.opportunities_improved}`,
    `Manual review remaining: ${report.totals.manual_review}`,
    `Precision counts: ${Object.entries(report.precision_counts).map(([precision, count]) => `${precision}=${count}`).join(", ")}`,
    "",
    "Opportunities improved:",
    ...(changed.length
      ? changed.map((item) => `- ${item.title} | ${item.old_url} -> ${item.new_url} | ${item.old_precision} -> ${item.new_precision} (${item.old_score} -> ${item.new_score})`)
      : ["- None"]),
    "",
    "Manual review queue:",
    ...manualReview.slice(0, 120).map((item) => `- ${item.link_precision} ${item.link_precision_score}: ${item.title} | ${item.url || "(blank)"} | ${item.reasons.join(", ")} | search: ${item.suggested_search_query}`),
  ].join("\n");

  await writeFile(JSON_REPORT, JSON.stringify(report, null, 2));
  await writeFile(SUMMARY_REPORT, summary, "utf8");
  console.log(summary);

  if (manualReview.length) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
