import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

export type { Opportunity };

export function catalog(): Opportunity[] {
  return allOpportunities;
}

export const CATEGORIES = [
  "Research",
  "Internship",
  "Competition",
  "Summer Program",
  "Scholarship",
  "Fellowship",
] as const;

export function categoryDirectory() {
  return CATEGORY_SLUGS.map((slug) => {
    const meta = CATEGORY_META[slug];
    return {
      slug,
      category: meta.category,
      title: meta.h1,
      summary: meta.intro,
      url: `https://highschoolopportunity.org/categories/${slug}`,
      count: allOpportunities.filter((o) => o.category === meta.category).length,
    };
  });
}

/** Compact, model-friendly shape for a single listing. */
export function serialize(o: Opportunity) {
  return {
    id: o.id,
    title: o.title,
    organization: o.org,
    category: o.category,
    fields: o.fields,
    location: o.location,
    format: o.format,
    cost: o.cost,
    grades: o.grades,
    deadline: o.deadline ?? "rolling or not posted",
    opensAt: o.opensAt ?? null,
    prestige: o.prestige,
    summary: o.blurb,
    officialUrl: o.url,
    hsoUrl: `https://highschoolopportunity.org/opportunities/${o.id}`,
  };
}

export function matchesQuery(o: Opportunity, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [o.title, o.org, o.blurb, o.location, o.category, (o.fields ?? []).join(" ")]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}
