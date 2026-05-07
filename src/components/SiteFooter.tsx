import { Link } from "react-router-dom";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl">HSO — for the curious.</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">300+ curated opportunities for ambitious high school students, growing weekly.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link to="/" className="hover:text-coral">Discover</Link></li>
            <li><Link to="/about" className="hover:text-coral">About</Link></li>
            <li><Link to="/submit" className="hover:text-coral">Submit opportunity</Link></li>
            <li><Link to="/contact" className="hover:text-coral">Contact &amp; corrections</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Categories</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {CATEGORY_SLUGS.map((slug) => (
              <li key={slug}>
                <Link to={`/categories/${slug}`} className="hover:text-coral">{CATEGORY_META[slug].h1.replace(/^./, (c) => c.toUpperCase())}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link to="/privacy" className="hover:text-coral">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-coral">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} HSO — High School Opportunity Finder. Always confirm details on official program sites.
      </div>
    </footer>
  );
}