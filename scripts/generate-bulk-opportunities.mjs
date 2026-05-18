import { writeFile } from "node:fs/promises";

const OUT_FILE = new URL("../src/data/generatedBulkOpportunities.ts", import.meta.url);

const NYC_DYCD_API =
  "https://data.cityofnewyork.us/resource/xrqn-xmys.json?%24limit=50000&%24select=:id,program_type,program,site_name,borough_community,agency,contact_number,grade_level_age_group";
const NYC_DYCD_FINDER = "https://discoverdycd.dycdconnect.nyc/program-public";
const NYC_DYCD_ROW_PAGE =
  "https://data.cityofnewyork.us/Education/DYCD-Afterschool-Programs/xrqn-xmys";

const SF_TYPESENSE_URL =
  "https://lj8cf4etrqygd1ahp-1.a2.typesense.net/collections/resources/documents/search";
const SF_TYPESENSE_KEY = "wDbNg1cauWY6PvoqyIslpnXGgzdySodf";
const NPS_PARKS_API =
  "https://developer.nps.gov/api/v1/parks?limit=500&fields=addresses&api_key=DEMO_KEY";

const STRONG_SF_SUBCATEGORIES = new Set([
  "After School Program",
  "Summer Program",
  "Youth Jobs & Internships",
  "Career Exploration",
  "Skills & Training",
  "Youth Leadership",
  "Mentorship",
  "Tutoring and Homework Help",
  "Digital Media Production",
  "Vocational Training",
  "College Access",
  "College Preparation",
  "Education Support",
]);

const US_STATES_BY_CITY = new Map([
  ["san francisco", "California"],
  ["new york", "New York"],
  ["brooklyn", "New York"],
  ["bronx", "New York"],
  ["queens", "New York"],
  ["staten island", "New York"],
  ["manhattan", "New York"],
]);

