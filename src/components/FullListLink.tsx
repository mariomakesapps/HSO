import { Link } from "react-router-dom";
import { findTopic, topicListings, topicPath } from "@/lib/topics";

/**
 * From a guide to the topic page with every matching listing. The guide compares
 * a handful of programs; the topic page is the full list, so the two answer
 * different searches instead of competing for the same one.
 */
export function FullListLink({ parent, slug, phrase }: { parent: string; slug: string; phrase: string }) {
  const topic = findTopic(parent, slug);
  if (!topic) return null;
  return (
    <p className="mt-4 text-base text-muted-foreground">
      Want every option, not just these?{" "}
      <Link to={topicPath(topic)} className="font-semibold text-ink underline underline-offset-4 hover:text-coral">
        See all {topicListings(topic).length} {phrase} for high school students
      </Link>
      .
    </p>
  );
}
