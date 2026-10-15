# Catalogue review — October 2026

Started 2026-10-12. Dates were checked against official program pages only. A listing gets a
date only when the official page states it, with the year, for the coming cycle; every change
quotes its source in `src/data/deadlineCheckOct2026.ts`. Nothing was deleted and no imported
feed was changed.

## Done

- **Filters**: state, status, deadline-month and Nationwide matching fixed. Every filter is now
  tested over the full catalogue (`src/lib/filterCatalogue.test.ts`).
- **New official 2027-cycle dates**: Tanglewood, CMU SAMS, CMU AI Scholars, LEDA, Memphis GSIS,
  Rockefeller SSRP (open date), Iowa and Illinois state fairs, BRAINYAC, Salk, MD Anderson King,
  Harvard Secondary School Program, NASA Dream with Us. Round 3 added: Congressional App
  Challenge, Technovation, Interlochen, NYU Tisch Summer, SWE scholarships, Taco Bell Live Más
  (open date), Oak Ridge Appalachian STEM Academy, Aspen Music Festival, Arkansas Governor's
  School and Aspirnaut. Round 4 added: KFC Colonel's, Equitable Excellence and Burger King
  scholarships, The Earth Prize, Memorial Sloan Kettering, Broad Summer Scholars, BU RISE, and
  Fermilab PRISM dates in the blurb. A UT Austin HSRA open date that had no official source was
  removed. Round 5 added: Medill Cherubs, Air Force ROTC scholarship, Columbia Pre-College Online
  Summer. Round 6 added: Mayo SPARK Florida, ARTEFFECT, American Legion Legacy Scholarship (open
  date) and Pride Foundation scholarship. Round 7 added: JSHS regions (Alabama, Arkansas,
  Connecticut, Hawaii and Pacific), Little Rhody Boys State, Hawaii Girls State and Louisiana
  Girls State (open date). Round 8 added: UPMC Hillman Cancer Center Academy, Poetry Out Loud
  Alabama and West Virginia. Round 9 added: Florida Bright Futures (FFAA deadline).
- **Wrong text fixed**: Harvard and NASA blurbs called the current cycle past or unposted.
  BRAINYAC said 2027 applications were still expected. MD Anderson King had the wrong open date.
  HOBY Illinois had "2017" for 2027.
- **Descriptions refreshed (2026-10-14)**: 89 one-line descriptions replaced with fact-only
  ones from the official pages (`src/data/descriptionCheckOct2026.ts`, evidence per row). The same
  pass corrected 26 fields the official pages contradict, e.g. competitions with entry fees that
  were marked Free (HMMT, AIME, PUMaC, BMT, SMT, USAPhO, CyberPatriot, Scholastic, DECA, FBLA,
  HOSA, NSDA), Stanford SIMR (no stipend for most), AMNH SRMP ($2,500 stipend), Dell Scholars
  (now Texas only), Kenyon Young Writers (rising juniors and seniors), PRIMES (sophomores and
  juniors), and online-only programs listed as in-person (AwesomeMath, From the Top).
  A second round on 2026-10-14 replaced 80 more and corrected fields on 17 listings: GRAMMY Camp runs in
  four cities, not only Los Angeles; Kaiser KP Launch is Northern California only; Treasury
  headquarters internships are unpaid; HOBY and StellarXplorers charge fees; QCaMP pays a stipend;
  and eleven listings had the wrong grades (Emory Pre-College, BLDAP, Chicago Summer Business
  Institute, Children's Colorado, Mae & Mary, BigFuture, Modeling the Future, CCNY STEM Research
  Academy, Young Nebraska Scientists, SUN, Lawrence Hall of Science).
