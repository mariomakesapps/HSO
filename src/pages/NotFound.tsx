import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSEO } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();
  useSEO({
    title: "Page not found (404) — HSO",
    description:
      "We couldn't find that page on HSO. Head back to the home page to browse curated high school opportunities — internships, scholarships, research, and more.",
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