const US_STATE_BY_CODE = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function clean(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value) {
  return clean(value)
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function truncate(value, max = 220) {
  const text = clean(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}.`;
}

function slug(value) {
  return (
    clean(value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "opportunity"
  );
}

function uniqueId(base, seen) {
  const original = slug(base);
  let id = original;
  let n = 2;
  while (seen.has(id)) {
    id = `${original}-${n}`;
    n += 1;
  }
  seen.add(id);
  return id;
}

function compactList(values, fallback) {
  const result = [];
  for (const value of values) {
    const item = clean(value);
    if (item && !result.includes(item)) result.push(item);
  }
  return result.length ? result : fallback;
}

function fieldsFromText(text, seed = []) {
  const haystack = text.toLowerCase();
  const fields = [...seed];

  const add = (field, pattern) => {
    if (pattern.test(haystack) && !fields.includes(field)) fields.push(field);
  };

  add("STEM", /\b(stem|science|technology|engineering|math|coding|computer|robotics|data|ai)\b/);
  add("Research", /\b(research|lab|science fair|investigation)\b/);
  add("Arts", /\b(art|arts|music|theater|film|dance|creative|design|media|writing)\b/);
  add("Civic Leadership", /\b(civic|leadership|community|advocacy|government|policy|public service)\b/);
  add("Career", /\b(career|job|workforce|employment|internship|apprentice|training)\b/);
  add("College Access", /\b(college|scholarship|financial aid|admission|sat|act)\b/);
  add("Education", /\b(school|education|academic|tutor|homework|learning)\b/);
  add("Environment", /\b(environment|climate|park|garden|conservation|sustainability)\b/);
  add("Health", /\b(health|wellness|medical|mental health|nutrition)\b/);
  add("Business", /\b(business|entrepreneur|finance|startup)\b/);

  return compactList(fields.slice(0, 5), ["Education"]);
}

function categoryFromText(text, fallback = "Summer Program") {
  const haystack = text.toLowerCase();
  if (/scholarship|financial aid|grant/.test(haystack)) return "Scholarship";
  if (/\b(competition|contest|challenge|olympiad|hackathon|fair)\b/.test(haystack)) return "Competition";
  if (/internship|apprentice|job|employment|workforce|paid work/.test(haystack)) return "Internship";
  if (/\b(volunteer|service learning|community service)\b/.test(haystack)) return "Volunteer";
  if (/research|lab/.test(haystack)) return "Research";
  if (/fellowship|leadership|civic|mentorship/.test(haystack)) return "Fellowship";
  if (/summer|camp|after school|afterschool/.test(haystack)) return "Summer Program";
  return fallback;
}

function costFromText(text) {
  const haystack = text.toLowerCase();
  if (/stipend|paid internship|paid position|salary|wage|employment|summer youth employment/.test(haystack)) {
    return "Stipend";
  }
  if (/fee|tuition|costs?\s+\$|paid program/.test(haystack) && !/free|no cost/.test(haystack)) {
    return "Paid";
  }
  return "Free";
}

function gradesFromText(text) {
  const haystack = text.toLowerCase();
  const grades = new Set();
  for (const match of haystack.matchAll(/\b(?:grade|gr\.?|grades)\s*(\d{1,2})(?:\s*[-to]+\s*(\d{1,2}))?/g)) {
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    for (let grade = start; grade <= end; grade += 1) {
      if (grade >= 9 && grade <= 12) grades.add(grade);
    }
  }
  if (/high school|teen|age 14|age 15|age 16|age 17|14-17|13-18|youth|young people/.test(haystack)) {
    [9, 10, 11, 12].forEach((grade) => grades.add(grade));
  }
  if (!grades.size) [9, 10, 11, 12].forEach((grade) => grades.add(grade));
  return [...grades].sort((a, b) => a - b);
}

function formatFromText(text) {
  const haystack = text.toLowerCase();
  if (/online|virtual|remote/.test(haystack) && /in-person|in person|site|center|campus/.test(haystack)) {
    return "Hybrid";
  }
  if (/online|virtual|remote/.test(haystack)) return "Online";
  return "In-person";
}

function normalizeCityState(addresses = [], fallbackCity = "San Francisco") {
  const firstAddress = Array.isArray(addresses) ? addresses[0] : null;
  const rawCity = clean(firstAddress?.city || fallbackCity);
  const city = titleCase(rawCity || fallbackCity);
  const state = clean(firstAddress?.state) || US_STATES_BY_CITY.get(rawCity.toLowerCase()) || "California";
  return `${city}, ${state}, USA`;
}

function normalizeNpsLocation(park) {
  const addresses = Array.isArray(park.addresses) ? park.addresses : [];
  const physical = addresses.find((address) => clean(address.type).toLowerCase() === "physical") || addresses[0];
  const city = titleCase(clean(physical?.city));
  const stateCode = clean(physical?.stateCode || park.states?.split(",")[0]).toUpperCase();
  const state = US_STATE_BY_CODE[stateCode] || clean(park.states) || "USA";
  return city ? `${city}, ${state}, USA` : `${state}, USA`;
}

function getArray(value) {
  return Array.isArray(value) ? value.map(clean).filter(Boolean) : [];
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function isReachable(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; HSOOpportunityGenerator/1.0; +https://localhost)",
      },
    });
    await response.body?.cancel();
    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function isNycRelevant(row) {
  const type = clean(row.program_type);
  const age = clean(row.grade_level_age_group);
  const text = `${type} ${age} ${row.program} ${row.site_name} ${row.agency}`.toLowerCase();

  if (/older adult|senior center|adult education/.test(text) && !/youth|teen|high school/.test(text)) {
    return false;
  }

  return /high school|teen|youth|young adult|jobs?|internship|employment|after-school|after school|summer|grade|13|14|15|16|17|18|21|24/.test(
    text,
  );
}

function mapNycRows(rows, seenIds, seenFingerprints) {
  const opportunities = [];

  for (const row of rows) {
    if (!isNycRelevant(row)) continue;

    const program = clean(row.program) || "NYC Youth Program";
    const site = clean(row.site_name);
    const agency = clean(row.agency) || "NYC Department of Youth and Community Development";
    const type = clean(row.program_type);
    const gradeAge = clean(row.grade_level_age_group);
    const borough = clean(row.borough_community) || "New York";
    const contact = clean(row.contact_number);
    const text = `${program} ${site} ${agency} ${type} ${gradeAge}`;
    const title = truncate(site ? `${program} at ${site}` : program, 95);
    const location = `${titleCase(borough.replace(/^Staten Island.*$/i, "Staten Island"))}, New York, USA`;
    const fingerprint = `${title.toLowerCase()}|${agency.toLowerCase()}|${location.toLowerCase()}`;

    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    opportunities.push({
      id: uniqueId(`nyc-dycd-${program}-${site || agency}`, seenIds),
      title,
      org: truncate(agency, 90),
      category: categoryFromText(text, /youth employment|jobs|internship/i.test(type) ? "Internship" : "Summer Program"),
      fields: fieldsFromText(text, ["NYC DYCD"]),
      location,
      format: "In-person",
      cost: costFromText(text),
      grades: gradesFromText(`${text} high school`),
      deadline: null,
      prestige: 1,
      blurb: truncate(
        [
          "Official NYC DYCD youth opportunity listing.",
          type ? `Program type: ${type}.` : "",
          gradeAge ? `Eligibility: ${gradeAge}.` : "",
          site ? `Site: ${site}.` : "",
          contact ? `Contact: ${contact}.` : "",
        ].join(" "),
        260,
      ),
      url: clean(row[":id"])
        ? `${NYC_DYCD_ROW_PAGE}?row_id=${encodeURIComponent(clean(row[":id"]))}`
        : NYC_DYCD_FINDER,
    });
  }

  return opportunities;
}

async function fetchSfResources() {
  const resources = [];
  let page = 1;
  let found = 0;

  do {
    const params = new URLSearchParams({
      q: "*",
      query_by: "name,description,organization_name,categories,subcategories",
      per_page: "250",
      page: String(page),
    });
    const data = await fetchJson(`${SF_TYPESENSE_URL}?${params}`, {
      headers: { "X-TYPESENSE-API-KEY": SF_TYPESENSE_KEY },
    });
    found = Number(data.found || 0);
    const hits = Array.isArray(data.hits) ? data.hits : [];
    resources.push(...hits.map((hit) => hit.document).filter(Boolean));
    page += 1;
  } while (resources.length < found);

  return resources;
}

function isSfRelevant(doc) {
  const categories = getArray(doc.categories);
  const subcategories = getArray(doc.subcategories);
  const eligibilities = getArray(doc.eligibilities);
  const text = `${doc.name} ${doc.description} ${doc.organization_name} ${categories.join(" ")} ${subcategories.join(
    " ",
  )} ${eligibilities.join(" ")}`;

  const hasYouthAge = eligibilities.some((item) => /age 14-17|age 18-24|youth|teen/i.test(item));
  const hasOpportunityCategory = categories.some((item) =>
    /Youth Jobs, Training and Life Skills|After School & Summer Programs/i.test(item),
  );
  const hasSupportCategory = categories.some((item) => /Education|Arts & Culture/i.test(item));
  const hasStrongSubcategory = subcategories.some((item) => STRONG_SF_SUBCATEGORIES.has(item));
  const hasOpportunityText =
    /(program|class|camp|workshop|internship|apprentice|job readiness|career|college|summer program|after school|afterschool|mentorship|leadership|workforce|scholarship|competition|fellowship|volunteer|youth council|academy|pathway|club|course|cohort|tutoring|homework help)/i.test(
      text,
    );

  const pureAdultOrFamily =
    /adult|senior|older adult|parent|caregiver|childcare|early childhood/i.test(text) &&
    !/(teen|youth|high school|student|14-17|18-24|internship|college)/i.test(text);

  const serviceOnly =
    /(hotline|reporting|reportings|rapid response|legal aid|food pantry|housing|rent assistance|case management|health clinic|clinic|crisis|emergency|referral|benefits|tax help|meal service|shelter)/i.test(
      text,
    ) && !(hasOpportunityCategory || hasStrongSubcategory);

  const recreationOnly =
    /(zumba|pickleball|open gym|drop-in fitness|yoga|aerobics|senior exercise)/i.test(text) &&
    !/(teen|youth|high school|internship|leadership|career|college|after school|summer program)/i.test(text);

  if (pureAdultOrFamily || serviceOnly || recreationOnly) return false;

  return (
    hasOpportunityCategory ||
    hasStrongSubcategory ||
    (hasYouthAge && hasSupportCategory && hasOpportunityText) ||
    /(internship|apprenticeship|fellowship|scholarship|competition|youth council|high school.{0,40}program|teen.{0,40}program)/i.test(
      text,
    )
  );
}

function mapSfResources(resources, seenIds, seenFingerprints) {
  const opportunities = [];

  for (const doc of resources) {
    if (!isSfRelevant(doc)) continue;

    const name = clean(doc.name) || "San Francisco Youth Opportunity";
    const org = clean(doc.organization_name) || "Our415 Partner Organization";
    const categories = getArray(doc.categories);
    const subcategories = getArray(doc.subcategories);
    const eligibilities = getArray(doc.eligibilities);
    const description = clean(doc.description);
    const text = `${name} ${org} ${description} ${categories.join(" ")} ${subcategories.join(" ")} ${eligibilities.join(
      " ",
    )}`;
    const title = truncate(name === org ? name : `${name} - ${org}`, 95);
    const location = normalizeCityState(doc.addresses, "San Francisco");
    const fingerprint = `${title.toLowerCase()}|${org.toLowerCase()}|${location.toLowerCase()}`;

    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    const idPart = clean(doc.id || name);
    const url = `https://www.our415.org/services/${encodeURIComponent(idPart)}`;

    opportunities.push({
      id: uniqueId(`sf-our415-${idPart}-${name}`, seenIds),
      title,
      org: truncate(org, 90),
      category: categoryFromText(
        text,
        categories.some((item) => /Youth Jobs/i.test(item)) ? "Internship" : "Summer Program",
      ),
      fields: fieldsFromText(text, ["San Francisco"]),
      location,
      format: formatFromText(text),
      cost: costFromText(text),
      grades: gradesFromText(`${text} high school teen`),
      deadline: null,
      prestige: 1,
      blurb: truncate(
        [
          description || "Official Our415 youth and family opportunity listing.",
          categories.length ? `Categories: ${categories.slice(0, 3).join(", ")}.` : "",
          subcategories.length ? `Focus: ${subcategories.slice(0, 3).join(", ")}.` : "",
        ].join(" "),
        260,
      ),
      url,
    });
  }

  return opportunities;
}

