import { useState } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  reason: z.enum(["Outdated deadline","Missing opportunity","Broken link","General contact"]),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(2000),
  related_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

const Contact = () => {
  useSEO({ title: "Contact & corrections — HSO", description: "Report an outdated deadline, broken link, or missing opportunity, or get in touch with HSO." });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      reason: String(fd.get("reason") || "") as any,
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
      related_url: String(fd.get("related_url") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || "Please check the form"); return; }
    setSubmitting(true);
    const payload = { ...parsed.data, related_url: parsed.data.related_url || null };
    const { error } = await supabase.from("contact_messages").insert(payload as any);
    setSubmitting(false);
    if (error) { toast.error("Couldn't send — please try again"); return; }
    toast.success("Thanks — we'll review your message.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background bg-grain">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Help us improve</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Contact & corrections</h1>
        <p className="mt-3 text-muted-foreground">Spotted an outdated deadline or a broken link? Tell us — corrections usually ship within a few days.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Reason *</span>
            <select name="reason" required defaultValue="" className="h-10 w-full rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none focus:border-foreground">
              <option value="" disabled>Select…</option>
              {["Outdated deadline","Missing opportunity","Broken link","General contact"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Your email *</span>
            <Input name="email" type="email" required className="rounded-full" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Related URL (if any)</span>
            <Input name="related_url" type="url" placeholder="https://…" className="rounded-full" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Message *</span>
            <Textarea name="message" required maxLength={2000} rows={5} className="rounded-2xl" />
          </label>
          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-ink py-6 text-cream hover:bg-coral hover:text-coral-foreground">
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
};
export default Contact;