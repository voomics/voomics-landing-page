
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWaitlist from "./pages/AdminWaitlist";
import AdminLayout from "./components/admin/AdminLayout";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { useAnalytics } from "./hooks/useAnalytics";

const queryClient = new QueryClient();

const AppContent = () => {
  useAnalytics();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="waitlist" element={<AdminWaitlist />} />
      </Route>
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
        <AdminAuthProvider>
          <AppContent />
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
