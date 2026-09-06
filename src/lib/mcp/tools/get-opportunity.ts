import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog, serialize } from "../catalog";

export default defineTool({
  name: "get_opportunity",
  title: "Get opportunity details",
  description: "Return the full details of a single HSO opportunity by its id (as returned by search_opportunities).",
  inputSchema: { id: z.string().trim().min(1).describe("Opportunity id, e.g. 'rsi'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const match = catalog().find((o) => o.id === id);
    if (!match) throw new ToolError(`No opportunity found with id "${id}".`);
    const data = serialize(match);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: { opportunity: data },
    };
  },
});
