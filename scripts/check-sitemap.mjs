/**
 * Fails when the built sitemap lists a URL Google should not be sent to.
 *
 * Reads dist/sitemap.xml (an index) and every child sitemap, then checks each
 * URL against the built HTML file that would be served for it:
 *   - the file exists (the URL answers 200 with a real page),
 *   - its robots meta does not say noindex,
 *   - its canonical is exactly the sitemap URL (self-canonical),
 *   - it is listed once.
 *
 * Runs at the end of `npm run build` (vite.config.ts) and fails the build on any
 * problem. Standalone: `node scripts/check-sitemap.mjs [distDir]`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://highschoolopportunity.org";

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));

function fileFor(distDir, url) {
  const p = new URL(url).pathname.replace(/\/+$/, "");
  return p === "" ? path.join(distDir, "index.html") : path.join(distDir, decodeURIComponent(p), "index.html");
}

export async function checkSitemap({ distDir }) {
  const problems = [];
  const indexXml = await fs.readFile(path.join(distDir, "sitemap.xml"), "utf8");
  if (!indexXml.includes("<sitemapindex")) problems.push("sitemap.xml is not a sitemap index");

  const urls = [];
  for (const child of locs(indexXml)) {
    if (!child.startsWith(`${SITE_URL}/`)) {
      problems.push(`index lists a sitemap on another host: ${child}`);
      continue;
    }
    const file = path.join(distDir, new URL(child).pathname);
    let xml;
    try {
      xml = await fs.readFile(file, "utf8");
    } catch {
      problems.push(`index lists a child sitemap that was not built: ${child}`);
      continue;
    }
    const childUrls = locs(xml);
    if (childUrls.length > 50000) problems.push(`${child} has ${childUrls.length} URLs (limit 50,000)`);
    const missingLastmod = (xml.match(/<url>/g) ?? []).length - (xml.match(/<lastmod>/g) ?? []).length;
    if (missingLastmod > 0) console.warn(`[check-sitemap] ${child}: ${missingLastmod} URLs without <lastmod>`);
    urls.push(...childUrls);
  }

  const seen = new Set();
  for (const url of urls) {
    if (seen.has(url)) problems.push(`listed twice: ${url}`);
    seen.add(url);
    if (!url.startsWith(SITE_URL)) {
      problems.push(`not on ${SITE_URL}: ${url}`);
      continue;
    }
    let html;
    try {
      html = await fs.readFile(fileFor(distDir, url), "utf8");
    } catch {
      problems.push(`no built page (would not answer 200): ${url}`);
      continue;
    }
    const robots = html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/i)?.[1] ?? "";
    if (/noindex/i.test(robots)) problems.push(`noindex page in sitemap: ${url}`);
    const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/gi)].map((m) => m[1]);
    if (canonicals.length !== 1) problems.push(`${canonicals.length} canonical tags: ${url}`);
    else if (canonicals[0] !== url) problems.push(`canonical ${canonicals[0]} differs from sitemap URL ${url}`);
  }

  return { urls: urls.length, problems };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const distDir = path.resolve(process.argv[2] ?? "dist");
  const { urls, problems } = await checkSitemap({ distDir });
  if (problems.length) {
    console.error(`[check-sitemap] ${problems.length} problems in ${urls} URLs:\n  ${problems.slice(0, 50).join("\n  ")}`);
    process.exit(1);
  }
  console.log(`[check-sitemap] OK: ${urls} URLs, all built, indexable and self-canonical.`);
}
