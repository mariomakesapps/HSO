import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { store, useFavoriteStatus } from "@/store/collections";
import { authRedirectHref, useAuthSession } from "@/hooks/useAuthSession";
import { cn } from "@/lib/utils";

/**
 * Bookmark toggle. Saving gives quick feedback: the icon fills coral with a short
 * pop, and a toast says where to find it. Signed-out students get a toast with a
 * sign-in action instead of a surprise redirect.
 */
export function SaveButton({ id, title, className }: { id: string; title: string; className?: string }) {
  const saved = useFavoriteStatus(id);
  const { isAuthed } = useAuthSession();
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);

  const onClick = async () => {
    if (!isAuthed) {
      toast.message("Sign in to save", {
        description: "A free account keeps your saved programs in one place.",
        action: { label: "Sign in", onClick: () => navigate(authRedirectHref()) },
      });
      return;
    }
    const was = saved;
    if (!was) setPop(true);
    try {
      await store.toggleFavorite(id);
      toast.success(was ? "Removed from My Shelf" : "Saved to My Shelf");
    } catch (error) {
      toast.error((error as Error)?.message ?? "Could not save that. Try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from My Shelf` : `Save ${title}`}
      className={cn(
        "hso-press relative inline-flex h-11 w-11 items-center justify-center rounded-hso text-hso-muted",
        "hover:bg-hso-sunken hover:text-hso-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong",
        saved && "text-hso-coral hover:text-hso-coral-strong",
        pop && "hso-save-ring",
        className,
      )}
    >
      <Bookmark
        className={cn("h-5 w-5", saved && "fill-current", pop && "hso-save-pop")}
        onAnimationEnd={() => setPop(false)}
        aria-hidden="true"
      />
    </button>
  );
}
