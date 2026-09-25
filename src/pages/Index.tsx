import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookmarkPlus,
  Calendar,
  ExternalLink,
  Filter as FilterIcon,
  GraduationCap,
  Globe,
  Layers,
  MapPin,
  Search,
  Wifi,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { allOpportunities as opportunities, locationState } from "@/data/opportunities";
import type { Category, Opportunity } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterState, COST_OPTIONS, FORMAT_OPTIONS, GRADE_OPTIONS } from "@/components/Filters";
import { ExtraFilters, DEFAULT_EXTRA, ExtraFilterState } from "@/components/ExtraFilters";
import { SortKey, SORT_OPTIONS } from "@/components/SortBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterDropdown } from "@/components/FilterDropdown";
import { MultiFilterDropdown } from "@/components/MultiFilterDropdown";
import { SiteFooter } from "@/components/SiteFooter";
import { ReturnToFiltersButton } from "@/components/ReturnToFiltersButton";
import { Pagination } from "@/components/Pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { applyFilters, applySort, facetCounts } from "@/lib/filterSort";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

const MONTH_LABELS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const CATEGORY_CHIPS: (Category | "All")[] = [
  "All",
  "Summer Program",
  "Internship",
  "Research",
  "Scholarship",
  "Competition",
  "Fellowship",
];

const CATEGORY_ACCENT: Record<string, { strip: string; tint: string; chip: string }> = {
  Research: { strip: "bg-sage", tint: "from-sage/10", chip: "bg-sage/10 text-sage border-sage/20" },
  Internship: { strip: "bg-sky", tint: "from-sky/18", chip: "bg-sky/15 text-ink border-sky/30" },
  Competition: { strip: "bg-coral", tint: "from-coral/10", chip: "bg-coral/10 text-coral border-coral/20" },
  "Summer Program": { strip: "bg-ochre", tint: "from-ochre/18", chip: "bg-ochre/15 text-ink border-ochre/30" },
  Scholarship: { strip: "bg-sunny", tint: "from-sunny/24", chip: "bg-sunny/25 text-ink border-sunny/40" },
  Volunteer: { strip: "bg-sage", tint: "from-sage/10", chip: "bg-sage/10 text-sage border-sage/20" },
  Fellowship: { strip: "bg-coral", tint: "from-coral/10", chip: "bg-coral/10 text-coral border-coral/20" },
};

