import { useState } from "react";
import { z } from "zod";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/pageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  RESUME_ACCEPT,
  RESUME_BUCKET,
  detectTimeZone,
  resumeContentType,
  resumeProblem,
  resumeStoragePath,
  timeZoneOptions,
} from "@/lib/internshipApplication";

const ROLES = [
  "Opportunity Research Associate",
  "Social Media Manager",
  "Outreach Lead",
] as const;

const HOURS = ["1-2 hours", "3-5 hours", "5+ hours"] as const;

const HR_EMAIL = "highschoolopportunityhr@gmail.com";

const answer = (what: string) =>
  z.string().trim().min(20, `${what}: at least a couple of sentences, please`).max(2000);

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  age: z
    .union([z.literal(""), z.coerce.number().int().min(10, "Please check your age").max(25, "Please check your age")])
    .optional(),
  grade: z.coerce.number({ invalid_type_error: "Please pick your grade" }).int().min(9).max(12),
  school: z.string().trim().min(2, "Please enter your school").max(160),
  city: z.string().trim().min(2, "Please enter your city").max(120),
  country: z.string().trim().min(2, "Please enter your country").max(120),
  time_zone: z.string().trim().min(2, "Please enter your time zone").max(80),
  interests: z.array(z.string()).min(1, "Pick at least one role"),
  hours_per_week: z.enum(HOURS, { errorMap: () => ({ message: "Please pick how much time you have each week" }) }),
  portfolio_url: z.string().trim().url("Please check the portfolio or LinkedIn link").max(500).optional().or(z.literal("")),
  motivation: answer("Why you want to join"),
  contribution: answer("What you'd bring to the team"),
  about: answer("About you"),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
  referral_source: z.string().trim().max(200).optional().or(z.literal("")),
});

