import type { Opportunity } from "@/data/opportunities";

export type ListingRow =
  | { kind: "single"; opp: Opportunity }
  | { kind: "group"; key: string; name: string; items: Opportunity[] };

/**
 * "Summer Youth Employment at Betances Community Center" -> "Summer Youth Employment".
 * Only the "<program> at <site>" shape counts: that is how city imports name one
 * program offered at many sites. Distinct programs never share it by accident.
 */
export function siteProgramName(title: string): string | null {
  const m = title.match(/^(.{6,}?)\s+at\s+\S/);
  return m ? m[1].trim() : null;
}

/**
 * Collapse runs of the same program offered at many sites into one group row,
 * placed where the first of them appeared. Groups need `minSize` members;
 * anything smaller stays as single cards. Order is otherwise unchanged.
 */
export function groupSimilarListings(list: Opportunity[], minSize = 4): ListingRow[] {
  const byKey = new Map<string, Opportunity[]>();
  for (const o of list) {
    const name = siteProgramName(o.title);
    if (!name) continue;
    const key = `${o.category}|${name.toLowerCase()}`;
    (byKey.get(key) ?? byKey.set(key, []).get(key)!).push(o);
  }

  const rows: ListingRow[] = [];
  const placed = new Set<string>();
  for (const o of list) {
    const name = siteProgramName(o.title);
    const key = name ? `${o.category}|${name.toLowerCase()}` : "";
    const members = key ? byKey.get(key)! : undefined;
    if (members && members.length >= minSize) {
      if (placed.has(key)) continue;
      placed.add(key);
      rows.push({ kind: "group", key, name: name!, items: members });
    } else {
      rows.push({ kind: "single", opp: o });
    }
  }
  return rows;
}
