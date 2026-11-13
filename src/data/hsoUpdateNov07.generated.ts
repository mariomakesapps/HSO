/* Catalogue update of 2026-11-07: deadlines re-checked against official pages for
   the top listings. Corrected dates and listings removed because the official site
   shows they ended or are paused. Each change's evidence is a comment above it. */

import type { Opportunity } from "@/data/opportunities";

export const NOV07_FIXES: Record<string, Partial<Opportunity>> = {
  // https://www.bu.edu/cfa/tanglewood/faq/ | "The application is due on January 15, 2027, 11:59pm, ET." (the admissions page says January 19, 2027; the earlier official date is shown)
  "tanglewood": { deadline: "2027-01-15" },
  // AFRL Scholars page | "applications will open October 12th, 2026, and remain open until January 11th, 2027, 23:59:59 US/Central"
  "afrl-scholars": { opensAt: "2026-10-12" },
  // https://www.uwc-usa.org/admissions/uwc-usa/ (admissions for U.S. citizens and permanent residents) | "Early application deadline: November 1, 2026. Regular Application Deadline: January 1, 2027."
  "uwc": { deadline: "2027-01-01" },
  // https://pgss-applications.pa-gov-schools.org/applicants | "Sunday, January 31 at 11:59 PM". The page gives no year, but January 31 is a Sunday in 2027 (not 2026), and the home page says "PGSS 2027 applications will be available in October, 2026" with decisions by April 1, 2027.
  "state-pennsylvania-pgss": { deadline: "2027-01-31" },
  // IJAS students page (2027 cycle): State Exposition April 30 - May 1, 2027 at Bradley University, Peoria
  "illinois-junior-academy-of-science-illinois-junior-academy-of-sc": { location: "Peoria, Illinois, USA" },
  // https://www.societyforscience.org/regeneron-sts/frequently-asked-questions/ | The 2028 application will open June 1, 2027 and close in early November 2027.
  "regeneron-sts": { opensAt: "2027-06-01" },
  // https://gsfta.com/ | "Vocal/Instrumental Music and Filmmaking Application Deadline (Student Portion): January 15, 2027"; dance, theatre and visual arts student applications are due November 20, 2026. The earlier date is shown so no applicant misses it.
  "middle-tennessee-state-university-governors-school-for-the-arts": { deadline: "2026-11-20" },
  // https://nhsee.org/High-School-Fair | Pre-Approval: Friday December 4, 2026. Forms and Research Plan Final Submittal: Sunday February 7, 2027 by 5:00pm.
  "new-hampshire-science-and-engineering-exposition-new-hampshire-s": { deadline: "2027-02-07" },
  // https://www.nyssef.org/ | NYSSEF ISEF 2027 registration opens Dec. 7, 2026 and closes January 22, 2027
  "new-york-state-science-and-engineering-fair-new-york-state-scien": { deadline: "2027-01-22", opensAt: "2026-12-07" },
  // https://precollege.wisc.edu/badger-summer-scholars/ | Applications open January 12, 2027 ... application deadline May 1, 2027
  "state-wisconsin-badger": { deadline: "2027-05-01", opensAt: "2027-01-12" },
  // https://www.asfaschool.org/apply | Application window open runs from late October 2026 through January 22, 2027.
  "alabama-school-fine-arts": { deadline: "2027-01-22" },
  // Cost and format labels that disagreed with the listing's own description (written from the official page).
  // the 2026 session cost $350
  "university-of-wyoming-engineering-summer-program": { cost: "Paid" },
  // The $500 fee covers meals, housing and field trips
  "wvu-tech-camp-stem": { cost: "Paid" },
  // Each workshop costs $120
  "university-of-colorado-denver-college-of-architecture-and-planni": { cost: "Paid" },
  // in person or fully online
  "university-of-maryland-pre-college-programs-at-the-university-of": { format: "Hybrid" },
  // offered fully online or in person
  "babson-college-summer-study-for-high-school-students": { format: "Hybrid" },
  // Selected students receive a $1,000 scholarship
  "moffitt-cancer-center-high-school-internship-program-in-integrat": { cost: "Stipend" },
};

export const NOV07_REMOVED: Record<string, string> = {
  // Checked 2026-11-13: https://healthinfo.montana.edu/pathways-programs/medstart.html and its parent page return 404.
  "montana-office-of-rural-health-and-area-health-education-center": "/categories/summer-programs",
  // Checked 2026-11-13: the camp page has no readable content and points to a site style-guide page; facts can't be confirmed.
  "sheet-metal-and-air-conditioning-contractors-national-associatio": "/categories/summer-programs",
  // Checked 2026-11-13: the camp page is marked noindex and shows no readable content; facts can't be confirmed.
  "unlv-school-of-nursing-nurse-camp": "/categories/summer-programs",
};
