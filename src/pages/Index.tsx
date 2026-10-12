import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarClock, Gift, HandCoins, Layers, LayoutGrid, SearchX } from "lucide-react";
import type { Category } from "@/data/opportunities";
import { allOpportunities as opportunities, locationState } from "@/data/opportunities";
import type { FilterState } from "@/components/Filters";
import { DEFAULT_EXTRA, type ExtraFilterState } from "@/components/ExtraFilters";
import { SORT_OPTIONS, type SortKey } from "@/components/SortBar";
import { HomeFooter } from "@/components/ds/HomeFooter";
import { SEO } from "@/components/SEO";
import { useIsMobile } from "@/hooks/use-mobile";
import { applyFilters, applySort, facetCounts } from "@/lib/filterSort";
import { STATIC_PAGE_META } from "@/lib/pageMeta";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
import { deadlineBuckets } from "@/lib/deadlines";
import { groupSimilarListings } from "@/lib/grouping";
import { curatedCollections } from "@/data/curatedCollections";
import { useNow } from "@/lib/clock";
import { CATEGORY_STYLE } from "@/lib/categoryStyle";
import { cn } from "@/lib/utils";
import {
  Button, DeadlineChip, FilterPanel, ListingCard, ListingGroupCard, MobileFilters, Pager, RailCard,
} from "@/components/ds";

const EMPTY: FilterState = { query: "", categories: [], grades: [], costs: [], formats: [] };

/** Catalogue numbers for the header line. Real counts, computed from the data. */
const STATS = (() => {
  const free = opportunities.filter((o) => o.cost === "Free").length;
  const paid = opportunities.filter((o) => o.cost === "Stipend").length;
  return { total: opportunities.length, free, paid };
})();

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * Homepage: a LinkedIn-jobs style feed. Filters on the left, the list in the
 * middle, deadlines and collections on the right. On phones it is one column
 * and the filters open in a bottom sheet.
 *
 * Every filter, the search, the sort and the page live in the URL
 * (?q=&category=&grade=...), so results can be shared and the back button works.
 */
