import type { Category } from "@/data/opportunities";

export type CategorySlug =
  | "summer-programs"
  | "internships"
  | "scholarships"
  | "research"
  | "competitions"
  | "volunteer"
  | "fellowships";

export const CATEGORY_META: Record<CategorySlug, {
  category: Category;
  title: string;
  h1: string;
  intro: string;
  description: string;
}> = {
  "summer-programs": {
    category: "Summer Program",
    title: "Summer Programs for High Schoolers — HSO",
    h1: "Summer programs for high schoolers",
    intro: "Pre-college summers at top universities, research labs, and global institutes. Free, paid, and stipended options.",
    description: "Discover summer programs for high school students — from MIT RSI to Yale YYGS. Free, paid, and stipended options curated by HSO.",
  },
  internships: {
    category: "Internship",
    title: "High School Internships — HSO",
    h1: "Internships open to high schoolers",
    intro: "Real workplace internships at companies, labs, hospitals, and government agencies that accept high school students.",
    description: "Find paid and unpaid internships open to high school students at companies, labs, and government agencies.",
  },
  scholarships: {
    category: "Scholarship",
    title: "Scholarships for High School Students — HSO",
    h1: "Scholarships for high school students",
    intro: "Merit, need-based, and identity-focused scholarships you can apply to before or during senior year.",
    description: "Browse merit, need-based, and identity-focused scholarships open to high school students worldwide.",
  },
  research: {
    category: "Research",
    title: "Research Programs for High Schoolers — HSO",
    h1: "Research programs for high schoolers",
    intro: "Mentored research with professors and labs across STEM, humanities, and social sciences.",
    description: "Discover mentored research programs for high schoolers across STEM, humanities, and social sciences.",
  },
  competitions: {
    category: "Competition",
    title: "Academic Competitions for High Schoolers — HSO",
    h1: "Academic competitions for high schoolers",
    intro: "Olympiads, science fairs, writing contests, and entrepreneurship challenges with global reach.",
    description: "Find olympiads, science fairs, writing contests, and entrepreneurship competitions for high schoolers.",
  },
  volunteer: {
    category: "Volunteer",
    title: "Volunteer Opportunities for High Schoolers — HSO",
    h1: "Volunteer opportunities for high schoolers",
    intro: "Service, conservation, and community programs — local and global.",
    description: "Service, conservation, and global community volunteer opportunities for high school students.",
  },
  fellowships: {
    category: "Fellowship",
    title: "Fellowships for High School Students — HSO",
    h1: "Fellowships for high schoolers",
    intro: "Selective long-term programs combining mentorship, research, and leadership development.",
    description: "Selective fellowships for high school students combining mentorship, research, and leadership.",
  },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_META) as CategorySlug[];

export function slugForCategory(c: Category): CategorySlug | undefined {
  return CATEGORY_SLUGS.find((s) => CATEGORY_META[s].category === c);
}