function mapNpsParks(parks, seenIds, seenFingerprints) {
  const opportunities = [];

  for (const park of parks) {
    const name = clean(park.fullName);
    const url = clean(park.opportunityUrl);
    if (!name || !url) continue;

    const location = normalizeNpsLocation(park);
    const title = truncate(`NPS Youth and Volunteer Opportunities at ${name}`, 95);
    const fingerprint = `${title.toLowerCase()}|national park service|${location.toLowerCase()}`;

    if (seenFingerprints.has(fingerprint)) continue;
    seenFingerprints.add(fingerprint);

    opportunities.push({
      id: uniqueId(`nps-${park.parkCode || name}-youth-volunteer`, seenIds),
      title,
      org: "National Park Service",
      category: "Volunteer",
      fields: ["Environment", "Civic Leadership", "Career"],
      location,
      format: "In-person",
      cost: "Free",
      grades: [9, 10, 11, 12],
      deadline: null,
      prestige: 1,
      blurb: truncate(
        `Official NPS park page for youth, volunteer, education, conservation, and service opportunities. ${clean(
          park.description,
        )}`,
        260,
      ),
      url,
    });
  }

  return opportunities;
}

async function withValidNpsVolunteerLinks(parks) {
  const checked = await mapLimit(parks, 18, async (park) => {
    const parkCode = clean(park.parkCode).toLowerCase();
    if (!parkCode) return null;

    const opportunityUrl = `https://www.nps.gov/${parkCode}/getinvolved/volunteer.htm`;
    const reachable = await isReachable(opportunityUrl);
    return reachable ? { ...park, opportunityUrl } : null;
  });

  return checked.filter(Boolean);
}

