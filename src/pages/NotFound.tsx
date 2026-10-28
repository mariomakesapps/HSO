import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

const MORE_HUBS = [
  { href: "/deadlines", label: "Upcoming deadlines" },
  { href: "/remote", label: "Remote & nationwide" },
  { href: "/nyc-programs-for-high-school-students", label: "NYC programs" },
  { href: "/collections", label: "Collections" },
];

const PILL =
  "rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream";

/**
 * Shown for any URL that is not a page on HSO (unknown paths and unknown category
 * slugs). Lovable hosting answers every path with status 200, so a real 404 status
 * is not possible: the noindex tag keeps these URLs out of Google instead, and the
 * hub links give visitors and crawlers somewhere useful to go.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen text-foreground">
      <SEO
        title="Page not found | HSO"
        description="We couldn't find that page on HSO. Browse internships, scholarships, research, competitions, fellowships and summer programs for high school students."
        path={location.pathname}
        noindex
      />
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="hso-glass-panel rounded-[2rem] p-8">
          <h1 className="font-display text-4xl font-semibold text-ink">Page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            This page doesn't exist or has moved. Pick up your search from one of these.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORY_SLUGS.map((slug) => (
              <Link key={slug} to={`/categories/${slug}`} className={PILL}>
                {CATEGORY_META[slug].h1}
              </Link>
            ))}
            {MORE_HUBS.map((hub) => (
              <Link key={hub.href} to={hub.href} className={PILL}>
                {hub.label}
              </Link>
            ))}
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-coral active:scale-[0.98]"
          >
            Search all opportunities
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
