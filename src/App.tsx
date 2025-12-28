import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CollegesPage } from "./pages/CollegesPage";
import { FAFSAPage } from "./pages/FAFSAPage";
import { TimelinePage } from "./pages/TimelinePage";
import { CollegeComparisonPage } from "./pages/CollegeComparisonPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import { ImpactPage } from "./pages/ImpactPage";
import CounselorPortalPage from "./pages/CounselorPortalPage";
import { ScholarshipPage } from "./pages/ScholarshipPage";
import { AutoScholarshipFinderPage } from "./pages/AutoScholarshipFinderPage";
import { PartnersPage } from "./pages/PartnersPage";
import { CostCalculatorPage } from "./pages/CostCalculatorPage";
import { SuccessStoriesPage } from "./pages/SuccessStoriesPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { AdminPage } from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/colleges" element={<CollegesPage />} />
                <Route path="/fafsa" element={<FAFSAPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/college-comparison" element={<CollegeComparisonPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/counselor-portal" element={<CounselorPortalPage />} />
                <Route path="/scholarships" element={<ScholarshipPage />} />
                <Route path="/auto-scholarships" element={<AutoScholarshipFinderPage />} />
                <Route path="/ai-finder" element={<AutoScholarshipFinderPage />} />
                <Route path="/cost-calculator" element={<CostCalculatorPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/success-stories" element={<SuccessStoriesPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;