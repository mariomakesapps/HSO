import type { Opportunity } from "@/data/opportunities";
import type { HsoReviewSep2026 } from "@/data/hsoUpdateSep2026";

/**
 * Deadline check, 2026-10-12. It follows the same pattern as hsoReviewOct2026.
 *
 * Listings with no date (or a stale one) were searched against their official
 * program pages. A row sets a date only where the official page states it for the
 * coming cycle, and quotes that page in `evidence`. A date from a blog, an
 * aggregator, or an earlier cycle is never used: those listings stay "Deadline TBA".
 *
 * The same pass fixed a few listings whose organisation, location or grades were
 * wrong in ways that put them under the wrong filter.
 *
 * Applied straight after applyHsoUpdateOct2026 in src/data/opportunities.ts, so these
 * rows win over earlier reviews.
 */
/** A review row that can also correct the organisation and the eligible grades. */
type CheckRow = HsoReviewSep2026 & { org?: string; grades?: number[] };

export const deadlineCheckOct2026: Record<string, CheckRow> = {
  "tanglewood": {
    deadline: "2027-01-19",
    opensAt: "2026-11-01",
    evidence: "2026-10-12, bu.edu/cfa/tanglewood/admissions: 2027 applications open November 1, 2026; 'January 19, 2027 · Applications due' (later applications reviewed on a space-available basis).",
  },
  "cmu-sams": {
    deadline: "2027-02-01",
    evidence: "2026-10-12, cmu.edu/pre-college/academic-programs/sams.html: application deadline February 1, 2027; decision release April 1, 2027.",
  },
  "carnegie-mellon-university-pre-college-programs-ai-scholars": {
    deadline: "2027-02-01",
    evidence: "2026-10-12, cmu.edu/pre-college/cost-financial-aid: 'Scholarships will ONLY be considered under the February 1, 2027 application deadline.' The AI Scholars page gives the same February 1, 2027 deadline.",
  },
  "leda-scholars-program": {
    deadline: "2026-12-09",
    blurb: "Completely free five-week residential summer at Princeton and Yale for 100 public high school juniors, covering college prep, leadership training, college guidance and SAT/ACT prep, followed by years of support. Applicants need a 3.5+ unweighted GPA and household income of $90,000 or less, and must be U.S. citizens, permanent residents or DACA recipients. The Summer 2027 application is open now; Part I is due December 9, 2026.",
    evidence: "2026-10-12, ledascholars.org .../recruitment-admissions/apply: 'Application Opens: September 9, 2026', 'Part I Deadline: December 9, 2026'; Part II follows in late February.",
  },
  "university-of-memphis-governors-school-for-international-studies": {
    deadline: "2026-11-20",
    evidence: "2026-10-12, memphis.edu/govschool: 'The application for the 2027 program will open on October 1. The deadline for the student portion of the application is November 20. The deadline for the counselor and teacher forms is December 11.' Program June 5-26, 2027.",
  },
  "rockefeller-ssrp": {
    deadline: "2027-01-04",
    opensAt: "2026-10-15",
    evidence: "2026-10-22, https://www.rockefeller.edu/outreach/ssrp/: 'Deadline: Monday, January 4, 2027 at 5:00 p.m. Eastern Time. Late applications will not be considered.'",
  },
  "state-science-and-technology-fair-of-iowa-state-science-and-tech": {
    deadline: "2027-02-15",
    opensAt: "2026-12-01",
    evidence: "2026-10-12, sstfi.org home page, alongside the April 1-2, 2027 fair in Ames: 'December 1st: REGISTRATION OPENS', 'February 15th: REGISTRATION CLOSES', 'Teachers need to register every year!'",
  },
  "illinois-junior-academy-of-science-illinois-junior-academy-of-sc": {
    deadline: "2027-02-15",
    evidence: "2026-10-12, ijas.org/regional-expositions: 'Regardless of regional fair dates, student/project registration to IJAS is due by February 15, 2027, 11:59PM CT.'",
  },
  "columbia-brainyac": {
    deadline: "2026-10-28",
    blurb: "Paid summer neuroscience research apprenticeship at Columbia's Zuckerman Institute for NYC 10th and 11th graders enrolled in a partner program (S-PREP, BioBus, Lang Youth Medical, Columbia Secondary School or Double Discovery Center). Apply through your partner program; 2027 applications close October 28, 2026.",
    evidence: "2026-10-12, zuckermaninstitute.columbia.edu/brainyac: 'Applications for BRAINYAC 2027 are open until October 28, 2026 at 11:59pm.' 'Please check with your partner program for an application.' The old blurb said 2027 applications were still expected.",
  },
  "salk-institute-for-biological-studies-salk-education-outreach-hi": {
    deadline: "2027-02-15",
    opensAt: "2026-12-01",
    evidence: "2026-10-12, salk.edu/about/education-outreach/programs/high-school-scholars: 'The application period for the 2027 summer program will open on Tuesday, December 1, 2026 and close on Monday, February 15, 2027.' (Heithoff-Brody High School Summer Scholars; San Diego County students.)",
  },
  "school-of-health-professions-ut-md-anderson-cancer-center-king-f": {
    deadline: "2027-01-13",
    opensAt: "2026-11-16",
    blurb: "Ten-week paid research placement at MD Anderson for up to six Texas high school seniors who are 18 by the start, with a preference for students heading into an allied health career. The stipend is 7,200 dollars for ten weeks. Applications for summer 2027 run November 16, 2026 to January 13, 2027.",
    evidence: "2026-10-12, mdanderson.org summer research programs 'How to Apply': 'Applications for summer 2027 will be collected from November 16, 2026-January 13, 2027'; the CATALYST page gives the same window (program June 7 - August 13, 2027). The listing's previous open date of October 1 was wrong.",
  },
  "state-michigan-aspirnaut": {
    org: "Vanderbilt University Medical Center",
    location: "Nashville, Tennessee, USA",
    deadline: "2027-01-13",
    blurb: "Paid summer biomedical research internship at Vanderbilt University Medical Center in Nashville, run by the Aspirnaut program. The 2027 internship runs June 6 to July 17; applications are due January 13, 2027, with a transcript uploaded by a school official.",
    evidence: "2026-10-12: aspirnaut.org/high-school-internships: 'application deadline is January 13, 2027 at 11:59 PM CST'; program June 6 - July 17, 2027. aspirnaut.org (the listing's own link) describes Aspirnaut as a Vanderbilt University Medical Center program in Nashville, Tennessee. The listing named the University of Michigan in Ann Arbor, so it sat under Michigan in the State filter. The id is kept because the page URL is already indexed.",
  },
  "csv-sch-dr-arnita-young-boswell-scholarship": {
    grades: [12],
    evidence: "2026-10-12: the listing's own description says the scholarship 'is open to female African-American graduating high school seniors', but it was tagged for grades 11-12, so it showed up under the grade 11 filter.",
  },
  "congressional-app": {
    deadline: "2026-10-26",
    blurb: "District-level coding competition run by members of Congress, open to high school students in participating districts, with winning apps displayed in the U.S. Capitol. Students register and submit themselves, but only if their Member of Congress has signed up the district; 2026 entries are due October 26, 2026.",
    evidence: "2026-10-12, congressionalappchallenge.us student registration page and 2026 rules PDF: '12:00 pm EDT, Monday, October 26th, 2026'. Members' sign-up deadline was October 15, 2026. The old blurb said the next cycle's dates were not posted.",
  },
  "technovation": {
    deadline: "2027-03-11",
    evidence: "2026-10-12, technovationchallenge.org/competition: 'Registration Deadline (Students and Mentors): March 11, 2027 at 23:59 UTC'. Final submissions are due May 5, 2027.",
  },
  "interlochen": {
    deadline: "2027-01-15",
    blurb: "World-renowned summer arts camp for serious teen artists. January 15, 2027 is the priority deadline for programs that need an audition or portfolio; after that, applications are taken as space allows, and programs without auditions enroll on a rolling basis.",
    evidence: "2026-10-12, interlochen.org 2027 high school program pages, e.g. musical theatre production: 'Program Dates: June 27, 2027 to August 8, 2027 ... Deadline: January 15, 2027'; how-to-apply page calls January 15 the priority application date.",
  },
  "nyu-tisch": {
    deadline: "2026-12-01",
    evidence: "2026-10-12, tisch.nyu.edu special programs admissions calendar: Summer 2027 residential program (July 11 - August 7, 2027) application deadline 'Tuesday, December 1, 2026 at 11:59 p.m. ET'; scholarship deadline December 11, 2026.",
  },
  "swe-scholarships": {
    deadline: "2027-03-31",
    opensAt: "2027-02-08",
    blurb: "Scholarships for women entering ABET-accredited engineering or computer science programs. High school seniors apply in the Emerging First Year Scholars round, open February 8 to March 31, 2027 (minimum 3.5 unweighted GPA).",
    evidence: "2026-10-12, swe.org/scholarships: Emerging First Year Scholars, 'open to students entering their first year of undergraduate study (including current high school seniors)', February 8, 2027 - March 31, 2027.",
  },
  "taco-bell-live-mas": {
    deadline: "2027-01-05",
    opensAt: "2026-10-13",
    evidence: "2026-10-22, https://tacobellfoundation.org/live-mas-scholarship/: 'January 5, 2027 at 5 PM PST'",
  },
  "ornl": {
    deadline: "2026-12-04",
    evidence: "2026-10-12, arc.gov 'Summer Learning Opportunities 2027' (October 8, 2026): 'Applications for both opportunities are due December 4, 2026.' High school session July 10-24, 2027.",
  },
  "aspen-music": {
    deadline: "2027-01-05",
    blurb: "Eight-week summer music school in the Rockies. Most instrumental programs close January 5, 2027; some tracks close earlier (opera and VocalARTS September 1, collaborative piano October 15, composition November 1, conducting November 15), so check your program's page.",
    evidence: "2026-10-12, aspenmusicfestival.com programs of study (flute and tuba pages, fees and deadlines page): 'September 15, 2026: application opens ... January 5, 2027: application closes at 11:59 pm ET'. Earlier deadlines for the tracks named in the blurb.",
  },
  "state-arkansas-governors-school": {
    deadline: "2027-02-01",
    opensAt: "2026-10-19",
    blurb: "Four-week residential program for gifted Arkansas rising seniors across nine academic and creative areas. Students are nominated by their school (homeschoolers by a parent); nominations open October 19, 2026 and student materials are due February 1, 2027.",
    evidence: "2026-10-12, atu.edu/ags/apply.php: 'October 19, 2026 - Nomination/Application open ... February 1, 2027 - Student application material due'. School materials are due February 8, 2027.",
  },
  "csv-sch-kfc-colonel-s-scholarship": {
    deadline: "2027-02-08",
    opensAt: "2027-01-04",
    blurb: "Students selected for this scholarship are eligible to receive up to $20,000 to complete a bachelor's degree program. Applicants must work at a participating KFC restaurant; 2027 applications run January 4 to February 8, 2027.",
    evidence: "2026-10-12, kfcfoundation.org/scholarships: 'Save the Date! January 4 - February 8, 2027'. Applicants must work at a participating KFC.",
  },
  "csv-sch-equitable-excellence-scholarship": {
    deadline: "2026-12-22",
    evidence: "2026-10-12, equitable.com Equitable Excellence Scholarship page: the application 'will be active through Tuesday, December 22nd, 2026.'",
  },
  "csv-sch-burger-king-scholarship": {
    deadline: "2026-12-15",
    opensAt: "2026-10-15",
    blurb: "Scholarship grants range from $1,000 to $50,000 and are intended to help students offset the cost of attending college or post-secondary vocational/technical school. Applications open October 15, 2026 and close December 15, 2026, or earlier once 30,000 applications are received.",
    evidence: "2026-10-12, burgerkingfoundation.org: application opens October 15, 2026 and closes December 15, 2026, or once 30,000 applications have been received.",
  },
  "earth-prize": {
    deadline: "2027-01-10",
    evidence: "2026-10-12, theearthprize.org/competition: registration deadline January 10, 2027; submissions close January 31, 2027 at 12:00 PM CET.",
  },
  "memorial-sloan-kettering-cancer-center-summer-student-program": {
    deadline: "2027-02-05",
    opensAt: "2026-12-01",
    evidence: "2026-10-12, mskcc.org/education-training/summer-student: 2027 applications open December 1, 2026 and are due February 5, 2027 at 8:00 a.m. EST.",
  },
  "broad-institute-of-mit-and-harvard-broad-summer-scholars-program": {
    deadline: "2027-01-20",
    opensAt: "2026-11-23",
    evidence: "2026-10-12, Broad Institute BSSP page: applications open November 23, 2026 and are due January 20, 2027. Massachusetts rising seniors within commuting distance only.",
  },
  "boston-university-rise-internship-practicum": {
    deadline: "2027-02-03",
    evidence: "2026-10-12, BU RISE admissions timeline: application deadline February 3, 2027, 11:59pm ET. The opening date is given without a year, so none is set.",
  },
  "fermilab-high-school-programs-prism-valor-jrotc": {
    opensAt: "2027-01-12",
    deadline: "2027-03-01",
    blurb: "Fermilab's high school track: PRISM STEM mentorship plus the paid six-week VALOR JROTC summer internship. PRISM's 2027 application runs January 12 to March 1, 2027; check VALOR's page for its own dates.",
    evidence: "2026-10-24, https://internships.fnal.gov/fermilab-program-for-research-innovation-and-stem-mentorship-prism/: 'Application Dates: January 12, 2027 \u2013 March 1, 2027'",
  },
  "university-of-texas-at-austin-summer-high-school-research-academ": {
    opensAt: null,
    evidence: "2026-10-12, UT Austin HSRA official page: applications open 'mid-January 2027' with a March deadline and no exact days. The listing's open date of 2027-01-04 had no official source, so it is cleared.",
  },
  "northwestern-university-medill-cherubs": {
    deadline: "2027-03-01",
    opensAt: "2026-12-01",
    evidence: "2026-10-12, cherubs.medill.northwestern.edu apply page (2027 program): 'All application materials must be received by noon (U.S. Central Time Zone) on March 1, 2027.' '... no applications will be accepted before December 1, 2026'.",
  },
  "u-s-air-force-rotc-air-force-rotc-high-school-scholarship": {
    deadline: "2026-12-11",
    evidence: "2026-10-12, afrotc.com/apply: 'The scholarship application window will be open July 1, 2026, through December 11, 2026.' Supporting documents for that board are due December 22, 2026.",
  },
  "columbia-university-school-of-professional-studies-columbia-pre": {
    deadline: "2027-04-01",
    evidence: "2026-10-12, precollege.sps.columbia.edu/admissions/dates-and-deadlines, Online Summer 2027: 'General Application Deadline: April 1, 2027'. Early registration February 1, 2027; financial aid February 10, 2027.",
  },
  "mayo-clinic-college-of-medicine-and-science-science-program-for": {
    deadline: "2026-12-04",
    opensAt: "2026-10-15",
    blurb: "Research mentorship program placing rising high school juniors and seniors from Duval and St. Johns counties in Mayo Clinic laboratories in Jacksonville (3.5+ GPA; students also enter a regional or county science fair). Applications run October 15 to December 4, 2026, and the 2027 program starts with a mandatory orientation on June 8, 2027.",
    evidence: "2026-10-12, Mayo Clinic SPARK (Florida) official page: 'Application window: Oct. 15 - Dec. 4, 2026'. Open to rising juniors and seniors at Duval or St. Johns County schools with a 3.5+ GPA.",
  },
  "lowell-milken-center-for-unsung-heroes-arteffect-student-art-com": {
    deadline: "2027-04-19",
    blurb: "Juried art competition for middle and high school students who create original artwork about an unsung hero from history, with more than $35,000 in prizes each year. Submissions for this cycle opened October 1, 2026 and close April 19, 2027.",
    evidence: "2026-10-12, ARTEFFECT rules page and home page (lowellmilkencenter.org): submission deadline April 19, 2027, 11:59 PM Pacific; submissions opened October 1, 2026. The old blurb gave only last cycle's dates.",
  },
  "the-american-legion-american-legion-legacy-scholarship": {
    opensAt: "2027-01-01",
    blurb: "Needs-based college scholarship for children of U.S. military members who died on active duty or became disabled after 9/11, covering the gap left after other grants. High school seniors can apply; the 2027 application opens January 1, 2027.",
    evidence: "2026-10-12, legion.org (Legacy Scholarship news page): the 2027 application opens January 1, 2027. Deadline not yet published.",
  },
  "pride-foundation-pride-foundation-scholarship": {
    deadline: "2027-01-08",
    blurb: "College scholarship program for LGBTQ+ student leaders who live in Alaska, Idaho, Montana, Oregon or Washington (they may study elsewhere). The current application window runs October 11, 2026 to January 8, 2027.",
    evidence: "2026-10-12, pridefoundation.org scholarship guidelines and application pages: window October 11, 2026 to January 8, 2027 (5pm PT). The find-funding page shows 'January 8, 2026', a typo for 2027. The old blurb described the window as past.",
  },
  "the-american-legion-department-of-rhode-island-little-rhody-boys": {
    deadline: "2027-06-01",
    evidence: "2026-10-12, littlerhodyboysstate.com (apply page): 'the deadline to apply is June 1st 2027, space is limited.' Session June 20-25, 2027.",
  },
  "american-legion-auxiliary-department-of-hawaii-hawaii-girls-stat": {
    deadline: "2027-03-15",
    evidence: "2026-10-12, hawaiigirlsstate.org home page: 'APPLY by MARCH 15 for JUNE 2027 SESSION'.",
  },
  "american-legion-auxiliary-department-of-louisiana-louisiana-girl": {
    opensAt: "2027-02-01",
    evidence: "2026-10-12, lagirlsstate.com FAQ: 'Delegates can begin to register for Louisiana Girls State on February 1, 2027.' No closing date posted.",
  },
  "junior-science-and-humanities-symposium-alabama-jshs": {
    deadline: "2027-02-15",
    evidence: "2026-10-12, jshs.org/region/alabama: student application deadline February 15, 2027; regional symposium March 4-5, 2027.",
  },
  "junior-science-and-humanities-symposium-arkansas-jshs": {
    deadline: "2027-01-22",
    evidence: "2026-10-12, jshs.org/region/arkansas: student application deadline January 22, 2027; regional symposium February 26-27, 2027 at Arkansas Tech.",
  },
  "junior-science-and-humanities-symposium-hawaii-and-pacific-jshs": {
    deadline: "2026-11-30",
    evidence: "2026-10-12, jshs.org Hawaii and Pacific region page: 'Deadline for student applications: November 30, 2026'; symposium February 1-2, 2027 (tentative).",
  },
  "junior-science-and-humanities-symposium-connecticut-jshs": {
    deadline: "2026-12-14",
    evidence: "2026-10-12, jshs.org Connecticut region page: 'Deadline for student applications: December 14, 2026'; symposium February 27, 2027.",
  },
  "upmc-hillman-cancer-center-upmc-hillman-cancer-center-academy": {
    deadline: "2027-02-14",
    opensAt: "2026-12-03",
    evidence: "2026-10-13, hillmanacademy.upmc.com/apply-now: application window 'December 3rd, 2026 - February 14th, 2027'.",
  },
  "alabama-state-council-on-the-arts-poetry-out-loud-alabama": {
    deadline: "2026-11-30",
    evidence: "2026-10-13, arts.alabama.gov Poetry Out Loud page: 'Registration for Alabama's 2026-2027 program is open through November 30, 2026.' Schools, organisations and independent students register through a Regional Coordinator.",
  },
  "west-virginia-state-arts-office-poetry-out-loud-west-virginia": {
    deadline: "2026-12-11",
    evidence: "2026-10-13, wvculture.org/agencies/arts/poetry-out-loud: schools and organisations register by December 11, 2026; students without a school competition can sign up by emailing the coordinator by the same date.",
  },
  "florida-bright-futures-scholarship": {
    deadline: "2027-08-31",
    blurb: "Florida's merit scholarship for in-state college. Students earn it by completing the required coursework, test scores and service hours, and must submit the Florida Financial Aid Application (FFAA) in senior year. 2027 graduates can submit the FFAA from October 1, 2026 through August 31, 2027 (mid-year graduates by December 31 of senior year).",
    evidence: "2026-10-13, floridastudentfinancialaidsg.org (Florida Office of Student Financial Assistance): 2027 graduates submit the FFAA 'between October 1, 2026, through August 31, 2027'.",
  },
  "harvard-summer-school-secondary-school-program": {
    deadline: "2027-02-10",
    opensAt: "2026-12-01",
    blurb: "Harvard Summer School program in which high school students take college courses for credit on campus or online. Tuition ranges from about $4,180 to $15,735 plus a $75 application fee, with financial aid. The 2027 application opens December 1, 2026; the early deadline is January 13 and the regular deadline February 10, 2027.",
    evidence: "2026-10-12, summer.harvard.edu Secondary School Program pages: Summer 2027 application opens December 1, 2026; early application and priority financial aid by January 13, 2027; regular application and financial aid by February 10, 2027; late application by March 31, 2027. The old blurb described these as the last cycle's dates.",
  },
  "nasa-aeronautics-dream-with-us-design-challenge": {
    deadline: "2026-12-08",
    blurb: "NASA aeronautics design challenge with a separate high school division (grades 9-12, U.S. schools). The 2026-27 high school challenge asks teams to design an aircraft fuselage fuelled by liquefied natural gas; registration closes December 8, 2026 and submissions are due January 25, 2027.",
    evidence: "2026-10-12, nasa.gov '2026-2027 DWU High School Engineering Challenge': registration closes December 8, 2026; submission deadline January 25, 2027. The old blurb said the next round was not yet posted.",
  },
  // Next-cycle dates found on official pages, 2026-10-22.
  "amc": {
    deadline: "2026-10-28",
    evidence: "2026-10-22, https://maa.org/amcreg/: 'Regular Registration Deadline: October 15, 2026 ($75 registration fee) - Final deadline for new competition managers ... Late Registration Deadline: October 28, 2026 ($115 registration fee) - Returning competition managers only'",
  },
  "usnco": {
    opensAt: "2026-11-01",
    evidence: "2026-10-22, https://www.acs.org/education/olympiad.html: 'Registration opens on November 1, 2026, and all students must be registered by their parents/guardians to participate in the 2027 USNCO competition. ... February 28 - March 2, 2027 \u00b7 Local Exam'",
  },
  "cee-ssp": {
    deadline: "2026-12-11",
    evidence: "2026-10-22, https://www.cee.org/newsevents/press-releases/applications-being-accepted-2027-research-science-institute: 'The RSI 2027 application deadline is December 11, 2026, at 11:59 p.m. ET. No late applications will be considered.'",
  },
  "simons-summer-research": {
    deadline: "2027-02-05",
    evidence: "2026-10-22, https://www.stonybrook.edu/commcms/simons/about/faqs.php: 'Student application deadline: February 5, 2027, 11:59 p.m. EST ... School nomination: January 29, 2027'",
  },
  "state-arizona-keys": {
    deadline: "2026-12-17",
    opensAt: "2026-11-02",
    evidence: "2026-10-22, https://keys.arizona.edu/faq/students: 'Applications for the 2027 KEYS Research Internship program will open November 2, 2026 and close on December 17, 2026.'",
  },
  "harvard-university-harvard-summer-school-high-school-programs": {
    deadline: "2027-02-10",
    opensAt: "2026-12-01",
    evidence: "2026-10-22, https://summer.harvard.edu/high-school-programs/secondary-school-program/admissions/: 'Application opens Tuesday, December 1, 2026. Early deadline: Wednesday, January 13, 2027. Regular deadline: Wednesday, February 10, 2027. Late deadline: Wednesday, March 31, 2027 (or earlier if all course waitlists are full).'",
  },
  "lewis-center-for-the-arts-princeton-university-princeton-univers": {
    deadline: "2027-03-31",
    evidence: "2026-10-22, https://arts.princeton.edu/about/opportunities/high-school-poetry-contest/ten-minute-play-contest: 'Deadline: March 31, 2027, at 12:00 p.m. EDT ... The online submission form for the 2026-27 contest will be available here in January 2027. ... Once 250 entries are received, the contest will close.'",
  },
  "state-new-jersey-stem-scholars": {
    opensAt: "2027-03-01",
    evidence: "2026-10-22, https://www.govstemscholars.com/apply: 'applications for the 2027-2028 Governor's STEM Scholars class will open on March 1, 2027'; the closing date is not posted yet.",
  },
  // Next-cycle dates found on official pages, 2026-10-22.
  "university-of-the-south-sewanee-young-writers-conference": {
    deadline: "2027-03-01",
    evidence: "2026-10-22, https://new.sewanee.edu/sywc/frequently-asked-questions/: 'Applications for summer 2027 will open in December 2026. Our application deadline is Monday, March 1st, 2027. The deadline for letters of recommendation is Friday, March 12th, 2027.'",
  },
  "notre-dame": {
    deadline: "2027-02-17",
    evidence: "2026-10-22, https://precollege.nd.edu/summer-scholars/eligibility-and-application-requirements/: 'Application deadline: February 17, 2027 (application and all supporting documents) - Session I June 19-July 3, 2027; Session II July 10-July 24, 2027'",
  },
  "usc-summer": {
    deadline: "2027-05-07",
    evidence: "2026-10-22, https://precollege.usc.edu/summer-programs/admission-tuition-fees/: 'Domestic Participant Application: May 7, 2027, 12 p.m. PT'",
  },
  "mit-launch": {
    deadline: "2027-03-31",
    evidence: "2026-10-22, https://www.launchx.com/admissions: 'Summer Priority Deadline \u2014 November 11, 2026, Summer Early Deadline \u2014 January 21, 2027, Summer Financial Aid Deadline \u2014 March 4, 2027, Summer Final Deadline \u2014 March 31, 2027'",
  },
  "fred-hutch-explorers": {
    deadline: "2027-02-28",
    opensAt: "2027-01-04",
    evidence: "2026-10-22, https://www.fredhutch.org/en/education-training/high-school-students/high-school-explorers-program.html: 'Applications close 11:59 pm PST February 28, 2027'",
  },
  "stanford-summer-high-school": {
    deadline: "2027-01-20",
    opensAt: "2026-11-02",
    evidence: "2026-10-22, https://summer.stanford.edu/applying/dates-and-deadlines: 'Regular Decision deadline: January 20, 2027 at 9 p.m. PST (Early Decision deadline December 15, 2026; late application deadline March 1, 2027)'",
  },
  "alabama-school-fine-arts": {
    deadline: "2027-01-22",
    evidence: "2026-10-22, https://www.asfaschool.org/apply: 'Applications for the 2027-2028 school year ... are officially open through January 22, 2027.'",
  },
  "wharton-school-leadership-in-the-business-world-lbw": {
    deadline: "2027-01-27",
    evidence: "2026-10-22, https://globalyouth.wharton.upenn.edu/application-information/: 'applications to the Leadership in the Business World program and the Management & Technology Summer Institute will close on January 27, 2027 at 5pm ET'",
  },
  "columbia-university-summer-high-school-academic-program-for-engi": {
    deadline: "2027-03-05",
    evidence: "2026-10-22, https://outreach.engineering.columbia.edu/shape/apply: 'Final deadline: March 5, 2027 at 11:59 PM; Priority deadline: December 16, 2026; Application Opens ... November 16, 2026 (Tentative)'",
  },
  // Next-cycle dates found on official pages, 2026-10-22.
  "thedream-us-national-scholarship": {
    deadline: "2027-02-28",
    opensAt: "2026-11-01",
    evidence: "2026-10-22, https://www.thedream.us/scholarships/national-scholarship/: 'November 1, 2026 \u2013 February 28, 2027'",
  },
  "the-rockefeller-university-learning-at-the-bench-lab-jumpstart": {
    deadline: "2027-01-04",
    evidence: "2026-10-22, https://www.rockefeller.edu/outreach/lab-jumpstart/: 'Monday, January 4, 2027 at 5:00pm Eastern Time'",
  },
  // Next-cycle dates found on official pages, 2026-10-24.
  "washington-university-in-st-louis-young-scientist-program-summer": {
    deadline: "2027-01-25",
    opensAt: "2026-11-02",
    evidence: "2026-10-24, https://sites.wustl.edu/wustlysp/programs/summer-focus/: 'Applications open November 2, 2026; application deadline January 25, 2027; recommendation letters due February 1, 2027; interviews March 6 and 7, 2027; program May 31 to July 23, 2027.'",
  },
  "roswell-park-comprehensive-cancer-center-high-school-summer-rese": {
    deadline: "2027-01-01",
    evidence: "2026-10-24, https://www.roswellpark.org/education/high-school-undergrad/high-school-summer-research-program: 'Application portal opens October 1, 2026 ... deadline January 1, 2027; Program dates: June 28 \u2013 August 6, 2027'",
  },
  "stanford-medicine-pediatrics-internship-program-at-stanford-pips": {
    deadline: "2027-02-22",
    opensAt: "2027-01-06",
    evidence: "2026-10-24, https://med.stanford.edu/pediatrics/education/pediatrics-internship-program/application.html: 'Applications for the Summer 2027 cohort of the PIPS program will open on Wednesday, January 6, 2027 ... Monday, February 22, 2027 (11:59pm PST)'",
  },
  "seattle-children-s-research-institute-research-training-program": {
    deadline: "2027-03-08",
    opensAt: "2027-01-04",
    evidence: "2026-10-24, https://www.seattlechildrens.org/research/centers-programs/science-education-department/high-school-training-programs/: 'Application form due Monday, March 8, 2027, at 5 p.m. Pacific; applications open January 4, 2027'",
  },
  "scripps-research-translational-institute-student-research-intern": {
    deadline: "2027-03-30",
    opensAt: "2026-11-23",
    evidence: "2026-10-24, https://www.scripps.edu/science/translational-institute/education-training/student-research-internship-program/: 'Applications open November 23, 2026; application deadline March 30, 2027; program June 1 \u2013 August 6, 2027'",
  },
  // Date verification 2026-10-24: listed dates checked against official pages.
  "university-of-tennessee-at-chattanooga-governors-school-for-pros": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "university-of-tennessee-at-martin-governors-school-for-the-agric": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "austin-peay-state-university-governors-school-for-computational": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "tennessee-technological-university-governors-school-for-emerging": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "university-of-tennessee-at-martin-governors-school-for-the-human": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "east-tennessee-state-university-governors-school-for-the-integra": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "university-of-tennessee-knoxville-governors-school-for-the-scien": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "tennessee-technological-university-governors-school-for-technolo": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "east-tennessee-state-university-governors-school-for-tennessee-h": {
    deadline: null,
    evidence: "2026-10-24, https://www.etsu.edu/: 'Applications for the 2026 session were accepted from Oct. 1, 2025 to Dec. 5, 2025, and are now closed. 2027 applications open Oct 1, 2026. (No 2027 deadline posted; the unified state application deadline of 2026-11-20 is not on any official page.)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "ftc": {
    deadline: null,
    evidence: "2026-10-24, https://www.firstinspires.org/: 'Traditional Team registration is open through the end of the season (April). The 2026-11-17 date came from the FRC regional event fee schedule ($6,500), not FTC.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "juneau-arts-and-humanities-council-poetry-out-loud-alaska": {
    deadline: null,
    evidence: "2026-10-24, official site: 'The only official registration date found is December 16, 2024 (a past cycle).' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "kentucky-high-school-mock-trial-association-kentucky-high-school": {
    deadline: null,
    evidence: "2026-10-24, official site: 'Registration will open around late August, and will close on November 1, 2022. (past cycle only)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "brooklyn-museum-map": {
    opensAt: null,
    evidence: "2026-10-24, https://www.brooklynmuseum.org/careers/internships-fellowships/museum-apprentice-program: 'Application deadline September 28, 2026 (current cycle, program November 2026\u2013August 2027); no opening date given for the next cycle' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "nsa-high-school-work-study": {
    opensAt: null,
    evidence: "2026-10-24, https://www.nsa.gov/Careers/Student-Programs/: 'Students can apply for this program beginning on September 1 ... apply online from September 1, 2026 through September 30, 2026 (Fort Meade: due 11:59PM EST October 14, 2026)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "asian-art-museum-art-speak": {
    deadline: null,
    evidence: "2026-10-24, https://about.asianart.org/art-speak/: 'All components of the application must be submitted on/before 11:59 pm PST on March 1st, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "magee-womens-research-institute-high-school-summer-internship-pr": {
    opensAt: null,
    evidence: "2026-10-24, https://mageewomens.org/for-researchers/education/high-school-summer-internship-program: 'Applications for Summer 2026 have closed. Applications for Summer 2027 will open in December.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "oklahoma-a-schools-poetry-out-loud-oklahoma": {
    deadline: null,
    evidence: "2026-10-24, https://okaplus.org/poetry-out-loud/: 'School registration closed November 4, 2025 ... school champion registration deadline January 16, 2026 ... state finals March 4, 2026' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  // Date verification 2026-10-24: listed dates checked against official pages.
  "aopa-foundation-aopa-high-school-flight-training-scholarships": {
    deadline: "2026-12-31",
    evidence: "2026-10-24, https://www.aopa.org/training-and-safety/students/aopa-flight-training-scholarships: 'The current window opened on October 1, and will close on December 31. ... December 31, 2026, 11:59 p.m. ET (Fall Application Period)'",
  },
  "science-olympiad-south-carolina-science-olympiad": {
    deadline: null,
    evidence: "2026-10-24, https://www.scscioly.org/registration: '2025\u201326 registration closed January 20, 2026; $200/team, $50/team late registration fee after December 31' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "morehead-cain": {
    deadline: null,
    evidence: "2026-10-24, https://www.moreheadcain.org/application-eligibility/faqs/: 'The application is open until 11:59 p.m. EST on October 1, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "mad-artslife": {
    deadline: null,
    evidence: "2026-10-24, https://madmuseum.org/programs/teen-programs-mad: 'The application portal for the summer 2026 Artslife internship has closed.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "afrl-scholars": {
    deadline: "2027-01-11",
    evidence: "2026-10-24, https://afrlscholars.usra.edu/scholarsprogram/dates/: 'Applications will open October 12th, 2026, and remain open until January 11th, 2027, 23:59:59 US/Central.'",
  },
  "dna-learning-center-urban-barcode-research-program": {
    deadline: null,
    evidence: "2026-10-24, https://dnabarcoding101.org/programs/ubrp/: 'Application submission for the 2026-27 academic is now open and will close on May 26, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "syp-penn": {
    deadline: null,
    evidence: "2026-10-24, https://hs.sas.upenn.edu/summer-programs/application-information: 'applications for this summer 2026 program are now closed' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "stevens-institute-of-technology-school-of-business-stevens-tradi": {
    deadline: "2027-01-22",
    opensAt: null,
    evidence: "2026-10-24, https://www.stevens.edu/school-business-high-school-programs-trading-day: 'Registration for Stevens Trading Day 2027 is open ... deadline January 22, 2027; virtual competition February 1, 2027 - February 26, 2027; finals April 30, 2027'",
  },
  "university-of-pennsylvania-neuroscience-research-academy": {
    deadline: null,
    evidence: "2026-10-24, https://hs.sas.upenn.edu/summer-programs/academies/3-week/neuroscience: 'The Neuroscience Research Academy has reached capacity, and we are no longer accepting applications for summer 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "north-dakota-council-on-the-arts-poetry-out-loud-north-dakota": {
    deadline: null,
    evidence: "2026-10-24, https://www.arts.nd.gov/poetry-out-loud: 'Registration for the 2025-2026 ND Poetry Out Loud program is now closed.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "science-olympiad-arkansas-science-olympiad": {
    deadline: null,
    evidence: "2026-10-24, https://ualr.edu/scienceolympiad/registration-2/: 'Registration for the 2025-2026 Arkansas Science Olympiad will open on Tuesday September 2, 2025 and close on Friday December 12, 2025.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "utah-division-of-arts-and-museums-poetry-out-loud-utah": {
    deadline: null,
    evidence: "2026-10-24, https://artsandmuseums.utah.gov/poetry-out-loud/: '2026/2027 season: Register today! ... school-level competitions by the end of January 2027; State finals March 3, 2027. Poetry Ourselves writing contest deadline December 11, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  // Date verification 2026-10-25: listed dates checked against official pages.
  "pratt-precollege": {
    deadline: "2027-05-03",
    evidence: "2026-10-25, https://www.pratt.edu/precollege: '2027 PreCollege Summer Scholarship Application Deadline: February 1 ... 2027 PreCollege Rolling Application Deadline: May 3'",
  },
  "skillsusa-washington-skillsusa": {
    deadline: "2027-02-18",
    evidence: "2026-10-25, https://www.skillsusawa.org: 'SLSC Registration: February 11-18, 2027'",
  },
  "skillsusa-new-mexico-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: 'No 2026-27 registration deadline is posted on the official site.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-rhode-island-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: '2026-27 conference registration information: COMING IN DECEMBER' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-south-dakota-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: 'The national membership deadline is March 1st of each year, but many state deadlines fall earlier. (no 2027 state deadline posted)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-missouri-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: 'SLSC Registration Date: March 1 (no year); State Membership Deadline March 1, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-oregon-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: 'registration guide will be available following State Leadership and Skills Conference' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-oklahoma-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: 'No 2027 registration deadline is posted on the official site.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-new-hampshire-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, official site: 'State Leadership & Skills Conference (no dates shown)' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "world-food-prize-foundation-mississippi-youth-institute": {
    deadline: null,
    evidence: "2026-10-25, official site: 'Mississippi page shows the February 20, 2026 event with registration deadline January 30, 2026; no 2027 date posted' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "uc-davis-school-of-education-uc-davis-young-scholars-program": {
    deadline: null,
    evidence: "2026-10-25, https://education.ucdavis.edu/ysp-application: 'Accepting applications for the 2026 summer program ... the portal will close on March 1' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "university-of-southern-california-usc-bovard-scholars": {
    deadline: null,
    evidence: "2026-10-25, https://bovardscholars.usc.edu/our-program/how-to-apply/: 'JUNIORS: Apply by January 16, 2026' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "american-classical-league-national-latin-exam": {
    deadline: "2027-02-20",
    evidence: "2026-10-25, https://www.nle.org/important-exam-information: 'Deadline for registration for paper exams: Friday, January 29, 2027. Deadline for registration for online exams: Saturday, February 20, 2027. No registrations for online exams will be accepted after this date.'",
  },
  "skillsusa-virginia-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, https://skillsusava.org/events/state-leadership-conference/: '2026 State Leadership Conference: March 9-11, 2026 ... Registration opened January 1, 2026 and closed February 16, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "oklahoma-medical-research-foundation-fleming-scholars-program": {
    deadline: null,
    opensAt: null,
    evidence: "2026-10-25, https://omrf.org/about-omrf/training-outreach/fleming-scholar-program/application-information/: 'All completed application packets must be submitted electronically and/or postmarked by 11:59 p.m., Feb. 1, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "university-of-nebraska-medical-center-summer-high-school-advance": {
    deadline: null,
    opensAt: null,
    evidence: "2026-10-25, https://www.unmc.edu/student-success/pathway-programs/sharp/index.html: 'Online application opened November 1, 2025 ... all materials must be received by February 1, 2026.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-colorado-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, https://www.skillsusaco.org/state-conference: 'April 7-9, 2026 Pueblo, CO ... Registration: Coming soon' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-florida-skillsusa": {
    deadline: "2027-03-22",
    evidence: "2026-10-25, https://www.skillsusafl.org/slsc/: 'SLSC 2027 registration deadline: March 22, 2027 ... conference April 26-29, 2027, Jacksonville; students must be SkillsUSA members before February 1 to compete.'",
  },
  "skillsusa-montana-skillsusa": {
    deadline: "2027-03-05",
    opensAt: "2027-02-10",
    evidence: "2026-10-25, https://sites.google.com/a/montanaskillsusa.com/montana-skillsusa/home/calendar-of-events: 'Early bird registration opens February 10, 2027 ... early bird deadline February 17, 2027 ... state conference registration deadline March 5, 2027'",
  },
  "skillsusa-nebraska-skillsusa": {
    deadline: null,
    evidence: "2026-10-25, https://skillsusanebraska.org/events/state-leadership-and-skills-championships/: '2026 cycle: membership deadline February 15th and SLSC registration deadline February 22nd. 2027 SLSC listed April 8-10, 2027, Grand Island, with no 2027 registration deadline posted.' (the listed date is not on the official page; shown as Deadline TBA)",
  },
  "skillsusa-north-dakota-skillsusa": {
    deadline: "2027-03-12",
    opensAt: "2027-02-23",
    evidence: "2026-10-25, https://www.skillsusand.org/slsc: 'SLSC Registration will be open February 23 - March 12, 2027'",
  },
};

/** Applies the 2026-10-12 deadline check. Call it straight after applyHsoUpdateOct2026. */
export function applyDeadlineCheckOct2026(list: Opportunity[]): void {
  for (const opportunity of list) {
    const row = deadlineCheckOct2026[opportunity.id];
    if (!row) continue;
    if (row.deadline !== undefined) opportunity.deadline = row.deadline;
    if (row.opensAt !== undefined) opportunity.opensAt = row.opensAt;
    if (row.url) opportunity.url = row.url;
    if (row.title) opportunity.title = row.title;
    if (row.blurb) opportunity.blurb = row.blurb;
    if (row.location) opportunity.location = row.location;
    if (row.format) opportunity.format = row.format;
    if (row.cost) opportunity.cost = row.cost;
    if (row.org) opportunity.org = row.org;
    if (row.grades) opportunity.grades = row.grades;
  }
}
