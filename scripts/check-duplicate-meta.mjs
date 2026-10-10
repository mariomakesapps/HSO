/**
 * Titles, descriptions and H1s across every indexable built page.
 *
 *   node scripts/check-duplicate-meta.mjs [distDir]
 *
 * Fails (exit 1) on a title or description used by two indexable pages, or an
 * indexable page without exactly one <h1>. Lengths outside the target (title
 * over 60 chars, description outside 70-155) are listed as warnings.
 */
import fs from "node:fs";
import path from "node:path";
import { builtPages, readHead, bodyOf } from "./lib-dist.mjs";

const distDir = path.resolve(process.argv[2] ?? "dist");
const titles = new Map();
const descriptions = new Map();
const errors = [];
const warnings = { longTitle: [], description: [] };
let indexable = 0;

for (const { route, file } of builtPages(distDir)) {
  const html = fs.readFileSync(file, "utf8");
  const head = readHead(html);
  if (/noindex/i.test(head.robots)) continue;
  indexable++;
  (titles.get(head.title) ?? titles.set(head.title, []).get(head.title)).push(route);
  (descriptions.get(head.description) ?? descriptions.set(head.description, []).get(head.description)).push(route);
  const h1 = (bodyOf(html).match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) errors.push(`${route}: ${h1} <h1> elements`);
  if (head.title.length > 60) warnings.longTitle.push(`${route} (${head.title.length}): ${head.title}`);
  if (head.description.length > 155 || head.description.length < 70) {
    warnings.description.push(`${route} (${head.description.length})`);
  }
}

for (const [t, routes] of titles) if (routes.length > 1) errors.push(`duplicate title on ${routes.length} pages "${t}": ${routes.slice(0, 5).join(", ")}`);
for (const [d, routes] of descriptions) if (routes.length > 1) errors.push(`duplicate description on ${routes.length} pages: ${routes.slice(0, 5).join(", ")}`);

console.log(`[duplicate-meta] ${indexable} indexable pages`);
console.log(`  titles over 60 chars: ${warnings.longTitle.length}`);
for (const w of warnings.longTitle.slice(0, 15)) console.log(`    ${w}`);
console.log(`  descriptions outside 70-155 chars: ${warnings.description.length}`);
for (const w of warnings.description.slice(0, 15)) console.log(`    ${w}`);
if (errors.length) {
  console.error(`  ERRORS (${errors.length}):\n    ${errors.slice(0, 40).join("\n    ")}`);
  process.exit(1);
}
console.log("  no duplicate titles or descriptions; every indexable page has exactly one <h1>.");
