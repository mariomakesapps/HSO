/**
 * <head> metadata for the site's fixed pages (home, about, donate, legal, guides...).
 *
 * Kept apart from pageMeta.ts, which imports the whole opportunity catalogue: pages
 * like /about and /donate only need these few objects, and importing them from
 * pageMeta made every one of those pages download and parse the full catalogue
 * (several MB of JavaScript) first. pageMeta re-exports everything here, so
 * existing imports and the prerenderer keep working. No catalogue imports here.
 */
import { DONATE_URL, SPONSOR_EMAIL } from "@/lib/support";
import { SOCIAL_LINKS } from "@/lib/siteLinks";

export const SITE_URL = "https://highschoolopportunity.org";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * Single source of truth for per-route <head> metadata.
 *
 * Both the React pages (via <SEO />) and the build-time prerenderer
 * (scripts/prerender.mjs) read from here, so the HTML Googlebot receives
 * before it runs any JavaScript is byte-identical to what React renders
 * afterwards. Any divergence between the two is a ranking risk, so keep
 * this module free of browser-only APIs — it has to run in Node too.
 */
export interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  /** Date the page's content last really changed (sitemap <lastmod>). Set in allRoutes(). */
  lastmod?: string;
}

/** Questions on /donate, shared by the page and its FAQPage structured data. */
export const DONATE_FAQS: { q: string; a: string }[] = [
  {
    q: "Is my donation tax-deductible?",
    a: "HSO is fiscally sponsored by The Hack Foundation (Hack Club), a 501(c)(3) nonprofit with EIN 81-2908499. Donations made through HCB are tax-deductible to the extent allowed by law, and HCB emails a receipt. Check with a tax advisor about your own situation.",
  },
  {
    q: "Do sponsors affect which opportunities HSO lists?",
    a: "No. Sponsors are thanked on this page, but no one can pay for a listing, a higher spot in search results, or a better review. Every opportunity is listed and checked by the same rules.",
  },
  {
    q: "Can I donate without being listed?",
    a: "Yes. Supporters are only named on this page if they ask to be.",
  },
  {
    q: "How do I become a sponsor?",
    a: `Donate any amount through HCB, then email ${SPONSOR_EMAIL} with the name, logo and link you would like listed. You can also email first to talk it through.`,
  },
];

