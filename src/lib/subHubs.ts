import type { Opportunity } from "@/data/opportunities";
import type { CategorySlug } from "@/lib/categories";

/**
 * Subject sub-hubs under the category hubs (SEO plan P1-5): real pages with
 * their own URL, title, H1, intro and filtered list, for searches the broad
 * category pages rank poorly for ("stem competitions for high school students",
 * "medical internships for high school students"). Members are the indexable
 * listings that match; counts, deadlines and FAQ answers come from those
 * listings (hubStats.ts). Only add a sub-hub that has enough listings to be
 * useful: online-only internships (3) are covered by /remote instead.
 */
export interface SubHub {
  parent: CategorySlug;
  slug: string;
  /** Plural, lower case, used in sentences: "STEM competitions". */
  label: string;
  /** Title-case name for the <title>: "STEM Competitions for High School Students". */
  name: string;
  h1: string;
  intro: string[];
  match: (o: Opportunity) => boolean;
  /** A guide on the same topic, linked from the page. */
  guide?: { href: string; label: string };
}

const has = (o: Opportunity, fields: string[]) => (o.fields ?? []).some((f) => fields.includes(f));
const text = (o: Opportunity) => `${o.title} ${o.blurb}`.toLowerCase();
const STEM_FIELDS = ["STEM", "Math", "Engineering", "Computer Science", "Biology", "Physics", "Chemistry", "Astronomy", "Data Science"];
const BUSINESS_FIELDS = ["Business", "Entrepreneurship", "Finance", "Economics"];