const Index = () => {
  const { isAuthed, loading: authLoading } = useAuthSession();

  const [searchParams, setSearchParams] = useSearchParams();
  const initial = useRef(true);

  /**
   * Multi-value filters travel in the URL as comma-separated lists
   * (?category=Research,Internship). Old single-value links still parse — one
   * value simply yields a one-item list — so shared and indexed URLs keep working.
   * "All" was the previous no-op sentinel and is dropped on read.
   */
  const readList = (key: string): string[] => {
    const raw = searchParams.get(key);
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== "All");
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
  const [sort, setSort] = useState<SortKey>(
    (searchParams.get("sort") as SortKey) || "recommended",
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 12 : 24;
  const [page, setPage] = useState(() => {
    const raw = Number(searchParams.get("page"));
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  });
  const deferredFilters = useDeferredValue(filters);
  const deferredExtra = useDeferredValue(extra);
  const deferredSort = useDeferredValue(sort);

  const indexMap = useMemo(() => new Map(opportunities.map((o, i) => [o.id, i])), []);
  const filtered = useMemo(
    () => applySort(applyFilters(opportunities, deferredFilters, deferredExtra), deferredSort, indexMap),
    [deferredFilters, deferredExtra, deferredSort, indexMap],
  );
  /**
   * How many results each filter option would actually return, given whatever
   * else is currently selected. Options that would return nothing are hidden,
   * so a student never picks a state or field and lands on an empty page.
   */
  const facets = useMemo(
    () => ({
      categories: facetCounts(opportunities, deferredFilters, deferredExtra, "categories", (o) => [o.category]),
      grades: facetCounts(opportunities, deferredFilters, deferredExtra, "grades", (o) => o.grades.map(String)),
      costs: facetCounts(opportunities, deferredFilters, deferredExtra, "costs", (o) => [o.cost]),
      formats: facetCounts(opportunities, deferredFilters, deferredExtra, "formats", (o) => [o.format]),
      fields: facetCounts(opportunities, deferredFilters, deferredExtra, "fields", (o) => o.fields),
      states: facetCounts(opportunities, deferredFilters, deferredExtra, "states", (o) => {
        const s = locationState(o.location);
        // A remote program is reachable from every state, so it counts toward
        // "Nationwide" even when its location names a city.
        return o.format === "Online" && s !== "Nationwide" ? [s, "Nationwide"] : [s];
      }),
    }),
    [deferredFilters, deferredExtra],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const shown = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  // Reset to page 1 whenever filters/sort actually change (never on mount,
  // so returning via the back button keeps the page from the URL).
  const filterSignature = JSON.stringify([deferredFilters, deferredExtra, deferredSort]);
  const lastFilterSignature = useRef(filterSignature);
  useEffect(() => {
    if (lastFilterSignature.current === filterSignature) return;
    lastFilterSignature.current = filterSignature;
    setPage(1);
  }, [filterSignature]);


  // Clamp page if filtered set shrinks below the current page.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Sync state -> URL (replace so we don't pollute history).
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
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    window.requestAnimationFrame(() => {
      document
        .getElementById("opportunity-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const deadlineSoon = useMemo(
    () =>
      opportunities
        .filter((o) => {
          const s = getDeadlineStatus(o.deadline, o.opensAt).status;
          return s === "closing-soon" || s === "open";
        })
        .sort(
          (a, b) =>
            (a.deadline ? new Date(a.deadline).getTime() : Infinity) -
            (b.deadline ? new Date(b.deadline).getTime() : Infinity),
        )
        .slice(0, 6),
    [],
  );
  const recentlyAdded = useMemo(() => opportunities.slice(-6).reverse(), []);
  const standouts = useMemo(
    () =>
      opportunities
        .filter((o) => o.prestige === 3 && o.id !== "isef")
        .sort((a, b) => {
          if (a.id === "columbia-freedom-citizenship") return -1;
          if (b.id === "columbia-freedom-citizenship") return 1;
          if (a.id === "yefa-ysic") return -1;
          if (b.id === "yefa-ysic") return 1;
          return 0;
        })
        .slice(0, 6),
    [],
  );

  /**
   * Chips toggle rather than replace, so several categories can be active.
   *
   * These use the functional updater deliberately: two chips clicked in the
   * same tick would otherwise both read the same pre-update state and the first
   * selection would be silently discarded.
   */
  const toggleCategory = (category: Category | "All") => {
    setFilters((prev) => ({
      ...prev,
      categories:
        category === "All"
          ? []
          : prev.categories.includes(category)
            ? prev.categories.filter((c) => c !== category)
            : [...prev.categories, category],
    }));
    window.requestAnimationFrame(() => {
      document.getElementById("explore-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleFormat = (format: FilterState["formats"][number]) => {
    setFilters((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      <SEO
        title="High School Internships, Scholarships & Programs | HSO"
        description="Free U.S. opportunity finder for high schoolers: internships, summer programs, scholarships, research, and competitions — curated and deadline-tracked."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "HSO",
          url: "https://highschoolopportunity.org/",
        }}
      />
      <main className="relative z-10">
        <Hero
          isAuthed={isAuthed}
          authLoading={authLoading}
          deadlineSoon={deadlineSoon}
        />

        <section className="mx-auto w-full max-w-[1400px] px-4 pt-10 sm:px-6 lg:pt-16">
          <FeaturedShelf closingSoon={deadlineSoon} newlyAdded={recentlyAdded} standouts={standouts} />
        </section>

        <section id="opportunity-filters" className="scroll-mt-28">
          <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-16">
            <aside id="filters-section" className="scroll-mt-28 lg:sticky lg:top-24 lg:self-start">
              <RefinePanel
                filters={filters}
                setFilters={setFilters}
                extra={extra}
                setExtra={setExtra}
                sort={sort}
                setSort={setSort}
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                facets={facets}
                count={filtered.length}
              />
            </aside>

            <div className="min-w-0">
              <div id="explore-heading" className="scroll-mt-28">
                <div className="flex flex-col gap-5 border-b border-white/60 bg-cream/18 pb-5 backdrop-blur-[2px] md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">Explore opportunities</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                      {filtered.length.toLocaleString()} programs in the catalog
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Use the sidebar to narrow by state, field, grade, cost, format, status, and deadline.
                    </p>
                  </div>
                </div>
                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    placeholder="Search programs, fields, organizations…"
                    className="h-12 rounded-full border-border bg-card pl-12 pr-4 text-base shadow-soft focus-visible:ring-coral"
                  />
                </div>
              </div>

              <div className="-mx-4 mt-5 overflow-visible sm:mx-0">
                <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:px-0">
                  {CATEGORY_CHIPS.map((c) => {
                    const active =
                      c === "All" ? filters.categories.length === 0 : filters.categories.includes(c);
                    return (
                      <button
                        key={c}
                        aria-pressed={active}
                        onClick={() => toggleCategory(c)}
                        className={cn(
                          "shrink-0 rounded-full border px-4 py-2 text-sm font-bold shadow-[inset_0_1px_0_hsl(0_0%_100%/0.68)] transition-[transform,border-color,background-color,color,box-shadow] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
                          active
                            ? "border-ink bg-ink text-cream shadow-[0_16px_30px_-24px_hsl(var(--ink)/0.7)]"
                            : "border-white/70 bg-card/64 text-foreground backdrop-blur-md hover:border-coral/35 hover:bg-card/82",
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Where can you do it? Kept beside the category chips rather than
                  buried in the sidebar — for a student outside a big metro this
                  is the first question, not an advanced refinement. */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Where
                </span>
                {FORMAT_OPTIONS.map((f) => {
                  const active = filters.formats.includes(f.value);
                  const Icon = f.value === "Online" ? Wifi : f.value === "In-person" ? MapPin : Layers;
                  return (
                    <button
                      key={f.value}
                      onClick={() => toggleFormat(f.value)}
                      aria-pressed={active}
                      title={f.hint}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
                        active
                          ? "border-coral bg-coral text-coral-foreground shadow-[0_14px_26px_-20px_hsl(var(--coral)/0.8)]"
                          : "border-white/70 bg-card/64 text-foreground backdrop-blur-md hover:border-coral/35",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {f.label}
                    </button>
                  );
                })}
                {filters.formats.length > 0 && (
                  <button
                    onClick={() => setFilters({ ...filters, formats: [] })}
                    className="text-xs font-bold text-muted-foreground underline underline-offset-4 hover:text-coral"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <EmptyState clear={() => {
                  setFilters({ ...filters, categories: [], grades: [], costs: [], formats: [] });
                  setExtra(DEFAULT_EXTRA);
                }} />
              ) : (
                <div id="opportunity-results" className="scroll-mt-28">
                  <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {shown.map((o, i) => (
                      <OpportunityCard key={o.id} opp={o} index={i} />
                    ))}
                  </div>
                  <p className="mt-6 text-center text-xs font-medium text-muted-foreground">
                    Showing {((safePage - 1) * pageSize + 1).toLocaleString()}–
                    {Math.min(safePage * pageSize, filtered.length).toLocaleString()} of{" "}
                    {filtered.length.toLocaleString()}
                  </p>
                  <Pagination
                    page={safePage}
                    totalPages={totalPages}
                    onChange={goToPage}
                    isMobile={isMobile}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <HowItWorks />
        <TrustBand />
        <PopularSearches />
        <SiteFooter />
        <ReturnToFiltersButton targetId="opportunity-filters" />
      </main>
    </div>
  );
};

function Hero({
  isAuthed,
  authLoading,
  deadlineSoon,
}: {
  isAuthed: boolean;
  authLoading: boolean;
  deadlineSoon: Opportunity[];
}) {
  const topPicks = deadlineSoon.slice(0, 3);

  return (
    <section className="hso-surface-grid relative overflow-hidden border-b border-white/55">
      <div className="hso-intro-rule pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral/45 to-transparent" />
      <div className="mx-auto grid w-full max-w-[1400px] min-w-0 gap-10 overflow-hidden px-4 py-14 sm:px-6 md:grid-cols-[0.96fr_1.04fr] md:items-center md:overflow-visible lg:min-h-[calc(100dvh-76px)] lg:py-20">
        <div className="hso-mobile-fit min-w-0 md:w-full md:max-w-3xl">
          <div style={{ "--intro-delay": "80ms" } as React.CSSProperties} className="hso-intro-fade inline-flex items-center gap-2 rounded-full border border-white/65 bg-card/66 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)] backdrop-blur-xl">
            <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-coral to-sage" />
            Curated signal for high schoolers
          </div>
          <h1 style={{ "--intro-delay": "160ms" } as React.CSSProperties} className="hso-intro-rise mt-6 max-w-full break-words font-display text-[2.25rem] font-semibold leading-[0.98] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            A sharper map for high school opportunity.
          </h1>
          <p style={{ "--intro-delay": "260ms" } as React.CSSProperties} className="hso-intro-fade mt-5 max-w-[32ch] text-base leading-relaxed text-muted-foreground sm:max-w-2xl sm:text-lg">
            HSO turns internships, research programs, scholarships, civic work, competitions, and summer programs into one calm catalog students can actually use.
          </p>

          <div style={{ "--intro-delay": "360ms" } as React.CSSProperties} className="hso-intro-fade mt-7 flex flex-col gap-3 sm:flex-row">
            {!authLoading && !isAuthed && (
              <Link
                to="/auth"
                className="inline-flex h-12 w-full max-w-[22rem] items-center justify-center rounded-full border border-white/65 bg-card/72 px-6 text-sm font-bold text-ink shadow-[inset_0_1px_0_hsl(0_0%_100%/0.7),0_18px_36px_-24px_hsl(var(--ink)/0.45)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-coral/35 hover:bg-card active:scale-[0.98] active:translate-y-0 sm:w-auto"
              >
                Sign up free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => document.getElementById("explore-heading")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="inline-flex h-14 w-full max-w-[24rem] items-center justify-center rounded-full bg-coral px-8 text-base font-bold text-cream shadow-[0_20px_40px_-24px_hsl(var(--coral)/0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_52px_-24px_hsl(var(--coral)/0.65)] active:scale-[0.98] active:translate-y-0 sm:w-auto"
            >
              Browse the catalog
              <ArrowRight className="ml-2.5 h-5 w-5" />
            </button>
          </div>

          <div className="hso-glass-panel mt-9 grid max-w-full grid-cols-3 items-stretch overflow-hidden rounded-[1.35rem] px-2 py-4 sm:max-w-2xl sm:px-3">
            <Metric value="2000+" label="Programs" />
            <Metric value="50" label="States" />
            <Metric value="Official" label="Links" />
          </div>
        </div>

        <div className="hso-mobile-fit relative min-w-0 md:w-full md:max-w-none md:pl-4">
          <div className="absolute -left-7 top-12 hidden h-44 w-24 -rotate-12 border-y border-coral/30 md:block" />
          <div className="hso-glass-panel hso-surface-grid relative max-w-full overflow-hidden rounded-[2rem] p-4">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--coral)/0.08),transparent_36%,hsl(var(--sage)/0.08))]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[repeating-linear-gradient(90deg,hsl(var(--ink)/0.045)_0_1px,transparent_1px_18px)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-coral">Deadline radar</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">Worth checking today</h2>
                </div>
                <span className="hidden rounded-full border border-sage/20 bg-sage/10 px-3 py-1 text-xs font-bold text-sage sm:inline-flex">
                  Live list
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {topPicks.map((opp, index) => (
                  <HeroPick key={opp.id} opp={opp} index={index} />
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/70 bg-card/70 p-4 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.75),0_18px_44px_-36px_hsl(var(--ink)/0.46)] backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
                  <span className="rounded-full border border-coral/20 bg-coral/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-coral">
                    3 steps
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <WorkflowStep index="01" label="Filter by state, field, deadline" />
                  <WorkflowStep index="02" label="Open the official program page" />
                  <WorkflowStep index="03" label="Save favorites when signed in" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPick({ opp, index }: { opp: Opportunity; index: number }) {
  const dl = getDeadlineStatus(opp.deadline, opp.opensAt);
  const accent = CATEGORY_ACCENT[opp.category] ?? CATEGORY_ACCENT.Research;

  return (
    <Link
      to={`/opportunities/${opp.id}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-border/70 bg-card/85 p-3 transition-transform hover:-translate-y-0.5 hover:border-ink/20"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-xs font-black text-cream">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", accent.chip)}>
          {opp.category}
        </span>
        <span className="mt-1 block truncate font-display text-sm font-semibold text-ink group-hover:text-coral">
          {opp.title}
        </span>
        <span className="block truncate text-xs text-muted-foreground">{opp.org}</span>
      </span>
      <span className={cn("hidden rounded-full px-2 py-1 text-[10px] font-bold sm:inline-flex", STATUS_STYLES[dl.status])}>{dl.status === "open" ? "Open" : dl.status === "closing-soon" ? "Soon" : dl.status === "opens-later" ? "Later" : dl.status === "rolling" ? "TBA" : "Closed"}</span>
    </Link>
  );
}

function WorkflowStep({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/60 bg-cream/50 px-3 py-2 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.7)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-[10px] font-black text-cream">
        {index}
      </span>
      <span className="min-w-0 text-sm font-semibold leading-snug text-ink">{label}</span>
    </div>
  );
}

function Metric({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="relative flex min-w-0 flex-col items-center justify-center px-2 text-center after:absolute after:right-0 after:top-1/2 after:hidden after:h-12 after:w-px after:-translate-y-1/2 after:bg-border/70 last:after:hidden min-[420px]:after:block sm:px-4">
      <p className="max-w-full truncate font-display text-[1.35rem] font-semibold leading-none text-ink sm:text-2xl">{value}</p>
      {sub && <p className="mt-0.5 max-w-full truncate text-[9px] font-bold text-coral sm:text-[11px]">{sub}</p>}
      <p className="mt-2 max-w-full truncate text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">{label}</p>
    </div>
  );
}

function FeaturedShelf({
  closingSoon,
  newlyAdded,
  standouts,
}: {
  closingSoon: Opportunity[];
  newlyAdded: Opportunity[];
  standouts: Opportunity[];
}) {
  const renderShelf = (items: Opportunity[]) => {
    const shelfItems = items.slice(0, 6);
    if (!shelfItems.length) return null;
    return (
      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shelfItems.map((opp) => (
          <FeaturedProgram key={opp.id} opp={opp} />
        ))}
      </div>
    );
  };

  const tabBase =
    "relative rounded-none border-0 bg-transparent px-0 pb-2 pt-1 text-sm font-bold text-muted-foreground shadow-none transition-colors hover:text-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-ink";

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-coral">Featured opportunities</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A sharper first look.
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:justify-self-end">
          Deadlines, new additions, and high-signal programs are separated into a cleaner scan path.
        </p>
      </div>

      <Tabs defaultValue="closing" className="mt-7">
        <TabsList className="h-auto justify-start gap-7 rounded-none border-b border-border/70 bg-transparent p-0">
          <TabsTrigger value="closing" className={`${tabBase} data-[state=active]:after:bg-coral after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-transparent`}>
            Closing Soon
          </TabsTrigger>
          <TabsTrigger value="new" className={`${tabBase} data-[state=active]:after:bg-sage after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-transparent`}>
            New Finds
          </TabsTrigger>
          <TabsTrigger value="standouts" className={`${tabBase} data-[state=active]:after:bg-ochre after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-transparent`}>
            Standouts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="closing" className="mt-6 animate-in fade-in-50 duration-300">
          {renderShelf(closingSoon)}
        </TabsContent>
        <TabsContent value="new" className="mt-6 animate-in fade-in-50 duration-300">
          {renderShelf(newlyAdded)}
        </TabsContent>
        <TabsContent value="standouts" className="mt-6 animate-in fade-in-50 duration-300">
          {renderShelf(standouts)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeaturedProgram({ opp }: { opp: Opportunity }) {
  const dl = getDeadlineStatus(opp.deadline, opp.opensAt);
  const accent = CATEGORY_ACCENT[opp.category] ?? CATEGORY_ACCENT.Research;

  return (
    <Link
      to={`/opportunities/${opp.id}`}
      className={cn(
        "hso-elevated-surface hso-surface-grid group relative h-full min-h-[13.5rem] overflow-hidden rounded-[1.5rem] p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-coral/25 hover:shadow-editorial active:scale-[0.99]",
      )}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${accent.tint} to-transparent`} />
      <span aria-hidden="true" className={`absolute right-5 top-5 h-2.5 w-2.5 rounded-full ${accent.strip}`} />
      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", accent.chip)}>
            {opp.category}
          </span>
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold", STATUS_STYLES[dl.status])}>
            {dl.label}
          </span>
        </div>
        <h3 className="mt-5 line-clamp-2 font-display text-lg font-semibold leading-tight tracking-tight text-ink group-hover:text-coral">
          {opp.title}
        </h3>
        <p className="mt-2 line-clamp-1 text-sm font-semibold text-muted-foreground">{opp.org}</p>
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-foreground/72">{opp.blurb}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs font-semibold text-muted-foreground">
          <span className="line-clamp-1 min-w-0">{opp.location}</span>
          <span className="inline-flex items-center gap-1 text-coral">
            Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function RefinePanel({
  filters,
  setFilters,
  extra,
  setExtra,
  sort,
  setSort,
  showAdvanced,
  setShowAdvanced,
  facets,
  count,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  extra: ExtraFilterState;
  setExtra: React.Dispatch<React.SetStateAction<ExtraFilterState>>;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean | ((p: boolean) => boolean)) => void;
  facets: Record<string, Record<string, number>>;
  count: number;
}) {
  // One chip per selected value, so each can be removed individually rather
  // than forcing a whole dimension to be cleared at once.
  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  const dropFrom = <T,>(list: T[], v: T) => list.filter((x) => x !== v);

  for (const c of filters.categories)
    activeChips.push({ key: `cat-${c}`, label: c, clear: () => setFilters({ ...filters, categories: dropFrom(filters.categories, c) }) });
  for (const g of filters.grades)
    activeChips.push({ key: `grade-${g}`, label: `Grade ${g}`, clear: () => setFilters({ ...filters, grades: dropFrom(filters.grades, g) }) });
  for (const c of filters.costs)
    activeChips.push({ key: `cost-${c}`, label: c, clear: () => setFilters({ ...filters, costs: dropFrom(filters.costs, c) }) });
  for (const f of filters.formats)
    activeChips.push({ key: `format-${f}`, label: f === "Online" ? "Remote" : f, clear: () => setFilters({ ...filters, formats: dropFrom(filters.formats, f) }) });
  for (const s of extra.states)
    activeChips.push({ key: `state-${s}`, label: s, clear: () => setExtra({ ...extra, states: dropFrom(extra.states, s) }) });
  for (const f of extra.fields)
    activeChips.push({ key: `field-${f}`, label: f, clear: () => setExtra({ ...extra, fields: dropFrom(extra.fields, f) }) });
  for (const s of extra.statuses)
    activeChips.push({ key: `status-${s}`, label: s, clear: () => setExtra({ ...extra, statuses: dropFrom(extra.statuses, s) }) });
  for (const m of extra.deadlineMonths)
    activeChips.push({ key: `month-${m}`, label: MONTH_LABELS[Number(m) - 1] ?? `Month ${m}`, clear: () => setExtra({ ...extra, deadlineMonths: dropFrom(extra.deadlineMonths, m) }) });
  if (extra.freeOnly)
    activeChips.push({ key: "free", label: "Free only", clear: () => setExtra({ ...extra, freeOnly: false }) });

  const clearAll = () => {
    setFilters({ ...filters, categories: [], grades: [], costs: [], formats: [] });
    setExtra(DEFAULT_EXTRA);
  };

  return (
    <div className="hso-glass-panel hso-surface-grid overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-coral">Refine</p>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">Find your fit</h3>
          <p className="mt-2 text-sm text-muted-foreground">{count.toLocaleString()} results currently visible.</p>
        </div>
        <button
          onClick={clearAll}
          className="rounded-full border border-white/65 bg-card/70 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.7)] transition-[transform,border-color,color] hover:-translate-y-0.5 hover:border-coral/30 hover:text-coral active:scale-[0.98]"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 hidden space-y-3 md:block">
        <MultiFilterDropdown
          fullWidth
          label="Category"
          allLabel="All categories"
          counts={facets.categories}
          hideEmpty
          selected={filters.categories}
          onChange={(v) => setFilters({ ...filters, categories: v as FilterState["categories"] })}
          options={CATEGORY_CHIPS.filter((c): c is Category => c !== "All").map((c) => ({ value: c, label: c }))}
        />
        <MultiFilterDropdown
          fullWidth
          label="Grade"
          allLabel="All grades"
          counts={facets.grades}
          hideEmpty
          selected={filters.grades.map(String)}
          onChange={(v) => setFilters({ ...filters, grades: v.map(Number) })}
          options={GRADE_OPTIONS}
        />
        <MultiFilterDropdown
          fullWidth
          label="Cost"
          allLabel="Any cost"
          counts={facets.costs}
          hideEmpty
          selected={filters.costs}
          onChange={(v) => setFilters({ ...filters, costs: v as FilterState["costs"] })}
          options={COST_OPTIONS}
        />
        <MultiFilterDropdown
          fullWidth
          label="Where"
          allLabel="Anywhere"
          counts={facets.formats}
          hideEmpty
          selected={filters.formats}
          onChange={(v) => setFilters({ ...filters, formats: v as FilterState["formats"] })}
          options={FORMAT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
        />
        <FilterDropdown
          fullWidth
          label="Sort"
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>

      <div className="mt-4 hidden border-t border-border/70 pt-4 md:block">
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="mb-4 inline-flex items-center rounded-full border border-white/65 bg-card/70 px-3 py-1.5 text-xs font-bold text-ink shadow-[inset_0_1px_0_hsl(0_0%_100%/0.7)] transition-[transform,border-color] hover:-translate-y-0.5 hover:border-ink/30 active:scale-[0.98]"
        >
          <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-coral" />
          {showAdvanced ? "Hide field filters" : "Show field filters"}
        </button>
        {showAdvanced && <ExtraFilters value={extra} onChange={setExtra} facets={facets} />}
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="mt-5 h-11 w-full rounded-full border-border bg-card text-sm font-bold md:hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4 text-coral" />
            Open filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[2rem]">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-2xl">Refine opportunities</SheetTitle>
          </SheetHeader>
          <div className="mt-5 space-y-3">
            <SheetField label="Category">
              <MultiFilterDropdown fullWidth label="Category" allLabel="All categories" counts={facets.categories} hideEmpty selected={filters.categories} onChange={(v) => setFilters({ ...filters, categories: v as FilterState["categories"] })} options={CATEGORY_CHIPS.filter((c): c is Category => c !== "All").map((c) => ({ value: c, label: c }))} />
            </SheetField>
            <SheetField label="Grade">
              <MultiFilterDropdown fullWidth label="Grade" allLabel="All grades" counts={facets.grades} hideEmpty selected={filters.grades.map(String)} onChange={(v) => setFilters({ ...filters, grades: v.map(Number) })} options={GRADE_OPTIONS} />
            </SheetField>
            <SheetField label="Cost">
              <MultiFilterDropdown fullWidth label="Cost" allLabel="Any cost" counts={facets.costs} hideEmpty selected={filters.costs} onChange={(v) => setFilters({ ...filters, costs: v as FilterState["costs"] })} options={COST_OPTIONS} />
            </SheetField>
            <SheetField label="Where">
              <MultiFilterDropdown fullWidth label="Where" allLabel="Anywhere" counts={facets.formats} hideEmpty selected={filters.formats} onChange={(v) => setFilters({ ...filters, formats: v as FilterState["formats"] })} options={FORMAT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))} />
            </SheetField>
            <div className="border-t border-border pt-5">
              <ExtraFilters value={extra} onChange={setExtra} facets={facets} />
            </div>
          </div>
          <SheetFooter className="mt-6 flex-row gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={clearAll}>
              Reset
            </Button>
            <SheetTrigger asChild>
              <Button className="flex-1 rounded-xl bg-ink text-cream hover:bg-ink/90">Show {count.toLocaleString()}</Button>
            </SheetTrigger>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {activeChips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border/70 pt-4">
          {activeChips.map((c) => (
            <button
              key={c.key}
              onClick={c.clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-coral/25 bg-coral/10 px-3 py-1 text-xs font-bold text-coral hover:bg-coral/15"
            >
              {c.label}
              <span aria-hidden="true">x</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SheetField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function EmptyState({ clear }: { clear: () => void }) {
  return (
    <div className="hso-glass-panel mt-8 rounded-[2rem] border-dashed p-10 text-center">
      <p className="font-display text-2xl font-semibold text-ink">No matches yet.</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Try clearing one or two filters. The catalog is broad, but stacked filters can get too specific.
      </p>
      <Button onClick={clear} className="mt-5 rounded-full bg-ink px-5 text-cream hover:bg-coral">
        Clear filters
      </Button>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="border-y border-border/55 bg-cream/42 backdrop-blur-sm">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">How HSO works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Browse first. Save when it matters.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Links stay visible for everyone. Accounts are only for shelves, folders, and keeping track of programs.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Step icon={<Sparkles className="h-5 w-5" />} title="Choose a lane" body="Pick a category like research, internships, scholarships, or competitions." />
          <Step icon={<FilterIcon className="h-5 w-5" />} title="Narrow the list" body="Filter by grade, cost, format, field, state, and deadline." />
          <Step icon={<ExternalLink className="h-5 w-5" />} title="Check the source" body="Use the official program page for requirements and applications." />
          <Step icon={<BookmarkPlus className="h-5 w-5" />} title="Save later" body="Create folders once signed in so your shortlist does not disappear." />
        </div>
      </div>
    </section>
  );
}

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="hso-elevated-surface rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-coral/15 bg-coral/10 text-coral shadow-[inset_0_1px_0_hsl(0_0%_100%/0.65)]">{icon}</div>
      <p className="mt-4 font-display text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function TrustBand() {
  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="hso-glass-panel grid gap-8 rounded-[2rem] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">Source policy</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Official links, clear deadlines, no hidden browsing.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              HSO points students to universities, nonprofits, companies, competitions, museums, and scholarship providers. Details can change, so every card keeps the source close.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            <Badge icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Official links" />
            <Badge icon={<Calendar className="h-3.5 w-3.5" />} label="Deadline labels" />
            <Badge icon={<GraduationCap className="h-3.5 w-3.5" />} label="Student-focused" />
            <Badge icon={<Globe className="h-3.5 w-3.5" />} label="U.S.-focused" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/65 bg-cream/66 px-3 py-1.5 text-xs font-bold text-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)]">
      <span className="text-coral">{icon}</span>
      {label}
    </span>
  );
}

function PopularSearches() {
  return (
    <section className="border-t border-border/55 bg-cream/30">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">Popular searches</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Students also look for
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Jump straight into the most-searched lanes — every category is filtered, deadline-tracked, and links straight to the official program.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_SLUGS.map((s) => (
            <Link
              key={s}
              to={`/categories/${s}`}
              className="hso-elevated-surface group flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
            >
              <span className="font-display text-lg font-semibold text-ink group-hover:text-coral">
                {CATEGORY_META[s].h1}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {CATEGORY_META[s].intro}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Index;
