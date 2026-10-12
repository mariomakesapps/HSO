import type { Category } from "@/data/opportunities";
import { CATEGORY_STYLE } from "@/lib/categoryStyle";
import { cn } from "@/lib/utils";

/** Small colored category label with its icon, shown above a card's title. */
export function CategoryTag({ category, className }: { category: Category; className?: string }) {
  const s = CATEGORY_STYLE[category];
  const Icon = s.icon;
  return (
    <p className={cn("flex items-center gap-1.5 text-xs font-semibold", s.text, className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {s.label}
    </p>
  );
}
