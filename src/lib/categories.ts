import type { Category } from "@/data/opportunities";

export type CategorySlug =
  | "summer-programs"
  | "internships"
  | "scholarships"
  | "research"
  | "competitions"
  | "volunteer"
  | "fellowships";

export interface CategoryFAQ {
  q: string;
  a: string;
}

export const CATEGORY_META: Record<CategorySlug, {
  category: Category;
  title: string;
  h1: string;
  intro: string;
  description: string;
  guide: string[];
  faqs: CategoryFAQ[];
}> = {
  "summer-programs": {
    category: "Summer Program",
    title: "Summer Programs for High Schoolers 2026 | HSO",
    h1: "Summer programs for high school students",
    intro: "Pre-college summers at top U.S. universities, research labs, and institutes — free, paid, and stipended options for rising 9th–12th graders.",
    description: "Browse 2026 summer programs for high school students — pre-college, research, and STEM tracks at U.S. universities. Free and paid options.",
    guide: [
      "Summer programs for high school students fall into a few buckets: pre-college academic programs run by universities, research immersions in labs, arts and writing institutes, leadership and policy programs, and STEM bootcamps. Most run 2–8 weeks between June and August.",
      "Pick based on what colleges actually weigh: depth in one field beats a famous name. A free, selective research program (RSI, SSP, Clark Scholars, Garcia) signals more than a paid two-week pre-college class.",
      "Apply early. The most competitive free programs close in January or February — paid pre-college programs roll into spring. Have an essay and one teacher recommendation ready before December.",
    ],
    faqs: [
      { q: "What are the best summer programs for high school students?", a: "The most academically rigorous free programs include MIT RSI, SSP, Clark Scholars, the Garcia Program at Stony Brook, MITES, and TASP. Strong paid pre-college options include Stanford SSI, Brown Pre-College, Harvard Summer School, and Notre Dame Leadership Seminars." },
      { q: "Are summer programs for high school students free?", a: "Some are fully free and even pay a stipend (RSI, SSP, MITES, Garcia, Clark Scholars). Most university pre-college programs charge tuition between $4,000 and $14,000, though many offer need-based aid." },
      { q: "When should I apply to summer programs?", a: "Free, highly selective programs are due January–February. University pre-college programs roll January through April. Apply to your top 3–5 programs at least 6 weeks before the earliest deadline." },
      { q: "What grade can I start summer programs?", a: "A few programs accept rising 9th graders, but most target rising 10th, 11th, and 12th graders. The most competitive research programs (RSI, SSP) require rising seniors." },
    ],
  },
  internships: {
    category: "Internship",
    title: "Internships for High School Students 2026 | HSO",
    h1: "Internships for high school students",
    intro: "Real workplace internships at U.S. companies, labs, hospitals, and government agencies that accept high school students — paid, unpaid, in-person, and remote.",
    description: "Paid internships for high school students at U.S. companies, labs, and agencies. Engineering, STEM, research, and remote options curated by HSO.",
    guide: [
      "Internships for high school students come in three main forms: paid corporate internships (Bank of America, Google, NASA OSTEM), research internships at universities and hospitals, and government internships at federal, state, and city agencies.",
      "Paid is realistic — NASA, NIH, Bank of America, NSA, NYC Ladders for Leaders, and many university research programs offer stipends from $500 to $7,000 for the summer.",
      "Application timing matters. Federal and national corporate programs (NASA, NSA, NIH, BofA) close November–February. Local and state programs run later into spring. Always confirm the deadline on the program's official page.",
    ],
    faqs: [
      { q: "Can high school students get paid internships?", a: "Yes. NASA OSTEM, NIH HiSTEP, Bank of America Student Leaders, NSA Student Programs, NYC Ladders for Leaders, and many university research labs all offer paid internships for high schoolers — stipends typically range from $500 to $7,000 for the summer." },
      { q: "Are there engineering internships for high school students?", a: "Yes. Northrop Grumman, NASA, Sandia, NIST SHIP, MIT Lincoln Lab, and many university engineering departments run internships specifically for rising 11th and 12th graders." },
      { q: "How do I find research internships in high school?", a: "Look at university summer research programs (Simons at Stony Brook, SIMR at Stanford, JHU Internship in Brain Sciences, Fred Hutch SHIP), NIH HiSTEP, and direct outreach to local university labs in fields you care about." },
      { q: "When should I apply for a high school internship?", a: "Most national programs close December–February for that summer. Start researching in October, draft your essay and resume by November, and submit by early February." },
    ],
  },
  scholarships: {
    category: "Scholarship",
    title: "Scholarships for High School Students 2026 | Merit, Need & National | HSO",
    h1: "Scholarships for high school students",
    intro: "Merit, need-based, and identity-focused scholarships open to U.S. high school students — apply before or during senior year.",
    description: "Browse scholarships for high school students in the U.S. — merit, need-based, identity-focused, and full-ride national awards. Curated, deadline-tracked listings from HSO.",
    guide: [
      "High school scholarships fall into four buckets: full-ride national awards (Coca-Cola, QuestBridge, Dell, Gates), large national merit programs (National Merit, Jack Kent Cooke), identity- and community-focused awards, and smaller local/regional scholarships from civic groups.",
      "Smaller scholarships are easier to win because fewer students apply. A few $1,000 awards add up faster than chasing one $40,000 prize you have a 0.5% chance at.",
      "Most senior-year scholarships close October–March of senior year. A few junior-year awards (Coca-Cola, QuestBridge, Dell) open the summer before senior year.",
    ],
    faqs: [
      { q: "What scholarships can high school students apply for?", a: "Seniors can apply to national programs like Coca-Cola Scholars, QuestBridge National College Match, Gates Scholarship, Dell Scholars, and Jack Kent Cooke College Scholarship, plus hundreds of state-level and identity-focused awards." },
      { q: "Can high school juniors apply for scholarships?", a: "Yes. Coca-Cola Scholars opens August of senior year, QuestBridge College Prep Scholars is for juniors, and many essay contests and STEM competitions for juniors come with scholarship prizes." },
      { q: "When should I start applying for scholarships?", a: "Start the summer before senior year. Most national scholarships close October–February of senior year. Build a base essay you can adapt to multiple applications." },
      { q: "Are there scholarships for freshmen and sophomores?", a: "Fewer, but yes — essay contests, STEM competitions, and a handful of program-tied awards accept underclassmen. Most direct scholarship awards target juniors and seniors." },
    ],
  },
  research: {
    category: "Research",
    title: "Research Programs for High School Students 2026 | STEM & Lab | HSO",
    h1: "Research programs for high school students",
    intro: "Mentored research with U.S. professors and labs across STEM, humanities, and social sciences — for serious 10th, 11th, and 12th graders.",
    description: "Discover research programs for high school students in the U.S. — mentored lab work in STEM, biomedical, computer science, and social sciences. Free and paid options.",
    guide: [
      "Research programs for high school students come in three forms: structured summer programs (RSI, SSP, Garcia, SIMR, Clark Scholars), university-run lab placements (Simons at Stony Brook, Pioneer Academics, Lumiere), and direct outreach to a local professor.",
      "Structured programs are the most selective but the most prestigious. Direct outreach is harder but more flexible — emailing 20 professors in your field with a clear, specific question often works.",
      "For competitive STEM colleges and Regeneron/ISEF, a real research project under a mentor signals more than a paid summer class.",
    ],
    faqs: [
      { q: "What are the best research programs for high school students?", a: "The most selective free U.S. programs include MIT RSI, SSP (Summer Science Program), Clark Scholars at Texas Tech, the Garcia Program at Stony Brook, SIMR at Stanford, and the Simons Summer Research Program. All require rising seniors and pay a stipend." },
      { q: "How does a high schooler get into a research lab?", a: "Apply to structured summer research programs, look for university outreach programs in your area, or email 15–25 professors at nearby universities with a specific research interest and what you can contribute. Local outreach has a higher hit rate than you'd think." },
      { q: "Are research programs for high school students paid?", a: "Most top free programs (RSI, SSP, Clark, Garcia, SIMR, Simons) pay a stipend covering travel and incidentals. Paid programs like Pioneer Academics and Lumiere charge tuition." },
      { q: "What grade should I start research?", a: "Most structured programs require rising 11th or 12th graders. Underclassmen can start with local lab outreach, online research mentorship (Polygence, Lumiere), or science fair projects." },
    ],
  },
  competitions: {
    category: "Competition",
    title: "Academic Competitions for High School Students 2026 | STEM, Writing & Business | HSO",
    h1: "Academic competitions for high school students",
    intro: "Olympiads, science fairs, writing contests, business case competitions, and entrepreneurship challenges open to U.S. high school students.",
    description: "Find academic competitions for high school students — STEM olympiads, science fairs, writing contests, finance competitions, and entrepreneurship challenges in the U.S.",
    guide: [
      "High school competitions break down by field: math (AMC, AIME, USAMO, HMMT), science (Regeneron STS, ISEF, USABO, USACO, Chemistry Olympiad), writing (Scholastic, NYT contests, Concord Review), business and finance (DECA, Wharton Investment, Diamond Challenge), and policy/debate (NSDA, We the People).",
      "Pick competitions that compound with your work. A research project naturally feeds into Regeneron STS, ISEF, and Davidson. A startup idea fits Diamond Challenge, Conrad, and Wharton Innovation.",
      "Most national competitions have fall–winter qualifying rounds. Register early — many require teacher sponsors or school registration.",
    ],
    faqs: [
      { q: "What are the best academic competitions for high school students?", a: "The most prestigious include Regeneron Science Talent Search, ISEF, USAMO, USACO Platinum, USABO, the Concord Review, and Davidson Fellows. Strong tier-2 options include DECA ICDC, Wharton Global Investment Competition, NSDA Nationals, and the Diamond Challenge." },
      { q: "Are there finance competitions for high school students?", a: "Yes — Wharton Global High School Investment Competition, Knowledge@Wharton, KWHS Comment Competition, the Quantitative Investing Challenge, and DECA finance events are all open to U.S. high schoolers." },
      { q: "How do I qualify for math olympiads?", a: "Start with AMC 10 or AMC 12 (typically taken in November). Top scorers qualify for AIME, then USAMO/USAJMO, then MOP. Most students take AMC for the first time in 9th or 10th grade." },
      { q: "Can freshmen enter high school competitions?", a: "Yes, most national competitions accept all four grades. AMC, USACO, Scholastic Writing, and many STEM olympiads have no grade restriction." },
    ],
  },
  volunteer: {
    category: "Volunteer",
    title: "Volunteer Opportunities for High School Students | Community & Service | HSO",
    h1: "Volunteer opportunities for high school students",
    intro: "Service, conservation, hospital, and community volunteering programs across the United States — for high school students earning service hours and building real impact.",
    description: "Find volunteer opportunities for high school students in the U.S. — community, hospital, conservation, tutoring, and civic service programs that accept high schoolers.",
    guide: [
      "Volunteer opportunities for high schoolers fall into community service (food banks, shelters, tutoring), structured programs (Key Club, NHS service projects, AmeriCorps youth), hospital programs (most major hospitals have teen volunteer tracks), and conservation work (National Park Service, state parks, environmental nonprofits).",
      "Depth beats breadth. Colleges read sustained 100+ hours at one organization as commitment; 10 hours at ten different places reads as resume-stuffing.",
      "Many programs require an in-person application, parental consent, and a multi-week training. Apply at least a month before you want to start.",
    ],
    faqs: [
      { q: "Where can high school students volunteer?", a: "Local food banks, animal shelters, hospitals (teen volunteer tracks), tutoring programs, libraries, museums, religious organizations, state and national parks, and AmeriCorps-affiliated nonprofits all regularly accept high school volunteers." },
      { q: "How many volunteer hours do high schoolers need?", a: "Most service-honor programs (NHS, presidential service award) target 50–250 hours. Selective colleges respond more to sustained commitment than total hours — 200+ hours at one organization over 2 years signals more than 500 hours scattered." },
      { q: "Can high school students volunteer at hospitals?", a: "Yes. Most major U.S. hospitals run teen volunteer programs for high schoolers aged 14–18 — typically 4-hour shifts in patient transport, gift shops, or administrative help. Apply in spring for summer placement." },
      { q: "Are there paid volunteer opportunities?", a: "AmeriCorps programs offer stipends or education awards. Most other volunteer roles are unpaid, but many community programs cover transit and meals." },
    ],
  },
  fellowships: {
    category: "Fellowship",
    title: "Fellowships for High School Students 2026 | Leadership & Research | HSO",
    h1: "Fellowships for high school students",
    intro: "Selective long-term U.S. fellowships combining mentorship, research, leadership, and stipends — for ambitious 10th, 11th, and 12th graders.",
    description: "Find fellowships for high school students in the U.S. — selective programs offering mentorship, research, leadership development, and stipends for high schoolers.",
    guide: [
      "Fellowships go deeper than internships or summer programs. They usually combine year-round mentorship, a project, and either a stipend or college support. Examples: Coca-Cola Scholars, Knight-Hennessy, Bezos Scholars, Davidson Fellows, Telluride Association Summer Seminar.",
      "Most fellowships are competitive and require a clear story — what you've done, what you want to do, and why you. Generic applications don't survive the first round.",
      "Application timing varies. Year-long fellowships often open in late summer or fall. Summer-based fellowships close December–February.",
    ],
    faqs: [
      { q: "What is a fellowship for high school students?", a: "A fellowship is a selective program that combines mentorship, project work, and often a stipend or college funding — usually deeper and longer than a typical internship or summer program. Examples include Bezos Scholars, Davidson Fellows, and Telluride Association Summer Seminar." },
      { q: "How are fellowships different from internships?", a: "Internships are short-term work placements. Fellowships are longer mentored programs with a project, networking community, and frequently a stipend or scholarship attached." },
      { q: "Are high school fellowships paid?", a: "Most major U.S. fellowships either pay a stipend, cover all program costs, or offer scholarship money — Davidson Fellows ($10K–$50K), Bezos Scholars (full ride to program), Coca-Cola Scholars ($20K)." },
      { q: "How selective are fellowships?", a: "Very. Top fellowships accept under 5% of applicants. Apply if you have a clear, sustained interest in a field — a record of related work matters more than perfect grades alone." },
    ],
  },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_META) as CategorySlug[];

export function slugForCategory(c: Category): CategorySlug | undefined {
  return CATEGORY_SLUGS.find((s) => CATEGORY_META[s].category === c);
}