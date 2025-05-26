import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import WidgetConfigurator from "./pages/WidgetConfigurator";
import WidgetListing from "./pages/WidgetListing";
import WidgetPreview from "./pages/WidgetPreview";
import WidgetTesting from "./pages/WidgetTesting";
import WidgetTestingDemo from "./pages/WidgetTestingDemo";
import ContextRules from "./pages/ContextRules";
import AiModule from "./components/ai-module/AiModule";
import Templates from "./pages/Templates";
import AIHub from "./pages/AIHub";
import AIModelManager from "./pages/AIModelManager";
import AIProviderManager from "./pages/AIProviderManager";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Import Tempo routes
import routes from "tempo-routes";

const queryClient = new QueryClient();

// Create a component for Tempo routes
const TempoRoutes = () => {
  return import.meta.env.VITE_TEMPO ? useRoutes(routes) : null;
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

// Animated route component
const AnimatedRoute = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="enter"
    exit="exit"
    variants={pageVariants}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with MainLayout */}
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/chat" element={<MainLayout><Chat /></MainLayout>} />
          <Route path="/widget-configurator" element={<MainLayout><WidgetConfigurator /></MainLayout>} />
          <Route path="/context-rules" element={<MainLayout><ContextRules /></MainLayout>} />
          <Route path="/templates" element={<MainLayout><Templates /></MainLayout>} />
          <Route path="/ai-hub" element={<MainLayout><AIHub /></MainLayout>} />
          
          {/* Additional routes would go here */}
          <Route path="/users" element={<MainLayout><div className="p-4"><h1 className="text-2xl font-bold">Users Page</h1></div></MainLayout>} />
          <Route path="/notifications" element={<MainLayout><div className="p-4"><h1 className="text-2xl font-bold">Notifications Page</h1></div></MainLayout>} />
          <Route path="/settings" element={<MainLayout><div className="p-4"><h1 className="text-2xl font-bold">Settings Page</h1></div></MainLayout>} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
