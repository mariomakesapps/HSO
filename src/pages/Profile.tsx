import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, FolderHeart, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/collections";
import { authRedirectHref, localSignOut, useAuthSession } from "@/hooks/useAuthSession";

export default function Profile() {
  const { session, loading } = useAuthSession();
  const navigate = useNavigate();
  const shelf = useStore();

  useEffect(() => {
    if (!loading && !session) navigate(authRedirectHref("/profile"), { replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) return null;

  const email = session.user.email;
  const initial = (email[0] || "?").toUpperCase();

  const onSignOut = async () => {
    try {
      await localSignOut();
      toast.success("Signed out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message ?? "Could not sign out");
    }
  };

  return (
    <main className="relative mx-auto max-w-3xl px-4 pb-24 pt-8 md:px-6 md:pt-12">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-coral">
        <ArrowLeft className="h-4 w-4" /> Back home
      </Link>

      <div className="hso-glass-panel hso-surface-grid mt-6 overflow-hidden rounded-[22px] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral to-ochre text-2xl font-bold text-cream shadow-soft">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your account</p>
            <h1 className="font-display text-3xl leading-tight">
              <span className="text-ink">H</span><span className="text-coral">S</span><span className="text-sage">O</span> profile
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="hso-elevated-surface rounded-2xl p-5">
            <Bookmark className="h-5 w-5 text-coral" />
            <p className="mt-3 font-display text-3xl leading-none">{shelf.favorites.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Saved opportunities</p>
          </div>
          <div className="hso-elevated-surface rounded-2xl p-5">
            <FolderHeart className="h-5 w-5 text-sage" />
            <p className="mt-3 font-display text-3xl leading-none">{shelf.collections.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Collections</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/65 bg-cream/48 p-5 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)]">
          <p className="font-display text-xl text-ink">Account mode</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            HSO now uses Supabase Auth and cloud collections, so saved opportunities and folders can sync across devices after the database migration is applied.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => navigate("/")} className="rounded-xl bg-ink text-cream hover:bg-coral">
            Explore opportunities
          </Button>
          <Button onClick={onSignOut} variant="outline" className="rounded-xl border-coral/30 text-coral hover:bg-coral/10">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </main>
  );
}
