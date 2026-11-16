/**
 * The opportunity record type and the small pure helpers the app uses with it.
 *
 * This module imports no catalogue data, so the client bundle can use it on its
 * own: production builds ship the finished catalogue as precompiled JSON (see
 * the hso-precompiled-catalogue plugin in vite.config.ts) together with this
 * file, instead of every data and correction file under src/data. The pipeline
 * that builds the catalogue (src/data/opportunities.ts) uses the same helpers and
 * re-exports them, so imports from "@/data/opportunities" work everywhere.
 */

export type Category =
  | "Research"
  | "Internship"
  | "Competition"
  | "Summer Program"
  | "Scholarship"
  | "Volunteer"
  | "Fellowship";

export type LinkQuality =
  | "exact_program"
  | "category_page"
  | "generic_homepage"
  | "broken";

export type LinkPrecision =
  | "direct_application_page"
  | "exact_program_page"
  | "broad_directory"
  | "generic_homepage";

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
  deadline: string | null; // ISO date when known; null means rolling, TBA, or no fixed deadline posted.
  opensAt?: string | null; // ISO date for application windows that have not opened yet.
  prestige: 1 | 2 | 3; // 3 = top tier
  blurb: string;
  url: string;
  link_quality?: LinkQuality;
  link_quality_score?: number;
  link_precision?: LinkPrecision;
  link_precision_score?: number;
  verified?: boolean;
  requiresReview?: boolean;
  review_note?: string;
};

export const FIELDS = [
  "STEM", "Math", "Computer Science", "Biology", "Engineering",
  "Humanities", "Writing", "Business", "Arts", "Policy", "Medicine", "Environment",
] as const;

// Category cleanup pass.
// Many bulk-imported listings are mis-tagged (e.g., volunteer food-rescue
// shifts labeled "Scholarship"). Reclassify based on the title + blurb so
// students don't see service shifts inside the Scholarship tab.
const SCHOLARSHIP_WORDS =
  /\b(scholarships?|financial aid|tuition (award|grant|funding)?|award money|cash award|college funding|merit (award|scholarship)|need-based (aid|award)|bursary)\b/i;
const VOLUNTEER_WORDS =
  /\b(volunteer(s|ing)?|community service|service[- ]learning|food (pantry|bank|rescue|drive)|soup kitchen|meal delivery|bread run|collect bread|redistribut(e|ion)|donation sorting|shelter|cleanup|clean[- ]up|park clean|library (helper|volunteer)|museum volunteer|blood drive|animal shelter|hospice|community outreach|mentor(ing)? volunteer|tutoring volunteer|event support)\b/i;

export function reclassifyCategory(
  current: Category,
  title: string,
  blurb: string,
): Category {
  const text = `${title} ${blurb}`;
  const looksScholarship = SCHOLARSHIP_WORDS.test(text);
  const looksVolunteer = VOLUNTEER_WORDS.test(text);
  const titleLooksVolunteer = VOLUNTEER_WORDS.test(title);

  // Title-level volunteer language is a hard signal — a volunteer shift whose
  // blurb mentions "community service hours toward a scholarship" is still
  // a volunteer role, not a scholarship.
  if (titleLooksVolunteer) return "Volunteer";

  // Strong volunteer signal wins over weak/incorrect Scholarship tag.
  if (looksVolunteer && !looksScholarship) return "Volunteer";

  // Scholarship tag must be backed by money/aid language.
  if (current === "Scholarship" && !looksScholarship) {
    return looksVolunteer ? "Volunteer" : "Fellowship";
  }

  return current;
}

// Map a US location string to a state-like filter bucket.
export function locationState(location: string): string {
  const l = location.toLowerCase();
  // "Online, USA" is the catalogue's normal value for a US-eligible online programme, but
  // the guard below reads the "usa" in it and falls all the way through to "Other",
  // dropping 12 listings out of the state filter entirely. Match the leading word first.
  if (/^online\b/.test(l)) return "Online";
  if (l.includes("online") && !l.includes("usa")) return "Online";
  if (l.includes("worldwide") || l === "usa" || l.includes("multiple, usa")) return "Nationwide";
  if (l.includes("district of columbia") || l.includes("washington dc")) return "District of Columbia";
  if (l.includes("west virginia")) return "West Virginia";

  const states = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
    "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
    "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
    "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
    "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
    "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","Wisconsin","Wyoming","District of Columbia"
  ];
  const direct = states.find((state) => l.includes(state.toLowerCase()));
  if (direct) return direct;

  const cityToState: Record<string, string> = {
    "nyc": "New York", "new york": "New York", "manhattan": "New York", "brooklyn": "New York", "bronx": "New York", "queens": "New York", "staten island": "New York", "harlem": "New York", "washington heights": "New York", "ithaca": "New York", "stony brook": "New York", "upton": "New York", "palisades": "New York",
    "cambridge": "Massachusetts", "boston": "Massachusetts", "amherst": "Massachusetts", "natick": "Massachusetts", "belmont": "Massachusetts", "lenox": "Massachusetts",
    "new haven": "Connecticut", "providence": "Rhode Island", "princeton": "New Jersey", "philadelphia": "Pennsylvania", "pittsburgh": "Pennsylvania",
    "washington dc": "District of Columbia", "washington, district": "District of Columbia", "baltimore": "Maryland", "bethesda": "Maryland",
    "atlanta": "Georgia", "nashville": "Tennessee", "knoxville": "Tennessee", "austin": "Texas", "lubbock": "Texas", "fairfax": "Virginia", "ashburn": "Virginia",
    "ann arbor": "Michigan", "chicago": "Illinois", "evanston": "Illinois", "south bend": "Indiana", "lemont": "Illinois", "oak ridge": "Tennessee", "batavia": "Illinois", "iowa city": "Iowa", "gambier": "Ohio", "interlochen": "Michigan",
    "los angeles": "California", "stanford": "California", "berkeley": "California", "menlo park": "California", "pasadena": "California", "seattle": "Washington", "portland": "Oregon", "aspen": "Colorado", "park city": "Utah", "idyllwild": "California", "valencia": "California", "south sf": "California"
  };
  const mapped = Object.entries(cityToState).find(([city]) => l.includes(city));
  if (mapped) return mapped[1];
  return "Other";
}
