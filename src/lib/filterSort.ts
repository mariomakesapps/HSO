import type { Opportunity } from "@/data/opportunities";
import { locationStates } from "@/data/opportunities";
import type { FilterState } from "@/components/Filters";
import type { ExtraFilterState } from "@/components/ExtraFilters";
import type { SortKey } from "@/components/SortBar";
import { getDeadlineStatus, type DeadlineStatus } from "@/lib/deadline";

const searchTextCache = new Map<string, string>();
const locationStateCache = new Map<string, string[]>();

/**
 * Which deadline statuses each status option covers. A listing closing in a week
 * is still open, so "Open now" includes "closing soon" — before, picking "Open now"
 * hid exactly the listings a student most needs to act on.
 */
const STATUS_MAP: Record<ExtraFilterState["statuses"][number], DeadlineStatus[]> = {
  Open: ["open", "closing-soon"],
  "Closing soon": ["closing-soon"],
  "Opens later": ["opens-later"],
  Rolling: ["rolling"],
  Closed: ["closed"],
};

/**
 * Filters combine as OR within a dimension and AND across dimensions.
 *
 * "Research or Internship, that is Online or Hybrid, for grade 11" is the shape
 * students actually think in. An empty list means the dimension is unconstrained,
 * so there is no "All" sentinel to special-case.
 */
export function applyFilters(
  list: Opportunity[],
  filters: FilterState,
  extra: ExtraFilterState,
): Opportunity[] {
  const q = filters.query.trim().toLowerCase();

  return list.filter((o) => {
    if (filters.categories.length && !filters.categories.includes(o.category)) return false;
    if (filters.grades.length && !filters.grades.some((g) => o.grades.includes(g))) return false;
    if (filters.costs.length && !filters.costs.includes(o.cost)) return false;
    if (filters.formats.length && !filters.formats.includes(o.format)) return false;

    if (extra.fields.length && !extra.fields.some((f) => o.fields.includes(f))) return false;

    if (extra.states.length) {
      const states = listingFilterStates(o);
      if (!extra.states.some((s) => states.includes(s))) return false;
    }

    if (extra.freeOnly && !(o.cost === "Free" || o.cost === "Stipend")) return false;

    if (extra.deadlineMonths.length) {
      if (!o.deadline) return false;
      // Read the month straight from the ISO date. new Date("2026-03-01") is
      // midnight UTC, which is still February in every US time zone.
      const m = Number(o.deadline.slice(5, 7));
      if (!extra.deadlineMonths.includes(String(m))) return false;
    }

    if (extra.statuses.length) {
      const s = getDeadlineStatus(o.deadline, o.opensAt).status;
      if (!extra.statuses.some((label) => STATUS_MAP[label]?.includes(s))) return false;
    }

    if (q && !getSearchText(o).includes(q)) return false;

    return true;
  });
}

/**
 * How many results each option in one dimension would actually yield.
 *
 * Counted against the list filtered by every OTHER active dimension, so the
 * numbers describe what you would really get if you ticked that box. An option
 * showing 0 is a dead end — the UI hides those rather than letting a student
 * pick "Wyoming" and land on an empty page.
 */
export function facetCounts(
  list: Opportunity[],
  filters: FilterState,
  extra: ExtraFilterState,
  dimension: keyof FilterState | keyof ExtraFilterState,
  valuesOf: (o: Opportunity) => string[],
): Record<string, number> {
  const isCore = dimension in filters;
  const scoped = applyFilters(
    list,
    isCore ? { ...filters, [dimension]: [] } : filters,
    isCore ? extra : { ...extra, [dimension]: [] },
  );

  const counts: Record<string, number> = {};
  for (const o of scoped) {
    for (const v of valuesOf(o)) counts[v] = (counts[v] ?? 0) + 1;
  }
  return counts;
}

export function applySort(list: Opportunity[], sort: SortKey, originalIndex: Map<string, number>): Opportunity[] {
  const now = Date.now();
  const arr = list.slice();
  switch (sort) {
    case "deadline-soon":
      return arr.sort((a, b) => {
        const ta = deadlineTime(a);
        const tb = deadlineTime(b);
        const aClosed = ta < now;
        const bClosed = tb < now;
        if (aClosed !== bClosed) return aClosed ? 1 : -1;
        return ta - tb;
      });
    case "newest":
      return arr.sort((a, b) => (originalIndex.get(b.id) ?? 0) - (originalIndex.get(a.id) ?? 0));
    case "free-first":
      return arr.sort((a, b) => costRank(a.cost) - costRank(b.cost));
    case "online-first":
      return arr.sort((a, b) => formatRank(a.format) - formatRank(b.format));
    case "prestige":
      return arr.sort((a, b) => b.prestige - a.prestige);
    case "recommended":
    default:
      return arr.sort((a, b) => {
        const aClosed = deadlineTime(a) < now ? 1 : 0;
        const bClosed = deadlineTime(b) < now ? 1 : 0;
        if (aClosed !== bClosed) return aClosed - bClosed;
        const diff = recommendedScore(b) - recommendedScore(a);
        if (diff !== 0) return diff;
        // Stable tie-break so equal-scoring programs do not shuffle between renders.
        return a.id.localeCompare(b.id);
      });
  }
}

