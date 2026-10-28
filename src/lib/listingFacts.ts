import type { Opportunity } from "@/data/opportunities";
import type { CategoryFAQ } from "@/lib/categories";
import { academicCycle } from "@/lib/hubStats";
import { nextListingDate } from "@/lib/listingSeo";

/**
 * Key facts and a short FAQ for every listing page (SEO plan P0-3 and P2-2),
 * answering what searchers ask ("when does X open", "is X free", "who can apply
 * to X") in plain text near the top of the page. Built only from the listing's
 * own fields: anything the catalogue doesn't know (amounts, essays, selectivity)
 * points to the official page instead of being guessed.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-12-11" -> "December 11, 2026". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** "2026-10-25" -> "October 2026". */
export function monthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

type Facts = Pick<Opportunity, "title" | "deadline" | "opensAt" | "cost" | "grades" | "location" | "format">;

export function datesText(opp: Facts, today: string): string {
  const next = nextListingDate(opp, today);
  if (next?.kind === "opens")
    return opp.deadline && opp.deadline > next.iso
      ? `Applications open ${longDate(next.iso)} and close ${longDate(opp.deadline)}.`
      : `Applications open ${longDate(next.iso)}.`;
  if (next) return `The deadline is ${longDate(next.iso)}.`;
  if (opp.deadline)
    return `The last posted deadline, ${longDate(opp.deadline)}, has passed. The date for the next cycle isn't posted yet, so check the official page.`;
  return `No date is posted for the ${academicCycle(today)} cycle yet. Check the official page for when applications open.`;
}

export function costText(cost: Opportunity["cost"]): string {
  if (cost === "Free") return "Free to take part.";
  if (cost === "Stipend") return "Free to take part, and it pays a stipend or award.";
  return "Charges tuition or a fee. Check the official page for the amount and whether financial aid is offered.";
}

function gradesText(grades: number[]): string {
  const g = [...grades].sort((a, b) => a - b);
  return g.length === 1 ? `grade ${g[0]}` : `grades ${g[0]} to ${g[g.length - 1]}`;
}

function whereText(opp: Facts): string {
  const place = opp.location.replace(/,?\s*USA$/, "").trim() || "nationwide";
  if (opp.format === "Online") return "It runs online.";
  if (opp.format === "Hybrid") return `It runs online and in person (${place}).`;
  return `It takes place in person in ${place}.`;
}

export function keyFacts(opp: Facts, today: string): { label: string; value: string }[] {
  return [
    { label: "Who can apply", value: `High school students in ${gradesText(opp.grades)}. ${whereText(opp)}` },
    { label: "Cost", value: costText(opp.cost) },
    { label: "Dates", value: datesText(opp, today) },
  ];
}

export function listingFaqs(opp: Facts, today: string): CategoryFAQ[] {
  const next = nextListingDate(opp, today);
  const name = opp.title;
  return [
    {
      q: next?.kind === "opens" ? `When do applications for ${name} open?` : `When is the ${name} deadline?`,
      a: datesText(opp, today),
    },
    {
      q: `Is ${name} free?`,
      a:
        opp.cost === "Free"
          ? `Yes. ${name} is free to take part in.`
          : opp.cost === "Stipend"
            ? `Yes, and it pays participants a stipend or award.`
            : `No. It charges tuition or a fee. Check the official page for the amount and whether financial aid is offered.`,
    },
    {
      q: `Who can apply to ${name}?`,
      a: `High school students in ${gradesText(opp.grades)}. ${whereText(opp)} Age, residency and citizenship rules are on the official page.`,
    },
  ];
}
