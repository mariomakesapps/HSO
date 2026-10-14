import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/pageMeta";
import { nowDate, useClock } from "@/lib/clock";

const Terms = () => {
  const live = useClock();
  // A fixed locale and time zone until hydration is done, so the prerendered date matches.
  const updated = live ? nowDate().toLocaleDateString() : nowDate().toLocaleDateString("en-US", { timeZone: "UTC" });
  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/terms"]} />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Terms of use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <section className="hso-glass-panel mt-8 space-y-4 rounded-[1.75rem] p-6 leading-relaxed text-foreground">
          <h2 className="font-display text-2xl">What HSO is</h2>
          <p>HSO is an editorial discovery directory. We link to opportunities run by third parties  -  universities, nonprofits, companies, competitions, and scholarship providers.</p>
          <h2 className="font-display text-2xl">Always verify</h2>
          <p>Deadlines, eligibility, costs, format, and requirements change. <strong>Before applying, you must confirm every detail on the official program website.</strong> HSO is not responsible for outdated or inaccurate information surfaced from third-party sources.</p>
          <h2 className="font-display text-2xl">Acceptable use</h2>
          <p>Don't scrape or republish HSO data at scale, attempt to break authentication, submit spam, or impersonate organizations.</p>
          <h2 className="font-display text-2xl">No guarantees</h2>
          <p>HSO does not guarantee admission, awards, or outcomes. Inclusion of any program is editorial and not an endorsement.</p>
          <h2 className="font-display text-2xl">Changes</h2>
          <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};
export default Terms;

