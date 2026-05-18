import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bookmark, FolderHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { localSignIn, localSignUp, useAuthSession } from "@/hooks/useAuthSession";

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
  const { isAuthed } = useAuthSession();

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
      toast({ title: "Authentication error", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setLoading(false);
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
      {/* Ambient background blobs */}
      <div className="hso-bg-blobs" aria-hidden="true">
        <span className="b1" />
        <span className="b2" />
        <span className="b3" />
        <span className="b4" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-12">
          {/* Left brand panel  -  desktop only */}
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
              HSO is a curated discovery space for U.S. high schoolers  -  internships, research, scholarships, summer programs, and more.
            </p>
            <ul className="mt-8 space-y-4">
              <Feature icon={<Bookmark className="h-4 w-4" />} title="Save your favorite opportunities" desc="One tap to bookmark anything that catches your eye." />
              <Feature icon={<FolderHeart className="h-4 w-4" />} title="Build folders for what matters" desc="Group summer programs, scholarships, and research separately." />
              <Feature icon={<Sparkles className="h-4 w-4" />} title="Come back anytime" desc="Pick up where you left off across any device." />
            </ul>
          </aside>

          {/* Auth card */}
          <div className="w-full min-w-0">
            <div className="mx-auto w-full max-w-md rounded-[22px] border border-border/60 bg-card/80 p-5 shadow-editorial backdrop-blur-md sm:p-8">
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
                {isSignup && (
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70">Retype password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Type it one more time"
                      className="h-11 rounded-xl border-border/70 bg-background/70 px-4 text-base focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-ink text-cream shadow-soft transition-all duration-200 hover:bg-coral hover:text-coral-foreground hover:shadow-md"
                >
                  {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
                </Button>
              </form>

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
              Browsing programs and links is always free  -  accounts are just for saving and folders.
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

export default Auth;

