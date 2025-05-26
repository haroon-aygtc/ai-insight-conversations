import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { EnhancedMainLayout } from "@/components/layout/EnhancedMainLayout";
import EnhancedDashboard from "@/pages/EnhancedDashboard";
import Chat from "@/pages/Chat";
import Widgets from "@/pages/Widgets";
import WidgetConfigurator from "@/pages/WidgetConfigurator";
import WidgetTesting from "@/pages/WidgetTesting";
import "./App.css";

function App() {
  return (
    <Router>
      <EnhancedMainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<EnhancedDashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/widgets" element={<Widgets />} />
          <Route path="/widget-configurator" element={<WidgetConfigurator />} />
          <Route path="/widget-testing" element={<WidgetTesting />} />
          <Route path="/widget-testing/:id" element={<WidgetTesting />} />
          
          {/* Placeholder routes for other pages */}
          <Route path="/context-rules" element={<div className="p-6"><h1 className="text-2xl font-bold">Context Rules</h1><p className="text-muted-foreground">Configure AI behavior rules and context management.</p></div>} />
          <Route path="/templates" element={<div className="p-6"><h1 className="text-2xl font-bold">Templates</h1><p className="text-muted-foreground">Manage reusable widget templates and configurations.</p></div>} />
          <Route path="/ai-hub" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Hub</h1><p className="text-muted-foreground">Central hub for AI model management and configuration.</p></div>} />
          <Route path="/ai-module" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Module</h1><p className="text-muted-foreground">Core AI processing module configuration.</p></div>} />
          <Route path="/ai-model-manager" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Model Manager</h1><p className="text-muted-foreground">Manage and configure AI models.</p></div>} />
          <Route path="/ai-provider-manager" element={<div className="p-6"><h1 className="text-2xl font-bold">AI Provider Manager</h1><p className="text-muted-foreground">Configure AI service providers and connections.</p></div>} />
          <Route path="/users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users</h1><p className="text-muted-foreground">Manage user accounts and permissions.</p></div>} />
          <Route path="/roles" element={<div className="p-6"><h1 className="text-2xl font-bold">Roles</h1><p className="text-muted-foreground">Configure user roles and access levels.</p></div>} />
          <Route path="/permissions" element={<div className="p-6"><h1 className="text-2xl font-bold">Permissions</h1><p className="text-muted-foreground">Manage granular permissions and access control.</p></div>} />
          <Route path="/notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground">Configure system notifications and alerts.</p></div>} />
          <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Application settings and configuration.</p></div>} />
        </Routes>
        <Toaster />
      </EnhancedMainLayout>
    </Router>
  );
}

export default App;
