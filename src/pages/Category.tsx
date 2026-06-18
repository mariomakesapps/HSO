import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { CATEGORY_META, CATEGORY_SLUGS, CategorySlug } from "@/lib/categories";
import { allOpportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SortBar, SortKey } from "@/components/SortBar";
import { applySort } from "@/lib/filterSort";

const Category = () => {
  const { slug } = useParams<{ slug: CategorySlug }>();
  const meta = slug ? CATEGORY_META[slug] : undefined;
  if (!slug || !meta) return <Navigate to="/" replace />;

  const [sort, setSort] = useState<SortKey>("recommended");
  const indexMap = useMemo(() => new Map(allOpportunities.map((o, i) => [o.id, i])), []);
  const list = useMemo(() => {
    const filtered = allOpportunities.filter((o) => o.category === meta.category);
    return applySort(filtered, sort, indexMap);
  }, [meta.category, sort, indexMap]);

  return (
    <div className="min-h-screen">
      <SEO
        title={meta.title}
        description={meta.description}
        path={`/categories/${slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: meta.h1,
            description: meta.description,
            url: `https://highschoolopportunity.org/categories/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: list.length,
              itemListElement: list.slice(0, 20).map((o, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://highschoolopportunity.org/opportunities/${o.id}`,
                name: o.title,
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "HSO", item: "https://highschoolopportunity.org/" },
              { "@type": "ListItem", position: 2, name: "Categories", item: "https://highschoolopportunity.org/" },
              { "@type": "ListItem", position: 3, name: meta.h1, item: `https://highschoolopportunity.org/categories/${slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: meta.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{meta.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{meta.intro}</p>

        <section className="hso-glass-panel mt-10 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">About {meta.h1.toLowerCase()}</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {meta.guide.map((p, i) => <p key={i}>{p}</p>)}
          </div>
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

