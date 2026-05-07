import { useEffect, useMemo, useState } from "react";
import { Bookmark, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import hsoLogo from "@/assets/hso-logo.png";
import { allOpportunities as opportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Filters, FilterState } from "@/components/Filters";
import { CollectionsPanel } from "@/components/CollectionsPanel";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/collections";
import { IntroSplash, clearIntroSeen } from "@/components/IntroSplash";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    query: "", category: "All", grade: "All", cost: "All", format: "All",
  });
  const [showShelf, setShowShelf] = useState(false);
  const [visible, setVisible] = useState(48);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);
  const onSignOut = async () => {
    await supabase.auth.signOut();
    clearIntroSeen();
    navigate("/auth");
  };
  const s = useStore();

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = opportunities.filter((o) => {
      if (filters.category !== "All" && o.category !== filters.category) return false;
      if (filters.grade !== "All" && !o.grades.includes(filters.grade as number)) return false;
      if (filters.cost !== "All" && o.cost !== filters.cost) return false;
      if (filters.format !== "All" && o.format !== filters.format) return false;
      if (q) {
        const hay = [o.title, o.org, o.location, o.blurb, ...o.fields, o.category].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const now = Date.now();
    return list.slice().sort((a, b) => {
      const aClosed = new Date(a.deadline).getTime() < now ? 1 : 0;
      const bClosed = new Date(b.deadline).getTime() < now ? 1 : 0;
      return aClosed - bClosed;
    });
  }, [filters]);

  const featured = filtered.find((o) => o.prestige === 3) ?? filtered[0];
  const rest = filtered.filter((o) => o.id !== featured?.id);
  const shown = rest.slice(0, visible);
  useEffect(() => { setVisible(48); }, [filters]);
  const totalSaved = s.favorites.length + s.collections.reduce((n, c) => n + c.opportunityIds.length, 0);

  return (
    <div className={`min-h-screen bg-background bg-grain transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <IntroSplash />
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-coral/30 bg-gradient-to-r from-coral/15 via-cream/80 to-sage/20 backdrop-blur-md shadow-soft animate-fade-up">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <a href="#" className="flex items-center gap-2">
            <span className="relative inline-block h-10 w-10 overflow-hidden rounded-xl ring-1 ring-foreground/10 shadow-soft">
              <img
                src={hsoLogo}
                alt="HSO logo"
                className="absolute inset-0 h-full w-full scale-[1.35] object-cover transition-transform duration-700 hover:rotate-6 hover:scale-[1.45]"
              />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              <span className="text-ink">H</span><span className="text-coral">S</span><span className="text-sage">O</span>
            </span>
            <span className="ml-1 hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">High School Opportunity Finder</span>
          </a>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowShelf(true)}
              variant="outline"
              size="icon"
              aria-label="My Shelf"
              className="relative rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream sm:hidden"
            >
              <Bookmark className="h-4 w-4" />
              {totalSaved > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-semibold text-coral-foreground">{totalSaved}</span>
              )}
            </Button>
            <Button onClick={() => setShowShelf(true)} variant="outline" className="hidden rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream sm:inline-flex">
              <Bookmark className="mr-2 h-4 w-4" />
              My Shelf
              {totalSaved > 0 && (
                <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-coral-foreground">{totalSaved}</span>
              )}
            </Button>
            {session ? (
              <>
                <Button onClick={onSignOut} variant="outline" size="icon" aria-label="Sign out" className="rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream sm:hidden">
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button onClick={onSignOut} variant="outline" className="hidden rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream sm:inline-flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[280px] w-[280px] rounded-full bg-gradient-coral opacity-30 blur-3xl sm:h-[420px] sm:w-[420px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[220px] w-[220px] rounded-full bg-sage/40 blur-3xl sm:h-[320px] sm:w-[320px]" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 md:py-16 lg:grid-cols-12 lg:gap-12 lg:py-28">
          <div className="min-w-0 lg:col-span-7 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-coral" /> Curated · Updated weekly
            </span>
            <h1
              className="mt-4 font-display font-semibold leading-[1.05] tracking-tight text-foreground text-balance break-words [hyphens:auto]"
              style={{ fontSize: "clamp(1.875rem, 6.2vw + 0.5rem, 4.75rem)" }}
            >
              The <em className="text-coral not-italic">High School Opportunity Finder</em>
              <span className="block sm:inline"> — </span>
              <span className="italic text-sage">300+ curated opportunities, growing weekly.</span>
            </h1>
            <p
              className="mt-4 max-w-xl leading-relaxed text-muted-foreground sm:mt-6"
              style={{ fontSize: "clamp(0.95rem, 0.4vw + 0.85rem, 1.125rem)" }}
            >
              HSO indexes internships, research, scholarships, summer programs, competitions and fellowships from every continent — built for high schoolers preparing for college.
            </p>

            {/* Mobile + tablet spotlight strip */}
            {featured && (
              <a
                href="#results"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-editorial lg:hidden"
              >
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
                    {featured.fields.map((f) => (
                      <span key={f} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{f}</span>
                    ))}
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

      {/* Results */}
      <section id="results" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between md:mb-8">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Discover</p>
            <h2
              className="font-display tracking-tight"
              style={{ fontSize: "clamp(1.5rem, 2.5vw + 0.8rem, 2.5rem)" }}
            >
              {filtered.length.toLocaleString()} opportunit{filtered.length === 1 ? "y" : "ies"} for you
            </h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center sm:p-12 md:p-16">
            <p className="font-display text-xl sm:text-2xl">Nothing matches yet.</p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Try widening your filters or clearing the search.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {shown.map((o, i) => (
                <OpportunityCard key={o.id} opp={o} index={i} />
              ))}
            </div>
            {visible < rest.length && (
              <div className="mt-10 flex justify-center sm:mt-12">
                <Button
                  onClick={() => setVisible((v) => v + 48)}
                  className="rounded-full bg-ink px-6 py-5 text-cream hover:bg-coral hover:text-coral-foreground sm:px-8 sm:py-6"
                >
                  Load more · {(rest.length - visible).toLocaleString()} remaining
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-8 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-10">
          <p className="font-display text-xl">HSO — for the curious.</p>
          <p className="text-sm text-muted-foreground">Save, organize, and share opportunities with friends.</p>
        </div>
      </footer>

      {showShelf && <CollectionsPanel onClose={() => setShowShelf(false)} />}
    </div>
  );
};

export default Index;
