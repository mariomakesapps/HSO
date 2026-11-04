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
  // https://www.depts.ttu.edu/clarkscholars/ApplicationDetails.php | The 2027 application will open on January 2, 2027. Deadline: February 15, 2027 at 11:59 PM CT.
  "texas-tech-university-anson-l-clark-scholars-program": { deadline: "2027-02-15", opensAt: "2027-01-02" },
  // https://globalyouth.wharton.upenn.edu/application-information/ | Applications to the Leadership in the Business World program and the Management & Technology Summer Institute will close on January 27, 2027 at 5pm ET. (LBW page: priority deadline January 27, 2027; final deadline March 19, 2027.)
  "wharton-school-leadership-in-the-business-world-lbw": { deadline: "2027-01-27" },
  // https://www.usna.edu/Admissions/Programs/NASS.php | Application open January 5 - March 31, 2027.
  "united-states-naval-academy-naval-academy-summer-seminar": { deadline: "2027-03-31", opensAt: "2027-01-05" },
  // https://www.rockefeller.edu/outreach/lab-jumpstart/ | The LAB Jumpstart 2027 application deadline is Monday, January 4, 2027 at 5:00pm Eastern Time. Late applications will not be considered. Letters of Recommendation are also due on Monday, January 4, 2027 at 5:00pm Eastern Time. After-school portio
  "the-rockefeller-university-learning-at-the-bench-lab-jumpstart": { deadline: "2027-01-04" },
  // https://wsb.wharton.upenn.edu/wharton-data-competition/timeline-and-dates/ | Registration will open on December 1, 2026. Registration closes January 26, 2027 at 9:00 AM EST. Phase 1 submission due March 1, 2027.
  "wharton-sports-analytics-and-business-initiative-wharton-high-sc": { deadline: "2027-01-26", opensAt: "2026-12-01" },
  // https://wpafbstem.com/Wright_Scholar/Wright_scholar.html | Applications open November 1, 2026 and close January 10, 2027, at 5:00 PM EST. Internship runs June 7 to July 30, 2027.
  "air-force-research-laboratory-wright-patterson-afb-wright-schola": { deadline: "2027-01-10" },
  // https://sites.wustl.edu/wustlysp/programs/summer-focus/ | Summer Focus 2027 application opened November 2, 2026; application deadline January 25, 2027. Recommendation letters due February 1, 2027. Program runs May 31 to July 23, 2027.
  "washington-university-in-st-louis-young-scientist-program-summer": { deadline: "2027-01-25" },
  // https://cancer.iu.edu/education/summer/future-scientist.html | Applications open Dec. 1, 2026. ... The program is for high school juniors at the time of application who attend a Marion County public high school and have a minimum 3.0 GPA.
  "iu-melvin-and-bren-simon-comprehensive-cancer-center-future-scie": { opensAt: "2026-12-01" },
  // https://summer.ucla.edu/summer-programs/summer-college-immersion-program/scip/ | Application deadline: International applicants requiring a visa · April 1, 2027. All other applicants · April 30, 2027. All deadlines are at 5:00 PM Pacific.
  "ucla-summer-sessions-summer-college-immersion-program-scip": { deadline: "2027-04-30" },
  // https://www.usna.edu/Admissions/Programs/STEM.php | The Summer STEM application will open January 5, 2027 at 9:00am EST. ... The 2027 Summer STEM application ... closes March 31, 2027. Three sessions are offered: June 7–12, June 14–19, and June 21–25, 2027.
  "united-states-naval-academy-naval-academy-summer-stem-program": { deadline: "2027-03-31", opensAt: "2027-01-05" },
  // https://cure.dfhcc.harvard.edu/welcome/cure | The application deadline for the 2027 summer CURE high school program is January 13, 2027 ... The high school program dates are June 14th, 2027 - August 6th, 2027.
  "dana-farber-harvard-cancer-center-continuing-umbrella-of-researc": { deadline: "2027-01-13" },
  // https://www.smith.edu/academics/departments-programs-courses/precollege-programs/applying | Applications open December 10, 2026. ... The last day for domestic applications is May 1, 2027, at 11:59 p.m. ET, or once programs reach capacity, whichever comes first. The deadline for international student
  "smith-college-summer-science-and-engineering-program-ssep": { deadline: "2027-05-01", opensAt: "2026-12-10" },
  // https://www.uvm.edu/admissions/vermont-pitch-challenge/news/2027-vermont-pitch-challenge-opens-submissions | 2027 Vermont Pitch Challenge Opens for Submissions ... submissions running from October 15, 2026 to February 15, 2027. The Final Pitch Event is set for April 13, 2027.
  "university-of-vermont-vermont-pitch-challenge": { deadline: "2027-02-15" },
  // https://outreach.engineering.columbia.edu/shape/apply | SHAPE Summer 2027 application: tentative opening November 16, 2026; priority deadline December 16, 2026; final deadline March 5, 2027 at 11:59 PM; final materials (recommendation letters, transcripts, scholarship applications) due March 12, 202
  "columbia-university-summer-high-school-academic-program-for-engi": { deadline: "2027-03-05", opensAt: "2026-11-16" },
  // https://manhattanda.org/careers/internship-opportunities/high-school-internship/ | Applications open November 2, 2026, and will close at 5:00 P.M. EST on December 11, 2026. The program runs from Monday, January 11th, 2027 – Wednesday, March 17th, 2027; applicants must reside in Manhattan and be 16 –
  "manhattan-district-attorney-s-office-high-school-internship-prog": { deadline: "2026-12-11" },
  // https://www.morgan.edu/saams | SAAMS 2027: priority deadline February 28, 2027; general deadline March 31, 2027. Program runs June 28 to July 23, 2027.
  "morgan-state-university-summer-academy-of-actuarial-and-mathemat": { deadline: "2027-03-31" },
  // https://www.uaf.edu/rahi/apply.php | The RAHI 2027 application will open on January 1st and close on March 1st, 2027.
  "university-of-alaska-fairbanks-rural-alaska-honors-institute-rah": { deadline: "2027-03-01", opensAt: "2027-01-01" },
  // https://summer.virginia.edu/apply-to-uva-advance | The UVA Advance application deadline for summer 2027 is March 1, 2027. Applications for Summer 2027 open December 1.
  "university-of-virginia-uva-advance": { deadline: "2027-03-01" },
  // https://www.jlab.org/stem/hsshp | The Summer 2027 HSSHP Application will be live soon. Student Application Form by Wednesday, January 27, 2027 at 11:59 PM, ET; all other application components... no later than Friday, January 29, 2027 at 11:59 PM, ET.
  "thomas-jefferson-national-accelerator-facility-suratech-high-sch": { deadline: "2027-01-27" },
  // https://cancer.wisc.edu/research/education/high-school-education/ | Summer 2027 internship runs June 14 to August 6, 2027. Application opens January 18, 2027; closes February 22, 2026 [closing year as printed on page, apparent typo; deadline left null].
  "university-of-wisconsin-carbone-cancer-center-arise-summer-resea": { opensAt: "2027-01-18" },
  // https://new.sewanee.edu/sywc/frequently-asked-questions/ | Applications for summer 2027 will open in December 2026. Our application deadline is Monday, March 1st, 2027. The deadline for letters of recommendation is Friday, March 12th, 2027.
  "university-of-the-south-sewanee-young-writers-conference": { deadline: "2027-03-01" },
  // https://omrf.org/training-outreach/summer-scholars/ | 11:59 p.m., Feb. 1, 2027 ... incomplete application packets or materials received later than the due date will be disqualified.
  "oklahoma-medical-research-foundation-fleming-scholars-program": { deadline: "2027-02-01" },
  // https://www.cooperhewitt.org/design-competition/ | Entry period opens January 5, 2027. Stage One entry deadline: Monday, February 8, 2027, at 11:59 p.m. Eastern Time. The submission site is not live yet; email DesignCompetition@si.edu to be notified.
  "cooper-hewitt-smithsonian-design-museum-national-high-school-des": { deadline: "2027-02-08", opensAt: "2027-01-05" },
  // https://ssp.dcie.miami.edu/apply-now/application-deadlines/index.html | Applications open November 1, 2026. Early Action: December 31, 2026. Scholarship applicants and international students: March 1, 2027. Regular Decisions: April 1, 2027. Applications submitted after the April 1 deadline will be r
  "university-of-miami-pre-college-summer-scholars": { deadline: "2027-04-01" },
  // https://www.unmc.edu/student-success/pathway-programs/sharp/index.html | The online application opens November 1, 2026. Application deadline: February 1, 2027; all materials, including recommendation letters and transcripts, must be received by that date. Admission decisions mid-April 2027; program 
  "university-of-nebraska-medical-center-summer-high-school-advance": { deadline: "2027-02-01" },
  // https://www.uab.edu/medicine/surgery/prism | Applications open November 16, 2026. Application deadline: January 18, 2027 at 5 p.m. CST. Program dates (tentative): June 8 - July 30, 2027. Finalists are interviewed in March and accepted students are notified by the end of March.
  "department-of-surgery-university-of-alabama-at-birmingham-pre-co": { deadline: "2027-01-18", opensAt: "2026-11-16" },
  // https://scilympiad.com/data/org/az/public/2027%20Registration%20Checklist.docx.pdf | Arizona Science Olympiad 2027 Team Registration Checklist: $325 per team through December 1, 2026. Late registrations are accepted through January 15, 2027 with a $50 late fee ($375). Student releases due NLT 15 Jan
  "science-olympiad-arizona-science-olympiad": { deadline: "2027-01-15" },
  // https://www.engineering.iastate.edu/outreach/iowa-science-olympiad/general-guidelines/ | Early registration closes November 30, 2026. Regular registration runs from December 1, 2026 to January 15, 2027. State tournament April 10, 2027, in Ames.
  "science-olympiad-iowa-science-olympiad": { deadline: "2027-01-15" },
  // https://www.scscioly.org/getting-started | Registration for the 2026-27 season opens September 1, 2026; December 31, 2026 is the last day to register without a $50/team late fee; registration closes January 20, 2027. State tournament Saturday, February 27, 2027 at Presbyterian College.
  "science-olympiad-south-carolina-science-olympiad": { deadline: "2027-01-20" },
  // https://dos.fl.gov/cultural/programs/poetry-out-loud/ | Schools that would like to participate in Florida's official Poetry Out Loud program and send a student to Florida's Poetry Out Loud State Finals should register their school: deadline December 11, 2026. January 22, 2027: deadline to register t
  "florida-division-of-arts-and-culture-poetry-out-loud-florida": { deadline: "2026-12-11" },
  // https://www.nvartscouncil.org/programs/arts-learning/pol/teacher-registration/ | Deadline: Dec. 18, 2026, 5 p.m. PST. Please complete this form in its entirety. (2027 page timeline: January 2027 · District competitions are held. March 6, 2027 · statewide Nevada Poetry Out Loud Competition.)
  "nevada-arts-council-poetry-out-loud-nevada": { deadline: "2026-12-18" },
  // https://www.njpol.org/important-dates-1 | October 22, 2026 | NJPOL Registration Opens ... NJPOL Registration Closes January 22, 2027. Regional competitions February 1-8, 2027.
  "new-jersey-state-council-on-the-arts-poetry-out-loud-new-jersey": { deadline: "2027-01-22" },
  // https://okaplus.org/poetry-out-loud/ | 2026-2027 Poetry Out Loud timeline: School registration closes on November 6, 2026; state-level registration deadline January 22, 2027; state competition March 3, 2027.
  "oklahoma-a-schools-poetry-out-loud-oklahoma": { deadline: "2026-11-06" },
  // https://www.oregon.gov/biz/programs/pol/pages/importantdates.aspx | January 13, 2027 deadline for school and organization registration (register before winter break encouraged); school contest completion and winner registration deadline January 28, 2027.
  "oregon-arts-commission-poetry-out-loud-oregon": { deadline: "2027-01-13" },
  // https://wyoarts.state.wy.us/programs/poetry-out-loud/ | 2026–2027 season: Sept. 1, 2026 – Anthology and school registration open. Dec. 31, 2026 – Schools must register. Jan. 31, 2027 – Intent to attend state competition. Feb. 14, 2027 – School competitions and Poetry Ourselves submissions due. March
  "wyoming-arts-council-poetry-out-loud-wyoming": { deadline: "2026-12-31" },
  // https://www.worldfoodprize.org/en/youth_programs/global_youth_institute/colorado/ | Colorado GROW Youth Institute: Date: April 13, 2027, CSU Spur campus, Denver. Registration & Paper Submission Deadline: March 16, 2027. No registration fee; ninth through twelfth grade students are eligible.
  "world-food-prize-foundation-colorado-grow-youth-institute": { deadline: "2027-03-16" },
  // https://www.worldfoodprize.org/en/youth_programs/global_youth_institute/maryland/ | Maryland Youth Institute: Date: April 9, 2027, University of Maryland Eastern Shore. Registration Deadline: March 4, 2027. There is no registration cost to participate in the Institute; ninth through twelfth grade st
  "world-food-prize-foundation-maryland-youth-institute": { deadline: "2027-03-04" },
  // https://www.worldfoodprize.org/en/youth_programs/global_youth_institute/mississippi/ | Mississippi Youth Institute: Date: February 19, 2027, Mississippi State University. Paper Submission Deadline: January 29, 2027. No registration cost; ninth through twelfth grade students are eligible.
  "world-food-prize-foundation-mississippi-youth-institute": { deadline: "2027-01-29" },
  // https://www.worldfoodprize.org/en/youth_programs/global_youth_institute/wisconsin/ | Date: May 19, 2027; Venue: University of Wisconsin-Madison; Registration & Paper Submission Deadline: May 5, 2027
  "world-food-prize-foundation-wisconsin-youth-institute": { deadline: "2027-05-05" },
  // https://newsroom.edison.com/releases/edison-scholars-program-now-accepting-applications | Edison Scholars Program Now Accepting Applications (Oct. 30, 2026): the deadline to apply... is Jan. 21, 2027. High school seniors in SCE's service area planning to study STEM full-time in fall 2027; recipients
  "edison-scholars-program": { deadline: "2027-01-21" },
  // https://www.thedream.us/scholarships/national-scholarship/ | open from November 1, 2026 – February 28, 2027 ... You must apply for admission to your Partner College before the February 28, 2027, scholarship deadline.
  "thedream-us-national-scholarship": { deadline: "2027-02-28" },
  // https://www.ccny.cuny.edu/collegenow/stem-research-academy | Application window: November 9, 2026 to January 5, 2027. Spring 2027 runs February 9 to May 20, 2027; 25 students will be enrolled in a 45-hour science research course.
  "ccny-stem-ra": { deadline: "2027-01-05", opensAt: "2026-11-09" },
  // https://www.fitnyc.edu/academics/precollege/classes/high-school-summer-workshops.php | High School Summer 4-Day Workshops: June 21-24 and June 28-July 1, 2027. Registration: February 4 through June 10, 2027. One workshop $440 with all fees.
  "fit-precollege": { deadline: "2027-06-10", opensAt: "2027-02-04" },
  // https://delamed.org/programs/student-internship/ | Summer 2027 (May–August): Applications open March 1.
  "delamed-dpha-summer": { opensAt: "2027-03-01" },
  // https://mathkangaroo.org/mks/registration/ | Math Kangaroo 2027: Enrollment Starts Sept 15 [2026]. Regular enrollment deadline December 31, 2026; late enrollment deadline February 1, 2027. Competition: Thursday, March 18, 2027.
  "math-kangaroo": { deadline: "2026-12-31" },
  // https://www.csssa.ca.gov/admissions/how-to-apply/ | The official schedule lists November 1, 2026 as the application opening date... The main deadline is February 28, 2027. CSSSA's FAQ says all application materials are due by 6 pm PST on February 28. Intent to enroll and pre-registration forms due: 
  "california-state-summer-school-for-the-arts-california-state-sum": { deadline: "2027-02-28" },
  // https://science.gmu.edu/assip | The 2027 ASSIP Application will open on our website on Monday, December 7th, 2026 and close on Friday, February 12th, 2027. Final details for 2027 program dates, tuition, and participating mentors will be updated on the website throughout November 2026.
  "aspirit": { deadline: "2027-02-12", opensAt: "2026-12-07" },
  // https://www.inspiritai.com/liveonline | Fall 2026: October 15, 2026 ... Winter 2026: November 15, 2026. (Summer 2027 sessions listed: June 7–18, July 5–18, and August 2–13, 2027; no summer 2027 deadline shown.)
  "inspire": { deadline: "2026-11-15" },
  // https://sbe.org/2026-ennes-scholarships/ | Applications for the next round are open until July 1, 2027. In July 2027, the Trust anticipates awarding five $3,000 scholarships, depending on available funds.
  "ennes-scholarships": { deadline: "2027-07-01" },
  // https://www.mtfchallenge.org/register/ | Registration closes Sunday, November 8 at 11:59pm Pacific. Registration for the 2026-27 season closes on November 8, 2026. Students must be attending high school in the United States or its territories during the 2026-27 academic year.
  "soa-shark": { deadline: "2026-11-08" },
  // https://compression.stanford.edu/outreach/shtem-summer-internships-high-schoolers | Applications expected to open December 7, 2026 ... application expected to close February 21, 2027 ... The 2027 session runs seven weeks, from Monday, June 21 through Friday, August 6.
  "stanford-compression-forum-shtem-summer-internships-for-high-sch": { deadline: "2027-02-21", opensAt: "2026-12-07" },
  // https://www.moffitt.org/education/research-education-and-training/pre-college-programs/hip-imo/ | Complete applications and recommendation letters must be submitted before December 1, 2026. Late recommendation letters will not be accepted and applications will be considered incomplete. Program runs 
  "moffitt-cancer-center-high-school-internship-program-in-integrat": { deadline: "2026-12-01" },
  // https://www.uchicagomedicine.org/en/cancer/education-outreach/student-education/high-school-undergraduate/researchstart | Application deadline: January 11, 2027, at 11:59 p.m. CT. Summer experience June 14 – August 6 (35-40 hours/week). On-campus interviews February 2027; acceptance notifications Ma
  "uchicago-medicine-university-of-chicago-medicine-researchstart-p": { deadline: "2027-01-11" },
  // https://www.bbg.org/learn/gap | Applications to the 2027 Garden Apprentice Program will be accepted until Friday, December 4. ... Applicants who submit application materials before December 4, 2026, will be invited for an interview.
  "brooklyn-botanic-garden-the-garden-apprentice-program-gap": { deadline: "2026-12-04" },
  // https://www.umassmed.edu/gsbs/outreach-programs/high-school-health-careers-program/ | 2027 High School Health Careers Program (HSHCP): Application opens: December 1, 2026. Application deadline: March 1, 2027. Sunday July 11, 2027 - Friday August 6, 2027 (Four-Week Program).
  "umass-chan-medical-school-high-school-health-careers-program-hsh": { deadline: "2027-03-01", opensAt: "2026-12-01" },
  // https://metasummeracademy.com/ | Applications for Meta Summer Academy 2027 open Dec 1, 2026 and close Feb 14, 2027. Letters of recommendation and transcripts must be submitted by February 14, 2027; incomplete applications will not be considered.
  "meta-meta-summer-academy": { deadline: "2027-02-14", opensAt: "2026-12-01" },
  // https://raleighnc.gov/careers-jobs-and-volunteering/services/raleigh-summer-youth-employment | 2027 key dates: Application and Interviews: January 25 - March 15; Program dates: June 14 to August 6, 2027. Applicants must be 15 to 18 and a high school student as of May 31, 2027; mandatory onboarding d
  "city-of-raleigh-raleigh-summer-youth-employment-program-rsyep": { deadline: "2027-03-15", opensAt: "2027-01-25" },
  // https://info.umkc.edu/stahr/scholars/high-school/ | The 2027 application opens November 15, 2026. (Page lists deadline as February 1, 2026, which predates the opening and appears to be a typo; deadline not used.)
  "university-of-missouri-kansas-city-stahr-high-school-scholars-pr": { opensAt: "2026-11-15" },
  // https://school.wakehealth.edu/research/institutes-and-centers/wake-forest-institute-for-regenerative-medicine/education-and-training/high-school-summer-research-exposure-program | Applications to both programs will open on January 15, 2027 with a deadline of February 15, 2027 by 5 PM EST. ... not la
  "wake-forest-institute-for-regenerative-medicine-mentored-researc": { deadline: "2027-02-15", opensAt: "2027-01-15" },
  // https://indianactsi.org/education/student/seed-stem/ | The main SEED/STEM Summer Program page lists a March 1, 2027 deadline. Applications opened November 1, 2026, and the page gives the deadline as 11:59 p.m. EST that day. ... The program runs June 7 to July 29, 2027
  "indiana-clinical-and-translational-sciences-institute-seed-stem": { deadline: "2027-03-01" },
  // https://eller.arizona.edu/departments-research/schools-departments/accountancy/bcap | Application Deadline Date: March 1, 2027. ... The one-week residential program runs June 6 to June 11, 2027, at the Eller College of Management in Tucson.
  "university-of-arizona-eller-college-of-management-and-ey-busines": { deadline: "2027-03-01" },
  // https://www.fisherhouse.org/programs/scholarship-programs/scholarships-for-military-children/ | The application period for the 2027-2028 academic year will open on December 9, 2026. Deadline: February 10, 2027, at 9:00 p.m. Mountain Standard Time.
  "fisher-house-foundation-scholarships-for-military-children": { deadline: "2027-02-10", opensAt: "2026-12-09" },
  // https://www.sejongculturalsociety.org/writing/current/ | 2027 Sejong Writing Competition (sijo) deadline: February 28, 2027, 11:59 PM CT. Open to US and Canadian residents; pre-college division (18 and younger).
  "sejong-cultural-society-sejong-writing-competition": { deadline: "2027-02-28" },
  // https://yis.org/wp-content/uploads/2026/08/YIS-Student-Welcome-Packet-2026-2027-Final.pdf | Registration opens December 15, 2026 on the MyYIS Portal ... Registration for all competitions closes February 19, 2027. Report, PowerPoint, and YouTube link due by 11:59 pm PST on February 19, 2027 to Stockp
  "young-investors-society-global-stock-pitch-competition": { deadline: "2027-02-19", opensAt: "2026-12-15" },
  // https://sifmafoundation.org/investwrite/competition | Fall 2026 deadline: Wednesday, December 9 (all grade levels). Grades 4-5 write 300-800 words, grades 6-8 write 400-900, and grades 9-12 write 500-1000. During the Stock Market Game, which stock, bond or mutual fund investment taught you the bigge
  "sifma-foundation-investwrite-essay-competition": { deadline: "2026-12-09" },
  // https://stem.idaho.gov/idsef/ | Final project deadline: December 18, 2026, at 11:59 MT. Regional fair: TBD, week of February 22-26, 2027. ISEF will be held in Los Angeles, California in 2027.
  "idaho-stem-action-center-idaho-science-and-engineering-fairs-ids": { deadline: "2026-12-18" },
  // https://www.sarahlawrence.edu/precollege/young-writers/ | Young Writers Studio (July 19–23, 2027): The general admission deadline is May 1, 2027, with applications reviewed on a rolling basis. Painting From Poetry (July 12–30, 2027) and Rising Artists Musical Theater Intensive (July 19 – August 6, 2
  "sarah-lawrence-college-pre-college-programs-at-sarah-lawrence": { deadline: "2027-05-01" },
  // https://www.otis.edu/extension/youth-programs/summer-art/important-dates.html | Summer of Art scholarship application deadline April 16, 2027; no exceptions will be made. Registration and the scholarship application open November 16, 2026. The housing application closes June 14, 2027. The program ru
  "otis-college-of-art-and-design-summer-of-art": { opensAt: "2026-11-16" },
  // https://summer.ucsb.edu/programs/research-mentorship-program/admissions | Research Mentorship Program (RMP): Applications open December 15, 2026, and the program runs June 14 to July 31, 2027. Summer Research Academies (SRA): Applications also open December 15, 2026, with sessions from June 25 to Ju
  "university-of-california-santa-barbara-pre-college-programs-at-u": { opensAt: "2026-12-15" },
  // https://www.pcs.udel.edu/neuroscience/ | Neuroscience Pre-College Program: Registration opens December 1, 2026. Session 1 runs June 21-25, 2027 and Session 2 runs June 28-July 2, 2027. Forensic Science Pre-College Program: Registration opens December 1, 2026. The 2027 CRSI program will run from June
  "university-of-delaware-pre-college-programs-at-the-university-of": { opensAt: "2026-12-01" },
  // https://meca.edu/academics/pre-college/ | MECA&D's 2027 Pre-College deadlines are February 1, 2027 for priority and scholarship consideration, and April 15, 2027 for the general application deadline. The program runs July 11 to July 31, 2027. ... applications are reviewed on a rolling basis until th
  "maine-college-of-art-and-design-pre-college-art-and-design-progr": { deadline: "2027-04-15" },
  // https://www.babson.edu/summer-at-babson/high-school-learners/summer-study/key-dates/ | The 2027 Babson Academy Summer Study has two application rounds. The early round closes February 12, 2027, and the standard round closes March 12, 2027. ... February 12: Round One (Early Bird) Application Deadline
  "babson-college-summer-study-for-high-school-students": { deadline: "2027-03-12" },
  // https://www.smith.edu/academics/departments-programs-courses/precollege-programs/applying | Domestic applicants: The application closes May 1, 2027, at 11:59 p.m. ET, or earlier if programs reach capacity. International applicants: The deadline is March 1, 2027. Priority deadline: February 1, 2027. 
  "smith-college-precollege-programs-at-smith-college": { deadline: "2027-05-01", opensAt: "2026-12-10" },
  // https://www.fdu.edu/lifelong-learning-at-fdu/high-school-programs/summer/ | FDU's Early College Summer page says registration for Early College Summer 2027 classes will open on February 3, 2027.
  "fairleigh-dickinson-university-early-college-programs-for-high-s": { opensAt: "2027-02-03" },
  // https://precollege.adelphi.edu/ | The final deadline for Adelphi's 2027 Summer Pre-College Program is June 4, 2027. Applications are reviewed on a rolling basis until the program fills. The credit-bearing program's dates are July 11–31, 2027.
  "adelphi-university-summer-pre-college-at-adelphi": { deadline: "2027-06-04" },
  // https://www.colorado.edu/business/oda/programs-high-school-students/business-leadership-program | January 4, 2027: Application opens; March 7, 2027: Application closes; March 22, 2027: Notification of accepted students; April 4, 2027: Deadline to accept program offer. Program Dates: Sunday, June 20–
  "university-of-colorado-boulder-leeds-school-of-business-business": { deadline: "2027-03-07", opensAt: "2027-01-04" },
  // https://www.ymcayag.org/ri-join/ | The Rhode Island registration deadline for the 2027 program is February 5, 2027 ... The page's deadline table lists that date as "Registration," with the State House Day assembly on Saturday, March 13, 2027. The table also lists Feb 12, 2027 for bills, the candidat
  "ymca-rhode-island-ymca-youth-and-government": { deadline: "2027-02-05" },
  // https://www.hsfilmfest.com/submit | The final deadline is July 2, 2027 ... Entries are free through March 1, 2027, then cost $20 (April 26), $45 (May 24), and $65 (July 2). Submissions open November 2, 2026, and official selections are announced July 21, 2027
  "all-american-high-school-film-festival": { deadline: "2027-07-02" },
  // https://www.ymcayag.org/ct-calendar/ | Jan 29, 2027 | Registration
  "ymca-connecticut-ymca-youth-and-government": { deadline: "2027-01-29" },
  // https://www.ymcade.org/youth-in-government/ | opens December 1, 2026 ... Registration Deadline: February 19, 2027
  "ymca-delaware-ymca-youth-and-government": { deadline: "2027-02-19", opensAt: "2026-12-01" },
  // https://www.nmyag.org/2027-hs-program | Early registration deadline: December 11, 2026 ($310) ... Late registration deadline: January 14, 2027 ($330)
  "ymca-new-mexico-ymca-youth-and-government": { deadline: "2027-01-14" },
  // https://www.ymcayag.org/ny-join/ | Feb 8, 2027 | Registration ... High school need-based aid applications are due by Feb 15, 2027
  "ymca-new-york-ymca-youth-and-government": { deadline: "2027-02-08" },
  // https://www.scbar.org/for-the-public/law-related-education/mock-trial/high-school-mock-trial/hsmt-important-dates/ | August 3, 2026 - Registration Opens August 3, 2026 - Rules Released ... October 30, 2026 - Registration Deadline (No late fee) ... November 20, 2026 - Registration Deadline @ Noon (Wi
  "south-carolina-bar-south-carolina-high-school-mock-trial-competi": { deadline: "2026-11-20" },
};

