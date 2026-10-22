import type { Opportunity } from "@/data/opportunities";

/**
 * Description refresh, 2026-10-14.
 *
 * 191 listings had descriptions under 90 characters ("World's top high school
 * programming competition."), too thin to tell a student whether to apply. Each
 * row here replaces one with a plain description built only from facts the
 * official program page states: what students do, who can apply, length, format,
 * cost and how to enter. Dates are left out on purpose; they live in the deadline
 * fields. `evidence` names the page and the facts it rests on.
 *
 * A row can also correct a field the official page contradicts (grades, cost,
 * format, location), quoted in `evidence`.
 *
 * Applied straight after applyDeadlineCheckOct2026 in src/data/opportunities.ts.
 * Listings whose blurb the deadline check already rewrote are not touched here.
 */
export type DescriptionRow = {
  blurb?: string;
  grades?: number[];
  cost?: Opportunity["cost"];
  format?: Opportunity["format"];
  location?: string;
  /** A wording fix with no new facts: not a check against the official page, so not a "last checked" date. */
  wordingOnly?: true;
  evidence: string;
};

export const descriptionCheckOct2026: Record<string, DescriptionRow> = {
  "isef": {
    blurb: "International science fair where students in grades 9-12 present an independent research project. You cannot apply directly: students qualify by winning at one of nearly 400 Society-affiliated fairs. Entrants must be under 20 and may enter only one project.",
    evidence: "2026-10-14, https://www.societyforscience.org/isef/faq/: 'To compete at ISEF, a 9th-12th grade student must first qualify through participation at an Affiliated Fair'; 'grades 9-12 or equivalent and not have reached age 20 on or before May 1 preceding ISEF'; 'Each student is only allowed to enter one project'; nearly 400 affiliated fairs worldwide; 2027 ISEF in Los Angeles.",
  },
  "imo": {
    blurb: "Annual world math championship for high school students. Each country sends a team of up to six contestants, who must be under 20 and not enrolled in college. Contestants write full proofs for six problems over two exams of 4.5 hours each, with no calculators.",
    evidence: "2026-10-14, https://www.imo-official.org/about/: 'the annual world championship for high school students'; team of up to six contestants, 'under 20 and not enrolled in any post-secondary institution'; two days, three problems each day, 4.5 hours per day, max 42 points, no calculators, full proofs.",
  },
  "coca": {
    blurb: "Achievement-based $20,000 college scholarship given to 150 high school seniors each year, judged on leadership, academics and service rather than need. Applicants must be U.S. citizens or eligible residents at a U.S. high school with at least a 3.0 GPA, and they apply directly online.",
    evidence: "2026-10-14, https://www.coca-colascholarsfoundation.org/apply/: 150 scholarships of $20,000; 'currently enrolled high school or home-schooled students at a school in one of the 50 states, D.C., Puerto Rico, or select DoD schools'; must graduate in the current academic year; citizens/nationals/permanent residents/refugees/asylees etc. per FAFSA rules; 'minimum overall B/3.0 GPA'; 'achievement-based scholarship. Applicants are evaluated on leadership, academics, and service.'",
  },
  "simr": {
    blurb: "Summer medical research program at Stanford for current high school juniors and seniors who are U.S. citizens or green card holders, at least 16, and attend a U.S. high school. The program is free and favors Bay Area students; most students get no stipend, but a few need-based stipends exist.",
    cost: "Free",
    evidence: "2026-10-14, https://med.stanford.edu/simr/special-grants.html: 'current high school juniors or seniors'; 'at least 16 by the program start date'; U.S. citizens or green-card holders living and attending high school in the U.S.; 'The selection process will heavily favor local (Bay Area) students'; program free; 'stipends in general will not be provided for students'; 'A limited number of needs-based stipends are available for some students from some special grants, but most stud… Field correction quote: 'stipends in general will not be provided for students ... A limited number of needs-based stipends are available for some students from some special grants, but most students will not receive a stipend.'",
  },
  "aime": {
    blurb: "Invitational math exam for students who score 100 or higher on the AMC 10 or 85 or higher on the AMC 12. It is taken in person at Pearson testing centers for an $85 fee, with financial help available. AIME scores determine USAMO and USAJMO invitations.",
    cost: "Paid",
    evidence: "2026-10-14, https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/: 'students who score 100 or above on AMC 10 and 85 or above on AMC 12 ... will qualify to register'; Pearson testing centers, 'more than 200 Pearson Professional Centers across the US and Canada'; registration fee $85 (plus taxes) paid to Pearson; financial assistance available; 'Qualification for the 2027 USAMO and USAJMO will be primarily based on AIME scores'. Field correction quote: 'registration fee ... $85 for AIME; ... more than 200 Pearson Professional Centers across the US and Canada'",
  },
  "usamo": {
    blurb: "Invitation-only, proof-based math olympiads for top AIME scorers, with selection based mainly on AIME scores. Students solve six problems over two days, with 4.5 hours each day, at official regional sites. The MAA invites several hundred students each year.",
    evidence: "2026-10-14, https://maa.org/maa-invitational-competitions/: 'Participants are given 4.5 hours each competition day to solve three problems'; six proof-based problems over two days; 'Invite Only'; 'invites 400+ students to participate in the two Olympiads each year'; '31 institutions across the United States and Canada' host official sites; qualifying students invited to register at a nearby site.",
  },
  "hmmt": {
    blurb: "Math tournament where high school students compete individually and in teams, usually 4-6 students for the November event and 6-8 for February. Spots are assigned by a registration lottery. The fee is $80 per team and $10 per individual, and financial aid can waive it and cover lodging.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.hmmt.org/rg/info: '$80 per team and $10 per individual', paid at check-in in cash or check; 'teams of 4-6 (November) and 6-8 (February)'; lottery results released; 'Financial aid includes lodging ... as well as a waived registration fee'; caps of 5 teams (Nov) and 3 teams (Feb) per organization. Field correction quote: 'The HMMT registration fee is $80 per team and $10 per individual'",
  },
  "usaco": {
    blurb: "Free online programming contests held four times a year in Bronze, Silver, Gold and Platinum divisions, with promotion based on scores. About two dozen top students are invited to a summer training camp at Clemson University, where four are picked to represent the USA at the IOI.",
    evidence: "2026-10-14, https://usaco.org/index.php?page=details: Four divisions Bronze/Silver/Gold/Platinum; four online contests per year; 'hundreds of hours of free on-line training resources'; 'approximately two dozen students are invited as \"IOI finalists\", to a rigorous academic training camp in the early summer, hosted at Clemson University, culminating in the selection of 4 of them to represent the USA'; camp travel paid by participant; IOI expenses paid by USACO.",
  },
  "ioi": {
    blurb: "International programming olympiad where secondary school students compete individually. Each country sends a delegation of up to four contestants plus a leader. In the U.S., USACO picks the four team members at its summer training camp.",
    evidence: "2026-10-14, https://ioinformatics.org/: 'Students at the IOI compete on an individual basis, with up to four students competing from each participating country'; 'a team of one to four Contestants'; contestant enrolled at secondary level or lower in Sept-Dec before the event; USACO selects 4 at Clemson camp (usaco.org).",
  },
  "uspho": {
    blurb: "AAPT physics olympiad in two stages: students first take the F=ma exam, and about 400 top scorers are invited to the USAPhO exam. Schools register and pay per-student fees, and exams are proctored online. USAPhO is open to U.S. citizens and green card holders in the U.S.",
    cost: "Paid",
    format: "Online",
    evidence: "2026-10-14, https://aapt.org/physicsteam/2026/Registration.cfm: School fee $75 ($37.50 for AAPT members) plus $15.50 per student; 'For 2026, the F=ma and USAPhO exams will be conducted online via Educational Vistas only'; exams must be proctored; F=ma open to citizens, green card holders, or students at a U.S. school; USAPhO requires citizen or green card; must be physically in the U.S.; ~400 invited to USAPhO. Field correction quote: 'For 2026, the F=ma and USAPhO exams will be conducted online via Educational Vistas only. ... $75 ($37.50 for AAPT members) plus $15.50 per student'",
  },
  "ipho": {
    blurb: "International physics competition for secondary school students. Each country normally sends five contestants and up to two delegation leaders, and every contestant must be a secondary school pupil when the team is announced, not a college student.",
    evidence: "2026-10-14, https://www.ipho-new.org/statutes-syllabus/: 'Each participating country shall send a delegation, normally consisting of five students (contestants) and two accompanying persons (delegation leaders) at most.'; 'The contestants shall be students of general or technical secondary schools'; 'must ensure that the contestants are all secondary school pupils when they announce the names'.",
  },
  "ibo": {
    blurb: "Annual international biology competition with practical lab exams and a theory exam covering all areas of biology, focused on how biology works in real situations rather than memorization. Each member country sends a team of four students chosen through its national olympiad.",
    evidence: "2026-10-14, https://www.ibo-info.org/en/contest/participation.html: IBO pages: theoretical and practical components; theory 'covers all domains of biology', ca. 100 tasks; practical exams in 3-4 labs; 'do not focus on knowledge reproduction ... we focus on how biology works in real life situations'; join page: 'a country can bring a team of four students'; national olympiads select the top 4.",
  },
  "ioaa": {
    blurb: "Annual astronomy and astrophysics olympiad for high school students, with theory questions and a practical round of observation and data analysis. Students cannot register directly; each country sends a team of up to five students chosen through its national olympiad program.",
    evidence: "2026-10-14, https://ioaastrophysics.org/current-ioaa/for-newcomers: Official IOAA site: annual competition for high school students; theoretical part (short and long questions) plus practical part with observation and data analysis; students 'cannot register directly' and should contact their National Olympiad organizers; one team of up to five students per country; age limit under 20 on 1 July of competition year.",
  },
  "ssp": {
    blurb: "Five-week residential research program on college campuses for high school juniors, who work in teams of three on astrophysics, biochemistry, cell biology or bacterial genomics. Applicants must be at least 15 and under 19. A fee is charged, with need-based financial aid requested after admission.",
    evidence: "2026-10-14, https://ssp.org/faqs/: ssp.org: 'five-week residential' program; current high school juniors with required coursework; at least 15 and not yet 19 during program; teams of three; 2026 tracks astrophysics, biochemistry, cell biology, bacterial genomics; 2026 fee $11,800; aid need-blind, requested after admission; FAQ says free for family incomes of $75,000 or less.",
  },
  "mites": {
    blurb: "Free six-week residential STEM program on MIT's campus for high school juniors who are U.S. citizens or permanent residents. Program costs are covered except travel to and from MIT, and travel scholarships are available. Students apply online in the fall of junior year.",
    format: "In-person",
    evidence: "2026-10-14, https://mites.mit.edu/discover-mites/faq-for-prospective-students/faqs-mites-semester-and-mites-summer/: 'applicants must be U.S. citizens or permanent residents and high school juniors'; 'All program-related costs are covered ... Students only pay for transportation'; 'Travel scholarships are available'; six weeks, late June through early August on MIT's campus; 'Students are required to stay in dormitories on MIT's campus for the entire program'; apply online during fall of junior year. Field correction quote: 'Students are required to stay in dormitories on MIT's campus for the entire program, even if the student is local to the Boston area.'",
  },
  "beaver-works": {
    blurb: "Four-week summer STEM program at MIT for rising high school seniors living in the U.S., with project courses in areas such as autonomous systems, programming, microelectronics and cybersecurity. Students take an online course before applying. Free for families under $200,000; others pay $3,000.",
    evidence: "2026-10-14, https://bwsi.mit.edu/faq/: Beaver Works: 'four-week summer STEM program for rising high school seniors'; courses on 'autonomous systems, programming, microelectronics, cybersecurity'; online course, then applications, then four-week program; BWSI FAQ: 'Students must be living in the United States'; 'For any family that has a family income and asset liability $200,000 or greater the fee for the program will be $3,000. The program will be free…",
  },
  "ross": {
    blurb: "Six-week residential summer math program where students work through number theory problem sets, with a daily lecture and small-group discussions. Nearly all first-year students are 15 to 18. The fee is $7,500 for tuition, housing and meals, and financial aid is available.",
    evidence: "2026-10-14, https://rossprogram.org/participants/application/: 'six-week, residential, summer session for high school students'; first-year course 'organized around a series of problem sets in number theory'; ~3 hours/day of lecture and discussions; 'Nearly all first-year students are 15 to 18'; 'The program fee is $7,500, which covers tuition, housing, and meals'; 'Financial aid is certainly available.'",
  },
  "hcssim-prim": {
    blurb: "Free year-long after-school research program in which high school sophomores and juniors living in the Greater Boston area work with mentors on math or bioinformatics projects, at least 10 hours a week. Applicants must solve an entrance math problem set.",
    grades: [10,11],
    evidence: "2026-10-14, https://math.mit.edu/research/highschool/primes/program/: 'free year-long after-school program that offers research projects to high school juniors and sophomores (or home schooled students of the same age) residing in Greater Boston'; at least 10 hours/week including a 1.5-hour weekly mentor meeting; since 2025 focus on Math and Bioinformatics, 'no new admissions to Computer Science'; applicants solve the PRIMES 2027 Math Problem Set. Field correction quote: 'free year-long after-school program that offers research projects to high school juniors and sophomores (or home schooled students of the same age) residing in Greater Boston'",
  },
  "prim-usa": {
    blurb: "Free year-long remote research program in which high school sophomores and juniors living in the U.S. outside the Boston area meet weekly online with mentors on math or bioinformatics research. Applicants must solve an entrance math problem set.",
    grades: [10,11],
    evidence: "2026-10-14, https://math.mit.edu/research/highschool/primes/usa/apply-usa.html: 'high school juniors and sophomores (including home schooled) residing in the United States are eligible'; free year-long remote mentoring program; 'Program participants meet weekly with their mentors online'; math and bioinformatics; solve the PRIMES 2027 Math Problem Set; non-local students apply to PRIMES-USA. Field correction quote: 'high school juniors and sophomores (including home schooled) residing in the United States are eligible'",
  },
  "ill-mathematics": {
    blurb: "Stanford summer math program for students in grades 10 and 11 at the time of application, offered as a residential program on campus or as an online program. Admission is based on math grades, a teacher recommendation, essays and an admission exam. Tuition is charged, with need-based aid.",
    evidence: "2026-10-14, https://sumac.spcs.stanford.edu/sumac-admissions: 'Students in grades 10 and 11 at the time of application'; at least 15 during program; residential (40 participants) and online (64); selection on math grades, teacher recommendation, essays, prior engagement, SUMaC admission exam; 2026 tuition $3,750 online / $8,950 residential; aid based on demonstrated need.",
  },
  "gates": {
    blurb: "Last-dollar scholarship that covers the full cost of attendance not met by other aid and the family contribution, for up to five years of a bachelor's degree. Applicants are Pell-eligible high school seniors who are U.S. citizens or permanent residents with at least a 3.3 weighted GPA.",
    evidence: "2026-10-14, https://www.thegatesscholarship.org/scholarship/: Main page: 'A high school senior, Pell-eligible, US citizen or permanent resident'; 'minimum cumulative weighted GPA of 3.3'; full-time four-year degree at US accredited not-for-profit college; 'funding for the full cost of attendance that is not already covered by other financial aid and the Student Aid Index'; 'funded for a maximum of five (5) years'.",
  },
  "jkc": {
    blurb: "Last-dollar college scholarship of up to $55,000 per year toward a bachelor's degree. Applicants are U.S. high school seniors with an unweighted GPA of at least 3.75, SAT, ACT, AP or IB scores, and family income up to $95,000. Selection weighs academics, need, persistence, leadership and service.",
    evidence: "2026-10-14, https://www.jkcf.org/our-scholarships/college-scholarship-program/for-educators/: 'up to $55,000 per year'; last-dollar after institutional aid; complete four years of high school in the U.S., a U.S. territory or U.S. military base; 'minimum, cumulative unweighted GPA of 3.75'; SAT/ACT/AP/IB scores, no minimum; 'maximum annual family gross income of $95,000'; selection on academic ability, financial need, persistence, leadership, service.",
  },
  "ron-brown": {
    blurb: "A $40,000 scholarship, paid as $10,000 a year for four years, for Black or African American high school seniors who are U.S. citizens or permanent residents. Selection weighs academics, leadership, community service and financial need. Funds can be used at any accredited four-year U.S. college.",
    evidence: "2026-10-14, https://ronbrown.org/ron-brown-scholarship/: 'Black/African American, US citizens or permanent residents, and a current high school senior'; $40,000 paid $10,000/year over four years; academic excellence, leadership potential, community service, financial need; any accredited four-year college or university in the US; 'awards 20 four-year $40,000 scholarships'.",
  },
  "uwc": {
    blurb: "UWC's 18 schools and colleges on four continents offer a two-year IB Diploma education for students aged 16 to 19. Students apply through the UWC national committee in their country of residence or citizenship, which awards need-based financial support.",
    evidence: "2026-10-14, https://uwc.org/our-schools-colleges/: 'All 18 UWC schools and colleges provide a two-year pre-university education for students aged between 16 and 19 years' (IBDP); 'To be considered for financial support, you must apply through the UWC national committee in your country of residence or citizenship'; national committees 'carry out a financial means assessment'; support 'often covers tuition, room and board, books, IB exam fees and curricular trips'. Ag…",
  },
  "coolidge": {
    blurb: "Covers full tuition, room and board, and required fees for four years of undergraduate study at any accredited U.S. college or university, plus an annual stipend for books and supplies. High school juniors apply directly, and academic excellence is the main selection criterion.",
    evidence: "2026-10-14, https://coolidgescholars.org/about/faq/: Award covers 'full tuition, room and board, and required fees for four years of undergraduate study' plus annual books/supplies stipend; usable at any accredited U.S. college; 'Students in their junior year of high school ... are eligible to apply'; current seniors not eligible; 'The main criterion ... is academic excellence'; conditional on admission to an accredited U.S. college.",
  },
  "wharton-global": {
    blurb: "Summer pre-college programs on Wharton's Philadelphia campus for students currently in grades 9 to 11, with courses such as Essentials of Entrepreneurship, Essentials of Finance, Leadership in the Business World and Data Science Academy. Some programs require a 3.5 unweighted GPA.",
    evidence: "2026-10-14, https://globalyouth.wharton.upenn.edu/on-campus-programs/: On-campus programs are 'pre-collegiate experiences for students currently enrolled in grades 9-11'; programs include Product Design Academy (three weeks), Essentials of Entrepreneurship and Essentials of Finance (two weeks each), Leadership in the Business World, Data Science Academy, Moneyball Academy, M&T Summer Institute; Leadership in the Business World requires '3.5 unweighted GPA or higher'.",
  },
  "cty": {
    blurb: "Johns Hopkins CTY offers advanced courses for academically talented students through three-week residential programs on campuses across the U.S. for grades 5 to 12 and online courses for grades 2 to 12. Most courses require qualifying scores on an above-grade-level test, SAT, ACT or PSAT.",
    evidence: "2026-10-14, https://cty.jhu.edu/cty-experience/residential: Residential programs for grades 5-12; three-week day and residential programs at 10 U.S. locations; online courses for grades 2-12; 'students will need to establish eligibility for most CTY courses' via above-grade-level assessment or qualifying scores; HS students qualify with 'SCAT, STB, ACT, SAT, or PSAT 10/NMSQT'; on-campus courses not graded, no academic credit.",
  },
  "cee-ssp": {
    blurb: "The Center for Excellence in Education is a nonprofit that runs cost-free STEM programs for high school students, including the Research Science Institute, a summer research program at MIT for high school juniors, and the USA Biolympiad competition for grades 9 to 12.",
    evidence: "2026-10-14, https://www.cee.org/programs/research-science-institute: RSI: summer program at MIT; 'High school juniors are eligible. High school seniors are not.'; USABO 'demands the very best of 9-12 grade students in biology'; CEE programs 'offered cost-free to participants' (About page).",
  },
  "cern-summer": {
    blurb: "Teams of at least five secondary school students aged 16 to 19, with an adult coach, submit a proposal for a physics experiment. Winning teams travel to run their experiment at a particle accelerator beamline at CERN, DESY or ELSA.",
    evidence: "2026-10-14, https://beamlineforschools.cern/terms-and-conditions/: Terms: students 'aged 16 to 19 years old and attending secondary or high school'; teams need an adult coach and at least five members (up to 30); a winning team can send at most nine students and two coaches; only members 16 on first day 'at CERN, DESY, or ELSA' can travel.",
  },
  "nsli-y": {
    blurb: "U.S. Department of State scholarship for U.S. citizens aged 15 to 18 to study a critical language abroad, in a six to seven week summer program or an eight to ten month academic year program. Previous language study is not required.",
    evidence: "2026-10-14, https://www.nsliforyouth.org/how-to-apply/eligibility-requirements/: 'Applicants must be 15-18 years of age at the start of the program'; open to U.S. citizens; summer 6-7 weeks, academic year 8-10 months; 'Previous language study is not required'; graduating seniors eligible if they meet age rules; separate 10-week Virtual NSLI-Y.",
  },
  "juilliard-pre": {
    blurb: "Saturday music program at Juilliard in New York for students ages 8 to 18, with admission by competitive audition in the student's major area. Beginners are not accepted, and financial aid up to and including full-tuition scholarships is available.",
    evidence: "2026-10-14, https://www.juilliard.edu/music/preparatory-division/juilliard-pre-college: Pre-College is a Saturday program for ages 8 to 18; 'Acceptance is based on the results of a competitive audition process ... in their major area of study'; division 'does not accept applications from beginners'; voice applicants must be at least 14; 'financial aid, up to and including full-tuition scholarships, is available'.",
  },
  "tanglewood": {
    blurb: "Residential summer music program in Lenox, Massachusetts, with two-week workshops for ages 14 to 20 and three to six week Young Artists Programs for ages 14 to 19. Students take lessons, classes, masterclasses and chamber music, and can earn college credit.",
    evidence: "2026-10-14, https://www.bu.edu/cfa/tanglewood/faq/: 'Two-week workshops accommodate students ages 14-20'; Young Artists Programs for orchestra, wind ensemble, voice, piano, composition and harp 'will run for three-to-six weeks', ages 14-19; 'individual lessons, academic classes, masterclasses, chamber music, and performance'; one college credit per week in residence; open to U.S. and international students.",
  },
  "amnh-srmp": {
    blurb: "NYC 10th and 11th graders who live and attend school in the city do a year-long research project with an AMNH-affiliated scientist, meeting after school twice a week. Participants earn a free CUNY Lehman College credit and a $2,500 stipend on completion.",
    cost: "Stipend",
    evidence: "2026-10-14, https://www.amnh.org/learn-teach/teens/science-research-mentoring-program/join-srmp: Open to NYC students 'in 10th or 11th grade' who live and attend school in NYC, passed classes for the last three semesters, and have taken an AMNH education program or attend a partner school; year-long research project with an AMNH-affiliated scientist; Tuesday/Thursday after-school meetings; '1 CUNY Lehman College credit at no cost' and 'a $2500 stipend upon completion of research and program requirements'. Field correction quote: 'a $2500 stipend upon completion of research and program requirements'",
  },
  "state-florida-sstp": {
    blurb: "Seven-week residential program at the University of Florida where students entering their senior year, and at least 16, do research with a UF faculty scientist and their team, plus a lecture series and honors seminar. It charges tuition, with limited need-based aid for Florida students.",
    evidence: "2026-10-14, https://www.cpet.ufl.edu/students/uf-cpet-summer-programs/student-science-training-program/: 'seven-week residential program' with 'research participation with a UF faculty research scientist and their research team', lecture series and honors seminar; applicants 'entering senior year and at least 16 years old by the program start date'; no minimum GPA, tests not required; $5,500 for 2026, $50 app fee; 'Limited need-based scholarships are available for students attending a Florida high school'.",
  },
  "pioneer": {
    blurb: "Online research program where high school students in grades 9 to 12 from any country design their own research question and write an original research paper with guidance from a university professor. Admission is competitive and requires an interview. Tuition is charged, with need-based aid.",
    grades: [9,10,11,12],
    evidence: "2026-10-14, https://pioneeracademics.com/pioneer-research-institute/admission/: Admission page: 'ELIGIBILITY High School: 9-12th Grade', online, globally accessible; 'competitive, holistic application including academic transcripts, short and long essays, counselor/teacher feedback, and a required interview'. Pioneer's own guides: students design their own research question with a faculty mentor and write an original research paper; tuition $7,465 with need-based aid. Field correction quote: 'ELIGIBILITY High School: 9-12th Grade'",
  },
  "ylc": {
    blurb: "Two-week residential academic program on Yale's campus in New Haven for current sophomores and juniors aged 16 to 18 from any country. Tuition is $7,500, covering housing, meals and materials, with need-based aid up to full tuition.",
    evidence: "2026-10-14, https://globalscholars.yale.edu/eligibility: Eligibility: 'must be 16 to 18 by the first day of Session III'; 'current sophomore or junior (or international equivalent)'; first-time participants; all countries; English fluency. Two-week residential program on Yale campus. Tuition page: 'full program tuition for one, 2-week session is $7,500 USD' covering housing, meals, materials; need-based aid up to full tuition.",
  },
  "junior-academy": {
    blurb: "Students ages 13 to 17 join international teams of up to six, with a mentor, to solve real-world STEM challenges online. Challenges take three to four hours a week, the program is free, and students apply directly in English.",
    evidence: "2026-10-14, https://www.nyas.org/learning/high-school-research-programs/the-junior-academy/: Ages 13-17; English application with parental consent; 'three to four hours each week during challenge periods'; program is free; teams up to six students plus one mentor; Fall and Spring Challenges on the Launchpad platform.",
  },
  "concord": {
    blurb: "Submit a history research essay, typically 5,000 to 10,000 words or more with Turabian endnotes, written in English before you finish secondary school. The $70 submission fee includes a year of the eBook edition, and about 5% of papers are published.",
    evidence: "2026-10-14, https://tcr.org/submit: Submit page: $70 submission fee includes one year of the eBook edition. Submission guidance: essays 'in the 5,000-10,000 (or more) word range' with Turabian endnotes; completed before the student finishes secondary school; English; sole author; US and international public, private and home school students; selects about 5% of papers.",
  },
  "diamond-challenge": {
    blurb: "Teams of two to four high school students aged 14 to 18, with an adult advisor, pitch a business or social innovation concept live or by video. Finalists travel to Delaware to compete for a prize pool of more than $100,000.",
    evidence: "2026-10-14, https://diamondchallenge.org/competition/: Teams of 2-4 high school students aged 14-18 at submission deadline; one adult advisor 21+; business innovation and social innovation tracks; live pitch (5 minutes) or pre-recorded video under 5 minutes; 'Finalist teams from around the globe compete for a $100K prize pool. These teams will travel to Delaware to compete at Summit.'",
  },
  "pumac": {
    blurb: "Teams of eight high school students compete in Princeton's math contest, which includes a Power Round and a Main Competition in A and B divisions. Individuals can register and are grouped into teams. The listed fee is $15 per student.",
    cost: "Paid",
    evidence: "2026-10-14, https://pumac.princeton.edu/registration-info: Registration info: Main Competition '$15/student, for a total of $120/team or $15/individual'; teams of 8; individuals combined into teams of 8 for Power Round and Main Competition; A Division for experienced teams, B for newer teams. Page found was for the 2025 cycle. Field correction quote: '$15/student, for a total of $120/team or $15/individual'",
  },
  "bmt": {
    blurb: "High school students in grade 12 or below compete at UC Berkeley in teams of up to six, with team rounds designed for four to six students. Registration is $15 per student, rising to $25 for late registration, and fee waivers are available.",
    cost: "Paid",
    evidence: "2026-10-14, https://berkeley.mt/events/bmt-2026/: BMT 2026 page: '$15 per student' in phases 1-2, late registration $25; at UC Berkeley; team-based rounds designed for 4-6 students, teams up to 6; fee waiver for financial hardship via team@berkeley.mt; open to high school students in grades 12 or below. A separate online version exists. Field correction quote: '$15 per student'",
  },
  "smt": {
    blurb: "US high school students compete on Stanford's campus in teams of five to six, and individuals are placed on teams by location. The fee is $30 per student and includes a t-shirt and meals, with financial aid on request. An online version is open worldwide.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.stanfordmathtournament.org/competitions/smt-2026: SMT 2026 in-person: '$30 per student' including t-shirt, Friday dinner, Saturday lunch; financial aid on request; teams of 5-6; limited to US high school students; individuals grouped by geographic proximity. SMT 2026 Online: open worldwide to high school and below, $25-$35 per student. Field correction quote: '$30 per student'",
  },
  "usaaao": {
    blurb: "Students take a roughly 75-minute online multiple-choice exam, and top scorers advance to the National Astronomy Competition and later rounds that select the US IOAA team. Only high school US citizens or permanent residents can make the team. The fee is $30, with aid available.",
    cost: "Paid",
    evidence: "2026-10-14, https://usaaao.org/registration/: 'The First Round exam will be a ~75 minute long, ~30 multiple choice exam conducted over Gradescope ... there is a $30 registration fee, though we offer financial aid on a case by case basis.' Anyone can take round one; only high school US citizens/permanent residents qualify for the team; NAC 2.5-hour exam; team chosen from NAC and third round. Field correction quote: 'there is a $30 registration fee, though we offer financial aid on a case by case basis.'",
  },
  "ieso": {
    blurb: "International Earth science olympiad for secondary school students no older than 18. Winners of each country's national competition are invited to compete, in national delegations of four students and two supervisors.",
    evidence: "2026-10-14, https://www.ieso-info.org/sample-page/: 'Each delegation is composed of 4 students and 2 supervisors'; 'Students winning the respective national competitions are invited to participate'; 'secondary school students, not older than 18 years old on July the 1st of the year of the Olympiad.'",
  },
  "first-robotics": {
    blurb: "Teams of students ages 14 to 18 (grades 9 to 12) design, build and program industrial-sized robots and compete at events. Team registration is $6,500 per season and includes a first regional event, plus costs for parts and travel.",
    evidence: "2026-10-14, https://www.firstinspires.org/programs/cost-and-registration: FRC is for 'students ages 14-18 (grades 9-12)' who 'design, build, and program industrial-sized robots'; '$6,500/season registration' including first regional event; teams should plan for tools, parts and travel; grants available.",
  },
  "vex": {
    blurb: "Middle and high school teams build metal robots and compete in 2-vs-2 alliance matches with an autonomous period and a driver-controlled period, plus Robot Skills matches. Teams qualify at local events for state, regional or national championships and can advance to the World Championship.",
    evidence: "2026-10-14, https://v5rc-kb.recf.org/hc/en-us/articles/9685581971095-VEX-V5-Robotics-Competition-Spectator-Primer-Part-1-The-Big-Picture-Structure-Season: REC Foundation KB: V5RC is 'Middle & High School', '2-team vs 2-team head-to-head game with robots built from metal components'; 'Two alliances, composed of two teams each, compete in matches consisting of an autonomous period followed by a driver controlled period'; Robot Skills Challenge (driving and autonomous coding skills); teams qualify at local events for State/Regional/National championships, some advance to…",
  },
  "imc": {
    blurb: "Teams of up to four secondary school students and a faculty advisor spend five consecutive days building a mathematical model to solve a real-world problem. Each country or region selects up to two teams, usually through national or regional contests, to compete internationally.",
    evidence: "2026-10-14, https://immchallenge.org/immc-challenge/: 'IM2C is an international mathematical modeling competition for secondary school students. Teams of up to four students work collaboratively to solve a real-world problem over a consecutive five-day period.' 'Countries are invited to choose up to two teams of up to four students with one teacher/faculty advisor.' Begins 'with thousands of student teams competing through national and regional competitions'. Faculty a…",
  },
  "syp-cornell": {
    blurb: "High school students take Cornell courses for college credit through residential, commuter or online summer options. Students receive letter grades and an official Cornell transcript, with up to four credits in a three-week session and up to eight in a six-week session.",
    evidence: "2026-10-14, https://sce.cornell.edu/pc-serv-credit-grades-transcripts/: Summer formats: residential, commuter, online. 'up to four credits in a three-week period, up to eight credits in a six-week period, and up to ten credits in an eight-week period'. Letter grades only, no pass/fail or audit. Grades recorded on an official Cornell University transcript. Program described as for students 'entering their Junior or Senior year' (not used in blurb).",
  },
  "syp-uchicago": {
    blurb: "High school students take UChicago courses through options such as the 3 Week Immersion for current 9th to 11th graders and Summer Online, where current 11th and 12th graders study alongside UChicago undergraduates. Applicants send a transcript, teacher recommendation and short essay.",
    evidence: "2026-10-14, https://summer.uchicago.edu/pre-college/: 3 Week Immersion: current high school students in 9th, 10th, or 11th grade, at least 14 years old. Summer Online: current 11th and 12th graders take a course from the regular College curriculum alongside UChicago undergraduates. Application: Summer Session application, teacher recommendation email, transcript, short essay. Immersion/4-week courses graded A-F; 1 and 2 Week programs carry no credit. Need-based aid ava…",
  },
  "syp-georgetown": {
    blurb: "Georgetown offers high school students one- to three-week academies, a five-week residential College Prep program that includes a university course, and Summer College credit courses taken on campus, online or both. Minimum GPA and grade requirements vary by program.",
    evidence: "2026-10-14, https://summer.georgetown.edu/pre-college-programs/: Summer College: 'current 10th, 11th or 12th grader' with at least 3.0 GPA; five-week on-campus courses, eight-week online courses, or a combination. College Prep: five-week residential-only program that includes a university course, 3.0 GPA. Academies (1-3 week): grades 8-12, 2.0 GPA. Online pre-college courses for ages 13+.",
  },
  "syp-jhu": {
    blurb: "Students who have completed 9th grade, generally with a 3.0 GPA or higher, take two-week pre-college programs online or at the Homewood campus in Baltimore as residents or commuters. Each completed program earns one college credit.",
    evidence: "2026-10-14, https://summer.jhu.edu/programs-courses/pre-college-programs/: Students must finish 9th grade before the program starts; cumulative GPA of 3.0 or higher generally required. On-site at Homewood Campus as resident or commuter; online programs primarily asynchronous. Sessions are two weeks long, three sessions. Each successfully completed program earns one college credit. Online tuition listed at $1,950 per program.",
  },
  "syp-penn": {
    blurb: "Penn offers high school students residential Summer Academies and online seminars that award a certificate, plus credit-bearing Pre-College courses taken on campus or online. Applicants submit essays and a recommendation and need a minimum 3.5 GPA.",
    evidence: "2026-10-14, https://hs.sas.upenn.edu/summer-programs: Academies and online seminars open to current 9th through 11th graders; Pre-College programs limited to 10th and 11th graders. Only Pre-College students earn college credit and a University transcript; Academy and seminar students receive a certificate of completion. Application: online form with essays and recommendation letter; minimum 3.5 GPA. Free Academy/seminar spots possible for Philadelphia public or charter…",
  },
  "awesomemath": {
    blurb: "Students ages 12 to 18 take live online math classes in algebra, geometry, combinatorics and number theory at four levels, with a daily 90-minute lecture and 60-minute problem-solving session over three weeks. New students take an admission test and submit a recommendation.",
    format: "Online",
    location: "Online, USA",
    evidence: "2026-10-14, https://www.awesomemath.org/summer-program/overview/program-information/: Summer Program is 'now online only, as it allows us to reach more students globally'. Gifted middle and high school students ages 12-18. Three-week sessions, Monday-Friday, 90-minute lecture plus 60-minute problem-solving session; lectures recorded. Courses in Algebra, Geometry, Combinatorics, Number Theory at four levels (AMC 10/12, AIME, USA(J)MO prep). Application includes admission test and recommendation letter… Field correction quote: 'now online only, as it allows us to reach more students globally'",
  },
  "model-un": {
    blurb: "Secondary school students, most often ages 13 to 18, attend a Model UN conference in New York City as school delegations of up to 50 students. Sessions are held at the New York Hilton Midtown, with opening and closing ceremonies at UN Headquarters when space is available.",
    evidence: "2026-10-14, https://imuna.org/nhsmun/nyc/about/: NHSMUN 'accepts delegations of up to 50 students of secondary school age (most often, ages 13-18)'. Main conference hotel is the New York Hilton Midtown; UN Headquarters is site of opening and closing ceremonies 'subject to availability'. Two sessions; registration first-come, first-served. Run by IMUNA, a 501(c)(3).",
  },
  "harvard-mun": {
    blurb: "High school students attend a four-day international relations simulation held each year in downtown Boston, where delegates take on the roles of world leaders and draft policy solutions in general assembly, crisis and specialized committees.",
    evidence: "2026-10-14, https://www.harvardmun.org/about: 'HMUN is a four-day international relation simulation for high school students held annually in downtown Boston.' Delegates take roles of world leaders and draft policy solutions. Thousands of students and advisors from over 60 countries. Committees include general assembly-style, crisis and themed committees.",
  },
  "yale-mun": {
    blurb: "A four-day Model UN simulation for high school students on Yale's campus in New Haven, run by the Yale International Relations Association. Only delegates 18 and under may attend, conference fees apply, and financial aid is offered.",
    evidence: "2026-10-14, https://ymun.org/what-is-ymun: Four-day international relations simulation for high school students on Yale's campus; run by the Yale International Relations Association; only delegates 18 and under; financial aid decisions and conference fees listed on dates page; three virtual committees offered for $30 per delegate.",
  },
  "scholastic": {
    blurb: "Students in grades 7-12 who are at least 13 and attend school in the U.S., its territories or military bases submit art and writing in 28 categories through an online portal. Entries cost $15 each, with fee waivers for financial need.",
    cost: "Paid",
    format: "Online",
    evidence: "2026-10-14, https://www.artandwriting.org/participation-terms/: 2027 terms: grades 7-12, 13 or older, U.S./territories/military bases or Canada (excluding Quebec); 28 categories; art uploaded as digital images, writing pasted into the portal; 'As of October 1, 2026, entry fees are $15 for an individual entry and $40 for a portfolio entry'; self-certified fee waivers; portfolios for seniors only. Field correction quote: 'As of October 1, 2026, entry fees are $15 for an individual entry and $40 for a portfolio entry. ... When entering your work, you will have the opportunity to certify your need for a fee waiver'",
  },
  "ayla": {
    blurb: "Secondary and undergraduate students anywhere, including international students, submit poetry packets of up to five poems or prose packets of up to three pieces totaling 3,500 words. Winners receive $200 and publication in The Adroit Journal.",
    evidence: "2026-10-14, https://theadroitjournal.org/adroit-prizes/: 'All secondary and undergraduate students are eligible, including international students'; poetry packet up to five poems; prose packet up to three works totaling 3,500 words; max ten packets; 'Winners will be awarded $200, and their work... will be featured in The Adroit Journal.'",
  },
  "iwp": {
    blurb: "A two-week residential creative writing program on the University of Iowa campus in Iowa City for students currently in 10th, 11th, or 12th grade, including international students. Admission is based almost entirely on a writing sample, with a $10 reading fee.",
    evidence: "2026-10-14, https://iyws.program.uiowa.edu/how-to-apply/summer-residential-program: Accepts applications from students 'currently in the 10th, 11th or 12th grade'; 9th graders no longer accepted; international applicants welcome; 'Admissions decisions are based almost entirely on the writing sample'; $10 reading fee; held on the University of Iowa campus.",
  },
  "kenyon": {
    blurb: "A two-week residential summer workshop run by the Kenyon Review where groups of 12 to 14 students meet five hours a day. Applicants must be 16 to 18 and rising juniors, rising seniors, or recent graduates. Tuition covers housing, meals, and activities, and need-based aid is available.",
    grades: [10,11,12],
    evidence: "2026-10-14, https://kenyonreview.org/event/young-writers-summer-residential-workshops/: Two two-week sessions; tuition and fees cover tuition, accommodations, all meals and activities; no application fee; need-based financial aid; 'between 16 and 18 years old at the time of the program and be a rising junior or rising senior, or a recent high school graduate'; 'Rising sophomores are not eligible'; groups of 12-14 meet five hours a day. Field correction quote: 'Applicants must be between 16 and 18 years old at the time of the program and be a rising junior or rising senior, or a recent high school graduate. Rising sophomores are not eligible'",
  },
  "posse": {
    blurb: "High school seniors nominated by their high school or a community-based organization in one of Posse's cities compete for full-tuition leadership scholarships from partner colleges. Posse supports Scholars from senior year through college, and the award is not need-based.",
    evidence: "2026-10-14, https://access.possefoundation.org/about-posse/program-components/recruitment/nomination-process: 'a high school senior must be nominated by their high school or a community-based organization'; 'full-tuition leadership scholarships' from partner schools; 'The Posse Scholarship is neither a minority nor a need-based scholarship'; supports Scholars 'from their senior year of high school, throughout college and into the workforce'; 10 cities plus a virtual program.",
  },
  "dell": {
    blurb: "Seniors graduating from a Texas high school who completed an approved college readiness program, are Pell Grant eligible, and have at least a 2.4 GPA can apply. Scholars get $20,000 for a four-year public Texas college plus a laptop, textbook credits, and teletherapy.",
    location: "Texas, USA",
    evidence: "2026-10-14, https://www.dellscholars.org/students/: 2027 cycle: 'Be a high school senior graduating from a Texas high school'; approved college readiness program in grades 11 and 12; Pell eligible; 2.4 GPA minimum; accredited four-year public college or university in Texas; '$20,000 flexible scholarship' plus laptop, book credits; flyer lists free Dell laptop, textbook credits, teletherapy. Field correction quote: 'To be eligible for the 2027 application cycle, you must: Be a high school senior graduating from a Texas high school.'",
  },
  "amazon-future-eng": {
    blurb: "U.S. high school seniors with financial need who are authorized to work in the U.S. and plan to study computer science or a related field can apply. Winners receive up to $10,000 a year toward unmet need and an offer of a summer internship at Amazon.",
    evidence: "2026-10-14, https://www.amazonfutureengineer.com/scholarships: 'covers your unmet financial need, up to a maximum of $10,000 annually'; 'an offer to complete a summer internship at Amazon'; must be authorized to work in the U.S.; must demonstrate financial need; high school senior with CS coursework or Amazon assessment; bachelor's in CS or related field; 400 scholarships.",
  },
  "stamps": {
    blurb: "Merit scholarships offered through partner colleges and universities, with annual amounts from $20,000 to $98,000 set by each school. Students do not apply to the foundation; most partners consider applicants automatically, and some require a separate application or interview.",
    evidence: "2026-10-14, https://www.stampsscholars.org/our-program/how-to-apply/: 'please contact one (or more) of our partner schools directly'; most partners consider students automatically, some need a separate application, interviews common; award amount varies by school; 'annual amounts that range from $20,000 to $98,000'; not transferable.",
  },
  "hagan": {
    blurb: "Seniors at any U.S. public, private, charter, magnet, or STEM high school with at least a 3.50 GPA who will enroll at a four-year not-for-profit college can apply. Awards are up to $7,500 per semester for up to eight semesters, and recipients must work 240 hours each year.",
    evidence: "2026-10-14, https://haganscholarships.org/application/: 'eligible high schools include public, private, charter, magnet, and STEM schools'; must be in the graduating class; homeschooled students excluded; 3.50 cumulative GPA; four-year not-for-profit college the first fall after graduation; 'up to $7,500 each semester for up to 8 consecutive semesters'; 'Recipients must work 240 hours from January 1 to September 1'; income cap ($100,000 vs $125,000 differs across pages).",
  },
  "mcdonalds-hacer": {
    blurb: "McDonald's scholarship for Hispanic high school seniors under 21 who are U.S. citizens, legal residents, or DACA recipients with at least a 2.8 GPA. Apply online with a transcript, personal statement, recommendation letter, and community service list; no essay is required.",
    evidence: "2026-10-14, https://www.mcdonalds.com/us/en-us/community/hacer/eligibility-and-requirements.html: Eligibility page: high school seniors, under 21, legal U.S. residents/citizens or DREAMER/DACA, minimum 2.8 GPA, must enroll full-time at an accredited 2- or 4-year college or vocational school the year after selection. 'No essay is needed'; documents: transcript, personal statement, letter of recommendation submitted online, list of community service projects. Selection: academics, financial need, community involve…",
  },
  "taco-bell-live-mas": {
    blurb: "Taco Bell Foundation scholarship for legal residents of the 50 states or D.C. ages 16 to 26 who are finishing high school or enrolled in an accredited two-year, four-year, or trade program. No GPA, test scores, transcripts, or recommendation letters are required.",
    evidence: "2026-10-14, https://tacobellfoundation.org/live-mas-scholarship/eligibilityfaq/: FAQ: legal residency in 50 states or D.C. (or dependent of active-duty military); age 16 to 26; on track to finish high school/GED or enrolled in accredited post-secondary program incl. vocational/trade; 'GPA, test scores, transcripts or recommendation letters are not required to apply'; financial need considered as one factor for 2026; open to Taco Bell employees and non-employees.",
  },
  "profile-courage": {
    blurb: "Students write a 700 to 1,000 word essay, with at least five sources, on an act of political courage by a U.S. elected official who served during or after 1917. Open to U.S. students in grades 9 to 12. First place wins $10,000, second $3,000, and three finalists $1,000 each.",
    evidence: "2026-10-14, https://www.jfklibrary.org/learn/education/profile-in-courage-essay-contest/eligibility-and-requirements: 'United States high school students in grades nine through twelve attending public, private, parochial, or home schools; U.S. students under the age of twenty enrolled in a high school correspondence/GED program; and U.S. citizens attending schools overseas.' Top award $10,000; second $3,000; three finalists $1,000 each; 15 honorable mentions. Essay on a U.S. elected official who served during or after 1917; 700-1,0…",
  },
  "doodle-for-google": {
    blurb: "Art contest in which K-12 students in the U.S. who are U.S. citizens or permanent residents submit their own Google Doodle. Finalists receive college scholarships, and the national winner also earns a technology package for their school.",
    evidence: "2026-10-14, https://doodleforgoogle.doodles.google/rules/: Rules: students enrolled in grades K-12 or home school in the U.S. (and certain territories), U.S. citizens or permanent legal residents. '5 Finalists will receive a $10,000 college scholarship managed by Scholarship America, plus a Chromebook'; national winner gets an additional $45,000 scholarship; 2025-2026 winner got $55,000 scholarship and $50,000 technology package for her school.",
  },
  "carson-scholars": {
    blurb: "$1,000 college scholarships for students in grades 4 to 11 at accredited U.S. K-12 schools who have at least a 3.75 GPA and show humanitarian qualities through community service. Students cannot apply on their own; an educator must nominate them.",
    evidence: "2026-10-14, https://carsonscholars.org/scholarships/: $1,000 scholarships for grades 4-11; accredited U.S. K-12 school; GPA at least 3.75; community service and humanitarian qualities; not need-based; students nominated by educators/schools only; past recipients ineligible; award invested until high school graduation then paid to college.",
  },
  "science-ambassador": {
    blurb: "Cards Against Humanity scholarship for women and non-binary high school seniors and undergraduates majoring in STEM at a U.S. college; U.S. citizenship is not required. Applicants submit a three-minute educational video, and five winners each get a one-time $20,000 stipend toward tuition.",
    evidence: "2026-10-14, https://www.scienceambassadorscholarship.org/: 'annual scholarship for undergraduate women and non-binary students in science, technology, engineering, and math'; high school seniors or undergraduates; no U.S. citizenship needed but must attend college in U.S./territory; graduate students excluded; STEM must be major; three-minute public YouTube video lecture; 'Five winners will each receive a one-time $20,000 stipend to put towards undergraduate STEM tuition'.",
  },
  "nfte": {
    blurb: "NFTE's youth pitch competition, now called the Youth Entrepreneurship Showcase, is for students ages 13 to 22 in NFTE programs. Students advance from local to regional and national rounds to pitch their ventures to judges, and all take part in workshops and coaching.",
    evidence: "2026-10-14, https://nfte.com/events/2026-youth-entrepreneurship-showcase/: 'brings together student entrepreneurs, ages 13-22, from the U.S. and NFTE's Global Innovation Network'; Feb 2026 release: challenge series rebranded as NFTE Youth Entrepreneurship Showcase; students from NFTE programs (Exploring Careers, Start Up Tech, Entrepreneurship 1, Entrepreneurship Essentials) eligible; advance through local, regional, national rounds; 'All students will take part in workshops, coaching sess…",
  },
  "dca": {
    blurb: "Members of DECA high school chapters compete in nearly 60 role-play, prepared, and online business events, such as entrepreneurship and personal financial literacy, advancing from their state or chartered association to the International Career Development Conference.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.deca.org/compete: 'With a combination of nearly 60 role-play, prepared and online events, DECA offers a competitive event for every course and every member.' Members compete within their chartered association and advance to ICDC. Dues: 'DECA Inc. membership dues are $8 USD per person (student, advisor, alumni and professional) plus appropriate chartered association dues.' Field correction quote: 'DECA Inc. membership dues are $8 USD per person (student, advisor, alumni and professional) plus appropriate chartered association dues. (deca.org/start)'",
  },
  "fbla": {
    blurb: "High school students join a local FBLA chapter and compete in business and leadership events, including tests, presentations, and team projects, with top competitors advancing to the National Leadership Conference. Membership requires national and state dues.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.fbla.org/high-school/competitive-events/: Competitive events include tests, presentations and team projects; National Leadership Conference for middle and high school; national membership dues must be paid to compete; 'National dues are $10 for all divisions' plus state dues that vary; chapter needs at least five members. Field correction quote: 'National dues are $10 for all divisions. (FBLA support/dues page, https://www.fbla.org/fbla-membership-dues/)'",
  },
  "hosa": {
    blurb: "Students join HOSA through a local school chapter and compete in health science events at the state level, with qualifiers advancing to the International Leadership Conference, where each member may enter one regular event. Membership requires national and state dues.",
    cost: "Paid",
    evidence: "2026-10-14, https://hosa.org/membership/: Students join through a local chapter (no individual memberships); General Rules: 'Individual and team participants must have competed in the same competitive event at the state (country) level'; 'HOSA members may enter only ONE regular competitive event at the ILC.' Membership page (search excerpt): national affiliation fee $10 per member plus state fees. Field correction quote: 'National affiliation fee of $10 per member plus state fees (search excerpt of https://hosa.org/membership/, not verbatim)'",
  },
  "ftc": {
    blurb: "Teams of up to 15 students in grades 7 to 12 design, build, and program a robot from a reusable kit to play a new game each season in alliance matches. Each team needs two adult coaches, and starting a team costs about $1,800 for registration and the kit.",
    evidence: "2026-10-14, https://www.firstinspires.org/programs/ftc/get-started: Grades 7-12, ages 12-18; up to 15 members; two adult lead coaches; reusable kit, programmable in block or Java; two-vs-two alliance matches with autonomous and driver-controlled periods; 'Starting a team costs about $1,800' (registration fee plus initial kit), local events extra.",
  },
  "samsung-solve": {
    blurb: "STEM contest in which public school teachers enter on behalf of students in grades 6 to 12 who develop a STEM solution to a problem in their community. Ten national finalists pitch to judges, and the national winner earns up to $50,000 in Samsung technology and resources for their school.",
    cost: "Free",
    evidence: "2026-10-14, https://news.samsung.com/us/samsung-opens-applications-17th-annual-solve-for-tomorrow-competition/: U.S. public school students grades 6-12; schools at least 50% publicly funded; applicant must be 21+ and employed by the school; teachers apply on behalf of classrooms; ten National Finalists in a live pitch event; 'one national winner, who will earn up to $50,000 in Samsung technology and resources, such as funding through education nonprofit DonorsChoose, for their school, alongside Community Choice, Employee Choi… Field correction quote: 'one national winner, who will earn up to $50,000 in Samsung technology and resources, such as funding through education nonprofit DonorsChoose, for their school'",
  },
  "youth-debate": {
    blurb: "High school NSDA members compete in speech and debate events and qualify for the National Speech & Debate Tournament mainly through their district tournament series. Students who miss out at districts can try the online Last-Chance Qualifier.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.speechanddebate.org/nationals/: District tournament series is 'the primary method for determining qualifiers' to Nationals; students need paid membership, at least the Degree of Merit, and a valid email on their NSDA account. Students compete in only one event at Nationals. Online Last-Chance Qualifier for students who did not qualify at districts. Supplemental events for non-qualifiers brought by schools. Field correction quote: 'To compete, students need paid membership, at least the Degree of Merit, and a valid email on their NSDA account.'",
  },
  "polygence": {
    blurb: "High school students work one-on-one online with a mentor on an original project such as a research paper, app, or podcast. The Core Program includes ten one-hour Zoom sessions over about three to six months plus feedback from a Writing Fellow, and applications are reviewed on a rolling basis.",
    evidence: "2026-10-14, https://www.polygence.org/core-program: Core Program: ten one-hour Zoom sessions over about three to six months, two rounds of feedback from a Writing Fellow; students spend 3-5 hours per week between sessions. Rolling admissions; no GPA or recommendation letters required. Projects can be research papers, prototypes, apps, or podcasts. Mentor matched within 1-3 weeks of enrolling.",
  },
  "horizon": {
    blurb: "High school students work one-on-one with a professor or PhD mentor for a trimester, choosing a subject track and a quantitative or qualitative focus, and write a research paper. Admission starts with an online application, and shortlisted applicants are interviewed.",
    evidence: "2026-10-14, https://horizoninspires.com/programs/: Each trimester pairs a student one-on-one with a professor or PhD student mentor; student chooses a subject and whether to focus on quantitative or qualitative research; output is a long research paper (about 20 pages / 5,000 words); online application form, shortlisted applicants interviewed. Spring, summer, fall and winter cohorts.",
  },
  "aops": {
    blurb: "AoPS Online offers math courses for high-performing students, including Intermediate courses aimed at grades 9-12, subject courses, contest prep, and the MathWOOT olympiad program. Most courses meet weekly for live online sessions with weekly homework, and self-paced courses are also offered.",
    evidence: "2026-10-14, https://artofproblemsolving.com/school/handbook/prospective/courses: 'Intermediate Math courses, targeted at high-performing students in grades 9-12'; subject courses and contest prep courses; 'Most of our courses meet weekly for live sessions, and have a variety of types of weekly homework. We also offer self-paced courses.' MathWOOT is a 7-month olympiad preparation and testing program (tuition $945). Online School accredited by WASC.",
  },
  "stargate": {
    blurb: "Participants of all ages, alone or in teams, spend a weekend using NASA's open data to tackle challenges written by NASA experts, at local in-person or virtual events. It is free to join, and anyone under 18 must be registered by a parent or guardian who stays with them during the event.",
    evidence: "2026-10-14, https://www.spaceappschallenge.org/resources/participant-faqs/: Current FAQ: open to all ages; participants under 18 need a parent or legal guardian to register them and stay with them during the event; local events may add requirements. Hackathon using NASA open data on challenges authored by NASA subject matter experts; teams encouraged; runs over a weekend in early October at in-person and virtual locations; no participation fee.",
  },
  "aas-blue": {
    blurb: "Student teams formed through schools, clubs, or independently design a space settlement over several months and describe it in a 40-page written proposal. The strongest proposals are defended before judges on Zoom, and the top teams advance to the international finals.",
    evidence: "2026-10-14, https://www.aerospaceeducationcompetitions.org/qualifying26: Qualifying teams design space settlements over several months in their schools, described in a 40-page written proposal; 10 strongest proposals invited to a Zoom defense before technical judges; top 4 teams advance to the international finals (held in the U.S.). Teams may be formed through schools, clubs, or independently; individual entries discouraged. U.S./Canada teams may also enter regional semi-finals.",
  },
  "cyber-patriot": {
    blurb: "Teams of two to six students with a registered adult coach get virtual operating systems and must find and fix security weaknesses while keeping critical services running. After online rounds, top teams earn all-expenses-paid trips to the National Finals in Maryland.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.uscyberpatriot.org/Pages/Competition/Competition-Overview.aspx: Rulebook CP-18: one adult coach of record per team; teams have two to six competitors, up to five compete at once. Fact sheet: teams receive virtual operating systems and must find and fix security weaknesses while maintaining critical services; any 6-hour period in each round; top teams earn all-expenses-paid trips to Maryland for the National Finals. Registration fee due once a team competes in a scored round; fee… Field correction quote: '$225 for each Open Division team'",
  },
  "picoctf": {
    blurb: "Carnegie Mellon's free capture-the-flag program where players solve jeopardy-style puzzles by reverse engineering, hacking, and decrypting to find hidden flags. Teams of up to five enter the annual competition, and picoGym practice is open year-round.",
    evidence: "2026-10-14, https://www.picoctf.org/competitions/2026-spring.html: Run by Carnegie Mellon; free; aimed at middle and high school students; participants 13 and older encouraged. Jeopardy-style challenges; goal is to find hidden flags by reverse engineering, breaking, hacking, and decrypting. Teams up to five; prizes for eligible US middle and high school teams. picoGym practice available year-round.",
  },
  "ymf": {
    blurb: "Classical musicians ages 8 to 18 not yet in college apply to the free Learning and Media Lab Fellowship, a six-week online Zoom curriculum ending with a recorded performance and interview for From the Top's radio show. Fellows in need may get up to $10,000.",
    format: "Online",
    evidence: "2026-10-14, https://fromthetop.org/apply/become-a-fellow/: Applicants aged 8 to 18, not yet in college, full-time students. Fellowship: 'online curriculum spanning 12 hours over six weeks', synchronous on Zoom; Fellows record a solo or ensemble performance and interview for the national radio program and podcast; fellowship is free. Jack Kent Cooke Young Artist Award: need-based, up to $10,000, about 20 per year, for eligible Fellows. Application: two recordings, two teache… Field correction quote: 'online curriculum spanning 12 hours over six weeks'",
  },
  "yola": {
    blurb: "LA Phil's YOLA gives young people through age 18 free instruments, intensive music instruction, and chances to perform. It runs at sites in South LA, the Rampart District, Westlake/MacArthur Park, East LA, and Inglewood, serving students from more than 200 schools.",
    evidence: "2026-10-14, https://www.laphil.com/learn/yola/youth-orchestra-los-angeles: 'YOLA provides young people, ages five through eighteen, with free instruments, intensive music instruction, and opportunities to perform' (another page says 6 to 18). Sites in South LA, the Rampart District, Westlake/MacArthur Park, East LA, and Inglewood; players from more than 200 schools across LA County. Up to 15 or 18 hours per week (pages differ).",
  },
  "rsi": {
    blurb: "Free summer research program run by CEE at MIT and Stanford. Students take a week of intensive STEM classes, then do a five-week individual research internship. Open to high school juniors who are 16 by July 1; seniors are not eligible. U.S. and some international students apply directly.",
    location: "Cambridge, Massachusetts and Stanford, California, USA",
    evidence: "2026-10-14, https://www.cee.org/programs/research-science-institute: 'cost-free for all participants. All educational, housing and dining expenses are covered'; 'typically in the middle of their junior year'; 'High school seniors are not eligible'; 'must be 16 years of age by July 1'; 'U.S. citizens and permanent residents, as well as international students from participating countries'; first week intensive STEM classes then five-week research internship; $75 application fee (waiver… Field correction quote: 'RSI '27 will be in session at MIT from June 20 to July 31, 2027, and at Stanford June 27-August 7, 2027.'",
  },
  "global-water-challenge": {
    blurb: "U.S. high school students in grades 9-12 who will be at least 15 by August 1 of the competition year enter water-related science projects, alone or in teams of two, at the state level. State winners advance to nationals, and the U.S. winner receives $10,000 and represents the U.S. in Stockholm.",
    location: "USA",
    evidence: "2026-10-14, https://www.wef.org/membership--community/students--young-professionals/sjwp/sjwp-eligibility-and-entry-requirements/: Open to high school students in grades 9-12 who will have reached age 15 by August 1 of the competition year and have done a water-related science project. Teams of up to two. Levels: regional, state, national, international; only State Competition winners are eligible for nationals. State competitions open only to residents of the 50 United States, DC and Puerto Rico. U.S. winner receives $10,000, a crystal trophy,… Field correction quote: 'the competition is open only to residents of the 50 United States, the District of Columbia and Puerto Rico'",
  },
  // Round 2: 80 more thin descriptions checked against the official pages on 2026-10-14.
  "riaa": {
    blurb: "High school students in grades 9-12 who live in the U.S. spend five to seven days in music industry tracks such as music business, production, songwriting and performance. Camps run in Los Angeles, Nashville, Miami and New York. Students apply with work samples; tuition is charged.",
    location: "Multiple, USA",
    evidence: "2026-10-14, https://grammymuseum.org/education/grammy-camp/: Official pages: Los Angeles camp is a 'seven-day, non-residential intensive'; New York and Nashville seven days, Miami five days. Tracks: music business, production, songwriting, performance (NY also musical theater, jazz). Eligibility: U.S. residents in grades 9-12, graduating seniors can apply, incoming freshmen cannot. Application requires work samples in at least two track areas. Tuition $3,600 LA (incl. optiona… Field correction quote: 'grammymuseum.org has separate camp pages: 'GRAMMY Camp Los Angeles', 'GRAMMY CAMP New York', 'GRAMMY Camp Nashville', 'GRAMMY Camp - Miami''",
  },
  "idealab": {
    blurb: "Students age 16 to 18 who have completed 10th or 11th grade spend five weeks, plus an orientation week, taking art and design studio courses on the RISD campus in Providence. No portfolio or admission test is required, and any skill level can apply. Tuition is charged.",
    evidence: "2026-10-14, https://precollege.risd.edu/on-campus/application-information: Compare page: on-campus program 'five weeks, plus an orientation week'; for high school students age 16-18 rising into 11th or 12th grade. Application page: applicants must have finished 10th or 11th grade; no admission test or portfolio requirement; open regardless of art skill level.",
  },
  "national-history-day": {
    blurb: "Students research a topic tied to the yearly theme and present it as a paper, exhibit, performance, documentary or website, alone or in a group of two to five (papers are individual only). High school students compete in the Senior division for grades 9-12, and top entries advance to the National Contest.",
    evidence: "2026-10-14, https://nhd.org/en/contest/get-started/: Two divisions: Junior (grades 6-8), Senior (grades 9-12). Categories: paper, exhibit, performance, documentary, website; paper individual only; groups of two to five students. Annual theme (2026: Revolution, Reaction, Reform in History). National Contest held each year.",
  },
  "syp-michigan": {
    blurb: "Students who have finished at least one year of high school take a two-week course taught by University of Michigan faculty in Ann Arbor, in classes of about 15. Students may attend one, two or all three sessions. Admission is rolling and competitive, and international students can apply.",
    evidence: "2026-10-14, https://sites.lsa.umich.edu/mmss/about-us/: Open to students who have finished at least one year of high school but not completed senior year; accepts students from anywhere in the world. Three two-week sessions; students may attend one, two or all three; one course per session; classes of about 15 taught by U-M faculty. Rolling, competitive admission; transcript required; GPA/SAT not required. Program fees page exists.",
  },
  "emory-pre": {
    blurb: "Current 10th and 11th graders who are at least 15 and have a GPA of 3.0 or higher take summer courses at Emory University in Atlanta, with options such as Summer College and a Pre-Med Institute. Students apply directly, with a $70 application fee, and tuition is charged.",
    grades: [10,11],
    evidence: "2026-10-14, https://precollege.emory.edu/apply/index.html: Eligibility page: 'Minimum 15 years of age by session start date', 'Current 10th or 11th graders in high school when completing the application', 'Minimum GPA for admission is 3.0'; says not to apply if in 9th or 12th grade; $70 non-refundable application fee. Program comparison lists Summer College and Pre-Med Institute. Field correction quote: 'Current 10th or 11th graders in high school when completing the application (eligibility page also says not to apply if you are in 9th or 12th grade)'",
  },
  "notre-dame": {
    blurb: "Current sophomores and juniors who are at least 16 live in a Notre Dame residence hall during a two-week Summer Scholars session on campus. Students apply directly with a transcript, counselor report and teacher recommendation; test scores are optional. Grants cover costs for qualifying Indiana residents.",
    evidence: "2026-10-14, https://precollege.nd.edu/summer-scholars/eligibility-and-application-requirements/: 'Eligibility for Summer Scholars are current sophomores and juniors with high academic standing'; at least 16 by August 1; application: online form, transcript, counselor report, teacher recommendation; SAT/ACT/PSAT encouraged but not required. Students live in a residence hall on campus; 2026 sessions June 6-20 and June 27-July 11. Lilly Endowment grant covers Summer Scholars costs for qualifying Indiana residents.",
  },
  "mit-launch": {
    blurb: "High school students ages 14 to 18 work in teams to build and launch a startup, in online programs lasting two to eight weeks or in-person programs of two or four weeks on a university campus. Students apply directly; tuition is charged and financial awards are available.",
    evidence: "2026-10-14, https://www.launchx.com/faqs: FAQ: programs designed for high school students ages 14-18 (Online Startup Experience 14-22). Online BootCamp 2-3 weeks, Online Innovation 3 weeks, Online Flagship 5 weeks, Online Startup Experience 8 weeks; In-person Exploration 2 weeks, In-Person Flagship 4 weeks on a university campus (from $11,495). Financial awards help qualified students pay tuition.",
  },
  "girlup": {
    blurb: "Students start or join a Girl Up Club at school or in their community, choosing officers and running at least five Girl Up activities each school year. A club needs five core members, and clubs whose members are mostly under 18 must have an adult advisor.",
    evidence: "2026-10-14, https://clubs.girlup.org/get-started: 'Any student - middle school, junior high, high school, homeschooled, or in college - can start a Club'; five core members required; membership open to anyone; clubs mostly under 18 need an adult advisor; clubs must host at least five Girl Up activities every school year and submit reports.",
  },
  "brookhaven": {
    blurb: "Students who have completed 11th grade and are at least 16 join a mentored team at Brookhaven National Laboratory for a six-week onsite research program, Monday through Friday. Applicants must be U.S. citizens or permanent residents, and projects are team-based, not independent.",
    evidence: "2026-10-14, https://www.bnl.gov/education/programs/program.php?q=219: 'recommended for students that have completed 11th grade'; audience 11th and 12th graders; at least 16 by program start; U.S. citizen or Lawful Permanent Resident; health insurance required; 'commit for the full six-week program onsite, Monday through Friday 8:30am-5:00pm'; 'Independent research projects will not be permitted'.",
  },
  "argonne": {
    blurb: "A high school science teacher and a team of students work with an Argonne scientist on a research project over the school year, from proposal to final poster, visiting the lab to collect data and to present. Teachers register the team, and each school may field one team.",
    evidence: "2026-10-14, https://www.anl.gov/education/exemplary-student-research-program: School year-long program pairing a teacher with a scientist mentor; teacher picks a team of students; project runs from proposal to final poster; teams visit Argonne twice (collect data, present); aimed at honors/AP science classes; teachers must hold a valid grades 9-12 certificate; one team per school.",
  },
  "plaintext": {
    blurb: "GenCyber camps, run by host universities and schools with federal grants, teach cybersecurity to middle and high school students. Camps are free to attend and run at least five days with 30 or more instructional hours, offered in person, virtually or in a combination format.",
    evidence: "2026-10-14, https://www.gen-cyber.com/faq/: gen-cyber.com: programs offered \"at no cost to student and/or teacher participants\"; \"all programs are free of charge\"; camps \"expected to run a minimum of five days to include at least 30 intensive instructional hours\"; formats: In-Person Camps, Virtual Camps, Combination Camps; focus on middle school and high school students; hosts are universities, public and private schools or school systems receiving GenCyber g…",
  },
  "igem": {
    blurb: "High school teams design synthetic biology projects and compete in the High School track of the iGEM Competition, on the same season and Jamboree schedule as collegiate teams. Each team needs a principal, teacher or academic coach from an enrolling school as Primary PI.",
    evidence: "2026-10-14, https://old.igem.org/Competition/High_School: \"HS teams participate in the competition in the High School track\"; \"High school teams follow the same timeline, deadlines and attendance dates as the collegiate teams\"; Primary PI must be a principal, teacher, or academic coach at one of the enrolling schools (competition.igem.org/registration/overview); eligible for High School Grand Prize, Special Prizes, and Gold, Silver, Bronze Medals.",
  },
  "state-new-hampshire-asp": {
    blurb: "Five-week residential summer program at St. Paul's School in Concord for students at New Hampshire public and parochial schools, most applying in the fall of junior year. Courses include engineering, law, molecular biology and studio arts. Tuition covers room and board, and aid is offered.",
    evidence: "2026-10-14, https://www.sps.edu/asp-summer: Five-week residential program since 1958; \"open to current sophomores and juniors attending public or parochial schools in New Hampshire\"; \"Most students apply in the fall of their junior year\"; 2026 tuition $4,950 \"inclusive of room and board and all fees\"; more than 50% receive financial aid; no application fee; courses include engineering, law and governance, studio arts, molecular biology, biomedical ethics.",
  },
  "csv-sch-mae-mary-legacy-foundation-inc": {
    blurb: "Scholarship for African American graduating high school seniors from anywhere in the U.S. who plan a health care career and will attend a two- or four-year university or technical school. Awards are based on academics and financial need. Apply online with an essay and two recommendations.",
    grades: [12],
    evidence: "2026-10-14, https://www.maeandmarylegacyfoundation.org/apply: Applicants must be African American graduating high school seniors; students from anywhere in the United States can apply; \"students pursuing careers in the health care profession ONLY should apply\"; must attend a two/four-year university or technical school; awards for tuition, books, fees; \"based on academic excellence and financial need\"; required: photo, cover letter and resume, personal essay (max one page), tw… Field correction quote: 'Applicants must be African American high school seniors who are graduating (apply page, as shown in search results)'",
  },
  "los-alamos-national-laboratory-high-school-internship-program": {
    blurb: "Paid hourly internship at Los Alamos National Laboratory for New Mexico high school seniors who are at least 16 and have a 2.75 GPA. Interns work part-time, typically 10 to 20 hours a week, during the school year and up to 40 hours a week in summer. Applicants must pass a drug test.",
    evidence: "2026-10-14, https://www.lanl.gov/engage/collaboration/student-programs/high-school: High school page: senior status, age 16, 2.75 GPA, attend a New Mexico high school, pass a new-employment drug test; part-time during school year \"typically 10-20 hours a week\", full-time in summer \"up to 40 hours a week\", summer typically 10 weeks; 2026 salary structure lists high school rate $16.89 hourly.",
  },
  "lockheed-martin-high-school-internship-program": {
    blurb: "Paid summer internship at Lockheed Martin sites such as Denver, Sunnyvale, Huntsville and Herndon. Applicants must be enrolled in high school, be 16 by the start of the internship and live within commuting distance of a participating facility. Seniors graduating in May are not eligible.",
    evidence: "2026-10-14, https://www.lockheedmartin.com/en-us/careers/candidates/students-early-careers/high-school.html: \"16 years of age at start of internship\"; current enrollment at a local high school; live within commutable distance of a participating facility; \"High school seniors graduating in May are not eligible for the high school internship program\"; cities include Denver, Sunnyvale, Cape Canaveral, King of Prussia/Valley Forge, Huntsville, Herndon.",
  },
  "tufts-university-summer-research-experience": {
    blurb: "Six-week, in-person summer research program at Tufts where high school students in grades 11 and 12 work in small cohorts on a research project led by a Teaching Fellow and present a poster at the end. Commuter and residential options are offered for a fee, with limited need-based scholarships.",
    evidence: "2026-10-14, https://universitycollege.tufts.edu/pre-college/browse/tufts-summer-research-experience: 6-week, in-person pre-college research program, commuter or residential; small cohorts on a research project under a Teaching Fellow, poster presentation at closing session; current grade 11-12 students; 2027 fees $9,196 commuter, $11,790 residential; need-based scholarships limited; not for credit.",
  },
  "lawrence-berkeley-national-laboratory-berkeley-lab-director-s-ap": {
    blurb: "Paid summer apprenticeship at Berkeley Lab where public school students in grades 10 and 11 from Alameda, San Francisco and Contra Costa counties do project-based STEM work. Students earn $500 per week and must be California residents, U.S. citizens or permanent residents, and 16 by the start date.",
    grades: [10,11],
    evidence: "2026-10-14, https://k12education.lbl.gov/programs/high-school/BLDAP/program: \"BLDAP is a project-based high school STEM program designed to help participants in grades 10-11\"; open to public school students in grades 10 and 11 in Alameda, San Francisco, and Contra Costa counties; \"Students will be paid $500 per week\"; \"full time residents of the state of California and a US Citizen or permanent resident\"; must be 16 at program start for all paid opportunities (FAQ); travel to Berkeley Lab at… Field correction quote: 'BLDAP is a project-based high school STEM program designed to help participants in grades 10-11 to develop 21st century skills'",
  },
  "chicago-summer-business-institute-chicago-summer-business-instit": {
    blurb: "Six-week paid summer internship with corporate sponsors, largely in financial services, plus Friday workshops. Open to City of Chicago residents who are high school sophomores, juniors or seniors with at least a B (3.0) average and household income under $80,000.",
    grades: [10,11,12],
    evidence: "2026-10-14, https://chicagobusinessinstitute.org/how-to-apply/: \"Founded in 1991 to provide paid summer internships for Chicago high school students\"; \"You are a resident of the City of Chicago\"; high school sophomores, juniors, or seniors for the 2026-2027 school year; \"B\" or 3.0 average; household income below $80,000; 6-week program with sponsor supervision and Friday workshops; transcript, resume, essay, income form, two letters of recommendation. Field correction quote: 'be high school sophomores, juniors, or seniors for the 2026-2027 school year (How to Apply page, as shown in search results)'",
  },
  "lawrence-berkeley-national-laboratory-experiences-in-research-ei": {
    blurb: "Six-week paid summer internship at Berkeley Lab where high school students work on projects with STEM professionals in areas such as data science, science communication and experimental research. Students must be at least 16 and are paid $500 per week.",
    evidence: "2026-10-14, https://k12education.lbl.gov/programs/high-school/experiences-in-research: Official EinR pages: students 'spend six weeks over summer working directly on cutting edge projects alongside experts in STEM'; projects cover administration, science communication, data science, experimental research; 'Students will receive $500 per week'; must be 16 by program start; aimed at public high schools in Alameda, Contra Costa or San Francisco counties, commute expected; former interns cannot reapply.",
  },
  "stanford-medicine-genomics-research-internship-program-grips": {
    blurb: "Free eight-week summer internship in which Bay Area high school students carry out genomics research in Stanford labs under a mentor, 9am to 1pm on weekdays. Applicants must be 16 or older, have a 3.0 unweighted GPA and some biology, chemistry or programming background.",
    evidence: "2026-10-14, https://med.stanford.edu/genetics/education/GRIPS.html: 'The Genomics Research Internship Program at Stanford (GRIPS) is a free, research-intensive summer internship program open to Bay Area high school students'; students conduct genomics research under a lab mentor; schedule 9am-1pm Mon-Fri; 16 or older by start; unweighted GPA at least 3.0; prior knowledge of biology, chemistry or programming; $55 application fee with need-based waivers, no participation fee.",
  },
  "u-s-department-of-the-treasury-headquarters-student-internship-p": {
    blurb: "Unpaid internships at Treasury headquarters in Washington, D.C. that give high school, undergraduate and graduate students work experience and exposure to federal careers. Applicants must be U.S. citizens enrolled at an accredited school and apply on USAJOBS for spring, summer or fall terms.",
    cost: "Free",
    evidence: "2026-10-14, https://home.treasury.gov/about/careers-at-treasury/studentinternship-programs/headquarters-student-internship-program: 'unpaid opportunities in Washington, D.C. designed to provide high school, undergraduate, and graduate students with work experience and direct exposure to federal careers'; 'Students must be U.S. citizens and maintain student eligibility and enrollment throughout the duration of the internship'; postings on USAJOBS; spring, summer and fall terms. Field correction quote: 'unpaid opportunities in Washington, D.C. designed to provide high school, undergraduate, and graduate students with work experience and direct exposure to federal careers'",
  },
  "devcom-army-research-laboratory-high-school-apprenticeship-progr": {
    blurb: "Summer commuter apprenticeship in which rising high school juniors and seniors do science and engineering research alongside university researchers sponsored by the Army Research Office. Applicants must be U.S. citizens aged 16 or older. Students earn a stipend and write a research abstract.",
    evidence: "2026-10-14, https://arl.devcom.army.mil/careers/students/: HSAP 'provides rising high school juniors and seniors with a science and engineering research experience alongside university researchers sponsored by the Army Research Office (ARO)'; U.S. citizens, at least 16; commuter program; 'provides a stipend and the student is required to produce an abstract'; up to 300 hours June through August; no housing.",
  },
  "pacific-northwest-national-laboratory-high-school-intern-program": {
    blurb: "PNNL hires high school students as business or research interns in Richland. In the school year interns work up to four hours a day, five days a week, and can earn elective credit through their school's work-based learning program; in summer they can work full time.",
    evidence: "2026-10-14, https://www.pnnl.gov/high-school-students-pnnl: Academic year (Aug-May) business or research internships, 'up to 4 hours a day, 5 days a week'; summer up to full time June-August; 'PNNL works in collaboration with your high school's work-based learning (WBL) program to provide elective credits that apply to graduation'; under-18 students not eligible to work in lab spaces. A 2026 official posting required current enrollment in a Tri-Cities, WA area high school, a…",
  },
  "dc-department-of-employment-services-high-school-internship-prog": {
    blurb: "Paid fall and spring semester internships with work-readiness training for District of Columbia high school students in grades 9 to 12 aged 14 to 21. Applicants must verify DC residency and school enrollment, and spots are awarded first come, first served.",
    evidence: "2026-10-14, https://summerjobs.dc.gov/page/hsip: DOES HSIP offers District students work-readiness training and internships; eligibility grades 9-12, ages 14-21, DC residents; 'internships are awarded on a first-come, first-served basis'; fall and spring semesters, one per calendar year; 2025-2026 packet: $10.00/hour up to 8 hours per week; certification tasks and documents required.",
  },
  "georgia-tech-research-institute-high-school-summer-internship": {
    blurb: "Five-week summer internship at the Georgia Tech Research Institute, 24 hours a week, for Georgia residents who are at least 16 and attend a Georgia high school or home school. Most positions require U.S. citizenship or U.S. person status, and housing is not provided.",
    evidence: "2026-10-14, https://gtri.gatech.edu/stem/high-school-summer-internship: Georgia residents attending public, private, charter or home school in Georgia; at least 16 by the cutoff; classes of 2027, 2028, 2029 for the 2027 program; 'most, but not all, positions require US Citizenship or status as a US Person'; 24 hours/week for five weeks; mandatory all-day orientation and final presentation; housing not provided; pre-application, resume, personal statement, recommendation letter.",
  },
  "sandia-national-laboratories-internships-co-ops": {
    blurb: "Sandia has a limited number of internships for high school students who are at least 16 and enrolled full time, with a 3.0 GPA required for R&D, technical and business roles. Summer internships last about 10 to 12 weeks, and year-round internships are for students at local schools.",
    evidence: "2026-10-14, https://www.sandia.gov/careers/career-possibilities/students-and-postdocs/internships-co-ops/institute-programs/faqs/: FAQ: 'Can high school students participate in an internship? Yes. We have limited openings for high school students who are at least 16-years old.' HR: enrolled full time at an accredited college, university or high school; 3.0/4.0 for R&D, Technical or Business positions, 2.5 for clerical/laborer; summer about 10-12 weeks; year-round for local students or remote while at a non-local school; U.S. citizenship where c…",
  },
  "u-s-fish-wildlife-service-internships-and-fellowships": {
    blurb: "The Service's internship and fellowship page covers routes into federal conservation work, including Pathways internships open to students enrolled at least half time in high school, college or technical school, and the paid summer Youth Conservation Corps for ages 15 to 18.",
    evidence: "2026-10-14, https://www.fws.gov/internships: Pathways 'Internship Program is open to current students in high school, college, or technical school at least half time'; official early-career PDF: Youth Conservation Corps is a paid summer program for ages 15-18, about eight weeks June-August; SCA partner internships; some refuge-run internships unpaid.",
  },
  "northwestern-university-feinberg-school-of-medicine-kimberly-que": {
    blurb: "Paid six- to eight-week summer research program in Feinberg's Division of Pulmonary and Critical Care, where each intern works full time on a project with a Northwestern faculty mentor and presents a poster. High school applicants must be juniors when they apply and at least 16.",
    evidence: "2026-10-14, https://www.feinberg.northwestern.edu/sites/sqlifts/research/summer-research-program.html: Runs six to eight weeks, 40 hours/week 9-5 Mon-Fri; 'competitive stipend'; matched with a Northwestern faculty member; poster day; 'must currently be a junior at the time of application'; 'age 16 years or older as of May 31 of the program year'; page said it was not accepting new applications for the upcoming summer after last year's cancellation, prioritizing winter 2025 applicants.",
  },
  "seattle-children-s-research-institute-research-training-program": {
    blurb: "Four-week in-person summer program in downtown Seattle where rising high school juniors and seniors do lab work, attend lectures and workshops and complete an independent research project. It is free, no research experience is needed, and students get a $2,000 stipend.",
    evidence: "2026-10-14, https://www.seattlechildrens.org/research/centers-programs/science-education-department/high-school-training-programs/: Open to 'current 10th grade (rising junior) and current 11th grade (rising senior)'; in person, must commute to downtown Seattle; four weeks on weekdays; lab work, lectures, college and career workshops, independent research project with final presentation; free; 'students will receive a stipend of $2,000 to offset costs for transportation and meals'; SSN or ITIN needed; capacity 24.",
  },
  "scripps-research-translational-institute-student-research-intern": {
    blurb: "Ten-week unpaid summer internship in genomics and mobile health research at the Scripps Research Translational Institute, mostly in dry labs with a few wet-lab spots. High school students must be at least 16 and receive school credit. No housing is provided.",
    evidence: "2026-10-14, https://www.scripps.edu/science-and-medicine/translational-institute/education-and-training/student-research-internship/index.html: 10-week summer program 'designed for high school, undergraduate, graduate and professional students'; genomics and mHealth; 'most interns work in a dry lab setting, with a limited number of wet lab positions'; high school students 'must be at least 16 years of age before the start of their internship'; unpaid, interns 'must receive school credit or transcript notation'; no housing or housing support.",
  },
  "scripps-research-summer-high-school-internship-program": {
    blurb: "Seven-week, 40-hour-a-week lab internship at Scripps Research in La Jolla with a $5,040 stipend. Open to San Diego County students age 16 or older from listed REACH partner schools who have a year each of chemistry and biology and at least a 3.0 GPA.",
    evidence: "2026-10-14, https://education.scripps.edu/k-12-outreach/ca-outreach/hs-internships/: 2026 page: $5,040 stipend for seven weeks; eligibility restricted to students from specific REACH partner schools/programs; San Diego County residency; at least 16 by boot camp start; one year each of HS chemistry and biology; 3.0 minimum GPA; 40 hours a week; own transportation to La Jolla; must be legally able to work in the U.S. The $4,760 figure in the old blurb comes from the outdated 2024 page.",
  },
  "florida-international-university-summer-research-internship": {
    blurb: "Eight-week cardiovascular health research internship at FIU for South Florida high school juniors and graduated seniors committed to FIU. Applicants must be at least 16 with an unweighted 3.0 GPA, spend at least 15 hours a week in a lab, and present their project at the end.",
    evidence: "2026-10-14, https://case.fiu.edu/opportunities/internships-jobs/summer-research-internship/: Eight-week cardiovascular-focused program for students from South Florida high schools; 'high school juniors OR graduated seniors who have committed to attend FIU'; at least 16 by start date; unweighted 3.0 GPA; at least 15 hours a week in a lab; curriculum Mon/Wed/Fri; abstract and final presentation required.",
  },
  "national-institute-on-aging-summer-research-training-for-high-sc": {
    blurb: "Paid eight- to ten-week summer research internship in National Institute on Aging labs on the Johns Hopkins Bayview campus in Baltimore. Interns do hands-on lab work, attend weekly seminars by NIA scientists, and present a poster. The stipend is based on education completed.",
    evidence: "2026-10-14, https://www.nia.nih.gov/nia-summer-internship: STAR (Summer Trainee in Aging Research); 'eight to ten weeks, beginning in late May and ending in mid-to-late August'; hands-on lab work and weekly seminars by NIA scientists; poster at NIA Summer Student Poster Day; labs at Johns Hopkins Bayview campus; 'stipend which is based on the amount of education completed'. Eligibility differs: a 2025 NIA post says HS seniors 18+ by June 1; an older page says juniors or sen…",
  },
  "university-of-georgia-caes-young-scholars-program": {
    blurb: "Paid summer research internship in agricultural, food and environmental sciences where interns work 30 hours a week with a UGA faculty mentor in Athens, Griffin or Tifton. Open to first-time participants age 16 or older who have finished sophomore year. Housing is not provided.",
    evidence: "2026-10-14, https://www.caes.uga.edu/students/prospective-students/youth-high-school-programs/young-scholars.html: 'paid five-week summer internship program for high school students interested in agricultural, food, and environmental sciences' (other CAES pages say six weeks); 30 hours per week 'actively engaged in research under the guidance of a faculty mentor'; must have completed sophomore year, be first-time participant, 16 by start; sites in Athens, Griffin or Tifton; non-residential.",
  },
  "broad-institute-of-mit-and-harvard-broad-summer-scholars-program": {
    blurb: "Six-week, full-time summer research program at the Broad Institute in Cambridge for rising seniors who attend a Massachusetts high school and can commute daily. Scholars receive a $3,600 stipend and partial transportation reimbursement, and no research experience is required.",
    evidence: "2026-10-14, https://www.broadinstitute.org/partnerships/education/k-12-outreach/broad-summer-scholars-program: Six-week program; $3,600 stipend and partial reimbursement for transportation; no cost to apply or attend; rising seniors who apply in junior year; FAQ: 'only current Juniors who attend a high school in MA are eligible'; must be able to commute daily; daily 9am-5pm; 'no previous research experience is required'; US citizen, permanent resident or non-US citizen with employment authorization.",
  },
  "university-of-illinois-urbana-champaign-young-scholars-summer-st": {
    blurb: "Six-week summer research program at the University of Illinois where students are matched with a campus lab and work in teams. Open to rising 10th to 12th graders from Illinois, Indiana, Iowa, Kentucky, Michigan, Missouri or Wisconsin. Housing, meals and a fellowship payment are included.",
    evidence: "2026-10-14, https://wyse.grainger.illinois.edu/summer-programs/young-scholars-summer-research: 6-week summer program; eligibility by grade entering in the fall (rising 10th-12th) and home state: Illinois, Indiana, Kentucky, Michigan, Missouri, Iowa, Wisconsin; students matched with a university lab in teams; FAQ: no cost beyond travel, housing, meals and a monetary award (fellowship payment) included; no course credit.",
  },
  "cdc-museum-disease-detective-camp": {
    blurb: "Week-long academic day camp at CDC headquarters in Atlanta where students explore public health topics such as epidemiology, outbreak investigation, and data analysis. Open to rising juniors and seniors who are at least 16 by the first day of camp. The camp is tuition-free.",
    evidence: "2026-10-14, https://www.cdc.gov/museum/camp/detective/index.htm: Academic day camp at CDC headquarters in Atlanta; rising juniors or seniors (current sophomores or juniors), at least 16 by first day of camp (no exceptions); 27 slots per week-long session; tuition-free; Mon-Fri 8:45am-4:00pm.",
  },
  "university-of-tennessee-haslam-college-of-business-women-empower": {
    blurb: "Free six-day summer program at UT Knoxville's Haslam College of Business with workshops on coding, entrepreneurship, supply chain management, business analytics, and college readiness. Applicants need at least a 3.0 GPA, and selected students live in campus housing.",
    evidence: "2026-10-14, https://haslam.utk.edu/access/women-empowered-through-business-web-institute/: Six-day summer program; intersection of tech and business; OACC hosts four free business programs during the summer, WEB among them; GPA of at least 3.0, leadership potential, interest in business; application with transcript and activities; must commit to all six days and stay in campus dormitory housing; some sessions led by women in technology and business.",
  },
  "nslc": {
    blurb: "Residential summer programs on university campuses in fields such as medicine, business, engineering, and government and law. Open to high school students ages 14 to 18. Students live in supervised campus dorms, tuition is charged, and need-based scholarships are available.",
    evidence: "2026-10-14, https://www.nslcleaders.org/about-summer-youth-programs/: Students must be 14 to 18 and have completed at least one year of high school; 'Students must be currently enrolled in 9th-12th grades to qualify for our high school sessions'; 'All students are required to reside in supervised campus dormitories'; Summer Program Scholarship for students demonstrating financial need, academic merit, involvement; AU credit offered; Columbia/UCLA around $4,300-$4,600.",
  },
  "inspire": {
    blurb: "Live online AI program for students in grades 9 to 12, taught in small groups by Stanford and MIT graduate students over 10 sessions and 25 hours. Students learn AI basics and Python, then build a mentor-led AI for social good project. No prior coding is required, and the fee is $1,400.",
    evidence: "2026-10-14, https://www.inspiritai.com/liveonline: 10-session, 25-hour live online bootcamp; small groups taught by Stanford and MIT graduate students; grades 9-12; no prior programming required; AI fundamentals and Python, then mentor-led AI for social good project and web app; 'USD $1400 (all inclusive)', payment plans available.",
  },
  "kode-with-klossy": {
    blurb: "Free two-week summer coding camps for young women and gender-expansive teens ages 13 to 18, in web development, AI and machine learning, or data science. No prior coding experience is required, and camps run both virtually and at in-person sites.",
    evidence: "2026-10-14, https://www.kodewithklossy.com/programs: 'young women and gender expansive teens, aged 13-18'; 'Absolutely NO prior coding experience is required'; camps 'free of cost to scholars'; two-week intensive in Web Development, AI/Machine Learning, or Data Science; virtual options and in-person sites.",
  },
  "hsyl": {
    blurb: "Three- to four-day leadership seminars held each spring and summer for high school sophomores nominated by their school or community. Students take part in workshops and facilitated dialogue on their leadership strengths and values. A registration fee applies and varies by location.",
    cost: "Paid",
    evidence: "2026-10-14, https://hoby.org/programs/state-leadership-seminars/: 'Our flagship program welcomes school and community nominated high school sophomores to 3-4-day seminars each spring and summer.' FAQ: 'The registration fee for the seminar is dependent on the location, but ranges from $225 to $450. The registration fee covers housing, food, and all programming materials for the weekend.' Field correction quote: 'The registration fee for the seminar is dependent on the location, but ranges from $225 to $450.'",
  },
  "rotary": {
    blurb: "Leadership training events organized by Rotary clubs and districts for participants ages 14 to 30. Formats vary by district and range from a one-day seminar to a three-day retreat or a weeklong camp, and some districts run separate tracks by age.",
    evidence: "2026-10-14, https://www.rotary.org/get-involved/youth-programs/rotary-youth-leadership-awards: RYLA events for participants ages 14-30; events can be a one-day seminar, three-day retreat, or weeklong camp; districts may split by age (e.g. 14-15, 16-18, 19-30).",
  },
  "ywoy": {
    blurb: "Free online creative contest for students ages 11 to 18 in middle or high school who create work about the ocean in visual art, creative writing, poetry, performing arts, interactive media, or film. International students can apply, and each entrant needs an adult sponsor.",
    evidence: "2026-10-14, https://bowseat.org/programs/ocean-awareness-contest/rules-eligibility/: Open to students ages 11-18 enrolled in middle or high school (or homeschool equivalent) worldwide; Junior Division 11-14, Senior Division 15-18; free entries submitted online; adult sponsor required; seven categories per 2026 packet; Gold $1,000 etc. awards.",
  },
  "rhsa": {
    blurb: "Summer arts programs at Walnut Hill School for the Arts in Natick, including a three-week Summer Theater Intensive for ages 13 to 17 with acting, musical theater, and dance, a Summer Voice Intensive for ages 12 to 16, and dance programs. Some programs offer day and boarding options.",
    evidence: "2026-10-14, https://www.walnuthillarts.org/summer: Summer Theater Intensive (ages 13-17), three weeks, daily acting, musical theater, dance, all students cast in a musical; Summer Voice Intensive (ages 12-16), day and boarding options; dance programs including open class series for dancers entering 9th grade and above; also brass, string quartet, fashion programs.",
  },
  "afsa-essay": {
    blurb: "Essay contest for students in grades 9 to 12 whose parents are not in the Foreign Service. First place wins $2,500, a trip to Washington, D.C., and an educational voyage with Semester at Sea, and second place wins $1,250 and a scholarship to an NSLC diplomacy program.",
    evidence: "2026-10-14, https://afsa.org/rules-and-guidelines: Grades 9-12; parents must not be in the Foreign Service; open to students in the 50 states, D.C., U.S. territories, or U.S. citizens and lawful permanent residents in high school overseas; first place $2,500 cash, trip to Washington, D.C., Semester at Sea voyage; second place $1,250 and NSLC International Diplomacy scholarship.",
  },
  "bigfuture": {
    blurb: "Students earn entries into monthly drawings for $500 and $40,000 scholarships by completing college-planning steps on BigFuture, such as building a college list and filing the FAFSA. Open to U.S. high school students with a College Board account, with no GPA, income, or test requirement.",
    grades: [11,12],
    evidence: "2026-10-14, https://bigfuture.collegeboard.org/help-center/whos-eligible-scholarships-bigfuture: 'Students in the class of 2027 and 2028 are eligible for BigFuture Scholarships. They must have a College Board account and attend public or private high school or be enrolled in a home school in the United States, Puerto Rico, or any other U.S. ...'; no citizenship, income, GPA or test requirement; steps include career list, college list, scholarship list, FAFSA, applying to two colleges; $500 and $40,000 drawings;… Field correction quote: 'Students in the class of 2027 and 2028 are eligible for BigFuture Scholarships.'",
  },
  "greeting-card-scholarship": {
    blurb: "Students at least 14 years old enrolled in high school, college, or homeschool submit original artwork or photos for the front of a greeting card. Finalists are chosen partly by public voting, and the winner receives a $10,000 scholarship and may see the design made into a real card.",
    evidence: "2026-10-14, https://www.gallerycollection.com/greeting-cards-scholarship/: 20th Annual contest; entrants at least 14 and enrolled in high school, college, university, or homeschool; also open to U.S. military members; original artwork or photos for card front; finalists decided by voting; $10,000 for best original artwork; winning design may become a Gallery Collection card.",
  },
  "ennes-scholarships": {
    blurb: "The Ennes Educational Foundation Trust Youth Scholarship is for high school seniors who plan to study broadcast engineering or a closely related technical field. The Trust expects to award five $3,000 scholarships, and recipients write a 400-500 word technical paper.",
    evidence: "2026-10-14, https://sbe.org/education/ennes-scholarships/: \"Candidates must be in their senior year of high school\"; must intend to enroll at a technical school, college or university; \"the Trust anticipates awarding five $3,000 scholarships, depending on available funds\"; recipients submit \"a technical paper of 400-500 words on a broadcast-engineering topic\".",
  },
  "american-legion-oratorical": {
    blurb: "High school students under 20 who are U.S. citizens or lawful permanent residents give a prepared oration and a speech on an assigned topic, advancing from local posts to state and national rounds. National finalists receive scholarships of $20,000 to $25,000.",
    evidence: "2026-10-14, https://www.legion.org/get-involved/youth-programs/oratorical-contest/how-to-participate: \"must be citizens of or lawful permanent residents of the United States\"; under 20 on the date of the national contest, enrolled in high school (grades 9-12 curriculum incl. home school); contestants give \"their prepared oration and the assigned topic discourse\"; national finalists $25,000 / $22,500 / $20,000; department winners in first national round get $2,000.",
  },
  "optimist-oratorical": {
    blurb: "Students under 19 who have not finished high school give a speech in contests run by local Optimist clubs and advance to district and regional rounds. District winners receive $1,000 to $2,500 scholarships, regional winners $5,000, and World Championship winners up to $15,000.",
    evidence: "2026-10-14, https://www.optimist.org/member/scholarships4.cfm: 2025-26 rules: under 19 on October 1 of the contest year and \"must not have finished secondary school or its equivalent\"; district $2,500/$1,500/$1,000; regional winner $5,000; World Championship $15,000/$10,000/$5,000; scholarships for college, university or trade school.",
  },
  "nat-geo": {
    blurb: "National Geographic Student Expeditions runs summer travel programs in the U.S. and abroad for students completing grades 9 through 12. Groups usually have 14 to 28 students, and an admissions committee reviews each application.",
    evidence: "2026-10-14, http://ngstudentexpeditions.com/resources/admission-details: \"students who are completing 9th through 12th grades are eligible to participate in our high school programs\"; \"group size generally ranges between 14 and 28 participants\"; \"Applications are carefully reviewed by our Admissions Committee\"; summer trips \"in communities around the globe and across the US\".",
  },
  "skillsusa": {
    blurb: "Career and technical education students compete in more than 100 skilled trade, technical and leadership contests, advancing from local and state events. State gold medalists compete at the national conference in Atlanta, and competitors must be paid, registered SkillsUSA members.",
    evidence: "2026-10-14, https://www.skillsusa.org/competitions/skillsusa-championships/: National competition held during NLSC in Atlanta; students compete locally, at district/regional, then state; only state gold medalists advance; 113-115 competitions; \"only students who are registered by the National March 1 deadline and are paid members are eligible to compete\".",
  },
  "tsa": {
    blurb: "Middle and high school members of the Technology Student Association compete in STEM events at state and national conferences through their school chapters. The high school lineup has about 40 events in areas such as computer science, manufacturing and STEM and the arts.",
    evidence: "2026-10-14, https://tsaweb.org/competitions: TSA is \"a national non-profit career and technical student organization (CTSO) of middle and high school students engaged in science, technology, engineering, and mathematics\"; high school guide lists 40 competitions grouped into categories such as STEM (General), STEM and the Arts, Computer Science, Manufacturing and Transportation Technology; eligibility chart sets entries per chapter or state.",
  },
  "army-rebotics": {
    blurb: "Teams of two to six students with an adult director solve orbit, satellite design and launch problems in online rounds using Systems Tool Kit software. The top ten semifinal teams go to an all-expenses-paid national final. The fee is $250 per team, less for JROTC, and waived for Title I schools.",
    cost: "Paid",
    evidence: "2026-10-14, https://www.stellarxplorers.org/dates-fees.html: \"High School & Middle School team = $250 / team JROTC unit = $125 / team ... Civil Air Patrol squadron = $125 / team ... All-Girl team = $125 / team. Fees waived for teams at Title I Schools.\"; teams of an adult director plus two to six students; online rounds on orbit planning, satellite design, launch operations; STK training, no prior experience required; top ten semifinal teams qualify for an all-expenses-paid N… Field correction quote: 'High School & Middle School team = $250 / team ... Fees waived for teams at Title I Schools.'",
  },
  "soa-shark": {
    blurb: "Teams of one to five high school students with an adult coach answer a qualifying scenario and then build an actuarial data modeling project. Students must be 13 to 19 and attend grades 9-12 in the U.S. or its territories, and top teams win college scholarships of up to $25,000.",
    grades: [9,10,11,12],
    evidence: "2026-10-14, https://www.mtfchallenge.org/rules-and-eligibility/: \"Students must be attending high school (grades 9-12) in the United States or its territories\"; ages 13 to 19 by August 1; teams of one to five students with an adult coach; \"Teams must respond to a qualifying scenario during the qualifying period\"; prizes $25,000 / $15,000 / $10,000 / $5,000 as tuition scholarships. Field correction quote: 'Students must be attending high school (grades 9-12) in the United States or its territories'",
  },
  "indigo": {
    blurb: "Indigo Research offers one-on-one virtual research programs for high school students that run 3 to 12 months on a flexible timeline. Tuition starts at $3,900, and Indigo states it does not currently offer scholarships.",
    evidence: "2026-10-14, https://www.indigoresearch.org/one-on-one-mentorship: \"flexible 3-12 month one-on-one virtual research programs\" for high school students; tuition starting at $3,900 USD; Indigo states it does not currently offer scholarships for its research programs.",
  },
  "immerse-research": {
    blurb: "Students aged 13 to 18 can take Immerse Education's online research programme. The classic version runs 10 hours, while 15-hour accredited versions are open to students 14 and older, and a US version offers college credit.",
    evidence: "2026-10-14, https://www.immerse.education/online-research-programme/: Classic programme 10 hours, ages 13-18; accredited programmes 15 hours, ages 14+; US accredited version offers college credit; group accredited option ages 14-18, max class size 10.",
  },
  "envision": {
    blurb: "Envision runs career-focused summer programs for high school students, including 7 to 10 day National Youth Leadership Forum programs in medicine, engineering, law, business and national security. Applicants need at least a 3.0 GPA, and many are nominated by educators.",
    evidence: "2026-10-14, https://www.envisionexperience.com/faqs: NYLF Medicine & Health Care, Advanced Medicine, Business Innovation, National Security, Law & CSI, Engineering, Explore STEM; run 7 to 10 days; \"minimum 3.0 GPA\"; many students nominated by educators, open enrollment welcome; tuition from about $4,499.",
  },
  "jea": {
    blurb: "JEA runs national awards and contests for high school journalists, including Journalist of the Year scholarships for seniors that begin at the state level, and the National Student Media Contests, where JEA member advisers enter students in writing, design, photo, and broadcast categories.",
    evidence: "2026-10-14, https://jea.org/awards/: Journalist of the Year: 'The contest begins at the state level. Winning portfolios from state Journalist of the Year competitions are sent to the national level'; applicants must be seniors. NSMC: 'JEA member advisers may enter their students to compete in either an online or on-site contest category at the convention.' 'Cost is $25/entry, one entry per student.' Online categories require 'an on-site critique sessio…",
  },
  "stem-saturday": {
    blurb: "Saturday Academy offers STEM and arts classes and camps for students in grades 2 to 12. Its ASE program places rising 10th, 11th, and 12th graders in summer internships designed by mentors at host organizations, and each student may do one ASE internship in high school.",
    evidence: "2026-10-14, https://www.saturdayacademy.org/ase-eligibility: ASE: 'Be a rising 10th, 11th, or 12th grader (or equivalent).' 'A student may only have one ASE internship during their high school career.' Internships designed by mentors. Classes and camps cover 'students in grades 2 - 12 in Science, Technology, Engineering, Math (STEM), and the Arts.' ASE now stands for Apprenticeships in STEAM Exploration.",
  },
  "bpl-teen-takeovers": {
    blurb: "Brooklyn Public Library interns ages 16 to 19 plan, promote, and host after-hours events for other teens, with training in event planning, budgeting, and promotion. Interns meet weekly during the school year and receive a stipend and volunteer service hours.",
    evidence: "2026-10-14, https://www.bklynlibrary.org/support/volunteer/branch-council: Paid internship; interns plan, promote, and host after-hours events for teens; training in event planning, budgeting, and promotion; stipend and volunteer service hours; applicants aged 16 to 19, available for weekly meetings October through June; parental consent for 75 hours of out-of-school service.",
  },
  "hudson-river-slp": {
    blurb: "The Science Leadership Program is a paid six-week summer research and leadership internship at Hudson River Park for female-identifying New York City high school students, with hands-on field science, mentorship, and professional development.",
    evidence: "2026-10-14, https://hudsonriverpark.org/the-park/parks-river-project/science/internship-opportunities/: 'Hudson River Park's Student Leadership Program (SLP) is a paid summer research opportunity for female-identifying high school students in New York City.' Renamed Science Leadership Program from 2023; 'six-week research and leadership internship'; 2024 cohort of 15; Pinkerton Foundation funding awarded for the 2026 SLP. Internship page: no open positions at this time.",
  },
  "ccny-stem-ra": {
    blurb: "New York City public high school 10th and 11th graders take a free spring research science course at City College, and those who finish can join a summer research internship with a CUNY or CCNY faculty member. Some summer participants receive a stipend.",
    grades: [10,11],
    evidence: "2026-10-14, https://www.ccny.cuny.edu/collegenow/stem-research-academy: 'Must be a New York City Public High School 10th or 11th-grader.' Spring course in research science, then 'opportunity to participate in a Summer Research Internship with a CUNY or CCNY faculty member.' Free; some summer participants may receive a $1,575 stipend; minimum GPA 80 and Regents scores of 75+. Field correction quote: 'Must be a New York City Public High School 10th or 11th-grader'",
  },
  "state-nebraska-yns": {
    blurb: "Young Nebraska Scientists High School Researchers do paid, part-time summer research with university scientists for up to eight weeks. Applicants must be 10th or 11th graders, Nebraska residents, and U.S. citizens or authorized to work, with a teacher recommendation. No housing is provided.",
    grades: [10,11],
    cost: "Stipend",
    evidence: "2026-10-14, https://yns.nebraska.edu/gain-hands-on-experience-in-stem/high-school-research: 'Must be 16 years old, 10th or 11th grader of the current year applying, Must be a Nebraska resident. Must be a US citizen OR have proof of employment authorization.' Paid positions; 'No residential housing options'; part-time (<40 hours per week); eight week research experiences; teacher recommendation required. Field correction quote: '10th or 11th grader of the current year applying ... Must be a Nebraska resident'",
  },
  "mountains-to-sound-greenway-trust-conservation-high-school-inter": {
    blurb: "The Greenway Trust offers paid summer conservation internships for high school students in King County, Washington, including Clean Water Ambassadors, a five-week program on water quality and environmental careers for students 16 and older.",
    evidence: "2026-10-14, https://mtsgreenway.org/get-involved/education/internships/internships/: Three paid HS internships in King County: Clean Water Ambassadors (16+, five weeks, water quality and environmental careers), YESS (five-week restoration ecology course, 1.0 CTE credit, $1,800 stipend), Burien Green Teens (two weeks, $1,200 stipend, Highline Public Schools students).",
  },
  "cla-high-school-internship-program": {
    blurb: "CLA's paid four-week summer internship places students 16 and older in CLA offices, where they shadow professionals and work on a case study and team projects in accounting, tax, wealth management, digital, and consulting. Applicants must be authorized to work in the U.S.",
    evidence: "2026-10-14, https://www.claconnect.com/en/careers/high-school-internship: Paid, four-week, in-person; Monday-Thursday; 'must be 16 or older at the start of the experience'; 'authorized to work in the United States without the need for employment-based visa'; case study, shadowing, team projects; laptop assigned.",
  },
  "port-of-seattle-high-school-internships": {
    blurb: "The Port of Seattle offers paid summer and winter internships for students at least 16 who are enrolled in high school, graduated within the past 12 months, or are in a GED program. Interns must be authorized to work in the U.S.",
    evidence: "2026-10-14, https://www.portseattle.org/programs/high-school-internships: '100 percent of our internships are paid.' 'At least 16 years of age before the beginning of the internship'; enrolled in high school, graduated within 12 months, or in GED completion; authorized to work in the U.S.; summer applications open in May, winter in November.",
  },
  "uci-chao-family-comprehensive-cancer-center-high-school-student": {
    blurb: "UCI's Cancer Research Institute runs a six-week Summer Youth Science Fellowship in which Orange County high school juniors and seniors do mentored research in UCI cancer labs about 30 hours a week and present at a closing poster symposium.",
    evidence: "2026-10-14, https://cancerresearch.uci.edu/education-and-training/high-school-students/summer-youth-science-fellowship-program/: YSFP: 'six-week summer program'; fellows placed in UCI cancer research labs, ~30 hours/week Mon-Fri; ends with 'scientific poster symposium'; eligibility: juniors or seniors at an Orange County school, chemistry and biology completed, unweighted GPA >= 3.0, not enrolled in other summer programs; ~150 applicants, ~20 accepted. Separate CRI Certificate Program (grades 8-12) of in-person talks.",
  },
  "tag-education-collaborative-high-school-summer-internship-progra": {
    blurb: "Eight-week summer STEM internship in which Georgia high school students are matched with host companies to work on team projects. Open to rising juniors and seniors who are at least 17 and eligible to work in the U.S.; some placements are paid and some are unpaid.",
    evidence: "2026-10-14, https://tagedonline.org/high-school-summer-internship-program/: 2027 page: for 'rising juniors and seniors' at least 17 by June 1; 'must be eligible to work in the U.S.'; 'eight consecutive weeks'; 'matched with host companies based on their interests and qualifications, working collaboratively on projects with clear goals'; 'paid and unpaid internship opportunities'; apply via job board account, TAG-Ed interview, then host company interview.",
  },
  "biobus-junior-scientist-internship": {
    blurb: "Paid hourly internship where New York City high school students get mentorship from research scientists, build their own research projects, and co-teach BioBus science programs for younger students. Students in grades 9 to 11 who live or attend school in NYC can apply.",
    evidence: "2026-10-14, https://www.biobus.org/internship/highschool/: 'students currently in grades 9-11 are eligible to apply'; must 'live or attend school in New York City'; interns get mentorship from research scientists, build independent projects, co-teach programs for younger students; paid hourly ($17/hr in 2026); grades/transcripts/recommendations not required; based in Harlem and Lower East Side.",
  },
  "kaiser-permanente-kp-launch-high-school-program": {
    blurb: "Seven-week, full-time paid summer internship at Kaiser Permanente in Northern California, paying $25 per hour. Applicants must be 16 to 19, a current high school student or recent graduate, legally able to work in the U.S., and live in a Northern California Kaiser Permanente service area.",
    location: "California, USA",
    evidence: "2026-10-14, https://kplaunch.kaiserpermanente.org/high-school-program/: '$25 per hour'; seven-week summer program, full-time max 40 hours/week; age 16 to 19 by June 1; current high school student or Class of 2027 graduate, juniors and seniors get priority; must legally work in U.S.; 'permanent residence in a Northern California Kaiser Permanente service area'; dependents of KP employees not eligible. Field correction quote: 'must have a permanent residence in a Northern California Kaiser Permanente service area'",
  },
  "family-service-paid-summer-internship-program": {
    blurb: "Paid summer internship for San Antonio teens ages 14 to 17 who live in city council districts 1 to 10. Students get a day of professional development training, interview with employers at a job fair, and are matched with an employer for six to seven weeks.",
    evidence: "2026-10-14, https://family-service.org/paid-internship/: Ages 14 to 17; 'six to seven weeks long'; must live in city council districts 1-10 and attend listed school districts ('Private, Charter and Home School students' eligible); one day of professional development, job fair interviews, employer match; 'Interns who finish their hours will be provided with a stipend'. Hours conflict on site (max 20/week, 120 total vs 20-35/week).",
  },
  "ut-health-san-antonio-programs-for-high-school-students": {
    blurb: "UT Health San Antonio's Office of Recruitment and Science Outreach lists programs for high school students, including BEAT Academy, an in-person biomedical and health-career program on campus, and a full-time summer research mentorship for Northside ISD students.",
    evidence: "2026-10-14, https://outreach.uthscsa.edu/programs/high-school/: BEAT Academy: biomedical and health-career program, in person at UT Health Lozano Long Campus (summer 2026 filled). Northside ISD Summer Research Mentorship: 'free to students who are accepted', Mon-Fri 8-5, June to August. Greehey CCRI summer program paused in 2025. Visiting Student Program for high schoolers over 16.",
  },
  "natural-areas-conservancy-student-urban-nature-sun-internship": {
    blurb: "Paid summer urban ecology internship in Forest Park, Queens and the Staten Island Greenbelt. Interns learn plant and animal identification and forest and wetland ecology, collect data, and design their own research project. Open to rising juniors and seniors from Queens or Staten Island who are 16.",
    grades: [11,12],
    evidence: "2026-10-14, https://naturalareasnyc.org/high-school-internship/: Paid urban ecology program 'for rising juniors and seniors'; Forest Park, Queens and the Greenbelt on Staten Island; flora/fauna identification, forest and wetland ecology, data collection, own research project on forest health; $16.50/hour in 2026; four field days a week plus remote assignment; must attend high school in or live in Queens or Staten Island; 16 by July 1. Field correction quote: 'rising juniors and seniors'",
  },
  "lawrence-hall-of-science-teen-internship-program": {
    blurb: "Summer internship at UC Berkeley's Lawrence Hall of Science for teens entering 11th or 12th grade. Interns complete workshop trainings before summer, then work a full-time weekday summer placement, with a $3,500 stipend for full participation.",
    grades: [11,12],
    evidence: "2026-10-14, https://lawrencehallofscience.org/teen-internship-programs/teen-internship-2026/: For teens 'currently entering 11th or 12th grade' available for full-time summer internships; two parts: 'Workshop Trainings' before summer and the 'Summer Placement'; stipend '$3,500 for full participation' with $72 deduction per missed day; shifts Monday through Friday. Field correction quote: 'currently entering 11th or 12th grade'",
  },
  "quantum-systems-accelerator-qcamp-quantum-computing-summer-progr": {
    blurb: "Free summer day camp on quantum computing, math and physics run by the Quantum Systems Accelerator, held at Berkeley Lab and the University of New Mexico in Albuquerque. Students must be 16 by the start of camp and need only basic algebra; stipends are available.",
    cost: "Stipend",
    evidence: "2026-10-14, https://quantumsystemsaccelerator.org/ecosystem/qcamp/: 'QCaMP is free, and stipends are available for students'; in person 'In Albuquerque: UNM PAIS Building, California: On site at LBNL'; 'day camp'; applicants must live near Berkeley, CA or Albuquerque, NM; students must be 16 by start of camp; 'The only prerequisites for this camp are introductory algebra and an interest in learning more'; students cannot attend more than once; taught by researchers from Sandia, Berk… Field correction quote: 'QCaMP is free, and stipends are available for students'",
  },
  "ut-southwestern-medical-center-stars-summer-research-program": {
    blurb: "Eight-week, non-residential summer program at UT Southwestern in Dallas where high school juniors do research in a faculty host's lab and present their results. Applicants must be at least 16 and have no prior research experience. The program is free and pays a stipend.",
    evidence: "2026-10-14, https://www.utsouthwestern.edu/education/programs/stars/programs/summer-research-opportunities.html: \"Applicants must be at least 16 years old by June 1 ... be currently classified as a junior, and be enrolled in high school\"; \"students with prior research experience are not eligible\"; eight-week non-residential program working with a faculty host in a research lab; stipend provided; present research at end of summer; STARS programs free of charge; open to U.S. citizens/nationals or those eligible to work in the U.…",
  },
  "children-s-hospital-colorado-child-health-research-internship": {
    blurb: "Nine-week research internship with University of Colorado School of Medicine pediatrics mentors, open to Colorado high school seniors who are 18 by the start date, as well as college and medical students. Interns present their work at the end and receive a $4,400 stipend for travel and housing.",
    grades: [12],
    evidence: "2026-10-14, https://www.childrenscolorado.org/research-innovation/training-and-internships/: \"Students must be a high school senior over the age of 18, an undergraduate student, graduate student, or a student completing the first year of medical school.\" \"High school students must be Colorado residents.\" \"Students who are under the age of 18 before the internship starts on June 1 will not be eligible.\" Nine-week internship; \"Each intern will be provided a stipend of $4,400 to assist with travel and housing… Field correction quote: 'Students must be a high school senior over the age of 18, an undergraduate student, graduate student, or a student completing the first year of medical school.'",
  },
  // 2026-10-15 wording: these blurbs announced an opening date that has now passed. The dates live in
  // the deadline and opensAt fields, so the sentence is dropped rather than re-dated. No new facts.
  "university-of-wyoming-summer-high-school-institute": {
    blurb: "Three-week residential institute at the University of Wyoming for the state's high school sophomores, built around ungraded seminar classes. All parts of the application, including a transcript uploaded by the school counselor, are due by the deadline.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  "u-s-department-of-energy-national-science-bowl": {
    blurb: "The Department of Energy's national academic competition in maths and the sciences. Teams of four students plus an alternate and a teacher coach compete at one of about 65 high school regionals from January, and regional winners go to the National Finals in Washington.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  "art-of-problem-solving-initiative-usa-mathematical-talent-search": {
    blurb: "Free proof-based math contest for U.S. middle and high school students, with three rounds of problems solved at home over several weeks and written feedback on every solution.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  "naclo-north-american-computational-linguistics-open-competition": {
    blurb: "Linguistics puzzle contest for middle and high schoolers, taken at school and university sites across North America. Top scorers in the Open Round advance to an Invitational Round that picks the US team for the International Linguistics Olympiad.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  "san-diego-museum-of-art-teen-council": {
    blurb: "School-year museum teen council at the San Diego Museum of Art with monthly Zoom meetings, in-person events and work on the museum's youth art exhibition. Space is limited to 12 teens.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  "north-carolina-health-careers-access-program-health-careers-day": {
    blurb: "One-day event at UNC for North Carolina high school students interested in health sciences, with a $50 registration fee.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  "cal-grant": {
    blurb: "California's main state grant for college, which does not have to be repaid. Seniors qualify by filing the FAFSA or California Dream Act Application (CADAA) by the March 2 priority deadline.",
    wordingOnly: true,
    evidence: "2026-10-15: removed a dated sentence that had gone stale; the date stays in the listing's deadline/opensAt fields.",
  },
  // 2026-10-17 wording: stale or wrong statements removed (an old competition year, a cycle that has since been
  // announced, a program length the official page contradicts). No new facts.
  "csv-sch-elks-national-foundation-scholarship": {
    blurb: "The Elks National Foundation awards 500 four-year college scholarships each year to the highest-rated applicants in its Most Valuable Student competition.",
    wordingOnly: true,
    evidence: "2026-10-17: removed a statement the official page no longer supports.",
  },
  "fisher-house-foundation-scholarships-for-military-children": {
    blurb: "College scholarship program for children of active-duty, reserve, retired and deceased U.S. service members, awarded through military commissaries.",
    wordingOnly: true,
    evidence: "2026-10-17: removed a statement the official page no longer supports.",
  },
  "state-delaware-edge": {
    blurb: "College-credit summer program for rising juniors and seniors at the University of Delaware.",
    wordingOnly: true,
    evidence: "2026-10-17: removed a statement the official page no longer supports.",
  },
  // 2026-10-22 wording: the blurb said the deadline was still TBA while the listing shows the posted date.
  "regeneron-sts": {
    blurb: "Oldest US science research competition for high school seniors, who enter with an original research project they have carried out.",
    wordingOnly: true,
    evidence: "2026-10-22: removed 'the exact fall deadline still TBA'; the deadline field already carries the posted date.",
  },
};

export function applyDescriptionCheckOct2026(list: Opportunity[]): void {
  for (const opportunity of list) {
    const row = descriptionCheckOct2026[opportunity.id];
    if (!row) continue;
    if (row.blurb) opportunity.blurb = row.blurb;
    if (row.grades) opportunity.grades = row.grades;
    if (row.cost) opportunity.cost = row.cost;
    if (row.format) opportunity.format = row.format;
    if (row.location) opportunity.location = row.location;
  }
}