function renderTs(opportunities, meta) {
  const body = JSON.stringify(opportunities, null, 2)
    .split("\n")
    .map((line) => (line ? line : ""))
    .join("\n");

  return `import type { Opportunity } from "@/data/opportunities";

// Generated by scripts/generate-bulk-opportunities.mjs.
// Sources: NYC DYCD Open Data, San Francisco Our415, and the National Park Service API.
// Last generated: ${new Date().toISOString()}
// Source counts: NYC ${meta.nycCount}, SF ${meta.sfCount}, NPS ${meta.npsCount}, total ${opportunities.length}.
export const generatedBulkOpportunities: Opportunity[] = ${body};
`;
}

async function main() {
  const seenIds = new Set();
  const seenFingerprints = new Set();

  const [nycRows, sfResources, npsData] = await Promise.all([
    fetchJson(NYC_DYCD_API),
    fetchSfResources(),
    fetchJson(NPS_PARKS_API),
  ]);
  const nycOpportunities = mapNycRows(nycRows, seenIds, seenFingerprints);
  const sfOpportunities = mapSfResources(sfResources, seenIds, seenFingerprints);
  const validNpsParks = await withValidNpsVolunteerLinks(Array.isArray(npsData.data) ? npsData.data : []);
  const npsOpportunities = mapNpsParks(validNpsParks, seenIds, seenFingerprints);
  const opportunities = [...nycOpportunities, ...sfOpportunities, ...npsOpportunities].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  await writeFile(
    OUT_FILE,
    renderTs(opportunities, {
      nycCount: nycOpportunities.length,
      sfCount: sfOpportunities.length,
      npsCount: npsOpportunities.length,
    }),
  );

  console.log(
    JSON.stringify(
      {
        output: OUT_FILE.pathname,
        nyc: nycOpportunities.length,
        sf: sfOpportunities.length,
        nps: npsOpportunities.length,
        total: opportunities.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