export const NOV03_REMOVED: Record<string, string> = {
  // https://artswestchester.org/intern-volunteer-more/ "Our internship and volunteer program are undergoing a restructuring process, and we do not have any opportunities available now."
  "artswestchester-internship": "/categories/internships",
  // https://afsa.org/essay-contest "The National High School Essay Contest will be on hiatus for the 2026–2027 academic year"
  "afsa-essay": "/categories/scholarships",
  // https://www.lcfpd.org/assets/1/7/2027_BUDGET_BOOK__-_BOARD__APPROVED_10-14-26.pdf 2027 budget (board approved 10-14-26) discontinues the Youth Conservation Corps
  "lake-county-forest-perserves-youth-conservation-corp-crew-member": "/categories/internships",
  // https://nsil.sites.unlv.edu/GUIC.html and https://nsil.sites.unlv.edu/ITEST.html: a three-year NSF project; 2023 was the camp's third year and the page's eligibility rule still refers to Fall 2023, with no later session posted
  "university-of-nevada-las-vegas-guic-summer-camp": "/categories/summer-programs",
  // The listed page (https://lasvegasymca.org/programs/youth-sports-activities/teen-programs/) has no Youth and Government program, and no Nevada YMCA Youth and Government program could be found
  "ymca-nevada-ymca-youth-and-government": "/categories/fellowships",
  // Duplicate of columbia-precollege-ay-weekend: same page, same December 21, 2026 deadline, same courses and fees
  "columbia-precollege-ay-weekend-early": "/opportunities/columbia-precollege-ay-weekend",
  // Not a high school opportunity: one participant per UNESCO National Commission, selected by the Secretariat; national calls for the 14th forum (Oct 2025) asked for ages 18-35
  "unesco-youth": "/categories/fellowships",
};
