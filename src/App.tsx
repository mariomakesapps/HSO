import { Suspense, lazy, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import { SiteHeader } from "./components/SiteHeader";
import { Atmosphere } from "./components/Atmosphere";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Submit = lazy(() => import("./pages/Submit.tsx"));
const Category = lazy(() => import("./pages/Category.tsx"));
const OpportunityDetail = lazy(() => import("./pages/OpportunityDetail.tsx"));
const Collections = lazy(() => import("./pages/Collections.tsx"));
const RemoteNationwide = lazy(() => import("./pages/RemoteNationwide.tsx"));
const SharedCollection = lazy(() => import("./pages/SharedCollection.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const GuideTopMedicalInternships = lazy(() => import("./pages/GuideTopMedicalInternships.tsx"));
const GuideTopResearchCompetitions = lazy(() => import("./pages/GuideTopResearchCompetitions.tsx"));
const GuideTopBusinessPrograms = lazy(() => import("./pages/GuideTopBusinessPrograms.tsx"));
const GuideHighSchoolLawInternships = lazy(() => import("./pages/GuideHighSchoolLawInternships.tsx"));

function PageFallback() {
  return (
    // Reserve a stable chunk of viewport height so the layout doesn't
    // jump as the lazy route resolves. No skeleton, no flash.
    <div aria-hidden="true" className="min-h-[70vh]" />
  );
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
      void import("./pages/Terms.tsx");
      void import("./pages/Category.tsx");
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

/**
 * Fades route content in on navigation — but never on the very first paint.
 *
 * The transition used to run on initial mount too, which meant the page began
 * at opacity 0 and the Largest Contentful Paint waited for the animation. The
 * first render is now unanimated; only subsequent route changes transition.
 */
function RouteTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <div key={location.pathname} className={isFirstRender.current ? undefined : "hso-route-enter"}>
      {children}
    </div>
  );
}

const AppShell = () => {
  return (
    <>
      <Atmosphere />
      <div className="relative z-10">
        <SiteHeader />
        {/* Suspense lives INSIDE the shell so the header stays mounted
            during lazy route loads — no nav flicker on page changes. */}
        <Suspense fallback={<PageFallback />}>
          <RouteTransition>
            <Outlet />
          </RouteTransition>
        </Suspense>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WarmRouteCache />
        <ScrollToTop />
        <Routes>
          <Route
            path="/auth"
            element={
              <Suspense fallback={<PageFallback />}>
                <Auth />
              </Suspense>
            }
          />
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/categories/:slug" element={<Category />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail />} />
              <Route path="/remote" element={<RemoteNationwide />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<SharedCollection />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/guides/top-medical-internships" element={<GuideTopMedicalInternships />} />
              <Route path="/guides/top-research-competitions" element={<GuideTopResearchCompetitions />} />
              <Route path="/guides/top-business-summer-programs" element={<GuideTopBusinessPrograms />} />
              <Route path="/guides/high-school-law-internships" element={<GuideHighSchoolLawInternships />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
