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
  removed.
- **Wrong text fixed**: Harvard and NASA blurbs called the current cycle past or unposted.
  BRAINYAC said 2027 applications were still expected. MD Anderson King had the wrong open date.
  HOBY Illinois had "2017" for 2027.
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
| `nfte` | Renamed "NFTE Youth Entrepreneurship Showcase" for 2026–27 (nfte.com/showcase). Students enter through NFTE programs. | Update the title and link. |
| `csv-sch-the-alert-scholarship` | Links to Peterson's (an aggregator), not the official page. | Replace with the official Alert Magazine page. |
| `nyu-arise`, `university-of-chicago-research-in-the-biological-sciences-ribs`, `auburn-…-alabama-sc…`, `stanford-medical-youth-science-program-smysp`, `salk-…` | The official pages appear to have moved (new paths are given in the agent notes). The old links were not confirmed dead. | Run the link checker on these. |
| `aspire-summit` | Official eligibility is ages 18–29, enrolled in or graduated from a university program. Not open to high school students. | Remove. |
| `ds-davis` (Davis UWC Scholars) | The program says it is "No Longer Accepting New Scholar Applicants". It was only for UWC graduates. | Remove. |
| `davis-projects` (Projects for Peace) | Applicants must be enrolled at a partner college or university. | Remove. |
| `worldquant` | BRAIN's terms and the International Quant Championship require users to be 18+. | Remove, or limit to 18-year-old seniors. |
| `kaggle` | Kaggle's default rules require age 18+, and some competitions bar minors from prizes. | Reword the eligibility, or remove. |
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
| `u-s-department-of-state-virtual-student-federal-service-vsfs` | Applicants must be high school graduates enrolled in college. Seniors qualify only once accepted to college. | Remove, or limit to grade 12 with that note. |
| `johns-hopkins-school-of-medicine-summer-internship-program` | Listed by Hopkins among programs "for undergrad students". The high school option is the Summer Jobs Program (16+). | Re-point or remove. |
| `high-museum-of-art-summer-internship-program`, `national-gallery-of-art-summer-internships` | Both are for college students and graduates only. | Remove (High Museum's teen option is its Teen Leadership Council). |
| `feinstein-institutes-for-medical-research-summer-student-interns` | The official page says "High school students are not eligible" for this internship (they can join the Summer Visiting Scholar Program). Another Feinstein page conflicts. | Check, then re-point or remove. |
| `the-art-institute-of-chicago-internships` | The link is the college internships page. The teen option is the paid After School Matters internships (artic.edu/learn-with-us/teens/opportunities-for-teens). | Re-point. |
| `library-of-congress-high-school-summer-internship` | The last cycle found closed February 28, 2025; no 2026 or 2027 edition. | Check whether it still runs. |
| `csv-sch-scholars-helping-collars-scholarship` | Paused for the 2026–27 school year; it may return for the Class of 2027. | Hide until it reopens. |
| `csv-sch-discover-scholarship-award` | "The Discover Scholarship Sweepstakes has ended"; the last round was 18+ only. | Remove. |
| `kimberly-querrey…` (Northwestern), `ohsu-knight-scholars…` | Not taking new applications for summer; OHSU ran no 2026 program. OHSU is for grades 9–10, but the listing says 10–12. | Check both. |
| `national-institute-on-aging-summer-research-training-for-high-sc` | Applies through the NIH Summer Internship Program (due January 26, 2027). High school applicants must be seniors aged 18 (17 near a campus), but the listing includes grade 11. | Set grades to 12; add the date once NIA confirms. |
| Grade ranges | Los Alamos takes juniors too (listing: 12 only). Children's Hospital Colorado and Argonne Bridge take seniors only. Berkeley Lab BLDAP is for grades 10–11 (listing includes 12). Chicago Summer Business Institute also takes sophomores. | Fix the grades after checking. |
| Moved links | Wharton LBW (/programs-courses/…), Waksman Scholars (wssp.rutgers.edu), CHLA LA-HIP, Stanford PIPS, Equitable (equitable.com), Women at Microsoft, Scripps Translational. | Run the link checker on these. |
| `yale-mun` | The 2027 conference is full; only the waitlist is open. | Leave as is, or set "closed". |
| `aime`, `usamo` | The only 2026 date is the schools' AMC registration deadline (Oct 15). Students can't register themselves. | Left as TBA on purpose. |

## Still to check

The deadline search has covered the 112 prestige-3 listings and about 200 prestige-2 listings.
About 450 prestige-2 listings are queued for the next rounds (roughly 96 per round, because of the
web-search limit per turn).

Programs that are rarely self-apply (state fairs, olympiads, school-registered competitions)
usually have no student deadline at all. "Deadline TBA" is the correct state for them.
