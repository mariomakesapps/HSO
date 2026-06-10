import { useState } from "react";
import { z } from "zod";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  reason: z.enum(["Outdated deadline", "Missing opportunity", "Broken link", "General contact"]),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(2000),
  related_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

const Contact = () => {
  useSEO({ title: "Contact & corrections - HSO", description: "Report an outdated deadline, broken link, or missing opportunity, or get in touch with HSO." });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Honeypot — bots tend to fill every field
    if (String(fd.get("website") || "").trim() !== "") {
      toast.success("Thanks - message sent.");
      (e.target as HTMLFormElement).reset();
      return;
    }
    const raw = {
      reason: String(fd.get("reason") || "") as any,
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
      related_url: String(fd.get("related_url") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    setSubmitting(true);
    const dbPayload = { ...parsed.data, related_url: parsed.data.related_url || null };
    // Store a record (best-effort) and notify the team via email.
    const [dbResult, emailResult] = await Promise.all([
      (supabase as any).from("contact_messages").insert(dbPayload),
      supabase.functions.invoke("send-form-notification", {
        body: { type: "contact", ...parsed.data },
      }),
    ]);
    setSubmitting(false);
    if (emailResult.error) {
      console.error("Contact email failed", emailResult.error, dbResult?.error);
      toast.error("Something went wrong. Please try again or email us directly at highschoolopportunity@gmail.com.");
      return;
    }
    toast.success("Thanks — your message was sent.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Help us improve</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Contact & corrections</h1>
        <p className="mt-3 text-muted-foreground">Spotted an outdated deadline or a broken link? Tell us and it will be saved to the HSO backend.</p>

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
          <div className="block">
            <label htmlFor="contact-reason" className="mb-1.5 block text-sm font-semibold">Reason *</label>
            <select id="contact-reason" name="reason" required defaultValue="" className="h-10 w-full rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none focus:border-foreground">
              <option value="" disabled>Select...</option>
              {["Outdated deadline", "Missing opportunity", "Broken link", "General contact"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="block">
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold">Your email *</label>
            <Input id="contact-email" name="email" type="email" required className="rounded-full" />
          </div>
          <div className="block">
            <label htmlFor="contact-related-url" className="mb-1.5 block text-sm font-semibold">Related URL, if any</label>
            <Input id="contact-related-url" name="related_url" type="url" placeholder="https://..." className="rounded-full" />
          </div>
          <div className="block">
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold">Message *</label>
            <Textarea id="contact-message" name="message" required maxLength={2000} rows={5} className="rounded-2xl" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-6 text-cream hover:bg-coral hover:text-coral-foreground">
            {submitting ? "Saving..." : "Send message"}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Contact;
