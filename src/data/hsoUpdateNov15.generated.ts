/* Catalogue update of 2026-11-15: listings whose deadline had passed, re-checked
   against official pages for the next cycle's dates, and listings removed because
   the official site shows they ended or are paused. Each change's evidence is a
   comment above it. */

import type { Opportunity } from "@/data/opportunities";

export const NOV15_FIXES: Record<string, Partial<Opportunity>> = {
  // https://tcr.org/submit | "Essays are accepted on a 'rolling admissions' basis ... For consideration for the Summer issue, your paper should be received by February 1" (issue cutoffs repeat every year with no year given)
  "concord": { deadline: null },
  // https://fromthetop.org/apply/become-a-fellow/ | "We keep applications open year-round, but available slots become limited as the school year progresses." (the November 9, 2026 date applied only to seniors)
  "ymf": { deadline: null },
  // Generic title: name the museum, as the official page does
  "crystal-bridges-museum-of-american-art-high-school-internships": { title: "Crystal Bridges High School Internships" },
  // Grade rule: list the grade being entered. These blurbs (written from the official
  // pages) say the program is for rising seniors, so grades are [12].
  "beaver-works": { grades: [12] },
  "nyc-ladders-leaders": { grades: [12] },
  "state-arkansas-governors-school": { grades: [12] },
  "st-jude-children-s-research-hospital-high-school-research-immers": { grades: [12] },
  "fred-hutchinson-cancer-center-summer-high-school-internship-prog": { grades: [12] },
  "texas-tech-university-anson-l-clark-scholars-program": { grades: [12] },
  "northwestern-university-medill-cherubs": { grades: [12] },
  "university-of-utah-john-and-marcia-price-college-of-engineering": { grades: [12] },
  "ragon-institute-rise-ragon-institute-summer-experience": { grades: [12] },
  "american-fisheries-society-hutton-junior-fisheries-biology-progr": { grades: [12] },
  "mikva-challenge-mikva-summer-fellowship": { grades: [12] },
  "massachusetts-clean-energy-commission-vocational-internship-prog": { grades: [12] },
  "rochester-institute-of-technology-center-for-imaging-science-sum": { grades: [12] },
  "uc-irvine-cancer-research-institute-youth-science-fellowship-pro": { grades: [12] },
  "university-of-southern-california-usc-bovard-scholars": { grades: [12] },
  "university-of-notre-dame-leadership-seminars": { grades: [12] },
  "massachusetts-general-hospital-mgh-youth-neurology-education-and": { grades: [12] },
  "university-of-north-carolina-at-chapel-hill-project-uplift": { grades: [12] },
  "university-of-north-carolina-at-chapel-hill-uplift-plus": { grades: [12] },
  "university-of-kansas-center-for-remote-sensing-and-integrated-sy": { grades: [12] },
  "mercy-university-summer-leadership-academy": { grades: [12] },
  "colorado-school-of-mines-summet-program": { grades: [12] },
  "university-of-tennessee-haslam-college-of-business-business-educ": { grades: [12] },
  "the-ohio-state-university-comprehensive-cancer-center-the-james": { grades: [12] },
  "yale-university-department-of-astronomy-yale-summer-program-in-a": { grades: [12] },
  // These blurbs say rising juniors and seniors (rising 11th and 12th graders): [11, 12].
  "nyu-precollege": { grades: [11, 12] },
  "morgan-state-university-summer-academy-of-actuarial-and-mathemat": { grades: [11, 12] },
  "university-of-washington-allen-school-uw-allen-school-changemake": { grades: [11, 12] },
  "translational-genomics-research-institute-tgen-tgen-bioscience-l": { grades: [11, 12] },
  "george-washington-university-school-of-medicine-and-health-scien": { grades: [11, 12] },
  "discovery-partners-institute-university-of-illinois-digital-scho": { grades: [11, 12] },
  "university-of-tennessee-at-chattanooga-governors-school-for-pros": { grades: [11, 12] },
  "landmark-college-summer-programs-at-landmark-college": { grades: [11, 12] },
  "samford-university-alabama-governors-school": { grades: [11, 12] },
  "drexel-university-college-of-medicine-neuroscience-camp-for-high": { grades: [11, 12] },
  // JCamp: "open to all high school sophomores and juniors" for a summer program, so rising juniors and seniors.
  "asian-american-journalists-association-jcamp": { grades: [11, 12] },
  // Blurb: "for 10 rising sophomores and juniors" -> [10, 11].
  "mad-artslife": { grades: [10, 11] },
  // Blurb: "High school applicants are rising sophomores and juniors" -> [10, 11].
  "musc-hollings-cancer-center-sc-cheer-youth-enjoy-science-yes-pro": { grades: [10, 11] },
  // Blurb: "Fellows apply as rising juniors" -> [11].
  "youthbridge-ny-youthbridge-ny-fellowship": { grades: [11] },
  // Blurb: a multi-year program "starting as rising sophomores" -> [10, 11, 12].
  "pomona-college-pomona-college-academy-for-youth-success-pays": { grades: [10, 11, 12] },
  // Blurb: "a compensated two-week virtual summer program ... for rising high school sophomores and juniors"
  "huntsman-cancer-institute-university-of-utah-cancer-research-hig": { grades: [10, 11], format: "Online" },
  // Scholarships are labeled Stipend (students receive money); these full-ride and award
  // scholarships were marked Free.
  "morehead-cain": { cost: "Stipend" },
  "jefferson-scholars": { cost: "Stipend" },
  "park-scholarships": { cost: "Stipend" },
  "bgca-youth-of-the-year": { cost: "Stipend" },
};

export const NOV15_REMOVED: Record<string, string> = {
  // https://carnegiehall.org/Education/Programs/National-Youth-Ensembles/NYO2 "In summer 2027, NYO2 will not convene as preparations are underway for a new iteration of the program to debut in summer 2028."
  "carnegie-hall-weill-music-institute-nyo2": "/categories/summer-programs",
  // https://www.clevelandfed.org/diversity-equity-inclusion/career-readiness (checked 2026-11-24): the page now holds only lesson plans; the only mention of Fed Futures found is a 2021 press release.
  "federal-reserve-bank-of-cleveland-fed-future-professionals-progr": "/categories/internships",
  // https://auburn.edu/cosam/outreach/stem_outreach/programs/SSI (checked 2026-11-25): redirects to the COSAM outreach homepage; auburn.edu/cosam/ssi redirects to the COSAM homepage; no current program page.
  "auburn-university-college-of-sciences-and-mathematics-summer-sci": "/categories/summer-programs",
};
