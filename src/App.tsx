import { Suspense, lazy, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import { SiteHeader } from "./components/SiteHeader";

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
const SharedCollection = lazy(() => import("./pages/SharedCollection.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6">
      <div className="hso-glass-panel animate-pulse rounded-[2rem] p-6">
        <div className="h-3 w-32 rounded-full bg-muted" />
        <div className="mt-5 h-10 w-3/5 max-w-xl rounded-2xl bg-muted" />
        <div className="mt-4 h-4 w-4/5 max-w-2xl rounded-full bg-muted" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="h-32 rounded-2xl bg-muted/70" />
          <div className="h-32 rounded-2xl bg-muted/70" />
          <div className="h-32 rounded-2xl bg-muted/70" />
        </div>
      </div>
    </div>
  );
}

const STARTUP_HOME_PATHS = new Set([
  "/about",
  "/contact",
  "/collections",
  "/privacy",
  "/profile",
  "/submit",
  "/terms",
]);

function StartupHomeRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    if (STARTUP_HOME_PATHS.has(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
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
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(warm, { timeout: 1800 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(warm, 650);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return null;
}

const AppShell = () => (
  <>
    <div className="hso-professional-bg" aria-hidden="true" />
    <div className="relative z-10">
      <SiteHeader />
      <Outlet />
    </div>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StartupHomeRedirect />
        <WarmRouteCache />
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route element={<AppShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/categories/:slug" element={<Category />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/share/:token" element={<SharedCollection />} />
              <Route path="/collections/:id" element={<SharedCollection />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
