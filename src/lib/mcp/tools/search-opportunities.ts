import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORIES, catalog, matchesQuery, serialize } from "../catalog";

export default defineTool({
  name: "search_opportunities",
  title: "Search opportunities",
  description:
    "Search the HSO catalog of U.S. high school opportunities (summer programs, internships, research, competitions, scholarships, fellowships). Filter by keyword, category, grade, cost, format, or deadline window.",
  inputSchema: {
    query: z.string().trim().optional().describe("Keyword search across title, organization, description, field, and location."),
    category: z.enum(CATEGORIES).optional().describe("Restrict results to one category."),
    grade: z.number().int().min(9).max(12).optional().describe("Only listings open to this grade (9-12)."),
    cost: z.enum(["Free", "Paid", "Stipend"]).optional().describe("Cost type of the program."),
    format: z.enum(["In-person", "Online", "Hybrid"]).optional().describe("Delivery format."),
    state: z.string().trim().optional().describe("Match against the location string, e.g. 'California', 'Online', 'USA'."),
    deadlineBefore: z.string().trim().optional().describe("ISO date (YYYY-MM-DD); only listings with a posted deadline on or before this date."),
    deadlineAfter: z.string().trim().optional().describe("ISO date (YYYY-MM-DD); only listings with a posted deadline on or after this date."),
    minPrestige: z.number().int().min(1).max(3).optional().describe("1 = any, 3 = most selective / top tier."),
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    const {
      query = "",
      category,
      grade,
      cost,
      format,
      state,
      deadlineBefore,
      deadlineAfter,
      minPrestige,
      limit = 10,
    } = input;

    const filtered = catalog().filter((o) => {
      if (!matchesQuery(o, query)) return false;
      if (category && o.category !== category) return false;
      if (grade && !(o.grades ?? []).includes(grade)) return false;
      if (cost && o.cost !== cost) return false;
      if (format && o.format !== format) return false;
      if (state && !o.location.toLowerCase().includes(state.toLowerCase())) return false;
      if (minPrestige && o.prestige < minPrestige) return false;
      if (deadlineBefore && (!o.deadline || o.deadline > deadlineBefore)) return false;
      if (deadlineAfter && (!o.deadline || o.deadline < deadlineAfter)) return false;
      return true;
    });

    const ranked = [...filtered].sort((a, b) => {
      if (b.prestige !== a.prestige) return b.prestige - a.prestige;
      const ad = a.deadline ?? "9999-12-31";
      const bd = b.deadline ?? "9999-12-31";
      return ad.localeCompare(bd);
    });

    const results = ranked.slice(0, limit).map(serialize);

    return {
      content: [
        {
          type: "text" as const,
          text:
            results.length === 0
              ? "No opportunities matched those filters."
              : `${filtered.length} match(es); showing ${results.length}.\n\n${JSON.stringify(results, null, 2)}`,
        },
      ],
      structuredContent: { totalMatches: filtered.length, returned: results.length, results },
    };
  },
});
