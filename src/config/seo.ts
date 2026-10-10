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
