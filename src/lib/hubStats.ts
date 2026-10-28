import type { Opportunity } from "@/data/opportunities";
import type { CategoryFAQ } from "@/lib/categories";

/**
 * Facts about a list of listings, and sentences built only from them, for hub
 * and sub-hub pages: how many, how many are free, when deadlines fall, which
 * grades can apply. Nothing here is written by hand, so it cannot drift from the
 * catalogue.
 */
export interface HubStats {
  total: number;
  free: number;
  stipend: number;
  paid: number;
  online: number;
  grade9: number;
  grade12: number;
  dated: number;
  /** Months with the most deadlines, most first ("March", "January"). */
  topMonths: string[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function hubStats(list: Opportunity[]): HubStats {
  const months = new Map<number, number>();
  for (const o of list) {
    if (!o.deadline) continue;
    const m = Number(o.deadline.slice(5, 7)) - 1;
    months.set(m, (months.get(m) ?? 0) + 1);
  }
  const topMonths = [...months.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 3)
    .map(([m]) => MONTH_NAMES[m]);
  return {
    total: list.length,
    free: list.filter((o) => o.cost === "Free").length,
    stipend: list.filter((o) => o.cost === "Stipend").length,
    paid: list.filter((o) => o.cost === "Paid").length,
    online: list.filter((o) => o.format === "Online").length,
    grade9: list.filter((o) => o.grades?.includes(9)).length,
    grade12: list.filter((o) => o.grades?.includes(12)).length,
    dated: list.filter((o) => o.deadline).length,
    topMonths,
  };
}

const joinList = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function deadlineSentence(label: string, s: HubStats): string {
  if (s.dated >= 3 && s.topMonths.length)
    return `${s.dated} of the ${s.total} ${label} have a confirmed deadline on HSO, and most of those fall in ${joinList(s.topMonths)}.`;
  return `Few of these ${label} have a confirmed deadline on HSO yet, so check each official page for this cycle's dates.`;
}

/** "At a glance" paragraphs for a hub page. `label` is plural and lower case ("STEM competitions"). */
export function glanceParagraphs(label: string, s: HubStats): string[] {
  const money = [
    `${s.free} ${s.free === 1 ? "is" : "are"} free`,
    s.stipend ? `${s.stipend} pay a stipend or award` : "",
    s.paid ? `${s.paid} charge tuition or a fee` : "",
  ].filter(Boolean);
  return [
    `HSO lists ${s.total} ${label}. Of those, ${joinList(money)}.${s.online ? ` ${s.online} run fully online.` : ""}`,
    deadlineSentence(label, s),
    `${s.grade9} accept 9th graders and ${s.grade12} are open to seniors. Every listing links to the official page, where the final word on eligibility and dates always is.`,
  ];
}

/** FAQ answered from the data, shown on the page and mirrored in FAQPage JSON-LD. */
export function hubFaqs(label: string, s: HubStats): CategoryFAQ[] {
  return [
    {
      q: `How many ${label} does HSO list?`,
      a: `${s.total}. Each listing shows the cost, grades and location, the deadline when one is posted, and a link to the official page.`,
    },
    {
      q: `Are there free ${label}?`,
      a: s.free
        ? `Yes. ${s.free} of the ${s.total} are free${s.stipend ? `, and ${s.stipend} pay a stipend or award` : ""}.`
        : `None of the ${s.total} listed here are free. Check each program's page for financial aid.`,
    },
    { q: `When are ${label} deadlines?`, a: deadlineSentence(label, s) },
    {
      q: `Can 9th graders apply to ${label}?`,
      a: `${s.grade9} of the ${s.total} accept 9th graders, and ${s.grade12} accept seniors. Grade rules vary by program, so confirm on the official page.`,
    },
  ];
}

/** The application cycle a page covers: "2026-27" from July 2026 to June 2027. */
export function academicCycle(today: string): string {
  const year = Number(today.slice(0, 4));
  const start = Number(today.slice(5, 7)) >= 7 ? year : year - 1;
  return `${start}-${String(start + 1).slice(2)}`;
}
