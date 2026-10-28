/**
 * Content audit for the SEO plan (P0-3): flags listings that are thin, undated,
 * off-topic for high schoolers, or bulk-imported without review, and writes a
 * CSV for a human to go through.
 *
 *   node scripts/audit-content.mjs [out.csv]      (default reports/content-audit.csv)
 *
 * It reads the catalogue exactly as the site renders it (allOpportunities, after
 * every dated update and hygiene pass), so what it flags is what Google sees.
 * It changes nothing.
 */
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();
const outPath = process.argv[2] ?? "reports/content-audit.csv";

const result = await build({
  stdin: {
    contents: [
      `export { allOpportunities } from "@/data/opportunities";`,
      `export { opportunityMeta } from "@/lib/pageMeta";`,
      `export { detailFor } from "@/data/opportunityDetails";`,
    ].join("\n"),
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
const { allOpportunities, opportunityMeta, detailFor } = await importBundle(result);

const BULK_PREFIXES = [
  "nyc-dycd-", "sf-our415-", "nps-", "youth-mentors-", "support-students-in-", "various-volunteer-opportunities",
];
// Volunteer roles for adults (mentoring teens, adult classes) rather than programmes for teens.
const ADULT_RE =
  /\b(adults?|older adults|seniors? \(?(?:5[05]|6[025])\+?|(?:5[05]|6[025])\+|mentor (?:a|for) (?:teen|youth|student)s?|become a (?:youth )?mentor|volunteer (?:mentor|tutor)s? needed|tutor (?:a|for) students)\b/i;
// NYC/SF after-school sites at elementary and middle schools.
const ELEMENTARY_RE =
  /\b(elementary|grades? k\b|k-[1-8]\b|p\.?s\.? ?\d+|j\.?h\.?s\.? ?\d+|m\.?s\.? ?\d+|i\.?s\.? ?\d+|k\d{3}|middle school students only)\b/i;

const csvCell = (v) => {
  const s = v === undefined || v === null ? "" : Array.isArray(v) ? v.join(" ") : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = [];
const counts = {};
for (const o of allOpportunities) {
  const detail = detailFor(o.id);
  const text = [o.blurb, ...(detail?.body ?? [])].filter(Boolean).join(" ");
  const grades = o.grades ?? [];
  const hsGrades = grades.filter((g) => g >= 9 && g <= 12);
  const hay = `${o.title} ${o.org} ${o.blurb}`;
  const flags = [];
  if (text.length < 250) flags.push("thin_under_250_chars");
  if (!o.deadline && !o.opensAt) flags.push("no_date");
  if (hsGrades.length === 0) flags.push("no_grades_9_to_12");
  if (ADULT_RE.test(hay)) flags.push("adult_audience_wording");
  if (ELEMENTARY_RE.test(hay)) flags.push("elementary_or_middle_wording");
  if (BULK_PREFIXES.some((p) => o.id.startsWith(p))) flags.push("bulk_import");
  if (!flags.length) continue;
  for (const f of flags) counts[f] = (counts[f] ?? 0) + 1;
  const meta = opportunityMeta(o);
  const isBulk = flags.includes("bulk_import");
  // DYCD "Out of School Time" sites at intermediate (I.S.), middle (M.S.) or
  // elementary (P.S.) schools serve younger grades; the row's own eligibility
  // line just says "OST", so a person has to decide.
  const youngerSite =
    isBulk && /Eligibility:\s*OST/.test(o.blurb) && ELEMENTARY_RE.test(`${o.title} ${o.blurb}`);
  const actions = [];
  if (youngerSite) actions.push("REVIEW: likely elementary/middle school only, remove?");
  if (!isBulk && (flags.includes("adult_audience_wording") || flags.includes("elementary_or_middle_wording")))
    actions.push("check wording (often a false positive, e.g. 'adult coach')");
  if (flags.includes("thin_under_250_chars"))
    actions.push(meta.noindex ? "keep noindex until enriched" : "enrich description (indexed now)");
  if (flags.includes("no_date")) actions.push("add date or usual opening month");
  if (youngerSite) counts.review_younger_site = (counts.review_younger_site ?? 0) + 1;
  rows.push([
    o.id,
    `https://highschoolopportunity.org/opportunities/${o.id}`,
    o.title,
    o.org,
    o.category,
    grades,
    o.location,
    meta.noindex ? "noindex" : "indexed",
    flags.join(" "),
    actions.join("; "),
    text.length,
    o.deadline ?? "",
    o.opensAt ?? "",
    "", // impressions: fill from a Search Console export if you have one
  ]);
}

const header = [
  "id", "url", "title", "org", "category", "grades", "location", "index_status_now",
  "flags", "suggested_action", "description_chars", "deadline", "opensAt", "impressions_3mo",
];
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n", "utf8");
console.log(`${rows.length} of ${allOpportunities.length} listings flagged -> ${outPath}`);
for (const [f, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${f}: ${n}`);
