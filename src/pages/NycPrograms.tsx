import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { OpportunityCard } from "@/components/OpportunityCard";
import { nycMeta } from "@/lib/pageMeta";
import { NYC_META, nycAfterSchoolByBorough, nycFeatured } from "@/lib/nyc";
import { useAtmosphere } from "@/lib/atmosphere";

/**
 * The New York City hub.
 *
 * The selective programmes get cards, because each has a page worth visiting.
 * The city after-school feed gets plain grouped links: those listings are
 * noindexed near-duplicates of each other, and a borough list is the only form
 * in which they are actually useful to a student.
 */
const NycPrograms = () => {
  useAtmosphere("default");
  const featured = nycFeatured();
  const boroughs = nycAfterSchoolByBorough();
  const afterSchoolTotal = boroughs.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-screen text-foreground">
      <SEO {...nycMeta()} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">New York City</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {NYC_META.h1}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {NYC_META.intro}
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">
            Programs with their own application ({featured.length})
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 60).map((o) => (
              <OpportunityCard key={o.id} opp={o} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">
            Free city after-school programs ({afterSchoolTotal})
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            From the New York City Department of Youth and Community Development's after-school
            table. These are free and open to a wide age range rather than high-school specific,
            so use them to find something local rather than as a competitive application.
          </p>
          {boroughs.map((group) => (
            <div key={group.borough} className="mt-8">
              <h3 className="font-display text-xl font-semibold">
                {group.borough} ({group.items.length})
              </h3>
              <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((o) => (
                  <li key={o.id} className="text-sm leading-relaxed">
                    <Link
                      to={`/opportunities/${o.id}`}
                      className="text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
                    >
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">How to use this page</h2>
          {NYC_META.guide.map((p, i) => (
            <p key={i} className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Frequently asked questions</h2>
          {NYC_META.faqs.map((f, i) => (
            <div key={i} className="mt-6 max-w-3xl">
              <h3 className="font-semibold text-ink">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NycPrograms;
