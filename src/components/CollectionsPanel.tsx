import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { store, useStore } from "@/store/collections";
import { curatedCollections } from "@/data/curatedCollections";
import { opportunities } from "@/data/opportunities";

const opportunityById = new Map(opportunities.map((o) => [o.id, o]));
const curatedById = new Map(curatedCollections.map((c) => [c.id, c]));

export function CollectionsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const s = useStore();
  const [rendered, setRendered] = useState(open);
  const [entered, setEntered] = useState(false);

  const requestClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    let timeout = 0;
    if (open) {
      setRendered(true);
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => setEntered(true));
      });
    } else {
      setEntered(false);
      timeout = window.setTimeout(() => setRendered(false), 360);
    }
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") requestClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [rendered, requestClose]);

  if (!rendered) return null;

  const savedCollections = s.savedCurated
    .map((id) => curatedById.get(id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <>
      <button
        type="button"
        aria-label="Close shelf"
        onClick={requestClose}
        className={`fixed inset-x-0 bottom-0 top-[60px] z-[80] bg-ink/30 backdrop-blur-[2px] transition-opacity duration-300 ease-out md:top-[72px] ${entered ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed bottom-0 right-0 top-[60px] z-[90] flex w-[min(92vw,28rem)] transform-gpu flex-col border-l border-border bg-background shadow-editorial transition-transform duration-300 will-change-transform md:top-[72px] ${entered ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your shelf</p>
            <h2 className="font-display text-2xl">Saved</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={requestClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {s.favorites.length === 0 && savedCollections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral">
                <Bookmark className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-lg">Nothing saved yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save opportunities or curated collections and they'll show up here.
              </p>
              <Link
                to="/collections"
                onClick={requestClose}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-coral"
              >
                Browse curated collections
              </Link>
            </div>
          )}

          {s.favorites.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Favorites · {s.favorites.length}</p>
              <ul className="mt-2 space-y-1.5">
                {s.favorites.map((id) => {
                  const o = opportunityById.get(id);
                  if (!o) return null;
                  return (
                    <li key={id} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                      <Link to={`/opportunities/${o.id}`} onClick={requestClose} className="flex-1 truncate hover:text-coral">
                        {o.title}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${o.title} from favorites`}
                        onClick={() => {
                          void store.removeFavorite(o.id).catch((error: any) => toast.error(error.message ?? "Could not remove favorite"));
                          toast.success("Removed from favorites");
                        }}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {savedCollections.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Saved collections · {savedCollections.length}</p>
              <ul className="mt-2 space-y-2">
                {savedCollections.map((c) => (
                  <li key={c.id} className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="h-10" style={{ background: c.cover_gradient }} />
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Sparkles className="h-4 w-4 shrink-0 text-coral" />
                      <Link to={`/collections/${c.id}`} onClick={requestClose} className="min-w-0 flex-1 truncate text-sm font-semibold hover:text-coral">
                        {c.title}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Remove ${c.title} from shelf`}
                        onClick={() => {
                          void store.toggleCuratedSave(c.id).catch((error: any) => toast.error(error.message ?? "Could not remove collection"));
                        }}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}