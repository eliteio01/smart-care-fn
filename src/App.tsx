import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import PatientManagement from "./pages/PatientManagement";
import RecordManagement from "./pages/RecordManagement";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { initializeAppData } from "./utils/initializeData";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    initializeAppData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/patients" element={<PatientManagement />} />
      <Route path="/admin/records" element={<RecordManagement />} />
      <Route path="/nurse" element={<NurseDashboard />} />
      <Route path="/nurse/patients" element={<PatientManagement />} />
      <Route path="/nurse/records" element={<RecordManagement />} />
      <Route path="/patient-management" element={<PatientManagement />} />
      <Route path="/record-management" element={<RecordManagement />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
