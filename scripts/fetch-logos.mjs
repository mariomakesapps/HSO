/**
 * Downloads each organization's own site icon into public/logos/ and writes
 * src/data/logos.generated.ts (domain -> file). Run once with internet access,
 * then commit both:
 *
 *   npm run logos:fetch              # fetch every domain not already saved
 *   npm run logos:fetch -- --all     # re-fetch everything
 *   npm run logos:fetch -- --limit 50
 *
 * Logos are served from this site, so students' browsers never call a third
 * party. A listing without a usable icon keeps its initials square.
 *
 * Skipped on purpose: links on shared hosts (Google Docs, Linktree, the NYC open
 * data portal, ...) and any domain used by 3+ different organizations, where the
 * icon would belong to the host rather than the program.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importBundle } from "./prerender.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(root, "public/logos");
const MANIFEST = path.join(root, "src/data/logos.generated.ts");
const args = process.argv.slice(2);
const ALL = args.includes("--all");
const LIMIT = Number(args[args.indexOf("--limit") + 1]) || Infinity;
const UA = "Mozilla/5.0 (compatible; HSO-logo-fetch/1.0; +https://highschoolopportunity.org/about)";

const SHARED_HOSTS = [
  "docs.google.com", "sites.google.com", "forms.gle", "google.com", "drive.google.com", "linktr.ee", "bit.ly",
  "airtable.com", "eventbrite.com", "facebook.com", "instagram.com", "twitter.com", "x.com", "linkedin.com",
  "youtube.com", "data.cityofnewyork.us", "our415.org", "wixsite.com", "squarespace.com", "github.io",
  "smapply.io", "submittable.com", "jotform.com", "typeform.com", "surveymonkey.com", "canva.site",
];

export const domainOf = (url) => {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
};
const isShared = (d) => SHARED_HOSTS.some((h) => d === h || d.endsWith(`.${h}`));

/** Icon candidates from a page's <link> tags, best first. Exported for tests. */
export function iconCandidates(html, baseUrl) {
  const out = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = tag.match(/\brel\s*=\s*["']?([^"'>]+)/i)?.[1]?.toLowerCase() ?? "";
    const href = tag.match(/\bhref\s*=\s*["']?([^"'\s>]+)/i)?.[1];
    if (!href || !/\bicon\b/.test(rel)) continue;
    const sizes = tag.match(/\bsizes\s*=\s*["']?(\d+)x\d+/i)?.[1];
    const svg = /\.svg(\?|$)/i.test(href) || /image\/svg/i.test(tag);
    const score = (rel.includes("apple-touch-icon") ? 1000 : 0) + (svg ? 900 : 0) + (sizes ? Math.min(Number(sizes), 512) : 16);
    try {
      out.push({ url: new URL(href, baseUrl).href, score });
    } catch {
      /* bad href */
    }
  }
  return out.sort((a, b) => b.score - a.score).map((c) => c.url);
}

/** Width of a PNG (IHDR) or the largest entry in an ICO; null when unknown. */
function iconWidth(buf, type) {
  if (type === "png" && buf.length > 24 && buf.readUInt32BE(12) === 0x49484452) return buf.readUInt32BE(16);
  if (type === "ico" && buf.length > 6 && buf.readUInt16LE(2) === 1) {
    let best = 0;
    for (let i = 0, n = buf.readUInt16LE(4); i < n && 6 + i * 16 < buf.length; i++) best = Math.max(best, buf[6 + i * 16] || 256);
    return best;
  }
  return null;
}

const TYPES = { "image/png": "png", "image/x-icon": "ico", "image/vnd.microsoft.icon": "ico", "image/svg+xml": "svg", "image/jpeg": "jpg", "image/webp": "webp" };

async function get(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { headers: { "user-agent": UA, accept: "*/*" }, redirect: "follow", signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function fetchIcon(domain) {
  let candidates = [];
  let base = `https://${domain}/`;
  try {
    const res = await get(base);
    if (res.ok && /html/i.test(res.headers.get("content-type") ?? "")) {
      base = res.url;
      candidates = iconCandidates((await res.text()).slice(0, 300_000), base);
    }
  } catch {
    /* homepage unreachable: still try the conventional paths */
  }
  candidates.push(new URL("/apple-touch-icon.png", base).href, new URL("/favicon.ico", base).href);

  for (const url of [...new Set(candidates)]) {
    try {
      const res = await get(url);
      if (!res.ok) continue;
      const ctype = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
      const type = TYPES[ctype] ?? (/\.ico(\?|$)/i.test(url) ? "ico" : /\.png(\?|$)/i.test(url) ? "png" : /\.svg(\?|$)/i.test(url) ? "svg" : null);
      if (!type) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100 || buf.length > 150_000) continue;
      if (type === "svg" && !/<svg[\s>]/i.test(buf.toString("utf8", 0, 2000))) continue;
      const w = iconWidth(buf, type);
      if (w !== null && w < 32) continue; // a 16px favicon looks worse than initials
      return { buf, type };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

async function main() {
  const bundle = await build({
    stdin: { contents: `export { allOpportunities } from "@/data/opportunities";`, resolveDir: root, loader: "ts" },
    bundle: true, format: "esm", platform: "node", target: "node18", write: false, logLevel: "error",
    alias: { "@": path.join(root, "src") },
  });
  const { allOpportunities } = await importBundle(bundle);

  const orgsByDomain = new Map();
  for (const o of allOpportunities) {
    const d = domainOf(o.url);
    if (!d) continue;
    (orgsByDomain.get(d) ?? orgsByDomain.set(d, new Set()).get(d)).add(o.org.toLowerCase().trim());
  }
  const domains = [...orgsByDomain].filter(([d, orgs]) => !isShared(d) && orgs.size < 3).map(([d]) => d).sort();

  const existing = ALL ? {} : await import(`${MANIFEST}?t=${Date.now()}`).then((m) => m.ORG_LOGOS).catch(() => ({}));
  const todo = domains.filter((d) => ALL || !existing[d]).slice(0, LIMIT);
  console.log(`[logos] ${domains.length} domains eligible, ${todo.length} to fetch`);

  await fs.mkdir(OUT_DIR, { recursive: true });
  const manifest = { ...existing };
  let ok = 0;
  let done = 0;
  const queue = [...todo];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let d = queue.shift(); d; d = queue.shift()) {
        const icon = await fetchIcon(d);
        if (icon) {
          const file = `${d.replace(/[^a-z0-9.-]/g, "_")}.${icon.type}`;
          await fs.writeFile(path.join(OUT_DIR, file), icon.buf);
          manifest[d] = `/logos/${file}`;
          ok++;
        }
        if (++done % 50 === 0) console.log(`[logos] ${done}/${todo.length} (${ok} saved)`);
      }
    }),
  );

  const body = Object.keys(manifest).sort().map((d) => `  ${JSON.stringify(d)}: ${JSON.stringify(manifest[d])},`).join("\n");
  await fs.writeFile(
    MANIFEST,
    `// Generated by scripts/fetch-logos.mjs (npm run logos:fetch). Do not edit by hand.\n// Organization website domain -> logo file served from /logos/.\nexport const ORG_LOGOS: Record<string, string> = {\n${body}\n};\n`,
  );
  console.log(`[logos] saved ${ok} new logos; ${Object.keys(manifest).length} in the manifest`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main();
