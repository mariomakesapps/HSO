import { Briefcase, FlaskConical, GraduationCap, HeartHandshake, Star, Sun, Trophy, type LucideIcon } from "lucide-react";
import type { Category } from "@/data/opportunities";

/**
 * Each category's icon and brand hue. Only the two brand colors are used,
 * alternating, so a list reads as lively without adding new accent colors.
 */
export const CATEGORY_STYLE: Record<Category, { icon: LucideIcon; label: string; text: string; tile: string }> = {
  Internship: { icon: Briefcase, label: "Internship", text: "text-hso-coral-strong", tile: "bg-hso-coral-tint text-hso-coral-strong" },
  "Summer Program": { icon: Sun, label: "Summer program", text: "text-hso-green-strong", tile: "bg-hso-green-tint text-hso-green-strong" },
  Scholarship: { icon: GraduationCap, label: "Scholarship", text: "text-hso-coral-strong", tile: "bg-hso-coral-tint text-hso-coral-strong" },
  Research: { icon: FlaskConical, label: "Research", text: "text-hso-green-strong", tile: "bg-hso-green-tint text-hso-green-strong" },
  Competition: { icon: Trophy, label: "Competition", text: "text-hso-coral-strong", tile: "bg-hso-coral-tint text-hso-coral-strong" },
  Fellowship: { icon: Star, label: "Fellowship", text: "text-hso-green-strong", tile: "bg-hso-green-tint text-hso-green-strong" },
  Volunteer: { icon: HeartHandshake, label: "Volunteer", text: "text-hso-green-strong", tile: "bg-hso-green-tint text-hso-green-strong" },
};
