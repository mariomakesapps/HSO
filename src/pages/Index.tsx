import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Calendar, GraduationCap, Globe, Filter as FilterIcon, BookmarkPlus, ExternalLink, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { allOpportunities as opportunities } from "@/data/opportunities";
import type { Category } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterState } from "@/components/Filters";
import { ExtraFilters, DEFAULT_EXTRA, ExtraFilterState } from "@/components/ExtraFilters";
import { SortBar, SortKey, SORT_OPTIONS } from "@/components/SortBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterDropdown } from "@/components/FilterDropdown";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { applyFilters, applySort } from "@/lib/filterSort";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { useSEO } from "@/lib/seo";

const CATEGORY_CHIPS: (Category | "All")[] = ["All", "Summer Program", "Internship", "Research", "Scholarship", "Competition", "Volunteer", "Fellowship"];

const Index = () => {
  const { isAuthed, loading: authLoading } = useAuthSession();
  useSEO({
    title: "HSO — Find opportunities that match your spark",
    description: "Browse 300+ curated internships, research, scholarships, summer programs, competitions and fellowships for high schoolers — growing weekly.",
  });

  const [filters, setFilters] = useState<FilterState>({ query: "", category: "All", grade: "All", cost: "All", format: "All" });
  const [extra, setExtra] = useState<ExtraFilterState>(DEFAULT_EXTRA);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [visible, setVisible] = useState(48);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const indexMap = useMemo(() => new Map(opportunities.map((o, i) => [o.id, i])), []);
  const filtered = useMemo(() => applySort(applyFilters(opportunities, filters, extra), sort, indexMap), [filters, extra, sort, indexMap]);
  const shown = filtered.slice(0, visible);
  useEffect(() => { setVisible(48); }, [filters, extra, sort]);

  const deadlineSoon = useMemo(
    () => opportunities
      .filter((o) => { const s = getDeadlineStatus(o.deadline).status; return s === "closing-soon" || s === "open"; })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 6),
    []
  );
  const recentlyAdded = useMemo(() => opportunities.slice(-6).reverse(), []);
  const standouts = useMemo(
    () => opportunities.filter((o) => o.prestige === 3).slice(0, 6),
    []
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="hso-bg-blobs" aria-hidden="true">
        <span className="b1" /><span className="b2" /><span className="b3" /><span className="b4" />
      </div>
      <div className="relative z-10">
      <SiteHeader />

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-8 text-center sm:px-6 sm:pb-14 sm:pt-16">
          <h1 className="font-display text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl">
            Find opportunities that match your <span className="text-coral">spark.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-lg">
            <span className="sm:hidden">Browse curated internships, research, scholarships, competitions, and summer programs for U.S. high schoolers.</span>
            <span className="hidden sm:inline">Explore curated internships, research programs, scholarships, competitions, summer programs, volunteer work, and fellowships for high school students in the U.S.</span>
          </p>

          {!authLoading && !isAuthed && (
            <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-stretch gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="flex items-start gap-2.5 text-sm text-foreground sm:items-center">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral sm:mt-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="font-semibold text-ink">Create a free account</span>
                  <span className="text-muted-foreground"> to unlock links and save favorites.</span>
                </span>
              </p>
              <Link to="/auth" className="w-full shrink-0 rounded-lg bg-ink px-4 py-2.5 text-center text-sm font-semibold text-cream hover:bg-coral sm:w-auto">
                Sign up free
              </Link>
            </div>
          )}

          {/* Search */}
          <form className="mx-auto mt-7 w-full max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Search opportunities…"
                className="h-13 w-full rounded-2xl border-border bg-card pl-11 pr-4 text-base shadow-soft focus-visible:ring-coral sm:h-14 sm:pl-12 sm:pr-32"
              />
              <a href="#results" className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral sm:block">
                Search
              </a>
            </div>
          </form>

          {/* Category chips */}
          <div className="-mx-4 mt-5 sm:mx-auto sm:max-w-2xl">
            <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
              {CATEGORY_CHIPS.map((c) => {
                const active = filters.category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, category: c })}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-border bg-card text-foreground hover:border-ink/40"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Curated opportunities for high school students in the U.S.
          </p>
        </div>
      </section>

      {/* Featured opportunities */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-14">
        <FeaturedShelf closingSoon={deadlineSoon} newlyAdded={recentlyAdded} standouts={standouts} />
      </section>

      {/* Results */}
      <section id="results" className="scroll-mt-20">
        {/* Results body */}
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">Explore Opportunities</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Explore {filtered.length.toLocaleString()} opportunities
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Use filters to narrow your search.</p>
            </div>
          </div>

          {/* Refine your search panel */}
          <RefinePanel
            filters={filters}
            setFilters={setFilters}
            extra={extra}
            setExtra={setExtra}
            sort={sort}
            setSort={setSort}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            count={filtered.length}
          />

          {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-display text-xl">Nothing matches yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try widening your filters or clearing the search.</p>
          </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
              </div>
              {visible < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <Button onClick={() => setVisible((v) => v + 48)} className="rounded-lg bg-ink px-6 py-5 text-cream hover:bg-coral">
                    Load more · {(filtered.length - visible).toLocaleString()} remaining
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How HSO works */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">How HSO works</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Find the right opportunity in four steps.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Step icon={<Search className="h-5 w-5" />} title="Search" body="By interest, program, organization, or location." />
            <Step icon={<FilterIcon className="h-5 w-5" />} title="Filter" body="By grade, cost, format, and category." />
            <Step icon={<BookmarkPlus className="h-5 w-5" />} title="Save" body="Group favorites into collections you can share." />
            <Step icon={<ExternalLink className="h-5 w-5" />} title="Apply" body="Through the official program page — always." />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Where opportunities come from</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            HSO links students to <span className="text-coral">official program pages.</span>
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            Opportunities are curated from universities, nonprofits, companies, competitions, and scholarship providers. Deadlines and details can change, so always confirm on the official site before applying.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Official links" />
            <Badge icon={<Calendar className="h-3.5 w-3.5" />} label="Updated weekly" />
            <Badge icon={<GraduationCap className="h-3.5 w-3.5" />} label="Student-focused" />
            <Badge icon={<Globe className="h-3.5 w-3.5" />} label="Global opportunities" />
          </div>
        </div>
      </section>

      <SiteFooter />
      </div>
    </div>
  );
};

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral/10 text-coral">{icon}</div>
      <p className="mt-4 font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function SheetSelect({ label, value, options, onChange }: { label: string; value: string; options: [string,string][]; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-border bg-card px-4 text-base font-semibold text-foreground outline-none focus:border-foreground"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}

function SheetField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
      <span className="text-coral">{icon}</span>{label}
    </span>
  );
}

