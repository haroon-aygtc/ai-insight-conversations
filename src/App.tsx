
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { EnhancedMainLayout } from "@/components/layout/EnhancedMainLayout";
import EnhancedDashboard from "@/pages/EnhancedDashboard";
import Chat from "@/pages/Chat";
import Widgets from "@/pages/Widgets";
import WidgetConfigurator from "@/pages/WidgetConfigurator";
import WidgetTesting from "@/pages/WidgetTesting";
import WidgetPreviewPage from "@/pages/WidgetPreview";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <EnhancedMainLayout>
              <EnhancedDashboard />
            </EnhancedMainLayout>
          } />
          <Route path="/chat" element={
            <EnhancedMainLayout>
              <Chat />
            </EnhancedMainLayout>
          } />
          <Route path="/widgets" element={
            <EnhancedMainLayout>
              <Widgets />
            </EnhancedMainLayout>
          } />
          <Route path="/widget-configurator" element={
            <EnhancedMainLayout>
              <WidgetConfigurator />
            </EnhancedMainLayout>
          } />
          <Route path="/widget-testing" element={
            <EnhancedMainLayout>
              <WidgetTesting />
            </EnhancedMainLayout>
          } />
          <Route path="/widget-testing/:id" element={
            <EnhancedMainLayout>
              <WidgetTesting />
            </EnhancedMainLayout>
          } />
          <Route path="/widget-preview/:id" element={<WidgetPreviewPage />} />
          
          {/* Placeholder routes for other pages */}
          <Route path="/context-rules" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Context Rules</h1><p className="text-muted-foreground">Configure AI behavior rules and context management.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/templates" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Templates</h1><p className="text-muted-foreground">Manage reusable widget templates and configurations.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/ai-hub" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">AI Hub</h1><p className="text-muted-foreground">Central hub for AI model management and configuration.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/ai-module" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">AI Module</h1><p className="text-muted-foreground">Core AI processing module configuration.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/ai-model-manager" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">AI Model Manager</h1><p className="text-muted-foreground">Manage and configure AI models.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/ai-provider-manager" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">AI Provider Manager</h1><p className="text-muted-foreground">Configure AI service providers and connections.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/users" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Users</h1><p className="text-muted-foreground">Manage user accounts and permissions.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/roles" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Roles</h1><p className="text-muted-foreground">Configure user roles and access levels.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/permissions" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Permissions</h1><p className="text-muted-foreground">Manage granular permissions and access control.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/notifications" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground">Configure system notifications and alerts.</p></div>
            </EnhancedMainLayout>
          } />
          <Route path="/settings" element={
            <EnhancedMainLayout>
              <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Application settings and configuration.</p></div>
            </EnhancedMainLayout>
          } />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