const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = useRef(true);

  /** Comma-separated lists in the URL; the old "All" sentinel is dropped on read. */
  const readList = (key: string): string[] => {
    const raw = searchParams.get(key);
    if (!raw) return [];
    return raw.split(",").map((s) => s.trim()).filter((s) => s && s !== "All");
  };

  const [filters, setFilters] = useState<FilterState>(() => ({
    query: searchParams.get("q") ?? "",
    categories: readList("category") as FilterState["categories"],
    grades: readList("grade").map(Number).filter(Number.isFinite),
    costs: readList("cost") as FilterState["costs"],
    formats: readList("format") as FilterState["formats"],
  }));
  const [extra, setExtra] = useState<ExtraFilterState>(() => ({
    fields: readList("field"),
    states: readList("state"),
    statuses: readList("status") as ExtraFilterState["statuses"],
    freeOnly: searchParams.get("free") === "1",
    deadlineMonths: readList("month"),
  }));
  const [sort, setSort] = useState<SortKey>((searchParams.get("sort") as SortKey) || "recommended");
  const isMobile = useIsMobile();
  // 30 rows on desktop keeps 30+ listing links in the server-rendered page.
  const pageSize = isMobile ? 15 : 30;
  const [page, setPage] = useState(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  });

  // A search submitted from the top nav changes ?q= while this page is open.
  const urlQuery = searchParams.get("q") ?? "";
  useEffect(() => {
    setFilters((prev) => (prev.query === urlQuery ? prev : { ...prev, query: urlQuery }));
  }, [urlQuery]);

  const deferredFilters = useDeferredValue(filters);
  const deferredExtra = useDeferredValue(extra);
  const deferredSort = useDeferredValue(sort);

  const now = useNow();
  const indexMap = useMemo(() => new Map(opportunities.map((o, i) => [o.id, i])), []);
  const filtered = useMemo(
    () => applySort(applyFilters(opportunities, deferredFilters, deferredExtra), deferredSort, indexMap, now),
    [deferredFilters, deferredExtra, deferredSort, indexMap, now],
  );
  // One program offered at many sites collapses into one expandable card.
  const rows = useMemo(() => groupSimilarListings(filtered), [filtered]);

  /** Result counts per option, given everything else selected (zero-count options hide). */
  const facets = useMemo(
    () => ({
      categories: facetCounts(opportunities, deferredFilters, deferredExtra, "categories", (o) => [o.category]),
      grades: facetCounts(opportunities, deferredFilters, deferredExtra, "grades", (o) => o.grades.map(String)),
      costs: facetCounts(opportunities, deferredFilters, deferredExtra, "costs", (o) => [o.cost]),
      formats: facetCounts(opportunities, deferredFilters, deferredExtra, "formats", (o) => [o.format]),
      states: facetCounts(opportunities, deferredFilters, deferredExtra, "states", (o) => {
        const s = locationState(o.location);
        // A remote program is reachable from every state, so it also counts toward "Nationwide".
        return o.format === "Online" && s !== "Nationwide" ? [s, "Nationwide"] : [s];
      }),
    }),
    [deferredFilters, deferredExtra],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const shown = useMemo(() => rows.slice((safePage - 1) * pageSize, safePage * pageSize), [rows, safePage, pageSize]);

  // Back to page 1 when filters or sort actually change (not on mount, so the
  // back button keeps the page from the URL).
  const filterSignature = JSON.stringify([deferredFilters, deferredExtra, deferredSort]);
  const lastFilterSignature = useRef(filterSignature);
  useEffect(() => {
    if (lastFilterSignature.current === filterSignature) return;
    lastFilterSignature.current = filterSignature;
    setPage(1);
  }, [filterSignature]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // State -> URL (replace, so filtering does not fill the history).
  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    const p = new URLSearchParams();
    const setList = (key: string, list: (string | number)[]) => {
      if (list.length) p.set(key, list.join(","));
    };
    if (filters.query) p.set("q", filters.query);
    setList("category", filters.categories);
    setList("grade", filters.grades);
    setList("cost", filters.costs);
    setList("format", filters.formats);
    setList("field", extra.fields);
    setList("state", extra.states);
    setList("status", extra.statuses);
    if (extra.freeOnly) p.set("free", "1");
    setList("month", extra.deadlineMonths);
    if (sort !== "recommended") p.set("sort", sort);
    if (safePage > 1) p.set("page", String(safePage));
    setSearchParams(p, { replace: true });
  }, [filters, extra, sort, safePage, setSearchParams]);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
    window.requestAnimationFrame(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const clearAll = () => {
    setFilters((prev) => ({ ...EMPTY, query: prev.query }));
    setExtra(DEFAULT_EXTRA);
  };
  const panel = { filters, extra, facets, onFilters: setFilters, onExtra: setExtra, onClear: clearAll };

  // A label, not a sentence: the page opens on the list, not on a greeting.
  const heading = filters.query ? `Results for "${filters.query}"` : "High school opportunities";

  return (
    <div className="hso-ds min-h-screen bg-hso-canvas font-hso text-hso-fg">
      <SEO {...STATIC_PAGE_META["/"]} />
      <main className="mx-auto max-w-hso-page px-4 pb-16 pt-5 md:pt-6">
        <WelcomeBand
          heading={heading}
          active={filters.categories}
          onToggle={(c) => setFilters((prev) => ({ ...prev, categories: prev.categories.includes(c) ? prev.categories.filter((x) => x !== c) : [...prev.categories, c] }))}
        />

        <div className="grid gap-6 lg:grid-cols-[var(--hso-col-left)_minmax(0,1fr)_var(--hso-col-right)]">
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-[calc(var(--hso-nav-height)+1rem)] max-h-[calc(100vh-var(--hso-nav-height)-2rem)] overflow-y-auto rounded-hso border border-hso-line bg-hso-surface p-4">
              <FilterPanel {...panel} />
            </div>
          </aside>

          <section id="results" aria-label="Results" className="min-w-0 scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="flex-1 lg:hidden">
                <MobileFilters {...panel} resultCount={filtered.length} />
              </div>
              <p className="hidden text-sm text-hso-muted lg:block lg:flex-1" aria-live="polite">
                {fmt(filtered.length)} {filtered.length === 1 ? "result" : "results"}
              </p>
              <label className="flex items-center gap-2 text-sm text-hso-muted">
                <span className="hidden sm:inline">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort results"
                  className="h-11 rounded-hso border border-hso-line-strong bg-hso-surface px-2 text-sm font-medium text-hso-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-hso-coral-strong"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mb-3 text-sm text-hso-muted lg:hidden" aria-live="polite">
              {fmt(filtered.length)} {filtered.length === 1 ? "result" : "results"}
            </p>

            {filtered.length === 0 ? (
              <div className="hso-rise rounded-hso border border-hso-line bg-hso-surface px-6 py-12 text-center">
                <SearchX className="mx-auto h-8 w-8 text-hso-subtle" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-semibold">No matches</h2>
                <p className="mt-1 text-sm text-hso-muted">Try fewer filters or a shorter search.</p>
                <Button variant="secondary" className="mt-4" onClick={clearAll}>Clear filters</Button>
              </div>
            ) : (
              // Keyed by the filters, sort and page: a new result set re-runs the
              // staggered entrance instead of swapping cards in place.
              <div key={`${filterSignature}|${safePage}`} className="space-y-3">
                {shown.map((r, i) =>
                  r.kind === "group" ? (
                    <ListingGroupCard key={r.key} name={r.name} items={r.items} headingLevel={2} index={i} />
                  ) : (
                    <ListingCard key={r.opp.id} opp={r.opp} headingLevel={2} index={i} />
                  ),
                )}
              </div>
            )}
            <Pager page={safePage} total={totalPages} onChange={goToPage} />
          </section>

          <aside aria-label="More" className="space-y-4">
            <DeadlinesThisWeek />
            <PopularCollections />
            <BrowseCategories />
          </aside>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
};

function CategoryIcon({ category, size = "sm" }: { category: Category; size?: "sm" | "md" }) {
  const st = CATEGORY_STYLE[category];
  const Icon = st.icon;
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-hso", st.tile, size === "md" ? "h-10 w-10" : "h-7 w-7")}>
      <Icon className={size === "md" ? "h-5 w-5" : "h-3.5 w-3.5"} aria-hidden="true" />
    </span>
  );
}

