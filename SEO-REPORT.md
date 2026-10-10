# HSO SEO and indexing report

Full audit tables: `reports/seo-audit-before.md` and `reports/seo-audit-after.md`.

Branch `claude/pensive-darwin-3m6t18`, one commit per phase (phases 5 and 6 share a commit because they edit the same
builders in `src/lib/pageMeta.ts`). Every number below was measured on the **raw HTML** of a local production build,
with no JavaScript, using `scripts/seo-audit.mjs`. Nothing was measured on the live site, because this environment cannot
reach it. After deploying, run `node scripts/seo-audit.mjs --base https://highschoolopportunity.org` to compare.

| Commit | Phase |
|---|---|
| `d0908cd` | Plan (`PLAN-SEO.md`) and the audit script |
| `3c17c82` | 1. Every route prerendered as the real server-rendered page |
| `d48d604` | 2. Sitemap index + lastmod, pagination, breadcrumbs, related links, orphan check |
| `56f7a7d` | 3. Opportunity pages from real fields, quality score gate |
| `39cf303` | 4. `noindex,follow` everywhere, imports go through the quality score |
| `b832e5f` | 5-6. Titles, descriptions, brand, structured data |
| `fcef5eb` | 7. Topic landing pages |
| `d0a0626` | 8. Real 404s, hydration, canonical and host config |

## Before and after (`scripts/seo-audit.mjs`, raw HTML)

**Before** (the branch before phase 1): sitemap of 1,887 URLs, **0 with `<lastmod>`**. 151 URLs audited.

| Page type | Pages | Avg text chars | Avg internal links | Avg opportunity links |
|---|---|---|---|---|
| home | 1 | 875 | 19 | **0** |
| page | 12 | 6,003 | 110 | 94 |
| category | 6 | 8,837 | 180 | 175 (capped at 200 of up to 680) |
| guide | 4 | 870 | 19 | **0** |
| opportunity | 126 | 731 | 9 | 8 |

Issues before: `/this-page-does-not-exist` answered **200 with the homepage** (soft 404); NYC import pages were
`noindex,nofollow`; the homepage title duplicated the not-found fallback; 5 category titles and 9 descriptions were
too long; opportunity pages carried `Article` markup; guides, /about and the homepage had almost no crawlable content.

**After** (this branch): sitemap index with 3 children, **1,583 URLs, all with `<lastmod>`**. 210 URLs audited.

| Page type | Pages | Avg text chars | Avg internal links | Avg opportunity links |
|---|---|---|---|---|
| home | 1 | 17,560 | 62 | 41 |
| page | 11 | 23,832 | 134 | 113 |
| category (incl. pagination and topics) | 66 | 20,762 | 83 | 53 |
| guide | 4 | 6,444 | 24 | 3 |
| opportunity | 125 | 3,352 | 29 | 8 |

Issues after (4), all expected:
- `/` title is 68 characters. That is the brand title the brief asked for.
- `/opportunities/sf-our415-...` returns 404. You decided to keep the dead SF feed as 404s.
- Two opportunity titles are long because the program names are long. The title template steps down to `{Name} | HSO` and never cuts a name.

Checks that now run against the build (all pass):

| Script | What it checks | Result |
|---|---|---|
| `scripts/check-sitemap.mjs` (runs inside `npm run build`, fails it) | every sitemap URL is built, indexable, self-canonical, listed once | 1,583 OK |
| `scripts/check-orphans.mjs` | crawls raw HTML from `/`; sitemap URLs with no inbound link or unreachable | 0 and 0 |
| `scripts/check-duplicate-meta.mjs` | duplicate titles/descriptions, exactly one H1 | 0 duplicates; 72 titles over 60 chars (long program names) |
| `scripts/validate-jsonld.mjs` | JSON-LD structure, breadcrumbs match the visible trail, FAQs visible, no Article on listings | all valid |
| `scripts/seo-check.mjs` | title, description, canonical, H1 on every page | OK |
| `npm test` | 49 tests | pass |

## What changed, by phase

1. **Real prerendered pages.** The build now server-renders the actual React page for every route (`src/entry-server.tsx`)
   instead of a hidden crawler block. The homepage HTML has 41 opportunity links plus every category, /deadlines and the
   guides. In phase 8 the browser was switched to **hydrate** this HTML instead of replacing it. Server and client markup
   now match on every page tested, with no hydration warnings.
