import type { Opportunity } from "@/data/opportunities";
import type { HsoReviewSep2026 } from "@/data/hsoUpdateSep2026";

/**
 * HSO catalogue update, October 2026. It follows the same pattern as hsoUpdateSep2026.ts.
 *
 *  - hsoAdditionsOct2026: national and regional programs the catalogue was missing, each
 *    checked on the official program page on 2026-10-07. A listing carries a date only when
 *    that page states one for the coming cycle; otherwise it shows "Deadline TBA".
 *  - hsoReviewOct2026: existing listings re-checked on 2026-10-07. These are next-cycle dates
 *    that were posted after the September review, plus corrections to eligibility, titles and
 *    categories. Every row quotes the official page it rests on in `evidence`.
 *
 * Wired into src/data/opportunities.ts next to the September update: the
 * `...hsoAdditionsOct2026` spread at the end of the `opportunities` array, and
 * `applyHsoUpdateOct2026(opportunities)` straight after `applyHsoUpdateSep2026`, so these
 * rows win over September's and over the automatic category cleanup.
 */

export const hsoAdditionsOct2026: Opportunity[] = [
  { id: "cbyx-congress-bundestag-youth-exchange", title: "Congress-Bundestag Youth Exchange (CBYX)", org: "U.S. Department of State / German Bundestag", category: "Fellowship", fields: ["Languages", "Policy", "Humanities"], location: "Worldwide", format: "In-person", cost: "Free", grades: [10, 11, 12], deadline: "2026-11-03", prestige: 3, blurb: "Fully funded scholarship from the U.S. Congress and German Bundestag for American high school students to spend an academic year in Germany, living with a host family and attending a German school.", url: "https://usagermanyscholarship.org/" },
  { id: "yes-abroad-kennedy-lugar", title: "Kennedy-Lugar YES Abroad", org: "U.S. Department of State", category: "Fellowship", fields: ["Languages", "Policy", "Humanities"], location: "Worldwide", format: "In-person", cost: "Free", grades: [9, 10, 11, 12], deadline: null, prestige: 3, blurb: "Fully funded U.S. Department of State program that sends American high school students abroad for a semester or academic year in countries with significant Muslim populations, with a host family and a local school.", url: "https://www.yes-abroad.org/" },
  { id: "mit-think-scholars", title: "MIT THINK Scholars Program", org: "MIT THINK (MIT student group)", category: "Competition", fields: ["STEM", "Research", "Engineering", "Computer Science"], location: "Online, USA", format: "Online", cost: "Free", grades: [9, 10, 11, 12], deadline: null, prestige: 2, blurb: "Submit a STEM research or invention proposal. Finalists get weekly mentorship, up to $1,000 in project funding and, where possible, an all-expenses-paid trip to MIT. Open to high school students with a permanent U.S. address.", url: "https://think.mit.edu/" },
  { id: "stanford-medical-youth-science-program-smysp", title: "Stanford Medical Youth Science Program (SMYSP)", org: "Stanford Medicine", category: "Summer Program", fields: ["Medicine", "Biology", "STEM"], location: "Stanford, California, USA", format: "In-person", cost: "Free", grades: [11], deadline: null, prestige: 3, blurb: "Tuition-free, five-week immersive medicine and health program at Stanford for low-income and first-generation high school juniors from Northern California.", url: "https://med.stanford.edu/che/smysp.html" },
  { id: "questbridge-college-prep-scholars", title: "College Prep Scholars Program", org: "QuestBridge", category: "Scholarship", fields: ["Leadership"], location: "USA", format: "Online", cost: "Free", grades: [11], deadline: null, prestige: 3, blurb: "For high-achieving juniors from households earning under $65,000 a year (family of four). Scholars get summer program scholarships, admissions conferences, free college visits and a head start on QuestBridge's National College Match in senior year.", url: "https://www.questbridge.org/apply-to-college/programs/college-prep-scholars-program" },
  { id: "national-student-poets-program", title: "National Student Poets Program", org: "Scholastic Art & Writing Awards / IMLS", category: "Competition", fields: ["Writing", "Humanities", "Arts"], location: "USA", format: "Hybrid", cost: "Free", grades: [10, 11], deadline: null, prestige: 3, blurb: "A national honor for young poets. Each year, five teens are chosen as youth poetry ambassadors for their region. Students in grades 10–11 who win a Gold Key for poetry in the Scholastic Awards may be invited to apply.", url: "https://www.artandwriting.org/programs/national-student-poets-program/" },
  { id: "princeton-prize-in-race-relations", title: "Princeton Prize in Race Relations", org: "Princeton University", category: "Competition", fields: ["Policy", "Humanities", "Leadership"], location: "USA", format: "Hybrid", cost: "Free", grades: [9, 10, 11, 12], deadline: null, prestige: 2, blurb: "Recognizes high school students who have shown leadership in advancing racial equity or promoting racial understanding in their schools or communities.", url: "https://pprize.princeton.edu/" },
];

