import { Link, Navigate, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLinks } from "@/components/PageLinks";
import { CATEGORY_META } from "@/lib/categories";
import { CATEGORY_PAGE_SIZE } from "@/config/seo";
import { findTopic, publishedTopics, topicListings, topicPath } from "@/lib/topics";
import { topicCrumbs, topicFaqs, topicMeta, topicPageCount } from "@/lib/pageMeta";
import { useAtmosphere, type AtmosphereTheme } from "@/lib/atmosphere";
import NotFound from "@/pages/NotFound";

/**
 * A topic landing page: /categories/<category>/<topic>[/page/<n>].
 * The list, the counts and the FAQ answers all come from the catalogue
 * (src/lib/topics.ts, src/lib/pageMeta.ts).
 */
const Topic = () => {
  const { slug, topic: topicSlug, page: pageParam } = useParams<{ slug: string; topic: string; page?: string }>();
  const topic = findTopic(slug, topicSlug);
  useAtmosphere((topic ? topic.parent : "default") as AtmosphereTheme);

  if (!topic) return <NotFound />;

  const pages = topicPageCount(topic);
  const page = pageParam === undefined ? 1 : /^\d+$/.test(pageParam) ? Number(pageParam) : NaN;
  if (!Number.isInteger(page) || page < 1 || page > pages || pageParam === "1") {
    return <Navigate to={topicPath(topic)} replace />;
  }

  const list = topicListings(topic);
  const first = page === 1;
  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  const onPage = list.slice(start, start + CATEGORY_PAGE_SIZE);
  const parent = CATEGORY_META[topic.parent];
  const siblings = publishedTopics(topic.parent).filter((t) => t.slug !== topic.slug);

  return (
    <div className="min-h-screen">
      <SEO {...topicMeta(topic, page)} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs crumbs={topicCrumbs(topic, page)} />
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">{parent.h1}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {topic.titlePhrase} for High School Students
          {!first && <span className="block text-2xl font-normal text-muted-foreground sm:text-3xl">Page {page} of {pages}</span>}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {topic.intro} HSO lists {list.length}.
          {topic.companion && (
            <>
              {" "}
              See also{" "}
              <Link to={topic.companion.path} className="font-semibold text-ink underline underline-offset-4 hover:text-coral">
                {topic.companion.label}
              </Link>
              .
            </>
          )}
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold text-ink">
          All {topic.phrase} ({start + 1}-{start + onPage.length} of {list.length})
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {onPage.map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
        </div>

        <PageLinks page={page} pages={pages} pathFor={(n) => topicPath(topic, n)} />

        {first && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {topicFaqs(topic).map((f) => (
                <div key={f.q} className="hso-glass-panel rounded-2xl p-5">
                  <h3 className="font-display text-lg font-semibold text-ink">{f.q}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="hso-glass-panel mt-16 rounded-3xl p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Keep exploring</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={`/categories/${topic.parent}`} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:border-coral hover:text-coral">
              All {parent.h1.toLowerCase()}
            </Link>
            {siblings.map((t) => (
              <Link key={t.slug} to={topicPath(t)} className="rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-coral hover:text-coral">
                {t.titlePhrase}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Topic;
