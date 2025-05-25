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
import ContextRules from "./pages/ContextRules";
import AiModule from "./components/ai-module/AiModule";
import Templates from "./pages/Templates";
import AIHub from "./pages/AIHub";
import AIModelManager from "./pages/AIModelManager";
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
    <ThemeProvider defaultTheme="system" storageKey="chatadmin-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            {/* Tempo routes component - only renders when VITE_TEMPO is true */}
            <TempoRoutes />

            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/"
                  element={
                    <AnimatedRoute>
                      <Index />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AnimatedRoute>
                      <Login />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AnimatedRoute>
                      <Register />
                    </AnimatedRoute>
                  }
                />

                {/* Unauthorized route */}
                <Route
                  path="/unauthorized"
                  element={
                    <AnimatedRoute>
                      <Unauthorized />
                    </AnimatedRoute>
                  }
                />

                {/* Protected routes with MainLayout */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnimatedRoute>
                          <Dashboard />
                        </AnimatedRoute>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnimatedRoute>
                          <Chat />
                        </AnimatedRoute>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/widget-configurator"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnimatedRoute>
                          <WidgetConfigurator />
                        </AnimatedRoute>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/ai-module"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <AiModule />
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />

                <Route
                  path="/ai-model-manager"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <AIModelManager />
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />

                <Route
                  path="/context-rules"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <ContextRules />
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />
                <Route
                  path="/templates"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <Templates />
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />
                <Route
                  path="/ai-hub"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <AIHub />
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />

                {/* Additional routes would go here */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnimatedRoute>
                          <Users />
                        </AnimatedRoute>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnimatedRoute>
                          <Roles />
                        </AnimatedRoute>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/permissions"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AnimatedRoute>
                          <Permissions />
                        </AnimatedRoute>
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <div className="p-4">
                          <h1 className="text-2xl font-bold">
                            Notifications Page
                          </h1>
                        </div>
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <MainLayout>
                      <AnimatedRoute>
                        <div className="p-4">
                          <h1 className="text-2xl font-bold">Settings Page</h1>
                        </div>
                      </AnimatedRoute>
                    </MainLayout>
                  }
                />

                {/* Allow Tempo to capture routes before the catch-all */}
                {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

                {/* Catch-all route for 404 */}
                <Route
                  path="*"
                  element={
                    <AnimatedRoute>
                      <NotFound />
                    </AnimatedRoute>
                  }
                />
              </Routes>
            </AnimatePresence>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
