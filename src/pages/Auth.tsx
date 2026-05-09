import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bookmark, FolderHeart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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

  const isSignup = mode === "signup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      {/* Ambient background blobs */}
      <div className="hso-bg-blobs" aria-hidden="true">
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
        <span className="b4" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-12">
          {/* Left brand panel — desktop only */}
          <aside className="hidden lg:block">
            <Link to="/" className="inline-flex items-baseline font-display text-3xl font-bold leading-none tracking-tight">
              <span className="text-ink">H</span>
              <span className="text-coral">S</span>
              <span className="text-sage">O</span>
            </Link>
            <h2 className="mt-8 font-display text-4xl leading-[1.05] tracking-tight text-ink">
              Your shelf of <span className="text-coral">opportunities</span>, <br />
              ready when you are.
            </h2>
            <p className="mt-5 max-w-md text-base text-foreground/70">
              HSO is a curated discovery space for U.S. high schoolers — internships, research, scholarships, summer programs, and more.
            </p>
            <ul className="mt-8 space-y-4">
              <Feature icon={<Bookmark className="h-4 w-4" />} title="Save your favorite opportunities" desc="One tap to bookmark anything that catches your eye." />
              <Feature icon={<FolderHeart className="h-4 w-4" />} title="Build folders for what matters" desc="Group summer programs, scholarships, and research separately." />
              <Feature icon={<Sparkles className="h-4 w-4" />} title="Come back anytime" desc="Pick up where you left off across any device." />
            </ul>
          </aside>

          {/* Auth card */}
          <div className="w-full">
            <div className="rounded-[22px] border border-border/60 bg-card/80 p-6 shadow-editorial backdrop-blur-md sm:p-8">
              {/* Top bar: back + wordmark */}
              <div className="mb-6 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="rounded-full text-muted-foreground hover:bg-coral/10 hover:text-coral"
                  aria-label="Back to home"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Link to="/" aria-label="HSO home" className="inline-flex items-baseline font-display text-2xl font-bold leading-none tracking-tight">
                  <span className="text-ink">H</span>
                  <span className="text-coral">S</span>
                  <span className="text-sage">O</span>
                </Link>
                <div className="w-9" aria-hidden="true" />
              </div>

              <h1 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-[2rem]">
                {isSignup ? "Create your HSO account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-sm text-foreground/70 sm:text-[15px]">
                {isSignup
                  ? "Save programs, build folders, and keep track of opportunities you care about."
                  : "Save opportunities, organize folders, and pick up where you left off."}
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70">Email</Label>
                  <Input
                    id="email" type="email" autoComplete="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className="h-11 rounded-xl border-border/70 bg-background/70 px-4 text-base focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70">Password</Label>
                  <Input
                    id="password" type="password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    required minLength={6}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "At least 6 characters" : "Your password"}
                    className="h-11 rounded-xl border-border/70 bg-background/70 px-4 text-base focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-ink text-cream shadow-soft transition-all duration-200 hover:bg-coral hover:text-coral-foreground hover:shadow-md"
                >
                  {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                or
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              <Button
                onClick={onGoogle}
                disabled={loading}
                variant="outline"
                className="h-11 w-full rounded-xl border-border/70 bg-background/60 text-foreground hover:bg-secondary"
              >
                <GoogleG className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>

              <p className="mt-6 text-center text-sm text-foreground/70">
                {isSignup ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  className="font-semibold text-ink underline-offset-4 transition-colors hover:text-coral hover:underline"
                  onClick={() => setMode(isSignup ? "signin" : "signup")}
                >
                  {isSignup ? "Sign in" : "Create account"}
                </button>
              </p>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Browsing programs and links is always free — accounts are just for saving and folders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral/12 text-coral">{icon}</span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="text-sm text-foreground/65">{desc}</p>
      </div>
    </li>
  );
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default Auth;
