## Mobile-first redesign

The current home page is built desktop-first: the hero is huge, the rotated spotlight card overflows, the nav buttons wrap, the filter row pushes off-screen, and the shelf panel doesn't fit small viewports. This plan restructures everything below `md` (tablet) and `sm` (phone) breakpoints without touching data or business logic.

### 1. Nav (`src/pages/Index.tsx` header)
- Hide the "High School Opportunity Finder" tagline below `sm` (already partly done — verify).
- On mobile: collapse "My Shelf" and "Sign in/out" to icon-only buttons (keep the saved-count badge on the bookmark icon).
- Reduce header padding from `py-4` to `py-3` on mobile.
- Use `px-4` on mobile, `px-6` from `md` up.

### 2. Hero (`src/pages/Index.tsx` hero section)
- Drop padding from `py-20 lg:py-28` to `py-10 sm:py-16 lg:py-28`.
- Headline: `text-3xl sm:text-5xl lg:text-7xl` (was `text-5xl … lg:text-7xl`).
- Hide the rotated Spotlight card and the "10,000+" badge below `lg`. Replace with a compact inline "Spotlight" strip that sits above the filters on mobile (one-line org + title + chevron link).
- Filters render directly under the headline on mobile, no two-column grid.

### 3. Filters (`src/components/Filters.tsx`)
- Search input: full width, sticky under the nav on mobile (`sticky top-[64px] z-20`), shrink height to `h-12` on mobile.
- Category chips: keep horizontal scroll, add `snap-x snap-mandatory` and `snap-start` on each chip.
- Replace the three Grade / Cost / Format selects with a single **"Filters"** button on mobile that opens a shadcn `Sheet` (bottom drawer) containing the three selects stacked vertically + a "Reset" + "Apply" footer. Above `md`, keep the inline pills.
- Show an active-filter count badge on the Filters button when any non-"All" value is set.

### 4. Cards grid (`src/pages/Index.tsx` results section)
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (currently `sm:grid-cols-2`, which kicks in at 640px and squishes phones in landscape and small tablets).
- Reduce gap on mobile: `gap-4 md:gap-6`.
- Section padding: `px-4 py-10 md:px-6 md:py-16`.

### 5. Opportunity card (`src/components/OpportunityCard.tsx`)
- Title: `text-xl sm:text-2xl` with `break-words`.
- Bottom meta grid stays 2-col but tightens spacing.
- Replace the bare "Visit program" link with a full-width pill button at the bottom on mobile (still inline link style on `sm+`). Increases tap target to ~44px.
- Ensure the dropdown + favorite buttons are at least 40×40 on touch.

### 6. My Shelf panel (`src/components/CollectionsPanel.tsx`)
- Convert to shadcn `Sheet` with `side="right"` on desktop and `side="bottom"` (full-height) on mobile, OR make the existing panel `inset-0` full-screen below `sm`.
- Add a sticky close button in the header.

### 7. Global polish
- Audit every section for `overflow-x-hidden` on `<body>` / root container.
- Replace any `px-6` with `px-4 md:px-6` at the page level.
- Add `text-balance` + `break-words` on long headings.
- Verify at 320, 390, 414, 768, 834, 1024, 1280px viewports — no horizontal scroll, all CTAs reachable, search visible above the fold.

### Out of scope
- No data, auth, routing, or copy changes.
- Visual language (fonts, coral/sage/ink palette, grain texture, animations) stays identical.

### Files touched
- `src/pages/Index.tsx`
- `src/components/Filters.tsx`
- `src/components/OpportunityCard.tsx`
- `src/components/CollectionsPanel.tsx`
- possibly `src/index.css` for one or two utility additions
