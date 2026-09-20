/**
 * Writes a slim snapshot of the catalog's dated listings for the monthly
 * deadline digest email:
 *
 *   node scripts/generate-digest-data.mjs
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();

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

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const rows = allOpportunities
  .filter((o) => typeof o.deadline === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.deadline))
  .map((o) => ({
    id: o.id,
    title: clean(o.title),
    org: clean(o.org),
    category: clean(o.category),
    cost: clean(o.cost),
    format: clean(o.format),
    grades: Array.isArray(o.grades) ? o.grades : [],
    deadline: o.deadline,
    url: clean(o.url),
    summary: clean(o.description).slice(0, 220),
  }))
  .sort((a, b) => (a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0));

const outPath = path.join(
  root,
  "supabase/functions/send-deadline-digest/opportunities.json",
);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(rows), "utf8");
console.log(`digest data written: ${rows.length} dated listings -> ${outPath}`);