/**
 * Who runs the site, for search engines: ties "High School Opportunity" and
 * "HSO" to this domain (brand searches rank it at 2.7-3.4). sameAs lists the
 * official social profiles from SOCIAL_LINKS; add new ones there.
 */
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const ORGANIZATION: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "High School Opportunity",
  alternateName: "HSO",
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-touch-icon.png`, width: 180, height: 180 },
  description:
    "A free directory of internships, summer programs, scholarships, research programs and competitions for U.S. high school students.",
  sameAs: SOCIAL_LINKS.map((s) => s.href),
};

/**
 * Metadata for routes whose React components set their own <head> via useSEO.
 * Mirrored here so the prerenderer emits the same tags; the values must stay
 * in sync with the corresponding page component.
 */
export const STATIC_PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "High School Opportunity (HSO) - Internships, Programs & Scholarships",
    description:
      "Find 2,400+ internships, summer programs, scholarships, research programs and competitions for U.S. high school students. Free, deadlines checked.",
    path: "/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "High School Opportunity",
        alternateName: "HSO",
        url: `${SITE_URL}/`,
        publisher: { "@id": ORGANIZATION_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      ORGANIZATION,
    ],
  },
  "/about": {
    title: "About High School Opportunity (HSO) | HSO",
    description:
      "HSO is a free, student-run directory of internships, summer programs, scholarships and competitions for U.S. high schoolers, and how we check listings.",
    path: "/about",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About High School Opportunity (HSO)",
        url: `${SITE_URL}/about`,
        mainEntity: { "@id": ORGANIZATION_ID },
      },
      ORGANIZATION,
    ],
  },
  "/contact": {
    title: "Contact HSO | High School Opportunity",
    description:
      "Report an outdated deadline, broken link, or missing opportunity, or get in touch with the HSO team.",
    path: "/contact",
  },
  "/privacy": {
    title: "Privacy Policy | HSO",
    description:
      "How HSO handles accounts, saved favorites, collections, and sign-in data for high school students.",
    path: "/privacy",
  },
  "/terms": {
    title: "Terms of Use | HSO",
    description:
      "Terms of use for HSO. Always confirm program details on the official opportunity websites we link to.",
    path: "/terms",
  },
  "/submit": {
    title: "Submit an Opportunity | HSO",
    description:
      "Suggest a U.S.-based high school opportunity for HSO's curated directory of internships, scholarships, research, and summer programs.",
    path: "/submit",
  },
  "/volunteer": {
    title: "HSO Internships (Unpaid) | High School Opportunity",
    description:
      "Three unpaid, remote internships on the student team behind HSO: finding and checking opportunities, running social, and outreach to schools and sponsors.",
    path: "/volunteer",
  },
  "/donate": {
    title: "Donate to or Sponsor High School Opportunity (HSO)",
    description:
      "Support HSO, the free student-run directory of high school opportunities. Donate through HCB by Hack Club (501(c)(3)) or sponsor HSO and be listed here.",
    path: "/donate",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Donate to or Sponsor High School Opportunity (HSO)",
        url: `${SITE_URL}/donate`,
        about: { "@id": ORGANIZATION_ID },
        potentialAction: {
          "@type": "DonateAction",
          target: DONATE_URL,
          recipient: { "@id": ORGANIZATION_ID },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: DONATE_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      ORGANIZATION,
    ],
  },
  "/collections": {
    title: "Curated Collections of High School Opportunities | HSO",
    description:
      "Curated HSO collections of U.S. high school opportunities grouped by career path, field, and application season.",
    path: "/collections",
  },
  "/guides/top-medical-internships": {
    title: "Best Medical Internships for High School Students 2026 | HSO",
    description:
      "Compare top U.S. medical internships for high schoolers: JHIBS, Stanford SIMR, NIH HiSTEP, Rockefeller SSRP. Selectivity, stipends, deadlines.",
    path: "/guides/top-medical-internships",
  },
  "/guides/top-research-competitions": {
    title: "Best Research Competitions for High Schoolers 2026 | HSO",
    description:
      "Compare top U.S. research competitions for high schoolers: Regeneron STS, ISEF, JSHS, Davidson Fellows. Prizes, selectivity, deadlines.",
    path: "/guides/top-research-competitions",
  },
  "/guides/top-business-summer-programs": {
    title: "Best Business Summer Programs for High Schoolers 2026 | HSO",
    description:
      "Wharton Global Youth vs. Berkeley Haas B-BAY and NYU Stern: tuition, selectivity and grade levels for top U.S. business summer programs.",
    path: "/guides/top-business-summer-programs",
  },
  "/guides/high-school-law-internships": {
    title: "High School Law Internships: How to Find One | HSO",
    description:
      "Find high school law internships in the U.S.: DOJ and bar programs, pre-law academies, outreach scripts for local firms, and deadlines.",
    path: "/guides/high-school-law-internships",
  },
  // Account-only surfaces: useful to users, worthless to search, and they
  // would otherwise be crawled as near-duplicate shells.
  "/auth": {
    title: "Sign In to HSO",
    description: "Sign in or create a free HSO account to save opportunities and build collections.",
    path: "/auth",
    noindex: true,
  },
  "/profile": {
    title: "Your HSO Profile — Saved Opportunities",
    description: "Your saved HSO opportunities, collections, and reminder preferences.",
    path: "/profile",
    noindex: true,
  },
  "/unsubscribe": {
    title: "Unsubscribe — HSO",
    description: "Manage or cancel HSO deadline reminder emails.",
    path: "/unsubscribe",
    noindex: true,
  },
};
