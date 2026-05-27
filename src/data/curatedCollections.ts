export type CuratedCollection = {
  id: string;
  title: string;
  description: string;
  cover_gradient: string;
  tags: string[];
  intended_majors: string[];
  categories: string[];
  opportunityIds: string[];
};

export type CuratedSection = {
  id: string;
  title: string;
  collections: CuratedCollection[];
};

const c = (
  id: string,
  title: string,
  description: string,
  gradient: string,
  tags: string[],
  intended_majors: string[],
  categories: string[],
  opportunityIds: string[],
): CuratedCollection => ({ id, title, description, cover_gradient: gradient, tags, intended_majors, categories, opportunityIds });

export const curatedSections: CuratedSection[] = [
  {
    id: "stem-cs",
    title: "STEM & Computer Science",
    collections: [
      c("cs-builder-track", "Computer Science Builder Track",
        "Coding, AI, and robotics programs for students building serious tech projects before senior year.",
        "linear-gradient(135deg, #101827 0%, #2fbf82 52%, #d9eadf 100%)",
        ["coding", "AI", "robotics"], ["Computer Science"], ["Internship", "Research", "Competition"],
        ["google-csi", "usaco", "beaver-works", "technovation", "junior-academy", "ioi"]),
      c("math-olympiad-ladder", "Math Competition Ladder",
        "A focused route through math contests, proof practice, and selective math summer programs.",
        "linear-gradient(135deg, #141827 0%, #df6b54 45%, #f0c767 100%)",
        ["math", "olympiad", "proofs"], ["Math"], ["Competition", "Summer Program"],
        ["amc", "aime", "usamo", "hmmt", "promys", "ross"]),
    ],
  },
  {
    id: "medicine-biology",
    title: "Medicine & Biology",
    collections: [
      c("premed-research", "Pre-Med and Biology Research",
        "Hospitals, labs, and biology programs for students considering medicine or public health.",
        "linear-gradient(135deg, #0f3b2e 0%, #3ba172 48%, #f0c767 100%)",
        ["pre-med", "biology", "health"], ["Medicine", "Biology", "Public Health"],
        ["Research", "Summer Program", "Internship"],
        ["simr", "rockefeller-ssrp", "nih-hi-step", "nih-summer", "nyu-arise", "junior-academy"]),
    ],
  },
  {
    id: "business-finance",
    title: "Business & Finance",
    collections: [
      c("business-founder-prep", "Business, Finance, and Founder Prep",
        "Competitions, leadership programs, and finance internships for future founders and analysts.",
        "linear-gradient(135deg, #f4eadf 0%, #df6b54 44%, #15251f 100%)",
        ["business", "finance", "entrepreneurship"], ["Business", "Finance", "Economics"],
        ["Competition", "Internship", "Fellowship"],
        ["diamond-challenge", "blue-ocean-entrepreneurship", "ayia", "wharton-global", "knowledge-at-wharton", "coca"]),
    ],
  },
  {
    id: "law-policy-civic",
    title: "Law, Policy & Civic Leadership",
    collections: [
      c("law-policy-civic", "Law, Policy, and Civic Leadership",
        "Government, debate, policy, and civic action opportunities for students who want impact.",
        "linear-gradient(135deg, #111827 0%, #274d3b 52%, #f4e8db 100%)",
        ["law", "policy", "civic"], ["Political Science", "Law", "Public Policy"],
        ["Fellowship", "Volunteer", "Summer Program"],
        ["ywp", "unesco-youth", "girls-state", "tasp", "ylc", "coca"]),
    ],
  },
  {
    id: "arts-writing-media",
    title: "Arts, Writing & Media",
    collections: [
      c("arts-writing-portfolio", "Arts, Writing, and Media Portfolio",
        "A creative stack for writers, filmmakers, artists, and students building a portfolio.",
        "linear-gradient(135deg, #2b1714 0%, #ff765c 50%, #f6e7d7 100%)",
        ["writing", "film", "portfolio"], ["Arts", "Writing", "Media"],
        ["Competition", "Internship", "Summer Program"],
        ["nyt-essay", "scholastic", "ywoy", "concord", "whitney-youth-insights", "girls-write"]),
      c("humanities-scholar", "Humanities Scholar Starter Pack",
        "Seminars, essay contests, and humanities programs for deep readers and writers.",
        "linear-gradient(135deg, #f6e7d7 0%, #df6b54 45%, #101827 100%)",
        ["humanities", "history", "essays"], ["Humanities", "History", "English"],
        ["Summer Program", "Competition", "Scholarship"],
        ["tasp", "concord", "nyt-essay", "ylc", "scholastic", "coca"]),
    ],
  },
  {
    id: "engineering-design",
    title: "Engineering & Design",
    collections: [
      c("engineering-maker", "Engineering and Maker Summer",
        "Hands-on engineering, invention, aerospace, and design programs for builders.",
        "linear-gradient(135deg, #132019 0%, #df6b54 48%, #d9eadf 100%)",
        ["engineering", "maker", "design"], ["Engineering"],
        ["Summer Program", "Research", "Competition"],
        ["nyu-arise", "ssp", "junior-academy", "blue-ocean-entrepreneurship", "diamond-challenge", "jpl"]),
    ],
  },
  {
    id: "environment-climate",
    title: "Environmental & Climate",
    collections: [
      c("climate-action", "Climate and Environmental Action",
        "Environmental research, conservation, and climate-centered leadership opportunities.",
        "linear-gradient(135deg, #073b2d 0%, #2fbf82 47%, #f7c65f 100%)",
        ["climate", "environment", "ocean"], ["Environmental Science"],
        ["Research", "Volunteer", "Competition"],
        ["ywoy", "state-hawaii-hycc", "junior-academy", "smithsonian-nmnh-high-school-internship", "state-wyoming-space-grant", "stargate"]),
    ],
  },
  {
    id: "nyc-local",
    title: "NYC & Local Opportunities",
    collections: [
      c("nyc-local", "NYC Local Opportunities",
        "A New York-focused folder for students looking for museums, STEM, leadership, and local programs.",
        "linear-gradient(135deg, #111827 0%, #df6b54 48%, #2fbf82 100%)",
        ["NYC", "local", "free"], ["Undecided"],
        ["Internship", "Volunteer", "Research"],
        ["junior-academy", "whitney-youth-insights", "projekt-nyc", "nyu-arise", "girls-write", "civic-hall-stem-camp"]),
    ],
  },
  {
    id: "scholarships-competitions",
    title: "Scholarships & Competitions",
    collections: [
      c("selective-shortlist", "Selective Pre-College Shortlist",
        "A balanced shortlist of recognizable programs, scholarships, and research options to compare.",
        "linear-gradient(135deg, #132019 0%, #2fbf82 42%, #ff765c 100%)",
        ["selective", "pre-college", "research"], ["Undecided", "STEM", "Humanities"],
        ["Summer Program", "Research", "Scholarship"],
        ["rsi", "ssp", "ylc", "tasp", "pioneer", "lumiere"]),
    ],
  },
  {
    id: "summer-programs",
    title: "Summer Programs",
    collections: [
      c("social-impact-summer", "Social Impact and Volunteering",
        "Service, nonprofit, and civic options for students who want meaningful local impact.",
        "linear-gradient(135deg, #f4eadf 0%, #2fbf82 48%, #132019 100%)",
        ["service", "leadership", "nonprofit"], ["Social Impact", "Education", "Public Policy"],
        ["Volunteer", "Fellowship", "Scholarship"],
        ["volunteer-match", "idealist", "projekt-nyc", "ywp", "girls-inc-nyc", "ayia"]),
    ],
  },
];

export const curatedCollections: CuratedCollection[] = curatedSections.flatMap((s) => s.collections);

export function getCuratedCollection(id: string): CuratedCollection | undefined {
  return curatedCollections.find((collection) => collection.id === id);
}