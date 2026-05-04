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

// ---------- Synthetic generator: 10,000+ opportunities worldwide ----------

const ORGS = [
  "MIT","Stanford","Harvard","Yale","Princeton","Oxford","Cambridge","ETH Zürich","Tsinghua","NUS","University of Tokyo",
  "Caltech","UC Berkeley","Columbia","UCLA","Imperial College London","University of Toronto","McGill","TU Munich","KAIST",
  "Carnegie Mellon","Cornell","Brown","Duke","Northwestern","Johns Hopkins","University of Chicago","NYU","Georgia Tech",
  "Microsoft","Google","Meta","Apple","Amazon","NASA","CERN","NOAA","World Bank","United Nations","Red Cross","UNICEF",
  "National Geographic","Smithsonian","Nature Conservancy","WWF","Khan Academy","Coursera","IBM Research","Intel",
  "Boston University","University of Pennsylvania","University of Michigan","University of Washington","UT Austin",
  "Sciences Po","Sorbonne","HEC Paris","LSE","King's College London","Trinity College Dublin","University of Sydney",
  "University of Melbourne","ANU","Peking University","HKUST","Seoul National University","IIT Bombay","IIT Delhi",
  "AIIMS","Technion","Hebrew University","University of Cape Town","University of São Paulo","UNAM","Tec de Monterrey",
] as const;

const CITIES: { city: string; country: string }[] = [
  { city: "Cambridge", country: "USA" }, { city: "Stanford", country: "USA" }, { city: "Boston", country: "USA" },
  { city: "New York", country: "USA" }, { city: "San Francisco", country: "USA" }, { city: "Los Angeles", country: "USA" },
  { city: "Chicago", country: "USA" }, { city: "Seattle", country: "USA" }, { city: "Austin", country: "USA" },
  { city: "Atlanta", country: "USA" }, { city: "Washington DC", country: "USA" }, { city: "Toronto", country: "Canada" },
  { city: "Montréal", country: "Canada" }, { city: "Vancouver", country: "Canada" }, { city: "London", country: "UK" },
  { city: "Oxford", country: "UK" }, { city: "Edinburgh", country: "UK" }, { city: "Dublin", country: "Ireland" },
  { city: "Paris", country: "France" }, { city: "Berlin", country: "Germany" }, { city: "Munich", country: "Germany" },
  { city: "Zürich", country: "Switzerland" }, { city: "Geneva", country: "Switzerland" }, { city: "Amsterdam", country: "Netherlands" },
  { city: "Stockholm", country: "Sweden" }, { city: "Copenhagen", country: "Denmark" }, { city: "Madrid", country: "Spain" },
  { city: "Barcelona", country: "Spain" }, { city: "Rome", country: "Italy" }, { city: "Milan", country: "Italy" },
  { city: "Vienna", country: "Austria" }, { city: "Prague", country: "Czechia" }, { city: "Warsaw", country: "Poland" },
  { city: "Istanbul", country: "Türkiye" }, { city: "Tel Aviv", country: "Israel" }, { city: "Dubai", country: "UAE" },
  { city: "Cairo", country: "Egypt" }, { city: "Cape Town", country: "South Africa" }, { city: "Nairobi", country: "Kenya" },
  { city: "Lagos", country: "Nigeria" }, { city: "Accra", country: "Ghana" }, { city: "Mumbai", country: "India" },
  { city: "Bengaluru", country: "India" }, { city: "Delhi", country: "India" }, { city: "Singapore", country: "Singapore" },
  { city: "Kuala Lumpur", country: "Malaysia" }, { city: "Bangkok", country: "Thailand" }, { city: "Manila", country: "Philippines" },
  { city: "Jakarta", country: "Indonesia" }, { city: "Hong Kong", country: "Hong Kong" }, { city: "Taipei", country: "Taiwan" },
  { city: "Seoul", country: "South Korea" }, { city: "Tokyo", country: "Japan" }, { city: "Kyoto", country: "Japan" },
  { city: "Beijing", country: "China" }, { city: "Shanghai", country: "China" }, { city: "Sydney", country: "Australia" },
  { city: "Melbourne", country: "Australia" }, { city: "Auckland", country: "New Zealand" }, { city: "São Paulo", country: "Brazil" },
  { city: "Rio de Janeiro", country: "Brazil" }, { city: "Buenos Aires", country: "Argentina" }, { city: "Santiago", country: "Chile" },
  { city: "Lima", country: "Peru" }, { city: "Bogotá", country: "Colombia" }, { city: "Mexico City", country: "Mexico" },
];