const Volunteer = () => {
  const [submitting, setSubmitting] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const [timeZone] = useState(detectTimeZone);
  const [zones] = useState(timeZoneOptions);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Honeypot — bots tend to fill every field
    if (String(fd.get("website") || "").trim() !== "") {
      toast.success("Thanks - application sent.");
      form.reset();
      setInterests([]);
      return;
    }
    const raw = {
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      age: String(fd.get("age") || ""),
      grade: String(fd.get("grade") || ""),
      school: String(fd.get("school") || ""),
      city: String(fd.get("city") || ""),
      country: String(fd.get("country") || ""),
      time_zone: String(fd.get("time_zone") || ""),
      interests,
      hours_per_week: String(fd.get("hours_per_week") || "") as (typeof HOURS)[number],
      portfolio_url: String(fd.get("portfolio_url") || ""),
      motivation: String(fd.get("motivation") || ""),
      contribution: String(fd.get("contribution") || ""),
      about: String(fd.get("about") || ""),
      experience: String(fd.get("experience") || ""),
      referral_source: String(fd.get("referral_source") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    const resume = fd.get("resume");
    const resumeFile = resume instanceof File && resume.name ? resume : null;
    const problem = resumeProblem(resumeFile);
    if (problem || !resumeFile) {
      toast.error(problem || "Please attach your resume.");
      return;
    }

    setSubmitting(true);
    const data = parsed.data;
    const age = typeof data.age === "number" ? data.age : undefined;

    // Upload the resume first. If storage is unavailable the application still goes
    // through, and the applicant is asked to email the resume instead.
    const path = resumeStoragePath(crypto.randomUUID(), resumeFile.name);
    const upload = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(path, resumeFile, { contentType: resumeContentType(resumeFile.name), upsert: false });
    const resumePath = upload.error ? "" : path;
    if (upload.error) console.error("Resume upload failed", upload.error);

    const fields = {
      full_name: data.full_name,
      email: data.email,
      grade: data.grade,
      school: data.school,
      city: data.city,
      country: data.country,
      time_zone: data.time_zone,
      interests: data.interests,
      hours_per_week: data.hours_per_week,
      portfolio_url: data.portfolio_url || "",
      motivation: data.motivation,
      contribution: data.contribution,
      about: data.about,
      experience: data.experience || "",
      referral_source: data.referral_source || "",
      ...(age ? { age } : {}),
    };

    // Store a record (best-effort) and notify the team via email.
    const [dbResult, emailResult] = await Promise.all([
      // The generated Supabase types don't know about volunteer_signups yet.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("volunteer_signups").insert({
        ...fields,
        portfolio_url: fields.portfolio_url || null,
        experience: fields.experience || null,
        referral_source: fields.referral_source || null,
        resume_path: resumePath || null,
      }),
      supabase.functions.invoke("send-form-notification", {
        body: { type: "volunteer", ...fields, resume_path: resumePath, resume_name: resumeFile.name.slice(0, 200) },
      }),
    ]);
    setSubmitting(false);
    if (emailResult.error) {
      console.error("Internship application email failed", emailResult.error, dbResult?.error);
      toast.error(`Something went wrong. Please try again or email us directly at ${HR_EMAIL}.`);
      return;
    }
    if (upload.error) {
      toast.warning(`Application sent, but your resume didn't upload. Please email it to ${HR_EMAIL}.`, { duration: 15000 });
    } else {
      toast.success("Thanks — application sent. We'll be in touch by email.");
    }
    form.reset();
    setInterests([]);
  };

  const toggleRole = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/volunteer"]} />
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
              title="Outreach Lead"
              hook="Get HSO in front of the people who can spread it."
              does={[
                "Reach out to schools, counselors and student clubs so more students find HSO.",
                "Find sponsors and partners (nonprofits, programs, local businesses) and pitch working together.",
                "Keep track of who you've contacted, follow up, and report what came of it.",
              ]}
              gets={[
                "Real practice at cold emails, pitching and following up.",
                "Partnerships you started and numbers you can point to.",
                "A say in who HSO works with next.",
              ]}
            />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            All three internships are unpaid, remote, and run by students. Writing, design, and web work come up
            too — mention it in your answers if that's more your thing.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="volunteer-apply">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Apply</p>
          <h2 id="volunteer-apply" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell us which one
          </h2>
          <p className="mt-3 text-muted-foreground">
            Takes about ten minutes. Have your resume ready as a PDF or Word file. We'll get back to you by email.
          </p>

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
            <FormHeading>About you</FormHeading>
            <Field label="Full name" name="full_name" required autoComplete="name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@school.edu" />
            <Row>
              <Field label="School" name="school" required autoComplete="organization" />
              <SelectField label="Grade" name="grade" required options={["9", "10", "11", "12"]} />
            </Row>
            <Row>
              <Field label="Age" name="age" type="number" min={10} max={25} inputMode="numeric" placeholder="Optional" />
              <SelectField label="Time per week" name="hours_per_week" required options={[...HOURS]} />
            </Row>
            <Row>
              <Field label="City" name="city" required autoComplete="address-level2" />
              <Field label="Country" name="country" required autoComplete="country-name" defaultValue="United States" />
            </Row>
            <div>
              <Field
                label="Time zone"
                name="time_zone"
                required
                defaultValue={timeZone}
                list="volunteer-time-zones"
                placeholder="e.g. America/New_York"
              />
              <datalist id="volunteer-time-zones">
                {zones.map((z) => <option key={z} value={z} />)}
              </datalist>
              <p className="mt-1.5 text-xs text-muted-foreground">Filled in from your device. Change it if it's wrong. It helps us plan calls.</p>
            </div>

            <FormHeading>The internship</FormHeading>
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
              <label htmlFor="volunteer-resume" className="mb-1.5 block text-sm font-semibold">Resume *</label>
              <input
                id="volunteer-resume"
                name="resume"
                type="file"
                required
                accept={RESUME_ACCEPT}
                className="block w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-cream hover:file:bg-coral"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                PDF or Word, up to 5 MB. Include your skills, anything you've worked on, and activities. A
                first resume is fine.
              </p>
            </div>
            <Field label="Portfolio or LinkedIn" name="portfolio_url" type="url" placeholder="Optional — https://..." />

            <FormHeading>A few questions</FormHeading>
            <Question
              name="motivation"
              label="Why do you want to join HSO?"
              required
              placeholder="What draws you to this internship, and what do you hope to get out of it?"
            />
            <Question
              name="contribution"
              label="What would you bring to the team?"
              required
              placeholder="Skills, habits or experience that would help, for example research, writing, design, organizing or reaching people."
            />
            <Question
              name="about"
              label="Tell us a little about yourself"
              required
              placeholder="What you're into outside of school, and how you like to work. This helps us get to know you."
            />
            <Question
              name="experience"
              label="Something you've built, led or are proud of"
              placeholder="Optional. A project, club, job, account or anything else. Links welcome."
            />
            <Field label="How did you hear about HSO?" name="referral_source" maxLength={200} placeholder="Optional" />

            <Button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-6 text-cream hover:bg-coral hover:text-coral-foreground">
              {submitting ? "Sending..." : "Apply for an internship"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              These internships are unpaid. We only use your details to contact you about your application. Your
              resume is stored privately and only the HSO team can open it. Nothing is shared or published.
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

function FormHeading({ children }: { children: React.ReactNode }) {
  return <p className="pt-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{children}</p>;
}

function Question({ name, label, required, placeholder }: { name: string; label: string; required?: boolean; placeholder: string }) {
  const id = `volunteer-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}{required && " *"}</label>
      <Textarea id={id} name={name} required={required} maxLength={2000} rows={4} placeholder={placeholder} className="rounded-2xl" />
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export default Volunteer;
