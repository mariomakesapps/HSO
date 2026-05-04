export type Category =
  | "Research"
  | "Internship"
  | "Competition"
  | "Summer Program"
  | "Scholarship"
  | "Volunteer"
  | "Fellowship";

export type Opportunity = {
  id: string;
  title: string;
  org: string;
  category: Category;
  fields: string[];
  location: string;
  format: "In-person" | "Online" | "Hybrid";
  cost: "Free" | "Paid" | "Stipend";
  grades: number[]; // 9-12
  deadline: string; // ISO
  prestige: 1 | 2 | 3; // 3 = top tier
  blurb: string;
  url: string;
};

export const FIELDS = [
  "STEM", "Math", "Computer Science", "Biology", "Engineering",
  "Humanities", "Writing", "Business", "Arts", "Policy", "Medicine", "Environment",
] as const;

export const opportunities: Opportunity[] = [
  { id: "rsi", title: "Research Science Institute", org: "MIT / CEE", category: "Summer Program", fields: ["STEM","Research"] as any, location: "Cambridge, USA", format: "In-person", cost: "Free", grades: [11], deadline: "2026-01-15", prestige: 3, blurb: "Six-week tuition-free research summer for the world's top STEM rising seniors.", url: "https://www.cee.org/programs/research-science-institute" },
  { id: "tasp", title: "Telluride Association Summer Seminar", org: "Telluride Association", category: "Summer Program", fields: ["Humanities","Writing","Policy"], location: "Multiple, USA", format: "In-person", cost: "Free", grades: [11], deadline: "2026-01-10", prestige: 3, blurb: "Free six-week humanities seminar — discussion-based, fully funded.", url: "https://www.tellurideassociation.org" },
  { id: "pioneer", title: "Pioneer Research Program", org: "Pioneer Academics", category: "Research", fields: ["STEM","Humanities","Business"], location: "Worldwide", format: "Online", cost: "Paid", grades: [10,11], deadline: "2026-02-28", prestige: 2, blurb: "1-on-1 online research with university professors, ending in a publishable paper.", url: "https://pioneeracademics.com" },
  { id: "isef", title: "Regeneron ISEF", org: "Society for Science", category: "Competition", fields: ["STEM","Engineering","Biology"], location: "Worldwide", format: "Hybrid", cost: "Free", grades: [9,10,11,12], deadline: "2026-03-01", prestige: 3, blurb: "The world's largest pre-college science fair with $9M in prizes.", url: "https://www.societyforscience.org/isef/" },
  { id: "iom", title: "International Math Olympiad", org: "IMO", category: "Competition", fields: ["Math"], location: "Worldwide", format: "In-person", cost: "Free", grades: [9,10,11,12], deadline: "2026-04-15", prestige: 3, blurb: "Compete to represent your country in the world's top math olympiad.", url: "https://www.imo-official.org" },
  { id: "ylc", title: "Yale Young Global Scholars", org: "Yale University", category: "Summer Program", fields: ["Humanities","Policy","STEM"], location: "New Haven, USA", format: "In-person", cost: "Paid", grades: [10,11], deadline: "2026-01-12", prestige: 2, blurb: "Two-week interdisciplinary academic enrichment program at Yale.", url: "https://globalscholars.yale.edu" },
  { id: "coca", title: "Coca-Cola Scholars Program", org: "Coca-Cola Foundation", category: "Scholarship", fields: ["Leadership"] as any, location: "USA", format: "In-person", cost: "Stipend", grades: [12], deadline: "2025-10-31", prestige: 3, blurb: "$20,000 scholarship for 150 exceptional high school seniors annually.", url: "https://www.coca-colascholarsfoundation.org" },
  { id: "google-csi", title: "Google Code Next", org: "Google", category: "Internship", fields: ["Computer Science"], location: "USA (NYC, Oakland, Detroit)", format: "Hybrid", cost: "Free", grades: [9,10,11,12], deadline: "2026-03-30", prestige: 2, blurb: "Free CS education for Black, Latino, and Native high schoolers.", url: "https://codenext.withgoogle.com" },
  { id: "nasa-shpe", title: "NASA OSTEM Internships", org: "NASA", category: "Internship", fields: ["STEM","Engineering"], location: "USA", format: "Hybrid", cost: "Stipend", grades: [11,12], deadline: "2026-02-02", prestige: 3, blurb: "Paid NASA internships for high school juniors and seniors.", url: "https://stemgateway.nasa.gov" },
  { id: "nyt-essay", title: "NYT Student Editorial Contest", org: "The New York Times", category: "Competition", fields: ["Writing","Humanities"], location: "Worldwide", format: "Online", cost: "Free", grades: [9,10,11,12], deadline: "2026-04-20", prestige: 2, blurb: "Write a 450-word editorial on an issue you care about.", url: "https://www.nytimes.com/learning" },
  { id: "joc", title: "Junior Academy", org: "New York Academy of Sciences", category: "Fellowship", fields: ["STEM","Engineering"], location: "Worldwide", format: "Online", cost: "Free", grades: [9,10,11,12], deadline: "2026-05-15", prestige: 2, blurb: "Solve real-world challenges with a global team of teen scientists.", url: "https://www.nyas.org/programs/global-stem-alliance/the-junior-academy/" },
  { id: "lumiere", title: "Lumiere Research Scholar", org: "Lumiere Education", category: "Research", fields: ["STEM","Humanities","Business"], location: "Worldwide", format: "Online", cost: "Paid", grades: [10,11,12], deadline: "2026-06-01", prestige: 2, blurb: "Independent research mentorship with PhD scholars from top universities.", url: "https://www.lumiere-education.com" },
  { id: "stanford-sims", title: "Stanford SIMR", org: "Stanford School of Medicine", category: "Summer Program", fields: ["Medicine","Biology"], location: "Stanford, USA", format: "In-person", cost: "Stipend", grades: [11,12], deadline: "2026-02-22", prestige: 3, blurb: "8-week medical research internship for Bay Area juniors and seniors.", url: "https://simr.stanford.edu" },
  { id: "concord", title: "Concord Review", org: "The Concord Review", category: "Competition", fields: ["Humanities","Writing"], location: "Worldwide", format: "Online", cost: "Paid", grades: [9,10,11,12], deadline: "2026-05-01", prestige: 2, blurb: "Publish a serious history essay in the only journal for high schoolers.", url: "https://tcr.org" },
  { id: "diamond-challenge", title: "Diamond Challenge", org: "Univ. of Delaware", category: "Competition", fields: ["Business"], location: "Worldwide", format: "Hybrid", cost: "Free", grades: [9,10,11,12], deadline: "2026-02-01", prestige: 2, blurb: "Global high school entrepreneurship competition with $100k+ in prizes.", url: "https://diamondchallenge.org" },
  { id: "cee-promys", title: "PROMYS", org: "Boston University", category: "Summer Program", fields: ["Math"], location: "Boston, USA", format: "In-person", cost: "Paid", grades: [10,11,12], deadline: "2026-03-15", prestige: 3, blurb: "Six weeks of deep, creative immersion in number theory.", url: "https://promys.org" },
  { id: "earthwatch", title: "Earthwatch Teen Expeditions", org: "Earthwatch Institute", category: "Volunteer", fields: ["Environment","Biology"], location: "Worldwide", format: "In-person", cost: "Paid", grades: [10,11,12], deadline: "2026-03-31", prestige: 1, blurb: "Join scientists in the field on global conservation expeditions.", url: "https://earthwatch.org" },
  { id: "unesco-youth", title: "UNESCO Youth Forum", org: "UNESCO", category: "Fellowship", fields: ["Policy","Humanities"], location: "Paris / Online", format: "Hybrid", cost: "Free", grades: [11,12], deadline: "2026-06-20", prestige: 2, blurb: "Represent youth voices on global policy at UNESCO.", url: "https://www.unesco.org" },
];