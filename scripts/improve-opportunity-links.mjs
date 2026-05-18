import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPORT_DIR = path.join(ROOT, "reports");
const BUNDLE_FILE = path.join(REPORT_DIR, "opportunities.link-quality.bundle.mjs");
const JSON_REPORT = path.join(REPORT_DIR, "link-quality-report.json");
const SUMMARY_REPORT = path.join(REPORT_DIR, "link-quality-report-summary.txt");
const QUALITY_MODULE = path.join(ROOT, "src/data/linkQuality.generated.ts");
const CONCURRENCY = 14;
const REQUEST_TIMEOUT_MS = 16000;
const BODY_SNIFF_BYTES = 140000;
const APPLY = process.argv.includes("--apply");

const LINK_QUALITY = {
  exact: "exact_program",
  category: "category_page",
  generic: "generic_homepage",
  broken: "broken",
};

const EDITABLE_DATA_FILES = [
  "src/data/opportunities.ts",
  "src/data/stateOpportunities.ts",
  "src/data/additionalUsOpportunities.ts",
];

const GENERATED_EXACT_PATTERNS = [
  /^nyc-dycd-/,
  /^sf-our415-/,
  /^nps-/,
];

const OFFICIAL_ROOT_PROGRAM_IDS = new Set([
  "pioneer",
  "promys",
  "hmmt",
  "pumac",
  "usaco",
  "ipho",
  "usabo",
  "icho",
  "usaaao",
  "ieso",
  "ssp",
  "brown-pre-college",
  "syp-uchicago",
  "hampshire",
  "ill-mathematics",
  "ai4all",
  "yale-mun",
  "khan-academy",
  "brilliant",
  "aops",
  "picoctf",
  "idealab",
  "volunteer-match",
  "stem-saturday",
  "girls-write",
  "youth-for-understanding",
  "worldquant-uni",
  "826",
  "aas-blue",
  "aspire-summit",
  "coca",
  "congress-bundestag",
  "congressional-app",
  "cty",
  "dca",
  "emory-pre",
  "future-city",
  "horatio-alger",
  "horizon",
  "ilo",
  "imo",
  "indigo",
  "ioi",
  "jea",
  "kaist-summer",
  "leangap",
  "model-un",
  "national-history-day",
  "notre-dame",
  "polygence",
  "projekt-nyc",
  "scholastic",
  "syp-utexas",
  "usef",
  "wikimedia",
  "state-arizona-keys",
  "state-new-jersey-stem-scholars",
  "state-pennsylvania-pgss",
  "state-rhode-island-brown-precollege",
  "state-vermont-giv",
  "state-wisconsin-badger",
  "blue-ocean-entrepreneurship",
  "bpl-librarians-tomorrow",
  "amfar",
  "ayusa",
  "bmt",
  "cern-summer",
  "climate-cardinal",
  "columbia-brainyac",
  "columbia-double-discovery",
  "cuny-hires",
  "dell",
  "ds-davis",
  "fermi",
  "global-water-challenge",
  "google-csi",
  "harvard-mun",
  "ibo",
  "imc",
  "immerse-research",
  "inspire",
  "ioaa",
  "iwp",
  "mathcamp",
  "mathworks",
  "mcny-reach",
  "naval-seap",
  "nyc-industry-scholars",
  "o-henry",
  "oliver-scholars",
  "posse",
  "ross",
  "rustic",
  "rsi-canada",
  "simr",
  "smt",
  "solomon-leadership-nyc",
  "stamps",
  "stargate",
  "state-wyoming-space-grant",
  "state-dc-mbsyep",
  "state-montana-learning-center",
  "state-nebraska-yns",
  "state-new-mexico-supercomputing",
  "state-oklahoma-osai",
  "state-oregon-saturday-ase",
  "the-door-jobs",
  "technovation",
  "ttsf",
  "worldquant",
  "ylc",
  "yyas-online",
  "zero-robotics",
]);

