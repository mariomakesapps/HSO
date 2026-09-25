import { allOpportunities, type Opportunity } from "@/data/opportunities";

/**
 * Listings imported in bulk from a municipal open-data table.
 *
 * The 578 NYC DYCD rows share one boilerplate sentence ("Official NYC DYCD youth
 * opportunity listing. Program type: … Eligibility: …") and all link to the same
 * dataset, differing only by a row id. As pages they are 578 near-duplicates with
 * no unique text and no link to a program of their own, which is exactly what
 * "Crawled, currently not indexed" in Search Console is describing.
 *
 * They stay on the site and stay reachable — browse, search and the hub page below
 * all still list them — but they are kept out of the index and the sitemap so the
 * crawl budget goes to pages that can actually rank.
 *
 * This lives here rather than in pageMeta so the dependency runs one way: pageMeta
 * imports the hub, the hub imports only the catalogue.
 */
const BULK_DIRECTORY_ID_PREFIXES = ["nyc-dycd-", "sf-our415-"] as const;

export function isBulkDirectoryImport(opp: Opportunity): boolean {
  return BULK_DIRECTORY_ID_PREFIXES.some((p) => opp.id.startsWith(p));
}

/**
 * The New York City hub.
 *
 * Two different things live under "NYC" in this catalogue and they deserve very
 * different treatment:
 *
 *  - 578 rows imported from the city's DYCD after-school table. Every one shares
 *    the same boilerplate sentence and links to the same dataset, so each is a
 *    near-duplicate of the other 577 and none of them can rank. They are
 *    noindexed individually (see isBulkDirectoryImport) and surfaced here instead,
 *    grouped by borough, which is the form a student can actually use.
 *  - Real New York programmes — museum teen councils, hospital internships,
 *    library and lab placements — which each have their own page worth indexing.
 *
 * This page is the one indexable home for the first group and a genuine landing
 * page for "nyc programs for high school students", which the category pages were
 * never going to win on their own.
 */
export const NYC_PATH = "/nyc-programs-for-high-school-students";

const BOROUGHS = ["Manhattan", "Brooklyn", "Bronx", "Queens", "Staten Island"] as const;
export type Borough = (typeof BOROUGHS)[number];

function isNewYork(o: Opportunity): boolean {
  return /New York|Manhattan|Brooklyn|Bronx|Queens|Staten Island/i.test(o.location);
}

/** Every New York listing, city-feed or not. */
export function nycOpportunities(): Opportunity[] {
  return allOpportunities.filter(isNewYork);
}

/** The New York programmes that have a page of their own worth reading. */
export function nycFeatured(): Opportunity[] {
  return nycOpportunities()
    .filter((o) => !isBulkDirectoryImport(o))
    .sort((a, b) => (b.prestige ?? 0) - (a.prestige ?? 0) || a.title.localeCompare(b.title));
}

/** The city after-school feed, grouped by borough. "Brookyn" is a typo in the source data. */
export function nycAfterSchoolByBorough(): { borough: Borough; items: Opportunity[] }[] {
  const feed = nycOpportunities().filter(isBulkDirectoryImport);
  return BOROUGHS.map((borough) => {
    const needle = borough === "Brooklyn" ? /Brook?lyn/i : new RegExp(borough, "i");
    return {
      borough,
      items: feed
        .filter((o) => needle.test(o.location))
        .sort((a, b) => a.title.localeCompare(b.title)),
    };
  }).filter((g) => g.items.length > 0);
}

export const NYC_META = {
  h1: "Programs for high school students in New York City",
  title: "NYC Programs for High School Students 2027 (Free and Paid) | HSO",
  description:
    "Internships, summer programs, museum teen councils and free after-school programs for high school students across Manhattan, Brooklyn, the Bronx, Queens and Staten Island.",
  intro:
    "Everything in the catalogue that runs in New York City, in one place: paid internships and selective summer programs with their own application pages, plus the city's free after-school programs grouped by borough.",
  guide: [
    "Start with the programs that have their own application. Museum teen councils (the Met, the Brooklyn Museum, MoMA, the Bronx Museum), hospital and lab placements, and library internships all run their own selection process and most pay a stipend.",
    "The borough lists below come from the New York City Department of Youth and Community Development's after-school table. They are free and open to a wide age range rather than high-school specific, so treat them as a place to look locally rather than a competitive application.",
    "New York deadlines cluster in the autumn for spring programs and in the late winter for summer ones. The deadline tracker lists every dated program in the catalogue, New York or not.",
  ],
  faqs: [
    {
      q: "What free programs are there for high school students in NYC?",
      a: "The city's DYCD after-school programs are free and run in all five boroughs; they are listed by borough on this page. Several selective programs are also free and pay a stipend, including museum teen councils and library internships.",
    },
    {
      q: "Do NYC high school internships pay?",
      a: "Many do. Museum teen councils, the New York Public Library and Brooklyn Public Library programs, and hospital and research placements commonly pay a stipend. Each listing states the cost or stipend where the official page gives one.",
    },
    {
      q: "When do NYC program applications close?",
      a: "Autumn for spring and school-year programs, and January to March for summer programs. Every listing with a confirmed date is on the deadline tracker, which groups programs by what closes next.",
    },
    {
      q: "Are these programs only for New York City students?",
      a: "The city after-school programs are for New York City residents. The selective programs vary — some are open to any student who can travel to the site, and the eligibility is given on each listing.",
    },
  ],
};
