import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { GlobalThemeProvider } from "@/components/ui/global-theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { EnhancedMainLayout } from "@/components/layout/EnhancedMainLayout";
import EnhancedDashboard from "@/pages/EnhancedDashboard";
import Chat from "@/pages/Chat";
import WidgetListing from "@/pages/WidgetListing";
import WidgetConfigurator from "@/pages/WidgetConfigurator";
import WidgetTesting from "@/pages/WidgetTesting";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import Index from "@/pages/Index";
import Users from "@/pages/admin/user-management/Users";
import CreateEditUser from "@/pages/admin/user-management/CreateEditUser";
import CreateEditRole from "@/pages/admin/user-management/CreateEditRole";
import PermissionManagement from "@/pages/admin/PermissionManagement";
import CreateEditPermission from "@/pages/admin/permission-management/CreateEditPermission";

import "./App.css";
import ContextRules from "./pages/ContextRules";
import Templates from "./pages/Templates";
import AIHub from "./pages/AIHub";
// Using dynamic permissions instead of hardcoded constants
import RoleManagement from "./components/user-management/RoleManagement";

function App() {
  return (
    <GlobalThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <EnhancedMainLayout>
                  <Index />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute requiredPermissions={['dashboard.view']}>
                <EnhancedMainLayout>
                  <EnhancedDashboard />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/chat" element={
              <ProtectedRoute requiredPermissions={['chat.view']}>
                <EnhancedMainLayout>
                  <Chat />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/widgets" element={
              <ProtectedRoute requiredPermissions={['widget.view']}>
                <EnhancedMainLayout>
                  <Widgets />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/widgets/edit/:id" element={
              <ProtectedRoute requiredPermissions={['widget.edit']}>
                <EnhancedMainLayout>
                  <WidgetConfigurator />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/widget-configurator" element={
              <ProtectedRoute requiredPermissions={['widget.create']}>
                <EnhancedMainLayout>
                  <WidgetConfigurator />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/widget-testing" element={
              <ProtectedRoute requiredPermissions={['widget.view']}>
                <EnhancedMainLayout>
                  <WidgetTesting />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/widget-testing/:id" element={
              <ProtectedRoute requiredPermissions={['widget.view']}>
                <EnhancedMainLayout>
                  <WidgetTesting />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            {/* Placeholder routes for other pages */}
            <Route path="/context-rules" element={
              <ProtectedRoute>
                <EnhancedMainLayout>
                  <ContextRules />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/templates" element={
              <ProtectedRoute>
                <EnhancedMainLayout>
                  <Templates />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/ai-hub" element={
              <ProtectedRoute requiredPermissions={['ai.view']}>
                <EnhancedMainLayout>
                  <AIHub />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/ai-module" element={
              <ProtectedRoute requiredPermissions={['ai.manage']}>
                <EnhancedMainLayout>
                  <AIHub />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/ai-model-manager" element={
              <ProtectedRoute requiredPermissions={['ai.manage']}>
                <EnhancedMainLayout>
                  <AIHub />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/ai-provider-manager" element={
              <ProtectedRoute requiredPermissions={['ai.manage']}>
                <EnhancedMainLayout>
                  <AIHub />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            {/* User management routes will be defined below with proper permissions */}

            {/* <Route path="/permissions" element={
              <ProtectedRoute>
                <EnhancedMainLayout>
                  <Permissions />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } /> */}

            {/* <Route path="/notifications" element={
              <ProtectedRoute>
                <EnhancedMainLayout>
                  <NotificationsPage />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } /> */}

            {/* User Management Routes with Permission-Based Protection */}
            <Route path="/users" element={
              <ProtectedRoute requiredPermissions={['user.view']}>
                <EnhancedMainLayout>
                  <Users />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/users/create" element={
              <ProtectedRoute requiredPermissions={['user.create']}>
                <EnhancedMainLayout>
                  <CreateEditUser />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/users/edit/:id" element={
              <ProtectedRoute requiredPermissions={['user.edit']}>
                <EnhancedMainLayout>
                  <CreateEditUser />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/roles" element={
              <ProtectedRoute requiredPermissions={['role.view']}>
                <EnhancedMainLayout>
                  <RoleManagement />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/roles/create" element={
              <ProtectedRoute requiredPermissions={['role.create']}>
                <EnhancedMainLayout>
                  <CreateEditRole />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/roles/edit/:id" element={
              <ProtectedRoute requiredPermissions={['role.edit']}>
                <EnhancedMainLayout>
                  <CreateEditRole />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/permissions" element={
              <ProtectedRoute requiredPermissions={['permission.view']}>
                <EnhancedMainLayout>
                  <PermissionManagement />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/permissions/create" element={
              <ProtectedRoute requiredPermissions={['permission.create']}>
                <EnhancedMainLayout>
                  <CreateEditPermission />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/permissions/edit/:id" element={
              <ProtectedRoute requiredPermissions={['permission.edit']}>
                <EnhancedMainLayout>
                  <CreateEditPermission />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/widgets/new" element={
              <ProtectedRoute requiredPermissions={['widget.create']}>
                <EnhancedMainLayout>
                  <WidgetConfigurator />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />



            {/* <Route path="/database" element={
              <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
                <EnhancedMainLayout>
                  < />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } /> */}

            {/* Activity logs route - component not implemented yet */}

            {/* <Route path="/api-keys" element={
              <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
                <EnhancedMainLayout>
                  <APIKeys />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } /> */}

            <Route path="/templates" element={
              <ProtectedRoute requiredPermissions={['settings.view']}>
                <EnhancedMainLayout>
                  <Templates />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />


            {/*
            <Route path="/domains" element={
              <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
                <EnhancedMainLayout>
                  <Domains />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } /> */}

            {/* <Route path="/analytics" element={
              <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
                <EnhancedMainLayout>
                  <Analytics />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
                <EnhancedMainLayout>
                  <Reports />
                </EnhancedMainLayout>
              </ProtectedRoute>
            } /> */}
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </GlobalThemeProvider>
  );
}

export default App;