2. **Crawling.**
   - The sitemap is an index (`sitemap-pages`, `-categories`, `-opportunities`) with real `<lastmod>`: the latest dated check in the review records (`src/lib/lastmod.ts`), else the listing's data file's git date. Hubs use the newest date of what they list.
   - Category pages are paginated for everyone: 60 per page at `/categories/<slug>/page/<n>`, self-canonical, with rel prev/next.
   - Breadcrumbs are visible on opportunity, category, topic, guide, hub and /about pages, built from the same data as the `BreadcrumbList`.
   - Every listing has 8 "Related opportunities" (same category, shared fields, same state).
   - Guides link to the listings they cover.
   - The footer links every category, /deadlines, the guides, /about and LinkedIn.
3. **Opportunity pages.**
   - H2 sections built only from real fields: What you do, Who it's for, Cost, Dates and deadline, Format, How to apply, FAQs (where they exist), Official link and Last checked.
   - A missing value says "Check the official site".
   - A one-sentence summary is built from the fields.
   - A passed deadline reads "Closed for this cycle" and the page stays live.
   - Quality score: `src/lib/quality.ts`. Threshold and allowlist: `src/config/seo.ts`.
4. **Imports.**
   - `noindex,nofollow` is gone everywhere; noindexed pages are `noindex,follow`.
   - NYC DYCD rows go through the quality score instead of being excluded by id.
   - Your three named NYC pages are indexed through the allowlist.
   - The SF feed stays 404.
5. **Titles and descriptions.**
   - Homepage: "High School Opportunity (HSO) - Internships, Programs & Scholarships".
   - Category titles lead with the search phrase and name the cycle, computed from the date: "Competitions for High School Students 2026-27", "Summer Programs for High School Students 2027".
   - Descriptions carry real counts (summer: 573 programs, 296 free, 14 with a stipend).
   - Listings: "{Program} {Year} - Deadline, Eligibility & Cost | HSO", stepping down to fit. Descriptions come from the real deadline, grades and cost.
   - Every React page now takes its head from `pageMeta.ts`, so raw and rendered heads match. This also fixed /auth, which lost its noindex once JavaScript ran.
6. **Structured data.**
   - Homepage: Organization (name, alternateName HSO, logo, sameAs LinkedIn) + WebSite.
   - /about: real copy (student-run team, how listings are checked) + AboutPage.
   - Listings: `Article` removed. `EducationalOccupationalProgram` with provider, mode, deadline when known, location when local, and an Offer only when the cost is known.
   - Guides keep Article; the law guide's FAQPage matches its visible FAQs.
7. **Topic pages.** Built only where at least 10 indexable listings match. Each has a real count, a list, data-driven FAQs (count, next deadlines, online options), parent and sibling links, a sitemap entry and lastmod:
   - `/categories/competitions/{stem,research,science,business,writing,math}`: 232, 42, 238, 86, 112 and 88 listings.
   - `/categories/internships/medical`: 88.
   - `/categories/summer-programs/{nyc,free}`.

   The medical and research guides were retitled "..., Compared" and link to the full list, so the guide and the topic page don't target the same search.
8. **Technical.**
   - Unknown paths return a real 404 (`/* /404.html 404`). Before, the homepage was served with a 200.
   - Shared collections boot from a noindexed shell.
   - `vercel.json` is generated to match `_redirects`.
   - Canonicals are absolute and self-referencing; query strings canonicalise to the clean path.

## Quality score results

Full list: `reports/quality-report.md` and `reports/quality-scores.csv` (`npm run seo:quality`).

- 2,444 listings. With the threshold at **3**, **945** fall below it. Every listing with its own description scores 4 or more.
- 578 of them are **NYC DYCD rows**. They were already noindexed; they score -1 because of a templated description and a shared dataset link.
- **367 are state-chapter pages that share one description word for word**:

  | Family | Pages |
  |---|---|
  | National History Day state contests | 51 |
  | Girls State | 48 |
  | Boys State | 47 |
  | JSHS regionals | 46 |
  | State mock trial | 46 |
  | SkillsUSA states | 38 |
  | State science fairs | 36 |
  | HOBY | 32 |
  | Regional ISEF fairs | 13 |
  | Tennessee Governor's Schools | 10 |

  **These were indexable before and are now `noindex,follow`.** They are still live, still linked from category pages and still searchable on the site. This is the one change I'd flag for your review. Each family is one description repeated 30 to 50 times, which matches Search Console's "Crawled, currently not indexed" bucket. To bring any family back, give each page its own description from its official page, or lower `QUALITY_THRESHOLD` in `src/config/seo.ts`.