// Official deep-link fixes. Keep this list boring and evidence-based:
// the target must be an official organization, school, .edu, .gov, or program host page.
const CURATED_REPLACEMENTS = [
  ["nyt-essay", "https://www.nytimes.com/section/learning", "https://www.nytimes.com/spotlight/learning-contests", LINK_QUALITY.category, "NYT Learning Network contest hub is closer than the general Learning section."],
  ["junior-academy", "https://www.nyas.org/learning/school-community-programs/", "https://www.nyas.org/learning/high-school-research-programs/the-junior-academy/", LINK_QUALITY.exact, "NYAS exact Junior Academy page."],
  ["lumiere", "https://www.lumiere-education.com", "https://www.lumiere-education.com/students/application", LINK_QUALITY.exact, "Lumiere student application page."],
  ["concord", "https://tcr.org", "https://www.tcr.org/submit", LINK_QUALITY.exact, "The Concord Review submission page."],
  ["putnam-jr", "https://www.mathcounts.org", "https://www.mathcounts.org/programs/mathcounts-competition-series", LINK_QUALITY.exact, "MATHCOUNTS Competition Series page."],
  ["nslc", "https://www.nslcleaders.org", "https://www.nslcleaders.org/dates-locations/", LINK_QUALITY.category, "NSLC dates and locations page gets students into program choices faster."],
  ["syp-cornell", "https://sce.cornell.edu/news-event/precollege-online/", "https://sce.cornell.edu/precollege/", LINK_QUALITY.exact, "Cornell Precollege Studies official page."],
  ["syp-penn", "https://hs.sas.upenn.edu/", "https://hs.sas.upenn.edu/summer-programs", LINK_QUALITY.exact, "Penn high school summer programs page."],
  ["cfar", "https://cosmos.ucop.edu", "https://cosmos-ucop.ucdavis.edu/app/main", LINK_QUALITY.exact, "Current UC COSMOS application/program portal."],
  ["state-california-cosmos", "https://cosmos.ucsc.edu/", "https://cosmos-ucop.ucdavis.edu/app/main", LINK_QUALITY.exact, "Current UC COSMOS application/program portal."],
  ["hsyl", "https://hoby.org", "https://hoby.org/programs/", LINK_QUALITY.category, "HOBY programs page."],
  ["hyrope", "https://www.hpair.org", "https://www.hpair.org/", LINK_QUALITY.category, "HPAIR official site includes the Youth Leadership Summit entry point."],
  ["breakthrough", "https://www.breakthroughcollaborative.org", "https://www.breakthroughcollaborative.org/students/", LINK_QUALITY.exact, "Breakthrough student page."],
  ["gates", "https://www.thegatesscholarship.org", "https://www.thegatesscholarship.org/scholarship/", LINK_QUALITY.exact, "The Gates Scholarship program page."],
  ["ron-brown", "https://www.ronbrown.org", "https://ronbrown.org/apply/ron-brown-scholarship/", LINK_QUALITY.exact, "Ron Brown application page."],
  ["hagan", "https://haganscholarships.org", "https://haganscholarships.org/application/", LINK_QUALITY.exact, "Hagan application page."],
  ["uwc", "https://uwc.org/", "https://uwc.org/how-to-apply/", LINK_QUALITY.exact, "UWC application page."],
  ["operation-wallacea", "https://www.opwall.com", "https://www.opwall.com/schools/", LINK_QUALITY.category, "Operation Wallacea school expeditions entry point."],
  ["fbla", "https://www.fbla.org", "https://www.fbla.org/high-school/", LINK_QUALITY.exact, "FBLA high school page."],
  ["hosa", "https://hosa.org", "https://hosa.org/competitive-events-2/", LINK_QUALITY.exact, "HOSA competitive events page."],
  ["skillsusa", "https://www.skillsusa.org", "https://www.skillsusa.org/competitions/skillsusa-championships/", LINK_QUALITY.exact, "SkillsUSA Championships page."],
  ["tsa", "https://tsaweb.org", "https://tsaweb.org/competitions", LINK_QUALITY.exact, "TSA competitions page."],
  ["army-rebotics", "https://www.stellarxplorers.org/", "https://www.stellarxplorers.org/competition.html", LINK_QUALITY.exact, "StellarXplorers competition page."],
  ["siemens", "https://www.nlr.gov/", "https://usaeop.com/type/competitions/", LINK_QUALITY.category, "AEOP competitions page; the older Junior Solar Sprint path is no longer live."],
  ["edx-hs", "https://www.edx.org", "https://www.edx.org/high-school", LINK_QUALITY.category, "edX high school page."],
  ["coursera-fa", "https://www.coursera.org", "https://blog.coursera.org/courseras-financial-aid-what-it-is-and-who-is/", LINK_QUALITY.exact, "Official Coursera financial aid explainer."],
  ["ibm-skills", "https://skillsbuild.org", "https://skillsbuild.org/students", LINK_QUALITY.exact, "IBM SkillsBuild students page."],
  ["cyber-patriot", "https://www.uscyberpatriot.org", "https://www.uscyberpatriot.org/competition/Competition-Overview/competition-overview", LINK_QUALITY.exact, "CyberPatriot competition overview page."],
  ["ymf", "https://fromthetop.org/", "https://fromthetop.org/apply/", LINK_QUALITY.exact, "From the Top apply page."],
  ["envision", "https://www.envisionexperience.com", "https://www.envisionexperience.com/educational-experiences", LINK_QUALITY.category, "Envision educational experiences page."],
  ["dosomething", "https://dosomething.org/", "https://dosomething.org/take-action", LINK_QUALITY.category, "DoSomething campaign action page."],
  ["teen-treks", "https://www.arccprograms.com", "https://arccprograms.com/summer-overview/summer-programs-high-school/", LINK_QUALITY.exact, "ARCC high school summer programs page."],
  ["project-lead-the-way", "https://www.pltw.org", "https://www.pltw.org/curriculum", LINK_QUALITY.category, "PLTW curriculum page."],
  ["nsli-y", "https://www.nsliforyouth.org", "https://www.nsliforyouth.org/", LINK_QUALITY.exact, "NSLI-Y official program site."],
  ["nytlearning-photo", "https://www.nytimes.com/section/learning", "https://www.nytimes.com/spotlight/learning-contests", LINK_QUALITY.category, "NYT Learning Network contest hub."],
  ["nytlearning-podcast", "https://www.nytimes.com/section/learning", "https://www.nytimes.com/spotlight/learning-contests", LINK_QUALITY.category, "NYT Learning Network contest hub."],
  ["acl", "https://www.law.nyu.edu", "https://www.sps.nyu.edu/high-school-academy/programs/career-edge/courses/HIGH1-CE9049.html", LINK_QUALITY.exact, "NYU SPS Pre-Law Bootcamp exact course page."],
  ["yale-law-summer", "https://law.yale.edu", "https://globalscholars.yale.edu/politics-law-economics", LINK_QUALITY.exact, "YYGS Politics of Law & Economics exact track page."],
  ["moma-teens", "https://www.moma.org/collection/terms/", "https://www.moma.org/calendar/groups/55", LINK_QUALITY.category, "MoMA calendar group for teen programming."],
  ["nybg-explainers", "https://www.nybg.org/", "https://www.nybg.org/education/childrens-education/kids-teens/explainers/", LINK_QUALITY.exact, "NYBG Explainers page."],
  ["aha", "https://www.heart.org", "https://www.heart.org/en/affiliates/how-we-are-educating-the-women-of-tomorrow-with-stem", LINK_QUALITY.exact, "AHA STEM Goes Red explainer page, not the generic Heart.org homepage."],
  ["amigos", "https://amigosinternational.org", "https://amigosinternational.org/amigos-programs/", LINK_QUALITY.exact, "AMIGOS teen volunteer abroad programs page."],
  ["usra", "https://www.usra.edu", "https://heliophysics.ucar.edu/summer-school", LINK_QUALITY.exact, "NASA/UCAR Heliophysics Summer School exact page."],
  ["state-florida-sstp", "https://www.cpet.ufl.edu/", "https://www.cpet.ufl.edu/students/uf-cpet-summer-programs/student-science-training-program/", LINK_QUALITY.exact, "UF Student Science Training Program exact page."],
  ["nyu-precollege", "https://www.nyu.edu/admissions/high-school-and-middle-school-programs/high-school-programs/nyu-precollege/application-information.html?challenge=d06e90d7-4d8f-4b88-9d8c-10b73beb60f1", "https://www.nyu.edu/admissions/high-school-and-middle-school-programs/high-school-programs/nyu-precollege/application-information.html", LINK_QUALITY.exact, "Clean NYU Precollege application information page without stale challenge token."],
  ["egfi", "https://discovere.org", "https://discovere.org/programs/", LINK_QUALITY.category, "DiscoverE programs page is more direct than the homepage."],
  ["nfte", "https://nfte.com/", "https://nfte.com/events/national-youth-entrepreneurship-challenge/", LINK_QUALITY.exact, "NFTE National Youth Entrepreneurship Challenge page."],
  ["mites", "https://mites.mit.edu/", "https://mites.mit.edu/discover-mites/mites-summer/", LINK_QUALITY.exact, "MITES Summer exact page."],
  ["wharton-global", "https://globalyouth.wharton.upenn.edu", "https://globalyouth.wharton.upenn.edu/summer-high-school-programs/", LINK_QUALITY.exact, "Wharton Global Youth high school summer programs page."],
  ["kode-with-klossy", "https://www.kodewithklossy.com", "https://www.kodewithklossy.com/programs", LINK_QUALITY.exact, "Kode With Klossy programs page."],
  ["malala", "https://malala.org/", "https://assembly.malala.org/about", LINK_QUALITY.exact, "Assembly by Malala Fund exact publication/about page."],
  ["usra-marsfound", "https://www.marssociety.org", "https://chapters.marssociety.org/youth/", LINK_QUALITY.exact, "Mars Society Youth Chapter page."],
  ["rhsa", "https://www.walnuthillarts.org", "https://www.walnuthillarts.org/summer", LINK_QUALITY.exact, "Walnut Hill summer programs page."],
  ["columbia-freedom-citizenship", "https://freedomandcitizenship.columbia.edu/", "https://freedomandcitizenship.columbia.edu/our-program", LINK_QUALITY.exact, "Columbia Freedom and Citizenship program details page."],
  ["rhodes", "https://www.rhodeshouse.ox.ac.uk", "https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/", LINK_QUALITY.exact, "Rhodes Scholarship exact page."],
  ["syp-michigan", "https://lsa.umich.edu/mmss", "https://sites.lsa.umich.edu/mmss/about-us/", LINK_QUALITY.exact, "Michigan Math and Science Scholars program details page."],
  ["state-montana-learning-center", "https://montanalearning.org/camps/", "https://montanalearning.org/student-programs/", LINK_QUALITY.exact, "Montana Learning Center student programs page."],
  ["girlup", "https://girlup.org", "https://girlup.org/clubs-community", LINK_QUALITY.exact, "Girl Up Clubs & Community page."],
  ["plaintext", "https://www.cyber.mil/gencyber/", "https://www.nsa.gov/Academics/For-Students/", LINK_QUALITY.category, "NSA student programs page includes GenCyber."],
  ["cee-ssp", "https://www.cee.org/programs", "https://www.cee.org", LINK_QUALITY.category, "CEE official site; the old /programs URL is no longer reliably live."],
  ["usc-summer", "https://precollege.usc.edu/summer-programs/", "https://precollege.usc.edu/summer-programs/", LINK_QUALITY.exact, "USC high school summer programs page."],
  ["girls-inc-nyc", "https://www.girlsincnyc.org/our-programs", "https://www.girlsincnyc.org/our-programs", LINK_QUALITY.exact, "Girls Inc. NYC programs page."],
  ["friendship-circle-ues", "https://www.friendshipcirclenyc.org/teen-volunteers", "https://www.friendshipcirclenyc.org/teen-volunteers", LINK_QUALITY.exact, "Friendship Circle teen volunteers page."],
  ["futures-options-internship", "https://futuresandoptions.org/our-programs/the-internship-program/", "https://futuresandoptions.org/our-programs/the-internship-program/", LINK_QUALITY.exact, "Futures and Options Internship Program page."],
  ["amc", "https://maa.org/student-programs/amc/", "https://maa.org/student-programs/amc/", LINK_QUALITY.exact, "MAA American Mathematics Competitions page."],
  ["aime", "https://maa.org/student-programs/amc/", "https://maa.org/student-programs/amc/", LINK_QUALITY.exact, "MAA American Mathematics Competitions page for the AIME pathway."],
  ["usamo", "https://maa.org/student-programs/amc/", "https://maa.org/student-programs/amc/", LINK_QUALITY.exact, "MAA American Mathematics Competitions page for USAMO/USAJMO."],
  ["sva-precollege", "https://sva.edu/academics/youth-and-teen-programs", "https://sva.edu/academics/youth-and-teen-programs", LINK_QUALITY.exact, "SVA youth and teen programs page."],
  ["pratt-precollege", "https://www.pratt.edu/continuing-and-professional-studies/precollege/", "https://www.pratt.edu/continuing-and-professional-studies/precollege/", LINK_QUALITY.exact, "Pratt PreCollege page."],
  ["fit-precollege", "https://www.fitnyc.edu/academics/precollege/index.php", "https://www.fitnyc.edu/academics/precollege/index.php", LINK_QUALITY.exact, "FIT Precollege page."],
  ["state-ohio-osc-si", "https://www.osc.edu/education/si", "https://www.osc.edu/education/si", LINK_QUALITY.exact, "Ohio Supercomputer Center Summer Institute page."],
  ["nyc-youth-action-50", "https://www.schools.nyc.gov/get-involved/students/student-opportunities", "https://www.schools.nyc.gov/get-involved/students/student-opportunities", LINK_QUALITY.category, "NYC Public Schools student opportunities page."],
  ["aspen-music", "https://www.aspenmusicfestival.com", "https://www.aspenmusicfestival.com/students-welcome/admissions/", LINK_QUALITY.exact, "Aspen Music Festival admissions page."],
  ["mit-launch", "https://www.launchx.com/", "https://www.launchx.com/programs/locationx-in-person-entrepreneurship", LINK_QUALITY.exact, "LaunchX in-person high school entrepreneurship program page."],
  ["youth-debate", "https://www.speechanddebate.org", "https://www.speechanddebate.org/nationals/", LINK_QUALITY.exact, "National Speech & Debate Tournament page."],
  ["oxford-royale", "https://www.oxfordscholastica.com", "https://www.oxfordscholastica.com/", LINK_QUALITY.exact, "Oxford Scholastica high school summer school page."],
  ["diamond-challenge", "https://diamondchallenge.org", "https://diamondchallenge.org/competition/", LINK_QUALITY.exact, "Diamond Challenge competition page."],
  ["genspace", "https://www.genspace.org", "https://www.genspace.org/high-school-students", LINK_QUALITY.exact, "Genspace high school student page."],
  ["city-as-school", "https://www.cityyear.org", "https://www.cityyear.org/apply-now", LINK_QUALITY.exact, "City Year application page."],
  ["doctors-wo-borders", "https://www.doctorswithoutborders.org/get-involved", "https://www.doctorswithoutborders.org/get-involved/volunteer", LINK_QUALITY.exact, "Doctors Without Borders volunteer page."],
  ["create-the-vote", "https://www.americansforthearts.org", "https://artsu.americansforthearts.org/advocacy", LINK_QUALITY.exact, "ArtsU arts advocacy resources page."],
  ["toronto-pre", "https://future.utoronto.ca", "https://future.utoronto.ca/equity-and-outreach-enrichment-academy", LINK_QUALITY.exact, "University of Toronto Enrichment Academy page."],
  ["tu-munich", "https://www.tum.de/en/", "https://www.edu.sot.tum.de/edu/schule/sfz/", LINK_QUALITY.exact, "TUM Schülerforschungszentrum page."],
  ["soa-shark", "https://www.soa.org", "https://www.mtfchallenge.org/", LINK_QUALITY.exact, "Modeling the Future Challenge is the official high-school actuarial/math modeling competition."],
  ["ywp", "https://www.generationcitizen.org/", "https://www.generationcitizen.org/what-we-do/in-youth-leadership/", LINK_QUALITY.exact, "Generation Citizen youth leadership page."],
];

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "high",
  "school",
  "student",
  "students",
  "program",
  "programs",
  "summer",
  "academy",
  "internship",
  "internships",
  "opportunity",
  "opportunities",
  "college",
  "precollege",
  "pre",
  "youth",
  "teen",
  "teens",
  "research",
  "scholarship",
  "competition",
  "fellowship",
  "volunteer",
  "online",
  "national",
  "international",
  "university",
  "institute",
  "center",
  "centre",
  "official",
]);