- **Removed (2026-10-14, at your request)**: 17 listings the official pages say are not open to
  high school students. College or adult only: Davis Projects for Peace, MFA Boston internships,
  Johns Hopkins School of Medicine Summer Internship, High Museum and National Gallery summer
  internships, Feinstein summer student internships, UT Extension summer internships, the
  Heliophysics Summer School (`usra`), SFMOMA internships, Point Defiance Zoo paid internships,
  Breakthrough's Teaching Fellowship, Aspire Leaders (18-29), and State Department VSFS (college
  students). Age 18+: Kaggle, WorldQuant BRAIN. Closed: Davis UWC Scholars (UWC graduates only)
  and the Discover sweepstakes (ended, 18+). Each old page 301s to its category, and
  `/categories/internships/page/9`, which the removals emptied, 301s to page 8. Several of these
  places run a separate teen program (MFA Teen Arts Council, High Teen Leadership Council, NGA
  Teen Leadership Collective, Feinstein Summer Visiting Scholar) that could be added as new listings.
- **Renamed (2026-10-15)**: Teen Takeovers is now Teen Night Out Branch Council, Hudson River
  Park's Student Leaders Program is now the Science Leadership Program, NIA's program is Summer
  Trainee in Aging Research (STAR), and NFTE's competition is the Youth Entrepreneurship Showcase.
  Titles only; page URLs are unchanged. The NFTE link (to nfte.com/showcase) still needs checking.
- **Added (2026-10-15)**: five teen programs at places whose college-only internships were removed:
  MFA Boston Teen Arts Council, High Museum Teen Leadership Council, National Gallery Teen
  Leadership Collective, Johns Hopkins Summer Jobs Program, and MERIT Health Leadership Academy
  (Baltimore). No 2027 dates are posted, so none is shown.
- **Stale dates removed from descriptions (2026-10-15)**: seven blurbs announced openings that have
  now passed (Cal Grant, National Science Bowl, NACLO, USAMTS, Wyoming Summer High School Institute,
  San Diego Museum of Art Teen Council, NC Health Careers Day). The dates stay in the deadline and
  opening-date fields; only the sentence was dropped.
- **Wrong filters fixed**: Aspirnaut was filed under Michigan; it is Vanderbilt, Nashville TN.
  The Boswell scholarship (seniors only) showed under grade 11.

## Needs your decision (not changed)

