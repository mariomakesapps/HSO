import { Link, useNavigate, useParams } from "react-router-dom";
import { ExternalLink, Bookmark, BookmarkCheck, Bell, ArrowLeft, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { allOpportunities } from "@/data/opportunities";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { store, useStore } from "@/store/collections";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { authRedirectHref, rememberAuthReturnTo } from "@/hooks/useAuthSession";

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const opp = allOpportunities.find((o) => o.id === id);
  const dl = getDeadlineStatus(opp?.deadline);
  const s = useStore();
  const fav = !!opp && s.favorites.includes(opp.id);
  const [userId, setUserId] = useState<string | null>(null);
  const [intervals, setIntervals] = useState<number[]>([]);

  useSEO({
    title: opp ? `${opp.title} — ${opp.org} | HSO` : "Opportunity not found — HSO",
    description: opp ? `${opp.blurb} Apply at ${opp.org}.` : undefined,
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      if (uid && opp) {
        const { data: rows } = await supabase
          .from("reminder_preferences")
          .select("intervals")
          .eq("user_id", uid).eq("opportunity_id", opp.id).maybeSingle();
        if (rows?.intervals) setIntervals(rows.intervals);
      }
    });
  }, [opp]);

  if (!opp) {
    return (
      <div className="min-h-screen bg-background bg-grain">
          <main className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="font-display text-4xl">Opportunity not found</h1>
          <Link to="/" className="mt-6 inline-block text-coral underline">Back to discover</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const related = allOpportunities
    .filter((o) => o.id !== opp.id && (o.category === opp.category || o.fields.some((f) => opp.fields.includes(f))))
    .slice(0, 3);

  const toggleInterval = async (n: number) => {
    if (!userId) { toast.info("Sign in to save reminders"); rememberAuthReturnTo(`/opportunities/${opp.id}`); navigate(authRedirectHref(`/opportunities/${opp.id}`), { state: { returnTo: `/opportunities/${opp.id}` } }); return; }
    const next = intervals.includes(n) ? intervals.filter((x) => x !== n) : [...intervals, n].sort((a,b) => b-a);
    setIntervals(next);
    // NOTE: email sending is not yet wired up. To activate, deploy a `send-deadline-reminders`
    // edge function that reads from `reminder_preferences` daily and dispatches emails.
    const { error } = await supabase.from("reminder_preferences").upsert({
      user_id: userId, opportunity_id: opp.id, intervals: next,
    } as any, { onConflict: "user_id,opportunity_id" });
    if (error) toast.error("Couldn't save reminder");
  };

  return (
    <div className="min-h-screen bg-background bg-grain">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide">{opp.category}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[dl.status]}`}>{dl.label}</span>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{opp.org}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{opp.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{opp.blurb}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Location" value={opp.location} />
          <Stat label="Format" value={opp.format} />
          <Stat label="Cost" value={opp.cost} />
          <Stat label="Grades" value={`${opp.grades[0]}–${opp.grades[opp.grades.length-1]}`} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {opp.fields.map((f) => (
            <span key={f} className="rounded-full bg-secondary px-3 py-1 text-xs">{f}</span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {userId ? (
            <a href={opp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream hover:bg-coral hover:text-coral-foreground">
              Apply on official site <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <Link to={authRedirectHref(`/opportunities/${opp.id}`)} state={{ returnTo: `/opportunities/${opp.id}` }} onClick={() => rememberAuthReturnTo(`/opportunities/${opp.id}`)} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-3 text-sm font-semibold text-foreground hover:border-ink/40 hover:text-ink">
              <Lock className="h-4 w-4" /> Sign in to view link
            </Link>
          )}
          <Button variant="outline" className="rounded-full" onClick={() => {
            if (!userId) { rememberAuthReturnTo(`/opportunities/${opp.id}`); navigate(authRedirectHref(`/opportunities/${opp.id}`), { state: { returnTo: `/opportunities/${opp.id}` } }); return; }
            store.toggleFavorite(opp.id);
            toast.success(fav ? "Removed from favorites" : "Saved to favorites");
          }}>
            {fav ? <BookmarkCheck className="mr-2 h-4 w-4 text-coral" /> : <Bookmark className="mr-2 h-4 w-4" />}
            {fav ? "Saved" : "Save"}
          </Button>
        </div>

        {/* Reminders */}
        <section className="mt-10 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-coral" />
            <p className="font-display text-xl">Deadline reminders</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Get an email before this deadline. {userId ? "" : "Sign in to enable."}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[7, 3, 1].map((n) => (
              <button key={n} onClick={() => toggleInterval(n)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${intervals.includes(n) ? "border-coral bg-coral/10 text-coral" : "border-border bg-card hover:border-foreground"}`}>
                {n} day{n>1?"s":""} before
              </button>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl">Related opportunities</h2>
            <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg">{value}</p>
    </div>
  );
}

export default OpportunityDetail;