import { useEffect, type ComponentType } from "react";
import { matchPath } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import { AppRoutes, type PageComponents } from "./AppRoutes";

const queryClient = new QueryClient();

/**
 * React.lazy, but able to render synchronously once its module has loaded.
 *
 * The build writes each page's fully rendered HTML into #root. React.lazy always
 * suspends on first render, which made the app replace that HTML with the empty
 * Suspense fallback for a moment on every page load. A page loaded through
 * lazyPage renders immediately when its module is already in memory, so
 * main.tsx preloads the current route (preloadRoute) and the swap from the
 * prerendered HTML to the live app is seamless.
 */
type PageModule = { default: ComponentType };
type LazyPage = ComponentType & { preload: () => Promise<PageModule> };

function lazyPage(factory: () => Promise<PageModule>): LazyPage {
  let Loaded: ComponentType | null = null;
  let pending: Promise<PageModule> | null = null;
  const preload = () =>
    (pending ??= factory().then((m) => {
      Loaded = m.default;
      return m;
    }));
  const Page = (props: Record<string, unknown>) => {
    if (Loaded) return <Loaded {...props} />;
    throw preload();
  };
  return Object.assign(Page, { preload }) as LazyPage;
}


const Index = lazyPage(() => import("./pages/Index.tsx"));
const NotFound = lazyPage(() => import("./pages/NotFound.tsx"));
const Auth = lazyPage(() => import("./pages/Auth.tsx"));
const About = lazyPage(() => import("./pages/About.tsx"));
const Contact = lazyPage(() => import("./pages/Contact.tsx"));
const Privacy = lazyPage(() => import("./pages/Privacy.tsx"));
const Terms = lazyPage(() => import("./pages/Terms.tsx"));
const Submit = lazyPage(() => import("./pages/Submit.tsx"));
const Volunteer = lazyPage(() => import("./pages/Volunteer.tsx"));
const Category = lazyPage(() => import("./pages/Category.tsx"));
const OpportunityDetail = lazyPage(() => import("./pages/OpportunityDetail.tsx"));
const Collections = lazyPage(() => import("./pages/Collections.tsx"));
const RemoteNationwide = lazyPage(() => import("./pages/RemoteNationwide.tsx"));
const Deadlines = lazyPage(() => import("./pages/Deadlines.tsx"));
const NycPrograms = lazyPage(() => import("./pages/NycPrograms.tsx"));
const SharedCollection = lazyPage(() => import("./pages/SharedCollection.tsx"));
const Profile = lazyPage(() => import("./pages/Profile.tsx"));
const Unsubscribe = lazyPage(() => import("./pages/Unsubscribe.tsx"));
const GuideTopMedicalInternships = lazyPage(() => import("./pages/GuideTopMedicalInternships.tsx"));
const GuideTopResearchCompetitions = lazyPage(() => import("./pages/GuideTopResearchCompetitions.tsx"));
const GuideTopBusinessPrograms = lazyPage(() => import("./pages/GuideTopBusinessPrograms.tsx"));
const GuideHighSchoolLawInternships = lazyPage(() => import("./pages/GuideHighSchoolLawInternships.tsx"));

const pages: PageComponents = {
  Index, NotFound, Auth, About, Contact, Privacy, Terms, Submit, Volunteer, Category, OpportunityDetail,
  Collections, RemoteNationwide, Deadlines, NycPrograms, SharedCollection, Profile, Unsubscribe,
  GuideTopMedicalInternships, GuideTopResearchCompetitions, GuideTopBusinessPrograms, GuideHighSchoolLawInternships,
};

/** Route patterns in the same order as AppRoutes, mapped to their page. */
const ROUTE_PAGES: [string, LazyPage][] = [
  ["/auth", Auth],
  ["/", Index],
  ["/about", About],
  ["/contact", Contact],
  ["/privacy", Privacy],
  ["/terms", Terms],
  ["/submit", Submit],
  ["/volunteer", Volunteer],
  ["/categories/:slug", Category],
  ["/categories/:slug/page/:page", Category],
  ["/opportunities/:id", OpportunityDetail],
  ["/remote", RemoteNationwide],
  ["/deadlines", Deadlines],
  ["/nyc-programs-for-high-school-students", NycPrograms],
  ["/collections", Collections],
  ["/collections/:id", SharedCollection],
  ["/profile", Profile],
  ["/unsubscribe", Unsubscribe],
  ["/guides/top-medical-internships", GuideTopMedicalInternships],
  ["/guides/top-research-competitions", GuideTopResearchCompetitions],
  ["/guides/top-business-summer-programs", GuideTopBusinessPrograms],
  ["/guides/high-school-law-internships", GuideHighSchoolLawInternships],
];

/** Load the page module for a URL before the first render (see lazyPage). */
export function preloadRoute(pathname: string): Promise<unknown> {
  const hit = ROUTE_PAGES.find(([pattern]) => matchPath(pattern, pathname));
  return (hit ? hit[1] : NotFound).preload();
}

function WarmRouteCache() {
  useEffect(() => {
    const warm = () => {
      void import("./pages/About.tsx");
      void import("./pages/Collections.tsx");
      void import("./pages/Contact.tsx");
      void import("./pages/Privacy.tsx");
      void import("./pages/Profile.tsx");
      void import("./pages/Submit.tsx");
      void import("./pages/Volunteer.tsx");
      void import("./pages/Terms.tsx");
      void import("./pages/Category.tsx");
      void import("./pages/Deadlines.tsx");
      void import("./pages/OpportunityDetail.tsx");
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(warm, { timeout: 1800 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(warm, 650);
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WarmRouteCache />
        <ScrollToTop />
        <AppRoutes pages={pages} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
