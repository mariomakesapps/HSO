import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { CATEGORY_META, CATEGORY_SLUGS, CategorySlug } from "@/lib/categories";
import { allOpportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SortBar, SortKey } from "@/components/SortBar";
import { applySort } from "@/lib/filterSort";
import { categoryCrumbs, categoryMeta, categoryPageCount, categoryPagePath } from "@/lib/pageMeta";
import { useAtmosphere, type AtmosphereTheme } from "@/lib/atmosphere";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CATEGORY_PAGE_SIZE } from "@/config/seo";
import { PageLinks } from "@/components/PageLinks";
import { publishedTopics, topicListings, topicPath } from "@/lib/topics";

const Category = () => {
  const { slug, page: pageParam } = useParams<{ slug: CategorySlug; page?: string }>();
  const meta = slug ? CATEGORY_META[slug] : undefined;
  const page = pageParam === undefined ? 1 : /^\d+$/.test(pageParam) ? Number(pageParam) : NaN;

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

  if (!slug || !meta) return <Navigate to="/" replace />;

  // Page 1 lives at the bare category URL; /page/1 and out-of-range pages go there.
  const pages = categoryPageCount(slug);
  if (!Number.isInteger(page) || page < 1 || page > pages || pageParam === "1") {
    return <Navigate to={`/categories/${slug}`} replace />;
  }
  const first = page === 1;
  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  const onPage = list.slice(start, start + CATEGORY_PAGE_SIZE);
  const topics = publishedTopics(slug);
  const crumbs = first ? categoryCrumbs(slug) : [...categoryCrumbs(slug), { name: `Page ${page}`, path: categoryPagePath(slug, page) }];

  return (
    <div className="min-h-screen">
      <SEO {...categoryMeta(slug, page)} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs crumbs={crumbs} />
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {meta.h1}
          {!first && <span className="block text-2xl font-normal text-muted-foreground sm:text-3xl">Page {page} of {pages}</span>}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{meta.intro}</p>

        {first && (
          <section className="hso-glass-panel mt-10 rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">About {meta.h1.toLowerCase()}</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {meta.guide.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        <div className="mt-8">
          <SortBar value={sort} onChange={setSort} count={list.length} />
        </div>

        <h2 className="sr-only">Programs</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {start + 1}-{start + onPage.length} of {list.length}
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {onPage.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
        </div>

        <PageLinks page={page} pages={pages} pathFor={(n) => categoryPagePath(slug, n)} />

        {topics.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">Browse {meta.h1.toLowerCase()} by topic</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {topics.map((t) => (
                <Link key={t.slug} to={topicPath(t)} className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral">
                  {t.titlePhrase} ({topicListings(t).length})
                </Link>
              ))}
            </div>
          </section>
        )}

        {first && <section className="mt-16">
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
        </section>}

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

