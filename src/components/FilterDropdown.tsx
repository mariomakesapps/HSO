import { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DropdownOption = { value: string; label: string };

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  searchable = false,
  searchPlaceholder = "Search...",
  className,
  align = "start",
  fullWidth = false,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.value === "All" || o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (!open) {
      setQuery("");
    }
  }, [open, searchable]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex h-11 min-w-0 items-center gap-2 rounded-full border border-border/80 bg-card/90 px-4 text-sm font-medium shadow-soft transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 active:translate-y-0 sm:h-10",
            fullWidth && "w-full justify-between",
            className,
          )}
          aria-expanded={open}
        >
          <span className="truncate">
            <span className="text-muted-foreground">{label} / </span>
            <span className="font-semibold text-ink">{selected?.label ?? "All"}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={6}
        className="w-[var(--radix-popover-trigger-width)] min-w-[220px] max-w-[340px] rounded-2xl border-border/70 bg-cream/96 p-0 text-ink shadow-editorial backdrop-blur-md"
      >
        {searchable && (
          <div className="border-b border-border/60 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-lg border border-border/60 bg-background pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-coral/60"
              />
            </div>
          </div>
        )}
        <div
          className="hso-scroll max-h-[60vh] overflow-y-auto overscroll-contain p-1 sm:max-h-[300px]"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          onTouchMove={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">No matches.</p>
          ) : (
            filtered.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-coral/10 font-semibold text-ink"
                      : "text-foreground hover:bg-ink/5",
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0 text-coral" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
