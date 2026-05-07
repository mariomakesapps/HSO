import type { Opportunity } from "@/data/opportunities";
import { locationRegion } from "@/data/opportunities";
import type { FilterState } from "@/components/Filters";
import type { ExtraFilterState } from "@/components/ExtraFilters";
import type { SortKey } from "@/components/SortBar";
import { getDeadlineStatus } from "@/lib/deadline";

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
      if (extra.country === "Hybrid") {
        if (o.format !== "Hybrid") return false;
      } else if (extra.country === "Online") {
        if (o.format !== "Online" && locationRegion(o.location) !== "Online") return false;
      } else {
        if (locationRegion(o.location) !== extra.country) return false;
      }
    }
    if (extra.freeOnly && !(o.cost === "Free" || o.cost === "Stipend")) return false;
    if (extra.deadlineMonth !== "All") {
      const m = new Date(o.deadline).getMonth() + 1;
      if (String(m) !== extra.deadlineMonth) return false;
    }
    if (extra.status !== "All") {
      const s = getDeadlineStatus(o.deadline).status;
      const map = { "Open": "open", "Closing soon": "closing-soon", "Rolling": "rolling", "Closed": "closed" } as const;
      if (s !== map[extra.status as keyof typeof map]) return false;
    }
    if (q) {
      const hay = [o.title, o.org, o.location, o.blurb, ...o.fields, o.category].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
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
        const ta = new Date(a.deadline).getTime();
        const tb = new Date(b.deadline).getTime();
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
        const aClosed = new Date(a.deadline).getTime() < now ? 1 : 0;
        const bClosed = new Date(b.deadline).getTime() < now ? 1 : 0;
        if (aClosed !== bClosed) return aClosed - bClosed;
        return b.prestige - a.prestige;
      });
  }
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