import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { NYC_META, NYC_PATH, nycAfterSchoolByBorough, nycFeatured } from "@/lib/nyc";
import { detailFor } from "@/data/opportunityDetails";
import { REMOTE_META, REMOTE_PATH, remoteOpportunities } from "@/lib/remote";
import { DEADLINES_META, DEADLINES_PATH, deadlineBuckets } from "@/lib/deadlines";
import { GUIDE_ARTICLES, LAW_GUIDE_FAQS } from "@/data/guides";
import { CATEGORY_PAGE_SIZE, INDEX_ALLOWLIST, QUALITY_THRESHOLD } from "@/config/seo";
import { qualityScore } from "@/lib/quality";
import { schoolCycle, upcomingSummer } from "@/lib/seasons";
import { gradesLabel, formatDay, isNationwide } from "@/lib/opportunityFacts";
import { applySort } from "@/lib/filterSort";

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
  /** Paginated series: paths of the neighbouring pages, emitted as rel="prev"/"next". */
  prev?: string;
  next?: string;
}

/**
 * One step of a breadcrumb trail. The visible <Breadcrumbs> on a page and its
 * BreadcrumbList JSON-LD are both built from the same array, so the two cannot
 * disagree.
 */
export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

const HOME_CRUMB: Crumb = { name: "Home", path: "/" };

/** "Academic competitions for high school students" -> "Academic competitions". */
export function categoryShortName(slug: CategorySlug): string {
  return CATEGORY_META[slug].h1.replace(/\s+for high school students$/i, "");
}

export function categoryCrumbs(slug: CategorySlug): Crumb[] {
  return [HOME_CRUMB, { name: categoryShortName(slug), path: `/categories/${slug}` }];
}

export function opportunityCrumbs(opp: Opportunity): Crumb[] {
  const slug = CATEGORY_SLUGS.find((s) => CATEGORY_META[s].category === opp.category);
  return [
    HOME_CRUMB,
    ...(slug ? [{ name: categoryShortName(slug), path: `/categories/${slug}` }] : []),
    { name: opp.title, path: opportunityPath(opp.id) },
  ];
}

export function pageCrumbs(name: string, path: string): Crumb[] {
  return [HOME_CRUMB, { name, path }];
}

/** Breadcrumb names for the guides (no /guides index page exists, so Home is the parent). */
export const GUIDE_CRUMB_NAMES: Record<string, string> = {
  "/guides/top-medical-internships": "Best medical internships",
  "/guides/top-research-competitions": "Best research competitions",
  "/guides/top-business-summer-programs": "Best business summer programs",
  "/guides/high-school-law-internships": "High school law internships",
};

export function guideCrumbs(path: string): Crumb[] {
  return pageCrumbs(GUIDE_CRUMB_NAMES[path] ?? "Guide", path);
}

