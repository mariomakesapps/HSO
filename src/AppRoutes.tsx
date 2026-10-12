import { Suspense, useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { SiteHeader } from "./components/SiteHeader";
import { Atmosphere } from "./components/Atmosphere";

/**
 * The route table and app shell, shared by the browser app and the build-time
 * server render (src/entry-server.tsx).
 *
 * Keeping one table means the HTML written at build time is the same page the
 * browser renders: the browser passes lazy-loaded page components, the server
 * passes eagerly imported ones, and everything else is identical.
 */
export interface PageComponents {
  Index: ComponentType;
  NotFound: ComponentType;
  Auth: ComponentType;
  About: ComponentType;
  Contact: ComponentType;
  Privacy: ComponentType;
  Terms: ComponentType;
  Submit: ComponentType;
  Volunteer: ComponentType;
  Category: ComponentType;
  Topic: ComponentType;
  OpportunityDetail: ComponentType;
  Collections: ComponentType;
  RemoteNationwide: ComponentType;
  Deadlines: ComponentType;
  NycPrograms: ComponentType;
  SharedCollection: ComponentType;
  Profile: ComponentType;
  Unsubscribe: ComponentType;
  GuideTopMedicalInternships: ComponentType;
  GuideTopResearchCompetitions: ComponentType;
  GuideTopBusinessPrograms: ComponentType;
  GuideHighSchoolLawInternships: ComponentType;
}

function PageFallback() {
  return (
    // Reserve a stable chunk of viewport height so the layout doesn't
    // jump as the lazy route resolves. No skeleton, no flash.
    <div aria-hidden="true" className="min-h-[70vh]" />
  );
}

/**
 * Fades route content in on navigation — but never on the very first paint.
 *
 * The transition used to run on initial mount too, which meant the page began
 * at opacity 0 and the Largest Contentful Paint waited for the animation. The
 * first render is now unanimated; only subsequent route changes transition.
 */
function RouteTransition({ children }: { children: ReactNode }) {
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

const AppShell = () => (
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

export function AppRoutes({ pages: P }: { pages: PageComponents }) {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <Suspense fallback={<PageFallback />}>
            <P.Auth />
          </Suspense>
        }
      />
      <Route element={<AppShell />}>
        <Route path="/" element={<P.Index />} />
        <Route path="/about" element={<P.About />} />
        <Route path="/contact" element={<P.Contact />} />
        <Route path="/privacy" element={<P.Privacy />} />
        <Route path="/terms" element={<P.Terms />} />
        <Route path="/submit" element={<P.Submit />} />
        <Route path="/volunteer" element={<P.Volunteer />} />
        <Route path="/categories/:slug" element={<P.Category />} />
        <Route path="/categories/:slug/page/:page" element={<P.Category />} />
        <Route path="/categories/:slug/:topic" element={<P.Topic />} />
        <Route path="/categories/:slug/:topic/page/:page" element={<P.Topic />} />
        <Route path="/opportunities/:id" element={<P.OpportunityDetail />} />
        <Route path="/remote" element={<P.RemoteNationwide />} />
        <Route path="/deadlines" element={<P.Deadlines />} />
        <Route path="/nyc-programs-for-high-school-students" element={<P.NycPrograms />} />
        <Route path="/collections" element={<P.Collections />} />
        <Route path="/collections/:id" element={<P.SharedCollection />} />
        <Route path="/profile" element={<P.Profile />} />
        <Route path="/unsubscribe" element={<P.Unsubscribe />} />
        <Route path="/guides/top-medical-internships" element={<P.GuideTopMedicalInternships />} />
        <Route path="/guides/top-research-competitions" element={<P.GuideTopResearchCompetitions />} />
        <Route path="/guides/top-business-summer-programs" element={<P.GuideTopBusinessPrograms />} />
        <Route path="/guides/high-school-law-internships" element={<P.GuideHighSchoolLawInternships />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<P.NotFound />} />
      </Route>
    </Routes>
  );
}
