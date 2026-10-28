import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { GuideProgramName } from "@/components/GuideProgramName";
import SEO from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/pageMeta";

const PROGRAMS = [
  {
    name: "U.S. Department of Justice Student Volunteer Program",
    host: "DOJ offices nationwide (U.S. Attorney's Offices, litigating divisions)",
    format: "Unpaid volunteer legal internship, summer and school-year terms",
    cost: "Free (unpaid)",
    eligibility:
      "Primarily college and law students; a limited number of U.S. Attorney's Offices accept high school volunteers with local approval",
    deadline: "Summer applications typically close in the winter (December–February)",
    bestFor: "Students who want federal courthouse exposure and are willing to contact a local office directly",
    officialUrl: "https://www.justice.gov/legal-careers/student-volunteer-opportunities",
  },
  {
    name: "Legal Outreach Summer Law Institute",
    host: "Legal Outreach, New York NY",
    format: "Multi-week summer institute plus school-year programming",
    cost: "Free",
    eligibility: "NYC public school students entering 9th grade (multi-year pipeline program)",
    deadline: "Applications generally open in winter and close in spring",
    bestFor: "NYC students who want a long-term, structured pre-law pipeline with mock trial",
    officialUrl: "https://legaloutreach.org/",
  },
  {
    name: "American Bar Association Judicial Intern Opportunity Program & local bar pipelines",
    host: "State and metro bar associations across the U.S.",
    format: "Chambers or bar-office internships and pre-law academies",
    cost: "Free; some offer stipends",
    eligibility:
      "JIOP itself is law-student only, but most state and county bar associations run separate high school pipeline or diversity academies",
    deadline: "Rolling by jurisdiction; most spring deadlines",
    bestFor: "Students who want a judge-shadowing or courthouse placement close to home",
    officialUrl: "https://www.americanbar.org/",
  },
  {
    name: "Georgetown Hoya Summer Law Academy / university pre-law institutes",
    host: "Georgetown University and similar campuses (Cornell, Northwestern, Stanford pre-law tracks)",
    format: "1–3 week residential or online academies",
    cost: "$2,000–$6,000 typical; need-based aid at most hosts",
    eligibility: "Rising sophomores through rising seniors",
    deadline: "Rolling admission, most close by April–May",
    bestFor: "Students who want structured curriculum and a campus experience rather than office work",
    officialUrl: "https://summer.georgetown.edu/",
  },
];

const FAQS = [
  {
    q: "Can a high school student really get a law internship?",
    a: "Yes, but almost never through a national posting. Most high school law internships come from direct outreach to small local firms, public defender and district attorney offices, legal aid nonprofits, and county bar associations. Structured national programs exist, but they are limited and competitive.",
  },
  {
    q: "Are high school law internships paid?",
    a: "Most are unpaid or offer a small stipend. Nonprofit legal aid organizations and city youth-employment programs are the most likely to pay; private firms usually offer unpaid shadowing or administrative roles.",
  },
  {
    q: "When should I apply?",
    a: "Start outreach in January or February for a summer placement. Formal programs mostly close between February and April, and local firms fill informal spots by late spring.",
  },
  {
    q: "What do I need to apply?",
    a: "A one-page resume, a short cover email naming why that specific office, a transcript, and one teacher reference. Mock trial, debate, or student government experience is the most useful thing to highlight.",
  },
];

