/**
 * Structured facts about the guides, shared by the guide pages and their head
 * tags (src/lib/pageMeta.ts), so the visible FAQ and the FAQPage markup are the
 * same text and the Article dates are written once.
 */
export interface GuideArticle {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}

export const GUIDE_ARTICLES: Record<string, GuideArticle> = {
  "/guides/top-medical-internships": {
    headline: "Best Medical Internships for High School Students (2026 Comparison)",
    description:
      "Side-by-side comparison of the top medical and biomedical research internships for high school students: JHIBS, Stanford SIMR, NIH HiSTEP, NIH HS-SIP, Rockefeller SSRP, and MIT RSI.",
    datePublished: "2026-07-08",
    dateModified: "2026-10-10",
  },
  "/guides/top-research-competitions": {
    headline: "Best Research Competitions for High School Students (2026 Comparison)",
    description:
      "Side-by-side comparison of the top research competitions for high schoolers: Regeneron STS, ISEF, JSHS, Biotech Prize, Davidson Fellows, and the Conrad Challenge.",
    datePublished: "2026-07-22",
    dateModified: "2026-10-10",
  },
  "/guides/top-business-summer-programs": {
    headline: "Best Business Summer Programs for High School Students (2026 Comparison)",
    description:
      "Compare Wharton Global Youth, Berkeley Haas B-BAY, and NYU Stern high school business programs on cost, selectivity, and grade level.",
    datePublished: "2026-07-29",
    dateModified: "2026-10-10",
  },
  "/guides/high-school-law-internships": {
    headline: "High School Law Internships: How to Find and Land One (2026)",
    description:
      "How U.S. high school students find law internships: national programs, local firm outreach, deadlines, and what to send.",
    datePublished: "2026-07-30",
    dateModified: "2026-10-10",
  },
};

export const LAW_GUIDE_FAQS = [
  {
    q: "Can a high school student really get a law internship?",
    a: "Yes, but almost never through a national posting. Most high school law internships come from direct outreach to small local firms, public defender and district attorney offices, legal aid nonprofits, and county bar associations. Structured national programs exist, but they are limited and competitive.",
  },
  {
    q: "Are high school law internships paid?",
    a: "Most are unpaid or offer a small stipend. Nonprofit legal aid organizations and city youth-employment programs are the most likely to pay; private firms usually offer unpaid shadowing or administrative roles.",
  },
  {
    q: "When should I apply?",
    a: "Start outreach in January or February for a summer placement. Formal programs mostly close between February and April, and local firms fill informal spots by late spring.",
  },
  {
    q: "What do I need to apply?",
    a: "A one-page resume, a short cover email naming why that specific office, a transcript, and one teacher reference. Mock trial, debate, or student government experience is the most useful thing to highlight.",
  },
];
