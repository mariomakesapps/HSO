import { Link } from "react-router-dom";

/** Plain links to every page of a paginated list, so each page is one hop from any other. */
export function PageLinks({ page, pages, pathFor }: { page: number; pages: number; pathFor: (n: number) => string }) {
  if (pages <= 1) return null;
  const cls = "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold";
  const idle = `${cls} border-border bg-background hover:border-coral hover:text-coral`;
  return (
    <nav aria-label="Pages" className="mt-10 flex flex-wrap items-center gap-2">
      {page > 1 && (
        <Link rel="prev" to={pathFor(page - 1)} className={idle}>
          Previous
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span key={n} aria-current="page" className={`${cls} border-ink bg-ink text-cream`}>{n}</span>
        ) : (
          <Link key={n} to={pathFor(n)} className={idle}>
            {n}
          </Link>
        ),
      )}
      {page < pages && (
        <Link rel="next" to={pathFor(page + 1)} className={idle}>
          Next
        </Link>
      )}
    </nav>
  );
}
