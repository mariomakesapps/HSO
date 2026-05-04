import { useState } from "react";
import { store, useStore } from "@/store/collections";
import { opportunities } from "@/data/opportunities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Share2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const EMOJIS = ["✨","🌞","🚀","🧪","📚","🎨","🌍","💡","🏆","🩺"];

export function CollectionsPanel({ onClose }: { onClose: () => void }) {
  const s = useStore();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");

  const create = () => {
    if (!name.trim()) return;
    store.createCollection(name.trim(), emoji);
    setName("");
    setEmoji("✨");
    toast.success("Collection created");
  };

  const share = (id: string) => {
    const c = s.collections.find((x) => x.id === id);
    if (!c) return;
    const titles = c.opportunityIds
      .map((oid) => opportunities.find((o) => o.id === oid)?.title)
      .filter(Boolean)
      .join("\n• ");
    const text = `${c.emoji} ${c.name}\n\n• ${titles || "(empty)"}`;
    navigator.clipboard.writeText(text);
    toast.success("Collection copied to clipboard — share with friends!");
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-editorial animate-fade-up">
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your shelf</p>
          <h2 className="font-display text-2xl">Collections</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-semibold">New collection</p>
          <div className="mt-3 flex gap-2">
            <select
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="rounded-md border border-border bg-background px-2 text-lg"
            >
              {EMOJIS.map((e) => <option key={e}>{e}</option>)}
            </select>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dream Summer 2026…" onKeyDown={(e) => e.key === "Enter" && create()} />
            <Button onClick={create} className="bg-ink text-cream hover:bg-ink/90"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        {s.favorites.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Favorites · {s.favorites.length}</p>
            <ul className="mt-2 space-y-1.5">
              {s.favorites.map((id) => {
                const o = opportunities.find((x) => x.id === id);
                if (!o) return null;
                return <li key={id} className="rounded-lg bg-secondary px-3 py-2 text-sm">{o.title}</li>;
              })}
            </ul>
          </div>
        )}

        {s.collections.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl"><span className="mr-2">{c.emoji}</span>{c.name}</p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => share(c.id)}><Share2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => store.deleteCollection(c.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{c.opportunityIds.length} opportunit{c.opportunityIds.length === 1 ? "y" : "ies"}</p>
            {c.opportunityIds.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {c.opportunityIds.map((id) => {
                  const o = opportunities.find((x) => x.id === id);
                  if (!o) return null;
                  return <li key={id} className="rounded-lg bg-secondary px-3 py-2 text-sm">{o.title}</li>;
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}