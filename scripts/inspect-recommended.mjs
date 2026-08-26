/**
 * Prints the top of the "Recommended" ordering so changes to the ranking can be
 * judged against what a student actually sees first.
 *
 *   node scripts/inspect-recommended.mjs [count]
 */
import { build } from "esbuild";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();
const n = Number(process.argv[2] ?? 25);

const result = await build({
  stdin: {
    contents: `
      export { allOpportunities } from "@/data/opportunities";
      export { applySort } from "@/lib/filterSort";
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

const { allOpportunities, applySort } = await importBundle(result);
const indexMap = new Map(allOpportunities.map((o, i) => [o.id, i]));
const ranked = applySort(allOpportunities, "recommended", indexMap);

console.log(`Top ${n} of ${ranked.length} by "Recommended":\n`);
ranked.slice(0, n).forEach((o, i) => {
  console.log(
    `${String(i + 1).padStart(3)}. [P${o.prestige}] ${o.category.padEnd(15)} ${o.title.slice(0, 52).padEnd(54)} ${o.location.slice(0, 26)}`,
  );
});

// How much of the visible first page is local-feed filler?
const local = ranked.slice(0, 50).filter((o) => /^(sf-our415|nyc)-/.test(o.id)).length;
console.log(`\nlocal-feed listings in the top 50: ${local}`);
const byCat = {};
for (const o of ranked.slice(0, 50)) byCat[o.category] = (byCat[o.category] ?? 0) + 1;
console.log("top-50 category mix:", byCat);