/** Article + BreadcrumbList (+ FAQPage where the guide shows FAQs) for a guide. */
function guideJsonLd(path: string): Record<string, unknown>[] {
  const a = GUIDE_ARTICLES[path];
  const faqs = path === "/guides/high-school-law-internships" ? LAW_GUIDE_FAQS : [];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.headline,
      description: a.description,
      datePublished: a.datePublished,
      dateModified: a.dateModified,
      author: { "@type": "Organization", name: "High School Opportunity", url: `${SITE_URL}/` },
      publisher: { "@type": "Organization", name: "High School Opportunity", logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-touch-icon.png` } },
      mainEntityOfPage: `${SITE_URL}${path}`,
    },
    breadcrumbJsonLd(guideCrumbs(path)),
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];
}

/** Google truncates descriptions around 160 chars; keep them under that. */
function clampDescription(raw: string, limit = 155): string {
  return raw.length > limit ? `${raw.slice(0, limit - 3)}…` : raw;
}

/**
 * Indexing gate for opportunity pages. Hard gates first: core fields present,
 * a working direct link, not flagged for manual review. Then the page-quality
 * score (src/lib/quality.ts) must reach QUALITY_THRESHOLD (src/config/seo.ts),
 * unless the page is on INDEX_ALLOWLIST. Bulk imports (NYC DYCD rows) go through
 * the same score as everything else rather than being excluded by id. A page
 * that fails is served noindex,follow and left out of the sitemap; it stays live
 * and its links still count. Memoised: the prerender asks once per page and per link.
 */
const indexableCache = new Map<string, boolean>();

export function isOpportunityIndexable(opp: Opportunity): boolean {
  const cached = indexableCache.get(opp.id);
  if (cached !== undefined) return cached;
  const hasCoreFields = !!(opp.title && opp.org && opp.location && opp.blurb);
  const linkOk =
    !!opp.url && opp.url.startsWith("http") && opp.url !== "#" && opp.link_quality !== "broken";
  const result =
    hasCoreFields &&
    linkOk &&
    opp.requiresReview !== true &&
    (INDEX_ALLOWLIST.has(opp.id) || qualityScore(opp).score >= QUALITY_THRESHOLD);
  indexableCache.set(opp.id, result);
  return result;
}

export function opportunityPath(id: string): string {
  return `/opportunities/${id}`;
}

/**
 * Programme names repeat across the catalogue: seven listings are called "High
 * School Internship Program" and three are called "Teen Council". Titled by name
 * alone they become duplicate <title>s, which is one of the few things Search
 * Console flags outright and which makes the results page useless to a reader
 * who cannot tell the Cleveland Clinic one from the Scripps one.
 *
 * Computed once from the catalogue rather than hand-maintained, so a new listing
 * that collides is disambiguated automatically.
 */
const DUPLICATE_TITLES: ReadonlySet<string> = (() => {
  const seen = new Map<string, number>();
  for (const o of allOpportunities) seen.set(o.title, (seen.get(o.title) ?? 0) + 1);
  return new Set([...seen.entries()].filter(([, n]) => n > 1).map(([t]) => t));
})();

/** Titles past this length get cut in results; the templates step down to fit. */
const TITLE_MAX = 60;

/**
 * The year a listing's title names: the year of its upcoming deadline when one
 * is posted, otherwise the current school cycle ("2026-27"). Never a guess about
 * the program's own dates.
 */
function titleYear(opp: Opportunity, now = new Date()): string {
  const today = now.toISOString().slice(0, 10);
  if (opp.deadline && opp.deadline >= today) return opp.deadline.slice(0, 4);
  return schoolCycle(now);
}

/**
 * "{Program} {Year} - Deadline, Eligibility & Cost | HSO", stepping down to
 * shorter suffixes when the program name is long, and to the bare name when
 * even "{Program} | HSO" is over the limit (a cut name is worse than a long one).
 */
export function opportunityTitle(opp: Opportunity): string {
  const name = DUPLICATE_TITLES.has(opp.title) ? `${opp.title} - ${opp.org}` : opp.title;
  const year = titleYear(opp);
  const candidates = [
    `${name} ${year} - Deadline, Eligibility & Cost | HSO`,
    `${name} ${year}: Deadline & Eligibility | HSO`,
    `${name} ${year} - Deadline & Cost | HSO`,
    `${name} ${year} Deadline | HSO`,
    `${name} ${year} | HSO`,
    `${name} | HSO`,
  ];
  return candidates.find((t) => t.length <= TITLE_MAX) ?? candidates[candidates.length - 1];
}

/** Built from the real deadline, grades and cost; unknown values say so. */
export function opportunityDescription(opp: Opportunity, now = new Date()): string {
  const today = now.toISOString().slice(0, 10);
  const deadline = opp.opensAt && opp.opensAt > today
    ? `Opens ${formatDay(opp.opensAt)}`
    : !opp.deadline
      ? "Deadline TBA"
      : opp.deadline < today
        ? `Closed for this cycle (was ${formatDay(opp.deadline)})`
        : `Deadline ${formatDay(opp.deadline)}`;
  const cost = opp.cost === "Free" ? "Free" : opp.cost === "Stipend" ? "Paid/stipend" : "Tuition-based";
  const grades = gradesLabel(opp.grades);
  const where = isNationwide(opp) ? (opp.format === "Online" ? "online" : "nationwide") : opp.location.replace(/,\s*USA$/i, "");
  const facts = [deadline, cost, grades ? grades.replace(/^g/, "G") : "", where].filter(Boolean).join(". ");
  return clampDescription(`${opp.title} by ${opp.org}. ${facts}. Eligibility and the official link.`, 155);
}

export function opportunityMeta(opp: Opportunity): PageMeta {
  const url = `${SITE_URL}${opportunityPath(opp.id)}`;
  const detail = detailFor(opp.id);

  return {
    title: opportunityTitle(opp),
    description: opportunityDescription(opp),
    path: opportunityPath(opp.id),
    noindex: !isOpportunityIndexable(opp),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: opp.title,
        description: opp.blurb,
        url,
        sameAs: opp.url,
        provider: { "@type": "Organization", name: opp.org },
        educationalProgramMode: opp.format === "In-person" ? "in-person" : opp.format.toLowerCase(),
        educationalLevel: "High school",
        ...(opp.deadline ? { applicationDeadline: opp.deadline } : {}),
        ...(opp.opensAt ? { applicationStartDate: opp.opensAt } : {}),
        ...(isNationwide(opp) ? {} : { location: { "@type": "Place", name: opp.location } }),
        // Only a known price: "Free" is one. Paid listings carry no amount, so no offer.
        ...(opp.cost === "Free"
          ? { offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" } }
          : {}),
      },
      breadcrumbJsonLd(opportunityCrumbs(opp)),
      // FAQ schema only where the questions are actually on the page. Google
      // treats FAQPage markup for questions a visitor cannot see as a violation.
      ...(detail?.faqs?.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: detail.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * Category titles lead with the phrase students search ("competitions for high
 * school students") and name the current cycle, computed from the date.
 */
export function categoryTitle(slug: CategorySlug, now = new Date()): string {
  const cycle = schoolCycle(now);
  switch (slug) {
    case "summer-programs":
      return `Summer Programs for High School Students ${upcomingSummer(now)} | HSO`;
    case "competitions":
      return `Competitions for High School Students ${cycle} | HSO`;
    case "internships":
      return `Internships for High School Students ${cycle} | HSO`;
    case "scholarships":
      return `Scholarships for High School Students ${cycle} | HSO`;
    case "research":
      return `Research Programs for High School Students ${cycle} | HSO`;
    case "fellowships":
      return `Fellowships for High School Students ${cycle} | HSO`;
  }
}

/** Real counts from the listings on the page, never typed in. */
function categoryDescription(slug: CategorySlug, list: Opportunity[]): string {
  const n = list.length;
  const free = list.filter((o) => o.cost === "Free").length;
  const stipend = list.filter((o) => o.cost === "Stipend").length;
  switch (slug) {
    case "summer-programs":
      return clampDescription(`${n} summer programs for high school students: ${free} free and ${stipend} that pay a stipend. Pre-college, research and STEM, deadlines checked.`, 155);
    case "competitions":
      return clampDescription(`${n} competitions for high school students in ${schoolCycle()}: math, science, research, writing and business. ${free} are free to enter. Deadlines checked.`, 155);
    case "internships":
      return clampDescription(`${n} internships for high school students at companies, labs, hospitals and agencies; ${stipend} are paid. Eligibility and deadlines checked.`, 155);
    case "scholarships":
      return clampDescription(`${n} scholarships for high school students, from national awards to state and local ones, with eligibility and deadlines checked on official pages.`, 155);
    case "research":
      return clampDescription(`${n} research programs for high school students at universities and labs; ${free} free and ${stipend} paid. Eligibility and deadlines checked.`, 155);
    case "fellowships":
      return clampDescription(`${n} fellowships for high school students in leadership, policy, the arts and STEM; ${free} free and ${stipend} paid. Deadlines checked.`, 155);
  }
}

/** Every listing in a category, in the order the category page shows them. */
export function categoryListings(slug: CategorySlug): Opportunity[] {
  const category = CATEGORY_META[slug].category;
  const list = allOpportunities.filter((o) => o.category === category);
  const order = new Map(allOpportunities.map((o, i) => [o.id, i]));
  return applySort(list, "recommended", order);
}

export function categoryPageCount(slug: CategorySlug): number {
  const n = allOpportunities.filter((o) => o.category === CATEGORY_META[slug].category).length;
  return Math.max(1, Math.ceil(n / CATEGORY_PAGE_SIZE));
}

/** Page 1 is the bare category URL; there is no /page/1. */
export function categoryPagePath(slug: CategorySlug, page: number): string {
  return page <= 1 ? `/categories/${slug}` : `/categories/${slug}/page/${page}`;
}

export function categoryMeta(slug: CategorySlug, page = 1): PageMeta {
  const meta = CATEGORY_META[slug];
  const path = categoryPagePath(slug, page);
  const url = `${SITE_URL}${path}`;
  const list = categoryListings(slug);
  const pages = categoryPageCount(slug);
  const baseDescription = categoryDescription(slug, list);
  const onPage = list.slice((page - 1) * CATEGORY_PAGE_SIZE, page * CATEGORY_PAGE_SIZE);
  const first = page === 1;

  // Later pages are their own canonical URLs (each lists different programs), so
  // they need their own title and description rather than page 1's copies.
  const title = first ? categoryTitle(slug) : `${categoryShortName(slug)} for high schoolers, page ${page} | HSO`;
  const description = first
    ? baseDescription
    : clampDescription(
        `Page ${page} of ${pages}: ${meta.h1.toLowerCase()} ${(page - 1) * CATEGORY_PAGE_SIZE + 1}-${(page - 1) * CATEGORY_PAGE_SIZE + onPage.length} of ${list.length}, including ${onPage
          .slice(0, 3)
          .map((o) => o.title)
          .join(", ")}.`,
      );

  return {
    title,
    description,
    path,
    ...(page > 1 ? { prev: categoryPagePath(slug, page - 1) } : {}),
    ...(page < pages ? { next: categoryPagePath(slug, page + 1) } : {}),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: first ? meta.h1 : `${meta.h1}, page ${page}`,
        description,
        url,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: onPage.length,
          itemListElement: onPage.slice(0, 20).map((o, i) => ({
            "@type": "ListItem",
            position: (page - 1) * CATEGORY_PAGE_SIZE + i + 1,
            url: `${SITE_URL}${opportunityPath(o.id)}`,
            name: o.title,
          })),
        },
      },
      breadcrumbJsonLd(
        first
          ? categoryCrumbs(slug)
          : [...categoryCrumbs(slug), { name: `Page ${page}`, path }],
      ),
      // The FAQs are only shown on page 1, so only page 1 carries their markup.
      ...(first
        ? [
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: meta.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * The deadline tracker. Like /remote this is a cross-cutting view, not a Category.
 *
 * The ItemList is a build-time snapshot of what was closing when the site was
 * built; the page recomputes on load. Rebuilding refreshes both.
 */
export function deadlinesMeta(): PageMeta {
  const url = `${SITE_URL}${DEADLINES_PATH}`;
  const closing = deadlineBuckets().flatMap((b) => (b.id === "opening-soon" ? [] : b.items));

  return {
    title: DEADLINES_META.title,
    description: DEADLINES_META.description,
    path: DEADLINES_PATH,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: DEADLINES_META.h1,
        description: DEADLINES_META.description,
        url,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: closing.length,
          itemListElement: closing.slice(0, 25).map((o, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}${opportunityPath(o.id)}`,
            name: o.title,
          })),
        },
      },
      breadcrumbJsonLd(pageCrumbs(DEADLINES_META.h1, DEADLINES_PATH)),
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: DEADLINES_META.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/**
 * The cross-category remote / nationwide view. Not a Category — see lib/remote.ts.
 */
