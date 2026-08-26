/**
 * Flags listings whose category looks wrong for their title and blurb.
 *
 * /categories/competitions is the single biggest source of impressions on the
 * site, and it was showing local rec-centre programmes — a youth soccer league,
 * an underwater hockey club, an after-school music camp — alongside USAMO and
 * Regeneron STS. That mismatch is exactly what keeps a page ranking at 65 for
 * "competitions for high school students".
 *
 *   node scripts/audit-categories.mjs
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

// Words that indicate a genuine competitive event.
const COMPETITION_WORDS =
  /\b(competition|contest|olympiad|tournament|championship|challenge|award|prize|hackathon|science fair|debate|model un|pitch|scrimmage|invitational|bee\b|match)/i;

// Signals of an ongoing local programme rather than a competition.
const PROGRAMME_WORDS =
  /\b(after[- ]school|beacon program|recreation center|rec center|drop[- ]in|community center|day camp|summer camp|enrichment|tutoring|mentoring program|youth center|childcare|club)\b/i;

const suspect = [];
for (const o of allOpportunities) {
  if (o.category !== "Competition") continue;
  const text = `${o.title} ${o.blurb}`;
  const looksCompetitive = COMPETITION_WORDS.test(text);
  const looksProgramme = PROGRAMME_WORDS.test(text);
  if (!looksCompetitive || (looksProgramme && !COMPETITION_WORDS.test(o.title))) {
    suspect.push(o);
  }
}

console.log(`Competition listings: ${allOpportunities.filter((o) => o.category === "Competition").length}`);
console.log(`suspect (not actually competitions): ${suspect.length}\n`);
for (const o of suspect) {
  console.log(`  ${o.id}`);
  console.log(`     ${o.title}  [${o.location}]`);
  console.log(`     ${o.blurb.slice(0, 110)}...`);
}
