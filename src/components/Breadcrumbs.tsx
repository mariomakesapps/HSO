import { Link } from "react-router-dom";
import type { Crumb } from "@/lib/pageMeta";

/**
 * Visible breadcrumb trail. Pass the same Crumb[] the page's BreadcrumbList
 * JSON-LD is built from (src/lib/pageMeta.ts), so what a reader sees and what
 * the structured data claims are the same trail.
 */
export function Breadcrumbs({ crumbs, className = "" }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex min-w-0 items-center gap-2">
              {last ? (
                <span aria-current="page" className="truncate font-semibold text-ink">{c.name}</span>
              ) : (
                <>
                  <Link to={c.path} className="underline-offset-4 hover:text-coral hover:underline">{c.name}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
