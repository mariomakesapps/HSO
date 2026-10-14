/**
 * Location-string helpers for the State filter and the fact lines. Pure functions
 * with no catalogue data, so the browser can use them without loading the
 * catalogue pipeline (see the hso-catalog-snapshot plugin in vite.config.ts).
 */

// Map a US location string to a state-like filter bucket.
const STATE_NAMES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

/**
 * Every state a listing can be found under in the State filter.
 *
 * locationState() picks one state, which is right for a fact line but wrong for
 * filtering: "Maryland / Colorado / Georgia / Texas / Hawaii / Utah / Alaska, USA"
 * resolved to Alaska alone, so a Maryland student filtering by Maryland never saw it.
 * A location that names several states belongs to each of them.
 */
export function locationStates(location: string): string[] {
  const primary = locationState(location);
  if (primary === "Online" || primary === "Nationwide" || primary === "Other") return [primary];
  const l = location
    .toLowerCase()
    .replace(/kansas city|washington heights/g, "")
    .replace(/washington,? (dc|d\.c\.|district of columbia)/g, "district of columbia")
    .replace(/west virginia/g, "\u0000");
  const found = new Set<string>([primary]);
  if (l.includes("\u0000")) found.add("West Virginia");
  for (const state of STATE_NAMES) {
    if (state === "West Virginia") continue;
    if (new RegExp(`\\b${state.toLowerCase()}\\b`).test(l)) found.add(state);
  }
  if (l.includes("district of columbia")) found.add("District of Columbia");
  return [...found];
}

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
  // "Kansas City, Missouri" names a city, not the state of Kansas.
  const direct = states.find((state) => l.replace(/kansas city/g, "").includes(state.toLowerCase()));
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
