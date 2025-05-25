
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import WidgetConfigurator from "./pages/WidgetConfigurator";
import WidgetTesting from "./pages/WidgetTesting";
import ContextRules from "./pages/ContextRules";
import Templates from "./pages/Templates";
import AIHub from "./pages/AIHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          <Route path="/widget-testing" element={<MainLayout><WidgetTesting /></MainLayout>} />
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
