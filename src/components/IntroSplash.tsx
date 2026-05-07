import { useEffect, useState } from "react";
import hsoLogo from "@/assets/hso-logo.png";

export const INTRO_SEEN_KEY = "hso-intro-seen-session";

export function clearIntroSeen() {
  try {
    sessionStorage.removeItem(INTRO_SEEN_KEY);
    localStorage.removeItem(INTRO_SEEN_KEY);
  } catch {}
}

export function IntroSplash() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    const t = setTimeout(() => setShow(false), 3100);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="hso-intro fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink text-cream"
      aria-hidden="true"
    >
      <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-gradient-coral opacity-30 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full bg-sage/30 blur-3xl" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <img
          src={hsoLogo}
          alt="HSO logo"
          className="hso-intro-mark mb-6 h-28 w-28 rounded-3xl object-cover shadow-2xl"
        />
        <h1 className="hso-intro-logo font-display text-6xl font-semibold tracking-tight sm:text-8xl md:text-9xl">
          HSO
        </h1>
        <div className="hso-intro-line mt-4 h-px w-40 bg-coral" />
        <p className="hso-intro-tagline mt-5 text-xs uppercase tracking-[0.4em] text-cream/70 sm:text-sm">
          High School Opportunity Finder
        </p>
        <p className="hso-intro-tagline mt-3 max-w-md text-sm text-cream/60" style={{ animationDelay: "0.4s" }}>
          10,000+ programs · worldwide
        </p>
      </div>
    </div>
  );
}