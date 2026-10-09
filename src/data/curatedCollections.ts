export type CuratedCollection = {
  id: string;
  title: string;
  description: string;
  cover_gradient: string;
  tags: string[];
  intended_majors: string[];
  /**
   * Legacy hand-written label of the categories a collection covers.
   * NOT used for filtering or display any more — it had drifted out of sync
   * with the listings each collection actually holds. The UI derives the real
   * categories from the members via lib/collectionFacts.ts.
   */
  categories: string[];
  opportunityIds: string[];
  career_path?: string;
  is_active?: boolean;
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
  career_path?: string,
): CuratedCollection => ({ id, title, description, cover_gradient: gradient, tags, intended_majors, categories, opportunityIds, career_path, is_active: true });

export const curatedSections: CuratedSection[] = [
  {
    id: "stem-cs",
    title: "STEM & Computer Science",
    collections: [
      c("cs-builder-track", "Computer Science Builder Track",
        "Coding, AI, and robotics programs for students building serious tech projects before senior year.",
        "linear-gradient(135deg, #101827 0%, #2fbf82 52%, #d9eadf 100%)",
        ["coding", "AI", "robotics"], ["Computer Science"], ["Internship", "Research", "Competition"],
        ["google-csi", "usaco", "beaver-works", "technovation", "junior-academy", "ioi", "cssi", "ai4all", "congressional-app", "kaggle", "picoctf", "cyber-patriot"],
        "Software & AI"),
      c("math-olympiad-ladder", "Math Competition Ladder",
        "A focused route through math contests, proof practice, and selective math summer programs.",
        "linear-gradient(135deg, #141827 0%, #df6b54 45%, #f0c767 100%)",
        ["math", "olympiad", "proofs"], ["Math"], ["Competition", "Summer Program"],
        ["amc", "aime", "usamo", "hmmt", "promys", "ross", "pumac", "bmt", "smt", "putnam-jr", "hcssim-prim", "ill-mathematics"],
        "Mathematics"),
      c("women-in-stem", "Women in STEM",
        "Programs and competitions built for high school girls and gender-expansive students pursuing STEM.",
        "linear-gradient(135deg, #2b1d3a 0%, #df6b54 48%, #f7c65f 100%)",
        ["women", "girls", "STEM"], ["Computer Science", "Engineering", "Math", "Science"],
        ["Summer Program", "Competition", "Scholarship"],
        ["girls-who-code", "kode-with-klossy", "technovation", "ai4all", "girlup", "girls-who-code-pathways", "nywici-scholarship" ],
        "STEM"),
      c("cybersecurity-builders", "Cybersecurity & CTF Builders",
        "Capture-the-flag competitions, cyber camps, and security training for students who want to break and defend systems.",
        "linear-gradient(135deg, #060914 0%, #2fbf82 50%, #f7c65f 100%)",
        ["cybersecurity", "CTF", "hacking"], ["Computer Science", "Cybersecurity"],
        ["Competition", "Summer Program"],
        ["picoctf", "cyber-patriot", "beaver-works",  "microsoft-discovery", "stargate"],
        "Cybersecurity")
    ],
  },
  {
    id: "medicine-biology",
    title: "Medicine & Biology",
    collections: [
      c("future-doctors", "Future Doctors: Medicine & Biology",
        "Hospital internships, biomedical research, and biology programs for students considering medicine, neuroscience, or public health.",
        "linear-gradient(135deg, #0f3b2e 0%, #3ba172 48%, #f0c767 100%)",
        ["pre-med", "biology", "health", "hospital"], ["Medicine", "Biology", "Public Health", "Neuroscience"],
        ["Research", "Summer Program", "Internship"],
        ["simr", "state-maryland-histep", "nih-summer", "nyu-arise", "junior-academy", "hosa", "hopkins-med", "syp-jhu", "rsi-medicine", "mclean-mentorship", "usabo", "ibo", "emory-pre"],
        "Medicine")
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
        ["diamond-challenge", "blue-ocean-entrepreneurship", "wharton-global", "knowledge-at-wharton", "leangap", "nfte", "fbla", "mit-launch", "soa-shark"],
        "Business")
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
        ["Fellowship", "Summer Program"],
        ["ywp", "unesco-youth", "girls-state", "tasp", "ylc", "model-un", "harvard-mun", "yale-mun", "yale-law-summer", "syp-georgetown", "columbia-freedom-citizenship", "youth-debate"],
        "Law & Policy")
    ],
  },
  {
    id: "arts-writing-media",
    title: "Arts, Writing & Media",
    collections: [
      c("writing-journalism-media", "Writing, Journalism & Media",
        "Essay contests, journalism programs, and media internships for students who want to write and report.",
        "linear-gradient(135deg, #1a0f0c 0%, #df6b54 50%, #f6e7d7 100%)",
        ["writing", "journalism", "essays"], ["Writing", "Journalism", "Media", "English"],
        ["Competition", "Internship", "Summer Program"],
        ["nyt-essay", "scholastic", "concord", "iwp", "jea",  "bell-journalism", "nytlearning-podcast", "nywici-scholarship", "vfw-voice-of-democracy"],
        "Journalism"),
      c("arts-design-portfolio", "Arts, Design & Portfolio Builders",
        "Studio programs, conservatories, and portfolio-building summer intensives for visual, design, and performing arts students.",
        "linear-gradient(135deg, #2b1714 0%, #ff765c 50%, #f6e7d7 100%)",
        ["arts", "design", "portfolio"], ["Arts", "Design"],
        ["Summer Program", "Competition"],
        ["scholastic", "interlochen", "rhsa", "nyu-tisch", "juilliard-pre", "manhattan-school", "youngarts-national-arts", "sva-precollege", "aspen-music", "tanglewood"],
        "Arts"),
      c("humanities-scholar", "Humanities Scholar Starter Pack",
        "Seminars, essay contests, and humanities programs for deep readers and writers.",
        "linear-gradient(135deg, #f6e7d7 0%, #df6b54 45%, #101827 100%)",
        ["humanities", "history", "essays"], ["Humanities", "History", "English"],
        ["Summer Program", "Competition", "Scholarship"],
        ["tasp", "concord", "nyt-essay", "ylc", "scholastic", "national-wwii-writing-contest", "columbia-freedom-citizenship", "nyu-medical-ethics"],
        "Humanities")
    ],
  },
  {
    id: "engineering-design",
    title: "Engineering & Robotics",
    collections: [
      c("engineering-robotics", "Engineering & Robotics",
        "Robotics teams, aerospace programs, and hands-on engineering summers for students who love to build.",
        "linear-gradient(135deg, #132019 0%, #df6b54 48%, #d9eadf 100%)",
        ["engineering", "robotics", "aerospace"], ["Engineering", "Mechanical Engineering", "Aerospace"],
        ["Summer Program", "Research", "Competition"],
        ["nyu-arise", "ssp", "junior-academy", "first-robotics", "vex", "ftc", "zero-robotics", "army-rebotics", "jpl", "mites", "beaver-works", "siemens", "future-city" ],
        "Engineering")
    ],
  },
  {
    id: "environment-climate",
    title: "Environmental Action & Climate",
    collections: [
      c("climate-action", "Environmental Action & Climate",
        "Conservation, climate research, and environmental leadership programs for students who want to act on climate.",
        "linear-gradient(135deg, #073b2d 0%, #2fbf82 47%, #f7c65f 100%)",
        ["climate", "environment", "conservation"], ["Environmental Science", "Earth Science"],
        ["Research", "Competition"],
        ["ywoy", "ieso", "smithsonian-nmnh-high-school-internship",  "nat-geo",   "global-water-challenge", "hudson-river-slp", "amnh-srmp", "nybg-internships", "state-hawaii-hycc"],
        "Environment")
    ],
  },
  {
    id: "nyc-local",
    title: "NYC Student Opportunities",
    collections: [
      c("nyc-student", "NYC Student Opportunities",
        "A New York-focused list of paid internships, museum programs, STEM, and leadership opportunities for NYC high schoolers.",
        "linear-gradient(135deg, #111827 0%, #df6b54 48%, #2fbf82 100%)",
        ["NYC", "local", "paid"], ["Undecided"],
        ["Internship", "Research", "Summer Program"],
        ["junior-academy",  "nyu-arise",  "civic-hall-stem-camp", "nyc-syep", "nyc-ladders-leaders",  "nyc-careerready", "nyc-industry-scholars", "amnh-srmp", "moma-teens", "bpl-teen-takeovers", "nypl-teen-ambassadors", "hudson-river-slp"],
        "NYC")
    ],
  },
  {
    id: "scholarships-competitions",
    title: "Scholarships & Competitions",
    collections: [
      c("scholarships-competitions", "Scholarships & Competitions",
        "National scholarships, recognition awards, and major academic competitions worth real money or college credit.",
        "linear-gradient(135deg, #0c1422 0%, #f7c65f 50%, #df6b54 100%)",
        ["scholarship", "competition", "awards"], ["Undecided"],
        ["Scholarship", "Competition"],
        ["coca", "gates", "posse", "dell", "horatio-alger", "stamps", "ron-brown", "hagan", "regeneron-sts", "isef", "amc", "scholastic", "vfw-voice-of-democracy", "youngarts-national-arts"],
        "Awards"),
      c("selective-shortlist", "Selective Pre-College Shortlist",
        "A balanced shortlist of recognizable programs, scholarships, and research options to compare.",
        "linear-gradient(135deg, #132019 0%, #2fbf82 42%, #ff765c 100%)",
        ["selective", "pre-college", "research"], ["Undecided", "STEM", "Humanities"],
        ["Summer Program", "Research", "Scholarship"],
        ["rsi", "ssp", "ylc", "tasp", "pioneer", "lumiere", "simr", "promys", "regeneron-sts"],
        "Selective")
    ],
  },
  {
    id: "summer-programs",
    title: "Summer Programs",
    collections: [
      c("free-summer-programs", "Free Summer Programs",
        "Fully-funded and stipend-paying summer programs — no tuition required.",
        "linear-gradient(135deg, #0e1f15 0%, #2fbf82 48%, #f7c65f 100%)",
        ["free", "stipend", "summer"], ["Undecided"],
        ["Summer Program", "Research", "Fellowship"],
        ["rsi", "ssp", "tasp", "ylc", "promys", "ross", "mites", "simr", "state-maryland-histep", "nih-summer", "beaver-works", "nyu-arise", "hcssim-prim", "girls-who-code", "ai4all"],
        "Free"),
      c("ivy-level-summer", "Ivy-Level Summer Programs",
        "Pre-college summer programs hosted at Ivy League and top-tier universities.",
        "linear-gradient(135deg, #1a0d2e 0%, #6b3fa0 50%, #f6e7d7 100%)",
        ["ivy", "pre-college", "selective"], ["Undecided"],
        ["Summer Program"],
        ["state-rhode-island-brown-precollege", "syp-cornell", "syp-uchicago", "syp-georgetown", "syp-jhu", "syp-penn", "nyu-precollege", "yale-law-summer", "stanford-summer-high-school", "columbia-freedom-citizenship", "harvard-mun", "yale-mun"],
        "Pre-College"),
      c("research-starter-pack", "Research Starter Pack",
        "A first-time researcher's shortlist — mentored research programs, lab internships, and writing-a-paper programs.",
        "linear-gradient(135deg, #102230 0%, #2fbf82 45%, #f6e7d7 100%)",
        ["research", "mentorship", "first-time"], ["Undecided"],
        ["Research", "Summer Program"],
        ["polygence", "horizon", "lumiere", "pioneer", "indigo", "immerse-research", "amnh-srmp", "hudson-river-slp", "nyu-arise", "brookhaven"],
        "Research")
    ],
  },
  {
    id: "access-equity",
    title: "Access & Equity",
    collections: [
      c("first-gen-college-access", "First-Gen College Access",
        "Programs and scholarships built for first-generation and low-income students preparing for college.",
        "linear-gradient(135deg, #1a0f2e 0%, #df6b54 48%, #f6e7d7 100%)",
        ["first-gen", "low-income", "access"], ["Undecided"],
        ["Scholarship", "Fellowship", "Summer Program"],
        ["questbridge-match", "posse", "gates", "dell", "horatio-alger", "ron-brown", "stamps", "minds-matter-nyc", "columbia-double-discovery", "breakthrough"],
        "College Access")
    ],
  }
];

export const curatedCollections: CuratedCollection[] = curatedSections.flatMap((s) => s.collections);

export const careerPaths: string[] = Array.from(
  new Set(curatedCollections.map((c) => c.career_path).filter((x): x is string => !!x))
).sort();

export const intendedMajors: string[] = Array.from(
  new Set(curatedCollections.flatMap((c) => c.intended_majors))
).sort();


export function getCuratedCollection(id: string): CuratedCollection | undefined {
  return curatedCollections.find((collection) => collection.id === id);
}