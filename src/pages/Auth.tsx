import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { clearAuthReturnTo, consumeAuthReturnTo, rememberAuthReturnTo, sanitizeAuthReturnTo } from "@/hooks/useAuthSession";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const locationState = location.state as { returnTo?: string } | null;
  const redirectTo = sanitizeAuthReturnTo(locationState?.returnTo) ?? sanitizeAuthReturnTo(searchParams.get("redirect")) ?? "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSent, setSignupSent] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate(consumeAuthReturnTo(redirectTo), { replace: true });
    });
    rememberAuthReturnTo(redirectTo);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(consumeAuthReturnTo(redirectTo), { replace: true });
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
        setSignupSent(true);
        clearAuthReturnTo();
        toast({ title: "Check your email", description: "Confirm your address to finish signing up." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(consumeAuthReturnTo(redirectTo), { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    rememberAuthReturnTo(redirectTo);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-background bg-grain px-6 py-10 md:min-h-[calc(100vh-72px)]">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-editorial">
        <Link to="/" className="mb-8 inline-flex items-center font-display text-3xl font-semibold leading-none tracking-tight" aria-label="HSO home">
          <span className="text-ink">H</span><span className="text-coral">S</span><span className="text-sage">O</span>
        </Link>
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
        {signupSent && (
          <Link to="/" className="mt-4 block text-center text-sm font-medium text-coral underline-offset-4 hover:underline">
            Back to homepage
          </Link>
        )}
      </div>
    </div>
  );
};

export default Auth;