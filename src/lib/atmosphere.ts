import { useEffect } from "react";

/**
 * Colour-coding for the ambient backdrop.
 *
 * Each part of the catalog carries its own colour, and the backdrop shifts to
 * match as you move through the site — competitions sit under coral, research
 * under sage, scholarships under gold. It is the same accent language the cards
 * and chips already use, extended to the whole page so the surroundings tell
 * you where you are before you read a heading.
 *
 * The theme is published as a `data-atmo` attribute on <html> rather than
 * passed through React. That keeps the always-loaded shell free of the 1.7MB
 * opportunities chunk (a page that already has the data just names its theme),
 * and it means the correct colour is in place on the prerendered HTML too.
 */
export type AtmosphereTheme =
  | "default"
  | "research"
  | "internships"
  | "competitions"
  | "summer-programs"
  | "scholarships"
  | "fellowships"
  | "remote"
  | "collections";

/** Opportunity categories map onto the same themes as the category pages. */
const CATEGORY_THEME: Record<string, AtmosphereTheme> = {
  Research: "research",
  Internship: "internships",
  Competition: "competitions",
  "Summer Program": "summer-programs",
  Scholarship: "scholarships",
  Fellowship: "fellowships",
  Volunteer: "research",
};

export function themeForCategory(category: string): AtmosphereTheme {
  return CATEGORY_THEME[category] ?? "default";
}

/**
 * Sets the page's backdrop theme for as long as the component is mounted,
 * restoring the previous one on unmount so a route change never leaves a
 * stale colour behind.
 */
export function useAtmosphere(theme: AtmosphereTheme) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.atmo;
    root.dataset.atmo = theme;
    return () => {
      if (previous) root.dataset.atmo = previous;
      else delete root.dataset.atmo;
    };
  }, [theme]);
}
