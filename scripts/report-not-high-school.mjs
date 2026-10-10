/**
 * Flags listings that may not be for high school students. Report only:
 * nothing is removed, hidden or changed.
 *
 *   node scripts/report-not-high-school.mjs   -> reports/not-high-school.md
 *
 * Bulk imports (NYC DYCD rows) carry the city's own "Program type" and
 * "Eligibility" values in their description, so those are read directly.
 * Everything else is checked for wording that points at college students,
 * adults or younger children.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importBundle } from "./prerender.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = await build({
  stdin: {
    contents: `export { allOpportunities } from "@/data/opportunities"; export { isOpportunityIndexable } from "@/lib/pageMeta";`,
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
const m = await importBundle(result);

const field = (blurb, name) => blurb.match(new RegExp(`${name}: ([^.]*)\\.`))?.[1]?.trim() ?? "";

/** [reason, test] for the city import rows, most serious first. */
const IMPORT_RULES = [
  ["Family support service, not a program a student applies to", (t) => /Family Support/i.test(t)],
  ["Runaway and homeless youth service, not an opportunity listing", (t) => /Runaway & Homeless Youth/i.test(t)],
  ["Eligibility covers elementary and middle school too (\"Elem/MS/HS\")", (_t, e) => /^Elem\/MS\/HS$/i.test(e)],
  ["Eligibility is \"6 and up\": a mixed-age program, mostly younger children", (_t, e) => /^6 and up$/i.test(e)],
  ["Eligibility is \"OST\" (out-of-school time): no age range stated", (_t, e) => /^OST$/i.test(e)],
  ["Hosted at an elementary school (P.S. site)", (_t, _e, site) => /^(P\.?\s?S\.?|PS)\s?\d+/i.test(site)],
];

/** Wording that suggests a listing is for someone other than a high schooler. */
const TEXT_RULES = [
  ["Mentions undergraduates or college students without high school", /\b(undergraduate|college students?|graduate students?|university students?)\b/i, /\bhigh[- ]school/i],
  ["Mentions adults 18+ or 21+", /\b(18|21)\s*(\+|and (over|older)|or older)\b/i, null],
  ["Mentions elementary or middle school students", /\b(elementary|middle school|grades? [k1-6]\b|ages? [5-9]\b)/i, /\bhigh[- ]school/i],
];

const flags = [];
for (const o of m.allOpportunities) {
  if (o.id.startsWith("nyc-dycd-")) {
    const type = field(o.blurb, "Program type");
    const elig = field(o.blurb, "Eligibility");
    const site = field(o.blurb, "Site");
    const hit = IMPORT_RULES.find(([, test]) => test(type, elig, site));
    if (hit) flags.push({ o, reason: hit[0], detail: `Program type: ${type || "-"} · Eligibility: ${elig || "-"} · Site: ${site || "-"}` });
    continue;
  }
  const text = `${o.title}. ${o.blurb}`;
  for (const [reason, re, unless] of TEXT_RULES) {
    if (re.test(text) && !(unless && unless.test(text))) {
      flags.push({ o, reason, detail: o.blurb.slice(0, 160) });
      break;
    }
  }
}

const groups = new Map();
for (const f of flags) {
  if (!groups.has(f.reason)) groups.set(f.reason, []);
  groups.get(f.reason).push(f);
}

const md = [
  "# Listings that may not be for high school students",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)} by \`scripts/report-not-high-school.mjs\`. **Report only: nothing was removed or hidden.** Each one needs a human look; delete only with the owner's approval (and a 301 in \`src/data/removedOpportunities.ts\`).`,
  "",
  `${flags.length} listings flagged. "Indexed" says whether the page is currently indexable.`,
  "",
];
for (const [reason, list] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  md.push(`## ${reason} (${list.length})`, "", "| Listing | Indexed | Detail |", "|---|---|---|");
  for (const f of list) {
    md.push(`| [\`${f.o.id}\`](https://highschoolopportunity.org/opportunities/${f.o.id}) ${f.o.title.replace(/\|/g, "/")} | ${m.isOpportunityIndexable(f.o) ? "yes" : "no"} | ${f.detail.replace(/\|/g, "/")} |`);
  }
  md.push("");
}
await fs.mkdir(path.join(root, "reports"), { recursive: true });
await fs.writeFile(path.join(root, "reports/not-high-school.md"), md.join("\n"));
console.log(`[not-high-school] ${flags.length} listings flagged in ${groups.size} groups -> reports/not-high-school.md`);
for (const [reason, list] of groups) console.log(`  ${list.length.toString().padStart(4)}  ${reason}`);
