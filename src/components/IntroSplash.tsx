import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hsoLogo from "@/assets/hso-logo.png";

export const INTRO_SEEN_KEY = "hso-intro-seen-session";

export function clearIntroSeen() {
  try {
    sessionStorage.removeItem(INTRO_SEEN_KEY);
    localStorage.removeItem(INTRO_SEEN_KEY);
  } catch {}
}

const ease = [0.22, 1, 0.36, 1] as const;

const ParticleField = () => {
  const particles = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => {
        const left = (i * 53) % 100;
        const top = (i * 31) % 100;
        const dur = 9 + (i % 6);
        const delay = (i % 7) * 0.4;
        const size = 2 + (i % 3);
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-ink/20"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [-10, -60, -110] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
};

const StaggeredChars = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => (
  <span className={className} aria-label={text}>
    {text.split("").map((ch, i) => (
      <motion.span
        key={i}
        className="inline-block"
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: delay + i * 0.035, ease }}
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ))}
  </span>
);

export function IntroSplash() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    const t = setTimeout(() => setShow(false), 5200);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background bg-grain text-foreground"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease }}
        >
          {/* Ambient glow blobs */}
          <motion.div
            className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-coral opacity-25 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2.4, ease }}
          />
          <motion.div
            className="pointer-events-none absolute -left-40 bottom-[-10rem] h-[460px] w-[460px] rounded-full bg-sage/30 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 2.6, delay: 0.2, ease }}
          />

          {/* Sliding light sweep */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-cream/60 to-transparent blur-2xl"
            initial={{ x: "-30%", opacity: 0 }}
            animate={{ x: "260%", opacity: [0, 0.7, 0] }}
            transition={{ duration: 3.4, delay: 0.6, ease }}
          />

          <ParticleField />

          {/* Floating background opportunity cards */}
          <div className="pointer-events-none absolute inset-0">
            {[
              { x: "8%", y: "18%", r: -6, d: 0.8 },
              { x: "78%", y: "22%", r: 5, d: 1.0 },
              { x: "14%", y: "70%", r: 4, d: 1.2 },
              { x: "74%", y: "72%", r: -7, d: 1.4 },
            ].map((c, i) => (
              <motion.div
                key={i}
                className="absolute h-28 w-44 rounded-2xl border border-foreground/10 bg-card/70 shadow-soft backdrop-blur"
                style={{ left: c.x, top: c.y }}
                initial={{ opacity: 0, y: 30, rotate: c.r, filter: "blur(10px)" }}
                animate={{ opacity: 0.55, y: 0, rotate: c.r, filter: "blur(0px)" }}
                transition={{ duration: 1.6, delay: c.d, ease }}
              >
                <div className="m-3 h-2 w-16 rounded-full bg-coral/40" />
                <div className="mx-3 mt-2 h-2 w-28 rounded-full bg-ink/15" />
                <div className="mx-3 mt-2 h-2 w-20 rounded-full bg-ink/10" />
                <div className="mx-3 mt-3 h-2 w-12 rounded-full bg-sage/40" />
              </motion.div>
            ))}
          </div>

          {/* Center stage */}
          <div className="relative flex flex-col items-center px-6 text-center">
            {/* Logo with shadow bloom */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease }}
            >
              <motion.div
                className="absolute inset-0 -z-10 rounded-3xl bg-gradient-coral blur-2xl"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.45, scale: 1.25 }}
                transition={{ duration: 1.6, delay: 0.3, ease }}
              />
              <span className="relative inline-block h-24 w-24 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-foreground/10 sm:h-28 sm:w-28">
                <img
                  src={hsoLogo}
                  alt="HSO logo"
                  className="absolute inset-0 h-full w-full scale-[1.35] object-cover"
                />
              </span>
            </motion.div>

            {/* The */}
            <motion.p
              className="font-display text-lg italic text-ink/70 sm:text-xl"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 1.1, ease }}
            >
              The
            </motion.p>

            {/* High School */}
            <motion.h2
              className="mt-1 font-display text-4xl font-semibold tracking-tight text-coral sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.0, delay: 1.5, ease }}
            >
              High School
            </motion.h2>

            {/* Opportunity Finder */}
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
              <StaggeredChars text="Opportunity Finder" delay={2.2} />
            </h1>

            {/* line */}
            <motion.div
              className="mt-6 h-px w-40 origin-left bg-coral"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 3.2, ease }}
            />

            {/* tagline */}
            <motion.p
              className="mt-5 font-display text-base italic text-sage sm:text-lg"
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 3.5, ease }}
            >
              300+ curated opportunities, growing weekly.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
