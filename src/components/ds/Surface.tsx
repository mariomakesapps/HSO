import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** White card with a hairline border and an 8px radius. No shadow at rest. */
export function Surface({ as: Comp = "div", className, ...props }: HTMLAttributes<HTMLElement> & { as?: ElementType }) {
  return <Comp className={cn("rounded-hso border border-hso-line bg-hso-surface", className)} {...props} />;
}
