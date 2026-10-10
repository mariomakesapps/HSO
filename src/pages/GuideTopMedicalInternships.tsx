import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { STATIC_PAGE_META, guideCrumbs } from "@/lib/pageMeta";

const PROGRAMS = [
  {
    name: "Johns Hopkins Internship in Brain Sciences (JHIBS)",
    host: "Johns Hopkins University, Baltimore MD",
    format: "In-person, 8 weeks",
    selectivity: "Very high — small cohort (~15), Baltimore-area juniors/seniors",
    stipend: "Paid stipend (~$3,000)",
    eligibility: "Baltimore City / nearby MD public high school juniors & seniors, 16+",
    timeline: "Applications open late fall; deadline typically mid-February; program runs June–August",
    bestFor: "Local Baltimore students set on neuroscience / brain research",
    officialUrl: "https://neuroscience.jhu.edu/research/jhibs/",
  },
  {
    name: "Stanford Institutes of Medicine Summer Research Program (SIMR)",
    host: "Stanford University School of Medicine, CA",
    format: "In-person, 8 weeks",
    selectivity: "Extremely selective (~<3% acceptance, ~50 students from thousands)",
    stipend: "Minimum $500 stipend; need-based supplements available",
    eligibility: "U.S. juniors & seniors, 16+ by program start",
    timeline: "Applications open December; deadline late February; program runs June–August",
    bestFor: "Nationally competitive students pursuing biomedical or clinical research",
    officialUrl: "https://simr.stanford.edu/",
    /** The same program's HSO listing (deadline, eligibility, cost). */
    hsoId: "simr",
  },
  {
    name: "NIH High School Scientific Training and Enrichment Program (HiSTEP)",
    host: "National Institutes of Health, Bethesda MD",
    format: "In-person, ~5 weeks",
    selectivity: "Very selective; prioritizes students from backgrounds underrepresented in biomedical research",
    stipend: "Paid stipend",
    eligibility: "Rising seniors from the DC/MD/VA area attending Title I or partner schools",
    timeline: "Applications open winter; deadline typically February; program runs July–August",
    bestFor: "DMV-area students exploring biomedical careers who need structured mentorship",
    officialUrl: "https://www.training.nih.gov/programs/hs-sip",
  },
  {
    name: "NIH Summer Internship Program (HS-SIP)",
    host: "National Institutes of Health, Bethesda MD (and satellite campuses)",
    format: "In-person, 8+ weeks",
    selectivity: "Highly selective, national applicant pool",
    stipend: "Paid monthly stipend (~$2,150+/month)",
    eligibility: "U.S. citizens/permanent residents, 17+ by June 15, enrolled in high school",
    timeline: "Applications open mid-November; deadline February 1; program runs May–August",
    bestFor: "Independent students ready for a full lab-embedded biomedical research experience",
    officialUrl: "https://www.training.nih.gov/programs/sip",
    /** The same program's HSO listing (deadline, eligibility, cost). */
    hsoId: "nih-summer",
  },
  {
    name: "Rockefeller University Summer Science Research Program (SSRP)",
    host: "Rockefeller University, New York NY",
    format: "In-person, 7 weeks",
    selectivity: "Extremely selective (~20 students)",
    stipend: "Paid stipend (~$1,500)",
    eligibility: "NYC-area high school students, 16+",
    timeline: "Applications open January; deadline March; program runs late June–August",
    bestFor: "NYC students seeking a mentored biomedical lab project",
    officialUrl: "https://www.rockefeller.edu/outreach/ssrp/",
    /** The same program's HSO listing (deadline, eligibility, cost). */
    hsoId: "rockefeller-ssrp",
  },
  {
    name: "MIT Research Science Institute (RSI)",
    host: "MIT, Cambridge MA (Center for Excellence in Education)",
    format: "In-person, 6 weeks",
    selectivity: "Widely considered the most selective STEM summer program (~80 students worldwide, <5% admit)",
    stipend: "Fully funded — no cost, travel/housing/meals included",
    eligibility: "Rising seniors with exceptional PSAT/SAT scores and research background",
    timeline: "Applications due mid-January; program runs late June–early August",
    bestFor: "Top-tier students who want cross-disciplinary research including biomedical tracks",
    officialUrl: "https://www.cee.org/programs/research-science-institute",
    /** The same program's HSO listing (deadline, eligibility, cost). */
    hsoId: "rsi",
  },
];

export default function GuideTopMedicalInternships() {
  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/guides/top-medical-internships"]} type="article" />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <Breadcrumbs crumbs={guideCrumbs("/guides/top-medical-internships")} className="mb-6" />
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">HSO Guide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Best Medical Internships for High School Students (2026)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Every year thousands of high schoolers apply to a handful of highly competitive biomedical research
          internships. Below is a side-by-side comparison of the programs students ask about most on HSO —
          who they're best for, how selective they are, whether they pay, and when applications open.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Quick comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/70 bg-card/80">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Selectivity</th>
                  <th className="px-4 py-3">Stipend</th>
                  <th className="px-4 py-3">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAMS.map((p) => (
                  <tr key={p.name} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 font-semibold text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.host}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.selectivity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.stipend}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 space-y-10">
          {PROGRAMS.map((p) => (
            <article key={p.name} className="rounded-2xl border border-border/70 bg-card/80 p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.host} · {p.format}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Selectivity</dt><dd className="mt-1 text-sm">{p.selectivity}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Stipend</dt><dd className="mt-1 text-sm">{p.stipend}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Eligibility</dt><dd className="mt-1 text-sm">{p.eligibility}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Timeline</dt><dd className="mt-1 text-sm">{p.timeline}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wide text-sage">Best for</dt><dd className="mt-1 text-sm">{p.bestFor}</dd></div>
              </dl>
              <a href={p.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-coral hover:underline">
                Visit official program page →
              </a>
              {"hsoId" in p && p.hsoId && (
                <Link to={`/opportunities/${p.hsoId}`} className="ml-4 mt-4 inline-block text-sm font-semibold text-ink underline-offset-4 hover:underline">
                  Deadline and eligibility on HSO →
                </Link>
              )}
            </article>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-ink">How to choose</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li><strong className="text-ink">Geography matters.</strong> JHIBS, HiSTEP, and Rockefeller SSRP prioritize local students. If you don't live near Baltimore, DC, or NYC, focus on SIMR, HS-SIP, or RSI.</li>
            <li><strong className="text-ink">Stipends vary widely.</strong> NIH HS-SIP pays the most; SIMR pays a baseline; RSI is fully funded but doesn't pay a stipend.</li>
            <li><strong className="text-ink">Deadlines cluster in Jan–Feb.</strong> Draft your essays in November and line up a recommender by December.</li>
            <li><strong className="text-ink">Apply to more than one.</strong> Admit rates are in the single digits — a portfolio of 3–4 competitive programs plus a local research role is the realistic strategy.</li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-border/70 bg-cream/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Explore more on HSO</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-coral hover:underline" to="/categories/research">All research programs for high school students</Link></li>
            <li><Link className="text-coral hover:underline" to="/categories/internships">All high school internships</Link></li>
            <li><Link className="text-coral hover:underline" to="/categories/summer-programs">All summer programs</Link></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}