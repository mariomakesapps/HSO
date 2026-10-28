import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { OpportunityCard } from "@/components/OpportunityCard";
import { SortBar, SortKey } from "@/components/SortBar";
import { applySort } from "@/lib/filterSort";
import { CATEGORY_META } from "@/lib/categories";
import { allOpportunities } from "@/data/opportunities";
import { subHubMeta, subHubMembers } from "@/lib/pageMeta";
import { findSubHub, subHubPath, subHubsFor } from "@/lib/subHubs";
import { glanceParagraphs, hubFaqs, hubStats } from "@/lib/hubStats";
import { useAtmosphere, type AtmosphereTheme } from "@/lib/atmosphere";
import NotFound from "@/pages/NotFound";

/** A subject sub-hub such as /categories/competitions/stem (see lib/subHubs.ts). */
const SubHub = () => {
  const { slug, sub } = useParams<{ slug: string; sub: string }>();
  const hub = findSubHub(slug, sub);

  useAtmosphere((hub ? hub.parent : "default") as AtmosphereTheme);

  const [sort, setSort] = useState<SortKey>("recommended");
  const indexMap = useMemo(() => new Map(allOpportunities.map((o, i) => [o.id, i])), []);
  const members = useMemo(() => (hub ? subHubMembers(hub) : []), [hub]);
  const list = useMemo(() => applySort(members, sort, indexMap), [members, sort, indexMap]);

  if (!hub) return <NotFound />;

  const parent = CATEGORY_META[hub.parent];
  const stats = hubStats(members);
  const siblings = subHubsFor(hub.parent).filter((h) => h.slug !== hub.slug);

  return (
    <div className="min-h-screen">
      <SEO {...subHubMeta(hub)} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="font-semibold hover:text-coral">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={`/categories/${hub.parent}`} className="font-semibold hover:text-coral">{parent.h1.replace(/ for high school students$/i, "").replace(/^./, (c) => c.toUpperCase())}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{hub.h1.replace(/ for high school students$/i, "")}</li>
          </ol>
        </nav>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {hub.h1.replace(/^./, (c) => c.toUpperCase())}
        </h1>
        <div className="mt-4 max-w-3xl space-y-3 text-lg text-muted-foreground">
          {hub.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <section className="hso-glass-panel mt-10 rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">At a glance</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            {glanceParagraphs(hub.label, stats).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {hub.guide && (
            <Link to={hub.guide.href} className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral">
              {hub.guide.label}
            </Link>
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
            {hubFaqs(hub.label, stats).map((f, i) => (
              <details key={i} className="hso-glass-panel group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold text-ink">{f.q}</summary>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hso-glass-panel mt-16 rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">More {parent.h1.toLowerCase()}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={`/categories/${hub.parent}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral">
              All {parent.h1.toLowerCase()}
            </Link>
            {siblings.map((h) => (
              <Link key={h.slug} to={subHubPath(h)} className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral">
                {h.h1.replace(/ for high school students$/i, "").replace(/^./, (c) => c.toUpperCase())}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SubHub;
