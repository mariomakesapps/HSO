import { useEffect, useState } from "react";
import { ArrowUp, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReturnToFiltersButton({ targetId = "filters-section" }: { targetId?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId]);

  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Return to filters"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={cn(
        "group fixed right-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/70 bg-cream/85 px-4 py-2.5 text-sm font-bold text-ink shadow-[inset_0_1px_0_hsl(0_0%_100%/0.75),0_18px_36px_-20px_hsl(var(--ink)/0.45)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-coral/40 hover:text-coral active:scale-[0.97] motion-reduce:transition-none",
        "bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-6 md:right-6 lg:bottom-8 lg:right-8",
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <SlidersHorizontal className="h-4 w-4 text-sage" />
        <ArrowUp className="absolute -right-1 -top-1 h-3 w-3 text-coral" strokeWidth={3} />
      </span>
      Filters
    </button>
  );
}
