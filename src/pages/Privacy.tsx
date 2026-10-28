import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/pageMeta";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/privacy"]} />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Privacy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="hso-glass-panel mt-8 space-y-4 rounded-[1.75rem] p-6 leading-relaxed text-foreground">
          <h2 className="font-display text-2xl">Accounts</h2>
          <p>You can browse HSO without an account. Accounts are handled by Supabase Auth so saved opportunities and collections can sync across devices.</p>

          <h2 className="font-display text-2xl">Saved data</h2>
          <p>Your saved opportunities, collections, public collection settings, share links, likes, bookmarks, contact messages, and opportunity submissions are stored in Supabase. Collections are not stored in localStorage.</p>

          <h2 className="font-display text-2xl">Backend</h2>
          <p>HSO uses Row Level Security rules so private collections are limited to owners, specific shared users, valid share links, or public published collections.</p>

          <h2 className="font-display text-2xl">What we don't do</h2>
          <p>We don't sell your data. We don't run third-party advertising trackers. We don't email you unless deadline reminders are connected to a real backend later.</p>

          <h2 className="font-display text-2xl">Deleting data</h2>
          <p>You can delete collections from your Collections page. Account deletion can be handled through the backend admin workflow.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Privacy;
