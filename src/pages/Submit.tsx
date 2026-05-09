import { useState } from "react";
import { z } from "zod";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().trim().min(2).max(160),
  org: z.string().trim().min(2).max(160),
  category: z.enum(["Research","Internship","Competition","Summer Program","Scholarship","Volunteer","Fellowship"]),
  url: z.string().trim().url().max(500),
  deadline: z.string().optional(),
  cost: z.enum(["Free","Paid","Stipend"]),
  format: z.enum(["In-person","Online","Hybrid"]),
  grades: z.array(z.number()).default([]),
  description: z.string().trim().min(20).max(1000),
  submitter_email: z.string().trim().email().max(255),
});

const Submit = () => {
  useSEO({ title: "Submit an opportunity — HSO", description: "Suggest a high school opportunity for HSO's curated directory." });
  const [submitting, setSubmitting] = useState(false);
  const [grades, setGrades] = useState<number[]>([9,10,11,12]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
      const first = parsed.error.issues[0];
      toast.error(first?.message || "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("opportunity_submissions").insert(parsed.data as any);
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit — please try again");
      return;
    }
    toast.success("Thanks — we'll review this opportunity.");
    (e.target as HTMLFormElement).reset();
    setGrades([9,10,11,12]);
  };

  const toggleGrade = (g: number) => {
    setGrades((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g].sort());
  };

  return (
    <div className="min-h-screen bg-background bg-grain">
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contribute</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Submit an opportunity</h1>
        <p className="mt-3 text-muted-foreground">Help other students. We review every submission and link only to official program pages.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Program name" name="title" required />
          <Field label="Organization" name="org" required />
          <Row>
            <SelectField label="Category" name="category" required options={["Research","Internship","Competition","Summer Program","Scholarship","Volunteer","Fellowship"]} />
            <SelectField label="Cost" name="cost" required options={["Free","Paid","Stipend"]} />
          </Row>
          <Row>
            <SelectField label="Format" name="format" required options={["In-person","Online","Hybrid"]} />
            <Field label="Deadline" name="deadline" type="date" />
          </Row>
          <Field label="Official URL" name="url" type="url" required placeholder="https://…" />
          <div>
            <p className="mb-2 text-sm font-semibold">Eligible grades</p>
            <div className="flex flex-wrap gap-2">
              {[9,10,11,12].map((g) => (
                <button type="button" key={g} onClick={() => toggleGrade(g)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${grades.includes(g) ? "border-coral bg-coral/10 text-coral" : "border-border bg-card text-foreground hover:border-foreground"}`}>
                  {g}th
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Short description</label>
            <Textarea name="description" required maxLength={1000} rows={4} placeholder="What is this program? Who is it for?" className="rounded-2xl" />
          </div>
          <Field label="Your email" name="submitter_email" type="email" required placeholder="you@school.edu" />

          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-6 text-cream hover:bg-coral hover:text-coral-foreground">
            {submitting ? "Sending…" : "Submit for review"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">By submitting you confirm the link points to an official program page.</p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}{props.required && " *"}</span>
      <Input {...props} className="rounded-full" />
    </label>
  );
}
function SelectField({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}{required && " *"}</span>
      <select name={name} required={required} defaultValue="" className="h-10 w-full rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none focus:border-foreground">
        <option value="" disabled>Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export default Submit;