const aliasPlugin = {
  name: "hso-alias",
  setup(build) {
    build.onResolve({ filter: /^@\// }, (args) => {
      const resolved = path.join(ROOT, "src", args.path.slice(2));
      return { path: /\.(ts|tsx|js|jsx|mjs|cjs|json)$/i.test(resolved) ? resolved : `${resolved}.ts` };
    });
  },
};

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return normalize(value)
    .split(" ")
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));
}

function unique(values) {
  return [...new Set(values)];
}

function isGeneratedExact(id) {
  return GENERATED_EXACT_PATTERNS.some((pattern) => pattern.test(id));
}

function isOfficialRootProgram(id) {
  return OFFICIAL_ROOT_PROGRAM_IDS.has(id);
}

function stripTags(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(snippet) {
  return stripTags(snippet.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function urlInfo(url) {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const broadRoot = pathParts.length === 0 || (pathParts.length === 1 && /^index\.(html?|php)$/i.test(pathParts[0]));
    return {
      ok: true,
      host: parsed.hostname.replace(/^www\./, ""),
      pathname: parsed.pathname,
      pathParts,
      broadRoot,
      isOfficialHost: /\.(edu|gov)$/i.test(parsed.hostname) || /\.(edu|gov)\//i.test(`${parsed.hostname}/`),
      normalizedUrl: normalize(`${parsed.hostname} ${parsed.pathname} ${parsed.search}`),
    };
  } catch {
    return { ok: false, host: "", pathname: "", pathParts: [], broadRoot: true, isOfficialHost: false, normalizedUrl: "" };
  }
}

function isSoftNotFound(text) {
  const normalized = normalize(text).slice(0, 7000);
  return [
    "page not found",
    "404 not found",
    "error 404",
    "we cant find that page",
    "we can t find that page",
    "the page you requested could not be found",
    "does not exist",
  ].some((phrase) => normalized.includes(phrase));
}

async function loadOpportunities() {
  await mkdir(REPORT_DIR, { recursive: true });
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, "src/data/opportunities.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    plugins: [aliasPlugin],
    logLevel: "silent",
  });
  await writeFile(BUNDLE_FILE, result.outputFiles[0].text);
  const mod = await import(`${pathToFileURL(BUNDLE_FILE).href}?t=${Date.now()}`);
  return mod.opportunities;
}

