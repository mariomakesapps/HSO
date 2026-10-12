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
  School and Aspirnaut.
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
| `yale-mun` | The 2027 conference is full; only the waitlist is open. | Leave as is, or set "closed". |
| `aime`, `usamo` | The only 2026 date is the schools' AMC registration deadline (Oct 15). Students can't register themselves. | Left as TBA on purpose. |

## Still to check

The deadline search has covered the 112 prestige-3 listings and about 100 prestige-2 listings.
About 550 prestige-2 listings are queued for the next rounds (roughly 96 per round, because of the
web-search limit per turn).

Programs that are rarely self-apply (state fairs, olympiads, school-registered competitions)
usually have no student deadline at all. "Deadline TBA" is the correct state for them.
