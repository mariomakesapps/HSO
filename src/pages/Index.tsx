import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Calendar, GraduationCap, Globe, Filter as FilterIcon, BookmarkPlus, ExternalLink, SlidersHorizontal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { allOpportunities as opportunities } from "@/data/opportunities";
import type { Category } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterState } from "@/components/Filters";
import { ExtraFilters, DEFAULT_EXTRA, ExtraFilterState } from "@/components/ExtraFilters";
import { SortBar, SortKey } from "@/components/SortBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
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

  return (
    <div className="relative min-h-screen bg-background">
      <div className="hso-bg-blobs" aria-hidden="true">
        <span className="b1" /><span className="b2" /><span className="b3" /><span className="b4" />
      </div>
      <div className="relative z-10">
      <SiteHeader />

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-10 text-center sm:px-6 sm:pb-14 sm:pt-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
            Find opportunities that match your <span className="text-coral">spark.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Explore curated internships, research programs, scholarships, competitions, summer programs, volunteer work, and fellowships for high school students.
          </p>

          {!authLoading && !isAuthed && (
            <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-soft sm:flex-row sm:px-5">
              <p className="flex items-start gap-2.5 text-sm text-foreground sm:items-center">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral sm:mt-0">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="font-semibold text-ink">Create a free account</span>
                  <span className="text-muted-foreground"> to unlock links, save favorites, and build collections.</span>
                </span>
              </p>
              <Link to="/auth" className="w-full shrink-0 rounded-lg bg-ink px-4 py-2 text-center text-sm font-semibold text-cream hover:bg-coral sm:w-auto">
                Sign up free
              </Link>
            </div>
          )}

          {/* Search */}
          <form className="mx-auto mt-8 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Search programs, fields, organizations…"
                className="h-14 rounded-2xl border-border bg-card pl-12 pr-32 text-base shadow-soft focus-visible:ring-coral"
              />
              <a href="#results" className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral sm:block">
                Search
              </a>
            </div>
          </form>

          {/* Category chips */}
          <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
            {CATEGORY_CHIPS.map((c) => {
              const active = filters.category === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilters({ ...filters, category: c })}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
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

          <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> 300+ curated opportunities, growing weekly.
          </p>
        </div>
      </section>

      {/* Strips */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12">
        <Strip title="Closing soon" items={deadlineSoon} />
        <div className="mt-10">
          <Strip title="Recently added" items={recentlyAdded} />
        </div>
      </section>

      {/* Results */}
      <section id="results" className="scroll-mt-20">
        {/* Compact sticky filter bar (no duplicate search) */}
        <div className="sticky top-[57px] z-20 border-y border-border/70 bg-background/85 backdrop-blur-md md:top-[65px]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
            <p className="hidden text-sm font-medium text-foreground sm:block">
              <span className="text-ink">{filtered.length.toLocaleString()}</span>{" "}
              <span className="text-muted-foreground">opportunities</span>
            </p>

            {/* Category chips — scrollable */}
            <div className="-mx-1 flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto px-1 scrollbar-none">
              {CATEGORY_CHIPS.map((c) => {
                const active = filters.category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilters({ ...filters, category: c })}
                    className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-border bg-card/80 text-foreground hover:border-ink/40"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced((v) => !v)}
              className="hidden h-9 shrink-0 rounded-lg md:inline-flex"
            >
              <FilterIcon className="mr-1.5 h-4 w-4" />
              Filters
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 shrink-0 rounded-lg md:hidden">
                  <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                  <SheetHeader className="text-left">
                    <SheetTitle className="font-display text-2xl">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-5 space-y-5">
                    <SheetSelect label="Grade" value={String(filters.grade)} options={[["All","All grades"],["9","9th"],["10","10th"],["11","11th"],["12","12th"]]} onChange={(v) => setFilters({ ...filters, grade: v === "All" ? "All" : Number(v) })} />
                    <SheetSelect label="Cost" value={filters.cost} options={[["All","All"],["Free","Free"],["Paid","Paid"],["Stipend","Stipend / Paid"]]} onChange={(v) => setFilters({ ...filters, cost: v as FilterState["cost"] })} />
                    <SheetSelect label="Format" value={filters.format} options={[["All","All"],["In-person","In-person"],["Online","Online"],["Hybrid","Hybrid"]]} onChange={(v) => setFilters({ ...filters, format: v as FilterState["format"] })} />
                    <div className="border-t border-border pt-5">
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Advanced</p>
                      <ExtraFilters value={extra} onChange={setExtra} />
                    </div>
                  </div>
                  <SheetFooter className="mt-6 flex-row gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => { setFilters({ ...filters, grade: "All", cost: "All", format: "All" }); setExtra(DEFAULT_EXTRA); }}
                    >
                      Reset
                    </Button>
                    <SheetTrigger asChild>
                      <Button className="flex-1 rounded-xl bg-ink text-cream hover:bg-ink/90">Show {filtered.length.toLocaleString()} results</Button>
                    </SheetTrigger>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
          </div>
          {showAdvanced && (
            <div className="hidden border-t border-border/60 bg-background/70 md:block">
              <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                <ExtraFilters value={extra} onChange={setExtra} />
              </div>
            </div>
          )}
        </div>

        {/* Results body */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">All opportunities</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {filtered.length.toLocaleString()} matches
              </h2>
            </div>
          </div>

          <div className="mb-6">
            <SortBar value={sort} onChange={setSort} count={filtered.length} />
          </div>

          {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-display text-xl">Nothing matches yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try widening your filters or clearing the search.</p>
          </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
      <span className="text-coral">{icon}</span>{label}
    </span>
  );
}

function Strip({ title, items }: { title: string; items: typeof opportunities }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-end justify-between">
        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h3>
        <Link to="#results" className="text-sm font-medium text-muted-foreground hover:text-coral">See all →</Link>
      </div>
      <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {items.map((o) => {
          const dl = getDeadlineStatus(o.deadline);
          return (
            <Link key={o.id} to={`/opportunities/${o.id}`} className="group flex w-[260px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-4 transition-all hover:border-ink/30 hover:shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{o.category}</span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLES[dl.status]}`}>
                  {dl.status === "closing-soon" ? "Soon" : dl.status === "open" ? "Open" : dl.status === "rolling" ? "Rolling" : "Closed"}
                </span>
              </div>
              <p className="mt-3 font-display text-lg font-semibold leading-tight text-ink group-hover:text-coral">{o.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{o.org}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Index;