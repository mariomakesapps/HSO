import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { NYC_META, NYC_PATH, isBulkDirectoryImport, nycAfterSchoolByBorough, nycFeatured } from "@/lib/nyc";
import { detailFor } from "@/data/opportunityDetails";
import { REMOTE_META, REMOTE_PATH, remoteOpportunities } from "@/lib/remote";
import { DEADLINES_META, DEADLINES_PATH, deadlineBuckets } from "@/lib/deadlines";

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
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "HSO", item: `${SITE_URL}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: opp.category,
            item: categoryUrlForCategory(opp.category),
          },
          { "@type": "ListItem", position: 3, name: opp.title, item: url },
        ],
      },
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
 * Breadcrumbs used to point every level-2 crumb at the homepage, which told
 * Google the category step carried no distinct destination. Point it at the
 * real category page so the crumb passes internal link equity.
 */
function categoryUrlForCategory(category: Opportunity["category"]): string {
  const slug = CATEGORY_SLUGS.find((s) => CATEGORY_META[s].category === category);
  return slug ? `${SITE_URL}/categories/${slug}` : `${SITE_URL}/`;
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

export function categoryMeta(slug: CategorySlug): PageMeta {
  const meta = CATEGORY_META[slug];
  const url = `${SITE_URL}/categories/${slug}`;
  const list = allOpportunities.filter((o) => o.category === meta.category);
  const freeCount = list.filter((o) => o.cost === "Free" || o.cost === "Stipend").length;
  const description = fillCounts(meta.description, list.length, freeCount);

  return {
    title: meta.title,
    description,
    path: `/categories/${slug}`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: meta.h1,
        description,
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
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "HSO", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: meta.h1, item: url },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: meta.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
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
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "HSO", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: DEADLINES_META.h1, item: url },
        ],
      },
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
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "HSO", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: REMOTE_META.h1, item: url },
        ],
      },
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
    title: "Volunteer with HSO | High School Opportunity",
    description:
      "Three open roles on the student team behind HSO: finding and checking opportunities, running social, and getting schools on board. A few hours a week, remote.",
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
  },
  "/guides/top-research-competitions": {
    title: "Best Research Competitions for High Schoolers 2026 | HSO",
    description:
      "The research competitions that matter for U.S. high schoolers — Regeneron STS, ISEF, Davidson, and more, with deadlines and entry requirements.",
    path: "/guides/top-research-competitions",
  },
  "/guides/top-business-summer-programs": {
    title: "Best Business Summer Programs for High Schoolers 2026 | HSO",
    description:
      "Business and entrepreneurship summer programs for U.S. high school students — Wharton, LBW, Diamond Challenge, costs, and application deadlines.",
    path: "/guides/top-business-summer-programs",
  },
  "/guides/high-school-law-internships": {
    title: "High School Law Internships: How to Find One | HSO",
    description:
      "How high school students find law internships and legal shadowing in the U.S. — courts, public defenders, legal aid, and pre-law summer programs.",
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
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "HSO", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: NYC_META.h1, item: url },
        ],
      },
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
    ...CATEGORY_SLUGS.map((slug) => categoryMeta(slug)),
    ...allOpportunities.map((opp) => opportunityMeta(opp)),
  ];
}
