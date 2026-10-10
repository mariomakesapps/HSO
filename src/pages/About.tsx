import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { LINKEDIN_URL, STATIC_PAGE_META } from "@/lib/pageMeta";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageCrumbs } from "@/lib/pageMeta";
import { Link } from "react-router-dom";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/about"]} />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Breadcrumbs crumbs={pageCrumbs("About", "/about")} className="mb-6" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About High School Opportunity</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          A discovery layer for <em className="text-coral not-italic">ambitious</em> high schoolers.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          High School Opportunity (HSO) is a free, curated index of U.S.-based opportunities open to high school students: internships, research programs, scholarships, competitions, summer programs, and fellowships from universities, nonprofits, companies, and competition organizers across the United States.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          We started HSO because the best opportunities are often hidden in PDFs, departmental pages, and word-of-mouth. Students with the most resources find them. We want every motivated student to have the same map.
        </p>
        <h2 className="mt-12 font-display text-2xl">What you'll find</h2>
        <ul className="mt-4 grid gap-2 text-foreground sm:grid-cols-2">
          {CATEGORY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link className="text-coral underline-offset-4 hover:underline" to={`/categories/${slug}`}>
                {CATEGORY_META[slug].h1.replace(/^./, (c) => c.toUpperCase())}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 font-display text-2xl">Who runs HSO</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          High School Opportunity (HSO) is run by a small team of students. If you want to help, we take on{" "}
          <Link className="text-coral underline-offset-4 hover:underline" to="/volunteer">student interns</Link> who find and
          check opportunities, run social, and get schools on board.
        </p>

        <h2 className="mt-12 font-display text-2xl">How listings are checked</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
          <li>Every listing links to the program&rsquo;s own official page. We don&rsquo;t run programs; we point you to them.</li>
          <li>
            A listing shows a deadline only when the official page states one for the coming cycle. Otherwise it says
            &ldquo;Deadline TBA&rdquo; rather than repeating last year&rsquo;s date.
          </li>
          <li>
            Listings are re-checked against their official pages in dated reviews, and a listing&rsquo;s page shows the
            month it was last checked.
          </li>
          <li>
            Programs that have ended, moved to a dead link, or turned out not to be open to high school students are taken
            down, and their old address forwards to the closest listing or category.
          </li>
          <li>
            Deadlines and rules change. Always confirm on the official site before you apply, and{" "}
            <Link className="text-coral underline-offset-4 hover:underline" to="/contact">tell us</Link> if something is
            out of date.
          </li>
        </ul>

        <h2 className="mt-12 font-display text-2xl">Where to start</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          See{" "}
          <Link className="text-coral underline-offset-4 hover:underline" to="/deadlines">deadlines closing soon</Link>,
          browse{" "}
          <Link className="text-coral underline-offset-4 hover:underline" to="/remote">remote and nationwide programs</Link>,
          or read a guide such as{" "}
          <Link className="text-coral underline-offset-4 hover:underline" to="/guides/top-medical-internships">the best medical internships</Link>.
          Follow HSO on{" "}
          <a className="text-coral underline-offset-4 hover:underline" href={LINKEDIN_URL} rel="me noopener" target="_blank">LinkedIn</a>.
        </p>
        <div className="hso-glass-panel mt-12 rounded-2xl p-6">
          <p className="font-display text-xl">Have an opportunity to add?</p>
          <p className="mt-1 text-muted-foreground">Help other students by submitting one.</p>
          <Link to="/submit" className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral hover:text-coral-foreground">Submit an opportunity</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
export default About;

