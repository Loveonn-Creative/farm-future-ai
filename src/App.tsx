import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
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
import About from "./pages/About";
import LandMapping from "./pages/LandMapping";
import SavedPlots from "./pages/SavedPlots";
import Career from "./pages/Career";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
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
                <Route path="/about" element={<About />} />
                <Route path="/land-mapping" element={<LandMapping />} />
                <Route path="/saved-plots" element={<SavedPlots />} />
                <Route path="/career" element={<Career />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <BottomNav />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
