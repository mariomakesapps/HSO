/**
 * Prints what the live catalog already covers, so new research targets real
 * gaps instead of re-adding listings that are already there.
 *
 *   node scripts/catalog-inventory.mjs            # category + state coverage
 *   node scripts/catalog-inventory.mjs Competition  # titles in one category
 */
import { build } from "esbuild";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();
const filterCategory = process.argv[2];

const result = await build({
  stdin: {
    contents: `export { allOpportunities, locationState } from "@/data/opportunities";`,
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

const { allOpportunities, locationState } = await importBundle(result);

if (filterCategory) {
  const rows = allOpportunities.filter((o) => o.category === filterCategory);
  console.log(`${filterCategory}: ${rows.length} listings\n`);
  for (const o of rows.sort((a, b) => a.title.localeCompare(b.title))) {
    console.log(`  ${o.title}  |  ${o.org}  |  ${o.location}  |  ${o.format}`);
  }
  process.exit(0);
}

const byCategory = {};
const byState = {};
const byFormat = {};
for (const o of allOpportunities) {
  byCategory[o.category] = (byCategory[o.category] ?? 0) + 1;
  byFormat[o.format] = (byFormat[o.format] ?? 0) + 1;
  const s = locationState(o.location);
  byState[s] = (byState[s] ?? 0) + 1;
}

console.log(`total live listings: ${allOpportunities.length}\n`);
console.log("by category:");
console.table(byCategory);
console.log("by format:");
console.table(byFormat);
console.log("by state bucket (top 30):");
const states = Object.entries(byState).sort((a, b) => b[1] - a[1]);
console.table(Object.fromEntries(states.slice(0, 30)));
console.log(`distinct state buckets represented: ${states.length}`);
