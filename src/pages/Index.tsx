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
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur animate-fade-up">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2">
            <img src={hsoLogo} alt="HSO HSO logo" className="h-9 w-9 rounded-xl object-cover transition-transform duration-700 hover:rotate-12" />
            <span className="font-display text-2xl font-semibold tracking-tight">HSO</span>
            <span className="ml-1 hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">High School Opportunity Finder</span>
          </a>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowShelf(true)} variant="outline" className="rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream">
              <Bookmark className="mr-2 h-4 w-4" />
              My Shelf
              {totalSaved > 0 && (
                <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-coral-foreground">{totalSaved}</span>
              )}
            </Button>
            {session ? (
              <Button onClick={onSignOut} variant="outline" className="rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
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
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-gradient-coral opacity-30 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[320px] w-[320px] rounded-full bg-sage/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-coral" /> Curated · Updated weekly
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              The <em className="text-coral not-italic">High School Opportunity Finder</em> — <span className="italic text-sage">10,000+ programs, worldwide.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              HSO indexes internships, research, scholarships, summer programs, competitions and fellowships from every continent — built for high schoolers preparing for college.
            </p>
            <div className="mt-10">
              <Filters value={filters} onChange={setFilters} />
            </div>
          </div>

          <div className="relative lg:col-span-5 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="relative ml-auto max-w-md rotate-1 rounded-3xl border border-border bg-card p-6 shadow-editorial transition-transform duration-500 hover:rotate-0 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Spotlight · This month</p>
              {featured && (
                <>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-balance">{featured.title}</h3>
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
            <div className="absolute -bottom-6 -left-2 hidden -rotate-3 rounded-2xl bg-ink px-5 py-4 text-cream shadow-editorial sm:block">
              <p className="font-display text-2xl">10,000+</p>
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">live opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Discover</p>
            <h2 className="font-display text-4xl tracking-tight">
              {filtered.length.toLocaleString()} opportunit{filtered.length === 1 ? "y" : "ies"} for you
            </h2>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
            <p className="font-display text-2xl">Nothing matches yet.</p>
            <p className="mt-2 text-muted-foreground">Try widening your filters or clearing the search.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((o, i) => (
                <OpportunityCard key={o.id} opp={o} index={i} />
              ))}
            </div>
            {visible < rest.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={() => setVisible((v) => v + 48)}
                  className="rounded-full bg-ink px-8 py-6 text-cream hover:bg-coral hover:text-coral-foreground"
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
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
          <p className="font-display text-xl">HSO — for the curious.</p>
          <p className="text-sm text-muted-foreground">Save, organize, and share opportunities with friends.</p>
        </div>
      </footer>

      {showShelf && <CollectionsPanel onClose={() => setShowShelf(false)} />}
    </div>
  );
};

export default Index;
