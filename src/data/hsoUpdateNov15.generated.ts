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
};

export const NOV15_REMOVED: Record<string, string> = {
};
