/* Catalogue update of 2026-11-07: deadlines re-checked against official pages for
   the top listings. Corrected dates and listings removed because the official site
   shows they ended or are paused. Each change's evidence is a comment above it. */

import type { Opportunity } from "@/data/opportunities";

export const NOV07_FIXES: Record<string, Partial<Opportunity>> = {
  // https://www.bu.edu/cfa/tanglewood/faq/ | "The application is due on January 15, 2027, 11:59pm, ET." (the admissions page says January 19, 2027; the earlier official date is shown)
  "tanglewood": { deadline: "2027-01-15" },
  // AFRL Scholars page | "applications will open October 12th, 2026, and remain open until January 11th, 2027, 23:59:59 US/Central"
  "afrl-scholars": { opensAt: "2026-10-12" },
  // https://uwc.org/how-to-apply/ | Each UWC national committee sets its own deadline (e.g. 20 Nov 2026 in one country, 10 January 2027 in another); the stored January 1 date is not on the official page, so no single date is shown.
  "uwc": { deadline: null },
  // https://sciences.pa-gov-schools.org/ | "PGSS 2027 applications will be available in October, 2026." No 2027 deadline is posted. The 2027-01-31 date was cleared in the Sep 2026 review as never announced and later put back by the Oct 2026 update; it is cleared again.
  "state-pennsylvania-pgss": { deadline: null },
  // IJAS students page (2027 cycle): State Exposition April 30 - May 1, 2027 at Bradley University, Peoria
  "illinois-junior-academy-of-science-illinois-junior-academy-of-sc": { location: "Peoria, Illinois, USA" },
};

export const NOV07_REMOVED: Record<string, string> = {
};
