import type { Opportunity } from "@/data/opportunities";

/**
 * Data hygiene applied to every listing at load time.
 *
 * These are rules rather than per-listing rows on purpose: the problems below all come
 * from how the source feeds were imported, so a rule fixes the rows that exist today and
 * the ones the next import brings in.
 */

/**
 * Whitespace runs inside a title, org or blurb.
 *
 * "Mae  & Mary  Legacy Foundation, Inc" is a CSV artefact, and it reaches the page title,
 * the OG tags and the JSON-LD name.
 */
export function collapseSpaces(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * The NYC DYCD feed joins its program-type list with bare commas, so 279 blurbs read
 * "After-School Programs,Beacon,NYCHA Community Center". Add the missing space without
 * touching commas that are already spaced or that sit inside a number.
 */
export function spaceAfterCommas(s: string): string {
  return s.replace(/,(?=[^\s\d])/g, ", ");
}

/**
 * A blurb that stops mid-sentence looks broken as a meta description, which is where it
 * ends up. Only add the full stop when the text plainly ends a sentence — never after an
 * abbreviation or an existing mark.
 */
export function endWithStop(s: string): string {
  const t = s.trim();
  if (!t || /[.!?:;)"'’”]$/.test(t)) return t;
  if (/\b[A-Z][a-z]?$/.test(t)) return t; // probably a truncated initialism, leave it
  return `${t}.`;
}

/**
 * The CSV scholarship import cut its descriptions at a fixed character count, mid-word,
 * and left an ellipsis behind: "...AFSA wants to educate the public at-large abou...".
 * That fragment is the card blurb, the meta description and the JSON-LD description, so
 * it is visible to a student and to search engines on 73 listings.
 *
 * Trim back to the last complete sentence where one survives, and otherwise to the last
 * complete word. Nothing is invented: this only removes the broken tail, so the listing
 * says less than the source did but never says something the source did not.
 */
/**
 * Words that cannot be the last word of a finished sentence. Their presence at the end
 * is the signal that the importer cut the text, including in the rows where it cut
 * without leaving an ellipsis behind ("...Nebraska, New", "...at least 200 hours of").
 */
const CANNOT_END =
  /^(and|or|the|a|an|of|for|to|in|on|with|at|from|by|as|that|which|who|whom|whose|how|what|why|where|when|is|are|was|were|will|shall|must|may|can|be|been|being|have|has|had|their|its|your|his|her|our|my|this|these|those|but|if|while|than|then|into|about|over|under|new|north|south|west|east|rhode|saint|st|puerto|district)$/i;

const STRANDED_ABOUT = /\b(care|cares|cared|learn|learning|know|think|talk|hear|read|worry|curious|passionate|excited)\s+about[.!?]?$/i;

export function repairTruncation(s: string): string {
  const t = s.trim();
  const hadEllipsis = /(\.\.\.|…)$/.test(t);
  let body = t.replace(/\s*(\.\.\.|…)$/, "");

  const tail = (x: string) => (x.trim().split(/\s+/).pop() ?? "").replace(/[^\w-]/g, "");
  if (!hadEllipsis && !CANNOT_END.test(tail(body))) return t;
  // "an issue you care about." is a finished sentence: "about" ends it after verbs
  // like these. Without this the editorial contest's blurb lost its last word.
  if (!hadEllipsis && STRANDED_ABOUT.test(body.trim())) return t;

  if (hadEllipsis) {
    // Prefer a sentence boundary, but only if keeping it leaves most of the text —
    // otherwise a blurb whose first sentence is short would lose almost everything.
    const lastStop = Math.max(body.lastIndexOf(". "), body.lastIndexOf("! "), body.lastIndexOf("? "));
    if (lastStop > body.length * 0.5) return body.slice(0, lastStop + 1).trim();
    const lastSpace = body.lastIndexOf(" "); // the final word is the half-typed one
    if (lastSpace > 0) body = body.slice(0, lastSpace);
  } else {
    body = body.replace(/[.!?]+$/, "");
  }

  // Walk back off the dangling fragment. The floor keeps this from eating a blurb
  // whose every word happens to match.
  const words = body.trim().split(/\s+/);
  while (words.length > 4 && CANNOT_END.test(tail(words[words.length - 1]))) words.pop();
  const cut = words.join(" ").replace(/[,;:–—-]+$/, "").trim();
  return cut ? `${cut}.` : t;
}

/**
 * Link hygiene.
 *
 * Google text fragments (`#:~:text=…`) are a copy-paste artefact from a search result:
 * they are long, they leak the search phrase, and they mean nothing to anyone who did not
 * arrive from that result. Tracking parameters attribute the click to whoever the source
 * page was built for rather than to HSO. A bare trailing `#` is just noise.
 *
 * A real section anchor (`#internships-tab`, `#HSIntern`) is kept: it takes the student to
 * the part of the page that is actually about them.
 */
export function cleanUrl(url: string): string {
  let u = url.trim();
  u = u.replace(/#:~:text=.*$/i, "");
  u = u.replace(/[?&](utm_[^=]+|fbclid|gclid|mc_cid|mc_eid)=[^&#]*/gi, (m) => (m[0] === "?" ? "?" : ""));
  u = u.replace(/\?&/, "?").replace(/[?&]$/, "");
  u = u.replace(/#$/, "");
  return u;
}

/**
 * Grade ranges corrected where the listing's own blurb, and the programme's official page,
 * both state a narrower range than the array claimed. An array that starts at 9 when the
 * programme starts at 10 tells a ninth grader they are eligible when they are not.
 *
 * Only listings re-checked against the official page are here.
 *
 * One case that looks like this bug and is not: `engineergirl-writing`. Its blurb names
 * a "grades 10-12" category while the array runs 9-12, but the official 2027 rules page
 * lists four categories — "Grades 3-4, Grades 5-6, Grades 7-9, Grades 10-12" — so a
 * ninth grader really can enter, just in the 7-9 bracket. A category range inside a
 * blurb is not the same claim as an eligibility range, so re-checked 2026-09-25 and
 * left alone.
 */
export const GRADE_FIXES: Record<string, number[]> = {
  // phillyseaport.org: "Who Should Apply? Entering grades 10-12 or equivalent high school level enrollment"
  "independence-seaport-museum-teen-ambassadors-program": [10, 11, 12],
  // mods.org: "WHO: Broward County Public Schools students entering grades 10-12 (2026-2027 school year)"
  "museum-of-discovery-and-science-mods-ecoexplorers-and-aviation-a": [10, 11, 12],
  // mos.org: "Actively enrolled high school students, 14-19 years old" — all four grades.
  // The stored [9,11,12] skipped grade 10 outright, so tenth graders never saw it.
  "museum-of-science-high-school-internship": [9, 10, 11, 12],
  // hiprc.org contradicts itself: the programme overview says "entering grades 10-12"
  // while the FAQ says "entering grades 9-12". The stored [9,10,11] matched neither,
  // because both statements include grade 12 — seniors were being hidden from a
  // programme that takes them. Where the page gives two answers, the narrower one is
  // the safe one: it never tells a student they qualify when they do not, and it is
  // what the listing's own blurb already says.
  "harborview-injury-prevention-and-research-center-university-of-w": [10, 11, 12],
};

/**
 * Subject tags.
 *
 * The importers and hand-written rows used about a hundred different subject words ("Music",
 * "Film", "Art" and "Arts"; "Health", "Healthcare", "Public Health" and "Medicine"), and the
 * subject filter lists every one of them. A student who picks "Arts" then misses every program
 * tagged only "Music". Each specific tag below also gets its main subject, so filtering by the
 * main subject finds them. Nothing is removed: the specific tag stays on the listing (topic
 * pages and related listings still match on it).
 */
export const MAIN_SUBJECTS = [
  "STEM", "Math", "Computer Science", "Biology", "Engineering", "Medicine", "Environment",
  "Business", "Policy", "Humanities", "Writing", "Arts", "Leadership", "Research", "Career", "Trades", "Education",
] as const;

const SUBJECT_PARENTS: Record<string, string[]> = {
  Health: ["Medicine"], Healthcare: ["Medicine"], "Public Health": ["Medicine"], "Pre-Med": ["Medicine"],
  "Cancer Research": ["Medicine", "Biology", "Research"], Neuroscience: ["Biology", "STEM"],
  Genetics: ["Biology", "STEM"], "Systems Biology": ["Biology", "STEM"], "Plant Science": ["Biology", "STEM"],
  "Marine Science": ["Biology", "Environment", "STEM"], Ecology: ["Biology", "Environment", "STEM"],
  Chemistry: ["STEM"], Physics: ["STEM"], Astronomy: ["STEM"], "Earth Science": ["STEM", "Environment"], Science: ["STEM"],
  "Materials Science": ["Engineering", "STEM"], Aerospace: ["Engineering", "STEM"], Robotics: ["Engineering", "STEM"],
  Manufacturing: ["Engineering", "Trades"], Automotive: ["Trades"], Construction: ["Trades"],
  "Data Science": ["Computer Science", "STEM"], AI: ["Computer Science", "STEM"], Cybersecurity: ["Computer Science", "STEM"],
  Programming: ["Computer Science", "STEM"], "Game Design": ["Computer Science", "Arts"], Technology: ["STEM"],
  "Smart Cities": ["Engineering", "STEM"], Modeling: ["STEM"], "Women in STEM": ["STEM"],
  Conservation: ["Environment"], Sustainability: ["Environment"], "Natural Resources": ["Environment"],
  Agriculture: ["Environment"], "Outdoor Education": ["Environment"],
  Art: ["Arts"], Music: ["Arts"], Film: ["Arts"], Photography: ["Arts"], Design: ["Arts"], Animation: ["Arts"],
  Fashion: ["Arts"], Performance: ["Arts"], Video: ["Arts"], Audio: ["Arts"], "Public Art": ["Arts"],
  Architecture: ["Arts", "Engineering"], Curation: ["Arts"], Museums: ["Arts", "Humanities"],
  Finance: ["Business"], Economics: ["Business"], Entrepreneurship: ["Business"], Accounting: ["Business"],
  Marketing: ["Business"], Hospitality: ["Business"], "Event Planning": ["Business"],
  Civics: ["Policy"], Civic: ["Policy"], "Civic Leadership": ["Policy", "Leadership"], Government: ["Policy"],
  Politics: ["Policy"], Law: ["Policy"], Diplomacy: ["Policy"], Global: ["Policy"],
  Journalism: ["Writing"], "Creative Writing": ["Writing"], Communications: ["Writing"], Communication: ["Writing"],
  Media: ["Writing", "Arts"], Literature: ["Writing", "Humanities"],
  History: ["Humanities"], Philosophy: ["Humanities"], Languages: ["Humanities"], Linguistics: ["Humanities"],
  Ethics: ["Humanities"], Libraries: ["Humanities"],
  "Public Speaking": ["Leadership"], "Social Impact": ["Leadership"], Service: ["Leadership"], Community: ["Leadership"],
  "Personal Development": ["Leadership"], Nonprofit: ["Leadership"],
  "College Access": ["Education"], "College Credit": ["Education"], "Test Prep": ["Education"], Tutoring: ["Education"],
  Literacy: ["Education"],
};

export function addMainSubjects(fields: string[]): string[] {
  const out = [...fields];
  for (const f of fields) for (const parent of SUBJECT_PARENTS[f] ?? []) if (!out.includes(parent)) out.push(parent);
  return out;
}

/** Apply every rule above to one listing, in place. */
export function applyDataHygiene(o: Opportunity): void {
  if (o.title) o.title = collapseSpaces(o.title);
  if (o.org) o.org = collapseSpaces(o.org);
  if (o.blurb) o.blurb = endWithStop(repairTruncation(spaceAfterCommas(collapseSpaces(o.blurb))));
  if (o.url) o.url = cleanUrl(o.url);
  if (o.fields) o.fields = addMainSubjects(o.fields);
  const grades = GRADE_FIXES[o.id];
  if (grades) o.grades = [...grades];
}
