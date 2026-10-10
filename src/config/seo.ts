/**
 * SEO settings that more than one part of the build reads.
 *
 * The React pages, the build-time prerender, the sitemap generator and the check
 * scripts all import from here, so a change in one place moves all of them.
 */

/** Listings per category page. Page 1 is /categories/<slug>, page n is /categories/<slug>/page/<n>. */
export const CATEGORY_PAGE_SIZE = 60;

/** How many links the "Related opportunities" block on a listing shows. */
export const RELATED_LINKS = 8;

/**
 * Minimum quality score (src/lib/quality.ts) for an opportunity page to be
 * indexed. Below it the page is served `noindex,follow` and left out of the
 * sitemap; it stays live and its links still count.
 */
export const QUALITY_THRESHOLD = 3;

/**
 * Opportunity pages indexed whatever their score, because the owner asked for
 * them by name. The hard gates (working link, not flagged for review) still apply.
 */
export const INDEX_ALLOWLIST: ReadonlySet<string> = new Set([
  "nyc-dycd-beacon-ms-210",
  "nyc-dycd-beacon-jhs-194",
  "nyc-dycd-out-of-school-time-port-richmond-hs-1",
]);
