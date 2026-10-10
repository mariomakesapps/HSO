/**
 * Raw-HTML SEO audit.
 *
 * Fetches pages the way Googlebot's first pass does - plain HTTP, no JavaScript -
 * and reports what each one actually ships: status, title, description, robots,
 * canonical, H1 count, visible text length, internal links and JSON-LD types.
 *
 *   node scripts/seo-audit.mjs                       # serve ./dist locally and audit it
 *   node scripts/seo-audit.mjs --base https://highschoolopportunity.org   # audit the live site
 *   node scripts/seo-audit.mjs --sample 150 --out seo-audit.json --md seo-audit.md
 *
 * The URL list comes from the sitemap (following a sitemap index if there is one),
 * plus a fixed set of pages this audit always checks: the homepage, /about, every
 * hub page, and the import pages that already earn clicks. Opportunity pages are
 * sampled deterministically so two runs on the same build compare like for like.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://highschoolopportunity.org";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const BASE = flag("base", null);
const SAMPLE = Number(flag("sample", 120));
const OUT_JSON = flag("out", null);
const OUT_MD = flag("md", null);
const DIST = path.resolve(ROOT, flag("dist", "dist"));

/** Pages audited on every run, whether or not they are in the sitemap. */
const ALWAYS = [
  "/",
  "/about",
  "/deadlines",
  "/collections",
  "/remote",
  "/submit",
  "/volunteer",
  "/contact",
  "/nyc-programs-for-high-school-students",
  "/categories/competitions",
  "/categories/summer-programs",
  "/categories/internships",
  "/categories/scholarships",
  "/categories/research",
  "/categories/fellowships",
  "/guides/top-medical-internships",
  "/guides/top-research-competitions",
  "/guides/top-business-summer-programs",
  "/guides/high-school-law-internships",
  "/opportunities/regeneron-sts",
  "/opportunities/ccc-youthaction-nyc",
  "/opportunities/nyt-essay",
  "/opportunities/nyc-dycd-beacon-ms-210",
  "/opportunities/nyc-dycd-beacon-jhs-194",
  "/opportunities/nyc-dycd-out-of-school-time-port-richmond-hs-1",
  "/opportunities/sf-our415-2381-agapeland-summer-program",
  "/auth",
  "/this-page-does-not-exist",
  "/opportunities/this-listing-does-not-exist",
];

