/**
 * Prunes the opportunity data down to what the site actually serves.
 *
 * The catalog accumulated several generations of imports. Listings are dropped
 * at runtime by the filters in src/data/opportunities.ts — Volunteer-classified
 * rows, non-US listings, and an explicit removal list — and the generated
 * link-quality maps still carry keys for listings that no longer exist. All of
 * it was shipped to the browser regardless.
 *
 *   node scripts/prune-data.mjs --dry     # report only
 *   node scripts/prune-data.mjs --apply   # rewrite the files
 *
 * Each file is rewritten in the format it already uses: the hand-maintained
 * arrays are one object literal per line, so those are filtered line-wise and
 * every surviving line stays byte-identical; the generated files are JSON, so
 * those are re-serialised with the same indentation.
 *
 * Always verify with scripts/snapshot-catalog.mjs — `allOpportunities` must be
 * unchanged afterwards.
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();
const apply = process.argv.includes("--apply");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const write = (f, s) => fs.writeFileSync(path.join(root, f), s, "utf8");
const kb = (f) => Math.round(fs.statSync(path.join(root, f)).size / 1024);

const result = await build({
  stdin: {
    contents: `
      export { allOpportunities } from "@/data/opportunities";
      export { generatedBulkOpportunities } from "@/data/generatedBulkOpportunities";
      export { opportunityLinkQuality } from "@/data/linkQuality.generated";
      export { opportunityLinkPrecision } from "@/data/linkPrecision.generated";
      export { opportunityLinkVerification } from "@/data/linkVerification.generated";
      export { deadlineOverridesByUrl, opensAtOverridesByUrl, normalizeOpportunityUrl,
               removedOpportunityUrls } from "@/data/eligibilityCleanup.generated";
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

const d = await importBundle(result);

/** The catalog the site renders. Anything not reachable from here is dead. */
const liveIds = new Set(d.allOpportunities.map((o) => o.id));
const liveUrlKeys = new Set(d.allOpportunities.map((o) => d.normalizeOpportunityUrl(o.url)));
const report = [];

/**
 * Filter a one-object-per-line array literal by id, leaving surviving lines
 * untouched. `region` optionally restricts the edit to part of the file, which
 * is how the inline array inside opportunities.ts is handled without disturbing
 * the ~200 lines of pipeline logic that follow it.
 */
function pruneLineArray(file, { startAfter, endBefore } = {}) {
  const src = read(file);
  const start = startAfter ? src.indexOf(startAfter) + startAfter.length : 0;
  const end = endBefore ? src.indexOf(endBefore) : src.length;
  if (start < 0 || end < 0 || end < start) throw new Error(`region not found in ${file}`);

  const head = src.slice(0, start);
  const body = src.slice(start, end);
  const tail = src.slice(end);

  let before = 0;
  let after = 0;
  const kept = body.split("\n").filter((line) => {
    const id = line.match(/^\s*\{\s*id:\s*"([^"]+)"/)?.[1];
    if (!id) return true; // blank lines, comments, spreads
    before++;
    const keep = liveIds.has(id);
    if (keep) after++;
    return keep;
  });

  report.push({ file: file.replace("src/data/", ""), entriesBefore: before, entriesAfter: after, kb: kb(file) });
  if (apply) write(file, head + kept.join("\n") + tail);
}

/** Re-serialise a JSON-formatted generated file, preserving its header. */
function pruneJsonFile(file, declMatch, value) {
  const src = read(file);
  const i = src.indexOf(declMatch);
  if (i < 0) throw new Error(`declaration not found in ${file}`);
  const eq = src.indexOf("=", i);
  if (apply) write(file, `${src.slice(0, eq + 1)} ${JSON.stringify(value, null, 2)};\n`);
}

// --- hand-maintained arrays: one literal per line -------------------------
pruneLineArray("src/data/additionalUsOpportunities.ts");
pruneLineArray("src/data/stateOpportunities.ts");
pruneLineArray("src/data/csvScholarships.ts");
// Only the literal array at the top of opportunities.ts, not the logic below it.
pruneLineArray("src/data/opportunities.ts", {
  startAfter: "export const opportunities: Opportunity[] = [",
  endBefore: "  ...additionalUsOpportunities,",
});

// --- generated bulk import: JSON-formatted --------------------------------
{
  const file = "src/data/generatedBulkOpportunities.ts";
  const kept = d.generatedBulkOpportunities.filter((o) => liveIds.has(o.id));
  report.push({
    file: file.replace("src/data/", ""),
    entriesBefore: d.generatedBulkOpportunities.length,
    entriesAfter: kept.length,
    kb: kb(file),
  });
  pruneJsonFile(file, "export const generatedBulkOpportunities", kept);
}

// --- generated maps keyed by opportunity id -------------------------------
for (const [file, decl, obj] of [
  ["src/data/linkQuality.generated.ts", "export const opportunityLinkQuality", d.opportunityLinkQuality],
  ["src/data/linkPrecision.generated.ts", "export const opportunityLinkPrecision", d.opportunityLinkPrecision],
  ["src/data/linkVerification.generated.ts", "export const opportunityLinkVerification", d.opportunityLinkVerification],
]) {
  const keys = Object.keys(obj);
  const kept = keys.filter((k) => liveIds.has(k));
  report.push({
    file: file.replace("src/data/", ""),
    entriesBefore: keys.length,
    entriesAfter: kept.length,
    kb: kb(file),
  });
  pruneJsonFile(file, decl, Object.fromEntries(kept.map((k) => [k, obj[k]])));
}

// --- eligibility cleanup: keyed by normalised URL -------------------------
{
  const file = "src/data/eligibilityCleanup.generated.ts";
  const deadlines = Object.entries(d.deadlineOverridesByUrl).filter(([k]) => liveUrlKeys.has(k));
  const opens = Object.entries(d.opensAtOverridesByUrl).filter(([k]) => liveUrlKeys.has(k));
  const removedBefore = d.removedOpportunityUrls.size;

  report.push({
    file: file.replace("src/data/", ""),
    entriesBefore: removedBefore + Object.keys(d.deadlineOverridesByUrl).length + Object.keys(d.opensAtOverridesByUrl).length,
    entriesAfter: deadlines.length + opens.length,
    kb: kb(file),
  });

  if (apply) {
    const src = read(file);
    const header = src.slice(0, src.indexOf("export const removedOpportunityUrls"));
    write(
      file,
      `${header}// Empty by construction: every listing this set excluded has been pruned
// from the source data outright. The set and its filter are kept so the
// exclusion mechanism still works for future imports.
export const removedOpportunityUrls: ReadonlySet<string> = new Set([]);

export const deadlineOverridesByUrl: Record<string, string> = ${JSON.stringify(
        Object.fromEntries(deadlines),
        null,
        2,
      )};

export const opensAtOverridesByUrl: Record<string, string> = ${JSON.stringify(
        Object.fromEntries(opens),
        null,
        2,
      )};
`,
    );
  }
}

console.log(`live catalog: ${d.allOpportunities.length} listings\n`);
console.table(report);
console.log(apply ? "\nfiles rewritten — now run snapshot-catalog.mjs --diff" : "\ndry run — pass --apply to rewrite.");