async function applyCuratedReplacements() {
  const replacementsById = new Map(CURATED_REPLACEMENTS.map(([id, oldUrl, newUrl, expectedQuality, reason]) => [id, { oldUrl, newUrl, expectedQuality, reason }]));
  const edits = [];

  for (const relativeFile of EDITABLE_DATA_FILES) {
    const file = path.join(ROOT, relativeFile);
    let content = await readFile(file, "utf8");
    let changed = false;
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
      const idMatch = lines[i].match(/\bid:\s*"([^"]+)"/);
      if (!idMatch) continue;
      const id = idMatch[1];
      const replacement = replacementsById.get(id);
      if (!replacement) continue;
      const urlMatch = lines[i].match(/\burl:\s*"([^"]+)"/);
      if (!urlMatch) continue;
      const currentUrl = urlMatch[1];
      if (currentUrl === replacement.newUrl) {
        edits.push({ id, file: relativeFile, old_url: replacement.oldUrl, new_url: replacement.newUrl, status: "already_applied", reason: replacement.reason });
        continue;
      }
      if (currentUrl === replacement.oldUrl || isGenericHomepage(currentUrl) || urlInfo(currentUrl).pathParts.length <= 1) {
        lines[i] = lines[i].replace(/\burl:\s*"[^"]+"/, `url: "${replacement.newUrl}"`);
        edits.push({ id, file: relativeFile, old_url: currentUrl, new_url: replacement.newUrl, status: APPLY ? "applied" : "would_apply", reason: replacement.reason });
        changed = true;
      }
    }

    if (APPLY && changed) {
      content = lines.join("\n");
      await writeFile(file, content, "utf8");
    }
  }

  return edits;
}

