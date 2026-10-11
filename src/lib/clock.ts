import { useEffect, useState } from "react";

declare global {
  // Set by scripts/prerender.mjs: on globalThis for the server render, and in a
  // <script> on every page for the browser.
  var __HSO_BUILD_NOW__: number | undefined;
}

/**
 * The time the page's HTML was rendered at build: one timestamp shared by the
 * server render and the page (window.__HSO_BUILD_NOW__). Falls back to now in dev.
 */
export function buildNow(): number {
  return typeof globalThis.__HSO_BUILD_NOW__ === "number" ? globalThis.__HSO_BUILD_NOW__ : Date.now();
}

/**
 * "Now" for anything date-dependent that is server-rendered (countdowns, the
 * closed-last sort, "deadlines this week"). The first render uses the build time,
 * so the browser's hydration matches the prerendered HTML even days later; right
 * after mount it switches to the real time and re-renders.
 */
export function useNow(): number {
  const [now, setNow] = useState(buildNow);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  return now;
}
