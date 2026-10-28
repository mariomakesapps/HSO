import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { isOpportunityIndexable } from "@/lib/pageMeta";

/** "Cambridge, Massachusetts, USA" -> "Massachusetts". Empty for online or national rows. */
function stateOf(location: string): string {
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.length >= 3 ? parts[parts.length - 2] : "";
}

/**
 * "Related opportunities" for a listing: same category first, ranked by how many
 * subject tags they share, then same state, then catalogue order. Only indexable
 * listings are suggested, so indexable pages don't send their links to pages kept
 * out of Google. Used by the listing page and the prerendered HTML alike.
 */
export function relatedOpportunities(opp: Opportunity, limit = 6, list = allOpportunities): Opportunity[] {
  const fields = new Set(opp.fields ?? []);
  const state = stateOf(opp.location);
  const scored = list
    .map((o, i) => ({ o, i }))
    .filter(({ o }) => o.id !== opp.id && isOpportunityIndexable(o))
    .map(({ o, i }) => {
      const shared = (o.fields ?? []).filter((f) => fields.has(f)).length;
      const sameState = state && stateOf(o.location) === state ? 1 : 0;
      return { o, i, sameCategory: o.category === opp.category ? 1 : 0, shared, sameState };
    })
    // Another category only qualifies when it shares a subject.
    .filter((s) => s.sameCategory || s.shared > 0);

  scored.sort(
    (a, b) =>
      b.sameCategory - a.sameCategory || b.shared - a.shared || b.sameState - a.sameState || a.i - b.i,
  );
  return scored.slice(0, limit).map((s) => s.o);
}