- The pages you named as ranking (ccc-youthaction-nyc, nyt-essay, national-wwii-writing-contest, NACLO) score above the threshold; a test keeps it that way.

## Flagged for your decision (nothing changed without approval)

- **Likely duplicates** (`reports/quality-report.md` section 2): 8 pairs share one official page, e.g. `aime`/`usamo` and the two Columbia weekend listings. No same-name duplicates. Nothing merged.
- **Truncated slugs** (section 3): 449 ids cut at the old 64-character limit (410 outside the NYC import). They are live and may be indexed, so none was renamed. Renaming one needs your go-ahead and a 301 in `src/data/removedOpportunities.ts`.
- **May not be for high schoolers** (`reports/not-high-school.md`, `npm run seo:not-high-school`): 174 listings. Nothing was removed.
  - 88 NYC rows with eligibility "6 and up", 48 with "OST" and 18 with "Elem/MS/HS".
  - Plus 12 listings mentioning middle or elementary students, 5 college-oriented and 1 adults-only.

  Two of your three must-index NYC pages (Beacon at MS 210 and JHS 194) are among the "6 and up" rows. They are indexed as you asked, but their city data says the program is open to ages 6 and up.

## Not fixable in code, or not done

- **Search Console data.** Not available here (the SEO Gets connector needs a subscription), so quality decisions could not use per-page impressions. The four ranking pages from your brief are protected by a test.
- **City pages for SF and Houston** were not built: only 9 and 8 indexable listings, under the 10-listing bar. NYC already has its hub.
- **Event markup** for competitions was not added: the data holds application deadlines, not event dates, and inventing a `startDate` would break the ground rules.
- **Lighthouse (mobile).** Scores on /, /categories/competitions and /opportunities/regeneron-sts:

  | Category | Score |
  |---|---|
  | SEO | 100 |
  | Accessibility | 100 |
  | Best practices | 100 |
  | Performance | 43-63 (local server) |

  The local performance score is not representative: the test server has no gzip or caching, and 3.5 MB of the flagged savings is compression. The real remaining cost is the catalogue data chunk (~3 MB uncompressed) that every page loads. Splitting it per route is a larger refactor that was out of scope. Check the production score after deploy.
- **Host settings**: http to https, www to apex, and trailing-slash redirects are host settings. Trailing slashes already resolve to the canonical, and the canonical tag covers the rest.
- **Long titles**: 72 listings have program names that push the title past 60 characters even in the shortest form. The name is never cut.

## Submit these 20 URLs with "Request indexing"

These are the pages that changed most and that Search Console listed as "Discovered, not indexed", the new topic pages, and the three NYC pages you asked for:

1. https://highschoolopportunity.org/
2. https://highschoolopportunity.org/about
3. https://highschoolopportunity.org/categories/competitions
4. https://highschoolopportunity.org/categories/summer-programs
5. https://highschoolopportunity.org/categories/internships
6. https://highschoolopportunity.org/categories/scholarships
7. https://highschoolopportunity.org/categories/research
8. https://highschoolopportunity.org/categories/fellowships
9. https://highschoolopportunity.org/deadlines
10. https://highschoolopportunity.org/nyc-programs-for-high-school-students
11. https://highschoolopportunity.org/categories/competitions/stem
12. https://highschoolopportunity.org/categories/internships/medical
13. https://highschoolopportunity.org/categories/summer-programs/free
14. https://highschoolopportunity.org/categories/competitions/research
15. https://highschoolopportunity.org/guides/top-medical-internships
16. https://highschoolopportunity.org/guides/top-research-competitions
17. https://highschoolopportunity.org/opportunities/nyt-essay
18. https://highschoolopportunity.org/opportunities/nyc-dycd-beacon-ms-210
19. https://highschoolopportunity.org/opportunities/nyc-dycd-beacon-jhs-194
20. https://highschoolopportunity.org/opportunities/nyc-dycd-out-of-school-time-port-richmond-hs-1

Also resubmit `https://highschoolopportunity.org/sitemap.xml`. It is now a sitemap index, and Search Console will pick up the three child sitemaps from it.
