/**
 * Applies verified URL corrections to the catalog.
 *
 * Every replacement here was confirmed against the program's official site
 * before being written. Where a working replacement could NOT be confirmed,
 * the listing is flagged requiresReview instead of being given a guessed URL —
 * that routes it through the existing quality gate, which noindexes the page
 * and drops it from the sitemap rather than sending students to a dead link.
 *
 *   node scripts/apply-link-fixes.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apply = process.argv.includes("--apply");

/** id -> { url } to correct, or { review } to flag for manual follow-up. */
const FIXES = {
  // Confirmed 200 against the official site.
  "afsa-essay": { url: "https://afsa.org/essay-contest" },
  "state-michigan-aspirnaut": { url: "https://aspirnaut.org/" },
  "carson-scholars": { url: "https://carsonscholars.org/" },
  "bell-journalism": { url: "https://www.bellvoices.org/" },
  "heisman-high-school-scholarship": { url: "https://www.heisman.com/hs-heisman/" },
  "cyber-patriot": { url: "https://www.uscyberpatriot.org/" },
  "prudential-emerging-visionaries": {
    url: "https://www.changemakers.com/en/challenge/emergingvisionaries",
  },
  // ONR's own page for SEAP — a .mil canonical source, verified to carry the
  // current stipend figures and application window.
  "naval-seap": { url: "https://www.onr.navy.mil/education-outreach/k-12-programs/seap" },

  // Could not confirm a working replacement from here; flagged rather than guessed.
  "comcast-leaders-achievers": { review: "Program page moved; official application host unverified." },
  "foot-locker-scholar-athletes": { review: "Program site unreachable during verification." },
  "ssi-naval": { review: "NREIP is an undergraduate program; needs a high-school-relevant URL or removal." },
};

/** Listings whose link is a job-board aggregator rather than a program page. */
const REMOVE = {
  "northrop-grumman-hs-tech-intern-nd":
    "tarta.ai job-aggregator repost of a closed 2023 posting, not a program page",
};

const dataDir = path.join(root, "src/data");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".ts"));

let urlUpdates = 0;
let reviewFlags = 0;
let removed = 0;

for (const file of files) {
  const full = path.join(dataDir, file);
  let src = fs.readFileSync(full, "utf8");
  const before = src;

  for (const [id, fix] of Object.entries(FIXES)) {
    if (!fix.url) continue;
    // One-line literal form.
    const line = new RegExp(`(\\{\\s*id: "${id}"[^\\n]*?url: ")([^"]+)(")`, "g");
    src = src.replace(line, (_m, a, _old, c) => {
      urlUpdates++;
      return a + fix.url + c;
    });
    // JSON-formatted form (generatedBulkOpportunities).
    const json = new RegExp(`("id": "${id}"[\\s\\S]{0,2000}?"url": ")([^"]+)(")`, "g");
    src = src.replace(json, (_m, a, _old, c) => {
      urlUpdates++;
      return a + fix.url + c;
    });
  }

  if (src !== before) fs.writeFileSync(full, src, "utf8");
}

// requiresReview lives in the generated verification map, which is where the
// quality gate reads it from.
{
  const vf = path.join(dataDir, "linkVerification.generated.ts");
  let src = fs.readFileSync(vf, "utf8");
  const eq = src.indexOf("=", src.indexOf("export const opportunityLinkVerification"));
  const obj = JSON.parse(src.slice(eq + 1, src.lastIndexOf(";")).trim());

  for (const [id, fix] of Object.entries(FIXES)) {
    if (!fix.review) continue;
    obj[id] = { verified: false, requiresReview: true, review_note: fix.review };
    reviewFlags++;
  }
  for (const id of Object.keys(REMOVE)) delete obj[id];

  if (apply) {
    fs.writeFileSync(vf, `${src.slice(0, eq + 1)} ${JSON.stringify(obj, null, 2)};\n`, "utf8");
  }
}

// Drop aggregator listings entirely.
for (const file of files) {
  const full = path.join(dataDir, file);
  const src = fs.readFileSync(full, "utf8");
  let out = src;

  for (const id of Object.keys(REMOVE)) {
    out = out
      .split("\n")
      .filter((line) => !new RegExp(`\\{\\s*id: "${id}"`).test(line))
      .join("\n");
  }
  if (out !== src) {
    removed++;
    if (apply) fs.writeFileSync(full, out, "utf8");
  }
}

console.log(`url corrections applied : ${urlUpdates}`);
console.log(`flagged for review      : ${reviewFlags}`);
console.log(`aggregator listings cut : ${Object.keys(REMOVE).length}`);
console.log(apply ? "\nwritten." : "\nNOTE: url edits are written immediately; pass --apply for review flags + removals.");
