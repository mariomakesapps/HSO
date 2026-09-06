import { defineMcp } from "@lovable.dev/mcp-js";
import searchOpportunities from "./tools/search-opportunities";
import getOpportunity from "./tools/get-opportunity";
import listCategories from "./tools/list-categories";
import upcomingDeadlines from "./tools/upcoming-deadlines";

export default defineMcp({
  name: "hso",
  title: "HSO",
  version: "0.1.0",
  instructions:
    "Tools for HSO (High School Opportunity), a curated finder of U.S. high school opportunities: summer programs, internships, research, competitions, scholarships, and fellowships. Use `list_categories` to see what exists, `search_opportunities` to filter by keyword, category, grade, cost, format, location, or deadline window, `upcoming_deadlines` for what closes soon, and `get_opportunity` for a single listing's full details. Every result includes the official program URL — always confirm details there.",
  tools: [searchOpportunities, getOpportunity, listCategories, upcomingDeadlines],
});
