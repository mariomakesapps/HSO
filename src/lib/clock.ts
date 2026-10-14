import { useSyncExternalStore } from "react";

/**
 * The one clock every time-dependent label reads ("Closing soon - 12d", which
 * listings are in "Closing this week", the year in the footer).
 *
 * Pages are prerendered at build time and hydrated in the browser days later, in
 * the visitor's time zone. Reading Date.now() directly made the browser's first
 * render disagree with the prerendered HTML on almost every visit — React then
 * threw the server markup away and rebuilt the page (hydration errors 418/425).
 *
 * So the clock is frozen at the build time while the server renders and while the
 * browser hydrates, and day boundaries are read in UTC in that mode, so both sides
 * compute exactly the same text. After hydration App releases it, and every
 * component that called useClock() re-renders once with the visitor's real time
 * and time zone.
 */

let frozenAt: number | null = null;
const listeners = new Set<() => void>();

/** Current time in ms: the frozen build time during SSR and hydration, otherwise real time. */
export function now(): number {
  return frozenAt ?? Date.now();
}

export function nowDate(): Date {
  return new Date(now());
}

/** Freeze at `at` (build time). Called by the server render and before hydrateRoot. */
export function freezeClock(at: number): void {
  frozenAt = at;
}

/** Switch to real time and re-render every subscriber. Called once hydration has committed. */
export function releaseClock(): void {
  if (frozenAt === null) return;
  frozenAt = null;
  for (const listener of listeners) listener();
}

/**
 * Start or end of a catalogue day ("2026-12-11") in ms. Local time for a visitor,
 * so a deadline runs to the end of their own day; UTC while frozen, so the server
 * and the hydrating browser agree whatever the visitor's time zone.
 */
export function dayEdge(iso: string, edge: "start" | "end"): number {
  const stamp = `${iso}T${edge === "end" ? "23:59:59" : "00:00:00"}`;
  return frozenAt === null ? new Date(stamp).getTime() : Date.parse(`${stamp}Z`);
}

/** Calendar year now, in the same mode as dayEdge. */
export function currentYear(): number {
  const d = nowDate();
  return frozenAt === null ? d.getFullYear() : d.getUTCFullYear();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Re-render when the clock is released. Returns 0 while frozen and 1 after, so it
 * also works as a useMemo dependency for anything computed from the time.
 * During hydration React uses the server snapshot (0), so it never mismatches.
 */
export function useClock(): number {
  return useSyncExternalStore(subscribe, () => (frozenAt === null ? 1 : 0), () => 0);
}
