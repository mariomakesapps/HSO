import { allOpportunities, type Opportunity } from "@/data/opportunities";

/**
 * The deadline view.
 *
 * Every other page answers "what exists?". This one answers "what closes next?",
 * which is the only question that brings a student back more than once. It is a
 * cross-cutting view like /remote — not a category — built from the `deadline`
 * and `opensAt` dates that the catalogue already verifies against official pages.
 *
 * Buckets are computed from a `now` that callers pass in, so the same function
 * serves the page at runtime and the prerenderer at build time, and so the unit
 * tests do not depend on the day they happen to run.
 */

export const DEADLINES_PATH = "/deadlines";

export type DeadlineBucketId = "this-week" | "this-month" | "next-90" | "opening-soon";

export interface DeadlineBucket {
  id: DeadlineBucketId;
  title: string;
  blurb: string;
  items: Opportunity[];
}

const DAY = 86_400_000;

/** Whole days from `now` until an ISO date, rounded up. Null when unparseable. */
export function daysUntil(iso: string | null | undefined, now: number): number | null {
  if (!iso) return null;
  const t = new Date(`${iso}T23:59:59`).getTime();
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - now) / DAY);
}

/** Listings whose application window is open now and closes within `withinDays`. */
export function closingWithin(
  list: Opportunity[],
  withinDays: number,
  now: number,
): Opportunity[] {
  return list
    .filter((o) => {
      const opens = daysUntil(o.opensAt, now);
      if (opens !== null && opens > 0) return false; // not open yet — belongs in "opening soon"
      const left = daysUntil(o.deadline, now);
      return left !== null && left >= 0 && left <= withinDays;
    })
    .sort((a, b) => String(a.deadline).localeCompare(String(b.deadline)));
}

/** Listings that have not opened yet but publish an opening date within `withinDays`. */
export function openingWithin(
  list: Opportunity[],
  withinDays: number,
  now: number,
): Opportunity[] {
  return list
    .filter((o) => {
      const opens = daysUntil(o.opensAt, now);
      return opens !== null && opens > 0 && opens <= withinDays;
    })
    .sort((a, b) => String(a.opensAt).localeCompare(String(b.opensAt)));
}

/**
 * The four groups the page renders, in the order a student cares about them.
 * A listing appears in exactly one bucket: the windows do not overlap.
 */
export function deadlineBuckets(now: number = Date.now()): DeadlineBucket[] {
  const list = allOpportunities;
  const week = closingWithin(list, 7, now);
  const month = closingWithin(list, 30, now).filter((o) => !week.includes(o));
  const quarter = closingWithin(list, 90, now).filter(
    (o) => !week.includes(o) && !month.includes(o),
  );

  return [
    {
      id: "this-week",
      title: "Closing this week",
      blurb: "Seven days or fewer. If any of these fit you, start today.",
      items: week,
    },
    {
      id: "this-month",
      title: "Closing this month",
      blurb: "Eight to thirty days out — still enough time for a recommendation letter.",
      items: month,
    },
    {
      id: "next-90",
      title: "Closing in the next three months",
      blurb: "Far enough out to plan properly, close enough to put in your calendar.",
      items: quarter,
    },
    {
      id: "opening-soon",
      title: "Opening soon",
      blurb: "Applications are not live yet, but these programs publish an opening date.",
      items: openingWithin(list, 90, now),
    },
  ];
}

/** Total number of dated listings the page shows — used in copy and metadata. */
export function deadlineCount(now: number = Date.now()): number {
  return deadlineBuckets(now).reduce((n, b) => n + b.items.length, 0);
}

export const DEADLINES_META = {
  title: "High School Deadlines: What Closes Next | HSO",
  h1: "Application deadlines closing soon",
  description:
    "Every high school internship, scholarship, summer program and competition on HSO with a confirmed upcoming deadline — grouped by what closes this week, this month, and in the next three months.",
  intro:
    "Dates on this page are read off each program's own page and rechecked; anything we cannot confirm is listed as Deadline TBA instead of guessed.",
  guide: [
    "Most lists of high school programs are written once and left to rot, so by the time you read one, half the dates belong to a cycle that already closed. The dates here come from the official program page, and a listing only carries a date when that page states one for the coming cycle — otherwise it says Deadline TBA rather than repeating last year's date with the year changed.",
    "Work backwards from the deadline, not forwards from today. A recommendation letter needs two to three weeks of notice to be any good, transcripts can take a week to arrive, and the strongest essays are the ones that sat in a drawer for a few days before you sent them. A program closing in ten days is realistic; the same program closing in three is usually not.",
    "Apply to a spread, not a single favourite. Free national programs are the most competitive things on this page precisely because they cost nothing to enter, so pair one or two reaches with something local — a university near you, a state program, a hospital or museum in your city.",
  ],
  faqs: [
    {
      q: "How often are these deadlines checked?",
      a: "Each date was read off the program's official page when the listing was added or last reviewed, and the quote it rests on is stored with the listing. Dates that could not be confirmed are shown as Deadline TBA rather than estimated.",
    },
    {
      q: "Why do some programs say Deadline TBA?",
      a: "Because the program has not published its next cycle yet. Many open applications in the autumn for the following summer, so a listing marked TBA in September often has a date by November. Those are worth checking back on.",
    },
    {
      q: "What does Opening soon mean?",
      a: "The program has announced when applications open but has not opened them yet. Note the date, prepare your materials in the meantime, and apply early in the window — some programs review on a rolling basis.",
    },
    {
      q: "I missed a deadline. Is that it?",
      a: "Almost always, no. Nearly every program on HSO runs annually, so a closed deadline means you are early for next year rather than late for this one. Use the time to build the project or coursework the application will ask about.",
    },
  ],
} as const;
