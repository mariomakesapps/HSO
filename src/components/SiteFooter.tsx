import { Link } from "react-router-dom";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
import { Instagram, Linkedin } from "lucide-react";
import { GUIDE_LINKS, SOCIAL_LINKS } from "@/lib/siteLinks";
import { SPONSOR_LINK_REL, footerSponsors } from "@/lib/support";

export function SiteFooter() {
  const partners = footerSponsors();
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
          <li><Link to="/donate" className="hover:text-coral">Donate &amp; sponsor</Link></li>
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
          {GUIDE_LINKS.map((g) => (
            <li key={g.href}><Link to={g.href} className="hover:text-coral">{g.label}</Link></li>
          ))}
          <li><Link to="/collections" className="hover:text-coral">Collections</Link></li>
        </FooterColumn>
        <FooterColumn title="Legal">
          <li><Link to="/privacy" className="hover:text-coral">Privacy</Link></li>
          <li><Link to="/terms" className="hover:text-coral">Terms</Link></li>
        </FooterColumn>
      </div>
      {partners.length > 0 && (
        <div className="border-t border-cream/10 px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-cream/70">
            <Link to="/donate" className="text-xs font-bold uppercase tracking-[0.22em] text-cream/42 hover:text-coral">Sponsored by</Link>
            {partners.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel={SPONSOR_LINK_REL} className="font-semibold hover:text-coral">
                {s.name}
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="border-t border-cream/10 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
          <p className="font-display text-lg font-semibold text-cream">Follow us!</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.network === "instagram" ? Instagram : Linkedin;
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm font-semibold text-cream/85 transition hover:border-coral hover:bg-coral hover:text-coral-foreground"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {s.label}
                    <span className="sr-only">(HSO on {s.label}, opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/52 sm:px-6">
        {new Date().getFullYear()} HSO - High School Opportunity Finder. Always confirm details on official program sites.
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
