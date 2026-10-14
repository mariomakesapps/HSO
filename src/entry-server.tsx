import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes, type PageComponents } from "./AppRoutes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Submit from "./pages/Submit";
import Volunteer from "./pages/Volunteer";
import Category from "./pages/Category";
import Topic from "./pages/Topic";
import OpportunityDetail from "./pages/OpportunityDetail";
import Collections from "./pages/Collections";
import RemoteNationwide from "./pages/RemoteNationwide";
import Deadlines from "./pages/Deadlines";
import NycPrograms from "./pages/NycPrograms";
import SharedCollection from "./pages/SharedCollection";
import Profile from "./pages/Profile";
import Unsubscribe from "./pages/Unsubscribe";
import GuideTopMedicalInternships from "./pages/GuideTopMedicalInternships";
import GuideTopResearchCompetitions from "./pages/GuideTopResearchCompetitions";
import GuideTopBusinessPrograms from "./pages/GuideTopBusinessPrograms";
import GuideHighSchoolLawInternships from "./pages/GuideHighSchoolLawInternships";
import { freezeClock } from "@/lib/clock";

/**
 * Build time. Every page in this build renders its deadline labels against it,
 * and the prerenderer stamps it on #root (data-ssr-now) so the browser hydrates
 * against the same instant (src/lib/clock.ts).
 */
export const SSR_NOW = Date.now();
freezeClock(SSR_NOW);

/**
 * Build-time server render, used by scripts/prerender.mjs.
 *
 * Renders the real page for one URL so the HTML a crawler receives before any
 * JavaScript runs is the same visible page a student sees. Pages are imported
 * eagerly here (the browser lazy-loads them), and <head> tags are written by the
 * prerenderer from src/lib/pageMeta.ts rather than taken from Helmet, so the
 * Helmet output below is discarded.
 */
const pages: PageComponents = {
  Index, NotFound, Auth, About, Contact, Privacy, Terms, Submit, Volunteer, Category, Topic, OpportunityDetail,
  Collections, RemoteNationwide, Deadlines, NycPrograms, SharedCollection, Profile, Unsubscribe,
  GuideTopMedicalInternships, GuideTopResearchCompetitions, GuideTopBusinessPrograms, GuideHighSchoolLawInternships,
};

const Slot = () => null;

export function render(url: string): string {
  return renderToString(
    <HelmetProvider context={{}}>
      <QueryClientProvider client={new QueryClient()}>
        <TooltipProvider>
          {/* Same tree as src/App.tsx, so the browser can hydrate this markup. */}
          <Toaster />
          <Sonner />
          <MemoryRouter initialEntries={[url]}>
            {/* Stand-ins for App's WarmRouteCache and ScrollToTop. They render
                nothing, but React's useId (Radix ids) counts sibling slots, so the
                server tree needs the same slots for hydration to match. */}
            <Slot />
            <Slot />
            <AppRoutes pages={pages} />
          </MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}
