import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "ready" | "already" | "invalid" | "submitting" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } },
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data?.valid) {
          setEmail(data.email ?? null);
          setStatus(data.alreadyUnsubscribed || data.already_unsubscribed ? "already" : "ready");
        } else {
          setStatus("invalid");
        }
      } catch {
        if (!cancelled) setStatus("invalid");
      }
    })();
    return () => { cancelled = true; };
  }, [token, supabaseUrl, supabaseAnonKey]);

  const confirm = async () => {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) {
        setErrorMsg(error.message ?? "Could not complete unsubscribe.");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Could not complete unsubscribe.");
      setStatus("error");
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-soft">
        <h1 className="font-display text-3xl tracking-tight text-ink">Unsubscribe from HSO emails</h1>

        {status === "loading" && (
          <p className="mt-4 text-foreground/70">Checking your link…</p>
        )}

        {status === "invalid" && (
          <p className="mt-4 text-foreground/70">
            This unsubscribe link is invalid or has expired. If you keep receiving emails you didn't sign up for, please contact us.
          </p>
        )}

        {status === "already" && (
          <p className="mt-4 text-foreground/70">
            {email ? <><strong>{email}</strong> is already unsubscribed.</> : "This address is already unsubscribed."}
          </p>
        )}

        {(status === "ready" || status === "submitting") && (
          <>
            <p className="mt-4 text-foreground/75">
              {email ? (<>Unsubscribe <strong>{email}</strong> from non-essential HSO emails?</>) : "Unsubscribe from non-essential HSO emails?"}
            </p>
            <p className="mt-2 text-sm text-foreground/55">
              You'll still receive critical account emails like password resets.
            </p>
            <div className="mt-6">
              <Button onClick={confirm} disabled={status === "submitting"} className="h-11 rounded-xl bg-ink text-cream hover:bg-coral hover:text-coral-foreground">
                {status === "submitting" ? "Unsubscribing…" : "Confirm unsubscribe"}
              </Button>
            </div>
          </>
        )}

        {status === "done" && (
          <p className="mt-4 text-foreground/75">
            You've been unsubscribed{email ? <>: <strong>{email}</strong></> : ""}. Sorry to see you go.
          </p>
        )}

        {status === "error" && (
          <>
            <p className="mt-4 text-foreground/70">Something went wrong. {errorMsg}</p>
            <div className="mt-6">
              <Button onClick={confirm} className="h-11 rounded-xl bg-ink text-cream hover:bg-coral hover:text-coral-foreground">Try again</Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;