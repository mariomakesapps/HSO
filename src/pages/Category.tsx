import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { CATEGORY_META, CATEGORY_SLUGS, CategorySlug } from "@/lib/categories";
import { allOpportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SortBar, SortKey } from "@/components/SortBar";
import { applySort } from "@/lib/filterSort";
import { categoryMeta } from "@/lib/pageMeta";
import { useAtmosphere, type AtmosphereTheme } from "@/lib/atmosphere";
import { CATEGORY_GUIDES, subHubPath, subHubsFor } from "@/lib/subHubs";
import { glanceParagraphs, hubStats } from "@/lib/hubStats";

const Category = () => {
  const { slug } = useParams<{ slug: CategorySlug }>();
  const meta = slug ? CATEGORY_META[slug] : undefined;

  // Every hook runs before the redirect. Bailing out first would change the
  // number of hooks between renders the moment a slug went from valid to
  // invalid, which React treats as an error.
  useAtmosphere((meta ? slug : "default") as AtmosphereTheme);

  const [sort, setSort] = useState<SortKey>("recommended");
  const indexMap = useMemo(() => new Map(allOpportunities.map((o, i) => [o.id, i])), []);
  const list = useMemo(() => {
    if (!meta) return [];
    const filtered = allOpportunities.filter((o) => o.category === meta.category);
    return applySort(filtered, sort, indexMap);
  }, [meta, sort, indexMap]);

  // An unknown category is not a page: show the noindexed not-found page rather
  // than redirecting to the homepage, which Google reads as a soft 404.
  if (!slug || !meta) return <NotFound />;

  const subHubs = subHubsFor(slug);
  const guides = CATEGORY_GUIDES[slug] ?? [];

  return (
    <div className="min-h-screen">
      <SEO {...categoryMeta(slug)} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{meta.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{meta.intro}</p>

        <section className="hso-glass-panel mt-10 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">About {meta.h1.toLowerCase()}</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {meta.guide.map((p, i) => <p key={i}>{p}</p>)}
            {glanceParagraphs(meta.h1.replace(/ for high school students$/i, "").toLowerCase(), hubStats(list)).map((p, i) => (
              <p key={`g${i}`}>{p}</p>
            ))}
          </div>
          {(subHubs.length > 0 || guides.length > 0) && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Browse by subject</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {subHubs.map((h) => (
                  <Link key={h.slug} to={subHubPath(h)} className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral">
                    {h.h1.replace(/ for high school students$/i, "").replace(/^./, (c) => c.toUpperCase())}
                  </Link>
                ))}
                {guides.map((g) => (
                  <Link key={g.href} to={g.href} className="rounded-full border border-coral/40 bg-background px-4 py-2 text-sm font-semibold text-ink hover:border-coral hover:text-coral">
                    {g.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="mt-8">
          <SortBar value={sort} onChange={setSort} count={list.length} />
        </div>

        <h2 className="sr-only">Programs</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-5 space-y-4">
            {meta.faqs.map((f, i) => (
              <details key={i} className="hso-glass-panel group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold text-ink">
                  {f.q}
                </summary>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hso-glass-panel mt-16 rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Browse more categories</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link key={s} to={`/categories/${s}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral">
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
export default Category;

