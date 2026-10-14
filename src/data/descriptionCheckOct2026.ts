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