/* ---------------------------------------------------------------- local host */

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * Serves dist/ the way the production host does: exact file, then <path>/index.html,
 * then the _redirects rules (301s, the /opportunities/* 404, the SPA fallback).
 * Mirroring _redirects matters here - without it every unknown URL would look like
 * a 200 and the soft-404 check below would be meaningless.
 */
function startLocalHost() {
  const redirects = [];
  const rFile = path.join(DIST, "_redirects");
  if (fs.existsSync(rFile)) {
    for (const line of fs.readFileSync(rFile, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const [from, to, status] = t.split(/\s+/);
      redirects.push({ from, to, status: Number(status ?? 301) });
    }
  }
  const isFile = (p) => {
    try {
      return fs.statSync(p).isFile();
    } catch {
      return false;
    }
  };
  const matches = (pattern, p) =>
    pattern.endsWith("/*") ? p.startsWith(pattern.slice(0, -1)) : pattern === p;

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const rel = path.normalize(urlPath).replace(/^([/\\])+/, "");
    const exact = path.join(DIST, rel);
    const file = isFile(exact) ? exact : isFile(path.join(exact, "index.html")) ? path.join(exact, "index.html") : null;
    if (file) {
      res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
      return fs.createReadStream(file).pipe(res);
    }
    for (const r of redirects) {
      if (!matches(r.from, urlPath)) continue;
      if (r.status === 301 || r.status === 302) {
        res.writeHead(r.status, { location: r.to });
        return res.end();
      }
      const target = path.join(DIST, r.to.replace(/^\//, ""));
      if (isFile(target)) {
        res.writeHead(r.status, { "content-type": "text/html; charset=utf-8" });
        return fs.createReadStream(target).pipe(res);
      }
    }
    res.writeHead(404).end("not found");
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

/* ------------------------------------------------------------------ parsing */

const decode = (s) =>
  String(s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function analyse(html) {
  const head = html.slice(0, html.indexOf("</head>") + 1 || undefined);
  const title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim());
  const description = decode(head.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1]);
  const robots = head.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i)?.[1] ?? "(none)";
  const canonical = head.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1] ?? null;
  const ldTypes = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => {
    try {
      const j = JSON.parse(m[1]);
      return (Array.isArray(j) ? j : [j]).map((x) => x["@type"]);
    } catch {
      return ["(invalid JSON)"];
    }
  });
  const body = html.slice(html.indexOf("<body"));
  const h1Count = (body.match(/<h1[\s>]/gi) ?? []).length;
  const text = decode(
    body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  const hrefs = [...body.matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  const internal = hrefs.filter((h) => h.startsWith("/") || h.startsWith(SITE_URL));
  return {
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    robots,
    noindex: /noindex/i.test(robots),
    nofollow: /nofollow/i.test(robots),
    canonical,
    h1Count,
    textLength: text.length,
    internalLinks: internal.length,
    uniqueInternalLinks: new Set(internal).size,
    opportunityLinks: new Set(internal.filter((h) => h.includes("/opportunities/"))).size,
    jsonLdTypes: ldTypes,
  };
}

/* ---------------------------------------------------------------- fetching */

async function get(base, p) {
  const res = await fetch(base + p, { redirect: "manual", headers: { "user-agent": "hso-seo-audit" } });
  const text = res.status >= 300 && res.status < 400 ? "" : await res.text();
  return { status: res.status, location: res.headers.get("location"), text };
}

async function sitemapUrls(base) {
  const seen = new Set();
  const urls = [];
  const queue = ["/sitemap.xml"];
  const children = [];
  while (queue.length) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const { status, text } = await get(base, p);
    if (status !== 200) continue;
    const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const lastmods = [...text.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => /<lastmod>/.test(m[0]));
    if (/<sitemapindex/.test(text)) {
      for (const l of locs) {
        const child = l.replace(SITE_URL, "");
        children.push(child);
        queue.push(child);
      }
    } else {
      locs.forEach((l, i) => urls.push({ path: l.replace(SITE_URL, "") || "/", hasLastmod: lastmods[i] ?? false }));
    }
  }
  return { urls, children };
}

/** Deterministic sample: every non-opportunity URL, plus evenly spaced opportunities. */
function pickSample(all, n) {
  const opp = all.filter((p) => p.startsWith("/opportunities/"));
  const rest = all.filter((p) => !p.startsWith("/opportunities/"));
  const step = Math.max(1, Math.floor(opp.length / Math.max(1, n)));
  const sampled = opp.filter((_, i) => i % step === 0).slice(0, n);
  return [...new Set([...ALWAYS, ...rest, ...sampled])];
}

const typeOf = (p) =>
  p === "/"
    ? "home"
    : p.startsWith("/opportunities/")
      ? "opportunity"
      : p.startsWith("/categories/")
        ? "category"
        : p.startsWith("/guides/")
          ? "guide"
          : "page";

/* ------------------------------------------------------------------- main */

async function main() {
  let server = null;
  let base = BASE;
  if (!base) {
    if (!fs.existsSync(DIST)) throw new Error(`no build at ${DIST} - run vite build first`);
    server = await startLocalHost();
    base = `http://localhost:${server.address().port}`;
  }

  const { urls: smUrls, children } = await sitemapUrls(base);
  const smPaths = smUrls.map((u) => u.path);
  const sample = pickSample(smPaths, SAMPLE);

  const rows = [];
  for (const p of sample) {
    const r = await get(base, p);
    rows.push({ path: p, type: typeOf(p), status: r.status, location: r.location, inSitemap: smPaths.includes(p), ...(r.text ? analyse(r.text) : {}) });
  }
  if (server) server.close();

  // Summaries.
  const ok = rows.filter((r) => r.status === 200);
  const byType = {};
  for (const r of ok) {
    const t = (byType[r.type] ??= { pages: 0, textLength: 0, internalLinks: 0, opportunityLinks: 0, noindex: 0, multiH1: 0, noH1: 0 });
    t.pages++;
    t.textLength += r.textLength;
    t.internalLinks += r.uniqueInternalLinks;
    t.opportunityLinks += r.opportunityLinks;
    if (r.noindex) t.noindex++;
    if (r.h1Count > 1) t.multiH1++;
    if (r.h1Count === 0) t.noH1++;
  }
  for (const t of Object.values(byType)) {
    t.avgTextLength = Math.round(t.textLength / t.pages);
    t.avgInternalLinks = Math.round(t.internalLinks / t.pages);
    t.avgOpportunityLinks = Math.round(t.opportunityLinks / t.pages);
    delete t.textLength;
    delete t.internalLinks;
    delete t.opportunityLinks;
  }

  const titleCount = new Map();
  for (const r of ok) if (!r.noindex) titleCount.set(r.title, (titleCount.get(r.title) ?? 0) + 1);

  const issues = [];
  for (const r of rows) {
    const flagIssue = (msg) => issues.push(`${r.path}: ${msg}`);
    if (r.path.includes("does-not-exist")) {
      if (r.status !== 404) flagIssue(`unknown URL answered ${r.status}, expected 404`);
      continue;
    }
    if (r.status !== 200) {
      flagIssue(`status ${r.status}${r.location ? ` -> ${r.location}` : ""}`);
      continue;
    }
    if (r.inSitemap && r.noindex) flagIssue("in sitemap but noindex");
    if (r.inSitemap && r.canonical !== SITE_URL + (r.path === "/" ? "/" : r.path)) flagIssue(`in sitemap but canonical is ${r.canonical}`);
    if (r.noindex && r.nofollow && r.path !== "/auth") flagIssue("noindex,nofollow (should be noindex,follow)");
    if (!r.noindex && r.h1Count !== 1) flagIssue(`${r.h1Count} H1 elements`);
    if (!r.noindex && r.titleLength > 65) flagIssue(`title ${r.titleLength} chars`);
    if (!r.noindex && (r.descriptionLength < 70 || r.descriptionLength > 160)) flagIssue(`description ${r.descriptionLength} chars`);
    if (!r.noindex && (titleCount.get(r.title) ?? 0) > 1) flagIssue(`duplicate title "${r.title}"`);
  }

  const summary = {
    base: BASE ?? "local dist/",
    generatedAt: new Date().toISOString(),
    sitemap: {
      files: children.length ? children : ["/sitemap.xml"],
      urls: smPaths.length,
      withLastmod: smUrls.filter((u) => u.hasLastmod).length,
      opportunities: smPaths.filter((p) => p.startsWith("/opportunities/")).length,
    },
    audited: rows.length,
    byType,
    issueCount: issues.length,
  };

  const md = [
    `### SEO audit - ${summary.base} - ${summary.generatedAt.slice(0, 10)}`,
    "",
    `Sitemap: ${summary.sitemap.files.join(", ")} - ${summary.sitemap.urls} URLs (${summary.sitemap.opportunities} opportunities), ${summary.sitemap.withLastmod} with lastmod.`,
    `Audited ${rows.length} URLs.`,
    "",
    "| Page type | Pages | Avg text chars | Avg internal links | Avg opportunity links | noindex | >1 H1 | no H1 |",
    "|---|---|---|---|---|---|---|---|",
    ...Object.entries(byType).map(
      ([k, t]) => `| ${k} | ${t.pages} | ${t.avgTextLength} | ${t.avgInternalLinks} | ${t.avgOpportunityLinks} | ${t.noindex} | ${t.multiH1} | ${t.noH1} |`,
    ),
    "",
    "| URL | Status | Text | Opp links | H1 | Robots | JSON-LD | Title |",
    "|---|---|---|---|---|---|---|---|",
    ...rows
      .filter((r) => ALWAYS.includes(r.path))
      .map(
        (r) =>
          `| ${r.path} | ${r.status} | ${r.textLength ?? ""} | ${r.opportunityLinks ?? ""} | ${r.h1Count ?? ""} | ${r.robots ?? ""} | ${(r.jsonLdTypes ?? []).join(", ")} | ${(r.title ?? "").replace(/\|/g, "\\|")} |`,
      ),
    "",
    `Issues (${issues.length}):`,
    ...issues.slice(0, 60).map((i) => `- ${i}`),
    ...(issues.length > 60 ? [`- ... and ${issues.length - 60} more`] : []),
  ].join("\n");

  if (OUT_JSON) fs.writeFileSync(OUT_JSON, JSON.stringify({ summary, rows, issues }, null, 2));
  if (OUT_MD) fs.writeFileSync(OUT_MD, md + "\n");
  console.log(md);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
