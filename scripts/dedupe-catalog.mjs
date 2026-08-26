/**
 * Removes duplicate listings from the catalog.
 *
 * Two kinds of duplication had accumulated:
 *
 *   - Same id twice. Lookups do `find(o => o.id === id)`, so the second record
 *     is unreachable, and the prerenderer emits the same URL twice. The two
 *     copies often disagree (different deadline, cost, even a different link),
 *     so which one a student sees is arbitrary.
 *
 *   - Same destination URL under different ids, mostly the `csv-sch-*` bulk
 *     scholarship import re-adding programmes that were already curated. Those
 *     pages compete with each other in search for the same programme.
 *
 * Every decision is printed so the outcome can be checked rather than trusted.
 *
 *   node scripts/dedupe-catalog.mjs --dry
 *   node scripts/dedupe-catalog.mjs --apply
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();
const apply = process.argv.includes("--apply");

const result = await build({
  stdin: {
    contents: `
      export { allOpportunities } from "@/data/opportunities";
      export { normalizeOpportunityUrl } from "@/data/eligibilityCleanup.generated";
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

const { allOpportunities, normalizeOpportunityUrl } = await importBundle(result);

/**
 * Which copy of a duplicated programme to keep.
 *
 * Prefers records that carry more usable information, and curated ids over
 * bulk-import ids — `csv-sch-doodle-for-google` is an import artefact, whereas
 * `doodle-for-google` is the hand-maintained entry other pages link to.
 */
/**
 * Listings whose page already earns impressions in Search Console (pulled
 * 2026-05-24..08-22). When two records describe the same programme, the one
 * Google already knows must win — deleting it throws away real ranking history
 * and turns an indexed URL into a 404. Scored high enough to outrank any
 * combination of the data-richness signals below.
 */
const PAGES_WITH_SEARCH_HISTORY = new Set([
  "questbridge-match",
  "cameron-impact",
  "regeneron-sts",
  "blue-ocean-entrepreneurship",
  "nyt-essay",
  "horizon",
  "national-merit",
  "jpl",
  "youth-mentors-737",
  "nih-summer",
  "new-york-cares-youth",
  "columbia-yes-heights",
  "hopkins-med",
  "delamed-dpha-fall",
  "rockefeller-ssrp",
  "sf-our415-2491-jccsf-summer-camp",
]);

/** Prefer a link that points at the programme itself over a generic homepage. */
const PRECISION_RANK = {
  direct_application_page: 3,
  exact_program_page: 2,
  broad_directory: 1,
  generic_homepage: 0,
};

function score(o) {
  let s = 0;
  if (PAGES_WITH_SEARCH_HISTORY.has(o.id)) s += 20;
  s += PRECISION_RANK[o.link_precision] ?? 0;
  if (o.deadline) s += 3;
  if (o.opensAt) s += 1;
  s += Math.min((o.blurb ?? "").length / 40, 4);
  s += Math.min((o.fields ?? []).length, 4) * 0.5;
  if (o.verified) s += 2;
  if (o.requiresReview) s -= 5;
  if (/^csv-sch-/.test(o.id)) s -= 3;          // bulk import artefact
  if (/^(sf-our415|nyc)-/.test(o.id)) s -= 1;  // local feed import
  if (o.org && o.org !== o.title) s += 1;      // a real org name, not a copy of the title
  if (o.id.length <= 3) s -= 1;                // opaque stubs like "qb"
  return s;
}

const drop = new Map(); // id -> reason

function resolveGroup(rows, label) {
  const ranked = [...rows].sort((a, b) => score(b) - score(a));
  const keep = ranked[0];
  for (const loser of ranked.slice(1)) {
    // Two records sharing ONE id are handled by the duplicate-id pass at the
    // bottom, which drops the second literal in place. Adding the id to `drop`
    // here would instead delete every copy, including the one we want to keep.
    if (loser.id !== keep.id) {
      drop.set(loser.id, `${label}: superseded by "${keep.id}"`);
    }
  }
  return { keep, losers: ranked.slice(1) };
}

// --- duplicate ids --------------------------------------------------------
const byId = new Map();
for (const o of allOpportunities) {
  if (!byId.has(o.id)) byId.set(o.id, []);
  byId.get(o.id).push(o);
}
const dupIds = [...byId.entries()].filter(([, v]) => v.length > 1);

console.log(`duplicate ids: ${dupIds.length}`);
for (const [id, rows] of dupIds) {
  const { keep } = resolveGroup(rows, "duplicate id");
  console.log(`  ${id}  (${rows.length} copies) -> keeping the one with url ${keep.url.slice(0, 70)}`);
}

// --- duplicate destination URLs ------------------------------------------
const byUrl = new Map();
for (const o of allOpportunities) {
  const k = normalizeOpportunityUrl(o.url);
  if (!k) continue;
  if (!byUrl.has(k)) byUrl.set(k, []);
  byUrl.get(k).push(o);
}
const dupUrls = [...byUrl.entries()].filter(([, v]) => v.length > 1);

