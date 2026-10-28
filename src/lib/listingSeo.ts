import type { Opportunity } from "@/data/opportunities";

/**
 * Title and meta description templates for listing pages (SEO plan P1-3).
 *
 * Built from the listing's live data, so the date in a title or snippet is never
 * older than the catalogue. A reviewed SEO title still supplies the programme
 * name (it sometimes adds a disambiguating org, "High School Internship Program -
 * Lockheed Martin"); the cycle, org and date around it come from here.
 *
 * Only facts in the catalogue are used: no prices, no guessed dates.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** "2026-12-11" -> "Dec 11". */
function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

/** The date a student should act on: an upcoming deadline, else an upcoming opening. */
export function nextListingDate(
  opp: Pick<Opportunity, "deadline" | "opensAt">,
  today: string,
): { kind: "deadline" | "opens"; iso: string } | undefined {
  if (opp.opensAt && opp.opensAt > today) return { kind: "opens", iso: opp.opensAt };
  if (opp.deadline && opp.deadline >= today) return { kind: "deadline", iso: opp.deadline };
  return undefined;
}

const STOP = new Set([
  "the", "of", "for", "and", "at", "in", "a", "an", "university", "college", "department", "foundation",
  "institute", "center", "centre", "national", "united", "states", "school", "program", "programs", "inc",
  "society", "association", "council", "office", "american", "state", "city", "new", "u.s.", "us",
]);

/** "U.S. Department of the Treasury" -> "U.S. Treasury"; "Army Educational Outreach Program (AEOP)" -> "AEOP". */
export function orgShortName(org: string): string {
  const acronym = org.match(/\(([A-Z][A-Za-z0-9&.\- ]{1,12})\)\s*$/);
  if (acronym) return acronym[1];
  const dept = org.match(/^(?:the\s+)?(U\.S\.|United States)\s+Department of\s+(?:the\s+)?(.+)$/i);
  if (dept) return `U.S. ${dept[2]}`;
  return org.trim();
}

function significantWords(s: string): string[] {
  return s
    .split(/[^A-Za-z0-9.&'-]+/)
    .map((w) => w.replace(/^[.'-]+|[.'-]+$/g, ""))
    .filter((w) => w && !STOP.has(w.toLowerCase()) && (w.length >= 4 || /^[A-Z0-9&]{2,}$/.test(w)));
}

/** True when the programme name already says who runs it ("Duke Math Meet" for Duke University ...). */
export function nameMentionsOrg(name: string, org: string): boolean {
  const lower = name.toLowerCase();
  return [...significantWords(org), ...significantWords(orgShortName(org))].some((w) =>
    lower.includes(w.toLowerCase()),
  );
}

/** Programme name from a reviewed title, if it still matches the listing; else the listing title. */
export function programName(opp: Pick<Opportunity, "title">, reviewedTitle?: string): string {
  if (!reviewedTitle) return opp.title;
  const name = reviewedTitle
    .replace(/\s*\|\s*HSO\s*$/i, "")
    .replace(/\s+20\d\d(?:-\d\d)?\b.*$/, "")
    .trim();
  // A reviewed name is kept only when it is the listing title, or the title plus a
  // disambiguating suffix; anything else is stale (the listing was renamed since).
  return name && (name === opp.title || name.startsWith(`${opp.title} `)) ? name : opp.title;
}

export function listingTitle(
  opp: Pick<Opportunity, "title" | "org" | "deadline" | "opensAt">,
  options: { reviewedTitle?: string; today: string; forceOrg?: boolean },
): string {
  const name = programName(opp, options.reviewedTitle);
  const short = orgShortName(opp.org);
  const showOrg =
    !name.includes(" - ") &&
    (options.forceOrg || (!nameMentionsOrg(name, opp.org) && short.length <= 28));
  const next = nextListingDate(opp, options.today);
  // The cycle is the programme's year: the deadline's, even while the title shows
  // when applications open ("Summer Seminar 2027: Opens Dec 1").
  const year = next ? (opp.deadline && opp.deadline >= options.today ? opp.deadline : next.iso).slice(0, 4) : undefined;
  const datePart = next
    ? `${next.kind === "opens" ? "Opens" : "Deadline"} ${shortDate(next.iso)}`
    : "Eligibility & Cost";
  const head = `${name}${showOrg ? ` (${short})` : ""}`;
  const withYear = year && !head.includes(year) ? `${head} ${year}` : head;
  // Google shows about 60 characters. Drop the year first, then the date part;
  // the name and org always stay.
  const candidates = [`${withYear}: ${datePart}`, `${head}: ${datePart}`, withYear, head];
  const fits = candidates.find((c) => `${c} | HSO`.length <= 65) ?? head;
  return `${fits} | HSO`;
}

function costPhrase(cost: Opportunity["cost"]): string {
  if (cost === "Free") return "Free";
  if (cost === "Stipend") return "Paid stipend";
  return "Tuition or fee";
}

function gradesPhrase(grades: number[] | undefined): string {
  const g = (grades ?? []).filter((n) => n >= 9 && n <= 12).sort((a, b) => a - b);
  if (!g.length) return "High school";
  return g.length === 1 ? `Grade ${g[0]}` : `Grades ${g[0]}-${g[g.length - 1]}`;
}

function placePhrase(opp: Pick<Opportunity, "location" | "format">): string {
  if (opp.format === "Online") return "Online";
  const place = opp.location.replace(/,?\s*USA$/, "").trim() || "Nationwide";
  return opp.format === "Hybrid" ? `${place} or online` : place;
}

/** Facts first, under 155 characters: cost, grades, place, date, then what you do. */
export function listingDescription(
  opp: Pick<Opportunity, "blurb" | "cost" | "grades" | "location" | "format" | "deadline" | "opensAt">,
  today: string,
): string {
  const next = nextListingDate(opp, today);
  const when = next
    ? `${next.kind === "opens" ? "Opens" : "Apply by"} ${shortDate(next.iso)}, ${next.iso.slice(0, 4)}`
    : "Dates on the official site";
  const facts = `${costPhrase(opp.cost)}. ${gradesPhrase(opp.grades)}. ${placePhrase(opp)}. ${when}.`;
  const room = 154 - facts.length - 1;
  if (room < 30) return facts.slice(0, 155);
  const blurb = (opp.blurb ?? "").trim();
  if (blurb.length <= room) return `${facts} ${blurb}`;
  // A sentence ends after a lowercase word, not an abbreviation like "U.S." or "D.C.".
  const firstSentence = blurb.match(/^.*?[a-z0-9)"'][.!?](?=\s+[A-Z"(]|\s*$)/)?.[0];
  if (firstSentence && firstSentence.length <= room) return `${facts} ${firstSentence}`;
  const cut = blurb.slice(0, room - 1).replace(/\s+\S*$/, "");
  return `${facts} ${cut}…`;
}
