import { Link } from "react-router-dom";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
import { currentYear, useClock } from "@/lib/clock";

export function SiteFooter() {
  useClock();
  return (
    <footer className="border-t border-border/70 bg-ink text-cream">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-3xl font-black tracking-tight">
            <span className="text-coral">H</span>S<span className="text-sage">O</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/62">
            A curated opportunity finder for high school students who want official links, cleaner filters, and a better way to keep track.
          </p>
        </div>
        <FooterColumn title="Explore">
          <li><Link to="/" className="hover:text-coral">Home</Link></li>
          <li><Link to="/about" className="hover:text-coral">About</Link></li>
          <li><Link to="/submit" className="hover:text-coral">Submit opportunity</Link></li>
          <li><Link to="/volunteer" className="hover:text-coral">HSO Internships</Link></li>
          <li><Link to="/contact" className="hover:text-coral">Corrections</Link></li>
        </FooterColumn>
        <FooterColumn title="Categories">
          {CATEGORY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link to={`/categories/${slug}`} className="hover:text-coral">
                {CATEGORY_META[slug].h1.replace(/^./, (c) => c.toUpperCase())}
              </Link>
            </li>
          ))}
          <li><Link to="/deadlines" className="hover:text-coral">Deadlines closing soon</Link></li>
          <li><Link to="/nyc-programs-for-high-school-students" className="hover:text-coral">NYC programs</Link></li>
          <li><Link to="/remote" className="hover:text-coral">Remote &amp; nationwide</Link></li>
        </FooterColumn>
        <FooterColumn title="Guides">
          <li><Link to="/guides/top-medical-internships" className="hover:text-coral">Medical internships</Link></li>
          <li><Link to="/guides/top-research-competitions" className="hover:text-coral">Research competitions</Link></li>
          <li><Link to="/guides/top-business-summer-programs" className="hover:text-coral">Business summer programs</Link></li>
          <li><Link to="/guides/high-school-law-internships" className="hover:text-coral">Law internships</Link></li>
          <li><Link to="/collections" className="hover:text-coral">Curated collections</Link></li>
        </FooterColumn>
        <FooterColumn title="Legal">
          <li><Link to="/privacy" className="hover:text-coral">Privacy</Link></li>
          <li><Link to="/terms" className="hover:text-coral">Terms</Link></li>
          <li>
            <a href="https://www.linkedin.com/company/highschoolopportunity" rel="me noopener" target="_blank" className="hover:text-coral">
              LinkedIn
            </a>
          </li>
        </FooterColumn>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/52 sm:px-6">
        {currentYear()} HSO - High School Opportunity Finder. Always confirm details on official program sites.
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cream/42">{title}</p>
      <ul className="mt-3 space-y-1.5 text-sm font-medium text-cream/70">{children}</ul>
    </div>
  );
}
