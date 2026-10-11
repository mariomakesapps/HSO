import { locationState, type Opportunity } from "@/data/opportunities";

/**
 * Sentences for an opportunity page, built only from the listing's own fields.
 *
 * Nothing here adds a fact the data does not hold: an unknown deadline says
 * so and points to the official site rather than guessing, and costs are only
 * described as free, paid or stipended because that is all the field records.
 * Used by the page and by its meta description, so both say the same thing.
 */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2027-01-15" -> "January 15, 2027" (no timezone shift: the date is a calendar day). */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** [10, 11] -> "grades 10-11"; [11] -> "grade 11"; [9..12] -> "grades 9-12". */
export function gradesLabel(grades: number[]): string {
  if (grades.length === 0) return "";
  const lo = Math.min(...grades);
  const hi = Math.max(...grades);
  return lo === hi ? `grade ${lo}` : `grades ${lo}-${hi}`;
}

export function costLabel(opp: Opportunity): string {
  return opp.cost === "Free" ? "free" : opp.cost === "Stipend" ? "paid or stipended" : "tuition-based";
}

export function isNationwide(opp: Opportunity): boolean {
  const s = locationState(opp.location);
  return s === "Nationwide" || s === "Online";
}

const CATEGORY_NOUN: Record<Opportunity["category"], string> = {
  Research: "research program",
  Internship: "internship",
  Competition: "competition",
  "Summer Program": "summer program",
  Scholarship: "scholarship",
  Volunteer: "volunteer program",
  Fellowship: "fellowship",
};

/** "a free, in-person internship from X for high school students in grades 10-12, in Boston, Massachusetts." */
export function summarySentence(opp: Opportunity): string {
  const format = opp.format === "In-person" ? "in-person" : opp.format === "Online" ? "online" : "hybrid";
  // "a free scholarship" or "a paid scholarship" says nothing, so awards get no cost word.
  const award = opp.category === "Scholarship";
  const cost = award ? "" : opp.cost === "Free" ? "free, " : opp.cost === "Stipend" ? "paid, " : "";
  const where = isNationwide(opp)
    ? opp.format === "Online"
      ? ", open to students across the country"
      : ", open to students nationwide"
    : opp.location
      ? `, based in ${opp.location.replace(/,\s*USA$/i, "")}`
      : "";
  const grades = gradesLabel(opp.grades);
  const phrase = `${cost}${format} ${CATEGORY_NOUN[opp.category]}`;
  const article = /^[aeiou]/i.test(phrase) ? "an" : "a";
  return `${opp.title} is ${article} ${phrase} from ${opp.org} for high school students${grades ? ` in ${grades}` : ""}${where}.`;
}

/** The deadline in words, never guessed. `now` is passed in so the server and browser agree within a build. */
export function deadlineSentence(opp: Opportunity, now = Date.now()): string {
  const today = new Date(now).toISOString().slice(0, 10);
  if (opp.opensAt && opp.opensAt > today) {
    return `Applications open ${formatDay(opp.opensAt)}${opp.deadline ? ` and close ${formatDay(opp.deadline)}` : ""}.`;
  }
  if (!opp.deadline) {
    return "No deadline is posted for the coming cycle yet. Check the official site for dates.";
  }
  if (opp.deadline < today) {
    return `The ${formatDay(opp.deadline)} deadline has passed, so it is closed for this cycle. Check the official site for the next cycle's dates.`;
  }
  return `Applications close ${formatDay(opp.deadline)}.`;
}

export function costSentence(opp: Opportunity): string {
  if (opp.cost === "Free") return "Free to take part.";
  if (opp.cost === "Stipend") return "Participants are paid a stipend, wage or award. Check the official site for the amount.";
  return "This program charges tuition or fees. Check the official site for current costs and any financial aid.";
}

export function formatSentence(opp: Opportunity): string {
  const where = opp.location ? ` Location: ${opp.location}.` : "";
  if (opp.format === "Online") return `Runs online.${where}`;
  if (opp.format === "Hybrid") return `Runs partly online and partly in person.${where}`;
  return `Runs in person.${where}`;
}

/** "Remote", or the place without the trailing ", USA". */
export function placeLabel(opp: Opportunity): string {
  if (opp.format === "Online") return "Remote";
  const place = opp.location.replace(/,\s*USA$/i, "").trim() || opp.location;
  return opp.format === "Hybrid" ? `${place} · Hybrid` : place;
}
