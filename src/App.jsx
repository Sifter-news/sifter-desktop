import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth";
import { DebugProvider } from "./contexts/DebugContext";
import DebugPanel from "./components/debug/DebugPanel";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewProjectPage from "./pages/NewProjectPage";
import ProjectView from "./pages/ProjectView";
import ProjectPage from "./pages/ProjectPage";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import { AuthCallback } from "@/components/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DebugProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <DebugPanel />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/new-project" element={<NewProjectPage />} />
              <Route path="/project/:id" element={<ProjectView />} />
              <Route path="/:username/project/:projectName" element={<ProjectPage />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </DebugProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;