export function remoteMeta(): PageMeta {
  const url = `${SITE_URL}${REMOTE_PATH}`;
  const list = remoteOpportunities();

  return {
    title: REMOTE_META.title,
    description: REMOTE_META.description,
    path: REMOTE_PATH,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: REMOTE_META.h1,
        description: REMOTE_META.description,
        url,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: list.length,
          itemListElement: list.slice(0, 20).map((o, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}${opportunityPath(o.id)}`,
            name: o.title,
          })),
        },
      },
      breadcrumbJsonLd(pageCrumbs(REMOTE_META.h1, REMOTE_PATH)),
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: REMOTE_META.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/**
 * Metadata for routes whose React components set their own <head> via useSEO.
 * Mirrored here so the prerenderer emits the same tags; the values must stay
 * in sync with the corresponding page component.
 */
export const LINKEDIN_URL = "https://www.linkedin.com/company/highschoolopportunity";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** The brand, as Google should know it: "High School Opportunity", also called "HSO". */
export const ORGANIZATION_JSON_LD: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "High School Opportunity",
  alternateName: "HSO",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  description:
    "A free, student-run directory of internships, summer programs, scholarships, research programs and competitions for U.S. high school students.",
  sameAs: [LINKEDIN_URL],
};

/** Head for the 404 page and the in-app "not found" view. */
export const NOT_FOUND_META: PageMeta = {
  path: "/404",
  title: "Page not found | HSO",
  description:
    "That page is not part of the HSO catalogue. Browse internships, summer programs, competitions, scholarships and research for high school students.",
  noindex: true,
};

/** A user's shared collection: user-made, so kept out of the index. */
export function sharedCollectionMeta(id: string, title?: string, description?: string): PageMeta {
  return {
    path: `/collections/${id}`,
    title: title ? `${title} - HSO Collection` : "Collection - HSO",
    description: clampDescription(
      description || "A curated HSO list of high school opportunities: internships, research, scholarships, competitions and summer programs.",
      155,
    ),
    noindex: true,
  };
}

export const STATIC_PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "High School Opportunity (HSO) - Internships, Programs & Scholarships",
    description: `Find ${(Math.floor(allOpportunities.length / 100) * 100).toLocaleString("en-US")}+ internships, summer programs, scholarships, research programs and competitions for U.S. high school students. Free, deadlines checked.`,
    path: "/",
    jsonLd: [
      ORGANIZATION_JSON_LD,
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
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
        mainEntity: ORGANIZATION_JSON_LD,
      },
      breadcrumbJsonLd(pageCrumbs("About", "/about")),
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
      "Three unpaid, remote internships on HSO's student team: finding and checking opportunities, running social, and getting schools on board.",
    path: "/volunteer",
  },
  "/collections": {
    title: "Curated Collections | HSO",
    description:
      "Curated HSO collections of U.S. high school opportunities grouped by career path, field, and application season.",
    path: "/collections",
  },
  "/guides/top-medical-internships": {
    title: "Best Medical Internships for High School Students 2026 | HSO",
    description:
      "Compare top U.S. medical internships for high schoolers: JHIBS, Stanford SIMR, NIH HiSTEP, Rockefeller SSRP. Selectivity, stipends, deadlines.",
    path: "/guides/top-medical-internships",
    jsonLd: guideJsonLd("/guides/top-medical-internships"),
  },
  "/guides/top-research-competitions": {
    title: "Best Research Competitions for High Schoolers 2026 | HSO",
    description:
      "Compare top U.S. research competitions for high schoolers: Regeneron STS, ISEF, JSHS, Davidson Fellows. Prizes, selectivity, deadlines.",
    path: "/guides/top-research-competitions",
    jsonLd: guideJsonLd("/guides/top-research-competitions"),
  },
  "/guides/top-business-summer-programs": {
    title: "Best Business Summer Programs for High Schoolers 2026 | HSO",
    description:
      "Wharton Global Youth vs. Berkeley Haas B-BAY and NYU Stern: tuition, selectivity and grade levels for top U.S. business summer programs.",
    path: "/guides/top-business-summer-programs",
    jsonLd: guideJsonLd("/guides/top-business-summer-programs"),
  },
  "/guides/high-school-law-internships": {
    title: "High School Law Internships: How to Find One | HSO",
    description:
      "Find high school law internships in the U.S.: DOJ and bar programs, pre-law academies, outreach scripts for local firms, and deadlines.",
    path: "/guides/high-school-law-internships",
    jsonLd: guideJsonLd("/guides/high-school-law-internships"),
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

/** Every URL the prerenderer and sitemap generator should emit. */
/**
 * The New York hub. Like /remote and /deadlines this is a cross-cutting view
 * rather than a Category, and it is the indexable home for the 578 city
 * after-school rows that are noindexed individually.
 */
export function nycMeta(): PageMeta {
  const url = `${SITE_URL}${NYC_PATH}`;
  const featured = nycFeatured();
  const afterSchool = nycAfterSchoolByBorough().reduce((n, g) => n + g.items.length, 0);

  return {
    title: NYC_META.title,
    description: NYC_META.description,
    path: NYC_PATH,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: NYC_META.h1,
        description: NYC_META.description,
        url,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: featured.length + afterSchool,
          itemListElement: featured.slice(0, 20).map((o, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}${opportunityPath(o.id)}`,
            name: o.title,
          })),
        },
      },
      breadcrumbJsonLd(pageCrumbs(NYC_META.h1, NYC_PATH)),
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: NYC_META.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function allRoutes(): PageMeta[] {
  return [
    ...Object.values(STATIC_PAGE_META),
    remoteMeta(),
    deadlinesMeta(),
    nycMeta(),
    ...CATEGORY_SLUGS.flatMap((slug) =>
      Array.from({ length: categoryPageCount(slug) }, (_, i) => categoryMeta(slug, i + 1)),
    ),
    ...allOpportunities.map((opp) => opportunityMeta(opp)),
  ];
}