const CATEGORY_ACCENT: Record<string, { strip: string; tint: string; chip: string }> = {
  Research:         { strip: "bg-sage",   tint: "from-sage/8",   chip: "bg-sage/10 text-sage border-sage/20" },
  Internship:       { strip: "bg-sky",    tint: "from-sky/15",   chip: "bg-sky/15 text-ink border-sky/30" },
  Competition:      { strip: "bg-coral",  tint: "from-coral/8",  chip: "bg-coral/10 text-coral border-coral/20" },
  "Summer Program": { strip: "bg-ochre",  tint: "from-ochre/15", chip: "bg-ochre/15 text-ink border-ochre/30" },
  Scholarship:      { strip: "bg-sunny",  tint: "from-sunny/20", chip: "bg-sunny/25 text-ink border-sunny/40" },
  Volunteer:        { strip: "bg-sage",   tint: "from-sage/8",   chip: "bg-sage/10 text-sage border-sage/20" },
  Fellowship:       { strip: "bg-coral",  tint: "from-coral/8",  chip: "bg-coral/10 text-coral border-coral/20" },
};

function FeaturedShelf({ closingSoon, newlyAdded, standouts }: { closingSoon: typeof opportunities; newlyAdded: typeof opportunities; standouts: typeof opportunities }) {
  const renderShelf = (items: typeof opportunities) => (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {items.map((o) => {
        const dl = getDeadlineStatus(o.deadline);
        const accent = CATEGORY_ACCENT[o.category] ?? CATEGORY_ACCENT.Research;
        return (
          <Link
            key={o.id}
            to={`/opportunities/${o.id}`}
            className="group relative flex w-[85vw] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-editorial sm:w-auto sm:max-w-none"
          >
            <span aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent.tint} to-transparent`} />
            <span aria-hidden="true" className={`absolute right-5 top-5 h-2 w-2 rounded-full ${accent.strip}`} />
            <div className="relative flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accent.chip}`}>{o.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[dl.status]}`}>
                  {dl.label}
                </span>
              </div>
              <h4 className="mt-4 font-display text-lg font-medium leading-snug tracking-tight text-ink group-hover:text-coral">{o.title}</h4>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{o.org}</p>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/70">{o.blurb}</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{o.location}</span>
                <span aria-hidden="true">·</span>
                <span>{o.cost}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  const tabBase = "relative rounded-none border-0 bg-transparent px-1 pb-2 pt-1 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-ink";

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-coral">Featured opportunities</p>
          <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            Programs worth a closer look.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">A rotating mix of deadlines, new finds, and standout opportunities.</p>
        </div>
      </div>

      <Tabs defaultValue="closing" className="mt-6">
        <TabsList className="h-auto justify-start gap-6 rounded-none border-b border-border/60 bg-transparent p-0">
          <TabsTrigger value="closing" className={`${tabBase} data-[state=active]:after:bg-coral after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:rounded-full after:bg-transparent after:transition-colors`}>
            Closing Soon
          </TabsTrigger>
          <TabsTrigger value="new" className={`${tabBase} data-[state=active]:after:bg-sage after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:rounded-full after:bg-transparent after:transition-colors`}>
            New Finds
          </TabsTrigger>
          <TabsTrigger value="standouts" className={`${tabBase} data-[state=active]:after:bg-ochre after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:rounded-full after:bg-transparent after:transition-colors`}>
            Standouts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="closing" className="mt-6 animate-in fade-in-50 duration-300">
          <p className="mb-4 text-sm text-muted-foreground">A few deadlines worth catching this week.</p>
          {renderShelf(closingSoon)}
        </TabsContent>
        <TabsContent value="new" className="mt-6 animate-in fade-in-50 duration-300">
          <p className="mb-4 text-sm text-muted-foreground">Freshly added programs to explore.</p>
          {renderShelf(newlyAdded)}
        </TabsContent>
        <TabsContent value="standouts" className="mt-6 animate-in fade-in-50 duration-300">
          <p className="mb-4 text-sm text-muted-foreground">The most prestigious picks from our catalog.</p>
          {renderShelf(standouts)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RefinePanel({
  filters, setFilters, extra, setExtra, sort, setSort, showAdvanced, setShowAdvanced, count,
}: {
  filters: FilterState;
  setFilters: (v: FilterState) => void;
  extra: ExtraFilterState;
  setExtra: (v: ExtraFilterState) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean | ((p: boolean) => boolean)) => void;
  count: number;
}) {
  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (filters.category !== "All") activeChips.push({ key: "cat", label: filters.category, clear: () => setFilters({ ...filters, category: "All" }) });
  if (filters.grade !== "All") activeChips.push({ key: "grade", label: `Grade ${filters.grade}`, clear: () => setFilters({ ...filters, grade: "All" }) });
  if (filters.cost !== "All") activeChips.push({ key: "cost", label: filters.cost, clear: () => setFilters({ ...filters, cost: "All" }) });
  if (filters.format !== "All") activeChips.push({ key: "format", label: filters.format, clear: () => setFilters({ ...filters, format: "All" }) });
  if (extra.country !== "All") activeChips.push({ key: "country", label: extra.country, clear: () => setExtra({ ...extra, country: "All" }) });
  if (extra.field !== "All") activeChips.push({ key: "field", label: extra.field, clear: () => setExtra({ ...extra, field: "All" }) });
  if (extra.deadlineMonth !== "All") activeChips.push({ key: "month", label: `Deadline: month ${extra.deadlineMonth}`, clear: () => setExtra({ ...extra, deadlineMonth: "All" }) });
  if (extra.freeOnly) activeChips.push({ key: "free", label: "Free only", clear: () => setExtra({ ...extra, freeOnly: false }) });

  const clearAll = () => {
    setFilters({ ...filters, category: "All", grade: "All", cost: "All", format: "All" });
    setExtra(DEFAULT_EXTRA);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-cream/80 p-5 shadow-soft backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-display text-lg font-medium text-ink">Refine your search</p>
          <p className="text-xs text-muted-foreground">Interest · Grade · Cost · Format · Location · Deadline</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced((v) => !v)}
          className="hidden h-9 rounded-full border-border/80 bg-background px-4 text-sm font-semibold text-ink hover:border-ink/40 md:inline-flex"
        >
          <SlidersHorizontal className="mr-1.5 h-4 w-4 text-coral" />
          Refine results
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 rounded-full border-border/80 bg-background px-4 text-sm font-semibold md:hidden">
              <SlidersHorizontal className="mr-1.5 h-4 w-4 text-coral" /> Refine
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-2xl">Refine your search</SheetTitle>
            </SheetHeader>
            <div className="mt-5 space-y-5">
              <SheetSelect label="Grade" value={String(filters.grade)} options={[["All","All grades"],["9","9th"],["10","10th"],["11","11th"],["12","12th"]]} onChange={(v) => setFilters({ ...filters, grade: v === "All" ? "All" : Number(v) })} />
              <SheetSelect label="Cost" value={filters.cost} options={[["All","All"],["Free","Free"],["Paid","Paid"],["Stipend","Stipend / Paid"]]} onChange={(v) => setFilters({ ...filters, cost: v as FilterState["cost"] })} />
              <SheetSelect label="Format" value={filters.format} options={[["All","All"],["In-person","In-person"],["Online","Online"],["Hybrid","Hybrid"]]} onChange={(v) => setFilters({ ...filters, format: v as FilterState["format"] })} />
              <div className="border-t border-border pt-5">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">More</p>
                <ExtraFilters value={extra} onChange={setExtra} />
              </div>
            </div>
            <SheetFooter className="mt-6 flex-row gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={clearAll}>Reset</Button>
              <SheetTrigger asChild>
                <Button className="flex-1 rounded-xl bg-ink text-cream hover:bg-ink/90">Show {count.toLocaleString()} results</Button>
              </SheetTrigger>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="ml-auto">
          <FilterDropdown
            label="Sort by"
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            align="end"
          />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Active:</span>
          {activeChips.map((c) => (
            <button
              key={c.key}
              onClick={c.clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-xs font-semibold text-coral transition-colors hover:bg-coral/15"
            >
              {c.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button onClick={clearAll} className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-ink hover:underline">
            Clear all
          </button>
        </div>
      )}

      {showAdvanced && (
        <div className="mt-4 hidden border-t border-border/60 pt-4 md:block">
          <ExtraFilters value={extra} onChange={setExtra} />
        </div>
      )}
    </div>
  );
}

export default Index;