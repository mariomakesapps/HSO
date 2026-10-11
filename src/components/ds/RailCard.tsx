import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/** A side-column card: title, a short list, and an optional "see all" link. */
export function RailCard({ title, children, more, className }: { title: string; children: ReactNode; more?: { to: string; label: string }; className?: string }) {
  return (
    <section className={cn("rounded-hso border border-hso-line bg-hso-surface", className)}>
      <h2 className="px-4 pt-4 text-base font-semibold text-hso-fg">{title}</h2>
      <div className="px-4 pb-2 pt-2">{children}</div>
      {more && (
        <Link
          to={more.to}
          className="flex min-h-hso-tap items-center border-t border-hso-line px-4 text-sm font-semibold text-hso-coral-strong hover:bg-hso-sunken hover:underline"
        >
          {more.label}
        </Link>
      )}
    </section>
  );
}
