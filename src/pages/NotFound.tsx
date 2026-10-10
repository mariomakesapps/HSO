import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { SiteFooter } from "@/components/SiteFooter";
import { NOT_FOUND_META } from "@/lib/pageMeta";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

/**
 * Unknown URLs. Also server-rendered into dist/404.html, which the host serves
 * with a real 404 status, so it must be a useful page rather than a dead end.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <SEO {...NOT_FOUND_META} />
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="hso-glass-panel rounded-[2rem] p-8">
          <h1 className="font-display text-4xl font-semibold text-ink">Page not found</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            That page is not part of the HSO catalogue. It may have been a program that is no longer listed. These are the
            best places to pick the search back up.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORY_SLUGS.map((slug) => (
              <Link
                key={slug}
                to={`/categories/${slug}`}
                className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream"
              >
                {CATEGORY_META[slug].h1}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <Link to="/deadlines" className="font-semibold text-ink underline underline-offset-4">See what closes next</Link> or{" "}
            <Link to="/" className="font-semibold text-ink underline underline-offset-4">search the whole catalogue</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
