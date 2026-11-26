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
};

export const NOV26_REMOVED: Record<string, string> = {
};