export const SUB_HUBS: SubHub[] = [
  {
    parent: "competitions",
    slug: "stem",
    label: "STEM competitions",
    name: "STEM Competitions for High School Students",
    h1: "STEM competitions for high school students",
    intro: [
      "STEM competitions cover math, science, engineering and computer science, from school-level contests to national olympiads and science fairs. Some are taken alone in a single sitting; others are team builds that run for a whole season.",
      "Start with contests your school already registers for, then add one that matches a project or subject you are deep in. Many national competitions have a qualifying round first, so the early deadline is usually the one that matters.",
    ],
    match: (o) => o.category === "Competition" && has(o, STEM_FIELDS),
  },
  {
    parent: "competitions",
    slug: "science",
    label: "science competitions",
    name: "Science Competitions for High School Students",
    h1: "Science competitions for high school students",
    intro: [
      "Science competitions range from knowledge contests like science bowls and olympiads to research fairs where you present your own project. Biology, chemistry, physics, earth science and environmental science each have their own events.",
      "Fair-style competitions reward a long project, so they suit students already doing research. Knowledge contests reward study and practice exams, and often run through school or regional teams.",
    ],
    match: (o) => o.category === "Competition" && (has(o, ["Biology", "Chemistry", "Physics", "Astronomy", "Environment"]) || /\bscience\b/.test(text(o))),
  },
  {
    parent: "competitions",
    slug: "math",
    label: "math competitions",
    name: "Math Competitions for High School Students",
    h1: "Math competitions for high school students",
    intro: [
      "Math competitions include individual exams, team meets hosted by universities, and proof-based olympiads. Many students take a ladder of contests over the year, where a strong score on one qualifies you for the next.",
      "If you are new to contest math, begin with an exam your school offers and practice on past papers. Team meets are a good way to compete with friends and see problems you would not meet in class.",
    ],
    match: (o) => o.category === "Competition" && has(o, ["Math"]),
  },
  {
    parent: "competitions",
    slug: "research",
    label: "research competitions",
    name: "Research Competitions for High School Students",
    h1: "Research competitions for high school students",
    intro: [
      "Research competitions judge an original project: a question you investigated, your method, your results and how well you explain them. Most ask for a written paper, a poster or presentation, or both.",
      "These reward months of work, so plan backwards from the deadline. A mentor, a school research class or a summer research program is the usual way students get a project far enough along to enter.",
    ],
    // Tagged Research, or described as a research competition (fairs, symposia,
    // research papers): most science fairs are untagged state chapters.
    match: (o) =>
      o.category === "Competition" &&
      (has(o, ["Research"]) ||
        /\b(research (paper|project|competition|symposium)|original (academic )?research|science (and engineering )?fairs?|symposium)\b/i.test(
          `${o.title} ${o.blurb}`,
        )),
    guide: { href: "/guides/top-research-competitions", label: "Best research competitions, compared" },
  },
  {
    parent: "competitions",
    slug: "business-entrepreneurship",
    label: "business and entrepreneurship competitions",
    name: "Business & Entrepreneurship Competitions for High School Students",
    h1: "Business and entrepreneurship competitions for high school students",
    intro: [
      "Business competitions ask you to pitch a startup idea, write a business plan, solve a case, manage a mock investment portfolio or answer economics questions. Many are team events, and some are run through school clubs.",
      "Pitch and plan competitions reward a clear problem, a realistic customer and numbers that add up. Case and investing contests reward practice, so look at past rounds before you enter.",
    ],
    match: (o) => o.category === "Competition" && has(o, BUSINESS_FIELDS),
  },
  {
    parent: "competitions",
    slug: "writing-essay",
    label: "writing and essay competitions",
    name: "Writing & Essay Competitions for High School Students",
    h1: "Writing and essay competitions for high school students",
    intro: [
      "Writing competitions cover essays, short fiction, poetry, journalism and speeches. Most are free to enter online, judged on a single piece, and open to any high school student in the U.S.",
      "Read the prompt and word limit closely and look at past winners if they are posted. One strong, revised piece usually does better than several rushed ones, and many contests let the same student enter more than one category.",
    ],
    match: (o) => o.category === "Competition" && has(o, ["Writing"]),
  },
  {
    parent: "internships",
    slug: "medical",
    label: "medical internships",
    name: "Medical Internships for High School Students",
    h1: "Medical internships for high school students",
    intro: [
      "Medical internships for high schoolers usually mean lab research at a hospital or medical school, shadowing, or a structured program that mixes both. Direct patient care is rare at this age, so most programs focus on research and exposure to careers in medicine.",
      "Many of the strongest programs are local to the hospital or university that runs them, so check location rules first. Applications often ask for a teacher recommendation and a short essay about why you are interested in medicine.",
    ],
    match: (o) => o.category === "Internship" && (has(o, ["Medicine", "Health", "Healthcare"]) || /\b(medical|hospital|clinical|medicine)\b/.test(text(o))),
    guide: { href: "/guides/top-medical-internships", label: "Best medical internships, compared" },
  },

  {
    parent: "summer-programs",
    slug: "business",
    label: "business summer programs",
    name: "Business Summer Programs for High School Students",
    h1: "Business summer programs for high school students",
    intro: [
      "Business summer programs teach entrepreneurship, finance, marketing and leadership, usually through case studies, team projects and a final pitch. University programs often run on campus for one to four weeks.",
      "Compare length, cost and whether the program is residential. Several free and need-based options exist alongside the well-known paid university programs.",
    ],
    match: (o) => o.category === "Summer Program" && has(o, BUSINESS_FIELDS),
    guide: { href: "/guides/top-business-summer-programs", label: "Best business summer programs, compared" },
  },
  {
    parent: "summer-programs",
    slug: "free",
    label: "free summer programs",
    name: "Free Summer Programs for High School Students",
    h1: "Free summer programs for high school students",
    intro: [
      "Free summer programs charge no tuition. Some are run by universities and national labs, others by state governments, museums and nonprofits. Many of the most selective programs are free, so free does not mean easy to get into.",
      "Check what free covers: some include housing and meals, others are day programs where you pay for travel. Many free programs close in winter, months before the summer starts.",
    ],
    match: (o) => o.category === "Summer Program" && o.cost === "Free",
  },
  {
    parent: "summer-programs",
    slug: "nyc",
    label: "NYC summer programs",
    name: "NYC Summer Programs for High School Students",
    h1: "NYC summer programs for high school students",
    intro: [
      "New York City has summer programs at universities, museums, hospitals and city agencies across all five boroughs, many of them free for city students. Some are only open to students who live in or attend school in New York City.",
      "Check residency and age rules first. For after-school and city-run youth programs, see the NYC hub, which groups them by borough.",
    ],
    match: (o) => o.category === "Summer Program" && /New York, New York|Brooklyn|Bronx|Queens|Staten Island|Manhattan/.test(o.location),
  },
];

/** Guides that belong with each category hub. */
export const CATEGORY_GUIDES: Partial<Record<CategorySlug, { href: string; label: string }[]>> = {
  internships: [
    { href: "/guides/top-medical-internships", label: "Best medical internships, compared" },
    { href: "/guides/high-school-law-internships", label: "How to find a law internship" },
  ],
  competitions: [{ href: "/guides/top-research-competitions", label: "Best research competitions, compared" }],
  research: [{ href: "/guides/top-research-competitions", label: "Best research competitions, compared" }],
  "summer-programs": [{ href: "/guides/top-business-summer-programs", label: "Best business summer programs, compared" }],
};

/**
 * Sub-hubs that were retired because too few listings matched, and where their
 * URL goes now. Law internships had only about five real listings; the law
 * internships guide covers the topic properly.
 */
export const RETIRED_SUB_HUBS: Record<string, string> = {
  "/categories/internships/law": "/guides/high-school-law-internships",
};

export function subHubPath(h: Pick<SubHub, "parent" | "slug">): string {
  return `/categories/${h.parent}/${h.slug}`;
}

export function findSubHub(parent: string | undefined, slug: string | undefined): SubHub | undefined {
  return SUB_HUBS.find((h) => h.parent === parent && h.slug === slug);
}

export function subHubsFor(parent: string): SubHub[] {
  return SUB_HUBS.filter((h) => h.parent === parent);
}
