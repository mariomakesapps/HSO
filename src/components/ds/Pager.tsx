import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page numbers around the current page, with first/last always shown. */
function windowed(page: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

/** Client-side pager for filtered lists (crawlable pages use PageLinks instead). */
export function Pager({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const btn =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-hso border text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong disabled:opacity-40";
  return (
    <nav aria-label="Results pages" className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
      <button type="button" className={cn(btn, "border-hso-line bg-hso-surface px-3 text-hso-fg hover:border-hso-line-strong")} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
      </button>
      {windowed(page, total).map((p, i) =>
        p === "gap" ? (
          <span key={`g${i}`} className="px-1 text-hso-muted">…</span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            className={cn(btn, p === page ? "border-hso-fg bg-hso-fg text-white" : "border-hso-line bg-hso-surface text-hso-fg hover:border-hso-line-strong")}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={cn(btn, "border-hso-line bg-hso-surface px-3 text-hso-fg hover:border-hso-line-strong")} disabled={page >= total} onClick={() => onChange(page + 1)}>
        <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
