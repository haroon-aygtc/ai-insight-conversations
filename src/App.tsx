import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import WidgetConfigurator from "./pages/WidgetConfigurator";
import ContextRules from "./pages/ContextRules";
import Templates from "./pages/Templates";
import AIHub from "./pages/AIHub";
import NotFound from "./pages/NotFound";

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

              {/* Protected routes with MainLayout */}
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <AnimatedRoute>
                      <Dashboard />
                    </AnimatedRoute>
                  </MainLayout>
                }
              />
              <Route
                path="/chat"
                element={
                  <MainLayout>
                    <AnimatedRoute>
                      <Chat />
                    </AnimatedRoute>
                  </MainLayout>
                }
              />
              <Route
                path="/widget-configurator"
                element={
                  <MainLayout>
                    <AnimatedRoute>
                      <WidgetConfigurator />
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
                  <MainLayout>
                    <AnimatedRoute>
                      <div className="p-4">
                        <h1 className="text-2xl font-bold">Users Page</h1>
                      </div>
                    </AnimatedRoute>
                  </MainLayout>
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
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
