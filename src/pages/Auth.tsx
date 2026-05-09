import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import hsoLogo from "@/assets/hso-logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(redirectTo, { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate(redirectTo, { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, redirectTo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + redirectTo },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your address to finish signing up." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + redirectTo });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grain flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-editorial">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full" aria-label="Go back">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <a href="/" className="flex items-center gap-2">
            <span className="relative inline-block h-9 w-9 overflow-hidden rounded-xl ring-1 ring-foreground/10">
              <img src={hsoLogo} alt="HSO logo" className="absolute inset-0 h-full w-full scale-[1.35] object-cover" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">HSO</span>
          </a>
          <div className="w-9" />
        </div>
        <h1 className="font-display text-3xl tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to save and organize opportunities." : "Save opportunities, build collections."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-ink text-cream hover:bg-coral hover:text-coral-foreground">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <Button onClick={onGoogle} disabled={loading} variant="outline" className="w-full rounded-full">
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-medium text-foreground underline underline-offset-4"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;