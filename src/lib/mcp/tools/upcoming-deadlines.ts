import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORIES, catalog, serialize } from "../catalog";

export default defineTool({
  name: "upcoming_deadlines",
  title: "Upcoming deadlines",
  description: "List HSO opportunities whose posted application deadline falls within the next N days, soonest first.",
  inputSchema: {
    withinDays: z.number().int().min(1).max(365).default(30).describe("How many days ahead to look."),
    category: z.enum(CATEGORIES).optional().describe("Restrict to one category."),
    grade: z.number().int().min(9).max(12).optional().describe("Only listings open to this grade."),
    limit: z.number().int().min(1).max(50).default(15).describe("Maximum number of results."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ withinDays = 30, category, grade, limit = 15 }) => {
    const today = new Date();
    const start = today.toISOString().slice(0, 10);
    const end = new Date(today.getTime() + withinDays * 86400000).toISOString().slice(0, 10);

    const matches = catalog()
      .filter((o) => {
        if (!o.deadline) return false;
        if (o.deadline < start || o.deadline > end) return false;
        if (category && o.category !== category) return false;
        if (grade && !(o.grades ?? []).includes(grade)) return false;
        return true;
      })
      .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""));

    const results = matches.slice(0, limit).map(serialize);
    return {
      content: [
        {
          type: "text" as const,
          text:
            results.length === 0
              ? `No posted deadlines between ${start} and ${end}.`
              : `Deadlines between ${start} and ${end} — ${matches.length} match(es), showing ${results.length}.\n\n${JSON.stringify(results, null, 2)}`,
        },
      ],
      structuredContent: { from: start, to: end, totalMatches: matches.length, results },
    };
  },
});
