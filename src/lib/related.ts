import { allOpportunities, locationState, type Opportunity } from "@/data/opportunities";
import { RELATED_LINKS } from "@/config/seo";
import { isOpportunityIndexable } from "@/lib/pageMeta";
import { recommendedScore } from "@/lib/filterSort";

/**
 * Listings to link from an opportunity page.
 *
 * Ranked by what a reader of this page is most likely to want next: same
 * category, shared subject fields, then the same state. Only indexable listings
 * are linked, so the links lead to pages that can rank rather than to noindexed
 * imports. The ranking is deterministic (score, then catalogue quality, then id),
 * so the server-rendered HTML and the browser render the same list.
 */
export function relatedOpportunities(opp: Opportunity, limit = RELATED_LINKS): Opportunity[] {
  const state = locationState(opp.location);
  const fields = new Set(opp.fields);

  const scored: { o: Opportunity; score: number; quality: number }[] = [];
  for (const o of allOpportunities) {
    if (o.id === opp.id || !isOpportunityIndexable(o)) continue;
    const sharedFields = o.fields.reduce((n, f) => n + (fields.has(f) ? 1 : 0), 0);
    const sameCategory = o.category === opp.category;
    if (!sameCategory && sharedFields === 0) continue;
    const sameState = !!state && state !== "Other" && locationState(o.location) === state;
    const score = (sameCategory ? 4 : 0) + Math.min(sharedFields, 3) * 2 + (sameState ? 3 : 0);
    scored.push({ o, score, quality: recommendedScore(o) });
  }

  scored.sort((a, b) => b.score - a.score || b.quality - a.quality || a.o.id.localeCompare(b.o.id));
  return scored.slice(0, limit).map((s) => s.o);
}
