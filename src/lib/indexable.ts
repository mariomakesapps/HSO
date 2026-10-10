import type { Opportunity } from "@/data/opportunities";
import { INDEX_ALLOWLIST, QUALITY_THRESHOLD } from "@/config/seo";
import { qualityScore } from "@/lib/quality";

/**
 * Indexing gate for opportunity pages. Hard gates first: core fields present,
 * a working direct link, not flagged for manual review. Then the page-quality
 * score (src/lib/quality.ts) must reach QUALITY_THRESHOLD (src/config/seo.ts),
 * unless the page is on INDEX_ALLOWLIST. Bulk imports (NYC DYCD rows) go through
 * the same score as everything else rather than being excluded by id. A page
 * that fails is served noindex,follow and left out of the sitemap; it stays live
 * and its links still count. Memoised: the prerender asks once per page and per link.
 */
const indexableCache = new Map<string, boolean>();

export function isOpportunityIndexable(opp: Opportunity): boolean {
  const cached = indexableCache.get(opp.id);
  if (cached !== undefined) return cached;
  const hasCoreFields = !!(opp.title && opp.org && opp.location && opp.blurb);
  const linkOk =
    !!opp.url && opp.url.startsWith("http") && opp.url !== "#" && opp.link_quality !== "broken";
  const result =
    hasCoreFields &&
    linkOk &&
    opp.requiresReview !== true &&
    (INDEX_ALLOWLIST.has(opp.id) || qualityScore(opp).score >= QUALITY_THRESHOLD);
  indexableCache.set(opp.id, result);
  return result;
}
