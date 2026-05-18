import type { Opportunity } from "@/data/opportunities";
import { locationState } from "@/data/opportunities";
import type { FilterState } from "@/components/Filters";
import type { ExtraFilterState } from "@/components/ExtraFilters";
import type { SortKey } from "@/components/SortBar";
import { getDeadlineStatus } from "@/lib/deadline";

const searchTextCache = new Map<string, string>();
const locationStateCache = new Map<string, string>();

export function applyFilters(
  list: Opportunity[],
  filters: FilterState,
  extra: ExtraFilterState
): Opportunity[] {
  const q = filters.query.trim().toLowerCase();
  return list.filter((o) => {
    if (filters.category !== "All" && o.category !== filters.category) return false;
    if (filters.grade !== "All" && !o.grades.includes(filters.grade as number)) return false;
    if (filters.cost !== "All" && o.cost !== filters.cost) return false;
    if (filters.format !== "All" && o.format !== filters.format) return false;
    if (extra.field !== "All" && !o.fields.includes(extra.field)) return false;
    if (extra.country !== "All") {
      const state = getCachedLocationState(o.location);
      if (extra.country === "Hybrid") {
        if (o.format !== "Hybrid") return false;
      } else if (extra.country === "Online") {
        if (o.format !== "Online" && state !== "Online") return false;
      } else {
        if (state !== extra.country) return false;
      }
    }
    if (extra.freeOnly && !(o.cost === "Free" || o.cost === "Stipend")) return false;
    if (extra.deadlineMonth !== "All") {
      if (!o.deadline) return false;
      const m = new Date(o.deadline).getMonth() + 1;
      if (String(m) !== extra.deadlineMonth) return false;
    }
    if (extra.status !== "All") {
      const s = getDeadlineStatus(o.deadline, o.opensAt).status;
      const map = { "Open": "open", "Closing soon": "closing-soon", "Rolling": "rolling", "Closed": "closed" } as const;
      if (s !== map[extra.status as keyof typeof map]) return false;
    }
    if (q) {
      if (!getSearchText(o).includes(q)) return false;
    }
    return true;
  });
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
        return b.prestige - a.prestige;
      });
  }
}

function deadlineTime(o: Opportunity) {
  if (!o.deadline) return Infinity;
  const time = new Date(o.deadline).getTime();
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

function getCachedLocationState(location: string) {
  const cached = locationStateCache.get(location);
  if (cached) return cached;
  const state = locationState(location);
  locationStateCache.set(location, state);
  return state;
}
