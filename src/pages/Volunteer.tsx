import { useState } from "react";
import { z } from "zod";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ROLES = [
  "Opportunity Research Associate",
  "Social Media Manager",
  "School Partnerships Lead",
] as const;

const HOURS = ["1-2 hours", "3-5 hours", "5+ hours"] as const;

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  grade: z.coerce.number().int().min(9).max(12),
  school: z.string().trim().max(160).optional().or(z.literal("")),
  interests: z.array(z.string()).min(1, "Pick at least one role"),
  hours_per_week: z.enum(HOURS),
  portfolio_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  motivation: z.string().trim().min(20, "Tell us a bit more — at least 20 characters").max(1000),
});

const Volunteer = () => {
  useSEO({
    title: "HSO Internships (Unpaid) | High School Opportunity",
    description:
      "Three unpaid internships on the student team behind HSO: finding and checking opportunities, running social, and getting schools on board. A few hours a week, remote.",
  });
  const [submitting, setSubmitting] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Honeypot — bots tend to fill every field
    if (String(fd.get("website") || "").trim() !== "") {
      toast.success("Thanks - application sent.");
      (e.target as HTMLFormElement).reset();
      setInterests([]);
      return;
    }
    const raw = {
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      grade: String(fd.get("grade") || ""),
      school: String(fd.get("school") || ""),
      interests,
      hours_per_week: String(fd.get("hours_per_week") || "") as (typeof HOURS)[number],
      portfolio_url: String(fd.get("portfolio_url") || ""),
      motivation: String(fd.get("motivation") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    setSubmitting(true);
    const dbPayload = {
      ...parsed.data,
      school: parsed.data.school || null,
      portfolio_url: parsed.data.portfolio_url || null,
    };
    // Store a record (best-effort) and notify the team via email.
    const [dbResult, emailResult] = await Promise.all([
      // The generated Supabase types don't know about volunteer_signups yet —
      // the table ships with this change's migration.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("volunteer_signups").insert(dbPayload),
      supabase.functions.invoke("send-form-notification", {
        body: {
          type: "volunteer",
          ...parsed.data,
          school: parsed.data.school || "",
          portfolio_url: parsed.data.portfolio_url || "",
        },
      }),
    ]);
    setSubmitting(false);
    if (emailResult.error) {
      console.error("Volunteer email failed", emailResult.error, dbResult?.error);
      toast.error("Something went wrong. Please try again or email us directly at highschoolopportunity@gmail.com.");
      return;
    }
    toast.success("Thanks — we'll be in touch by email.");
    (e.target as HTMLFormElement).reset();
    setInterests([]);
  };

  const toggleRole = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get involved</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">HSO Internships</h1>
        <p className="mt-3 text-muted-foreground">
          HSO is run by students. These internships are unpaid, but they're real jobs — if you have a few hours a
          week you can help other people find programs they'd never hear about otherwise. It's remote, and you
          don't need experience.
        </p>

        <section className="mt-14" aria-labelledby="volunteer-roles">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Open internships</p>
          <h2 id="volunteer-roles" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Three internships we need filled
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each one is a real internship with one person responsible for it. You get a title, something specific to
            run, and room to make your own decisions. They're unpaid — the value is the experience, the title, and
            the work you can point to.
          </p>

          <div className="mt-8 space-y-5">
            <RolePanel
              accent="coral"
              index="01"
              title="Opportunity Research Associate"
              hook="You choose what goes in the catalog."
              does={[
                "Find programs worth listing: university labs, hospitals, nonprofits, competitions.",
                "Check the deadline, the eligibility rules, and the link before anything goes live.",
                "Take one category and keep it current through application season.",
              ]}
              gets={[
                "Your listings go into a catalog of 1,800+ that students use to plan their year.",
                "You get good at research and fact-checking.",
                "Credit on the categories you run.",
              ]}
            />
            <RolePanel
              accent="sage"
              index="02"
              title="Social Media Manager"
              hook="The account is yours to run."
              does={[
                "Plan and write the posts for Instagram and TikTok.",
                "Turn a deadline into something a junior will stop scrolling for.",
                "Check what's working and drop what isn't.",
              ]}
              gets={[
                "An audience and numbers you can show people: reach, growth, saves.",
                "Work you decided on yourself.",
                "A say in how HSO sounds.",
              ]}
            />
            <RolePanel
              accent="ink"
              index="03"
              title="School Partnerships Lead"
              hook="Get your school using it."
              does={[
                "Take HSO to your counseling office, your clubs, and the student newsletter.",
                "Get to know the counselors and club leads who reach hundreds of students at once.",
                "Do your own school first, then help with the next one.",
              ]}
              gets={[
                "Your school is yours, and so are the numbers.",
                "Practice at cold outreach and pitching, which is hard to come by in high school.",
                "Students at your school applying to things they wouldn't have found.",
              ]}
            />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            All three internships are unpaid, remote, and run by students. Writing, design, and web work come up
            too — say so in the last box if that's more your thing.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="volunteer-apply">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Apply</p>
          <h2 id="volunteer-apply" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us which one
          </h2>
          <p className="mt-3 text-muted-foreground">Takes about two minutes. We'll get back to you by email.</p>

          <form onSubmit={onSubmit} className="hso-glass-panel mt-8 space-y-5 rounded-[1.75rem] p-5 sm:p-6">
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <Field label="Full name" name="full_name" required autoComplete="name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@school.edu" />
            <Row>
              <SelectField label="Grade" name="grade" required options={["9", "10", "11", "12"]} />
              <SelectField label="Time per week" name="hours_per_week" required options={[...HOURS]} />
            </Row>
            <Field label="School" name="school" placeholder="Optional" />

            <div>
              <p className="mb-1 text-sm font-semibold">Which internship do you want? *</p>
              <p className="mb-2.5 text-xs text-muted-foreground">Pick one, or more than one if you're open to it.</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((value) => {
                  const active = interests.includes(value);
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => toggleRole(value)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${active ? "border-coral bg-coral/10 text-coral" : "border-border bg-card text-foreground hover:border-foreground"}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="volunteer-motivation" className="mb-1.5 block text-sm font-semibold">
                Why do you want to help? *
              </label>
              <Textarea
                id="volunteer-motivation"
                name="motivation"
                required
                maxLength={1000}
                rows={4}
                placeholder="A sentence or two is plenty. Anything you've worked on that's relevant is a bonus."
                className="rounded-2xl"
              />
            </div>
            <Field label="Portfolio or LinkedIn" name="portfolio_url" type="url" placeholder="Optional — https://..." />

            <Button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-6 text-cream hover:bg-coral hover:text-coral-foreground">
              {submitting ? "Sending..." : "Apply for an internship"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              These internships are unpaid. We only use your details to contact you about your application. Nothing
              is shared or published.
            </p>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

const ACCENTS = {
  coral: { bar: "bg-coral", text: "text-coral", dot: "bg-coral" },
  sage: { bar: "bg-sage", text: "text-sage", dot: "bg-sage" },
  ink: { bar: "bg-ink", text: "text-ink", dot: "bg-ink" },
} as const;

function RolePanel({
  accent,
  index,
  title,
  hook,
  does,
  gets,
}: {
  accent: keyof typeof ACCENTS;
  index: string;
  title: string;
  hook: string;
  does: string[];
  gets: string[];
}) {
  const a = ACCENTS[accent];
  return (
    <article className="hso-glass-panel relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
      {/* Accent rail — keeps the three panels distinguishable at a glance. */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${a.bar}`} />
      <div className="pl-3 sm:pl-4">
        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${a.text}`}>Role {index}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-base font-medium text-foreground/80">{hook}</p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">What you'll do</p>
            <ul className="mt-2.5 space-y-2">
              {does.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">What you get</p>
            <ul className="mt-2.5 space-y-2">
              {gets.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `volunteer-${props.name}`;
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}{props.required && " *"}</label>
      <Input id={id} {...props} className="rounded-full" />
    </div>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  const id = `volunteer-${name}`;
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}{required && " *"}</label>
      <select id={id} name={name} required={required} defaultValue="" className="h-10 w-full rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none focus:border-foreground">
        <option value="" disabled>Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export default Volunteer;
