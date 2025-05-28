import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
  Bell,
  Search,
  Settings,
  Shield,
  Users,
  Database,
  ArrowLeft,
  Menu,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Fixed Admin Sidebar */}
      <div className="w-64 bg-white border-r border-border/50 h-screen flex-shrink-0 overflow-y-auto">
        {/* Admin Logo */}
        <div className="h-16 border-b border-border/50 px-4 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-bold text-xl">Admin Panel</h1>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4 space-y-6">
          {/* User Management */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">User Management</h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="h-4 w-4 mr-3" />
                Users
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => navigate("/admin/roles")}
              >
                <Shield className="h-4 w-4 mr-3" />
                Roles & Permissions
              </Button>
            </div>
          </div>

          {/* System */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">System</h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => navigate("/admin/settings")}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => navigate("/admin/database")}
              >
                <Database className="h-4 w-4 mr-3" />
                Database
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => navigate("/admin/notifications")}
              >
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="pt-4 mt-6 border-t border-border/50">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-3" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 border-b border-border/50 bg-white shadow-sm px-6 flex items-center justify-between sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 h-9"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notifications */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent align="end" className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="text-sm text-muted-foreground">
                    You have 2 unread notifications
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 w-full">
          <div className="w-full h-full p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
