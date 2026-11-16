import { useState } from "react";
import { z } from "zod";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/staticPageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  title: z.string().trim().min(2).max(160),
  org: z.string().trim().min(2).max(160),
  category: z.enum(["Research", "Internship", "Competition", "Summer Program", "Scholarship", "Fellowship"]),
  url: z.string().trim().url().max(500),
  deadline: z.string().optional(),
  cost: z.enum(["Free", "Paid", "Stipend"]),
  format: z.enum(["In-person", "Online", "Hybrid"]),
  grades: z.array(z.number()).default([]),
  description: z.string().trim().min(20).max(1000),
  submitter_email: z.string().trim().email().max(255),
});

const Submit = () => {
  const [submitting, setSubmitting] = useState(false);
  const [grades, setGrades] = useState<number[]>([9, 10, 11, 12]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website") || "").trim() !== "") {
      toast.success("Thanks - submitted for review.");
      (e.target as HTMLFormElement).reset();
      setGrades([9, 10, 11, 12]);
      return;
    }
    const raw = {
      title: String(fd.get("title") || ""),
      org: String(fd.get("org") || ""),
      category: String(fd.get("category") || "") as any,
      url: String(fd.get("url") || ""),
      deadline: String(fd.get("deadline") || "") || undefined,
      cost: String(fd.get("cost") || "") as any,
      format: String(fd.get("format") || "") as any,
      grades,
      description: String(fd.get("description") || ""),
      submitter_email: String(fd.get("submitter_email") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    setSubmitting(true);
    const dbPayload = { ...parsed.data, deadline: parsed.data.deadline || null };
    const [dbResult, emailResult] = await Promise.all([
      (supabase as any).from("opportunity_submissions").insert(dbPayload),
      supabase.functions.invoke("send-form-notification", {
        body: { type: "opportunity", ...parsed.data, deadline: parsed.data.deadline || "" },
      }),
    ]);
    setSubmitting(false);
    if (emailResult.error) {
      console.error("Submit email failed", emailResult.error, dbResult?.error);
      toast.error("Something went wrong. Please try again or email us directly at contact@highschoolopportunity.org.");
      return;
    }
    toast.success("Thanks — your submission was sent.");
    (e.target as HTMLFormElement).reset();
    setGrades([9, 10, 11, 12]);
  };

  const toggleGrade = (g: number) => {
    setGrades((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g].sort());
  };

  return (
    <div className="min-h-screen">
      <SEO {...STATIC_PAGE_META["/submit"]} />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contribute</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Submit an opportunity</h1>
        <p className="mt-3 text-muted-foreground">Help other students. Submissions are saved to the HSO backend for review.</p>

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
          <Field label="Program name" name="title" required />
          <Field label="Organization" name="org" required />
          <Row>
            <SelectField label="Category" name="category" required options={["Research", "Internship", "Competition", "Summer Program", "Scholarship", "Fellowship"]} />
            <SelectField label="Cost" name="cost" required options={["Free", "Paid", "Stipend"]} />
          </Row>
          <Row>
            <SelectField label="Format" name="format" required options={["In-person", "Online", "Hybrid"]} />
            <Field label="Deadline" name="deadline" type="date" />
          </Row>
          <Field label="Official URL" name="url" type="url" required placeholder="https://..." />
          <div>
            <p className="mb-2 text-sm font-semibold">Eligible grades</p>
            <div className="flex flex-wrap gap-2">
              {[9, 10, 11, 12].map((g) => (
                <button type="button" key={g} onClick={() => toggleGrade(g)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${grades.includes(g) ? "border-coral bg-coral/10 text-coral" : "border-border bg-card text-foreground hover:border-foreground"}`}>
                  {g}th
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="submit-description" className="mb-1.5 block text-sm font-semibold">Short description</label>
            <Textarea id="submit-description" name="description" required maxLength={1000} rows={4} placeholder="What is this program? Who is it for?" className="rounded-2xl" />
          </div>
          <Field label="Your email" name="submitter_email" type="email" required placeholder="you@school.edu" />

          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-6 text-cream hover:bg-coral hover:text-coral-foreground">
            {submitting ? "Saving..." : "Submit for review"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">By submitting you confirm the link points to an official program page.</p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `submit-${props.name}`;
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}{props.required && " *"}</label>
      <Input id={id} {...props} className="rounded-full" />
    </div>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  const id = `submit-${name}`;
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

export default Submit;
