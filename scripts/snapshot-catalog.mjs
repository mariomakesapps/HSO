/**
 * Writes a deterministic fingerprint of `allOpportunities` — the catalog the
 * site actually renders.
 *
 * Used to prove that pruning the source data changed nothing a visitor or
 * crawler can see:
 *
 *   node scripts/snapshot-catalog.mjs before.json
 *   node scripts/prune-data.mjs --apply
 *   node scripts/snapshot-catalog.mjs after.json
 *   node scripts/snapshot-catalog.mjs --diff before.json after.json
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();

if (process.argv[2] === "--diff") {
  const a = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  const b = JSON.parse(fs.readFileSync(process.argv[4], "utf8"));

  if (a.length !== b.length) {
    console.error(`FAIL: catalog size changed ${a.length} -> ${b.length}`);
    process.exit(1);
  }

  const byId = (rows) => new Map(rows.map((r) => [r.id, r]));
  const [ma, mb] = [byId(a), byId(b)];
  const problems = [];

  for (const [id, ra] of ma) {
    const rb = mb.get(id);
    if (!rb) {
      problems.push(`missing after prune: ${id}`);
      continue;
    }
    const sa = JSON.stringify(ra);
    const sb = JSON.stringify(rb);
    if (sa !== sb) problems.push(`changed: ${id}\n    before ${sa}\n    after  ${sb}`);
  }
  for (const id of mb.keys()) if (!ma.has(id)) problems.push(`appeared after prune: ${id}`);

  if (problems.length) {
    console.error(`FAIL: ${problems.length} difference(s)`);
    for (const p of problems.slice(0, 20)) console.error("  - " + p);
    process.exit(1);
  }
  console.log(`OK: all ${a.length} listings byte-identical before and after.`);
  process.exit(0);
}

const outPath = process.argv[2];
if (!outPath) {
  console.error("usage: snapshot-catalog.mjs <out.json> | --diff <a.json> <b.json>");
  process.exit(1);
}

const result = await build({
  stdin: {
    contents: `export { allOpportunities } from "@/data/opportunities";`,
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

const { allOpportunities } = await importBundle(result);

// Sort keys so formatting differences never register as content differences.
const normalise = (o) =>
  Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));

const rows = allOpportunities
  .map(normalise)
  .sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));

fs.writeFileSync(outPath, JSON.stringify(rows, null, 1), "utf8");
console.log(`snapshot written: ${rows.length} listings -> ${outPath}`);
