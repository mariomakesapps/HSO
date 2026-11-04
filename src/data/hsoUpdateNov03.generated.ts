/* Catalogue update of 2026-11-03: next-cycle dates found on official pages for
   listings that showed no upcoming deadline, and listings removed because the
   official site shows they ended or can't be trusted. Each date's evidence is a
   comment above it. */

import type { Opportunity } from "@/data/opportunities";

export const NOV03_FIXES: Record<string, Partial<Opportunity>> = {
  // https://www.artandwriting.org/awards/how-to-enter/calendar/ | The 2027 Scholastic Art & Writing Awards open for entries on October 1, 2026. First regional deadline: December 1, 2026 (deadlines vary by region; latest regional deadline January 4, 2027).
  "scholastic": { deadline: "2026-12-01" },
  // https://kenyonreview.org/event/young-writers-summer-residential-workshops/ | Applications are due by March 1st, 2027; teachers have until March 7th at 11:59 pm PST to upload letters of recommendation. Applications beyond the March 1st deadline are not accepted.
  "kenyon": { deadline: "2027-03-01" },
  // https://www.amazonfutureengineer.com/scholarships | Applications open November 3, 2026. Application deadline: January 5, 2027. Teacher recommendation deadline: January 8, 2027. Winners notified mid-April 2027.
  "amazon-future-eng": { deadline: "2027-01-05" },
  // https://www.mcdonalds.com/us/en-us/community/hacer.html | The application period is now open until February 15, 2027.
  "mcdonalds-hacer": { deadline: "2027-02-15" },
  // https://tacobellfoundation.org/live-mas-scholarship/ | Live Más Scholarship 2027 applications are now open! Applications opened October 13, 2026. Deadline: January 5, 2027 at 5 PM PST. Selection period: Early 2027. Award notifications: Spring 2027.
  "taco-bell-live-mas": { deadline: "2027-01-05" },
  // https://www.deca.org/calendar/initial-membership-dues-deadline | Initial Membership Dues Deadline: November 15, 2026. High school chapter advisors must submit their membership roster by September 30, 2026, and pay dues by December 1, 2026.
  "dca": { deadline: "2026-11-15" },
  // https://usabo-trc.org/usabo-2027-calendar | The final deadline for School Registration is November 15, 2026 at 11:59 PM (ET). The final deadline for Student Registration is November 22, 2026 at 11:59 PM (ET). The $125 flat registration fee was due by October 23, 2026 at 11:59 PM (ET).
  "usabo": { deadline: "2026-11-15" },
  // https://www.davidsongifted.org/news/the-2027-davidson-fellows-scholarship-application-is-now-open/ | The 2027 Davidson Fellows Scholarship Application Is Now Open ... Applications are due February 17, 2027.
  "davidson-fellows": { deadline: "2027-02-17" },
  // https://www.reaganfoundation.org/education/ge-reagan-foundation-scholarship | The 2027 application is open ... Deadline: January 7, 2027 at 3:00 p.m. EST. Applicants must complete and submit all application materials prior to the deadline.
  "ge-reagan": { deadline: "2027-01-07" },
  // https://globalyouth.wharton.upenn.edu/application-information/ | Priority deadline: January 27, 2027, 5:00 p.m. ET (strongly recommended); final deadlines for on-campus programs such as Essentials of Entrepreneurship: March 19, 2027. All applications and supporting materials must be submitted electr
  "wharton-global": { deadline: "2027-01-27" },
  // https://cty.jhu.edu/cty-experience/academic-calendar | Summer A ... Registration Deadline: May 10, 2027 (courses start as early as June 13, 2027); Summer B registration closes June 7, 2027.
  "cty": { deadline: "2027-05-10" },
  // https://www.cee.org/newsevents/press-releases/applications-being-accepted-2027-research-science-institute | Applications for RSI 2027 will be open through 11:59 pm December 11, 2026. No late applications will be considered.
  "cee-ssp": { deadline: "2026-12-11" },
  // https://beamlineforschools.cern/ | Submission deadline: 12 March 2027 at 23:59 CET (Geneva time). Proposals and registrations accepted from December 2026.
  "cern-summer": { deadline: "2027-03-12" },
  // https://www.rockefeller.edu/outreach/ssrp/faqs/ | The SSRP 2027 application deadline is Monday, January 4, 2027, at 5:00pm Eastern Time. Applications opened October 12, and letters of recommendation are due the same day. Late applications will not be accepted. Program dates: Monday, June 21 – Thursd
  "rockefeller-ssrp": { deadline: "2027-01-04" },
  // https://www.stonybrook.edu/commcms/simons/applying_to/how-to-apply.php | Student application deadline of February 5, 2027, at 11:59 p.m. EST. The program runs June 28 to August 6, 2027. School nominations are due January 29, 2027, and teacher recommendations are due February 12, 2027.
  "simons-summer-research": { deadline: "2027-02-05" },
  // https://keys.arizona.edu/faq/students | Applications will open November 2, 2026 and close on December 17, 2026. The internship runs June 7 through July 23, 2027.
  "state-arizona-keys": { deadline: "2026-12-17" },
  // https://fisher.wharton.upenn.edu/management-technology-summer-institute/ | Summer 2027 application deadline: January 27, 2027. Applications opened November 2nd, and admissions decisions will be released beginning March 24, with additional decisions released on a rolling basis thereafter.
  "university-of-pennsylvania-jerome-fisher-program-management-and": { deadline: "2027-01-27" },
  // https://summer.harvard.edu/high-school/admissions/ | Summer 2027: Applications open December 1, 2026. Early: applications due January 13, 2027 (priority financial aid). Regular: applications due February 10, 2027. Late: applications due March 31, 2027, or earlier if all course waitlists fill; rollin
  "harvard-university-harvard-summer-school-high-school-programs": { deadline: "2027-02-10", opensAt: "2026-12-01" },
  // https://arts.princeton.edu/about/opportunities/high-school-poetry-contest/ten-minute-play-contest | If the 250-entry limit has not been reached by March 31, the contest will then close on March 31, 2027, at 12:00 p.m. (EDT). Submission form expected January 2027; contest closes once 250 entries are 
  "lewis-center-for-the-arts-princeton-university-princeton-univers": { deadline: "2027-03-31" },
  // https://med.stanford.edu/che/smysp.html | Applications for the 2027 SMYSP program open November 15, 2026. Our 2027 program will be held on Stanford's campus June 21st - July 23rd, 2027.
  "stanford-medical-youth-science-program-smysp": { opensAt: "2026-11-15" },
  // https://pioneeracademics.com/pioneer-research-institute/admission/ | The final application deadline for the Pioneer Research Institute 2027 Spring-through-Summer term is 11:59 pm ET, December 13, 2026. (Summer 2027 term: the final deadline for Summer applications will be released in the 2nd week of 
  "pioneer": { deadline: "2026-12-13" },
  // https://news.samsung.com/us/samsung-opens-applications-17th-annual-solve-for-tomorrow-competition/ | Samsung release, 2026-2027 key dates: applications open September 30, 2026; applications due November 23, 2026; semi-finalists announced January 20, 2027; national finalists March 18, 2027. 'Key prog
  "samsung-solve": { deadline: "2026-11-23" },
  // https://www.laphil.com/yola/programs-events/yola-national-programs/yola-national-festival | YOLA National Festival 2027: applications open now; deadline March 8, 2027, at 11:59 PM PST; festival July 24 to August 3, 2027; ages 12-18 from El Sistema-inspired and community music programs. (Date is for 
  "yola": { deadline: "2027-03-08" },
  // https://precollege.nd.edu/summer-scholars/dates-deadlines/ | Summer Scholars: application opened October 19, 2026. 'Applications and all supporting documents must be submitted by February 17, 2027.' Sessions June 19 to July 3, 2027 and July 10 to July 24, 2027.
  "notre-dame": { deadline: "2027-02-17" },
  // https://precollege.usc.edu/summer-programs/admission-tuition-fees/ | Domestic application deadline May 7, 2027 (12 p.m. PT); international deadline March 12, 2027 (12 p.m. PT). Program June 21 through July 16, 2027. Rolling decisions.
  "usc-summer": { deadline: "2027-05-07" },
  // https://www.msmnyc.edu/admission/apply-to-msm/ | Precollege Application: Available - December 1, 2026. Preferred Deadline (All Instruments) - March 1, 2027. After March 1 – $125 application fee – applications are considered on a case-by-case basis.
  "manhattan-school": { deadline: "2027-03-01", opensAt: "2026-12-01" },
  // https://www.fredhutch.org/en/education-training/high-school-students/high-school-explorers-program.html | The Summer 2027 application opens January 4, 2027. Applications close 11:59 pm PST February 28, 2027, and the recommendation form is due March 14, 2027. Program dates for 2027 are Session 1: Jul
  "fred-hutch-explorers": { deadline: "2027-02-28", opensAt: "2027-01-04" },
  // https://summer.stanford.edu/applying/dates-and-deadlines | The application opens on November 2, 2026, and the Early Decision deadline is December 15, 2026 at 9 p.m. PST, with decisions released January 14, 2027. The Regular Decision deadline is January 20, 2027 at 9 p.m. PST, with decisions on Febru
  "stanford-summer-high-school": { deadline: "2027-01-20" },
  // https://precollege.sps.columbia.edu/admissions/dates-and-deadlines | Spring 2027 Academic Year Weekend (January 15–March 21, 2027): Early Registration Deadline October 26, 2026; General Application Deadline December 21, 2026. (Early registration has passed; general deadline remains.)
  "columbia-precollege-ay-weekend-early": { deadline: "2026-12-21" },
  // https://internships.fnal.gov/fermilab-program-for-research-innovation-and-stem-mentorship-prism/ | The PRISM application window for 2027 is January 12 to March 1, 2027, according to Fermilab's internship page. The program runs July 12 to August 6, 2027. Offers go out April 12, 2027, and acceptance i
  "fermilab-high-school-programs-prism-valor-jrotc": { deadline: "2027-03-01", opensAt: "2027-01-12" },
  // https://www.roswellpark.org/education/high-school-undergrad/high-school-summer-research-program | The application portal will be open October 1, 2026-January 1, 2027, and the program runs June 28-August 6, 2027.
  "roswell-park-comprehensive-cancer-center-high-school-summer-rese": { deadline: "2027-01-01" },
  // https://med.stanford.edu/pediatrics/education/pediatrics-internship-program/application.html | Applications for the Summer 2027 cohort of the PIPS program will open on Wednesday, January 6, 2027. Application closed on Monday, February 22, 2027 (11:59pm PST). All waiver requests must be submitted by 
  "stanford-medicine-pediatrics-internship-program-at-stanford-pips": { deadline: "2027-02-22", opensAt: "2027-01-06" },
  // https://www.seattlechildrens.org/research/centers-programs/science-education-department/high-school-training-programs/ | Application deadline is Monday, March 8, 2027, at 5 p.m. Pacific time; late applications are not considered. Letters of recommendation due March 29, 2027. Applications opened Janu
  "seattle-children-s-research-institute-research-training-program": { deadline: "2027-03-08", opensAt: "2027-01-04" },
};

export const NOV03_REMOVED: Record<string, string> = {
};
