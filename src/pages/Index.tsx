import { useEffect, useMemo, useState } from "react";
import { Sparkles, Search, Filter as FilterIcon, BookmarkPlus, ExternalLink, ShieldCheck, Globe, GraduationCap, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { allOpportunities as opportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Filters, FilterState } from "@/components/Filters";
import { ExtraFilters, DEFAULT_EXTRA, ExtraFilterState } from "@/components/ExtraFilters";
import { SortBar, SortKey } from "@/components/SortBar";
import { Button } from "@/components/ui/button";
import { IntroSplash } from "@/components/IntroSplash";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { applyFilters, applySort } from "@/lib/filterSort";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { useSEO } from "@/lib/seo";

const Index = () => {
  useSEO({
    title: "HSO — High School Opportunity Finder",
    description: "Browse 300+ curated internships, research, scholarships, summer programs, competitions and fellowships for high schoolers — growing weekly.",
  });

  const [filters, setFilters] = useState<FilterState>({ query: "", category: "All", grade: "All", cost: "All", format: "All" });
  const [extra, setExtra] = useState<ExtraFilterState>(DEFAULT_EXTRA);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [visible, setVisible] = useState(48);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const indexMap = useMemo(() => new Map(opportunities.map((o, i) => [o.id, i])), []);
  const filtered = useMemo(() => applySort(applyFilters(opportunities, filters, extra), sort, indexMap), [filters, extra, sort, indexMap]);
  const featured = filtered.find((o) => o.prestige === 3) ?? filtered[0];
  const rest = filtered.filter((o) => o.id !== featured?.id);
  const shown = rest.slice(0, visible);
  useEffect(() => { setVisible(48); }, [filters, extra, sort]);

  // Deadline soon & recently added strips (computed from full set)
  const deadlineSoon = useMemo(
    () => opportunities
      .filter((o) => { const s = getDeadlineStatus(o.deadline).status; return s === "closing-soon" || s === "open"; })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 6),
    []
  );
  const recentlyAdded = useMemo(() => opportunities.slice(-6).reverse(), []);

  return (
    <div className={`min-h-screen bg-background bg-grain transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <IntroSplash />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[280px] w-[280px] rounded-full bg-gradient-coral opacity-30 blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[220px] w-[220px] rounded-full bg-sage/40 blur-3xl sm:h-[320px] sm:w-[320px]" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 md:py-16 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <div className="min-w-0 lg:col-span-7 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-coral" /> Curated · Updated weekly
            </span>
            <h1 className="mt-4 font-display font-semibold leading-[1.05] tracking-tight text-foreground text-balance break-words [hyphens:auto]" style={{ fontSize: "clamp(1.875rem, 6.2vw + 0.5rem, 4.75rem)" }}>
              The <em className="text-coral not-italic">High School Opportunity Finder</em>
              <span className="block sm:inline"> — </span>
              <span className="italic text-sage">300+ curated opportunities, growing weekly.</span>
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground sm:mt-6" style={{ fontSize: "clamp(0.95rem, 0.4vw + 0.85rem, 1.125rem)" }}>
              HSO indexes internships, research, scholarships, summer programs, competitions and fellowships from every continent — built for high schoolers preparing for college.
            </p>

            {featured && (
              <a href="#results" className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-editorial lg:hidden">
                <span className="mt-0.5 shrink-0 rounded-full bg-coral px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-coral-foreground">Spotlight</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">{featured.org}</p>
                  <p className="truncate font-display text-base text-foreground sm:text-lg">{featured.title}</p>
                </div>
              </a>
            )}

            <div className="mt-6 sm:mt-10">
              <Filters value={filters} onChange={setFilters} />
            </div>
          </div>

          <div className="relative hidden min-w-0 lg:col-span-5 lg:block animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="relative ml-auto max-w-md rotate-1 rounded-3xl border border-border bg-card p-6 shadow-editorial transition-transform duration-500 hover:rotate-0 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Spotlight · This month</p>
              {featured && (
                <>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-balance xl:text-3xl">{featured.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{featured.org} · {featured.location}</p>
                  <p className="mt-4 text-sm leading-relaxed">{featured.blurb}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featured.fields.map((f) => <span key={f} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{f}</span>)}
                  </div>
                </>
              )}
            </div>
            <div className="absolute -bottom-6 -left-2 -rotate-3 rounded-2xl bg-ink px-5 py-4 text-cream shadow-editorial">
              <p className="font-display text-2xl">300+</p>
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">curated opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* How HSO works */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">How HSO works</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Find the right opportunity in four steps.</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Step icon={<Search className="h-5 w-5 text-coral" />} title="Search" body="By interest, program, organization, or location." />
            <Step icon={<FilterIcon className="h-5 w-5 text-coral" />} title="Filter" body="By grade, cost, format, and category." />
            <Step icon={<BookmarkPlus className="h-5 w-5 text-coral" />} title="Save" body="Group favorites into collections to share with friends." />
            <Step icon={<ExternalLink className="h-5 w-5 text-coral" />} title="Apply" body="Through the official program page — always." />
          </div>
        </div>
      </section>

      {/* Compact strips */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <Strip title="Deadline soon" items={deadlineSoon} />
          <div className="mt-12">
            <Strip title="Recently added" items={recentlyAdded} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between md:mb-8">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Discover</p>
            <h2 className="font-display tracking-tight" style={{ fontSize: "clamp(1.5rem, 2.5vw + 0.8rem, 2.5rem)" }}>
              {filtered.length.toLocaleString()} opportunit{filtered.length === 1 ? "y" : "ies"} for you
            </h2>
          </div>
        </div>

        <div className="mb-5">
          <ExtraFilters value={extra} onChange={setExtra} />
        </div>
        <div className="mb-6">
          <SortBar value={sort} onChange={setSort} count={filtered.length} />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center sm:p-12 md:p-16">
            <p className="font-display text-xl sm:text-2xl">Nothing matches yet.</p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Try widening your filters or clearing the search.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {shown.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
            </div>
            {visible < rest.length && (
              <div className="mt-10 flex justify-center sm:mt-12">
                <Button onClick={() => setVisible((v) => v + 48)} className="rounded-full bg-ink px-6 py-5 text-cream hover:bg-coral hover:text-coral-foreground sm:px-8 sm:py-6">
                  Load more · {(rest.length - visible).toLocaleString()} remaining
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Trust */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Where opportunities come from</p>
          <h2 className="mt-2 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            HSO links students to <em className="text-coral not-italic">official program pages.</em>
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
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
  );
};

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-editorial">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/10">{icon}</div>
      <p className="mt-4 font-display text-xl">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold">
      {icon}{label}
    </span>
  );
}

function Strip({ title, items }: { title: string; items: typeof opportunities }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-end justify-between">
        <h3 className="font-display text-2xl tracking-tight">{title}</h3>
        <Link to="#results" className="text-sm text-muted-foreground hover:text-coral">See all →</Link>
      </div>
      <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {items.map((o) => {
          const dl = getDeadlineStatus(o.deadline);
          return (
            <Link key={o.id} to={`/opportunities/${o.id}`} className="group flex w-[260px] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-editorial">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{o.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[dl.status]}`}>{dl.status === "closing-soon" ? "Soon" : dl.status === "open" ? "Open" : dl.status === "rolling" ? "Rolling" : "Closed"}</span>
              </div>
              <p className="mt-3 font-display text-lg leading-tight group-hover:text-coral">{o.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{o.org}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Index;