export default function GuideHighSchoolLawInternships() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "High School Law Internships: How to Find and Land One (2026)",
      description:
        "How U.S. high school students find law internships — national programs, local firm outreach, deadlines, and what to send.",
      author: { "@type": "Organization", name: "HSO" },
      publisher: { "@type": "Organization", name: "HSO — High School Opportunity" },
      datePublished: "2026-07-30",
      dateModified: "2026-10-28",
      mainEntityOfPage: "https://highschoolopportunity.org/guides/high-school-law-internships",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        {...STATIC_PAGE_META["/guides/high-school-law-internships"]}
        type="article"
        jsonLd={jsonLd}
      />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">HSO Guide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          High School Law Internships: How to Find and Land One
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          There is no single application portal for high school law internships. Most students who end up in a
          courthouse, a district attorney's office, or a small firm get there through a mix of two things: a
          handful of structured national and city programs, and direct outreach to local offices. This guide
          covers both, with the deadlines and the exact outreach approach that works.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">National and city programs to know</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/70 bg-card/80">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Where</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Who can apply</th>
                  <th className="px-4 py-3">Timing</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAMS.map((p) => (
                  <tr key={p.name} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 font-semibold text-ink"><GuideProgramName name={p.name} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{p.host}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.cost}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.eligibility}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Details reflect the most recent published cycle — always confirm on the official program page.
          </p>
        </section>

        <section className="mt-14 space-y-10">
          {PROGRAMS.map((p) => (
            <article key={p.name} className="rounded-2xl border border-border/70 bg-card/80 p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.host} · {p.format}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Cost</dt><dd className="mt-1 text-sm">{p.cost}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Eligibility</dt><dd className="mt-1 text-sm">{p.eligibility}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Timing</dt><dd className="mt-1 text-sm">{p.deadline}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Best for</dt><dd className="mt-1 text-sm">{p.bestFor}</dd></div>
              </dl>
              <a href={p.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-coral hover:underline">
                Visit official page →
              </a>
            </article>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">How to get a local firm internship</h2>
          <p className="mt-3 text-muted-foreground">
            Local outreach beats applications for high schoolers, because small firms have no intern pipeline and
            respond to a specific, low-effort ask. A realistic target list is 15–25 offices within driving
            distance: solo and 2–10 attorney firms, legal aid nonprofits, the public defender's office, the
            district attorney's office, and your county bar association.
          </p>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li><strong className="text-ink">Ask for something small.</strong> Request six weeks, two half-days a week, unpaid, filing and research support — not "an internship."</li>
            <li><strong className="text-ink">Name the practice area.</strong> "I'm interested in immigration law after volunteering at…" lands far better than a generic note.</li>
            <li><strong className="text-ink">Email the office manager, not the partner.</strong> They control the calendar and answer faster.</li>
            <li><strong className="text-ink">Attach one page.</strong> Resume only; offer transcript and references on request.</li>
            <li><strong className="text-ink">Follow up once, after a week.</strong> Most yeses come from the follow-up, not the first email.</li>
            <li><strong className="text-ink">Handle the paperwork.</strong> Offer to bring a parent consent form and any school work-permit form; removing friction is often what converts a maybe.</li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">Strong alternatives if no office says yes</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li><strong className="text-ink">Mock trial and Moot Court.</strong> The single most recognized pre-law activity, and it is available at most schools.</li>
            <li><strong className="text-ink">Teen court / youth court.</strong> Many counties let high schoolers serve as jurors, advocates, and clerks in real diversion cases.</li>
            <li><strong className="text-ink">Legal aid volunteering.</strong> Intake support, translation, and clinic setup are roles nonprofits genuinely need.</li>
            <li><strong className="text-ink">Policy and civics fellowships.</strong> City youth councils and state legislature page programs give the same writing and advocacy reps.</li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">Frequently asked questions</h2>
          <div className="mt-4 space-y-6">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-lg font-semibold text-ink">{f.q}</h3>
                <p className="mt-2 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-border/70 bg-cream/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Explore more on HSO</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-coral hover:underline" to="/categories/internships">All high school internships</Link></li>
            <li><Link className="text-coral hover:underline" to="/categories/summer-programs">All summer programs for high school students</Link></li>
            <li><Link className="text-coral hover:underline" to="/guides/top-business-summer-programs">Best business summer programs comparison</Link></li>
            <li><Link className="text-coral hover:underline" to="/guides/top-medical-internships">Best medical internships comparison</Link></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
