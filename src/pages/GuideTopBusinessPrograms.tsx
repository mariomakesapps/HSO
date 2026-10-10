import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FullListLink } from "@/components/FullListLink";
import { STATIC_PAGE_META, guideCrumbs } from "@/lib/pageMeta";

const PROGRAMS = [
  {
    name: "Wharton Global Youth Program (Leadership in the Business World / Essentials of Finance)",
    host: "University of Pennsylvania, Philadelphia PA",
    format: "In-person (3–4 weeks) and online (2–3 weeks) tracks",
    cost: "Roughly $10,000–$13,000 for residential tracks; ~$3,000–$5,000 online. Need-based financial aid available.",
    selectivity: "Highly selective for LBW (rising seniors); other tracks moderately selective",
    grades: "Rising sophomores through rising seniors depending on track",
    bestFor: "Students who want the strongest business-school brand and a finance/entrepreneurship curriculum",
    officialUrl: "https://globalyouth.wharton.upenn.edu/",
    /** The same program's HSO listing (deadline, eligibility, cost). */
    hsoId: "wharton-global",
  },
  {
    name: "Berkeley Haas Business Academy for Youth (B-BAY)",
    host: "UC Berkeley Haas School of Business, Berkeley CA",
    format: "In-person residential, 2 weeks",
    cost: "Roughly $7,000–$9,000 residential; commuter option lower. Limited scholarships.",
    selectivity: "Moderately selective — application with transcript and short essays",
    grades: "Students aged 15–18 (rising sophomores through rising seniors)",
    bestFor: "Students focused on startups, product pitching, and West Coast tech-adjacent business",
    officialUrl: "https://haas.berkeley.edu/business-academy/",
  },
  {
    name: "NYU Stern NextGen Leaders / Summer Business Programs",
    host: "NYU Stern School of Business, New York NY",
    format: "In-person and online tracks, 1–3 weeks",
    cost: "Roughly $2,000–$10,000 depending on track and residency; NextGen Leaders is free for eligible NYC students",
    selectivity: "NextGen Leaders is very selective and need-based; open-enrollment tracks are less competitive",
    grades: "Rising juniors and seniors",
    bestFor: "Students who want NYC finance exposure, especially NYC students eligible for the free track",
    officialUrl: "https://www.stern.nyu.edu/programs-admissions/high-school",
  },
];

export default function GuideTopBusinessPrograms() {
  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/guides/top-business-summer-programs"]} type="article" />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <Breadcrumbs crumbs={guideCrumbs("/guides/top-business-summer-programs")} className="mb-6" />
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">HSO Guide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Best Business Summer Programs for High School Students (2026)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Elite university business programs cost thousands of dollars, and the value differs a lot between
          them. Below is a side-by-side comparison of the three U.S. programs students ask about most on HSO —
          Wharton Global Youth, Berkeley Haas B-BAY, and NYU Stern — with tuition, selectivity, and who each
          one actually fits.
        </p>
        <FullListLink parent="competitions" slug="business" phrase="business competitions" />

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Quick comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/70 bg-card/80">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Tuition</th>
                  <th className="px-4 py-3">Selectivity</th>
                  <th className="px-4 py-3">Grade level</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAMS.map((p) => (
                  <tr key={p.name} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3 font-semibold text-ink">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.host}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.cost}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.selectivity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.grades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Costs are approximate for the most recent published cycle — always confirm on the official program page.
          </p>
        </section>

        <section className="mt-14 space-y-10">
          {PROGRAMS.map((p) => (
            <article key={p.name} className="rounded-2xl border border-border/70 bg-card/80 p-6">
              <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.host} · {p.format}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Cost</dt><dd className="mt-1 text-sm">{p.cost}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Selectivity</dt><dd className="mt-1 text-sm">{p.selectivity}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Grade level</dt><dd className="mt-1 text-sm">{p.grades}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-wide text-sage">Format</dt><dd className="mt-1 text-sm">{p.format}</dd></div>
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
          <h2 className="font-display text-2xl font-semibold text-ink">Is the tuition worth it?</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li><strong className="text-ink">Paying for a brand rarely moves admissions.</strong> Open-enrollment tuition programs signal far less than a selective, free, or paid program.</li>
            <li><strong className="text-ink">Check the free and need-based tracks first.</strong> NYU Stern NextGen Leaders and Wharton's aid pool remove most of the cost for eligible students.</li>
            <li><strong className="text-ink">Deadlines cluster January–April.</strong> Financial aid deadlines are usually earlier than the general one.</li>
            <li><strong className="text-ink">Consider alternatives.</strong> A DECA or FBLA run, a real internship, or a small business you actually operate often reads stronger than a summer course.</li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-border/70 bg-cream/60 p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Explore more on HSO</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-coral hover:underline" to="/categories/summer-programs">All summer programs for high school students</Link></li>
            <li><Link className="text-coral hover:underline" to="/categories/internships">All high school internships</Link></li>
            <li><Link className="text-coral hover:underline" to="/guides/top-medical-internships">Best medical internships comparison</Link></li>
            <li><Link className="text-coral hover:underline" to="/guides/top-research-competitions">Best research competitions comparison</Link></li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
