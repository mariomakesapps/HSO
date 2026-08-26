/**
 * Checks that the fields the filters key off actually describe the listing.
 *
 * A filter is only useful if its data is true. This looks for listings whose
 * own text contradicts the value a student would filter on — a program whose
 * blurb says "seniors" but is tagged grades 9-12, or one described as online
 * but tagged In-person.
 *
 *   node scripts/audit-filter-fields.mjs
 */
import { build } from "esbuild";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const root = process.cwd();

const result = await build({
  stdin: { contents: `export { allOpportunities } from "@/data/opportunities";`, resolveDir: root, loader: "ts" },
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  write: false,
  logLevel: "error",
  alias: { "@": path.join(root, "src") },
});

const { allOpportunities } = await importBundle(result);

const findings = { grades: [], format: [], cost: [], fields: [], grardesEmpty: [] };

for (const o of allOpportunities) {
  const text = `${o.title} ${o.blurb}`;
  const low = text.toLowerCase();

  // --- grades ---
  const seniorsOnly = /\b(seniors?|12th grader?s?|graduating seniors)\b/.test(low) &&
    !/\b(juniors?|sophomores?|freshmen|9th|10th|11th)\b/.test(low);
  if (seniorsOnly && o.grades.length > 1) {
    findings.grades.push(`${o.id}: blurb says seniors only, tagged grades ${o.grades.join(",")}`);
  }
  const risingJuniorSenior = /\brising (juniors?|seniors?)\b/.test(low);
  if (risingJuniorSenior && o.grades.includes(9)) {
    findings.grades.push(`${o.id}: blurb says rising juniors/seniors, tagged includes grade 9`);
  }
  if (!o.grades.length) findings.grardesEmpty.push(o.id);

  // --- format ---
  if (/\b(fully online|entirely online|virtual program|remote program|from anywhere)\b/.test(low) && o.format === "In-person") {
    findings.format.push(`${o.id}: described as online, tagged In-person`);
  }
  if (/\b(on campus|residential|in person|on-site)\b/.test(low) && o.format === "Online") {
    findings.format.push(`${o.id}: described as in-person/residential, tagged Online`);
  }

  // --- cost ---
  if (/\b(free of charge|no cost|fully funded|tuition[- ]free|full scholarship)\b/.test(low) && o.cost === "Paid") {
    findings.cost.push(`${o.id}: described as free/funded, tagged Paid`);
  }
  if (/\b(stipend|paid internship|receive \$|earn \$)\b/.test(low) && o.cost === "Paid") {
    findings.cost.push(`${o.id}: described as paying a stipend, tagged Paid (cost to student)`);
  }

  // --- fields ---
  if (!o.fields?.length) findings.fields.push(`${o.id}: no field tags, so field filters can never match it`);
}

for (const [k, v] of Object.entries(findings)) {
  console.log(`\n${k}: ${v.length}`);
  for (const line of v.slice(0, 12)) console.log(`  - ${line}`);
  if (v.length > 12) console.log(`  ... and ${v.length - 12} more`);
}

const total = Object.values(findings).reduce((n, v) => n + v.length, 0);
console.log(`\ntotal contradictions: ${total} of ${allOpportunities.length} listings`);
