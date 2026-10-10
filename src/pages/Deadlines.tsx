import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageCrumbs } from "@/lib/pageMeta";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { OpportunityCard } from "@/components/OpportunityCard";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
import { DEADLINES_META, DEADLINES_PATH, deadlineBuckets } from "@/lib/deadlines";
import { deadlinesMeta } from "@/lib/pageMeta";
import { useAtmosphere } from "@/lib/atmosphere";

const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? "" : MONTH_DAY.format(d);
}

const Deadlines = () => {
  useAtmosphere("remote");

  // Recomputed on mount so the page is right for the visitor's day, not the
  // day the site was built. The prerendered HTML is a build-time snapshot.
  const buckets = useMemo(() => deadlineBuckets(), []);
  const total = buckets.reduce((n, b) => n + b.items.length, 0);
  const closingBuckets = buckets.filter((b) => b.id !== "opening-soon");
  const opening = buckets.find((b) => b.id === "opening-soon");

  return (
    <div className="min-h-screen">
      <SEO {...deadlinesMeta()} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs crumbs={pageCrumbs(DEADLINES_META.h1, DEADLINES_PATH)} className="mb-6" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Deadline tracker</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {DEADLINES_META.h1}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{DEADLINES_META.intro}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {closingBuckets.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:border-coral hover:text-coral"
            >
              {b.title}
              <span className="ml-2 text-muted-foreground">{b.items.length}</span>
            </a>
          ))}
        </div>

        {total === 0 ? (
          <p className="hso-glass-panel mt-10 rounded-3xl p-6 text-base text-muted-foreground sm:p-8">
            No confirmed deadlines in the next three months. Programs publish next-cycle dates
            through the autumn, so check back — or browse everything by{" "}
            <Link to="/collections" className="text-coral underline-offset-4 hover:underline">
              collection
            </Link>{" "}
            in the meantime.
          </p>
        ) : (
          closingBuckets.map((bucket) => (
            <section key={bucket.id} id={bucket.id} className="mt-14 scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {bucket.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {bucket.items.length} {bucket.items.length === 1 ? "opportunity" : "opportunities"}
                </p>
              </div>
              <p className="mt-2 max-w-2xl text-base text-muted-foreground">{bucket.blurb}</p>

              {bucket.items.length === 0 ? (
                <p className="mt-5 text-base text-muted-foreground">
                  Nothing in this window right now.
                </p>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {bucket.items.map((o, i) => (
                    <OpportunityCard key={o.id} opp={o} index={i} />
                  ))}
                </div>
              )}
            </section>
          ))
        )}

        {opening && opening.items.length > 0 && (
          <section id={opening.id} className="mt-16 scroll-mt-24">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {opening.title}
            </h2>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">{opening.blurb}</p>
            <ul className="hso-glass-panel mt-6 divide-y divide-border/60 rounded-3xl p-2 sm:p-4">
              {opening.items.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4">
                  <CalendarClock className="h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
                  <Link
                    to={`/opportunities/${o.id}`}
                    className="font-medium text-ink underline-offset-4 hover:text-coral hover:underline"
                  >
                    {o.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">{o.org}</span>
                  <span className="ml-auto text-sm font-semibold text-ink">
                    Opens {formatDate(o.opensAt)}
                    {o.deadline ? (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · closes {formatDate(o.deadline)}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="hso-glass-panel mt-16 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            How to use a deadline list
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {DEADLINES_META.guide.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-5 space-y-4">
            {DEADLINES_META.faqs.map((f, i) => (
              <details
                key={i}
                className="hso-glass-panel group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none font-display text-lg font-semibold text-ink">
                  {f.q}
                </summary>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hso-glass-panel mt-16 rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Browse by category
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_SLUGS.map((s) => (
              <Link
                key={s}
                to={`/categories/${s}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral"
              >
                {CATEGORY_META[s].h1}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Deadlines;
