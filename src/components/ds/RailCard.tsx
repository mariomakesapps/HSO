import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/** A side-column card: title, a short list, and an optional "see all" link. */
export function RailCard({ title, icon: Icon, tone = "coral", children, more, className }: { title: string; icon?: LucideIcon; tone?: "coral" | "green"; children: ReactNode; more?: { to: string; label: string }; className?: string }) {
  return (
    <section className={cn("hso-rise rounded-hso border border-hso-line bg-hso-surface", className)}>
      <h2 className="flex items-center gap-2.5 px-4 pt-4 text-base font-semibold text-hso-fg">
        {Icon && (
          <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-hso", tone === "green" ? "bg-hso-green-tint text-hso-green-strong" : "bg-hso-coral-tint text-hso-coral-strong")}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        {title}
      </h2>
      <div className="px-4 pb-2 pt-2">{children}</div>
      {more && (
        <Link
          to={more.to}
          className="group flex min-h-hso-tap items-center gap-1 border-t border-hso-line px-4 text-sm font-semibold text-hso-coral-strong transition-colors hover:bg-hso-sunken"
        >
          {more.label}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </section>
  );
}
