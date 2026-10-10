#!/usr/bin/env node
/**
 * Orphan check: crawls the built site from / through the raw HTML (no
 * JavaScript, the way a crawler first sees it) and lists every sitemap URL that
 * no crawled page links to, or that cannot be reached from the homepage.
 *
 *   node scripts/check-orphans.mjs [distDir] [--strict]
 *
 * --strict exits 1 when anything is orphaned or unreachable.
 */
import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://highschoolopportunity.org";
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const distDir = path.resolve(args.find((a) => !a.startsWith("--")) ?? "dist");

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));

async function sitemapPaths() {
  const index = await fs.readFile(path.join(distDir, "sitemap.xml"), "utf8");
  const out = [];
  for (const child of locs(index)) {
    const xml = await fs.readFile(path.join(distDir, new URL(child).pathname), "utf8");
    out.push(...locs(xml).map((u) => new URL(u).pathname));
  }
  return out;
}

function normalise(href) {
  if (!href) return null;
  let u;
  try {
    u = new URL(href, `${SITE_URL}/`);
  } catch {
    return null;
  }
  if (u.origin !== SITE_URL) return null;
  const p = u.pathname.replace(/\/+$/, "") || "/";
  return p;
}

async function readPage(p) {
  const file = p === "/" ? path.join(distDir, "index.html") : path.join(distDir, decodeURIComponent(p), "index.html");
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

const inbound = new Map(); // path -> Set of linking pages
const reached = new Set(["/"]);
const queue = ["/"];

while (queue.length) {
  const from = queue.shift();
  const html = await readPage(from);
  if (!html) continue;
  // Links inside the page body only; <head> holds canonical/prev/next, not navigation.
  const body = html.slice(html.indexOf("<body"));
  for (const m of body.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const to = normalise(m[1].replace(/&amp;/g, "&"));
    if (!to || to === from) continue;
    if (!inbound.has(to)) inbound.set(to, new Set());
    inbound.get(to).add(from);
    if (!reached.has(to)) {
      reached.add(to);
      queue.push(to);
    }
  }
}

const inSitemap = await sitemapPaths();
const orphans = inSitemap.filter((p) => p !== "/" && !(inbound.get(p)?.size > 0));
const unreachable = inSitemap.filter((p) => !reached.has(p));
const thin = inSitemap.filter((p) => p !== "/" && (inbound.get(p)?.size ?? 0) === 1);

console.log(`[check-orphans] crawled ${reached.size} URLs from / · ${inSitemap.length} in the sitemap`);
console.log(`  sitemap URLs with no inbound internal link: ${orphans.length}`);
for (const p of orphans.slice(0, 100)) console.log(`    ${p}`);
console.log(`  sitemap URLs not reachable from /: ${unreachable.length}`);
for (const p of unreachable.filter((p) => !orphans.includes(p)).slice(0, 100)) console.log(`    ${p}`);
console.log(`  sitemap URLs linked from exactly one page: ${thin.length}`);

if (strict && (orphans.length || unreachable.length)) process.exit(1);