| Listing | What was found | Suggested action |
|---|---|---|
| `hampshire` (HCSSiM) | Hampshire College announced it closes permanently in December 2026. HCSSiM is a separate organisation and expects a new campus for 2027. | Update the location once HCSSiM names it. |
| `california-science-and-engineering-fair-…` | Links to csef.org. The official site appears to be csef.usc.edu. | Change the link (external link only; page URL unchanged). |
| `rise-challenge` | Official pages only show cycles up to 2022–23. The program is now "Rise" (Schmidt Futures and Rhodes Trust). | Re-check; rename or remove. |
| `ge-reagan` | The page shows only "Notify Me for 2027". The foundation now also runs a GE Aerospace-Reagan Workforce Readiness Scholarship. | Check which one the listing should point to. |
| `gates` | The 2026 cycle closed on 2026-09-15. Older pages say "through 2026", so a 2027 cycle is not confirmed. | Watch; remove if no 2027 cycle is announced. |
| `north-dakota-state-university-north-dakota-governors-school` | NDSU says the program runs every other summer, so there may be no 2027 session. | Confirm, then mark it as biennial in the blurb. |
| `csv-sch-the-alert-scholarship` | Links to Peterson's (an aggregator), not the official page. | Replace with the official Alert Magazine page. |
| `nyu-arise`, `university-of-chicago-research-in-the-biological-sciences-ribs`, `auburn-…-alabama-sc…`, `stanford-medical-youth-science-program-smysp`, `salk-…` | The official pages appear to have moved (new paths are given in the agent notes). The old links were not confirmed dead. | Run the link checker on these. |
| `davis-projects` (Projects for Peace) | Applicants must be enrolled at a partner college or university. | Remove. |
| `state-hawaii-hycc` | Kupu says enrollment in the summer program is paused, with no end date. | Hide until it reopens. |
| `state-minnesota-umtymp` | New students join only in grades 5–7, occasionally 7–9. High school students can't join as new applicants. | Fix the grades, or remove. |
| `fred-hutch-lab-tech` | Applicants must be 18 and in the Shoreline Biomanufacturing Program or at a partner college. | Reword, or remove. |
| `amnh-scip` | Titled "Science and Nature Program", which at AMNH is a K–5 program. The id refers to the Science Communication Internship Program. | Retitle after checking. |
| `mit-launch` | The program is LaunchX (Ann Arbor in-person session), not at MIT. The listing link looks like a placeholder. Final 2027 deadline: March 31, 2027 (not set yet). | Retitle, update the link to launchx.com/programs/ann-arbor-entrepreneurship, then set the date. |
| `picoctf` | picoCTF says it "is now CyLab Security Academy". | Update the name and link. |
| `nyu-iesosc` | The official page says grades 8–10; the listing says 9–11. | Set grades to 9–10 after checking. |
| `minds-matter-nyc` | Students apply as freshmen for a three-year program (grades 10–12). | Decide whether the grade filter should mean "grade when applying". |
| `ornl`, `kenyon`, `rsi-medicine`, `breakthrough` | The official pages appear to have moved (orau.org/arc-ornl/high-school, kenyonreview.org/event/young-writers-summer-residential-workshops, med.upenn.edu/ascend/…, breakthroughcollaborative.org/apply-student). | Run the link checker on these. |
| `prudential-emerging-visionaries` | The last cycle found closed November 2, 2024; nothing since. | Check whether it still runs. |
| `feinstein-institutes-for-medical-research-summer-student-interns` | The official page says "High school students are not eligible" for this internship (they can join the Summer Visiting Scholar Program). Another Feinstein page conflicts. | Check, then re-point or remove. |
| `the-art-institute-of-chicago-internships` | The link is the college internships page. The teen option is the paid After School Matters internships (artic.edu/learn-with-us/teens/opportunities-for-teens). | Re-point. |
| `library-of-congress-high-school-summer-internship` | The last cycle found closed February 28, 2025; no 2026 or 2027 edition. | Check whether it still runs. |
| `csv-sch-scholars-helping-collars-scholarship` | Paused for the 2026–27 school year; it may return for the Class of 2027. | Hide until it reopens. |
| `kimberly-querrey…` (Northwestern), `ohsu-knight-scholars…` | Not taking new applications for summer; OHSU ran no 2026 program. OHSU is for grades 9–10, but the listing says 10–12. | Check both. |
| `national-institute-on-aging-summer-research-training-for-high-sc` | Applies through the NIH Summer Internship Program (due January 26, 2027). High school applicants must be seniors aged 18 (17 near a campus), but the listing includes grade 11. | Set grades to 12; add the date once NIA confirms. |
| Grade ranges | Los Alamos takes juniors too (listing: 12 only). Children's Hospital Colorado and Argonne Bridge take seniors only. Berkeley Lab BLDAP is for grades 10–11 (listing includes 12). Chicago Summer Business Institute also takes sophomores. | Fix the grades after checking. |
| Moved links | Wharton LBW (/programs-courses/…), Waksman Scholars (wssp.rutgers.edu), CHLA LA-HIP, Stanford PIPS, Equitable (equitable.com), Women at Microsoft, Scripps Translational. | Run the link checker on these. |
| `university-of-illinois-chicago-s-office-of-the-vice-provost-for…` | UIC Summer Bridge is for admitted first-year UIC students, not grades 9–12. | Remove. |
| `department-of-teacher-education-of-michigan-state-university-hig…` (MSU HSHSP) | No session in 2025 or summer 2026; nothing about 2027. | Hide until it returns. |
| KUMC Health Sciences Enrichment Institute | For college freshmen and sophomores; its pages moved under /office-of-student-engagement/. | Check, then remove or re-point. |
| `georgia-tech-college-of-sciences-summer-research-academy-sra`, RIT listing | Official pages show nothing newer than 2022 (Georgia Tech) or 2020 (RIT). | Check whether they still run. |
| `university-of-michigan-rogel-cancer-center-healthcare-experience…` (HERO) | No official page or dates found; Rogel now lists a "SHE Oncology" program. The existing open date (2027-01-11) can't be confirmed. | Check; it may have been renamed. |
| `air-force-research-laboratory-wright-patterson-afb-wright-schola…` | The research agent could not find the 2026-11-01 open date (verified in September) for the 2027 cycle. | Re-check in November. |
| `harborview-injury-prevention…` (INSIGHT) | The 2026 program charged $2,200 tuition. | Check the listing's cost field. |
| `columbia-university-summer-high-school-academic-program-for-engi…` (SHAPE) | The apply page gives March 5, 2027 but also says "priority enrollment has passed", which doesn't fit the December 16 priority date. | Re-check before setting a date. |
| Grade ranges (round 5) | Northwestern College Bridge takes 25 CPS juniors only; UCO Engineering Summer Academy is for grades 8–10 or 9–11. | Fix the grades after checking. |
| Moved links (round 5) | Barnard Plate + Planet (/plate-planet-lab), Barnard NextGen (/nextgen-leadership-institute), Stanford STaRS, Ohio State Explorations in Neuroscience, Museum of Science (mos.org/careers/internships), KUMC KEE. | Run the link checker on these. |
| `nasa-nasa-app-development-challenge-adc` | NASA: "The ADC is on pause for 2026 and might return in 2027"; check back in August 2027. | Hide until it returns. |
| `correlation-one-apex-high-school-ai-championship` | Applications paused, "Launching 2027". | Hide until it relaunches. |
| `florida-international-university-center-for-translational-scienc…` | Now open only to St. Lucie County students, who apply through a school counselor. | Narrow the location, or remove. |
| `university-of-central-florida-competitive-programming-summer-ins…` | Did not run in 2026; no sign it returns in 2027. | Check whether it still runs. |
| `mgh…youth-neurology…` | The official page still shows a 2025 timeline. | Check whether it still runs. |
| `rutgers-new-jersey-medical-school-high-school-student-research-i…` | Not a program with a deadline: students arrange a faculty host themselves (16+). Its page moved to research-office.njms.rutgers.edu/training-programs/high-school. | Reword and re-point. |
| `thomas-jefferson-national-accelerator-facility-suratech-high-sch…` | Officially the "JSA/Jefferson Lab High School Summer Honors Program". | Retitle. |
| Grade ranges (round 6) | Penn SMP: Philadelphia students entering 10th or 11th grade. Mayo CARES: Arizona sophomores and juniors. UW-Madison PEOPLE: students join in grade 8 or 9. Jim Holland SEP: entering grades 9–11. | Fix the grades after checking. |
| Moved links (round 6) | UAB PRISM (uab.edu/medicine/surgery/prism), Maryland Boys State (mdlegion.org/boysstate), Rice Architecture Summer Immersion (/public-programs/summer-immersion), Montana Tech camp (links to a 2026 news release), University of Miami trainee program. | Run the link checker on these. |
| `american-legion-auxiliary-department-of-connecticut-laurel-girls…` | The link (alactdept.org/laurel-girls-state.html) never appears in search; the department names www.alalgs.org as the program site. | Re-point to alalgs.org. |
| Boys/Girls State sites (round 7) | New Mexico Boys State's site looks stale (newest event about 2024). North Dakota Boys State moved to ndboysstate.org. Evergreen (WA) is now co-ed "Evergreen Boys & Girls State" at $700 with tuition help. Kentucky Girls State still shows 2025. | Check and update. |
| `junior-science-and-humanities-symposium-florida-jshs`, Intermountain JSHS | Official region pages still describe the 2025 cycle. | Re-check in November. |
| `teachers-and-writers-collaborative-with-the-new-york-state-counc…` (Poetry Out Loud NY) | T&W: "New York State will not participate in the national Poetry Out Loud program this year." It is replaced by New York State of Poetry (registration closes November 6, 2026; students can register themselves). | Rename and re-point, or remove. |
| `junior-science-and-humanities-symposium-missouri-jshs`, `…-new-york-metro-jshs`, `…-ohio-jshs` | Host pages say JSHS is "suspended until further notice". That may be an old notice: jshs.org lists the 2027 National JSHS for April 20–25, 2027. | Check each region before changing anything. |
| `florida-division-of-arts-and-culture-poetry-out-loud-florida` | The linked USF page says USF no longer runs the Florida contest. The official page is dos.fl.gov/cultural/programs/poetry-out-loud/. | Re-point. |
| `wyoming-arts-council-poetry-out-loud-wyoming` | The official page is now at /programs/poetry-out-loud/. | Re-point. |
| `ncf-envirothon-arkansas-envirothon` | arkansasenvirothon.net returns no pages in search; the only Arkansas listing found is a 2025 event on arkansasee.org. | Check the link. |
| `west-virginia-state-university-aeop-high-school-internships-at-w…` | The page still says "Applications are now open for Summer 2024", and no later cycle was found. The page moved under college-of-natural-sciences-and-mathematics. | Check whether it still runs. |
| `oregon-student-aid-oregon-promise-grant` | Oregon Promise opens in "mid-October 2026". The listing's 2026-10-01 open date looks like the general ORSAA opening. | Correct or clear the open date. |
| `naacp-act-so` | NAACP is moving to a biennial convention (next in 2028); its 2027 "Legislative Session" will "incorporate ACT-SO". How the 2027 national round runs is unclear. | Re-check in early 2027. |
| `…vermont…history-day` | Its open date of 2027-01-01 is not stated on any official page. | Clear it unless a source turns up. |
| `sachs-foundation-undergraduate-scholarship`, Wyoming History Day | Sachs' page appears to be /undergraduate-scholarships/; Wyoming History Day appears to be wyominghistoryday.org. | Run the link checker on these. |
| `girls-state` | The listing's org and link are the American Legion (Boys State). Girls State is run by the American Legion Auxiliary. Description left unchanged. | Fix the org and link, or split into state listings. |
| `nyt-essay` | Aggregators say the contest was renamed "Open Letters: Our Opinion Writing Contest"; nytimes.com could not be checked from here. | Check the current name and link. |
| `unesco-youth` | UNESCO's pages give no age range for the Youth Forum, and its other youth programs are for ages 18–35. | Check that high school students can take part. |
| `stargate` (NASA Space Apps) | The listing deadline 2026-11-15 looks wrong: the event runs over a weekend in early October. | Correct or clear the deadline. |
| `syp-penn`, `syp-uchicago` | Penn: academies for current 9th–11th graders, Pre-College for 10th–11th. The listing grades depend on whether "grade" means current or entering grade. | Decide the grade convention for summer programs. |
| `beaver-works` | Free for families under $200,000 income and assets; $3,000 above that. Kept as Free; the description states the fee. | Keep, or mark Paid. |
| `ayla` (Adroit Prizes) | An older official post mentions a $12 entry fee; no current fee was found. | Check the current fee. |
| `gates` | Older official pages list ethnicity requirements; the current main page lists only Pell-eligible U.S. seniors. | Check the eligibility wording. |
| Categories | `juilliard-pre` (Saturday conservatory listed as Fellowship), `aops` (year-round online courses listed as Summer Program), `ymf` (a fellowship listed as Competition). | Recategorise if you agree. |
| `yale-mun` | The 2027 conference is full; only the waitlist is open. | Leave as is, or set "closed". |
| `aime`, `usamo` | The only 2026 date is the schools' AMC registration deadline (Oct 15). Students can't register themselves. | Left as TBA on purpose. |
| `syp-utexas` | The title (Bridging Disciplines Programs) is for UT Austin undergraduates only, and the link goes to UT High School's online credit courses. Neither is a summer program for high school students. | Fix the title and link, or remove. |
| `army-rebotics` | The listing is JROTC StellarXplorers; the id says something else. The page URL is unchanged. | Leave the id (it is indexed); nothing to do unless you want a 301. |
| `argonne` (ESRP) | It is a school-year team project that a teacher registers, not an individual paid internship. No stipend is stated. | Recategorise as Research, and check the Stipend label. |
| `state-nebraska-yns` | The link is the paid High School Researcher positions, so it fits Research better than Summer Program. Grades and cost now match that page. | Recategorise if you agree. |
| `skillsusa` | Competitors must be paid, registered SkillsUSA members. Listed as Free. | Keep Free, or mark Paid. |
| `jea` | The National Student Media Contests charge $25 per entry and include an on-site critique at the convention. Other JEA awards differ. Listed as Free and Online. | Decide which JEA contest the listing is for. |
| Moved links (round 2) | QCaMP (now /ecosystem/qcamp/), UCI Chao (now /education-and-training/high-school-students/), Create-A-Greeting-Card (now /greeting-cards-scholarship/), Scripps Translational, NSA GenCyber (the program site is gen-cyber.com). | Run the link checker on these. |
| Paid label unconfirmed (round 2) | No pay is stated on the official pages for FIU, UT Health San Antonio, UCI Chao, Brookhaven or Georgia Tech Research Institute. TAG Education has both paid and unpaid places. The descriptions no longer say "paid". | Keep Stipend, or clear it. |
| Grades to check (round 2) | Lockheed Martin excludes seniors graduating in May; Haslam WEB may be for rising juniors only; BioBus takes applicants in grades 9–11; New Hampshire ASP says sophomores and juniors can apply; Berkeley Lab EinR may take current sophomores. | Decide with the grade convention for summer programs. |
| `northwestern-university-feinberg-school-of-medicine-kimberly-que` | The page said it was not taking new applicants for the 2026 cycle. | Re-check for 2027. |
| `university-of-georgia-caes-young-scholars-program` | Interns work in Athens, Griffin or Tifton. The listing says Athens. | Change the location to Georgia, USA if you agree. |
| `art-of-problem-solving-initiative-usa-mathematical-talent-search` (USAMTS) | Its deadline is Round 1 (October 13, 2026), now past, so it shows as closed. Students can still take later rounds, but their dates were not found. | Set the Round 2 date once confirmed. |
| Not added: Feinstein Summer Visiting Scholar Program | Feinstein's high school option: students 16+ volunteer in a lab with a faculty mentor they find themselves. No page says whether it is free or charges a fee. | Add as Free once the cost is confirmed. |
| Not added: Point Defiance Zoo Guides | Teen volunteers ages 14–18 (grades 9–12); applications open in December 2026. Official 2018–19 documents charged a $40 fee with aid; current pages don't mention one. | Add once the fee is confirmed. |
| `merit-health-leadership-academy` (new) | Official pages disagree on the GPA minimum (2.5 or 3.0) and on whether applications are open, so neither is stated. | Check before the next cohort. |

## Coverage

The deadline search is complete. Every curated listing with no date, or a passed one, at
prestige 3 (112) and prestige 2 (653, excluding state fairs, olympiads and similar
school-registered programs) was checked against its official site between 2026-10-12 and
2026-10-14.

- `src/data/deadlineCheckOct2026.ts` holds 51 rows. They set 44 deadlines and 18 opening dates,
  and fix about 20 blurbs. Two correct a wrong organisation, location or grades, and one clears an
  unsourced open date.
- Every other checked listing stays "Deadline TBA", for one of three reasons:
  - The 2027 cycle isn't posted yet. Most summer programs post between November and January.
  - The date has no year.
  - Schools, coaches, posts or regional contests register the students: Boys/Girls State, History
    Day, Envirothon, Poetry Out Loud, SkillsUSA, most JSHS regions.
- The 585 NYC imports were not checked, because changing imports is off limits.

Programs that are rarely self-apply (state fairs, olympiads, school-registered competitions)
usually have no student deadline at all. "Deadline TBA" is the correct state for them.

**Suggested next pass (late November to December 2026):** re-run the same check on listings that
said "applications open in November/December". Many 2027 summer dates will be posted by then.
