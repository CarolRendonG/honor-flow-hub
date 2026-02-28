import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import Login from "./pages/Login";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComplianceDashboard from "./pages/admin/ComplianceDashboard";
import LegalCompliance from "./pages/LegalCompliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'donor') return <DonorDashboard />;
  if (user.role === 'receptor') return <ReceptorDashboard />;
  return <AdminDashboard />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginGuard />} />
            <Route path="/dashboard" element={<AppLayout><DashboardRouter /></AppLayout>} />
            <Route path="/explore" element={<AppLayout><ExploreProjects /></AppLayout>} />
            <Route path="/project/:id" element={<AppLayout><ProjectDetail /></AppLayout>} />
            <Route path="/expedientes" element={<AppLayout><Expedientes /></AppLayout>} />
            <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
            <Route path="/servicio-social" element={<AppLayout><ServicioSocial /></AppLayout>} />
            <Route path="/tesoreria" element={<AppLayout><Tesoreria /></AppLayout>} />
            <Route path="/libro-blanco" element={<AppLayout><LibroBlanco /></AppLayout>} />
            <Route path="/my-projects" element={<AppLayout><ReceptorDashboard /></AppLayout>} />
            <Route path="/receptor-pld" element={<AppLayout><ReceptorPldAlerts /></AppLayout>} />
            <Route path="/updates" element={<AppLayout><ReceptorDashboard /></AppLayout>} />
            <Route path="/dispersions" element={<AppLayout><ReceptorDashboard /></AppLayout>} />
            <Route path="/review" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/compliance" element={<AppLayout><ComplianceDashboard /></AppLayout>} />
            <Route path="/finance" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/pld" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/receipts" element={<AppLayout><AdminDashboard /></AppLayout>} />
            <Route path="/legal" element={<AppLayout><LegalCompliance /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default App;
