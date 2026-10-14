import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageCrumbs } from "@/lib/pageMeta";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SortBar, SortKey } from "@/components/SortBar";
import { applySort } from "@/lib/filterSort";
import { remoteMeta } from "@/lib/pageMeta";
import { REMOTE_META, REMOTE_PATH, remoteOpportunities } from "@/lib/remote";
import { useAtmosphere } from "@/lib/atmosphere";
import { useClock } from "@/lib/clock";

type CategoryFilter = "All" | (typeof CATEGORY_META)[keyof typeof CATEGORY_META]["category"];

const RemoteNationwide = () => {
  useAtmosphere("remote");

  const [sort, setSort] = useState<SortKey>("recommended");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const clockEpoch = useClock();

  const all = useMemo(() => remoteOpportunities(), []);
  const indexMap = useMemo(() => new Map(all.map((o, i) => [o.id, i])), [all]);

  const list = useMemo(() => {
    const filtered = category === "All" ? all : all.filter((o) => o.category === category);
    return applySort(filtered, sort, indexMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clockEpoch: sort order depends on today's date
  }, [all, category, sort, indexMap, clockEpoch]);

  // Only offer filters for categories that actually have remote listings.
  const availableCategories = useMemo(() => {
    const present = new Set(all.map((o) => o.category));
    return CATEGORY_SLUGS.map((s) => CATEGORY_META[s].category).filter((c) => present.has(c));
  }, [all]);

  return (
    <div className="min-h-screen">
      <SEO {...remoteMeta()} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs crumbs={pageCrumbs(REMOTE_META.h1, REMOTE_PATH)} className="mb-6" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Anywhere in the U.S.</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{REMOTE_META.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{REMOTE_META.intro}</p>

        <section className="hso-glass-panel mt-10 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Why remote and nationwide programs matter
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {REMOTE_META.guide.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["All", ...availableCategories] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                category === c
                  ? "border-coral bg-coral text-coral-foreground"
                  : "border-border bg-background hover:border-coral hover:text-coral"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <SortBar value={sort} onChange={setSort} count={list.length} />
        </div>

        <h2 className="sr-only">Remote and nationwide programs</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((o, i) => (
            <OpportunityCard key={o.id} opp={o} index={i} />
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-5 space-y-4">
            {REMOTE_META.faqs.map((f, i) => (
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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Browse by category</p>
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

export default RemoteNationwide;
