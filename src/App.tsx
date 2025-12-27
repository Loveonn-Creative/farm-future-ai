import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import ScanResults from "./pages/ScanResults";
import History from "./pages/History";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";
import Subscribe from "./pages/Subscribe";
import HowItWorks from "./pages/HowItWorks";
import Onboard from "./pages/Onboard";
import Features from "./pages/Features";
import Vision from "./pages/Vision";
import Partners from "./pages/Partners";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan-results" element={<ScanResults />} />
            <Route path="/history" element={<History />} />
            <Route path="/help" element={<Help />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/features" element={<Features />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;