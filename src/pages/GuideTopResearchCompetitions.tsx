import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/pageMeta";

const COMPETITIONS = [
  {
    name: "Regeneron Science Talent Search (STS)",
    host: "Society for Science — national",
    format: "Independent research paper + application",
    selectivity: "Top 300 scholars, top 40 finalists from ~2,000 entries",
    prize: "$250,000 top award; $25k for each of 300 scholars",
    eligibility: "U.S. high school seniors with an original research project",
    timeline: "Applications open June; deadline mid-November",
    bestFor: "Seniors with a completed, publishable independent research project",
    officialUrl: "https://www.societyforscience.org/regeneron-sts/",
  },
  {
    name: "Regeneron International Science and Engineering Fair (ISEF)",
    host: "Society for Science — international, via affiliated fairs",
    format: "Project fair; qualify through a local/regional/state fair",
    selectivity: "~1,800 finalists worldwide; each fair sets its own bar",
    prize: "~$9M in awards; $75,000 top prize",
    eligibility: "Grades 9–12; must advance through an affiliated fair",
    timeline: "Regional fairs Jan–Mar; ISEF finals in May",
    bestFor: "Students whose school or region runs an ISEF-affiliated science fair",
    officialUrl: "https://www.societyforscience.org/isef/",
  },
  {
    name: "Junior Science and Humanities Symposium (JSHS)",
    host: "U.S. Department of Defense / regional universities",
    format: "Oral research presentation at regional then national symposium",
    selectivity: "Regional finalists advance; ~5 per region to nationals",
    prize: "Up to $12,000 in scholarships plus travel to nationals",
    eligibility: "Grades 9–12 with original STEM research",
    timeline: "Regional symposia Jan–Mar; nationals in April",
    bestFor: "Students strong at presenting research live to a scientific audience",
    officialUrl: "https://www.jshs.org/",
  },
  {
    name: "Regeneron Biotech Prize (formerly BioGENEius Challenge)",
    host: "Biotechnology Institute — national",
    format: "Biotech research project + application",
    selectivity: "Highly competitive; state/national finalists",
    prize: "$7,500 top prize plus category awards",
    eligibility: "Grades 9–12 conducting biotechnology research",
    timeline: "Applications typically due March",
    bestFor: "Students focused specifically on biotech or life-sciences research",
    officialUrl: "https://biotechinstitute.org/regeneron-biotech-prize/",
  },
  {
    name: "Davidson Fellows Scholarship",
    host: "Davidson Institute — national",
    format: "Significant work portfolio in STEM, literature, music, or philosophy",
    selectivity: "~20 fellows selected each year",
    prize: "$10,000 / $25,000 / $50,000 scholarships",
    eligibility: "U.S. students under 18 with a college-graduate level project",
    timeline: "Applications due mid-February",
    bestFor: "Students with a multi-year, portfolio-quality body of research",
    officialUrl: "https://www.davidsongifted.org/gifted-programs/fellows-scholarship/",
  },
  {
    name: "Conrad Challenge",
    host: "Conrad Foundation — international",
    format: "Team innovation & business plan competition",
    selectivity: "Multi-stage; top teams named Pete Conrad Scholars",
    prize: "Scholarships, patents support, and program funding",
    eligibility: "Ages 13–18 in teams of 2–5",
    timeline: "Activation stage in fall; finals in April",
    bestFor: "Team-oriented students combining research with entrepreneurship",
    officialUrl: "https://www.conradchallenge.org/",
  },
];

export default function GuideTopResearchCompetitions() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Research Competitions for High School Students (2026 Comparison)",
    description:
      "Side-by-side comparison of the top research competitions for high schoolers — Regeneron STS, ISEF, JSHS, Biotech Prize, Davidson Fellows, and the Conrad Challenge.",
    author: { "@type": "Organization", name: "HSO" },
    publisher: { "@type": "Organization", name: "HSO — High School Opportunity" },
    datePublished: "2026-07-22",
    dateModified: "2026-07-22",
    mainEntityOfPage: "https://highschoolopportunity.org/guides/top-research-competitions",
  };

  return (
    <div className="min-h-screen">
      <SEO
        {...STATIC_PAGE_META["/guides/top-research-competitions"]}
        type="article"
        jsonLd={jsonLd}
      />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">HSO Guide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Best Research Competitions for High School Students (2026)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          A strong research competition can transform a college application — but the top awards are
          brutally selective and each rewards a different kind of project. Here's a side-by-side look at
          the competitions high schoolers ask about most on HSO: who they're best for, what they pay,
          and when to apply.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Quick comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/70 bg-card/80">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Competition</th>
                  <th className="px-4 py-3">Host</th>
                  <th className="px-4 py-3">Selectivity</th>
                  <th className="px-4 py-3">Prize</th>
                  <th className="px-4 py-3">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITIONS.map((p) => (
                  <tr key={p.name} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 font-semibold text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.host}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.selectivity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.prize}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 space-y-10">
          {COMPETITIONS.map((p) => (
            <article key={p.name} className="rounded-2xl border border-border/70 bg-card/80 p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.host} · {p.format}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Selectivity</dt><dd className="mt-1 text-sm">{p.selectivity}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Prize</dt><dd className="mt-1 text-sm">{p.prize}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Eligibility</dt><dd className="mt-1 text-sm">{p.eligibility}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Timeline</dt><dd className="mt-1 text-sm">{p.timeline}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wide text-sage">Best for</dt><dd className="mt-1 text-sm">{p.bestFor}</dd></div>
              </dl>
              <a href={p.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-coral hover:underline">
                Visit official competition page →
              </a>
            </article>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">How to choose</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li><strong className="text-ink">Match the format to your work.</strong> A polished paper fits STS and Davidson; a hands-on project fits ISEF and Conrad; a live talk fits JSHS.</li>
            <li><strong className="text-ink">Start early.</strong> STS, Davidson, and JSHS reward projects built over 12+ months with a mentor. Don't wait until senior fall.</li>
            <li><strong className="text-ink">Use ISEF as a launchpad.</strong> Qualifying through a regional fair is the most accessible on-ramp — most other competitions accept the same project.</li>
            <li><strong className="text-ink">Apply to a portfolio.</strong> Admit rates are single digits at the top; entering 3–4 competitions with the same research maximizes returns.</li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-border/70 bg-cream/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Explore more on HSO</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-coral hover:underline" to="/categories/competitions">All academic competitions for high schoolers</Link></li>
            <li><Link className="text-coral hover:underline" to="/categories/research">All research programs for high school students</Link></li>
            <li><Link className="text-coral hover:underline" to="/guides/top-medical-internships">Guide: Best medical internships for high schoolers</Link></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}