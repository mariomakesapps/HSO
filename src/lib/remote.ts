import { allOpportunities, locationState, type Opportunity } from "@/data/opportunities";

/**
 * The remote / nationwide view.
 *
 * This deliberately is NOT a seventh Category. A remote internship is still an
 * internship — reclassifying it would break the taxonomy and strip listings out
 * of the category pages that already rank. Instead this is a cross-cutting view
 * over every category, answering the question students actually search
 * ("online competitions for high school students", "remote internships for high
 * school students") and serving the students in the ~45 states the catalogue
 * covers only thinly.
 */
export function isRemoteOrNationwide(o: Opportunity): boolean {
  return o.format === "Online" || locationState(o.location) === "Nationwide";
}

export function remoteOpportunities(): Opportunity[] {
  return allOpportunities.filter(isRemoteOrNationwide);
}

export const REMOTE_PATH = "/remote";

export const REMOTE_META = {
  title: "Remote & Nationwide Opportunities for High School Students | HSO",
  h1: "Remote and nationwide opportunities for high school students",
  description:
    "Online and nationwide programs open to high schoolers in any U.S. state — remote internships, online competitions, virtual research, and national scholarships.",
  intro:
    "Programs you can do from anywhere in the United States: fully online competitions and research, plus national programs that accept students from every state.",
  guide: [
    "If you do not live near a big research university or a major metro, most 'top program' lists are not much use to you — they are dominated by placements that require you to commute to a specific campus. Remote and nationwide programs are the ones that do not care where you live.",
    "They fall into a few groups: online competitions and olympiads you enter from your own school, virtual research programs that pair you with a mentor over video, national scholarships open to any U.S. senior, and remote internships run by companies and federal agencies.",
    "Because these programs draw applicants from the whole country, they are often more competitive per place than a local option — but you can apply to several without travel costs, and many are free to enter.",
  ],
  faqs: [
    {
      q: "Are there online competitions for high school students?",
      a: "Yes — many national competitions are entered entirely online, including essay contests, math and computing olympiads, video and modelling challenges. They are open to students in any state and most are free to enter.",
    },
    {
      q: "Can high school students get remote internships?",
      a: "Some, though fewer than summer programs. Federal agencies and a number of research programs run virtual or hybrid placements, and several national organisations run remote project-based programs that function like internships.",
    },
    {
      q: "What if I do not live near a university?",
      a: "Focus on nationwide and online programs first — they are selected on your application rather than your postcode. Virtual research programs, national competitions, and national scholarships are all reachable from anywhere in the U.S.",
    },
    {
      q: "Are remote programs free?",
      a: "Many are. Most national competitions and scholarships are free to enter, and several virtual research programs charge nothing. Some paid online pre-college courses exist too, so check the cost on each listing before applying.",
    },
  ],
} as const;
