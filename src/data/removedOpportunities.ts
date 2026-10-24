/**
 * Opportunities that are no longer listed, and where their URL should now go.
 *
 * These pages were live and are indexed: some of them still rank. Serving them the SPA
 * shell gives Google a 200 that looks like a copy of the homepage, which is why Search
 * Console reports them as "Discovered, currently not indexed" and "Excluded by noindex".
 * Every one of them gets a permanent redirect instead — to the listing that replaced it
 * where there is one, otherwise to the category it belonged to.
 *
 * `scripts/prerender.mjs` turns this map into 301 rules in the deployed _redirects file,
 * so the redirect happens at the edge before any JavaScript runs.
 */
export const REMOVED_OPPORTUNITY_REDIRECTS: Record<string, string> = {
  // Round r6 (2026-10-24): ended, paused or not for high schoolers (reasons in hsoUpdateOct2026.ts).
  "whitney-youth-insights": "/categories/internships",
  "bigelow-laboratory-for-ocean-sciences-keller-bloom-program": "/categories/research",
  // Round r4 (2026-10-22): ended, paused or not for high schoolers (reasons in hsoUpdateOct2026.ts).
  "ymca-nevada-ymca-youth-and-government": "/categories/fellowships",
  "national-institute-of-mental-health-speaking-up-about-mental-hea": "/categories/competitions",
  // Round r3 (2026-10-22): ended, paused or not for high schoolers (reasons in hsoUpdateOct2026.ts).
  "university-of-nevada-las-vegas-guic-summer-camp": "/categories/summer-programs",
  "university-of-north-carolina-wilmington-iheal-healthcare-leaders": "/categories/summer-programs",
  "university-of-southern-mississippi-marine-education-center-art-a": "/categories/summer-programs",
  "artswestchester-young-adult-leadership-council": "/categories/fellowships",
  // Round r2 (2026-10-17): ended, paused or not for high schoolers (reasons in hsoUpdateOct2026.ts).
  "union-county-youth-forward-program": "/categories/internships",
  "world-affairs-council-of-san-antonio-internships": "/categories/internships",
  "boston-debate-league-bdl-debate-camp": "/categories/summer-programs",
  "eastern-connecticut-state-university-pre-college-summer": "/categories/summer-programs",
  // Round r1 (2026-10-17): ended, paused or not for high schoolers (reasons in hsoUpdateOct2026.ts).
  "exploratorium-high-school-explainer-program": "/categories/internships",
  "la-brea-tar-pits-natural-history-museums-of-los-angeles-county-t": "/categories/internships",
  "s-w-a-g-camden-summer-intern-program": "/categories/internships",
  "shedd-aquarium-teen-work-study-program": "/categories/internships",
  // Duplicate 2026-10-17: the same Columbia program as the listing it now points to.
  "columbia-precollege-ay-weekend": "/opportunities/columbia-precollege-ay-weekend-early",
  // Removed on the live site by its own link check (2026-10-15/16); same targets as the live site.
  "fred-hutch-lab-tech": "/categories/internships",
  "state-minnesota-umtymp": "/categories/fellowships",
  "csv-sch-scholars-helping-collars-scholarship": "/categories/scholarships",
  "department-of-teacher-education-of-michigan-state-university-hig": "/categories/summer-programs",
  "university-of-illinois-chicago-s-office-of-the-vice-provost-for": "/categories/summer-programs",
  "nasa-nasa-app-development-challenge-adc": "/categories/competitions",
  "correlation-one-apex-high-school-ai-championship": "/categories/competitions",
  // Removed 2026-10-17: ended, paused, or no live official page (reasons in hsoUpdateOct2026.ts).
  "artswestchester-internship": "/categories/internships",
  "state-hawaii-hycc": "/categories/internships",
  "mcny-reach": "/categories/fellowships",
  "northwestern-university-feinberg-school-of-medicine-kimberly-que": "/categories/internships",
  "ignite-paid-internship": "/categories/internships",
  "syp-utexas": "/categories/summer-programs",
  "university-of-central-florida-competitive-programming-summer-ins": "/categories/summer-programs",
  "teachers-and-writers-collaborative-with-the-new-york-state-counc": "/categories/competitions",
  "florida-division-of-arts-and-culture-poetry-out-loud-florida": "/categories/competitions",
  "university-of-michigan-rogel-cancer-center-healthcare-experience": "/categories/summer-programs",
  "ncf-envirothon-arkansas-envirothon": "/categories/competitions",
  "junior-science-and-humanities-symposium-missouri-jshs": "/categories/competitions",
  // Removed 2026-10-17: sketchy or non-program links (Google Forms, aggregator, old blog/news pages,
  // personal or free-builder sites, an unverifiable startup). Reasons in hsoUpdateOct2026.ts.
  "clicked-learning-head-positions": "/categories/internships",
  "sortmyprep-founders-office": "/categories/internships",
  "yefa-chapter-founder-program": "/categories/fellowships",
  "hinksey-clubs": "/categories/fellowships",
  "hinksey-business-essay-competition": "/categories/competitions",
  "hinksey-research-scholars": "/categories/research",
  "world-affairs-council-of-jacksonville-high-school-internships-at": "/categories/internships",
  "the-ohio-state-university-college-of-medicine-explorations-in-ne": "/categories/research",
  "shriners-childrens-philadelphia-medical-research-summer-immersio": "/categories/summer-programs",
  "montana-technological-university-summer-environmental-engineerin": "/categories/summer-programs",
  "saint-louis-university-stars-slu": "/categories/summer-programs",
  "science-olympiad-minnesota-science-olympiad": "/categories/competitions",
  "science-olympiad-new-hampshire-science-olympiad": "/categories/competitions",
  "csv-sch-the-alert-scholarship": "/categories/scholarships",
  // Removed 2026-10-14: college or adult only (official pages quoted in hsoUpdateOct2026.ts). Nothing
  // in the catalogue replaces them, so each goes to its category.
  "davis-projects": "/categories/fellowships",
  "museum-of-fine-arts-boston-internships": "/categories/internships",
  "johns-hopkins-school-of-medicine-summer-internship-program": "/categories/internships",
  "high-museum-of-art-summer-internship-program": "/categories/internships",
  "national-gallery-of-art-summer-internships": "/categories/internships",
  "feinstein-institutes-for-medical-research-summer-student-interns": "/categories/internships",
  "university-of-tennessee-institute-of-agriculture-ut-extension-su": "/categories/internships",
  "usra": "/categories/summer-programs",
  "sfmoma-internship-program": "/categories/internships",
  "point-defiance-zoo-aquarium-paid-internship-opportunities": "/categories/internships",
  "kaggle": "/categories/competitions",
  "breakthrough": "/categories/internships",
  // Removed 2026-10-14: flagged as 18+ or college-only in the October review.
  "aspire-summit": "/categories/fellowships",
  "ds-davis": "/categories/scholarships",
  "worldquant": "/categories/competitions",
  "u-s-department-of-state-virtual-student-federal-service-vsfs": "/categories/internships",
  "csv-sch-discover-scholarship-award": "/categories/scholarships",
  // Hidden 2026-10-09: Telluride Association paused TASS for summer 2027. Restore when it reopens.
  "tasp": "/categories/summer-programs",
  // Removed 2026-10-09: middle school only (MATHCOUNTS grades 6-8, Junior Solar Sprint 5-8, Future City 6-8).
  "putnam-jr": "/categories/competitions",
  "siemens": "/categories/competitions",
  "future-city": "/categories/competitions",
  // Removed 2026-10-09: AI4ALL says it does not offer programs for high schoolers; Ignite is for college students 18+.
  "ai4all": "/categories/summer-programs",
  // Removed 2026-10-09: no current Sezzle scholarship; the listing described incoming college freshmen.
  "csv-sch-sezzle-scholarship": "/categories/scholarships",
  // Removed 2026-10-09: no Comcast Leaders and Achievers cycle announced since 2019-20.
  "comcast-leaders-achievers": "/categories/scholarships",
  // Removed 2026-10-09: no Dell program by this name; the link was Dell's general university-recruiting page.
  "dell-discover": "/categories/internships",
  // Removed 2026-10-09: AmeriCorps NCCC is for ages 18-24, after high school.
  "americorps": "/categories/fellowships",
  // Removed 2026-10-09: Dr Pepper Tuition Giveaway is for ages 18-24.
  "csv-sch-dr-pepper-tuition-giveaway": "/categories/scholarships",
  // Removed 2026-10-09: Bank of America Student Leaders now requires applicants 18+ with 12-18 college credits.
  "ayia": "/categories/internships",
  // Removed 2026-10-08: atlasfellowship.org says "we have decided not to run any future Atlas Fellowship programs."
  "atlas-fellowship": "/categories/fellowships",
  // Replaced 2026-10-08: yes-abroad.org sends 2027-28 applicants to FLEX Global Abroad, which absorbed YES Abroad.
  "yes-abroad-kennedy-lugar": "/opportunities/flex-global-abroad",
  // Removed 2026-09-28: Google's Build Your Future site is retired and renders no content.
  "csv-sch-generation-google-scholarship": "/categories/scholarships",
  // Removed 2026-09-28: Google's Build Your Future site is retired and renders no content.
  "cssi": "/categories/summer-programs",
  // category: Internship — Removed 2026-09-27: Code Next has no working official page. codenext.withgoogle.com 404s
  // and the Build Your Future path redirects to a generic Google careers page with no Code Next content.
  "google-csi": "/categories/internships",
  // category: Internship — Official page, read in a browser on 2026-09-21: Argonne's Seasonal Internship program encourages undergraduate
  "argonne-national-laboratory-seasonal-internship-program": "/categories/internships",
  // category: Internship — 2026-09-16: the listing links only to the Pitt School of Public Health homepage and no ASCEND high school prog
  "ascend": "/categories/internships",
  // duplicate — 2026-09-16 duplicate: same Burger King Scholars program as csv-sch-burger-king-scholarship, which is kept beca
  "burger-king-scholars": "/opportunities/csv-sch-burger-king-scholarship",
  // category: Internship — Official page (portal.ct.gov/AG): Internships are unpaid, volunteer positions open to law and graduate student
  "connecticut-office-of-the-attorney-general-internship-program": "/categories/internships",
  // duplicate — 2026-09-16 duplicate of amazon-future-eng (same Amazon Future Engineer Scholarship; this copy links to the Sch
  "csv-sch-amazon-future-engineers": "/opportunities/amazon-future-eng",
  // duplicate — 2026-09-16 duplicate of dell (same Dell Scholars program on dellscholars.org). | Sept 15: 2026-02-15 was a pas
  "csv-sch-dell-scholars-program": "/opportunities/dell",
  // duplicate — 2026-09-16 duplicate of ge-reagan (same GE-Reagan Foundation Scholarship on reaganfoundation.org). | Sept 15: 
  "csv-sch-ge-reagan-foundation-scholarship-program": "/opportunities/ge-reagan",
  // duplicate — 2026-09-16 duplicate of horatio-alger (same National Scholarship; its scholars.horatioalger.org link now redir
  "csv-sch-horatio-alger-national-scholarship": "/opportunities/horatio-alger",
  // duplicate — 2026-09-16 duplicate of nsli-y (same program, same nsliforyouth.org page). | Sept 15: Official page: the 2026-
  "csv-sch-national-security-language-institute-for-youth": "/opportunities/nsli-y",
  // duplicate — Duplicate of the QuestBridge National College Match listing (id questbridge-match): the same programme with th
  "csv-sch-questbridge-scholarship": "/opportunities/questbridge-match",
  // duplicate — 2026-09-16 duplicate of science-ambassador (same scholarship, same scienceambassadorscholarship.org page). | S
  "csv-sch-the-science-ambassador-scholarship": "/opportunities/science-ambassador",
  // duplicate — Duplicate of the US Senate Youth Program listing (id usef): the same Hearst Foundation programme, linked to a 
  "csv-sch-william-randolph-hearst-foundation-united-states-senate-yout": "/opportunities/usef",
  // category: Internship — Replaced by a corrected listing. The programme now lives at dhcareerinstitute.org, where the official page say
  "dartmouth-health-high-school-foundations-summer-internship": "/categories/internships",
  // duplicate — 2026-09-16 duplicate: same Elks Most Valuable Student scholarship and URL as csv-sch-elks-national-foundation-
  "elks": "/opportunities/csv-sch-elks-national-foundation-scholarship",
  // category: Fellowship — No official page left to link to: footlockerscholarathletes.com returned no HTTP response to either client on 
  "foot-locker-scholar-athletes": "/categories/fellowships",
  // duplicate — 2026-09-16 duplicate of girls-who-code (same Pathways program, same girlswhocode.com/programs/pathways page). 
  "girls-who-code-pathways": "/opportunities/girls-who-code",
  // category: Fellowship — Official page (tiltingfutures.org): the Global Citizen Year Academy is listed as a past program that ran from 
  "global-citizen-year": "/categories/fellowships",
  // category: Scholarship — Official site (heismanscholarship.com): 'In October 2024, the Heisman Trophy Trust concluded the Heisman High 
  "heisman-high-school-scholarship": "/categories/scholarships",
  // category: Internship — 2026-09-17: the linked jhu.edu/precollegeprograms page returns Page not found, and the program site (projectpi
  "hopkins-med": "/categories/internships",
  // category: Internship — 2026-09-16: JPL Explore Programs & Apply lists only Undergraduate, Graduate, Doctoral and Postdoc academic lev
  "jpl": "/categories/internships",
  // category: Internship — 2026-09-16: the linked ABA Public Education programs page describes teacher development programs; no Lawyers f
  "lapps": "/categories/internships",
  // category: Internship — 2026-09-16: the linked McLean Hospital education programs page returns 404 and no high school mentorship progr
  "mclean-mentorship": "/categories/internships",
  // category: Fellowship — Official admissions page: candidates are recruited in 7th grade (nominations open in September, application de
  "oliver-scholars": "/categories/fellowships",
  // category: Fellowship — 2026-09-16: the Peace Corps Prep page returns 404: Page not found; Peace Corps Prep was an undergraduate certi
  "peace-corps": "/categories/fellowships",
  // category: Summer Program — 2026-09-21 link check: the listing's URL is a bare Google Form titled TCE Application Form whose owner is show
  "pmready-tce": "/categories/summer-programs",
  // category: Internship — 2026-09-21 link check: the listing's only URL is a Google Form that returns 401 and demands a Google sign-in, 
  "project-coin-internship": "/categories/internships",
  // category: Fellowship — 2026-09-21 link check: solomoncenternyc.org returns NXDOMAIN - the domain no longer exists. The national progr
  "solomon-leadership-nyc": "/categories/fellowships",
  // category: Fellowship — 2026-09-16: Senior Statesmen of Virginia site shows civic news for older adults and no program for high school
  "ssb-ucl": "/categories/fellowships",
  // category: Internship — Official NREIP page: eligibility is for college students ('Rising sophomores or equivalent; must be on track t
  "ssi-naval": "/categories/internships",
  // category: Internship — 2026-09-16: the HiSTEP links on training.nih.gov return 404 and the NIH OITE program menu lists no high school
  "state-maryland-histep": "/categories/internships",
  // category: Fellowship — 2026-09-21 link check: the listing's URL resolves to a Google Form titled Synapse and State Student Ambassador
  "synapse-state-fellowship": "/categories/fellowships",
  // category: Internship — Replaced by a corrected listing. The official page now names the programme Pre-College Research Internship for
  "the-university-of-alabama-at-birmingham-pre-college-research-int": "/categories/internships",
  // category: Internship — Replaced by a corrected listing. The official page says the internship is designed for high school students en
  "university-of-new-hampshire-interoperability-lab-hightech-bound": "/categories/internships",
  // category: Competition — Re-checked 2026-09-21 in a browser: the Zero Robotics home page lists only Middle School tournaments (2025 and
  "zero-robotics": "/categories/competitions",
};

/** Ids that must never be prerendered or listed in the sitemap. */
export const REMOVED_OPPORTUNITY_IDS: ReadonlySet<string> = new Set(
  Object.keys(REMOVED_OPPORTUNITY_REDIRECTS),
);
