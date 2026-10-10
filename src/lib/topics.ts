import { allOpportunities, type Opportunity } from "@/data/opportunities";
import type { CategorySlug } from "@/lib/categories";
import { isOpportunityIndexable } from "@/lib/indexable";
import { applySort } from "@/lib/filterSort";

/**
 * Topic landing pages under a category: /categories/<category>/<topic>.
 *
 * Each one is a filter over the real catalogue. A topic is only published when
 * at least MIN_TOPIC_LISTINGS indexable listings match, so there are no thin
 * pages; the count, the list and the FAQ answers all come from the data.
 * Only indexable listings are shown, so a topic page links to pages that can rank.
 */
export const MIN_TOPIC_LISTINGS = 10;

export interface Topic {
  parent: CategorySlug;
  slug: string;
  /** Lower-case phrase used in sentences: "STEM competitions". */
  phrase: string;
  /** Title-case phrase used in titles: "STEM Competitions". */
  titlePhrase: string;
  /** What this page covers and how to use it. Describes the list; makes no claim about any one program. */
  intro: string;
  /** A related page that should not compete with this one (the guide it complements). */
  companion?: { path: string; label: string };
  match: (o: Opportunity) => boolean;
}

const has = (o: Opportunity, ...fields: string[]) => o.fields.some((f) => fields.includes(f));
const says = (o: Opportunity, re: RegExp) => re.test(`${o.title} ${o.blurb}`);

const NYC_LOCATION = /\b(new york city|nyc|manhattan|brooklyn|bronx|queens|staten island|harlem)\b|^new york, new york, usa$/i;

export const TOPICS: Topic[] = [
  {
    parent: "competitions",
    slug: "stem",
    phrase: "STEM competitions",
    titlePhrase: "STEM Competitions",
    intro:
      "Math, science, engineering and computer science competitions open to U.S. high school students: olympiads, science bowls, science fairs, coding contests and engineering challenges.",
    match: (o) => has(o, "STEM", "Math", "Computer Science", "Engineering", "Biology", "Physics", "Chemistry", "Data Science", "AI", "Robotics"),
  },
  {
    parent: "competitions",
    slug: "research",
    phrase: "research competitions",
    titlePhrase: "Research Competitions",
    intro:
      "Competitions where you submit original research: science and engineering fairs, research symposia and paper contests. Most expect a project you have already worked on for months.",
    companion: { path: "/guides/top-research-competitions", label: "our comparison of the top research competitions" },
    match: (o) => has(o, "Research") || says(o, /\bresearch\b/i),
  },
  {
    parent: "competitions",
    slug: "science",
    phrase: "science competitions",
    titlePhrase: "Science Competitions",
    intro:
      "Biology, chemistry, physics, earth and environmental science competitions for high school students, from national olympiads to regional science bowls and fairs.",
    match: (o) =>
      has(o, "Biology", "Physics", "Chemistry", "Environment", "Astronomy") || says(o, /\b(science|biology|chemistry|physics|olympiad)\b/i),
  },
  {
    parent: "competitions",
    slug: "business",
    phrase: "business competitions",
    titlePhrase: "Business Competitions",
    intro:
      "Business, finance, investing, economics and entrepreneurship competitions for high school students: case challenges, pitch competitions and stock-market games.",
    companion: { path: "/guides/top-business-summer-programs", label: "our guide to business summer programs" },
    match: (o) => has(o, "Business", "Finance", "Economics", "Entrepreneurship"),
  },
  {
    parent: "competitions",
    slug: "writing",
    phrase: "writing competitions",
    titlePhrase: "Writing Competitions",
    intro:
      "Essay, poetry, fiction, journalism and editorial contests for high school students. Many are free to enter and accept work you have written for class.",
    match: (o) => has(o, "Writing") || says(o, /\b(essay|writing|poetry|poem|fiction|journalism|editorial)\b/i),
  },
  {
    parent: "competitions",
    slug: "math",
    phrase: "math competitions",
    titlePhrase: "Math Competitions",
    intro:
      "Math competitions for high school students, from the AMC ladder and state leagues to team contests and problem-solving olympiads.",
    match: (o) => has(o, "Math") || says(o, /\b(math|mathematics|mathematical)\b/i),
  },
  {
    parent: "internships",
    slug: "medical",
    phrase: "medical internships",
    titlePhrase: "Medical Internships",
    intro:
      "Every internship in the catalogue at hospitals, medical schools, public-health departments and biomedical research labs that takes high school students.",
    companion: { path: "/guides/top-medical-internships", label: "our side-by-side comparison of the most selective ones" },
    match: (o) => has(o, "Medicine", "Health", "Public Health") || says(o, /\b(medical|medicine|hospital|clinical|health|biomedical)\b/i),
  },
  {
    parent: "summer-programs",
    slug: "nyc",
    phrase: "summer programs in New York City",
    titlePhrase: "NYC Summer Programs",
    intro:
      "Summer programs for high school students that run in New York City: university pre-college programs, museum and lab placements, and city-run options across the five boroughs.",
    companion: { path: "/nyc-programs-for-high-school-students", label: "all NYC programs, including free after-school ones" },
    match: (o) => NYC_LOCATION.test(o.location.trim()),
  },
  {
    parent: "summer-programs",
    slug: "free",
    phrase: "free summer programs",
    titlePhrase: "Free Summer Programs",
    intro:
      "Summer programs for high school students that charge no tuition, including the ones that also pay a stipend. Free programs are usually the most selective, so apply early.",
    match: (o) => o.cost === "Free" || o.cost === "Stipend",
  },
];

const CATEGORY_OF: Record<CategorySlug, Opportunity["category"]> = {
  "summer-programs": "Summer Program",
  internships: "Internship",
  scholarships: "Scholarship",
  research: "Research",
  competitions: "Competition",
  fellowships: "Fellowship",
};

const listingCache = new Map<string, Opportunity[]>();

/** The topic's listings, in the category page's order. */
export function topicListings(topic: Topic): Opportunity[] {
  const key = `${topic.parent}/${topic.slug}`;
  const cached = listingCache.get(key);
  if (cached) return cached;
  const category = CATEGORY_OF[topic.parent];
  const list = allOpportunities.filter((o) => o.category === category && topic.match(o) && isOpportunityIndexable(o));
  const order = new Map(allOpportunities.map((o, i) => [o.id, i]));
  const sorted = applySort(list, "recommended", order);
  listingCache.set(key, sorted);
  return sorted;
}

/** Topics that clear the minimum and are published. */
export function publishedTopics(parent?: CategorySlug): Topic[] {
  return TOPICS.filter((t) => (!parent || t.parent === parent) && topicListings(t).length >= MIN_TOPIC_LISTINGS);
}

export function findTopic(parent: string | undefined, slug: string | undefined): Topic | undefined {
  return publishedTopics().find((t) => t.parent === parent && t.slug === slug);
}

export function topicPath(topic: Topic, page = 1): string {
  const base = `/categories/${topic.parent}/${topic.slug}`;
  return page <= 1 ? base : `${base}/page/${page}`;
}