/**
 * A shared URL alone does NOT make two listings duplicates.
 *
 * AMC 10/12, AIME and USAMO are three different competitions behind one MAA
 * page; the New York Times runs its editorial, photo and podcast contests off a
 * single "Learning Contests" URL — and that podcast listing ranks at position
 * 7.8. Collapsing on URL alone would delete real, distinct, ranking pages.
 * Require the titles to match too, which is what actually characterises the
 * `csv-sch-*` re-imports.
 */
const normaliseTitle = (t) =>
  t.toLowerCase().replace(/\b(the|a|an|program|programme|scholarship|scholarships|foundation|award|awards|for|of)\b/g, "").replace(/[^a-z0-9]/g, "");

function titlesMatch(a, b) {
  const x = normaliseTitle(a.title);
  const y = normaliseTitle(b.title);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

console.log(`\nurl collisions: ${dupUrls.length}`);
for (const [, rows] of dupUrls) {
  const unique = [...new Map(rows.map((r) => [r.id, r])).values()];
  if (unique.length < 2) continue;

  // Only collapse the subset whose titles agree with the best-scoring record.
  const ranked = [...unique].sort((a, b) => score(b) - score(a));
  const keep = ranked[0];
  const losers = ranked.slice(1).filter((o) => titlesMatch(keep, o));
  const distinct = ranked.slice(1).filter((o) => !titlesMatch(keep, o));

  if (losers.length) {
    for (const l of losers) drop.set(l.id, `duplicate url: superseded by "${keep.id}"`);
    console.log(`  keep "${keep.id}"  drop ${losers.map((l) => `"${l.id}"`).join(", ")}`);
  }
  if (distinct.length) {
    console.log(
      `  same url, distinct programmes — keeping all: "${keep.id}", ${distinct.map((l) => `"${l.id}"`).join(", ")}`,
    );
  }
}

// --- same programme, same provider, different URL ---------------------------
// The URL pass cannot see these: two records for QuestBridge's National College
// Match pointed at two different pages on questbridge.org. Identical title AND
// identical provider is a duplicate however the links differ.
const byTitleOrg = new Map();
for (const o of allOpportunities) {
  const key = `${normaliseTitle(o.title)}|${normaliseTitle(o.org ?? "")}`;
  if (!byTitleOrg.has(key)) byTitleOrg.set(key, []);
  byTitleOrg.get(key).push(o);
}

console.log("\nsame title + provider:");
for (const [, rows] of byTitleOrg) {
  const unique = [...new Map(rows.map((r) => [r.id, r])).values()].filter((o) => !drop.has(o.id));
  if (unique.length < 2) continue;
  const ranked = [...unique].sort((a, b) => score(b) - score(a));
  const keep = ranked[0];
  for (const l of ranked.slice(1)) drop.set(l.id, `same title+provider as "${keep.id}"`);
  console.log(`  keep "${keep.id}"  drop ${ranked.slice(1).map((l) => `"${l.id}"`).join(", ")}`);
}

const dropIds = new Set(drop.keys());
console.log(`\nlistings to remove: ${dropIds.size}`);

if (!apply) {
  console.log("\ndry run — pass --apply to rewrite.");
  process.exit(0);
}

// --- rewrite the data files ----------------------------------------------
const dataDir = path.join(root, "src/data");
let removed = 0;

for (const file of fs.readdirSync(dataDir).filter((f) => f.endsWith(".ts"))) {
  const full = path.join(dataDir, file);
  const src = fs.readFileSync(full, "utf8");

  if (file === "generatedBulkOpportunities.ts") {
    const eq = src.indexOf("=", src.indexOf("export const generatedBulkOpportunities"));
    const arr = JSON.parse(src.slice(eq + 1, src.lastIndexOf(";")).trim());
    const kept = arr.filter((o) => !dropIds.has(o.id));
    removed += arr.length - kept.length;
    fs.writeFileSync(full, `${src.slice(0, eq + 1)} ${JSON.stringify(kept, null, 2)};\n`, "utf8");
    continue;
  }

  const lines = src.split("\n");
  const kept = lines.filter((line) => {
    const id = line.match(/^\s*\{\s*id:\s*"([^"]+)"/)?.[1];
    if (!id) return true;
    if (!dropIds.has(id)) return true;
    removed++;
    return false;
  });
  if (kept.length !== lines.length) fs.writeFileSync(full, kept.join("\n"), "utf8");
}

// The duplicate-id case: remove the *second* literal only, wherever it sits.
for (const [id, rows] of dupIds) {
  if (rows.length < 2) continue;
  let seen = 0;
  for (const file of fs.readdirSync(dataDir).filter((f) => f.endsWith(".ts"))) {
    const full = path.join(dataDir, file);
    const src = fs.readFileSync(full, "utf8");
    const out = src
      .split("\n")
      .filter((line) => {
        if (!new RegExp(`^\\s*\\{\\s*id:\\s*"${id}"`).test(line)) return true;
        seen++;
        if (seen > 1) {
          removed++;
          return false; // keep the first occurrence only
        }
        return true;
      })
      .join("\n");
    if (out !== src) fs.writeFileSync(full, out, "utf8");
  }
}

console.log(`\nremoved ${removed} listing(s).`);
