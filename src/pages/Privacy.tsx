import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";

const Privacy = () => {
  useSEO({ title: "Privacy — HSO", description: "How HSO handles accounts, saved favorites, collections, and sign-in data." });
  return (
    <div className="min-h-screen bg-background bg-grain">
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Privacy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mt-8 space-y-4 leading-relaxed text-foreground">
          <h2 className="font-display text-2xl">Accounts</h2>
          <p>You can browse HSO without an account. If you sign in (with email/password or Google), we store your email address and a unique user ID so you can save favorites and collections across devices.</p>

          <h2 className="font-display text-2xl">Saved data</h2>
          <p>Your saved favorites and collections are tied to your account. Public collections you choose to share become readable by anyone with the link, but never expose your email, name, or other account details.</p>

          <h2 className="font-display text-2xl">Backend</h2>
          <p>HSO runs on Lovable Cloud (built on Supabase). Authentication, database, and storage are handled by that backend. Passwords are never visible to us.</p>

          <h2 className="font-display text-2xl">Google sign-in</h2>
          <p>If you use Google sign-in, Google shares your email address and basic profile info with us. We do not request access to your contacts, files, or other Google data.</p>

          <h2 className="font-display text-2xl">What we don't do</h2>
          <p>We don't sell your data. We don't run third-party advertising trackers. We don't email you unless you've explicitly opted into deadline reminders.</p>

          <h2 className="font-display text-2xl">Deleting your data</h2>
          <p>Email <a className="text-coral underline" href="mailto:hello@hso.app">hello@hso.app</a> and we'll delete your account and saved data.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};
export default Privacy;