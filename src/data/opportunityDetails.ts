/**
 * Long-form detail for the listings that already rank.
 *
 * Opportunity pages are thin because the catalogue stores one short blurb per
 * program — three words for the NYT podcast contest, eight for Horizon. A
 * blurb that short has to stay short: it is also the card text on every listing
 * grid. So the longer copy lives here instead, keyed by id, and only the detail
 * page and the prerenderer render it.
 *
 * EVERY FACT BELOW IS QUOTED FROM THE PROGRAMME'S OWN PAGE, on the date in
 * `source.checked`. Nothing here is inferred, rounded, or carried over from a
 * previous cycle. If a page did not state something — a cost, a grade range, an
 * acceptance rate — it is simply absent rather than guessed at.
 */
export interface OpportunityDetail {
  /** Paragraphs of description. */
  body: string[];
  eligibility?: string;
  cost?: string;
  howToApply?: string[];
  faqs?: { q: string; a: string }[];
  source: { url: string; checked: string };
}

export const OPPORTUNITY_DETAILS: Record<string, OpportunityDetail> = {
  "ccc-youthaction-nyc": {
    body: [
      "A year-long civic engagement program run by Citizens' Committee for Children of New York, split into two semesters of work.",
      "The first semester runs October to December and teaches the steps of effective advocacy, how to conduct and analyse research, and leadership skills. Participants meet weekly in person, identify the issues facing young New Yorkers and work up possible solutions.",
      "The second semester runs January to May and puts that to use: campaigning and rallying on the issues the group picked, including meetings with council members and legislators.",
    ],
    eligibility: "Young New York City residents. Participants have come from all five boroughs.",
    cost: "Free to take part, and CCC pays participants $400 a semester.",
    faqs: [
      {
        q: "Does the YouthAction NYC internship pay?",
        a: "Yes. CCC's page states it is paying participants $400 a semester to take part in the internship program.",
      },
      {
        q: "How long is the program?",
        a: "A full year, split into two semesters: October to December, then January to May.",
      },
    ],
    source: { url: "https://cccnewyork.org/youthaction-nyc-internship/", checked: "2026-09-23" },
  },

  "delamed-dpha-fall": {
    body: [
      "An internship with the Delaware Academy of Medicine and Public Health, which works with students across health sciences, anthropology, business, law, health care economics, media and communication to show them the role public health plays in Delaware communities.",
      "The Academy runs three cohorts a year: Spring (January to April), Summer (May to August) and Autumn (September to December).",
      "The high school internship is entirely virtual, and the Academy schedules it around a student's other commitments.",
    ],
    howToApply: [
      "Spring 2027 applications open on 1 November 2026.",
      "Summer 2027 applications open on 1 March 2027.",
      "The Autumn 2026 application period has closed.",
      "Questions go to the internship program coordinator at ksmith@delamed.org.",
    ],
    faqs: [
      {
        q: "Is the Delaware Academy of Medicine internship in person?",
        a: "No. The Academy's page states the high school internship program is entirely virtual and is scheduled around the student's other commitments.",
      },
      {
        q: "When can I apply?",
        a: "Three cohorts a year. Spring 2027 opens 1 November 2026 and Summer 2027 opens 1 March 2027.",
      },
    ],
    source: { url: "https://delamed.org/programs/student-internship/", checked: "2026-09-23" },
  },

  "national-wwii-writing-contest": {
    body: [
      "The National WWII Museum's annual Student Writing Contest asks students across the country to respond to a prompt drawn from a WWII topic or theme.",
      "The 2026–27 prompt is \"Drawn to Combat: Bill Mauldin & the Art of War\", built around the Museum's special exhibit of the same name, on display through 18 April 2027.",
      "Bill Mauldin was an American cartoonist and a sergeant in the 45th Infantry Division press corps. His characters Willie and Joe depicted the hardship, humour and reality of life for infantrymen on the front line, and later reached troops worldwide through Stars and Stripes.",
    ],
    faqs: [
      {
        q: "What is the 2026-27 writing contest topic?",
        a: "Drawn to Combat: Bill Mauldin & the Art of War, tied to the Museum's special exhibit running through 18 April 2027.",
      },
    ],
    source: {
      url: "https://www.nationalww2museum.org/students-teachers/school-programs/student-writing-contest",
      checked: "2026-09-23",
    },
  },

  "regeneron-sts": {
    body: [
      "The Regeneron Science Talent Search is the oldest science and mathematics competition for high school seniors in the United States, and the one that focuses on original research rather than an exam.",
      "Around 2,600 students enter each year, submitting original research in a scientific field together with a full application that is read holistically.",
      "$3.1 million in awards is distributed annually. The first place prize is $250,000. Of the entrants, 300 are named Scholars and 40 go through to the finals in Washington, D.C.",
    ],
    howToApply: [
      "The 2027 application is open now.",
      "The deadline is 5 November 2026 at 8pm ET.",
    ],
    faqs: [
      {
        q: "How much can you win in the Regeneron Science Talent Search?",
        a: "$3.1 million is distributed annually, with a first place prize of $250,000.",
      },
      {
        q: "How many students enter?",
        a: "Around 2,600 a year. 300 are named Scholars and 40 become finalists.",
      },
    ],
    source: { url: "https://www.societyforscience.org/regeneron-sts/", checked: "2026-09-23" },
  },

  "blue-ocean-entrepreneurship": {
    body: [
      "A virtual pitch competition for high school students, in which thousands of entrants each year pitch an original business concept to experienced entrepreneurs and businesspeople.",
      "Entrants identify a pressing problem or an untapped market space, then submit a pitch. Competitors receive feedback on their idea and compete for thousands of dollars in cash prizes.",
      "Because it is judged entirely virtually, there is no travel and no venue cost.",
    ],
    eligibility: "High school-aged entrepreneurs. You may enter alone or in a team of up to five.",
    howToApply: [
      "Register solo, or team up with as many as four other people.",
      "Submit the pitch by 21 February 2027.",
    ],
    faqs: [
      {
        q: "Can you enter Blue Ocean as a team?",
        a: "Yes. You can register on your own or team up with up to four others.",
      },
      { q: "Is it in person?", a: "No — it is judged virtually, so entrants compete from anywhere." },
    ],
    source: { url: "https://blueoceancompetition.org/", checked: "2026-09-23" },
  },

  horizon: {
    body: [
      "A one-to-one research program, founded in 2016 by Columbia researchers, that pairs a student with a scholar for an original project.",
      "There are two tracks. Professor Seminar Courses put you in a small group led by a professor from a top university. The 1-1 PhD Labs pair you directly with a PhD or post-doctoral researcher.",
      "Subjects on offer range across AI and machine learning, behavioural economics, computational neuroscience, cybersecurity, gene editing and CRISPR, international relations, protein biophysics, political theory and theoretical mathematics.",
    ],
    eligibility:
      "Selective: of 6,539 applications, 26% were admitted. Admitted students had an average GPA of 3.93 and a median SAT of 1500.",
    howToApply: ["The Winter Cohort deadline is 22 November 2026."],
    faqs: [
      {
        q: "How selective is Horizon?",
        a: "Horizon reports 6,539 total applications with a 26% acceptance rate, an average admitted GPA of 3.93 and a median admitted SAT of 1500.",
      },
      {
        q: "What is the difference between the two Horizon tracks?",
        a: "Professor Seminar Courses are small groups led by a university professor. The 1-1 PhD Labs pair you individually with a PhD or post-doc researcher.",
      },
    ],
    source: { url: "https://horizoninspires.com/", checked: "2026-09-23" },
  },
};

export function detailFor(id: string): OpportunityDetail | undefined {
  return OPPORTUNITY_DETAILS[id];
}
