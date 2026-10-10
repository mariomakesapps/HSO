/**
 * Catalogue quality report (report only: nothing is renamed, merged or removed).
 *
 *   node scripts/quality-report.mjs            -> reports/quality-report.md + reports/quality-scores.csv
 *
 * Sections:
 *  1. Quality scores (src/lib/quality.ts) against QUALITY_THRESHOLD, with every
 *     listing below it and why, grouped by description template.
 *  2. Likely duplicates: same official page (query string ignored) or same
 *     normalised title + organisation. Merging needs the owner's approval.
 *  3. Truncated slugs: ids cut off mid-word at the old 64-character limit.
 *     Renaming an indexed URL needs the owner's approval and a 301.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importBundle } from "./prerender.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const result = await build({
  stdin: {
    contents: `
      export { allOpportunities } from "@/data/opportunities";
      export { isOpportunityIndexable } from "@/lib/pageMeta";
      export { qualityScore, isBoilerplateBlurb, hasSharedLink } from "@/lib/quality";
      export { QUALITY_THRESHOLD, INDEX_ALLOWLIST } from "@/config/seo";
    `,
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  write: false,
  logLevel: "error",
  alias: { "@": path.join(root, "src") },
});
const m = await importBundle(result);

const rows = m.allOpportunities.map((o) => {
  const q = m.qualityScore(o);
  return { o, score: q.score, reasons: q.reasons, indexable: m.isOpportunityIndexable(o) };
});
const below = rows.filter((r) => r.score < m.QUALITY_THRESHOLD);

const histogram = new Map();
for (const r of rows) histogram.set(r.score, (histogram.get(r.score) ?? 0) + 1);

// Group the low scorers by what made them low, so the fix is obvious per family.
const families = new Map();
for (const r of below) {
  const key = r.o.id.startsWith("nyc-dycd-")
    ? "NYC DYCD after-school import (templated description, shared dataset link)"
    : m.isBoilerplateBlurb(r.o)
      ? `Shared description: "${r.o.blurb.slice(0, 70)}..."`
      : "Other";
  if (!families.has(key)) families.set(key, []);
  families.get(key).push(r);
}

// Duplicates.
const urlKey = (u) => u.split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
const norm = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
const byUrl = new Map();
const byName = new Map();
for (const o of m.allOpportunities) {
  if (o.id.startsWith("nyc-dycd-")) continue; // one dataset link by design; reported above
  const u = urlKey(o.url);
  if (!byUrl.has(u)) byUrl.set(u, []);
  byUrl.get(u).push(o);
  const n = `${norm(o.title)} | ${norm(o.org)}`;
  if (!byName.has(n)) byName.set(n, []);
  byName.get(n).push(o);
}
const dupName = [...byName.values()].filter((g) => g.length > 1);
// Same page for 2 listings is a likely duplicate; 3+ is usually a hub page several real programs share.
const dupUrl = [...byUrl.entries()].filter(([, g]) => g.length === 2);
const sharedUrl = [...byUrl.entries()].filter(([, g]) => g.length > 2);

// Truncated slugs: long ids whose last segment is not a whole word of the title/org.
const words = (s) => new Set(norm(s).split(" "));
const truncated = m.allOpportunities.filter((o) => {
  if (o.id.length < 60) return false;
  const last = o.id.split("-").at(-1);
  const w = words(`${o.title} ${o.org}`);
  return !w.has(last) && !/^\d+$/.test(last);
});

const link = (o) => `[\`${o.id}\`](https://highschoolopportunity.org/opportunities/${o.id})`;
const md = [];
md.push(`# Catalogue quality report`, ``, `Generated ${new Date().toISOString().slice(0, 10)} by \`scripts/quality-report.mjs\`. Report only: nothing was renamed, merged or removed.`, ``);
md.push(`## 1. Quality scores`, ``);
md.push(`Threshold (\`src/config/seo.ts\`): **${m.QUALITY_THRESHOLD}**. Below it a page is served \`noindex,follow\` and left out of the sitemap. It stays live and linked.`, ``);
md.push(`Allowlisted (indexed whatever the score): ${[...m.INDEX_ALLOWLIST].map((id) => `\`${id}\``).join(", ")}.`, ``);
md.push(`| Score | Listings |`, `|---|---|`);
for (const [s, n] of [...histogram].sort((a, b) => a[0] - b[0])) md.push(`| ${s} | ${n} |`);
md.push(``, `**${rows.length}** listings, **${below.length}** below the threshold, **${rows.filter((r) => r.indexable).length}** indexable after every gate.`, ``);
md.push(`### Below the threshold, by family`, ``);
md.push(`How to lift a family: give each listing its own description from its official page (the shared-description penalty is -4), and a link to its own page rather than a shared one.`, ``);
for (const [k, list] of [...families].sort((a, b) => b[1].length - a[1].length)) {
  md.push(`- **${k}** - ${list.length} listings. Example: ${link(list[0].o)} (score ${list[0].score}: ${list[0].reasons.join("; ")})`);
}
md.push(``, `## 2. Likely duplicates (needs your approval to merge)`, ``);
md.push(`### Same title and organisation (${dupName.length} groups)`, ``);
for (const g of dupName) md.push(`- ${g.map(link).join(", ")} - "${g[0].title}" / ${g[0].org}`);
md.push(``, `### Same official page, two listings (${dupUrl.length} pairs)`, ``);
for (const [u, g] of dupUrl) md.push(`- ${g.map(link).join(", ")} - ${u}`);
md.push(``, `### Official page shared by 3+ listings (${sharedUrl.length} pages; usually a hub page, not duplicates)`, ``);
for (const [u, g] of sharedUrl) md.push(`- ${u} - ${g.length} listings: ${g.slice(0, 6).map((o) => `\`${o.id}\``).join(", ")}${g.length > 6 ? ", ..." : ""}`);
md.push(``, `## 3. Truncated slugs (${truncated.length}) - not renamed`, ``);
md.push(`These ids were cut at the old length limit. They are live and may be indexed, so renaming needs your approval and a 301 from the old URL (\`src/data/removedOpportunities.ts\`).`, ``);
for (const o of truncated) md.push(`- ${link(o)} - ${o.title} (${o.org})`);

await fs.mkdir(path.join(root, "reports"), { recursive: true });
await fs.writeFile(path.join(root, "reports/quality-report.md"), md.join("\n") + "\n");
const csv = [
  "id,score,indexable,reasons",
  ...rows.map((r) => `${r.o.id},${r.score},${r.indexable},"${r.reasons.join("; ").replace(/"/g, '""')}"`),
];
await fs.writeFile(path.join(root, "reports/quality-scores.csv"), csv.join("\n") + "\n");
console.log(
  `[quality-report] ${rows.length} listings · ${below.length} below threshold ${m.QUALITY_THRESHOLD} · ${dupName.length} same-name groups · ${dupUrl.length} same-page pairs · ${truncated.length} truncated slugs -> reports/quality-report.md`,
);
