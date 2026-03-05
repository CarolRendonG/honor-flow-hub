import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DonationProvider } from "./contexts/DonationContext";
import { AppLayout } from "./components/layout/AppLayout";
import Auth from "./pages/Auth";
import DonorDashboard from "./pages/donor/DonorDashboard";
import ExploreProjects from "./pages/donor/ExploreProjects";
import ProjectDetail from "./pages/donor/ProjectDetail";
import Expedientes from "./pages/donor/Expedientes";
import Events from "./pages/donor/Events";
import ServicioSocial from "./pages/donor/ServicioSocial";
import Tesoreria from "./pages/donor/Tesoreria";
import LibroBlanco from "./pages/donor/LibroBlanco";
import ReceptorDashboard from "./pages/receptor/ReceptorDashboard";
import ReceptorPldAlerts from "./pages/receptor/ReceptorPldAlerts";
import SatReporting from "./pages/receptor/SatReporting";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplianceDashboard from "./pages/admin/ComplianceDashboard";
import UserManagement from "./pages/admin/UserManagement";
import LegalCompliance from "./pages/LegalCompliance";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === 'donor') return <Navigate to="/expedientes" replace />;
  if (user.role === 'receptor') return <ReceptorDashboard />;
  return <AdminDashboard />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DonationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AuthGuard />} />
            <Route path="/auth" element={<AuthGuard />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ExploreProjects /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/expedientes" element={<ProtectedRoute><Expedientes /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/servicio-social" element={<ProtectedRoute><ServicioSocial /></ProtectedRoute>} />
            <Route path="/tesoreria" element={<ProtectedRoute><Tesoreria /></ProtectedRoute>} />
            <Route path="/libro-blanco" element={<ProtectedRoute><LibroBlanco /></ProtectedRoute>} />
            <Route path="/sat-reporting" element={<ProtectedRoute><SatReporting /></ProtectedRoute>} />
            <Route path="/receptor-pld" element={<ProtectedRoute><ReceptorPldAlerts /></ProtectedRoute>} />
            <Route path="/compliance" element={<ProtectedRoute><ComplianceDashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/legal" element={<ProtectedRoute><LegalCompliance /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </DonationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
