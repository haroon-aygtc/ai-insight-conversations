import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChartBig,
  MessageSquare,
  Settings,
  PanelLeft,
  FileText,
  Box,
  Database,
  Users,
  Bell,
  BrainCircuit,
  Shield,
  Cloud,
  Sparkles,
  TestTube,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export const SidebarNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <BarChartBig size={20} />,
    },
    {
      label: "Chat",
      path: "/chat",
      icon: <MessageSquare size={20} />,
    },
    {
      label: "Widgets",
      path: "/widgets",
      icon: <Box size={20} />,
    },
    {
      label: "Widget Configurator",
      path: "/widget-configurator",
      icon: <PanelLeft size={20} />,
    },
    {
      label: "Widget Testing",
      path: "/widget-testing",
      icon: <TestTube size={20} />,
    },
    {
      label: "Context Rules",
      path: "/context-rules",
      icon: <FileText size={20} />,
    },
    {
      label: "Templates",
      path: "/templates",
      icon: <Box size={20} />,
    },

    {
      label: "AI Module",
      path: "/ai-module",
      icon: <Database size={20} />,
    },
    {
      label: "AI Model Manager",
      path: "/ai-model-manager",
      icon: <BrainCircuit size={20} />,
    },
    {
      label: "AI Provider Manager",
      path: "/ai-provider-manager",
      icon: <Cloud size={20} />,
    },
    {
      label: "AI Hub",
      path: "/ai-hub",
      icon: <Sparkles size={20} />,
    },
    {
      label: "Users",
      path: "/users",
      icon: <Users size={20} />,
    },
    {
      label: "Roles",
      path: "/roles",
      icon: <Shield size={20} />,
    },
    {
      label: "Permissions",
      path: "/permissions",
      icon: <Shield size={20} />,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: <Bell size={20} />,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <>
      <SidebarGroup>
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold text-slate-800">ChatAdmin</h1>
        </div>
      </SidebarGroup>

      <SidebarGroup className="mt-6">
        <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  tooltip={item.label}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
