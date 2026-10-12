import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

const LINK = "inline-flex min-h-9 items-center text-sm text-hso-muted hover:text-hso-fg hover:underline";

/**
 * Home page footer (the other pages keep SiteFooter). Links every category, the hubs, the guides and the legal pages
 * from every page, which is also how crawlers reach them.
 */
export function HomeFooter() {
  return (
    <footer className="hso-ds font-hso border-t border-hso-line bg-hso-surface">
      <div className="mx-auto grid max-w-hso-page gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr]">
        <div>
          <p className="text-[1.375rem] font-extrabold tracking-tight text-hso-fg">
            H<span className="text-hso-coral">S</span><span className="text-hso-green">O</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-hso-muted">
            A free list of internships, summer programs, scholarships, research and competitions for U.S. high school
            students. Every listing links to the official site.
          </p>
        </div>
        <Column title="Categories">
          {CATEGORY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link to={`/categories/${slug}`} className={LINK}>
                {CATEGORY_META[slug].h1.replace(/\s+for high school students$/i, "").replace(/^./, (c) => c.toUpperCase())}
              </Link>
            </li>
          ))}
        </Column>
        <Column title="Browse">
          <li><Link to="/deadlines" className={LINK}>Deadlines closing soon</Link></li>
          <li><Link to="/remote" className={LINK}>Remote and nationwide</Link></li>
          <li><Link to="/nyc-programs-for-high-school-students" className={LINK}>NYC programs</Link></li>
          <li><Link to="/collections" className={LINK}>Collections</Link></li>
        </Column>
        <Column title="Guides">
          <li><Link to="/guides/top-medical-internships" className={LINK}>Medical internships</Link></li>
          <li><Link to="/guides/top-research-competitions" className={LINK}>Research competitions</Link></li>
          <li><Link to="/guides/top-business-summer-programs" className={LINK}>Business summer programs</Link></li>
          <li><Link to="/guides/high-school-law-internships" className={LINK}>Law internships</Link></li>
        </Column>
        <Column title="HSO">
          <li><Link to="/about" className={LINK}>About</Link></li>
          <li><Link to="/submit" className={LINK}>Submit a program</Link></li>
          <li><Link to="/volunteer" className={LINK}>Join the team</Link></li>
          <li><Link to="/contact" className={LINK}>Report a correction</Link></li>
          <li><Link to="/privacy" className={LINK}>Privacy</Link></li>
          <li><Link to="/terms" className={LINK}>Terms</Link></li>
          <li>
            <a href="https://www.linkedin.com/company/highschoolopportunity" rel="me noopener" target="_blank" className={LINK}>
              LinkedIn
            </a>
          </li>
        </Column>
      </div>
      <div className="border-t border-hso-line px-4 py-4 text-center text-xs text-hso-subtle">
        High School Opportunity (HSO). Always confirm dates and rules on the program's official site.
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-hso-fg">{title}</h2>
      <ul className="mt-2">{children}</ul>
    </div>
  );
}
