import { useEffect, useState } from "react";
import { Compass } from "lucide-react";

const SEEN_KEY = "atlas-intro-seen-session";

export function IntroSplash() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem(SEEN_KEY, "1");
    const t = setTimeout(() => setShow(false), 3100);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="atlas-intro fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-cream"
      aria-hidden="true"
    >
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-gradient-coral opacity-30 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-sage/30 blur-3xl" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <span className="atlas-intro-compass mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-cream text-ink">
          <Compass className="h-8 w-8" />
        </span>
        <h1 className="atlas-intro-logo font-display text-6xl font-semibold tracking-tight sm:text-8xl">
          Atlas
        </h1>
        <div className="atlas-intro-line mt-4 h-px w-40 bg-coral" />
        <p className="atlas-intro-tagline mt-5 text-xs uppercase tracking-[0.4em] text-cream/70 sm:text-sm">
          High School Opportunity Finder
        </p>
        <p className="atlas-intro-tagline mt-3 max-w-md text-sm text-cream/60" style={{ animationDelay: "0.4s" }}>
          10,000+ programs · worldwide
        </p>
      </div>
    </div>
  );
}