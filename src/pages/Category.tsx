import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { CATEGORY_META, CATEGORY_SLUGS, CategorySlug } from "@/lib/categories";
import { allOpportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SortBar, SortKey } from "@/components/SortBar";
import { applySort } from "@/lib/filterSort";

const Category = () => {
  const { slug } = useParams<{ slug: CategorySlug }>();
  const meta = slug ? CATEGORY_META[slug] : undefined;
  if (!slug || !meta) return <Navigate to="/" replace />;
  useSEO({ title: meta.title, description: meta.description });

  const [sort, setSort] = useState<SortKey>("recommended");
  const indexMap = useMemo(() => new Map(allOpportunities.map((o, i) => [o.id, i])), []);
  const list = useMemo(() => {
    const filtered = allOpportunities.filter((o) => o.category === meta.category);
    return applySort(filtered, sort, indexMap);
  }, [meta.category, sort, indexMap]);

  return (
    <div className="min-h-screen bg-background bg-grain">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Category</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{meta.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{meta.intro}</p>

        <div className="mt-8">
          <SortBar value={sort} onChange={setSort} count={list.length} />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
        </div>

        <section className="mt-16 rounded-3xl border border-border bg-card p-6 sm:p-10">
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