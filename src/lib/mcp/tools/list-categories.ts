import { defineTool } from "@lovable.dev/mcp-js";
import { catalog, categoryDirectory } from "../catalog";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description: "List the HSO opportunity categories with a short description, browse URL, and how many listings each holds.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const categories = categoryDirectory();
    return {
      content: [
        {
          type: "text" as const,
          text: `${catalog().length} total listings.\n\n${JSON.stringify(categories, null, 2)}`,
        },
      ],
      structuredContent: { totalListings: catalog().length, categories },
    };
  },
});
