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

export function repairTruncation(s: string): string {
  const t = s.trim();
  const hadEllipsis = /(\.\.\.|…)$/.test(t);
  let body = t.replace(/\s*(\.\.\.|…)$/, "");

  const tail = (x: string) => (x.trim().split(/\s+/).pop() ?? "").replace(/[^\w-]/g, "");
  // A preposition can legitimately end a complete sentence ("care about.").
  // Only strip dangling words when the source lacks terminal punctuation.
  if (!hadEllipsis && /[.!?][)"'’”]*$/.test(t)) return t;
  if (!hadEllipsis && !CANNOT_END.test(tail(body))) return t;

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
  // 2026-11-05: grade filters that disagreed with the eligibility the official page states
  // (the listing's own blurb, written from that page, already says the same).
  // https://globalyouth.wharton.upenn.edu/on-campus-programs/: "students currently enrolled in grades 9-11"
  "wharton-global": [9, 10, 11],
  // https://whitney.org/education/teens/youth-insights: Youth Insights Leaders are "high school students in grades 11 and 12"
  "whitney-youth-insights": [11, 12],
  // engineering.nyu.edu (IESoSC): "New York City high school students in grades 9 to 11"
  "nyu-iesosc": [9, 10, 11],
  // https://delamed.org/programs/student-internship/: "enrolled in a Delaware high school in grades 10 to 12"
  "delamed-dpha-spring": [10, 11, 12],
  // https://delamed.org/programs/student-internship/: "enrolled in a Delaware high school in grades 10 to 12"
  "delamed-dpha-summer": [10, 11, 12],
  // https://about.asianart.org/art-speak/: "students in grades 10 through 12"
  "asian-art-museum-art-speak": [10, 11, 12],
  // https://belinblank.education.uiowa.edu/students/sstp/: "high school students in grades 10 and 11"
  "state-iowa-sstp": [10, 11],
  // https://www.cyber.nj.gov/connect/careers/internships/high-school-internship-program: "New Jersey high school students in grades 9 through 12"
  "new-jersey-cybersecurity-communications-integration-cell-cyberse": [9, 10, 11, 12],
  // https://www.biobus.org/internship/highschool/: "students currently in grades 9-11 are eligible to apply"
  "biobus-junior-scientist-internship": [9, 10, 11],
  // https://www.griffinmsi.org/youth-and-families/rise-teen-program: "high school students in grades 9 through 12"
  "griffin-museum-of-science-and-industry-rise-teen-program": [9, 10, 11, 12],
  // https://k12education.lbl.gov/programs/high-school/sea-bilingual-stem-camp: "Students in grades 9 to 12 can apply"
  "berkeley-lab-k-12-sea-bilingual-stem-camp": [9, 10, 11, 12],
  // https://www.uvm.edu/admissions/vermont-pitch-challenge: "high school students in grades 10-12"
  "university-of-vermont-vermont-pitch-challenge": [10, 11, 12],
  // https://belinblank.education.uiowa.edu/students/swo/: "high school students in grades 9 to 11"
  "belin-blank-center-university-of-iowa-summer-writing-online": [9, 10, 11],
  // biology.indiana.edu (Holland SEP): "students in grades 8 to 10"; grade 8 is not a high school grade
  "indiana-university-bloomington-jim-holland-summer-enrichment-pro": [9, 10],
  // https://mmia.medicine.iu.edu/: "Indiana high school students in grades 10 to 12"
  "indiana-university-school-of-medicine-molecular-medicine-in-acti": [10, 11, 12],
  // https://www.amnh.org/learn-teach/teens/science-communication-internship-program: "Applicants are in 10th grade, no prior experience is required, and interns earn a $2,000 stipend."
  "amnh-scip": [10],
  // https://precollege.nd.edu/summer-scholars/dates-deadlines/: "Current sophomores and juniors who are at least 16 live in a Notre Dame residence hall during a two-week Summer Scholars session on campus."
  "notre-dame": [10, 11],
  // https://www.citytech.cuny.edu/collegenow/stem-research-academy.aspx: "A free College Now research program at City Tech for New York City public high school sophomores and juniors from partner schools under-served by science programs."
  "citytech-stem-ra": [10, 11],
  // https://www.hypothekids.org/hkmakerlab: "A free five-week summer engineering design program run by HYPOTHEkids with Columbia Engineering in New York City for high school sophomores and juniors."
  "columbia-engineering-hk-maker-lab": [10, 11],
  // https://www.scgsah.org/residential-high-school: "A public residential arts high school in South Carolina that is tuition-free and serves juniors and seniors, plus exceptional sophomores in Music and Dance; accepted students pay a residence hall deposit and a meal plan fee."
  "sc-governors-school-arts": [10, 11, 12],
  // https://www.utsouthwestern.edu/education/nondegree-programs/stars/programs/summer-research-opportunities.html: "Eight-week, non-residential summer program at UT Southwestern in Dallas where high school juniors do research in a faculty host's lab and present their results."
  "ut-southwestern-medical-center-stars-summer-research-program": [11],
  // https://www.roswellpark.org/education/high-school-undergrad/high-school-summer-research-program: "Open only to juniors enrolled in Erie, Niagara, Cattaraugus or Chautauqua county; it is commuter-based and there is no application fee."
  "roswell-park-comprehensive-cancer-center-high-school-summer-rese": [11],
  // https://www.feinberg.northwestern.edu/sites/stem-programs/hs.html: "High school applicants must be juniors when they apply and at least 16."
  "northwestern-university-feinberg-school-of-medicine-kimberly-que": [11],
  // https://farmvet2b.vetmed.ucdavis.edu/opportunities: "Its Farm Vet internship is a roughly 40-hour spring-break program for Tulare County juniors at the Veterinary Medicine Teaching and Research Center, with visits to a cow dairy, goat dairy and beef feedlot."
  "uc-davis-school-of-veterinary-medicine-student-opportunities-in": [11],
  // https://www.charlestoncounty.gov/ads/slip.php: "Applicants must live in the county and be juniors at a Charleston County public high school."
  "charleston-county-student-leadership-intern-program-cdc-ems": [11],
  // https://www.bu.edu/lernet/grow/about.html: "Applicants must be juniors at a Massachusetts school, live within 30 miles of Boston and be at least 16."
  "boston-university-greater-boston-research-opportunities-for-youn": [11],
  // https://sps.northwestern.edu/pre-college/college-bridge/: "A summer partnership between Northwestern University and Chicago Public Schools that lets high school juniors take a college course for credit."
  "northwestern-university-northwestern-pre-college-college-bridge": [11],
  // https://k12stem.engineering.nyu.edu/programs/cs4cs: "It is open to students in 10th or 11th grade who live in New York City or specific New Jersey and Nassau County areas."
  "new-york-university-computer-science-for-cyber-security-cs4cs": [10, 11],
  // https://www.thedoseum.org/internships: "An internship at The DoSeum, a children's museum in San Antonio, open to high school seniors and college students."
  "the-doseum-internship": [12],
  // https://skillsforri.com/prepareri-high-school-internship-program: "A paid 7-week summer internship run by Skills for Rhode Island's Future for Rhode Island public high school juniors, including charter and home school students."
  "skills-for-rhode-island-s-future-prepareri-high-school-internshi": [11],
  // https://indianactsi.org/education/student/seed-stem/: "An eight-week summer program from the Indiana CTSI that pairs Indiana high school sophomores, juniors and seniors with faculty mentors on research projects."
  "indiana-clinical-and-translational-sciences-institute-seed-stem": [10, 11, 12],
  // https://college.mayo.edu/academics/office-of-education-engagement-and-outreach/programs/mayo-clinic-cares/: "Applicants must be current sophomores or juniors at an Arizona high school, and no prior clinical experience is needed."
  "mayo-clinic-office-of-education-engagement-and-outreach-mayo-cli": [10, 11],
  // https://vpse.upenn.edu/smp/apply/: "A four-week summer college and career preparatory program at the University of Pennsylvania for Philadelphia high school students in 9th or 10th grade with at least a 3."
  "university-of-pennsylvania-provosts-summer-mentorship-program-sm": [9, 10],
  // https://www.shu.edu/undergraduate-admissions/pirates-pitch-competition.html: "A Shark Tank-style pitch competition run by Seton Hall University's Stillman School of Business for high school sophomores, juniors and seniors with a GPA of 3."
  "seton-hall-university-pirates-pitch-competition-for-high-school": [10, 11, 12],
  // https://geog.umd.edu/high-school-hub/high-school-internship-program-hip: "A paid six-week summer internship run remotely by the University of Maryland Department of Geographical Sciences for high school juniors and seniors from the DC, Maryland and Virginia region."
  "university-of-maryland-high-school-internship-program-in-geograp": [11, 12],
  // https://new.sewanee.edu/sywc/: "Applicants are in 9th, 10th or 11th grade when they apply and under 18 during the conference, and they live in Humphreys Hall with college-student counselors."
  "university-of-the-south-sewanee-young-writers-conference": [9, 10, 11],
  // https://newmanu.edu/academics/scholars-programs/investigative-summer-science-program: "A residential summer STEM camp at Newman University in Wichita for high school sophomores, juniors and seniors with at least a 3."
  "newman-university-investigative-summer-stem-program-issp": [10, 11, 12],
  // https://annieruthfoundation.org/programs/summer-internship/: "A paid summer internship program from the AnnieRuth Foundation for high school juniors and seniors in Duval County and nearby counties in Florida."
  "annieruth-foundation-annieruth-foundation-summer-internship-prog": [11, 12],
  // https://www.getty.edu/education/teen-programs/teen-gallery-guides/: "Applicants must be current sophomores or juniors in Los Angeles County, be 16 by the program start, and live within 25 miles of the Getty Center."
  "the-getty-villa-teen-gallery-guide": [10, 11],
  // https://www.hofstra.edu/academics/summer-science-research-program/: "Applicants must be in 10th or 11th grade, at least 15 by the start, U."
  "hofstra-university-hofstra-summer-science-research-program": [10, 11],
  // https://www.colorado.edu/business/oda/programs-high-school-students/business-leadership-program: "A free, week-long summer program run by the Opening Doors to Achievement office at CU Boulder's Leeds School of Business for Colorado high school juniors."
  "university-of-colorado-boulder-leeds-school-of-business-business": [11],
  // https://www.medschool.lsuhsc.edu/cancer_center/education-and-training/education-and-training-for-high-school-students.aspx: "Applicants must live in or near the New Orleans area, be high school juniors or seniors aged 16-18 when they apply, and attend a mandatory all-day orientation."
  "lsu-lcmc-health-cancer-center-cancer-center-summer-research-inte": [11, 12],
  // https://pageprogram.senate.gov/apply/: ", where high school pages work as Senate Sergeant at Arms employees and attend the Page School, which teaches junior-year Honors courses."
  "united-states-senate-us-senate-page-program": [11],
  // https://www.afsascholarship.org/high-school-scholarships/: "A no-essay scholarship contest from the American Fire Sprinkler Association for high school seniors who are U."
  "csv-sch-afsa-high-school-senior-scholarship-contest": [12],
  // https://www.jimmyranefoundation.org/scholarship-eligibility: "High school seniors need at least a 3."
  "csv-sch-jimmy-rane-foundation-scholarships": [12],
  // https://beyondtheboroughs.org/scholarship-eligibility: "Applicants are high school seniors or GED recipients entering college for the first time who plan to enroll full-time at an accredited two- or four-year or vocational-technical school, have a FAFSA Student Aid Index below $8,000, and are U."
  "csv-sch-beyond-the-boroughs-scholarship": [12],
  // https://www.elks.org/scholars/scholarships/mvs.cfm: "citizen high school seniors, with male and female applicants competing separately."
  "csv-sch-elks-national-foundation-scholarship": [12],
  // https://learnmore.scholarsapply.org/equitableexcellence/: "A scholarship from the Equitable Foundation, administered by Scholarship America, for high school seniors in the 50 states, D."
  "csv-sch-equitable-excellence-scholarship": [12],
  // https://www.uft.org/your-union/uft-programs/uft-scholarship-fund: "A college scholarship from the United Federation of Teachers for New York City public high school seniors graduating from vocational, academic, or alternative schools."
  "csv-sch-uft-scholarship-fund": [12],
  // https://imagine-america.org/students: "A scholarship from the Imagine America Foundation that gives graduating high school seniors a $1,000 award toward tuition at participating accredited career colleges and trade schools."
  "csv-sch-imagine-america-high-school-scholarship": [12],
};

/**
 * The site is for U.S. students, but some imported blurbs use British spelling
 * ("programme", "centre", "enrolment"). Only lower-case forms and a sentence-start
 * "Organised" are changed, and only in blurbs, so proper names such as Centre College
 * or a title an organiser chose are left as written.
 */
const US_SPELLING: [RegExp, string][] = [
  [/\bprogrammes\b/g, "programs"],
  [/\bprogramme\b/g, "program"],
  [/\bcentres\b/g, "centers"],
  [/\bcentre\b/g, "center"],
  [/\borganisations\b/g, "organizations"],
  [/\borganisation\b/g, "organization"],
  [/\borganised\b/g, "organized"],
  [/\bOrganised\b/g, "Organized"],
  [/\benrolment\b/g, "enrollment"],
  [/\bhonours\b/g, "honors"],
];

export function americanSpelling(s: string): string {
  return US_SPELLING.reduce((t, [re, to]) => t.replace(re, to), s);
}

const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const DAY_FIRST = new RegExp(`\\b(\\d{1,2}) (${MONTHS}),? (20\\d\\d)\\b`, "g");

/** "1 March 2027" -> "March 1, 2027": U.S. date order, as everywhere else on the site. */
export function usDates(s: string): string {
  return s.replace(DAY_FIRST, (_m, day: string, month: string, year: string) => `${month} ${Number(day)}, ${year}`);
}

/**
 * Each specific subject tag and the main subject it belongs to. The subject filter and
 * the subject hubs only use main subjects, and they assume a listing carries its main
 * subject alongside any specific tag; a Physics Olympiad tagged only "Physics" was
 * missing from STEM filters and from the STEM competitions page.
 */
export const SUBJECT_PARENTS: Record<string, string> = {
  Physics: "STEM", Chemistry: "STEM", Astronomy: "STEM", "Earth Science": "STEM", "Materials Science": "STEM",
  "Data Science": "STEM", Technology: "STEM", Science: "STEM",
  AI: "Computer Science", Robotics: "Engineering", Aerospace: "Engineering",
  Music: "Arts", Film: "Arts", Photography: "Arts", Design: "Arts", Architecture: "Arts", Media: "Arts",
  Finance: "Business", Entrepreneurship: "Business", Economics: "Business", Marketing: "Business",
  Journalism: "Writing",
  Law: "Policy", Government: "Policy", Civics: "Policy", Civic: "Policy",
  "Civic Leadership": "Leadership",
  Health: "Medicine", "Public Health": "Medicine", Healthcare: "Medicine", "Cancer Research": "Medicine",
  History: "Humanities", Philosophy: "Humanities", Languages: "Humanities", Linguistics: "Humanities", Ethics: "Humanities",
};

/** The fields with each specific tag's main subject added after it (no duplicates). */
export function withMainSubjects(fields: string[]): string[] {
  const out = [...fields];
  for (const f of fields) {
    const parent = SUBJECT_PARENTS[f];
    if (parent && !out.includes(parent)) out.push(parent);
  }
  return out;
}

/**
 * Feed artefacts around full stops: "Workshops, Inc.. Contact" (an org name ending in
 * "Inc." followed by the template's own full stop) and a site name cut off inside a
 * bracket ("HIGH SCHOOL (K6. Contact"). Ellipses are left alone.
 */
export function tidyStops(s: string): string {
  let out = s.replace(/(?<!\.)\.\.(?!\.)/g, ".");
  if ((out.match(/\(/g) ?? []).length !== (out.match(/\)/g) ?? []).length) {
    out = out.replace(/\s\(([^()]*?)(?=\.)/g, "");
  }
  return out;
}

/**
 * The NYC DYCD feed writes many site names in capitals ("Beacon Satellite at NYCHA BAY
 * VIEW HOUSES"). Runs of two or more shouted words become title case; acronyms, short
 * words (PS, IS, roman numerals, initials) and anything with a digit stay as written.
 * Only used for that feed, so real acronyms elsewhere ("NASA OSTEM") are not touched.
 */
const KEEP_CAPS = new Set(["NYCHA", "NYC", "DYCD", "YMCA", "YWCA", "CUNY", "SUNY", "STEM", "STEAM", "CTE", "HS", "JHS", "IS", "MS", "PS", "LGBTQ"]);
const SHOUTED_RUN = /\b[A-Z][A-Z.'&/-]*[A-Z.](?:\s+[A-Z0-9][A-Z0-9.'&/-]*)+/g;

function titleWord(w: string): string {
  if (KEEP_CAPS.has(w.replace(/[.,]/g, "")) || /\d/.test(w) || w.replace(/[^A-Z]/g, "").length <= 2) return w;
  return w
    .split(/([/-])/)
    .map((p) => (p.length > 1 && /^[A-Z']+[.,]?$/.test(p) && !KEEP_CAPS.has(p.replace(/[.,]$/, "")) ? p[0] + p.slice(1).toLowerCase() : p))
    .join("");
}

export function softenShouting(s: string): string {
  return s.replace(SHOUTED_RUN, (run) => {
    const loud = run.split(/\s+/).filter((w) => /[A-Z]{4,}/.test(w) && !KEEP_CAPS.has(w.replace(/[.,]/g, "")));
    return loud.length >= 2 ? run.split(/(\s+)/).map((w) => (/\s/.test(w) ? w : titleWord(w))).join("") : run;
  });
}

/** Apply every rule above to one listing, in place. */
export function applyDataHygiene(o: Opportunity): void {
  const nycFeed = typeof o.id === "string" && o.id.startsWith("nyc-");
  if (o.title) o.title = collapseSpaces(nycFeed ? softenShouting(o.title) : o.title);
  if (o.org) o.org = collapseSpaces(o.org);
  if (o.blurb && nycFeed) o.blurb = softenShouting(o.blurb);
  if (o.blurb) o.blurb = tidyStops(usDates(americanSpelling(endWithStop(repairTruncation(spaceAfterCommas(collapseSpaces(o.blurb)))))));
  if (o.url) o.url = cleanUrl(o.url);
  if (Array.isArray(o.fields)) o.fields = withMainSubjects(o.fields);
  const grades = GRADE_FIXES[o.id];
  if (grades) o.grades = [...grades];
}
