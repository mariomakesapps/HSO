# HSO SEO and indexing plan

Working branch: `claude/pensive-darwin-3m6t18`. Each phase is one commit. After every phase: `npm run build`, `npm test`,
`npm run seo:check`, and `node scripts/seo-audit.mjs` against the built `dist/`, all on **raw HTML** (no JavaScript).

## What the exploration found

| Area | How it works today | Problem |
|---|---|---|
| Prerender | `scripts/prerender.mjs`, run by a Vite plugin after `vite build`. Writes `dist/<route>/index.html` with the head from `src/lib/pageMeta.ts` and a **visually hidden** crawler-only block inside `#root` that React throws away on mount. | `/`, `/about`, `/collections`, `/submit`, `/contact`, `/volunteer` and all 4 guides get one generic block: ~870 chars, 0 opportunity links. Guide content exists only in React. |
| Head tags | `pageMeta.ts` for the prerender; React pages set their own via `<SEO>` / `useSEO` with **hard-coded copies** of the same strings | Copies have drifted (medical guide description, homepage JSON-LD). |
| Sitemap | `scripts/generate-sitemap.mjs` writes one `sitemap.xml` from `allRoutes()` minus noindex | No `lastmod`; single file; no check that sitemap URLs are canonical/200. |
| Categories | React renders **every** item (680 competition cards, a 4 MB page). Prerender links the first 200. | 470+ competitions unreachable in raw HTML. |
| Opportunity pages | Hidden block: title, blurb, one facts sentence, 8 related links. JSON-LD includes `Article`. | Thin (~730 chars), no breadcrumbs, `Article` is not true. |
| Noindex | `noindex` always emitted as `noindex,nofollow` (prerender and `<SEO>`) | Drops the link value of 578 NYC import pages. |
| 404s | `/opportunities/*` unknown → real 404. Any other unknown path → `/* /index.html 200` | Soft 404: `/anything` returns the homepage with 200. |
| Imports | `nyc-dycd-*` (578) noindexed wholesale by `isBulkDirectoryImport()`. `sf-our415-*` (825) hidden by the Sept 17 review (every our415.org link dead) and return 404 | Owner decision: keep sf-our415 as 404. |

Measured before any change (local build of the current code, `scripts/seo-audit.mjs`): homepage 875 chars and 0 opportunity links,
guides ~870 chars, opportunity pages ~730 chars average, categories capped at 200 links, sitemap 1,887 URLs with 0 `lastmod`.

## Phase 1 - Real prerendered pages (server-rendered React)

Replace the hidden crawler block with the **actual React page rendered on the server** at build time, so the raw HTML is the
same visible page users get.
- `src/AppRoutes.tsx`: the route table and app shell, shared by the browser app (lazy pages) and the server entry (eager pages).
- `src/entry-server.tsx`: `render(url)` renders the app for one URL inside a `MemoryRouter`.
- `scripts/prerender.mjs`: loads the entry through Vite's SSR loader (same aliases, env and CSS handling as the app) and writes
  the rendered markup into `#root`. The head still comes from `pageMeta.ts`.
- `src/main.tsx`: first render runs in `startTransition`, so the prerendered DOM stays on screen until the lazy route chunk
  loads (no blank flash). Checked in headless Chromium.
- Pages read their head from `pageMeta.ts` instead of hard-coded copies.
- Verify: `curl` each static route; homepage needs at least 30 `/opportunities/` links plus every category, /deadlines and the guides.

## Phase 2 - Crawling and discovery

- Sitemap index (`/sitemap.xml`) with `sitemap-pages.xml`, `sitemap-categories.xml` (categories, guides, hubs, pagination) and
  `sitemap-opportunities.xml`. `lastmod` from real data dates (see below), never the build time for everything.
- `lastmod` source: git history of the data files is not reliable (bulk edits touch everything), so each opportunity gets the
  latest dated review/evidence entry that touched it (Sept/Oct 2026 updates carry dates), else the date its source file was
  last changed in git. Hubs use the newest `lastmod` of what they list.
