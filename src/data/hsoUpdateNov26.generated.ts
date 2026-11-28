/* Catalogue update of 2026-11-26: listings whose deadline had passed, re-checked against
   their official pages. Where the page posts the next cycle's dates (with the year) the
   listing gets them; where it does not, the passed date is cleared so the listing reads
   "Deadline TBA" instead of repeating last cycle's date. Each change's evidence is a
   comment above it. */

import type { Opportunity } from "@/data/opportunities";

export const NOV26_FIXES: Record<string, Partial<Opportunity>> = {
  // https://bronxmuseum.org/learn/teens/ | Every year, The Bronx Museum invites New York City high school students between the ages of 14–19 to apply for the fall, spring, and/or summer sessions of our exciting youth internship program!
  "bronx-museum-teen-council": {"deadline": null},
  // https://youngarts.org/apply/ | The 2028 YoungArts application opens Summer 2027. ... 2027 National Competition Oct 6 Application Closes
  "youngarts-national-arts": {"deadline": null, "opensAt": null},
  // https://www.supercomputingchallenge.org/ | Aug 1–Sep 30, 2026 Register ... Oct 9, 2026 Proposal Teams submit a short proposal by October 9 (250 words max).
  "state-new-mexico-supercomputing": {"deadline": null},
  // https://pumac.princeton.edu | Registration for PUMaC 2026 is currently open with rolling applications until October 11th! ... This Year’s Competition Date: November 21, 2026
  "pumac": {"deadline": null},
  // https://www.noguchi.org/museum/education/teens/teen-advisory-board/ | Applications are now open and due by Monday, October 12, 2026, 9 am ET.
  "the-isamu-noguchi-foundation-and-garden-museum-teen-advisory-boa": {"deadline": null},
  // https://www.stellarxplorers.org/competition.html | OCT. 14, 2026 LAST DAY TO REGISTER TEAMS | OCT. 21, 2026 LAST DAY TO REGISTER COMPETITORS | NOV. 5, 2026 PAYMENT DEADLINE
  "army-rebotics": {"deadline": null},
  // https://maa.org/amcreg/ | Regular Registration Deadline: October 15, 2026 ($75 registration fee) - Final deadline for new competition managers; Late Registration Deadline: October 28, 2026 ($115 registration fee) - Returning competition managers only
  "amc": {"deadline": null, "blurb": "The gateway to the AIME and the USAMO, taken at a school, college, math circle or learning center that must register as a competition site. The AMC 10 is open to students in grade 10 and below and the AMC 12 to students in grade 12 and below, and each is offered on two dates, A and B, every fall. Sites new to the AMC must register by the regular deadline, and only returning competition managers may use the later late-registration window."},
  // https://www.marjotfoundation.org/ | Proposals are due twice a year on October 15 or April 20, so apply today! Application Deadline for the 2026-27 School year april 20, 2027
  "the-marjot-foundation-student-environmental-research-grants": {"deadline": "2027-04-20"},
  // https://danielsfund.org/our-work/scholarships/ | The Daniels Scholarship Program application is now closed. ... Applications are open September 1 - October 15 at 4:00 p.m. MT
  "daniels-fund-daniels-scholarship-program": {"deadline": null, "blurb": "Last-dollar college scholarship with personal support for high-achieving, values-driven high school seniors in Colorado, New Mexico, Utah and Wyoming, covering up to $25,000 a year at non-partner colleges outside the region. Scholars may attend any accredited nonprofit college or university in the U.S., and partner schools combine funding with the Daniels Fund to cover up to the full cost of attendance."},
  // https://www.asan.com/annual-math-contest | The SUGGESTED DEADLINE FOR ENTRY for thenext school year AMERICAN SCHOLASTIC MATHEMATICS CONTEST, is October 15.
  "american-scholastic-mathematics-association-american-scholastic": {"deadline": null},
  // https://www.artscouncil.nebraska.gov/arts-education/poetry-out-loud/ | Registration Deadline: October 15, 2026
  "nebraska-arts-council-poetry-out-loud-nebraska": {"deadline": null},
  // https://www.metmuseum.org/opportunities/internships/spring-semester-internships-for-high-school-students | Application Deadline: Friday, October 16, 2026, 6 pm ET
  "the-metropolitan-museum-of-art-met-high-school-internship-progra": {"deadline": null},
  // https://www.brooklynmuseum.org/careers/internships-fellowships/intersextions | Apply online by October 18, 2026.
  "the-brooklyn-museum-intersextions-gender-sexuality": {"deadline": null},
  // https://www.sphinxmusic.org/sphinx-competition | 2027 Application Deadline: Oct. 20, 2026(no late applications will be accepted past the deadline)
  "sphinx-organization-sphinx-competition-junior-division": {"deadline": null},
  // https://www.ornl.gov/content/next-generation-stem-internship-program | Program URL redirects to the ORNL homepage; no current program page found.
  "oak-ridge-national-laboratory-next-generation-stem-internships-p": {"deadline": null},
  // https://www.shu.edu/undergraduate-admissions/pirates-pitch-competition.html | Applications will be accepted starting Monday August 31, 2026 through Wednesday October 21, 2026. ... Registration is no longer available because the registration deadline has passed.
  "seton-hall-university-pirates-pitch-competition-for-high-school": {"deadline": null},
  // https://vsgc.odu.edu/VASTS/ | Online Course Applications: Open August 15-Due October 25 ... CLICK HERE TO APPLY TODAY (DUE OCTOBER 24, 2026)
  "virginia-space-grant-consortium-virginia-aerospace-science-and-t": {"deadline": null, "blurb": "Free online STEM course for Virginia juniors and seniors built around a Mars mission design, with top students earning a six-day residential summer academy at NASA's Langley Research Center. Applicants must be Virginia residents and U.S. citizens or permanent residents, at least 16 years old, with a minimum 2.7 GPA, and need a teacher recommendation and a school counselor letter."},
  // https://dukemathmeet.org/ | Thank you for coming to Duke Math Meet 2026! Team and individual results are posted in the Archive tab.
  "duke-university-mathematics-union-duke-math-meet": {"deadline": null},
  // https://www.congressionalappchallenge.us/students/student-registration/ | Registration for the 2026 Congressional App Challenge is now closed. The 2026 competition deadline was scheduled for October 26, 2026 at 9:00 pm ET.
  "congressional-app": {"deadline": null, "blurb": "District-level coding competition run by members of Congress, open to high school students in participating districts, with winning apps displayed in the U.S. Capitol. Students register and submit themselves, but only if their Member of Congress has signed up the district. The online application covers an applicant profile, an eligibility check, the full app submission and a short survey."},
  // https://www.aspirations.org/award-programs/aic-high-school-award | Applications are CLOSED. ... To be considered for the 2026-27 AiC High School Award, applicants must submit a completed application by the final deadline at 10:00 p.m. ET on October 27, 2026.
  "ncwit-aspirations": {"deadline": null},
  // https://ussenateyouth.org/ | The 65th annual United States Senate Youth Program Washington Week will be in Washington, D.C. March 6 – 13, 2027. The national deadline for all states to submit their delegate selections is December 1, 2026.
  "usef": {"deadline": null},
  // https://zuckermaninstitute.columbia.edu/brainyac | Applications for BRAINYAC 2027 are now closed and we are unable to accept any additional applications. We anticipate opening applications for BRAINYAC 2028 in October, 2027.
  "columbia-brainyac": {"deadline": null, "blurb": "Paid summer neuroscience research apprenticeship at Columbia's Zuckerman Institute for NYC 10th and 11th graders enrolled in a partner program (S-PREP, BioBus, Lang Youth Medical, Columbia Secondary School or Double Discovery Center). Students apply through their partner program. Each intern is matched with a Columbia neuroscientist mentor who guides a lab research project, and preference goes to students in upper Manhattan and the South Bronx."},
  // https://bigideasd.com/ | The 2026 BIG Idea Competition is closed and our finalists have been announed.  The 2027 Competition will open September 1st!
  "big-idea-south-dakota-big-idea-competition": {"deadline": null},
  // https://arts.delaware.gov/programs-events/poetry-out-loud/ | October 30, 2026 Registration Deadline ... December 18, 2026 Deadline to Report School Winners ... February 18, 2027 Delaware State Finals
  "delaware-division-of-the-arts-poetry-out-loud-delaware": {"deadline": null},
  // https://www.ncarts.org/arts-council-z/poetry-out-loud | Registration opens: September 8, 2026 ... Registration closes: October 30, 2026 ... Regional and state finals: at ImaginOn, Charlotte, on Saturday, February 27, 2027
  "north-carolina-arts-council-and-childrens-theatre-of-charlotte-p": {"deadline": null},
  // https://www.maineyg.org/ | YMCA State of Maine Youth and Government 2026 Program Calendar ... Saturday, August 1 | Registration Opens! ... Thursday, October 22 | Bill Submission Deadline ... Friday-Sunday, November 6-7-8 | Youth and Government Weekend
  "ymca-maine-ymca-youth-and-government": {"deadline": null},
  // https://www.flsouthern.edu/academic-life/academic-centers/justice-teaching/other-programs/high-school-mock-trial-competition | The Florida High School Mock Trial Competition will be held March 2027, in Orlando at the Orange County Courthouse. Circuit competitions are scheduled locally and should be held in January and February. ... The registration deadline is November 1, 2026.
  "justice-teaching-center-florida-southern-college-florida-high-sc": {"deadline": null, "blurb": "Teams argue both sides of a hypothetical case in a real courtroom before judges and attorneys who score them; the state champion goes to the national championship. Teams from Florida's twenty judicial circuits compete in January and February; circuit winners reach the state finals at the Orange County Courthouse in Orlando in March 2027.", "url": "https://www.flsouthern.edu/academics/centers-and-institutes/justice-teaching-center/other-programs/high-school-mock-trial-program/index.html"},
  // https://www.vfw.org/community/youth-and-education/youth-scholarships | find your sponsoring local VFW Post as essays must be turned in by midnight, Oct. 31.
  "vfw-voice-of-democracy": {"deadline": null},
  // https://www.hollins.edu/academics/pre-college-experiences-camps/nancy-thorp-poetry-contest/ | Deadline for Entry October 31, 2026
  "hollins-university-nancy-thorp-poetry-contest": {"deadline": null},
  // https://mikeroweworks.org/scholarship/ | Apply anytime now until October 31st. We award scholarships four times a year ... Apply by April 30th ... Apply by June 30th ... Apply by August 30th ... Apply by October 31st
  "mikeroweworks-foundation-work-ethic-scholarship-program": {"deadline": null},
  // https://azarts.gov/news/register-now-for-2027-poetry-out-loud/ | Registration closes October 31, 2026 ... October 31, 2026 – School Registration Closes; January 2027 – Classroom/Schoolwide Contests
  "arizona-commission-on-the-arts-poetry-out-loud-arizona": {"deadline": null},
  // https://www.harvardmun.org | THE SEVENTY-FOURTH SESSION Harvard Model United Nations January 28th, 2027 — January 31st, 2027 Register Here
  "harvard-mun": {"deadline": null},
  // https://www.muw.edu/education/govschool/ | Application Final Deadline: November 1, 2026 (APPLICATIONS HAVE CLOSED.) ... Program Dates: June 6-19, 2027
  "state-mississippi-governors-school": {"deadline": null},
  // https://park.ncsu.edu/apply/ | The application for 2026-2027 is now closed. ... By 11:59 pm ET, November 1: Apply for undergraduate admission to NC State. Complete the Park Scholarships application.
  "park-scholarships": {"deadline": null},
  // https://www.bennington.edu/events/bennington-young-creators-awards/bennington-young-writers-awards | Submissions were accepted beginning September 1 at 9:00 AM ET through November 1 at 11:59 PM ET. ... The 2026 YCA contest is now closed.
  "bennington-college-bennington-young-writers-awards": {"deadline": null},
  // https://hispanicheritage.org/youth-awards/ | Application Closed ## Deadline: November 1st, 2026 ## Eligibility Must have a minimum unweighted 3.0 GPA on a 4.0 scale ... Gold, Silver, and Bronze recipients are selected in each category and receive a one-time innovation grant
  "hispanic-heritage-foundation-hispanic-heritage-youth-awards": {"deadline": null, "blurb": "National recognition and college funding grants for Latino high school seniors excelling in areas such as STEM, entrepreneurship, media and public service, open to students in all 50 states, Puerto Rico and D.C. Applicants need a minimum unweighted 3.0 GPA and must enroll at an accredited college the following year. Gold, Silver and Bronze recipients in each category receive a one-time grant and are honored in virtual regional ceremonies."},
  // https://math.mit.edu/research/highschool/primes/ | Applications to PRIMES, PRIMES-USA, and PRIMES Circle are now open! The deadline is November 2, 2026
  "hcssim-prim": {"deadline": null},
  // https://math.mit.edu/research/highschool/primes/ | Applications to PRIMES, PRIMES-USA, and PRIMES Circle are now open! The deadline is November 2, 2026
  "prim-usa": {"deadline": null},
  // https://www.futureengineers.org/nasatechrise | Challenge Closed ... Entries Due By: November 2, 2026 ... WINNERS ANNOUNCED & BUILD BEGINS 19 January 2027
  "nasa-future-engineers-nasa-techrise-student-challenge": {"deadline": null},
  // https://jabsom.hawaii.edu/research/trainees/high-school-and-undergraduate-opportunities-in-research.html | The highly competitive STEP-UP Program provides hands-on summer research experiences for high school and undergraduate students interested in exploring research careers.
  "university-of-hawaii-john-a-burns-school-of-medicine-high-school": {"deadline": null},
  // https://www.chick-fil-a.com/customer-support/who-we-are/giving-back/does-chick-fil-a-give-out-scholarships | Through the Remarkable Futures™ Scholarship initiative ... Chick-fil-A offers two scholarship awards — $1,500 and $25,000 — to Team Members who work at a franchised, company-owned and/or affiliated restaurant. Visit our [Remarkable Futures Scholarship page](https://www.chick-fil-a.com/remarkable-fut
  "chick-fil-a-remarkable-futures": {"deadline": null, "opensAt": null},
  // https://usagermanyscholarship.org/apply/ | The CBYX high school program is no longer accepting applications for the 2027-28 program. ... To be notified when the 2028-29 high school program application is available, please register here.
  "cbyx-congress-bundestag-youth-exchange": {"deadline": null},
  // https://www.contest.comap.com/highschool/contests/himcm/index.html | 2026 High School Mathematical Contest in Modeling (HiMCM)® Middle Mathematical Contest in Modeling (MidMCM) Will Be Held on November 4-17, 2026
  "comap-high-school-mathematical-contest-in-modeling-himcm": {"deadline": null},
  // https://www.societyforscience.org/regeneron-sts/ | The Regeneron STS 2027 Application closed on November 5, 2026. ... STS Application Period June 1 – November 5, 2026
  "regeneron-sts": {"deadline": null, "opensAt": null},
  // https://mmia.medicine.iu.edu/ | Applications AND teacher recommendations are due Nov. 6, 2026, at 11:59 p.m. ET.
  "indiana-university-school-of-medicine-molecular-medicine-in-acti": {"deadline": null},
  // https://okaplus.org/poetry-out-loud/ | November 6, 2026 – School Registration Closes January 22, 2027 – Deadline to register for the State Competition ... March 3, 2027 – State Competition
  "oklahoma-a-schools-poetry-out-loud-oklahoma": {"deadline": "2027-01-22"},
  // https://www.mtfchallenge.org/ | Registration is open every Fall.
  "soa-shark": {"deadline": null},
  // https://tisch.nyu.edu/special-programs/high-school-programs/tisch-spring-future-artists-program | The spring 2027 application is currently open! The application deadline is November 9, 2026.
  "new-york-university-tisch-future-artists": {"deadline": null},
  // https://www.house.mn.gov/sergeant/howto | Only complete applications received at the Sergeant at Arms Office by the end of business on November 10th, 2026 will be considered.
  "minnesota-house-of-representatives-house-high-school-page-progra": {"deadline": null},
  // https://www.jkcf.org/our-scholarships/college-scholarship-program/how-to-apply/ | August 19, 2026 Application opens. Apply online in the Common App. November 11, 2026 Application submission deadline. ... The Cooke College Scholarship Program application is currently closed.
  "jkc": {"deadline": null},
  // https://www.nsliforyouth.org/how-to-apply/dates-and-deadlines/ | Virtual NSLI-Y will be offered in Fall 2027. Fall 2027 Key Dates May 2027: Application opens June 7, 2027 (4 PM ET): Application deadline
  "nsli-y": {"deadline": null},
  // https://www.elks.org/scholars/scholarships/MVS.cfm | The 2027 MVS application has closed.
  "csv-sch-elks-national-foundation-scholarship": {"deadline": null},
  // https://highschoolhackathon.org/ | The 2026 hackathon has concluded. Thank you to every participant.
  "veritas-ai-high-school-hackathon": {"blurb": "Free 48-hour online AI hackathon for high schoolers anywhere in the world, held over one November weekend. Go solo or in a team of up to 3. No AI experience needed and there are free prep workshops. The top team wins an internship at Arecibo AI, and winners share scholarships from a $75,000+ prize pool. Finalists pitch live to researchers from Microsoft Research and Stanford."},
  // https://caltechmathmeet.org/registration/ | Caltech Math Meet 2027 will take place on January 23rd, 2027. Registration is now closed.
  "caltech-caltech-math-meet": {"deadline": null},
  // https://jacobsoninstitute.org/bizinnovator/innovatorcompetition | Deadlines and dates for the next Innovator Competition: Application deadline: November 13, 2026
  "university-of-iowa-jacobson-institute-innovator-competition": {"deadline": null},
  // https://www.nybg.org/education/childrens-education/kids-teens/explainers/ | Spring 2027 Application Deadline Saturday November 14, 2026; 11:59 p.m.
  "nybg-explainers": {"deadline": null},
  // https://usabo-trc.org/ | 2027 USABO Test Administrator and Student Registrations CLOSED 2028 USABO Registration opens August 2, 2027
  "usabo": {"deadline": null, "opensAt": "2027-08-02"},
  // https://www.inspiritai.com/liveonline | Application Deadlines Winter 2026: November 30, 2026 Applications are processed on a rolling basis. Limited seats.
  "inspire": {"deadline": "2026-11-30"},
  // https://www.deca.org/hs | Ready to begin this amazing experience? Contact the DECA advisor at your high school to learn how to join your school's DECA chapter.
  "dca": {"deadline": null},
  // https://www.spaceappschallenge.org/ | MISSION COMPLETE! Thank you to everyone who joined us for the 2026 NASA Space Apps Challenge! ... JOIN NASA SPACE APPS CHALLENGE NOVEMBER 14-15, 2026
  "stargate": {"deadline": null},
  // https://robertsonscholars.org/high-school-students-2/ | Application Opens: August 15, 2026 Early Notification Deadline: October 15, 2026 Regular Application Deadline: November 15, 2026
  "duke-university-and-unc-chapel-hill-robertson-scholars-leadershi": {"deadline": null},
  // https://apply.emory.edu/financial-aid/scholar-program | November 1 | EDI Scholar Program deadline | November 15 | EDII and RD Scholar Program deadline
  "emory-university-emory-university-scholar-programs": {"deadline": null},
  // https://www.firstinspires.org/programs/cost-and-registration | 1 Regional Event | $6,500 (included with your team registration fee) | November 17, 2026 ... Additional Regional Event | $3,200 per event | January 21, 2027
  "first-robotics": {"deadline": null},
  // https://www.nationalhonorsociety.org/the-nhs-scholarship/ | Thank you for your interest in the NHS Scholarship. The application is currently closed. ... November 20, 2026 at 5:00 p.m. (ET): Submission deadline
  "national-honor-society-nassp-nhs-scholarship": {"deadline": null},
  // https://www.arts.wa.gov/poetry-out-loud/ | Poetry Programs Registration has closed for this school year. ... Registration deadline: November 20, 2026 ... School Finals deadline: January 15, 2027
  "washington-state-arts-commission-poetry-out-loud-washington": {"deadline": null},
  // https://www.scbar.org/for-the-public/law-related-education/mock-trial/high-school-mock-trial/hsmt-important-dates/ | October 30, 2026 - Registration Deadline (No late fee) ... November 20, 2026 - Registration Deadline @ Noon (With additional $50 late fee)
  "south-carolina-bar-south-carolina-high-school-mock-trial-competi": {"deadline": null},
  // https://gsfta.com/ | Dance, Theatre, and Visual Arts Application (Student Portion): CLOSED ... Vocal/Instrumental Music and Filmmaking Application Deadline (Student Portion): January 15, 2027
  "middle-tennessee-state-university-governors-school-for-the-arts": {"deadline": "2027-01-15", "url": "https://www.mtsu.edu/gsfta/"},
  // https://www.apsu.edu/governors-school/dates.php | Oct 1, 2026 | Application Release Date ... Nov 20, 2026 | Student Portion of the Application Due
  "austin-peay-state-university-governors-school-for-computational": {"deadline": null},
  // https://www.tntech.edu/engineering/pre-college-programs/gset.php | Applications open Oct. 1, 2026. Applications MUST BE RECEIVED through the TN Governor's Schools 2027 Unified Application by FRIDAY, NOV. 20, 2026.
  "tennessee-technological-university-governors-school-for-emerging": {"deadline": null, "url": "https://www.tntech.edu/education/stem/gset.php"},
  // https://www.etsu.edu/coe/stem-education/govschool/ | Deadline to submit all student application material is 11:59 pm ET, Friday, November 20, 2026.
  "east-tennessee-state-university-governors-school-for-the-integra": {"deadline": null},
  // https://www.memphis.edu/govschool/ | The application for the 2027 program will open on October 1. The deadline for the student portion of the application is November 20.
  "university-of-memphis-governors-school-for-international-studies": {"deadline": null},
  // https://gsse.utk.edu/ | October 1, 2026 | Applications Open | November 20, 2026 | Student Applications Due
  "university-of-tennessee-knoxville-governors-school-for-the-scien": {"deadline": null},
  // https://legislature.idaho.gov/house/house-legislative-page-program-information/ | The deadline to apply to be a House Page is November 20, 2026.
  "idaho-house-of-representatives-house-legislative-page-program": {"deadline": null},
  // https://horizoninspires.com/programs/ | Winter II 2026 Application Deadline: January 3, 2027 Cohort Start Date: January 25, 2027
  "horizon": {"deadline": "2027-01-03"},
  // https://www.samsung.com/us/solvefortomorrow/ | Good news! Applications have been extended! There's still time. Apply by December 7 for the chance to win Samsung technology and classroom prizes.
  "samsung-solve": {"deadline": null},
  // https://science.osti.gov/wdts/nsb | 2027 National Finals April 29 – May 3, 2027
  "u-s-department-of-energy-national-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/AL_Alabama-High-School-Regional-Science-Bowl | Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. ... Date: February 6, 2027
  "u-s-department-of-energy-alabama-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/AK_Alaska-High-School-Regional-Science-Bowl | Alaska High School Regional Science Bowl – Virtual Event ... Registration Fee: n/a ... Location Virtual ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration.
  "u-s-department-of-energy-alaska-regional-science-bowl": {"deadline": null, "cost": "Free", "format": "Online"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/AZ_Maricopa-Institute-of-Technology-High-School-Regional-Science-Bowl | Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. ... Date: February 6, 2027 ... Registration Fee: $100
  "u-s-department-of-energy-arizona-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/AR_Arkansas-High-School-Regional-Science-Bowl | Date: February 27, 2027 ... Registration Fee: n/a ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration.
  "u-s-department-of-energy-arkansas-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/California | State hub page '# California' lists only a 'California Counties | Regional Locations' table (e.g. "Alameda County | Sandia National Labs' High School Regional Science Bowl") and the national contact block; no registration dates are posted.
  "u-s-department-of-energy-california-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/CO_Colorado-High-School-Regional-Science-Bowl | Date: 2/20/2027 ... Registration Fee: n/a ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. Note: Pre
  "u-s-department-of-energy-colorado-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/CT_Connecticut-High-School-Regional-Science-Bowl | Date: 2/27/2027 ... Registration Fee: $200 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. Note: Pr
  "u-s-department-of-energy-connecticut-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/DE_NJ_New-Jersey-High-School-Regional-Science-Bowl | Date: 02/20/2027 ... Registration Fee: n/a ... States and/or Counties Served Delaware New Jersey ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 2
  "u-s-department-of-energy-delaware-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MD_DC_Maryland-DC-Regional-High-School-Science-Bowl | Date: January 23, 2027 ... Registration Fee: n/a ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. No
  "u-s-department-of-energy-district-of-columbia-regional-science-b": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Florida | State hub page '# Florida' lists only a 'Florida Counties | Regional Locations' table (e.g. "Alachua County | North Central Florida High School Regional Science Bowl") and the national contact block; no registration dates are posted.
  "u-s-department-of-energy-florida-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Georgia/GA_Georgia-High-School-Regional-Science-Bowl | Date of Subregionals: February 6, 2027; State Championship: February 12, 2027 ... Registration Fee: $60 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE Nov
  "u-s-department-of-energy-georgia-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/HI_Hawaii-High-School-Regional-Science-Bowl | Date: January 30, 2027 ... Registration Fee: n/a ... Location Virtual ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses i
  "u-s-department-of-energy-hawaii-regional-science-bowl": {"deadline": null, "cost": "Free", "format": "Online"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Idaho | State hub page '# Idaho' lists only a 'Idaho Counties | Regional Locations' table (e.g. "Ada County | Western Idaho High School Regional Science Bowl") and the national contact block; no registration dates are posted.
  "u-s-department-of-energy-idaho-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Illinois | State hub page '# Illinois' lists only a 'Illinois Counties | Regional Locations' table (e.g. "Cook County | Chicago High School Regional Science Bowl") and the national contact block; no registration dates are posted.
  "u-s-department-of-energy-illinois-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/IN_Indiana-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Registration Fee: $50 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. N
  "u-s-department-of-energy-indiana-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/IA_Iowa-High-School-Regional-Science-Bowl | Date: March 6, 2027 ... Registration Fee: n/a ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. Note:
  "u-s-department-of-energy-iowa-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/KS_Kansas-and-Western-Missouri-High-School-Regional-Science-Bowl | Date: March 6, 2027 ... Registration Fee: n/a ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. Note:
  "u-s-department-of-energy-kansas-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Kentucky | State hub page '# Kentucky' lists only a 'Kentucky Counties | Regional Locations' table (e.g. "West Kentucky High School Regional Science Bowl / Greater Cincinnati High School Regional Science Bowl") and the national contact block; no registration dates are posted.
  "u-s-department-of-energy-kentucky-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/LA_Louisiana-Regional-High-School-Science-Bowl | Date: March 20, 2027 ... Registration Fee: $75 per team ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved sp
  "u-s-department-of-energy-louisiana-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/ME_Maine-High-School-Regional-Science-Bowl | Date: February 27, 2027 ... Registration Fee: $75 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. N
  "u-s-department-of-energy-maine-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MD_DC_Maryland-DC-Regional-High-School-Science-Bowl | Date: January 23, 2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBM
  "u-s-department-of-energy-maryland-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MA_NH_RI_VT_Northeast-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Registration Fee: $120 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SU
  "u-s-department-of-energy-massachusetts-regional-science-bowl": {"deadline": null, "blurb": "Massachusetts schools enter the Department of Energy's National Science Bowl through the Northeast regional, shared with New Hampshire, Rhode Island and Vermont. Teams of four students plus an alternate and a teacher coach answer fast-paced questions across math and the sciences, and the regional winner goes on to the National Science Bowl finals."},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MI_Michigan-High-School-Regional-Science-Bowl | Date: February 5, 2027 ... Registration Fee: $50 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBM
  "u-s-department-of-energy-michigan-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MN_Minnesota-High-Regional-School-Science-Bowl | Date: January 23, 2027 ... Registration Fee: $300 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUB
  "u-s-department-of-energy-minnesota-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MS_Mississippi-Regional-High-School-Science-Bowl | Date: February 19, 2027 ... Registration Fee: $65 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUB
  "u-s-department-of-energy-mississippi-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Missouri/MO_Eastern-MO-High-School-Regional-Science-Bowl | Date: February 19-20, 2027 ... Registration Fee: $25 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must 
  "u-s-department-of-energy-missouri-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Montana/MT_Big-Sky-High-School-Regional-Science-Bowl | Date: 03/12/2027 ... Registration Fee: N/A ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT the
  "u-s-department-of-energy-montana-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/NE_Nebraska-High-School-Regional-Science-Bowl | Date: February 6, 2027 ... Registration Fee: $150 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUB
  "u-s-department-of-energy-nebraska-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/NV_Nevada-High-School-Regional-Science-Bowl | Date: February 6, 2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBM
  "u-s-department-of-energy-nevada-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MA_NH_RI_VT_Northeast-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Registration Fee: $120 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SU
  "u-s-department-of-energy-new-hampshire-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/DE_NJ_New-Jersey-High-School-Regional-Science-Bowl | Date: 02/20/2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT the
  "u-s-department-of-energy-new-jersey-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/New-Mexico/NM_New-Mexico-High-School-Regional-Science-Bowl | Date: March 6, 2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT 
  "u-s-department-of-energy-new-mexico-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/New-York/NY_NYC-High-School-Regional-Science-Bowl | Date: 03/06/2027 ... Registration Fee: $20 ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT the
  "u-s-department-of-energy-new-york-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/NC_North-Carolina-Regional-High-School-Science-Bowl | Date: February 6, 2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBM
  "u-s-department-of-energy-north-carolina-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/ND_North-Dakota-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUB
  "u-s-department-of-energy-north-dakota-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Ohio/OH_KY_Greater-Cincinnati-High-School-Regional-Science-Bowl | Date: 02/27/2027 ... Registration Fee: n/a ... Please read: 2027 Registration Process ... Beginning October 5, 2026 at noon Eastern: Coaches either log-in to existing or create new accounts. ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT the
  "u-s-department-of-energy-ohio-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/OK_Oklahoma-High-School-Regional-Science-Bowl | Date: 01/23/2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space. Registration Fee: none
  "u-s-department-of-energy-oklahoma-regional-science-bowl": {"deadline": null, "cost": "Free"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Oregon/OR_WA_BPA-High-School-Regional-Science-Bowl | Date: February 27, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-oregon-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Pennsylvania/PA_Western-Pennsylvania-High-School-Regional-Science-Bowl | Date: March 6, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-pennsylvania-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MA_NH_RI_VT_Northeast-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-rhode-island-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/SC_DOE-Savannah-River-Regional-Science-Bowl | Date: February 20, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-south-carolina-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals | Listed URL returns: "404 - Page not found ... sd_south-dakota-high-school-regional-science-bowl you clicked on is broken." High School Regionals index: "Registration for the 2027 regional competitions will open Monday, October 5, 2026, at 12:00 noon Eastern time." ... "### [South Dakota](https://sci
  "u-s-department-of-energy-south-dakota-regional-science-bowl": {"deadline": null, "url": "https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/ND_North-Dakota-High-School-Regional-Science-Bowl"},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/TN_Tennessee-High-School-Regional-Science-Bowl | Date: February 27, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-tennessee-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Texas/TX_Texas-AM-High-School-Regional-Science-Bowl | Date: February 6, 2027 ... First teams that are preregistered will have a reserved space, provided they submit their complete registration by January 12, 2027. Beginning January 13, 2027, and space permitting, second registered teams will be approved to participate.
  "u-s-department-of-energy-texas-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Utah/UT_Utah-High-School-Regional-Science-Bowl | Date: January 23, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-utah-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/MA_NH_RI_VT_Northeast-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-vermont-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/VA_Virginia-High-Regional--School-Science-Bowl | Date: TBD ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-virginia-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/Washington/OR_WA_Pacific-Northwest-High-School-Regional-Science-Bowl | Date: February 20, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-washington-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/WV_West-Virginia-High-Regional--School-Science-Bowl | Date: February 6, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-west-virginia-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/WI_Wisconsin-High-School-Regional-Science-Bowl | Date: February 13, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-wisconsin-regional-science-bowl": {"deadline": null},
  // https://science.osti.gov/wdts/nsb/Regional-Competitions/High-School-Regionals/WY_Wyoming-High-School-Regional-Science-Bowl | Date: February 13, 2027 ... Between PREREGISTRATION approval and November 23, 2026, at 11:59 pm local time, the coach must SUBMIT their Team 1 registration. If the coach does not submit the Team 1 registration BEFORE November 24, 2026, the school loses its reserved space.
  "u-s-department-of-energy-wyoming-regional-science-bowl": {"deadline": null},
  // https://www.huntingtontheatre.org/pol/ | Registration Opens (all pathways): Tuesday, September 8, 2026 - Registration Deadline: Wednesday, November 25, 2026 - School Contest Deadline: Friday, December 18, 2026 - Semi Finalist Registration Deadline: Friday, January 8, 2027 - Semi Finals: Saturday, February 6, Sunday, February 7, and Monday 
  "huntington-theatre-company-for-the-mass-cultural-council-poetry": {"deadline": null},
  // https://swe.org/outreach/high-school-leadership-academy-shla/ | The 2026-2027 SHLA program will run from January 13, 2027 – June 1, 2027. ... The application for the 2026-2027 SHLA program will be open from Nov. 11 – Nov. 25, 2026 at 11:59 p.m. CT. ... Students will be notified by mid-December whether they have been accepted into the program.
  "society-of-women-engineers-swenext-high-school-leadership-academ": {"deadline": null},
  // https://ssp.org/getting-started/ | Applications for Summer Science Program 2027 will open on January 4, 2027, at 10 A.M. ET.
  "ssp": {"opensAt": "2027-01-04"},
  // https://bwsi.mit.edu/ | Beaver Works Summer Institute: Project-based classes for high school students nationwide! ... https://bwsi.mit.edu/ | (bwsi.mit.edu) The MIT Beaver Works Summer Institute (BWSI) is a challenging and prestigious STEM program designed for high-achieving students entering their senior year of high scho
  "beaver-works": {"url": "https://bwsi.mit.edu/"},
  // https://sumac.spcs.stanford.edu/sumac-admissions | Application Deadline Thursday, January 7, 2027 at 11:59 pm Pacific Time
  "ill-mathematics": {"deadline": "2027-01-07"},
  // https://www.amnh.org/learn-teach/teens/science-research-mentoring-program/join-srmp | Applications Now Open Deadline: March 8, 2027, at 5 pm ET
  "amnh-srmp": {"deadline": "2027-03-08"},
  // https://ai4all.spcs.stanford.edu/ai4all-admissions | Summer 2027 Admissions ... Application Deadline Monday, February 1, 2027 at 11:59pm Pacific Time
  "stanford-ai4all": {"deadline": "2027-02-01"},
  // https://m3challenge.siam.org/the-challenge/important-dates/ | November 16, 2026 Registration opens. February 19, 2027 Registration closes February 19, 2027 at 11:59 p.m. ET.
  "m3-challenge": {"deadline": "2027-02-19"},
  // https://www.stonybrook.edu/garcia/summer-program/apply.html | Summer Research Program - 2027 June 23 - August 6 ... at least 16 years old on, or before July 4, 2027 ... Application Deadline: February 22nd 2027, 11:59PM ... Laboratory usage fee: TBA (2026 Fee: $4,000) ... Non-Refundable $50 Registration fee
  "garcia-program": {"deadline": "2027-02-22", "blurb": "Seven-week polymer and materials science research program at Stony Brook University for high school students who are at least 16 by July 4 of the program year and have an unweighted 3.8+ GPA. Participants often enter their work in Regeneron STS and ISEF. The 2026 laboratory fee was $4,000, the 2027 fee is still to be announced, and there is a $50 registration fee. Housing and meals cost extra."},
  // https://hs.sas.upenn.edu/summer-programs/academies/3-week/neuroscience | Eligibility: Current 9th-11th grade students ... Program dates: July 11 - July 31, 2027
  "university-of-pennsylvania-neuroscience-research-academy": {"grades": [10, 11, 12]},
  // https://latino.si.edu/yap | Application open: February 23, 2026  EXTENDED APPLICATION DEADLINE: APRIL 24, 2026 ... The Young Ambassadors Program is a nationally recognized program for rising high school seniors
  "smithsonian-institution-young-ambassadors-program": {"grades": [12]},
  // https://www.mnmas.org/2027-state-science-fair-details | February 13, 2027 - Northeast Region deadline to register for State; February 26, 2027 - Northern Region deadline to register for State; February 26, 2027 - Western Region deadline to register for State; March 5, 2027 - Rochester Region deadline to register for State; March 5, 2027 - Southern Region
  "minnesota-academy-of-science-minnesota-state-science-and-enginee": {"deadline": "2027-02-13"},
  // https://www.ohiosci.org/bsef/ | Project Submission Opens: December 7, 2026 Project Submission Closes: 5:00 PM on Wednesday, February 3 2027 2027 BSEF Fair - In-person at CAS on Saturday, February 27, 2027
  "the-ohio-academy-of-science-buckeye-science-and-engineering-fair": {"opensAt": "2026-12-07", "deadline": "2027-02-03"},
  // https://bssef.org/fair-info/ | The 2027 Badger State Science & Engineering Fair (BSSEF) will be held at Marian University in Fond du Lac, WI on Saturday, March 13, 2027.
  "badger-state-science-and-engineering-fair-badger-state-science-a": {"blurb": "The state's ISEF-affiliated science fair: grades 9-12 present original research, qualifying through a school or regional fair, with top projects going on to Regeneron ISEF. The 2027 fair is held at Marian University in Fond du Lac on March 13, 2027. Each fair sets its own entry fee.", "location": "Fond du Lac, Wisconsin, USA"},
  // https://wyostatefair-xiauh.wordpress.com/ | UW page: "New Website!" (links to wyostatefair-xiauh.wordpress.com, which redirects to wyomingstatesciencefair.com). New site: "research must be conducted between January 1, 2026 – December 31, 2026 ... youth researcher must have qualified to submit their work from a regional-level science fair in W
  "university-of-wyoming-wyoming-state-science-fair": {"url": "https://wyomingstatesciencefair.com/"},
  // https://und.edu/academics/nd-governor-school.html | NDSU: "The University of North Dakota will host North Dakota Governor's School in summer 2027." UND: "Students stay on campus for three weeks, June 7 - 23, 2027. ... To apply for NDGS 2027, students must have a cumulative GPA of 3.5 or higher."
  "north-dakota-state-university-north-dakota-governors-school": {"url": "https://und.edu/academics/nd-governor-school.html", "blurb": "A state-funded residential academy for North Dakota students who have finished their sophomore or junior year, alternating between North Dakota State University and the University of North Dakota, which hosts in summer 2027. Students stay on campus for three weeks, June 7 to 23, 2027, and need a cumulative GPA of 3.5 or higher to apply. The state pays for in-state students.", "location": "Grand Forks, North Dakota, USA"},
  // https://med.stanford.edu/che/smysp/about.html | About page: "The 2027 SMYSP Program Application will be available in December 2026." / "The 2027 Application will be available in mid-December." Main page: "Applications for the 2027 SMYSP program are now open."
  "stanford-medical-youth-science-program-smysp": {"opensAt": null},
  // https://massart.edu/youth-teen-programs/pre-college-summer-studios/ | "Summer 2027 Program Dates: July 19 – August 13, 2027 Registration will open on January 12 and close on May 31, 2027 For credit application deadline: May 3, 2027"
  "massachusetts-college-of-art-and-design-pre-college-summer-studi": {"opensAt": "2027-01-12", "blurb": "Massachusetts College of Art and Design runs Pre-College Summer Studios, a four-week studio art program in Boston for students entering grades 11 and 12. All students take three core courses, 2D Fundamentals, 3D Fundamentals and Issues & Images, plus one elective. Students may apply to take the program for college credit, and those who are accepted and complete it receive three college credits from MassArt.", "deadline": "2027-05-31"},
};

export const NOV26_REMOVED: Record<string, string> = {
  // https://conservationcorps.org/programs/summer-youth-corps/ (checked 2026-11-26): "The Summer Youth Corps (SYC) program will not be active in 2026"; no 2027 season announced.
  "conservation-corps-minnesota-iowa-summer-youth-corps": "/categories/internships",
};

/** Listings added on 2026-11-26 (their records live in hsoAdditionsNov08.generated.ts). */
export const NOV26_ADDED_IDS: string[] = [
  "uc-berkeley-haas-school-of-business-berkeley-business-academy-fo",
  "marquette-university-college-of-business-administration-summer-b",
  "loyola-university-maryland-sellinger-school-of-business-sellinge",
  "xavier-university-d-artagnan-summer-business-academy",
  "virginia-institute-of-marine-science-william-mary-vims-governor",
  "dauphin-island-sea-lab-discovery-hall-programs-residential-marin",
  "cornell-lab-of-ornithology-the-cornell-lab-young-birders-event",
  "conservation-corps-minnesota-iowa-summer-youth-corps",
  "southwest-conservation-corps-conservation-legacy-four-corners-re",
  "southwest-conservation-corps-conservation-legacy-los-valles-yout",
  "usda-forest-service-youth-conservation-corps",
  "national-ffa-organization-washington-leadership-conference-wlc",
  "nc-state-university-college-of-agriculture-and-life-sciences-and",
  "nc-state-university-department-of-horticultural-science-horticul",
  "university-of-wisconsin-madison-college-of-agricultural-and-life",
  "university-of-north-carolina-school-of-the-arts-filmmaking-summe",
  "george-mason-university-the-washington-journalism-and-media-conf",
  "the-walden-school-young-musicians-program-ymp",
  "ringling-college-of-art-and-design-precollege",
  "columbia-college-chicago-summer-at-columbia",
  "pbs-news-student-reporting-labs-srl-summer-academy",
  "massachusetts-college-of-art-and-design-pre-college-summer-studi",
  "denison-university-reynolds-young-writers-workshop",
  "bowdoin-international-music-festival-summer-classical-music-inst",
  "huntsman-cancer-institute-university-of-utah-rise-program",
  "university-of-kentucky-markey-cancer-center-summer-health-experi",
  "montana-ahec-montana-state-university-medstart-summer-camp",
  "northwest-area-health-education-center-wake-forest-university-sc",
  "uthealth-houston-school-of-public-health-rio-grande-valley-summe",
  "university-of-pennsylvania-school-of-engineering-and-applied-sci",
  "best-robotics-inc-best-robotics-competition",
  "kettering-university-lives-improve-through-engineering-science-l",
  "robonation-international-seaperch-challenge",
  "university-of-california-berkeley-berkeley-summer-academy-of-sci",
  "john-carroll-university-pre-law-experience",
  "marquette-university-law-school-summer-youth-institute",
  "louisville-bar-association-summer-law-institute",
  "university-of-south-florida-judy-genshaft-honors-college-mock-tr",
  "rutgers-university-pre-college-summer-academies-pre-law-mock-tri",
  "idaho-senate-senate-legislative-page-program",
  "the-florida-senate-senate-page-program",
  "california-state-board-of-education-student-member-of-the-state-",
];
