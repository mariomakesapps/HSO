import { useEffect, useState } from "react";

const STORAGE_KEY = "hso-intro-played-v1";

const IntroSplash = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const leaveAt = window.setTimeout(() => setLeaving(true), 2200);
    const doneAt = window.setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      document.body.style.overflow = "";
    }, 3100);
    return () => {
      window.clearTimeout(leaveAt);
      window.clearTimeout(doneAt);
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-coral text-cream ${leaving ? "hso-splash-leave" : ""}`}
      style={{ willChange: "transform" }}
    >
      {/* subtle radial gradient texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 20% 30%, hsl(var(--ochre) / 0.5), transparent 60%), radial-gradient(700px 500px at 85% 75%, hsl(var(--sage) / 0.35), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <span className="mb-5 text-[10px] font-medium uppercase tracking-[0.5em] text-cream/80 hso-splash-tag">
          High School Opportunities
        </span>

        <div className="flex items-end gap-1 sm:gap-2">
          {[
            { ch: "H", color: "text-cream" },
            { ch: "S", color: "text-sunny" },
            { ch: "O", color: "text-sky" },
          ].map(({ ch, color }, i) => (
            <span key={ch} className={`hso-splash-letter-mask font-sans text-[22vw] leading-[0.85] sm:text-[18vw] md:text-[14vw] ${color}`} style={{ fontWeight: 800 }}>
              <span
                className="hso-splash-letter"
                style={{ animationDelay: `${0.15 + i * 0.18}s` }}
              >
                {ch}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-8 h-[2px] w-0 bg-gradient-to-r from-cream via-sunny to-sky hso-splash-line" />
      </div>
    </div>
  );
};

export default IntroSplash;