- `scripts/check-sitemap.mjs` (run in the build): fails if a sitemap URL is noindex, non-self-canonical, or has no built file.
- Category pagination for everyone: 60 per page, `/categories/<slug>/page/<n>` with self-canonicals, rel prev/next links.
- Related opportunities (same category + same state/subject, 6-10) on every opportunity page; visible breadcrumbs matching
  `BreadcrumbList`; footer linking every category, /deadlines, guides, /about.
- `scripts/check-orphans.mjs`: crawls the built site from `/` and lists sitemap URLs with no inbound internal link.

## Phase 3 - Opportunity pages worth indexing

- Template sections with H2s from **real fields only**: Who it's for, Cost, Dates and deadline, Format, What you do, How to apply,
  Official link, Last checked. Missing fields are omitted or say "Check the official site".
- A short data-driven summary sentence at the top (built from fields, so it differs per page).
- Deadline status: open / closing soon / closed for this cycle / opens later / rolling. Closed recurring programs stay live.
- Quality score (`src/lib/quality.ts`, threshold in `src/config/seo.ts`): counts real filled fields and description length. Below
  the threshold -> `noindex,follow` and out of the sitemap. Report printed by `scripts/quality-report.mjs`.
- Truncated slugs: report only. Every one found is already live and possibly indexed, and renaming needs your approval.
- Duplicates: report likely duplicates (same official URL or same normalized title + org). No merges without your approval.

## Phase 4 - Import pages

- Every noindex becomes `noindex,follow` (prerender and React `<SEO>`).
- `nyc-dycd-*` stop being noindexed wholesale; they go through the Phase 3 quality score. The NYC pages you listed are forced
  indexable through an allowlist in `src/config/seo.ts`.
- `sf-our415-*` stay 404 (your decision).
- `scripts/report-not-high-school.mjs`: flags imports that look like event calendars, elementary programs, or family services.
  Report only, nothing deleted.

## Phase 5 - Titles, descriptions, CTR

- Homepage title with the brand: "High School Opportunity (HSO) - Internships, Programs & Scholarships".
- Category titles lead with the search phrase and use the current school-cycle range (2026-27), computed from the build date.
  Summer programs: "Summer Programs for High School Students" with real total, free and stipend counts.
- Opportunity titles: "{Program} {cycle year} - Deadline, Eligibility & Cost | HSO" when it fits in ~60 chars, shorter variants
  otherwise. Descriptions use the real deadline, grades and cost.
- `scripts/check-duplicate-meta.mjs` flags duplicate titles/descriptions and pages without exactly one H1.

## Phase 6 - Brand and structured data

- Homepage: Organization (name "High School Opportunity", alternateName "HSO", url, logo, sameAs LinkedIn) + WebSite.
- /about: real prerendered copy (student-run team, how listings are checked) + AboutPage JSON-LD.
- Opportunity pages: drop `Article`; `EducationalOccupationalProgram` with applicationDeadline, provider, educationalLevel,
  offers (only when cost is known); `Event` for competitions with a real date. Keep BreadcrumbList; FAQPage only where visible.
- `scripts/validate-jsonld.mjs`: structural checks on a sample of every page type.

## Phase 7 - Topic landing pages

Real-data pages, built only when at least 10 listings match: `/categories/competitions/{stem,research,science,business,writing,math}`,
`/categories/internships/medical` (main page; the medical guide links to it), `/categories/summer-programs/{free,nyc}`,
city pages where counts allow. Each has a unique intro, real count, full list, FAQs, parent link, sitemap entry.

## Phase 8 - Canonical and technical checks

- Unknown paths return a real 404 (`_redirects`: explicit SPA routes first, then `/* /404.html 404`).
- Absolute self-canonicals everywhere; query-string URLs canonical to the clean page.
- `/auth`, `/profile`, `/unsubscribe`, `/collections/:id` noindexed and out of the sitemap.
- Lighthouse (mobile) on home, one category, one opportunity page; fix the obvious issues.

## Deliverables

`scripts/seo-audit.mjs` (before/after summaries), `SEO-REPORT.md`, and the 20 URLs to submit for indexing.

## Needs your approval (not done without it)

Deleting data, renaming already-indexed URLs (truncated slugs), merging duplicates, changing how opportunities are imported.