/**
 * Signals that a student cannot enter this on their own initiative.
 *
 * Ranking purely on prestige filled the top of the page with AMC, AIME and
 * USAMO — genuinely prestigious, but a student cannot just sign up: their school
 * has to register them. Same for team competitions and nomination-only awards.
 * They stay in the catalog and stay findable; they simply should not be the
 * first thing shown to someone browsing for something to apply to.
 */
const GATEKEPT =
  /\b(your school must|school must register|through your school|school registration|teacher sponsor|must be nominated|nomination[- ]based|nominated by|principal|guidance counselor|counselor must|advisor must|team of|form a team|chapter|invitational|qualif(?:y|ies|ying) (?:via|through|by|from)|psat|nmsqt)\b/i;

/**
 * Whether a program is reachable from anywhere in the country.
 *
 * This must go through locationState, not a regex over the raw string: almost
 * every listing ends in "USA" ("Brooklyn, New York, USA"), so pattern-matching
 * the location awarded the nationwide bonus to local programs too, which made
 * the signal meaningless.
 */
function isNationallyAvailable(o: Opportunity): boolean {
  return o.format === "Online" || getCachedLocationStates(o.location).includes("Nationwide");
}

/**
 * Category lean for the default view. Fellowships, research and structured
 * programs are what students are usually shopping for; competitions are a
 * long tail that swamped the front page when everything ranked on prestige
 * alone. This is a nudge, not a filter — competitions still rank on merit.
 */
const CATEGORY_WEIGHT: Record<string, number> = {
  Fellowship: 6,
  Research: 5,
  "Summer Program": 4,
  Internship: 4,
  Scholarship: 3,
  Competition: 0,
  Volunteer: 0,
};

const PRECISION_WEIGHT: Record<string, number> = {
  direct_application_page: 3,
  exact_program_page: 2,
  broad_directory: 0,
  generic_homepage: -1,
};

/**
 * Ordering for the default "Recommended" view.
 *
 * Optimises for: reputable, nationally reachable programs with a real
 * application a student can complete themselves.
 */
export function recommendedScore(o: Opportunity): number {
  let s = 0;

  s += o.prestige * 10;
  s += CATEGORY_WEIGHT[o.category] ?? 0;

  // Reachable regardless of where the student lives.
  if (isNationallyAvailable(o)) s += 8;

  // A published deadline means a real, open application cycle.
  if (o.deadline) s += 4;

  // Cost should not decide reputation, but free/funded is more actionable.
  if (o.cost === "Free" || o.cost === "Stipend") s += 2;

  s += PRECISION_WEIGHT[o.link_precision ?? ""] ?? 0;

  if (GATEKEPT.test(`${o.title} ${o.blurb}`)) s -= 12;

  // Local council / after-school feed imports: useful if you live there,
  // noise for everyone else, so they should not lead the default view.
  if (/^(sf-our415|nyc)-/.test(o.id)) s -= 14;

  if (o.requiresReview) s -= 40;
  if (o.link_quality === "broken") s -= 40;

  return s;
}

function deadlineTime(o: Opportunity) {
  if (!o.deadline) return Infinity;
  // End of the deadline day, local time — the same rule getDeadlineStatus uses,
  // so a listing due today is not sorted as closed.
  const time = new Date(`${o.deadline}T23:59:59`).getTime();
  return Number.isNaN(time) ? Infinity : time;
}

function costRank(c: string) {
  if (c === "Free") return 0;
  if (c === "Stipend") return 1;
  return 2;
}
function formatRank(f: string) {
  if (f === "Online") return 0;
  if (f === "Hybrid") return 1;
  return 2;
}

function getSearchText(o: Opportunity) {
  const cached = searchTextCache.get(o.id);
  if (cached) return cached;
  const text = [o.title, o.org, o.location, o.blurb, ...o.fields, o.category].join(" ").toLowerCase();
  searchTextCache.set(o.id, text);
  return text;
}

function getCachedLocationStates(location: string) {
  const cached = locationStateCache.get(location);
  if (cached) return cached;
  const states = locationStates(location);
  locationStateCache.set(location, states);
  return states;
}

/**
 * The State-filter values a listing matches. Shared by applyFilters and the
 * facet counts so the number beside an option always equals what it returns.
 *
 * A remote program, or one whose location is just "Online", is open to a student
 * in any state, so it also counts as "Nationwide".
 */
export function listingFilterStates(o: Opportunity): string[] {
  const states = getCachedLocationStates(o.location);
  const reachableAnywhere = o.format === "Online" || states.includes("Online");
  return reachableAnywhere && !states.includes("Nationwide") ? [...states, "Nationwide"] : states;
}
