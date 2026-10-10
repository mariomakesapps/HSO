import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { NYC_META, NYC_PATH, isBulkDirectoryImport, nycAfterSchoolByBorough, nycFeatured } from "@/lib/nyc";
import { detailFor } from "@/data/opportunityDetails";
import { REMOTE_META, REMOTE_PATH, remoteOpportunities } from "@/lib/remote";
import { DEADLINES_META, DEADLINES_PATH, deadlineBuckets } from "@/lib/deadlines";
import { CATEGORY_PAGE_SIZE } from "@/config/seo";
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

/** Google truncates descriptions around 160 chars; keep them under that. */
function clampDescription(raw: string, limit = 158): string {
  return raw.length > limit ? `${raw.slice(0, limit - 3)}…` : raw;
}

/**
 * Indexing quality gate for opportunity pages: only index listings that are
 * U.S.-eligible, have a working direct link, carry complete core fields, and
 * are not flagged for manual review. Thin or broken listings are noindexed so
 * they do not dilute the site's overall quality signals.
 */
export function isOpportunityIndexable(opp: Opportunity): boolean {
  const hasCoreFields = !!(opp.title && opp.org && opp.location && opp.blurb);
  const linkOk =
    !!opp.url && opp.url.startsWith("http") && opp.url !== "#" && opp.link_quality !== "broken";
  return (
    hasCoreFields && linkOk && opp.requiresReview !== true && !isBulkDirectoryImport(opp)
  );
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

export function opportunityMeta(opp: Opportunity): PageMeta {
  const url = `${SITE_URL}${opportunityPath(opp.id)}`;
  const detail = detailFor(opp.id);
  const name = DUPLICATE_TITLES.has(opp.title) ? `${opp.title} — ${opp.org}` : opp.title;

  return {
    title: `${name} | HSO`,
    // Where a listing has verified long-form copy, its own first paragraph makes a
    // better snippet than the generated template — it describes the programme
    // rather than describing the page.
    description: clampDescription(
      detail?.body[0] ??
        `${opp.title} at ${opp.org} — ${opp.category} for high schoolers in ${opp.location}. Deadline, eligibility, cost & official link.`,
    ),
    path: opportunityPath(opp.id),
    noindex: !isOpportunityIndexable(opp),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: opp.title,
        description: opp.blurb,
        url,
        provider: { "@type": "Organization", name: opp.org },
        educationalProgramMode: opp.format,
        occupationalCategory: opp.category,
        ...(opp.deadline ? { applicationDeadline: opp.deadline } : {}),
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: opp.title,
        description: opp.blurb,
        about: opp.category,
        author: { "@type": "Organization", name: "HSO — High School Opportunity" },
        publisher: { "@type": "Organization", name: "HSO — High School Opportunity" },
        mainEntityOfPage: url,
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
 * Category descriptions carry {n} and {free} rather than a hard-coded count.
 *
 * A number in a meta description is the thing that earns the click on a listing
 * page, but a number typed into a string goes stale the moment the catalogue
 * changes. These are filled from the live list at build time instead, so the
 * snippet Google shows always matches what is actually on the page.
 */
function fillCounts(template: string, total: number, free: number): string {
  return template
    .replace(/\{n\}/g, String(total))
    .replace(/\{free\}/g, String(free));
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
  const freeCount = list.filter((o) => o.cost === "Free" || o.cost === "Stipend").length;
  const baseDescription = fillCounts(meta.description, list.length, freeCount);
  const onPage = list.slice((page - 1) * CATEGORY_PAGE_SIZE, page * CATEGORY_PAGE_SIZE);
  const first = page === 1;

  // Later pages are their own canonical URLs (each lists different programs), so
  // they need their own title and description rather than page 1's copies.
  const title = first ? meta.title : `${categoryShortName(slug)} for high schoolers, page ${page} | HSO`;
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
export const STATIC_PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "High School Internships, Scholarships & Programs | HSO",
    description:
      "Free U.S. opportunity finder for high schoolers: internships, summer programs, scholarships, research, and competitions — curated and deadline-tracked.",
    path: "/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "HSO",
        url: `${SITE_URL}/`,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  "/about": {
    title: "About HSO | High School Opportunity",
    description:
      "HSO helps high school students find U.S.-based internships, scholarships, research programs, competitions, and summer programs.",
    path: "/about",
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
      "Three unpaid internships on the student team behind HSO: finding and checking opportunities, running social, and getting schools on board. A few hours a week, remote.",
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
      "Medical internships and hospital research programs for high school students in the U.S. — eligibility, deadlines, stipends, and how to apply.",
    path: "/guides/top-medical-internships",
    jsonLd: [breadcrumbJsonLd(guideCrumbs("/guides/top-medical-internships"))],
  },
  "/guides/top-research-competitions": {
    title: "Best Research Competitions for High Schoolers 2026 | HSO",
    description:
      "The research competitions that matter for U.S. high schoolers — Regeneron STS, ISEF, Davidson, and more, with deadlines and entry requirements.",
    path: "/guides/top-research-competitions",
    jsonLd: [breadcrumbJsonLd(guideCrumbs("/guides/top-research-competitions"))],
  },
  "/guides/top-business-summer-programs": {
    title: "Best Business Summer Programs for High Schoolers 2026 | HSO",
    description:
      "Business and entrepreneurship summer programs for U.S. high school students — Wharton, LBW, Diamond Challenge, costs, and application deadlines.",
    path: "/guides/top-business-summer-programs",
    jsonLd: [breadcrumbJsonLd(guideCrumbs("/guides/top-business-summer-programs"))],
  },
  "/guides/high-school-law-internships": {
    title: "High School Law Internships: How to Find One | HSO",
    description:
      "How high school students find law internships and legal shadowing in the U.S. — courts, public defenders, legal aid, and pre-law summer programs.",
    path: "/guides/high-school-law-internships",
    jsonLd: [breadcrumbJsonLd(guideCrumbs("/guides/high-school-law-internships"))],
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
