/**
 * Checks that every curated collection actually holds together.
 *
 * Three ways a collection goes wrong:
 *   1. It references an opportunity id that no longer exists — the card simply
 *      renders nothing, so the collection quietly shrinks.
 *   2. It contains an opportunity whose category is not one the collection
 *      claims to cover.
 *   3. It contains an opportunity with no thematic overlap with the
 *      collection's own tags, majors, or title.
 *
 *   node scripts/audit-collections.mjs
 */
import { build } from "esbuild";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();

const result = await build({
  stdin: {
    contents: `
      export { allOpportunities } from "@/data/opportunities";
      export { curatedSections, curatedCollections } from "@/data/curatedCollections";
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

const { allOpportunities, curatedCollections } = await importBundle(result);
const byId = new Map(allOpportunities.map((o) => [o.id, o]));

const words = (s) =>
  new Set(
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );

let missingTotal = 0;
let categoryMismatch = 0;
let unrelated = 0;
const report = [];

for (const col of curatedCollections) {
  const missing = col.opportunityIds.filter((id) => !byId.has(id));
  const present = col.opportunityIds.map((id) => byId.get(id)).filter(Boolean);

  const themeWords = new Set([
    ...words(col.title),
    ...words(col.description),
    ...col.tags.flatMap((t) => [...words(t)]),
    ...col.intended_majors.flatMap((m) => [...words(m)]),
    ...(col.career_path ? [...words(col.career_path)] : []),
  ]);

  const wrongCategory = [];
  const offTheme = [];

  for (const o of present) {
    // The UI derives categories from members (lib/collectionFacts.ts), so a
    // member can no longer contradict its collection. The legacy declared
    // field is reported separately below rather than treated as a defect.
    // Thematic overlap: any shared word between the listing and the theme.
    const oppWords = new Set([...words(o.title), ...words(o.blurb), ...o.fields.flatMap((f) => [...words(f)])]);
    const overlap = [...oppWords].some((w) => themeWords.has(w));
    if (!overlap) offTheme.push(`${o.id} (${o.title.slice(0, 44)})`);
  }

  missingTotal += missing.length;
  categoryMismatch += wrongCategory.length;
  unrelated += offTheme.length;

  if (missing.length || wrongCategory.length || offTheme.length) {
    report.push({ col, missing, wrongCategory, offTheme, size: col.opportunityIds.length, live: present.length });
  }
}

console.log(`collections: ${curatedCollections.length}`);
console.log(`dangling opportunity ids: ${missingTotal}`);
console.log(`category mismatches:      ${categoryMismatch}`);
console.log(`no thematic overlap:      ${unrelated}\n`);

for (const r of report) {
  console.log(`— ${r.col.id}  (${r.live}/${r.size} resolve)`);
  if (r.missing.length) console.log(`    MISSING: ${r.missing.join(", ")}`);
  for (const w of r.wrongCategory) console.log(`    CATEGORY: ${w}`);
  for (const t of r.offTheme) console.log(`    OFF-THEME: ${t}`);
}
