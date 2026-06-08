import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  isMobile?: boolean;
}

function pageRange(page: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onChange, isMobile }: Props) {
  if (totalPages <= 1) return null;
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const baseBtn =
    "inline-flex items-center justify-center h-10 min-w-10 px-3 rounded-full border text-sm font-bold transition-[transform,border-color,background-color,color] disabled:cursor-not-allowed disabled:opacity-40 hover:-translate-y-0.5 active:translate-y-0";

  return (
    <nav
      aria-label="Opportunity pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Go to previous page"
        disabled={prevDisabled}
        onClick={() => onChange(page - 1)}
        className={cn(baseBtn, "border-white/70 bg-card/72 text-ink backdrop-blur-md hover:border-coral/35")}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      {isMobile ? (
        <span
          aria-live="polite"
          className="px-3 text-sm font-bold text-ink"
        >
          Page {page} of {totalPages}
        </span>
      ) : (
        pageRange(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="px-2 text-sm text-muted-foreground" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
              onClick={() => onChange(p)}
              className={cn(
                baseBtn,
                p === page
                  ? "border-ink bg-ink text-cream shadow-[0_14px_28px_-22px_hsl(var(--ink)/0.7)]"
                  : "border-white/70 bg-card/72 text-ink backdrop-blur-md hover:border-coral/35",
              )}
            >
              {p}
            </button>
          ),
        )
      )}

      <button
        type="button"
        aria-label="Go to next page"
        disabled={nextDisabled}
        onClick={() => onChange(page + 1)}
        className={cn(baseBtn, "border-white/70 bg-card/72 text-ink backdrop-blur-md hover:border-coral/35")}
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}