const CATEGORIES: Category[] = ["Research","Internship","Competition","Summer Program","Scholarship","Volunteer","Fellowship"];

const FIELD_BANK = [
  "STEM","Math","Computer Science","Biology","Engineering","Physics","Chemistry","Astronomy","Robotics","AI",
  "Humanities","Writing","Journalism","History","Philosophy","Linguistics","Languages",
  "Business","Entrepreneurship","Finance","Economics","Marketing",
  "Arts","Music","Film","Theater","Design","Architecture","Photography",
  "Policy","Law","Diplomacy","Government",
  "Medicine","Public Health","Neuroscience","Genetics","Psychology",
  "Environment","Climate","Marine Biology","Ecology","Sustainability","Agriculture",
  "Social Impact","Education","Sports","Data Science",
];

const TITLE_PATTERNS: Record<Category, string[]> = {
  Research: ["{field} Research Initiative","Independent {field} Research at {org}","{org} {field} Lab Program","Junior {field} Researchers Program"],
  Internship: ["{org} {field} Internship","{field} Summer Internship at {org}","{org} High School Intern Program","{field} Apprenticeship at {org}"],
  Competition: ["{org} {field} Olympiad","Global {field} Challenge","{field} Hackathon {city}","International {field} Contest","{org} {field} Prize"],
  "Summer Program": ["{org} Summer {field} Academy","Pre-College {field} at {org}","{field} Summer Institute","{org} {field} Honors Program"],
  Scholarship: ["{org} {field} Scholarship","{city} {field} Excellence Award","Future {field} Leaders Scholarship","{org} Merit Scholarship in {field}"],
  Volunteer: ["{city} {field} Volunteer Corps","{org} Community {field} Project","Global {field} Volunteers — {country}","Youth {field} Service Program"],
  Fellowship: ["{org} {field} Youth Fellowship","Young {field} Fellows Program","{city} {field} Fellowship","Global {field} Fellows"],
};

const BLURB_TEMPLATES = [
  "Work with mentors at {org} on a real {field} project — culminating in a portfolio piece for college apps.",
  "Selective {category} bringing together top high schoolers from {country} and beyond to explore {field}.",
  "Hands-on {field} program in {city}. Build, present, and network with leaders in the field.",
  "Dive deep into {field} alongside peers from across the world. {format} format, {cost} to participate.",
  "A flagship {category} for ambitious students passionate about {field}.",
  "Join {org}'s {field} cohort — applications open globally for grades {gradeRange}.",
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function generateOpportunities(count: number): Opportunity[] {
  const rng = mulberry32(42);
  const out: Opportunity[] = [];
  const formats: Opportunity["format"][] = ["In-person","Online","Hybrid"];
  const costs: Opportunity["cost"][] = ["Free","Paid","Stipend"];
  for (let i = 0; i < count; i++) {
    const category = pick(rng, CATEGORIES);
    const org = pick(rng, ORGS);
    const place = pick(rng, CITIES);
    const field = pick(rng, FIELD_BANK);
    const field2 = pick(rng, FIELD_BANK);
    const fields = field === field2 ? [field] : [field, field2];
    const format = pick(rng, formats);
    const cost = pick(rng, costs);
    const gradeStart = 9 + Math.floor(rng() * 3);
    const grades: number[] = [];
    for (let g = gradeStart; g <= 12; g++) grades.push(g);
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    const year = month < 6 ? 2026 : 2026;
    const titlePattern = pick(rng, TITLE_PATTERNS[category]);
    const title = titlePattern
      .replace("{field}", field)
      .replace("{org}", org)
      .replace("{city}", place.city)
      .replace("{country}", place.country);
    const blurbPattern = pick(rng, BLURB_TEMPLATES);
    const blurb = blurbPattern
      .replace("{field}", field)
      .replace("{org}", org)
      .replace("{city}", place.city)
      .replace("{country}", place.country)
      .replace("{category}", category.toLowerCase())
      .replace("{format}", format)
      .replace("{cost}", cost.toLowerCase())
      .replace("{gradeRange}", `${grades[0]}–12`);
    const prestige = (rng() < 0.08 ? 3 : rng() < 0.4 ? 2 : 1) as 1 | 2 | 3;
    out.push({
      id: `gen-${i}`,
      title,
      org,
      category,
      fields,
      location: `${place.city}, ${place.country}`,
      format,
      cost,
      grades,
      deadline: `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
      prestige,
      blurb,
      url: "#",
    });
  }
  return out;
}

export const allOpportunities: Opportunity[] = [
  ...opportunities,
  ...generateOpportunities(10200),
];