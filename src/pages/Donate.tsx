import { Link } from "react-router-dom";
import { ExternalLink, Heart } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { STATIC_PAGE_META, DONATE_FAQS } from "@/lib/pageMeta";
import {
  DONATE_URL,
  SPONSOR_EMAIL,
  SPONSOR_LINK_REL,
  SPONSOR_TIERS,
  sponsorsByTier,
} from "@/lib/support";

const FUNDS = [
  {
    title: "Keeping HSO free",
    body: "Every student can search, filter and save opportunities without paying or signing up.",
  },
  {
    title: "Checking listings",
    body: "Deadlines, costs and eligibility are rechecked against official program pages, which takes tools and time.",
  },
  {
    title: "Running the site",
    body: "Hosting, the domain, email and the services behind accounts, saved shelves and forms.",
  },
  {
    title: "Reaching more students",
    body: "Outreach to schools, counselors and clubs so students who need HSO most can find it.",
  },
];

const sponsorMailto = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("Sponsoring HSO")}`;

function DonateButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground transition hover:bg-ink hover:text-cream ${className}`}
    >
      <Heart className="h-4 w-4" aria-hidden="true" />
      Donate through HCB
      <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const Donate = () => {
  const groups = sponsorsByTier();

  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/donate"]} />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Donate &amp; sponsor</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          Help keep HSO <em className="text-coral not-italic">free</em> for every student.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          HSO is a free, student-run directory of internships, summer programs, scholarships, research programs and
          competitions for U.S. high school students. Donations and sponsorships pay for the work of keeping it
          accurate and open to everyone.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <DonateButton />
          <a
            href={sponsorMailto}
            className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-coral hover:text-coral"
          >
            Become a sponsor
          </a>
        </div>

        <h2 className="mt-14 font-display text-2xl">What your support pays for</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FUNDS.map((f) => (
            <div key={f.title} className="hso-glass-panel rounded-2xl p-5">
              <p className="font-semibold">{f.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl">How donations work</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Donations go through{" "}
          <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="text-coral underline-offset-4 hover:underline">
            HCB
          </a>
          , Hack Club's platform for student-led projects. HSO is fiscally sponsored by The Hack Foundation (Hack Club),
          a 501(c)(3) nonprofit, EIN 81-2908499. That means gifts are tax-deductible to the extent allowed by law, and
          HCB emails you a receipt.
        </p>

        <h2 className="mt-14 font-display text-2xl">Our sponsors</h2>
        {groups.length === 0 ? (
          <div className="hso-glass-panel mt-4 rounded-2xl p-6">
            <p className="font-display text-xl">Your organization could be first.</p>
            <p className="mt-1 text-muted-foreground">
              Sponsors are thanked here as soon as their support comes in.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-8">
            {groups.map(({ tier, sponsors }) => (
              <section key={tier.id} aria-labelledby={`tier-${tier.id}`}>
                <h3 id={`tier-${tier.id}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {tier.name}s
                </h3>
                <ul className={tier.id === "supporter" ? "mt-3 flex flex-wrap gap-x-5 gap-y-2" : "mt-3 grid gap-3 sm:grid-cols-2"}>
                  {sponsors.map((s) => {
                    const label = (
                      <>
                        {s.logo && tier.id !== "supporter" ? (
                          <img src={s.logo} alt={s.name} loading="lazy" className="h-10 w-auto max-w-[180px] object-contain" />
                        ) : (
                          <span className="font-semibold">{s.name}</span>
                        )}
                      </>
                    );
                    return (
                      <li key={s.name} className={tier.id === "supporter" ? "" : "hso-glass-panel rounded-2xl p-5"}>
                        {s.url && tier.id !== "supporter" ? (
                          <a href={s.url} target="_blank" rel={SPONSOR_LINK_REL} className="inline-flex hover:text-coral">
                            {label}
                          </a>
                        ) : (
                          label
                        )}
                        {s.note && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.note}</p>}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}

        <h2 className="mt-14 font-display text-2xl">Sponsorship levels</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Companies, foundations, schools and individuals can sponsor HSO. Give any amount through HCB, then email us
          how you'd like to be listed.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {SPONSOR_TIERS.map((t) => (
            <div key={t.id} className="hso-glass-panel flex flex-col rounded-2xl p-5">
              <p className="font-display text-xl">{t.name}</p>
              <p className="mt-0.5 text-sm font-semibold text-coral">{t.amount}</p>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {t.recognition.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span aria-hidden="true" className="text-sage">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl">Questions</h2>
        <dl className="mt-4 space-y-5">
          {DONATE_FAQS.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="hso-glass-panel mt-14 rounded-2xl p-6">
          <p className="font-display text-xl">Want to sponsor HSO?</p>
          <p className="mt-1 text-muted-foreground">
            Email{" "}
            <a href={sponsorMailto} className="font-semibold text-foreground underline decoration-1 underline-offset-4 hover:text-coral">
              {SPONSOR_EMAIL}
            </a>
            . You can also help by{" "}
            <Link to="/submit" className="text-coral underline-offset-4 hover:underline">submitting an opportunity</Link>{" "}
            or{" "}
            <Link to="/volunteer" className="text-coral underline-offset-4 hover:underline">joining the team</Link>.
          </p>
          <DonateButton className="mt-5" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Donate;
