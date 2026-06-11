import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

const About = () => {
  useSEO({
    title: "About HSO | High School Opportunity",
    description: "HSO helps high school students find U.S.-based internships, scholarships, research programs, competitions, volunteer opportunities, and summer programs.",
  });
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          A discovery layer for <em className="text-coral not-italic">ambitious</em> high schoolers.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          HSO is a curated index of U.S.-based opportunities open to high school students  -  internships, research programs, scholarships, competitions, summer programs, volunteer roles, and fellowships from universities, nonprofits, companies, and competition organizers across the United States.
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
        <h2 className="mt-12 font-display text-2xl">How HSO is built</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Every listing links to the official program page. We don't run programs  -  we point you to them. Our editors review submissions weekly and remove broken or outdated entries.
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

