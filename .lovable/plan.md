# HSO Upgrade Plan

This is a large scope (15 items). I'll break it into 4 phases so each ships clean and reviewable. Item 1 (copy: "10,000+" → "300+ curated opportunities, growing weekly") was already shipped in the previous turn — confirmed gone from `index.html`, hero, spotlight stat card, and intro splash.

## Phase 1 — Static pages, trust, navigation, SEO basics
- **About page** (`/about`) — what HSO is, opportunity types covered, editorial copy.
- **Contact & Corrections** (`/contact`) — form with reason types (outdated deadline, missing opportunity, broken link, general).
- **Privacy** (`/privacy`) — accounts, saved favorites/collections, Lovable Cloud (Supabase) backend, Google sign-in mention.
- **Terms** (`/terms`) — verify deadlines/eligibility/cost on official sites; HSO is a discovery layer.
- **"How HSO works"** section under hero on Index (4 steps with icons).
- **Source / trust** section with the provided copy + 4 badges (Official links, Updated weekly, Student-focused, Global opportunities).
- **Footer + header nav** updated: About, Contact, Submit Opportunity, Privacy, Terms.
- **`public/robots.txt`** points to `/sitemap.xml`; **`public/sitemap.xml`** lists all routes including category pages.

## Phase 2 — Submit Opportunity + Contact backend
- **Supabase tables**: `opportunity_submissions` and `contact_messages`. RLS: anyone can INSERT (anon), no SELECT for anon. (Admin review can be added later.)
- **Submit Opportunity** modal/page (`/submit`) with full form, zod validation, success toast "Thanks — we'll review this opportunity."
- **Contact page** writes to `contact_messages`.
- Header gets a small "Submit" button; footer gets a link too.

## Phase 3 — Opportunity UX upgrades
- **Deadline status helper** (`src/lib/deadline.ts`): Open / Closing soon (<30d) / Closed / Rolling. Used on cards.
- **Sorting bar** above results: Recommended, Deadline soon, Newest added, Free first, Online first, Highest prestige. (Newest = stable insertion order from dataset.)
- **Extra filters**: Field/interest (multi), Country/location, Application status, Free/aid only, Deadline month.
- **Opportunity detail page** (`/opportunities/:id`) — full info, official link CTA, save, add to collection, related opportunities (same category/fields).
- **Homepage strips**: "Deadline Soon" and "Recently Added" compact horizontal scrollers above the main grid.
- **Category pages** (`/categories/:slug`) for summer-programs, internships, scholarships, research, competitions, volunteer, fellowships. Each: H1, intro paragraph, filtered grid, cross-links to siblings, dynamic `<title>` and `<meta description>` via `react-helmet-async` (already in stack? — will add if missing).

## Phase 4 — Account features
- **Deadline reminders preferences**: `reminder_preferences` table (user_id, opp_id, intervals[]). UI on opportunity detail + collections. Email sending left as TODO with clear comments + an unhooked edge function stub `send-deadline-reminders` (cron-ready).
- **Shareable collections**: add `is_public boolean` and `slug` to existing collections store. Public route `/collections/:id` shows read-only collection (no owner email/profile data exposed). Persist collections to Supabase (currently localStorage) so public links work cross-device. Keep local fallback for signed-out users.

---

## Technical notes (for reference)

- New deps: `react-helmet-async` for per-page SEO. Possibly `date-fns` (likely already present).
- Routes added in `src/App.tsx`: `/about`, `/contact`, `/privacy`, `/terms`, `/submit`, `/opportunities/:id`, `/categories/:slug`, `/collections/:id`.
- Sitemap is a static file in `public/` — fine since routes are known. Will be regenerated if categories change.
- All copy stays editorial (font-display, italic accents, coral/sage/ink palette). No new colors.
- Mobile: every new section uses the same responsive patterns already in `Index.tsx`.
- Existing behaviors preserved: auth flow, favorites store, filters component, intro splash.

## Confirmation needed

Before I start: do you want me to ship **all 4 phases in this single run** (large change set, ~15-20 files), or **phase by phase** so you can review each? Phase-by-phase is safer; all-at-once is faster but harder to review.
