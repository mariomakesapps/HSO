import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReturnToFiltersButton({ targetId = "opportunity-filters" }: { targetId?: string }) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let intersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(el);

    const update = () => {
      const past = window.scrollY > el.offsetTop + 200;
      setShow(!intersecting && past);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };

  if (!mounted) return null;

  const node = (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to opportunity filters"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        right: "16px",
      }}
      className={cn(
        "group fixed z-[9999] inline-flex items-center gap-2 rounded-full border border-coral/40 bg-ink px-4 py-2.5 text-sm font-bold text-cream shadow-[0_18px_36px_-18px_hsl(var(--ink)/0.7)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-coral active:scale-[0.97] motion-reduce:transition-none md:bottom-6 md:right-6",
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <SlidersHorizontal className="h-4 w-4 text-sage" />
        <ArrowUp className="absolute -right-1 -top-1 h-3 w-3 text-coral" strokeWidth={3} />
      </span>
      Back to filters
    </button>
  );

  return createPortal(node, document.body);
}
