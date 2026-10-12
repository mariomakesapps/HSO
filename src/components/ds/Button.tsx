import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  // Coral is reserved for the one main action on a view.
  primary: "bg-hso-coral text-white hover:bg-hso-coral-strong",
  secondary: "border border-hso-line-strong bg-hso-surface text-hso-fg hover:border-hso-fg hover:bg-hso-sunken",
  ghost: "text-hso-muted hover:bg-hso-sunken hover:text-hso-fg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Render the child element (a <Link> or <a>) with button styling. */
  asChild?: boolean;
  /** Square icon-only button; still a 44px tap target. */
  icon?: boolean;
}

/** The site's one button. Every size keeps a 44px minimum tap target. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", asChild, icon, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex min-h-hso-tap items-center justify-center gap-2 rounded-hso text-sm font-semibold",
        "hso-press disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong",
        icon ? "min-w-hso-tap px-0" : "px-4",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
});