function isGenericHomepage(url) {
  const info = urlInfo(url);
  return !info.ok || info.broadRoot;
}

async function fetchSnippet(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; HSOLinkQuality/1.0; +https://localhost)",
        accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
    });

    const snippet = response.status >= 200 && response.status < 400 ? await readSnippet(response) : "";
    if (!snippet) await response.body?.cancel();
    return { status: response.status, finalUrl: response.url, snippet, error: null };
  } catch (error) {
    return {
      status: null,
      finalUrl: null,
      snippet: "",
      error: error?.name === "AbortError" ? "timeout" : String(error?.message || error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function readSnippet(response) {
  const reader = response.body?.getReader?.();
  if (!reader) return "";
  const chunks = [];
  let total = 0;
  try {
    while (total < BODY_SNIFF_BYTES) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      total += value.byteLength;
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // The remote server may already have closed the stream.
    }
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

function curatedExpectedQuality(id, url) {
  const row = CURATED_REPLACEMENTS.find(([replacementId, , newUrl]) => replacementId === id && newUrl === url);
  return row?.[3] || null;
}

function classifyOpportunityLink(opp, fetchResult) {
  const info = urlInfo(opp.url);
  const pageTitle = extractTitle(fetchResult.snippet);
  const pageText = normalize(`${pageTitle} ${stripTags(fetchResult.snippet.slice(0, BODY_SNIFF_BYTES))}`);
  const urlText = info.normalizedUrl;
  const titleTokens = unique(tokens(opp.title));
  const orgTokens = unique(tokens(opp.org));
  const titleHits = titleTokens.filter((token) => pageText.includes(token) || urlText.includes(token));
  const urlTitleHits = titleTokens.filter((token) => urlText.includes(token));
  const pageTitleHits = titleTokens.filter((token) => normalize(pageTitle).includes(token));
  const orgHits = orgTokens.filter((token) => pageText.includes(token) || urlText.includes(token));
  const botBlocked = fetchResult.status === 403 || fetchResult.status === 429;
  const serverBlockedOrUnstable = fetchResult.status >= 500 && fetchResult.status < 600;
  const broken =
    (!botBlocked && fetchResult.status >= 400 && fetchResult.status < 500) ||
    (!botBlocked && !serverBlockedOrUnstable && fetchResult.snippet && isSoftNotFound(`${pageTitle} ${fetchResult.snippet.slice(0, 8000)}`));
  const exactSource = isGeneratedExact(opp.id) || isOfficialRootProgram(opp.id);
  const expectedQuality = curatedExpectedQuality(opp.id, opp.url);
  const programDirectory =
    /apply|application|admission|program|course|summer|precollege|pre-college|intern|volunteer|education|high-school|teen|youth|academy|scholar|competition|contest|fellow|research|curriculum|students|overview|dates|locations|resources|prep/i.test(
      info.pathname,
    );

  let score = 0;
  const reasons = [];

  if (broken) reasons.push("broken-or-soft-not-found");
  if (!fetchResult.status) reasons.push("fetch-error-unverified");
  if (botBlocked) reasons.push("bot-blocked-verification");
  if (serverBlockedOrUnstable) reasons.push("server-error-unverified");
  if (exactSource) {
    score += 45;
    reasons.push(isGeneratedExact(opp.id) ? "generated-official-source" : "official-root-program-site");
  }
  if (expectedQuality === LINK_QUALITY.exact) {
    score += 45;
    reasons.push("curated-exact-program-url");
  } else if (expectedQuality === LINK_QUALITY.category) {
    score += 25;
    reasons.push("curated-category-url");
  }
  if (pageTitleHits.length >= 2) score += 25;
  else if (pageTitleHits.length === 1) score += 12;
  if (titleHits.length >= 2) score += 20;
  else if (titleHits.length === 1) score += 8;
  if (urlTitleHits.length >= 1) score += 16;
  if (orgHits.length >= 1) score += 8;
  if (info.pathParts.length >= 2) score += 8;
  if (programDirectory) score += 8;
  if (info.isOfficialHost) score += 4;
  if (info.broadRoot) {
    score -= 35;
    reasons.push("homepage-or-root-url");
  }
  if (info.pathParts.length <= 1 && !programDirectory && !exactSource) reasons.push("shallow-url-path");
  if (titleHits.length === 0 && !botBlocked && !expectedQuality) reasons.push("no-title-token-match");

  let linkQuality = LINK_QUALITY.category;
  if (broken) {
    linkQuality = LINK_QUALITY.broken;
  } else if (expectedQuality) {
    linkQuality = expectedQuality;
  } else if (score >= 55 || exactSource || expectedQuality === LINK_QUALITY.exact) {
    linkQuality = LINK_QUALITY.exact;
  } else if (info.broadRoot || (info.pathParts.length <= 1 && !programDirectory)) {
    linkQuality = LINK_QUALITY.generic;
  } else {
    linkQuality = LINK_QUALITY.category;
  }

  const needsManualReview =
    linkQuality === LINK_QUALITY.broken ||
    linkQuality === LINK_QUALITY.generic ||
    (linkQuality !== LINK_QUALITY.exact && !botBlocked && !expectedQuality && titleHits.length === 0 && score < 45);

  return {
    id: opp.id,
    title: opp.title,
    org: opp.org,
    category: opp.category,
    url: opp.url,
    final_url: fetchResult.finalUrl,
    http_status: fetchResult.status,
    page_title: pageTitle,
    link_quality: linkQuality,
    link_quality_score: Math.max(0, Math.min(100, score)),
    reasons,
    title_hits: titleHits,
    org_hits: orgHits,
    needs_manual_review: needsManualReview,
    suggested_search_query: `${opp.title} ${opp.org} official ${opp.category} high school`,
  };
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

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function duplicateUrls(opportunities) {
  const byUrl = new Map();
  for (const opp of opportunities) {
    if (!byUrl.has(opp.url)) byUrl.set(opp.url, []);
    byUrl.get(opp.url).push({ id: opp.id, title: opp.title });
  }
  return [...byUrl.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([url, items]) => ({ url, count: items.length, opportunities: items }));
}

async function writeQualityModule(audits) {
  const rows = Object.fromEntries(
    audits
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((item) => [
        item.id,
        {
          link_quality: item.link_quality,
          link_quality_score: item.link_quality_score,
        },
      ]),
  );
  const content = [
    "// Generated by scripts/improve-opportunity-links.mjs. Do not edit by hand.",
    'type LinkQuality = "exact_program" | "category_page" | "generic_homepage" | "broken";',
    "",
    "export const opportunityLinkQuality: Record<string, { link_quality: LinkQuality; link_quality_score: number }> = ",
    `${JSON.stringify(rows, null, 2)} as const;`,
    "",
  ].join("\n");
  await writeFile(QUALITY_MODULE, content, "utf8");
}

async function main() {
  await mkdir(REPORT_DIR, { recursive: true });
  const fixed = await applyCuratedReplacements();
  const opportunities = await loadOpportunities();
  const byUrl = new Map();
  for (const opp of opportunities) {
    if (!byUrl.has(opp.url)) byUrl.set(opp.url, []);
    byUrl.get(opp.url).push(opp);
  }

  const uniqueUrls = [...byUrl.keys()];
  const checksByUrl = new Map();
  await mapLimit(uniqueUrls, CONCURRENCY, async (url) => {
    checksByUrl.set(url, await fetchSnippet(url));
  });

  const audits = opportunities.map((opp) => classifyOpportunityLink(opp, checksByUrl.get(opp.url)));
  if (APPLY) {
    await writeQualityModule(audits);
  }
  const auditById = new Map(audits.map((item) => [item.id, item]));
  const fixedWithQuality = fixed.map((item) => {
    const audit = auditById.get(item.id);
    return {
      ...item,
      link_quality: audit?.link_quality || item.expectedQuality,
      link_quality_score: audit?.link_quality_score ?? null,
    };
  });
  const manualReview = audits
    .filter((item) => item.needs_manual_review)
    .sort((a, b) => a.link_quality_score - b.link_quality_score || a.title.localeCompare(b.title));

  const report = {
    generated_at: new Date().toISOString(),
    applied: APPLY,
    totals: {
      opportunities: opportunities.length,
      unique_urls: uniqueUrls.length,
      fixed_or_previously_fixed: fixedWithQuality.length,
      manual_review: manualReview.length,
      duplicates: duplicateUrls(opportunities).length,
    },
    quality_counts: countBy(audits, "link_quality"),
    fixed: fixedWithQuality,
    duplicate_urls: duplicateUrls(opportunities),
    manual_review: manualReview,
  };

  const summary = [
    `Generated at: ${report.generated_at}`,
    `Apply mode: ${APPLY ? "yes" : "no"}`,
    `Opportunities scanned: ${report.totals.opportunities}`,
    `Unique URLs scanned: ${report.totals.unique_urls}`,
    `Fixed or already fixed: ${report.totals.fixed_or_previously_fixed}`,
    `Manual review remaining: ${report.totals.manual_review}`,
    `Duplicate URL groups: ${report.totals.duplicates}`,
    `Quality counts: ${Object.entries(report.quality_counts).map(([quality, count]) => `${quality}=${count}`).join(", ")}`,
    "",
    "Fixed / improved links:",
    ...fixedWithQuality.map((item) => `- ${item.status}: ${item.id} | ${item.old_url} -> ${item.new_url} | ${item.link_quality} (${item.link_quality_score ?? "n/a"})`),
    "",
    "Manual review queue:",
    ...manualReview.slice(0, 80).map((item) => `- ${item.link_quality} ${item.link_quality_score}: ${item.title} | ${item.url} | ${item.reasons.join(", ")} | search: ${item.suggested_search_query}`),
  ].join("\n");

  await writeFile(JSON_REPORT, JSON.stringify(report, null, 2));
  await writeFile(SUMMARY_REPORT, summary);
  console.log(summary);

  if (manualReview.some((item) => item.link_quality === LINK_QUALITY.broken || item.link_quality === LINK_QUALITY.generic)) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