const SHORTCUTS: { category: Category; label: string }[] = [
  { category: "Internship", label: "Internships" },
  { category: "Summer Program", label: "Summer programs" },
  { category: "Scholarship", label: "Scholarships" },
  { category: "Research", label: "Research" },
  { category: "Competition", label: "Competitions" },
  { category: "Fellowship", label: "Fellowships" },
];

/**
 * Compact top band (not a hero): a short title, three real numbers in
 * brand-tinted tiles, and category shortcuts that toggle the category filter.
 * No greeting copy.
 */
function WelcomeBand({ heading, active, onToggle }: { heading: string; active: Category[]; onToggle: (c: Category) => void }) {
  return (
    <section className="hso-rise mb-6 rounded-hso border border-hso-line bg-hso-surface p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{heading}</h1>
        <dl className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[420px]">
          <Stat icon={LayoutGrid} value={fmt(STATS.total)} label="programs" tone="neutral" />
          <Stat icon={Gift} value={fmt(STATS.free)} label="free" tone="green" />
          <Stat icon={HandCoins} value={fmt(STATS.paid)} label="paid" tone="coral" />
        </dl>
      </div>
      <div className="-mx-5 mt-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:-mx-6 md:px-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2">
          {SHORTCUTS.map((sc, i) => {
            const on = active.includes(sc.category);
            return (
              <button
                key={sc.category}
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(sc.category)}
                style={{ "--i": i + 2 } as React.CSSProperties}
                className={cn(
                  "hso-press hso-rise flex min-h-hso-tap shrink-0 items-center gap-2.5 whitespace-nowrap rounded-hso border px-3 py-2 text-left text-sm font-semibold lg:flex-1",
                  on ? "border-hso-coral bg-hso-coral-tint text-hso-fg" : "border-hso-line bg-hso-surface text-hso-fg hover:border-hso-line-strong hover:bg-hso-sunken",
                )}
              >
                <CategoryIcon category={sc.category} />
                {sc.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STAT_TONES = {
  neutral: "bg-hso-neutral-tint text-hso-fg",
  green: "bg-hso-green-tint text-hso-green-strong",
  coral: "bg-hso-coral-tint text-hso-coral-strong",
};

function Stat({ icon: Icon, value, label, tone }: { icon: typeof Gift; value: string; label: string; tone: keyof typeof STAT_TONES }) {
  return (
    <div className={cn("rounded-hso px-3 py-2.5", STAT_TONES[tone])}>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="flex items-center gap-1.5 text-lg font-bold tabular-nums leading-tight sm:text-xl">
          <Icon className="hidden h-4 w-4 sm:block" aria-hidden="true" />
          {value}
        </span>
        <span className="text-xs font-medium opacity-90">{label}</span>
      </dd>
    </div>
  );
}

/** Closing in the next 7 days; topped up from the next 30 when the week is quiet. */
function DeadlinesThisWeek() {
  const now = useNow();
  const items = useMemo(() => {
    const [week, month] = deadlineBuckets(now);
    const byDate = (a: { deadline: string | null }, b: { deadline: string | null }) => (a.deadline ?? "").localeCompare(b.deadline ?? "");
    const list = [...week.items].sort(byDate);
    return { list: (list.length >= 3 ? list : [...list, ...[...month.items].sort(byDate)]).slice(0, 5), thisWeek: list.length >= 3 };
  }, [now]);
  if (!items.list.length) return null;
  return (
    <RailCard icon={CalendarClock} title={items.thisWeek ? "Deadlines this week" : "Deadlines coming up"} more={{ to: "/deadlines", label: "See all deadlines" }}>
      <ul className="divide-y divide-hso-line">
        {items.list.map((o) => (
          <li key={o.id} className="py-2.5">
            <Link to={`/opportunities/${o.id}`} className="block rounded-hso-sm text-sm font-semibold leading-snug text-hso-fg hover:underline">
              {o.title}
            </Link>
            <p className="mt-0.5 truncate text-xs text-hso-muted">{o.org}</p>
            <div className="mt-1.5"><DeadlineChip deadline={o.deadline} opensAt={o.opensAt} /></div>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

/** Curated collections, in the editors' order, with their real program counts. */
function PopularCollections() {
  const list = curatedCollections.filter((c) => c.is_active !== false).slice(0, 5);
  return (
    <RailCard icon={Layers} tone="green" title="Popular collections" more={{ to: "/collections", label: "See all collections" }}>
      <ul className="divide-y divide-hso-line">
        {list.map((c) => (
          <li key={c.id}>
            <Link to={`/collections/${c.id}`} className="flex min-h-hso-tap items-center justify-between gap-3 py-2 text-sm text-hso-fg hover:underline">
              <span className="font-medium">{c.title}</span>
              <span className="shrink-0 text-xs text-hso-subtle">{c.opportunityIds.length} programs</span>
            </Link>
          </li>
        ))}
      </ul>
    </RailCard>
  );
}

/** Plain links to every category page, with counts. */
function BrowseCategories() {
  return (
    <RailCard icon={LayoutGrid} title="Browse by category">
      <ul>
        {CATEGORY_SLUGS.map((slug) => {
          const n = opportunities.filter((o) => o.category === CATEGORY_META[slug].category).length;
          return (
            <li key={slug}>
              <Link to={`/categories/${slug}`} className="group flex min-h-hso-tap items-center justify-between gap-3 text-sm text-hso-fg">
                <span className="flex items-center gap-2.5 group-hover:underline">
                  <CategoryIcon category={CATEGORY_META[slug].category} />
                  {CATEGORY_META[slug].h1.replace(/\s+for high school students$/i, "").replace(/^./, (ch) => ch.toUpperCase())}
                </span>
                <span className="text-xs text-hso-subtle">{fmt(n)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </RailCard>
  );
}

export default Index;