export const hsoReviewOct2026: Record<string, HsoReviewSep2026> = {
  "rsi": { deadline: "2026-12-11", evidence: "2026-10-07, cee.org: 'Applications for RSI 2027 are open through 11:59pm December 11, 2026.'" },
  "dell": { deadline: "2027-01-12", opensAt: "2026-10-01", evidence: "2026-10-07, dellscholars.org/students: 'Important Dates. 2026. OCT 1. Application Opens. 2027. JAN 12. Application Deadline.'" },
  "horatio-alger": { blurb: "Up to $25,000 for college for high school juniors who have overcome significant adversity. 105 were selected for the Class of 2027.", evidence: "2026-10-07, Class of 2027 announcement (horatioalger.org, 2026-06-10): '105 Current High School Juniors Selected' and 'A total of 105 exceptional high school juniors from across the United States will each receive up to $25,000'. The listing said seniors; grades are corrected in applyHsoUpdateOct2026." },
  "ill-mathematics": { title: "Stanford University Mathematics Camp (SUMaC)", evidence: "2026-10-07: the listing was titled 'Sumac'. The official site (sumac.spcs.stanford.edu) names the program the Stanford University Mathematics Camp (SUMaC)." },
  "fred-hutchinson-cancer-center-summer-high-school-internship-prog": { blurb: "Eight-week, full-time paid lab internship for rising seniors (16 or older) from the greater Seattle area. Two weeks of lab-skills training, then six weeks embedded in a Fred Hutch research group. Details of the 2027 program will be posted in November.", evidence: "2026-10-07, fredhutch.org SHIP page: 'eight-week, full-time paid internship for rising 12th graders'; 'Must currently reside in Greater Seattle or surrounding areas'; 'Be 16 years or older by start of program'; 'Information on the 2027 program will be posted in November.' The listing did not say that only local students can apply; grades are corrected in applyHsoUpdateOct2026." },
  "congressional-award": { category: "Competition", evidence: "2026-10-07: the automatic category cleanup read 'volunteer service' in the blurb and filed the Congressional Award as Volunteer, which hid it from the catalogue. It is an award students earn and apply for (Bronze, Silver and Gold certificates and medals), not a volunteer shift, so it goes back to its original category." },
};

/** Grade corrections, kept out of HsoReviewSep2026 so that type stays unchanged. */
const gradeFixesOct2026: Record<string, number[]> = {
  "horatio-alger": [11],
  // "Rising 12th graders" apply during 11th grade, the convention used for RSI and other programs for rising seniors.
  "fred-hutchinson-cancer-center-summer-high-school-internship-prog": [11],
};

/** Applies the October review. Call it straight after applyHsoUpdateSep2026. */
export function applyHsoUpdateOct2026(list: Opportunity[]): void {
  for (const opportunity of list) {
    const grades = gradeFixesOct2026[opportunity.id];
    if (grades) opportunity.grades = grades;
    const review = hsoReviewOct2026[opportunity.id];
    if (!review) continue;
    if (review.deadline !== undefined) opportunity.deadline = review.deadline;
    if (review.opensAt !== undefined) opportunity.opensAt = review.opensAt;
    if (review.url) opportunity.url = review.url;
    if (review.title) opportunity.title = review.title;
    if (review.blurb) opportunity.blurb = review.blurb;
    if (review.category) opportunity.category = review.category;
    if (review.location) opportunity.location = review.location;
    if (review.format) opportunity.format = review.format;
    if (review.cost) opportunity.cost = review.cost;
  }
}
