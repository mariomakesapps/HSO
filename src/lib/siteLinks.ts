/**
 * Hub and guide links shown on every page (site footer, prerendered HTML and the
 * not-found page). One list so the app and the prerendered HTML always link to
 * the same hubs. Category hubs come from CATEGORY_SLUGS, not from here.
 */
export interface SiteLink {
  href: string;
  label: string;
}

export const HUB_LINKS: SiteLink[] = [
  { href: "/deadlines", label: "Deadlines closing soon" },
  { href: "/remote", label: "Remote & nationwide" },
  { href: "/nyc-programs-for-high-school-students", label: "NYC programs" },
  { href: "/collections", label: "Collections" },
];

export const GUIDE_LINKS: SiteLink[] = [
  { href: "/guides/top-medical-internships", label: "Best medical internships" },
  { href: "/guides/top-research-competitions", label: "Best research competitions" },
  { href: "/guides/top-business-summer-programs", label: "Best business summer programs" },
  { href: "/guides/high-school-law-internships", label: "High school law internships" },
];

/**
 * HSO's official social profiles: the "Follow us" buttons in the site footer and
 * the Organization's sameAs in structured data. Clean URLs only (no tracking params).
 */
export interface SocialLink extends SiteLink {
  network: "instagram" | "linkedin";
}

export const SOCIAL_LINKS: SocialLink[] = [
  { network: "instagram", href: "https://www.instagram.com/highschoolopportunity/", label: "Instagram" },
  { network: "linkedin", href: "https://www.linkedin.com/company/highschoolopportunity", label: "LinkedIn" },
];
