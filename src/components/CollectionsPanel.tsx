import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Plus, Share2, Trash2, X } from "lucide-react";
import { opportunities } from "@/data/opportunities";
import { store, useStore } from "@/store/collections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const opportunityById = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));

export function CollectionsPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const s = useStore();
  const [name, setName] = useState("");
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

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [rendered, requestClose]);

  if (!rendered) return null;

  const create = () => {
    if (!name.trim()) return;
    const nextName = name.trim();
    setName("");
    void store
      .createCollection(nextName)
      .then(() => toast.success("Collection created"))
      .catch((error: any) => {
        setName(nextName);
        toast.error(error.message ?? "Could not create collection");
      });
  };

  const share = (id: string) => {
    const c = s.collections.find((x) => x.id === id);
    if (!c) return;
    const titles = c.opportunityIds
      .map((oid) => opportunityById.get(oid)?.title)
      .filter(Boolean)
      .join("\n- ");
    const text = `${c.name}\n\n- ${titles || "(empty)"}`;
    void navigator.clipboard.writeText(text);
    toast.success("Collection copied");
  };

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
        className={`fixed bottom-0 right-0 top-[64px] z-[90] flex w-[min(92vw,28rem)] transform-gpu flex-col border-l border-border bg-background shadow-editorial transition-transform duration-300 will-change-transform md:top-[76px] ${entered ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your shelf</p>
            <h2 className="font-display text-2xl">Collections</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={requestClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">New collection</p>
            <div className="mt-3 flex gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dream Summer 2026..." onKeyDown={(e) => e.key === "Enter" && create()} />
              <Button onClick={create} className="bg-ink text-cream hover:bg-ink/90"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          {s.favorites.length === 0 && s.collections.every((c) => c.opportunityIds.length === 0) && (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral/10 text-coral">
                <Bookmark className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-lg">No saved opportunities yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save programs you're interested in and they'll appear here.
              </p>
              <Link
                to="/"
                onClick={requestClose}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-coral"
              >
                Explore opportunities
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
                        onClick={() => { void store.removeFavorite(o.id).catch((error: any) => toast.error(error.message ?? "Could not remove favorite")); toast.success("Removed from favorites"); }}
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

          {s.collections.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-xl">{c.name}</p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => share(c.id)} title="Copy collection"><Share2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { void store.deleteCollection(c.id).catch((error: any) => toast.error(error.message ?? "Could not delete collection")); }} title="Delete collection"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{c.opportunityIds.length} opportunit{c.opportunityIds.length === 1 ? "y" : "ies"}</p>
              {c.opportunityIds.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {c.opportunityIds.map((id) => {
                    const o = opportunityById.get(id);
                    if (!o) return null;
                    return (
                      <li key={id} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                        <Link to={`/opportunities/${o.id}`} onClick={requestClose} className="flex-1 truncate hover:text-coral">
                          {o.title}
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${o.title} from ${c.name}`}
                          onClick={() => { void store.removeFromCollection(c.id, o.id).catch((error: any) => toast.error(error.message ?? "Could not remove item")); toast.success(`Removed from ${c.name}`); }}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-coral/10 hover:text-coral"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
