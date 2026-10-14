import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ExternalLink, Bookmark, BookmarkCheck, Bell, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { allOpportunities } from "@/data/opportunities";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { Button } from "@/components/ui/button";
import { slugForCategory, CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
import { REMOVED_OPPORTUNITY_REDIRECTS } from "@/data/removedOpportunities";
import { detailFor } from "@/data/opportunityDetails";
import { opportunityCrumbs, opportunityMeta } from "@/lib/pageMeta";
import { relatedOpportunities } from "@/lib/related";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { costWord, costSentence, deadlineSentence, formatSentence, gradesLabel, summarySentence } from "@/lib/opportunityFacts";
import { reviewDateFor } from "@/lib/lastmod";
import { useAtmosphere, themeForCategory } from "@/lib/atmosphere";
import { store, useStore } from "@/store/collections";
import { toast } from "sonner";
import { authRedirectHref, useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";
import { nowDate, useClock } from "@/lib/clock";

const db = supabase as any;

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const opp = allOpportunities.find((o) => o.id === id);
  useClock(); // the deadline badge and sentence depend on today's date
  const dl = getDeadlineStatus(opp?.deadline, opp?.opensAt);
  const s = useStore();
  const fav = !!opp && s.favorites.includes(opp.id);
  const { user } = useAuthSession();
  const [intervals, setIntervals] = useState<number[]>([]);

  // The backdrop takes the colour of this programme's category.
  useAtmosphere(opp ? themeForCategory(opp.category) : "default");

  useEffect(() => {
    if (!user || !opp) return;
    let active = true;
    void db
      .from("reminder_preferences")
      .select("intervals")
      .eq("user_id", user.id)
      .eq("opportunity_id", opp.id)
      .maybeSingle()
      .then(({ data, error }: any) => {
        if (!active) return;
        if (error) {
          toast.error(error.message ?? "Could not load reminder preference");
          return;
        }
        setIntervals(data?.intervals ?? []);
      });
    return () => {
      active = false;
    };
  }, [opp, user]);

  if (!opp) {
    // A removed programme is redirected at the edge by the rules in dist/_redirects,
    // so a crawler never reaches this branch. It is still reachable by client-side
    // navigation from a stale bookmark or an in-app link, and the same destination
    // applies, so send the visitor on rather than showing them a dead end.
    const moved = id ? REMOVED_OPPORTUNITY_REDIRECTS[id] : undefined;
    if (moved) return <Navigate to={moved} replace />;

    return (
      <div className="min-h-screen text-foreground">
        <SEO title="Opportunity not found | HSO" path={`/opportunities/${id ?? ""}`} noindex />
        <main className="mx-auto max-w-2xl px-6 py-20 text-center">
          <div className="hso-glass-panel rounded-[2rem] p-8">
            <h1 className="font-display text-4xl font-semibold text-ink">Opportunity not found</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              This link points to a program that is no longer in the active catalog. These
              categories are the closest place to pick the search back up.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {CATEGORY_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  to={`/categories/${slug}`}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  {CATEGORY_META[slug].h1}
                </Link>
              ))}
            </div>
            <Link to="/" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral active:scale-[0.98]">
              Back to discover
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const detail = opp ? detailFor(opp.id) : undefined;
  const related = relatedOpportunities(opp);

  const toggleInterval = async (n: number) => {
    if (!user) { toast.info("Sign in to save reminders"); navigate(authRedirectHref(`/opportunities/${opp.id}`)); return; }
    const next = intervals.includes(n) ? intervals.filter((x) => x !== n) : [...intervals, n].sort((a,b) => b-a);
    setIntervals(next);
    const { error } = await db
      .from("reminder_preferences")
      .upsert(
        { user_id: user.id, opportunity_id: opp.id, intervals: next },
        { onConflict: "user_id,opportunity_id" },
      );
    if (error) {
      toast.error(error.message ?? "Could not save reminder preference");
      return;
    }
    toast.success("Reminder preference saved");
  };

  return (
    <div className="min-h-screen text-foreground">
      <SEO {...opportunityMeta(opp)} />
      <main className="mx-auto w-full max-w-[1100px] overflow-hidden px-3 py-10 sm:px-6 sm:py-14">
        <section className="hso-detail-shell hso-glass-panel hso-surface-grid relative mx-auto max-w-full overflow-hidden rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--coral)/0.08),transparent_34%,hsl(var(--sage)/0.08))]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[repeating-linear-gradient(90deg,hsl(var(--ink)/0.04)_0_1px,transparent_1px_18px)]" />
          <div className="relative">
            <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-coral">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <Breadcrumbs crumbs={opportunityCrumbs(opp)} className="mb-6" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/65 bg-card/74 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)]">{opp.category}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[dl.status]}`}>{dl.label}</span>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{opp.org}</p>
            <h1 className="mt-2 max-w-4xl break-words font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{opp.title}</h1>
            <p className="mt-4 max-w-3xl break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
              {summarySentence(opp)} {deadlineSentence(opp)}
            </p>

            <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Location" value={opp.location} />
              <Stat label="Format" value={opp.format} />
              <Stat label="Cost" value={costWord(opp.cost)} />
              <Stat label="Grades" value={`${opp.grades[0]}-${opp.grades[opp.grades.length-1]}`} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {opp.fields.map((f) => (
                <span key={f} className="rounded-full border border-white/65 bg-cream/64 px-3 py-1 text-xs font-semibold text-ink shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)]">{f}</span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={opp.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full max-w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream shadow-[0_18px_36px_-26px_hsl(var(--ink)/0.7)] transition-transform hover:-translate-y-0.5 hover:bg-coral hover:text-coral-foreground active:scale-[0.98] sm:w-auto sm:justify-start">
                Visit official program <ExternalLink className="h-4 w-4" />
              </a>
              <Button variant="outline" className="w-full rounded-full border-white/65 bg-card/72 font-bold shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto" onClick={async () => {
                if (!user) {
                  toast.message("Sign-in required", {
                    description: "Create a free account to save opportunities to your shelf.",
                    action: {
                      label: "Sign in to save",
                      onClick: () => navigate(authRedirectHref(`/opportunities/${opp.id}`)),
                    },
                  });
                  return;
                }
                const wasFav = fav;
                try {
                  await store.toggleFavorite(opp.id);
                  toast.success(wasFav ? "Removed from favorites" : "Saved to My Shelf");
                } catch (error: any) {
                  toast.error(error?.message ?? "Could not save opportunity");
                }
              }}>
                {fav ? <BookmarkCheck className="mr-2 h-4 w-4 text-coral" /> : <Bookmark className="mr-2 h-4 w-4" />}
                {fav ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </section>

        {/* Reminders */}
        <section className="hso-elevated-surface hso-surface-grid mt-6 overflow-hidden rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-coral" />
            <p className="font-display text-xl">Deadline reminders</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Choose when you want to be reminded before this deadline. {user ? "" : "Sign in to enable."}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[7, 3, 1].map((n) => (
              <button key={n} onClick={() => toggleInterval(n)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 active:scale-[0.98] ${intervals.includes(n) ? "border-coral bg-coral/10 text-coral" : "border-white/65 bg-card/72 hover:border-foreground"}`}>
                {n} day{n>1?"s":""} before
              </button>
            ))}
          </div>
        </section>

        {/* Every section is built from the listing's own fields. A missing field
            says so and points to the official site; nothing is filled in. */}
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">What you do</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{opp.blurb}</p>
          {detail?.body.map((p, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{p}</p>
          ))}

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Who it&rsquo;s for</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {gradesLabel(opp.grades) ? `High school students in ${gradesLabel(opp.grades)}.` : "High school students."}{" "}
            {detail?.eligibility ?? "Check the official site for the full eligibility rules."}
          </p>

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Cost</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail?.cost ?? costSentence(opp)}</p>

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Dates and deadline</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{deadlineSentence(opp)}</p>

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Format</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{formatSentence(opp)}</p>

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink">How to apply</h2>
          {detail?.howToApply?.length ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {detail.howToApply.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Applications go through the program&rsquo;s official page. Check it for the current form and requirements.
            </p>
          )}

          {detail?.faqs?.length ? (
            <>
              <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Frequently asked questions</h2>
              {detail.faqs.map((f, i) => (
                <div key={i} className="mt-5">
                  <h3 className="font-semibold text-ink">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </>
          ) : null}

          <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Official link</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            <a href={opp.url} className="break-all font-semibold text-ink underline underline-offset-4 hover:text-coral" rel="noopener noreferrer" target="_blank">
              {opp.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          </p>

          <LastChecked id={opp.id} detailChecked={detail?.source.checked} />
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">Related opportunities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((o) => (
                <li key={o.id}>
                  <Link
                    to={`/opportunities/${o.id}`}
                    className="hso-elevated-surface block h-full rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="block font-display text-lg font-semibold leading-snug text-ink">{o.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {o.org} · {o.category} · {o.location}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(() => {
          const catSlug = slugForCategory(opp.category);
          if (!catSlug) return null;
          const catMeta = CATEGORY_META[catSlug];
          return (
            <section className="mt-12">
              <div className="hso-glass-panel rounded-3xl p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Keep exploring</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                  Browse more {catMeta.h1.toLowerCase()}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {catMeta.intro}
                </p>
                <Link
                  to={`/categories/${catSlug}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral"
                >
                  See all {catMeta.h1.toLowerCase()}
                </Link>
              </div>
            </section>
          );
        })()}
      </main>
      <SiteFooter />
    </div>
  );
};

/** Month of the latest dated check in the review records, if there is one. */
function LastChecked({ id, detailChecked }: { id: string; detailChecked?: string }) {
  const today = nowDate().toISOString().slice(0, 10);
  const date = reviewDateFor(id, today) ?? detailChecked;
  if (!date) return null;
  const [y, m] = date.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 15)).toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return (
    <>
      <h2 className="mt-8 font-display text-2xl font-semibold text-ink">Last checked</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        These details were last checked against the official page in {month} {y}. Dates and rules can change, so confirm on the official site before you apply.
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hso-elevated-surface rounded-2xl p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

export default OpportunityDetail;

