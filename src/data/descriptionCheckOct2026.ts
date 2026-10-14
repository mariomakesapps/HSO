import type { Opportunity } from "@/data/opportunities";

/**
 * Description refresh, 2026-10-14.
 *
 * 191 listings had descriptions under 90 characters ("World's top high school
 * programming competition."), too thin to tell a student whether to apply. Each
 * row here replaces one with a plain description built only from facts the
 * official program page states: what students do, who can apply, length, format,
 * cost and how to enter. Dates are left out on purpose; they live in the deadline
 * fields. `evidence` names the page and the facts it rests on.
 *
 * A row can also correct a field the official page contradicts (grades, cost,
 * format, location), quoted in `evidence`.
 *
 * Applied straight after applyDeadlineCheckOct2026 in src/data/opportunities.ts.
 * Listings whose blurb the deadline check already rewrote are not touched here.
 */
export type DescriptionRow = {
  blurb?: string;
  grades?: number[];
  cost?: Opportunity["cost"];
  format?: Opportunity["format"];
  location?: string;
  /** A wording fix with no new facts: not a check against the official page, so not a "last checked" date. */
  wordingOnly?: true;
  evidence: string;
};

export const descriptionCheckOct2026: Record<string, DescriptionRow> = {
  "nyt-essay": {
    blurb: "Write a 450-word editorial on an issue you care about.",
    wordingOnly: true,
    evidence: "2026-10-14: the old blurb ended 'an issue you care.' (a missing word). Wording fix only; no new facts.",
  },
};

export function applyDescriptionCheckOct2026(list: Opportunity[]): void {
  for (const opportunity of list) {
    const row = descriptionCheckOct2026[opportunity.id];
    if (!row) continue;
    if (row.blurb) opportunity.blurb = row.blurb;
    if (row.grades) opportunity.grades = row.grades;
    if (row.cost) opportunity.cost = row.cost;
    if (row.format) opportunity.format = row.format;
    if (row.location) opportunity.location = row.location;
  }
}
