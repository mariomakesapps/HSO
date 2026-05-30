import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Check, FolderHeart, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { localSignIn, localSignUp, useAuthSession } from "@/hooks/useAuthSession";
import { lovable } from "@/integrations/lovable/index";

function checkPassword(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

function friendlyAuthError(message: string, mode: "signin" | "signup"): string {
  const m = (message || "").toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials") || m.includes("invalid email or password"))
    return "That email and password don't match. Double-check and try again.";
  if (m.includes("already registered") || m.includes("already exists") || m.includes("user already"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("weak") || m.includes("password should") || m.includes("at least"))
    return "That password is too weak. Use 8+ characters with upper, lower, and a special character.";
  if (m.includes("rate") || m.includes("too many"))
    return "Too many attempts. Wait a moment and try again.";
  if (m.includes("oauth") || m.includes("google"))
    return "Google sign-in didn't complete. Please try again.";
  return message || (mode === "signup" ? "Could not create your account." : "Could not sign you in.");
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || (location.state as { returnTo?: string } | null)?.returnTo || sessionStorage.getItem("hso-auth-return-to") || "/";
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("/auth") ? rawRedirect : "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { isAuthed } = useAuthSession();
  const pwChecks = useMemo(() => checkPassword(password), [password]);
  const pwValid = pwChecks.length && pwChecks.upper && pwChecks.lower && pwChecks.special;

  useEffect(() => {
    sessionStorage.setItem("hso-auth-return-to", redirectTo);
    if (isAuthed) {
      sessionStorage.removeItem("hso-auth-return-to");
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthed, navigate, redirectTo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!pwValid) {
          toast({ title: "Password doesn't meet requirements", description: "Use 8+ characters with upper, lower, and a special character.", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast({ title: "Passwords do not match", description: "Retype your password so both fields match.", variant: "destructive" });
          setLoading(false);
          return;
        }
        await localSignUp(email, password);
        toast({ title: "Account created", description: "You're signed in and ready to save opportunities." });
        sessionStorage.removeItem("hso-auth-return-to");
        navigate(redirectTo, { replace: true });
      } else {
        await localSignIn(email, password);
        sessionStorage.removeItem("hso-auth-return-to");
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      toast({ title: mode === "signup" ? "Couldn't create account" : "Couldn't sign in", description: friendlyAuthError(err?.message ?? String(err), mode), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + redirectTo });
      if (result.error) {
        toast({ title: "Google sign-in failed", description: friendlyAuthError(result.error.message ?? String(result.error), mode), variant: "destructive" });
        setGoogleLoading(false);
        return;
      }
      if (!result.redirected) {
        sessionStorage.removeItem("hso-auth-return-to");
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: friendlyAuthError(err?.message ?? String(err), mode), variant: "destructive" });
      setGoogleLoading(false);
    }
  };

  const isSignup = mode === "signup";
  const switchMode = () => {
    setMode(isSignup ? "signin" : "signup");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div className="hso-bg-blobs" aria-hidden="true">
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
        <span className="b4" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-12">
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

          <div className="w-full min-w-0">
            <div className="mx-auto w-full max-w-md rounded-[22px] border border-border/60 bg-card/80 p-5 shadow-editorial backdrop-blur-md sm:p-8">
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
                    required minLength={isSignup ? 8 : 6}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "Create a strong password" : "Your password"}
                    className="h-11 rounded-xl border-border/70 bg-background/70 px-4 text-base focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30"
                  />
                </div>
                {isSignup && (
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70">Retype password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Type it one more time"
                      className="h-11 rounded-xl border-border/70 bg-background/70 px-4 text-base focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30"
                    />
                  </div>
                )}
                {isSignup && (
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-xl bg-muted/40 p-3 text-xs">
                    <PwRule ok={pwChecks.length} label="8+ characters" />
                    <PwRule ok={pwChecks.upper} label="Uppercase letter" />
                    <PwRule ok={pwChecks.lower} label="Lowercase letter" />
                    <PwRule ok={pwChecks.special} label="Special character" />
                  </ul>
                )}
                <Button
                  type="submit"
                  disabled={loading || (isSignup && !pwValid)}
                  className="h-11 w-full rounded-xl bg-ink text-cream shadow-soft transition-all duration-200 hover:bg-coral hover:text-coral-foreground hover:shadow-md"
                >
                  {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                <span className="h-px flex-1 bg-border/70" />
                or
                <span className="h-px flex-1 bg-border/70" />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onGoogle}
                disabled={googleLoading}
                className="h-11 w-full rounded-xl border-border/70 bg-background/70 text-sm font-medium hover:bg-muted/60"
              >
                <GoogleIcon />
                <span className="ml-2">{googleLoading ? "Opening Google..." : "Continue with Google"}</span>
              </Button>

              <p className="mt-6 text-center text-sm text-foreground/70">
                {isSignup ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  className="font-semibold text-ink underline-offset-4 transition-colors hover:text-coral hover:underline"
                  onClick={switchMode}
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

function PwRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1.5 ${ok ? "text-sage" : "text-foreground/60"}`}>
      {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5 opacity-60" />}
      <span>{label}</span>
    </li>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}

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

export default Auth;
