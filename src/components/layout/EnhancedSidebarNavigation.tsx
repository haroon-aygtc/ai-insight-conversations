
import React, { useState } from "react";
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
  ChevronRight,
  Home,
  Palette,
  Brain,
  UserCheck,
  Key,
  Activity,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const EnhancedSidebarNavigation = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main"]);

  const isActive = (path: string) => location.pathname === path;

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const menuGroups = [
    {
      name: "main",
      label: "Overview",
      icon: Home,
      color: "from-blue-500 to-blue-600",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: BarChartBig,
          description: "Analytics & insights",
          badge: { text: "3", variant: "default" }
        },
        {
          label: "Chat",
          path: "/chat",
          icon: MessageSquare,
          description: "Live conversations"
        },
      ]
    },
    {
      name: "widgets",
      label: "Widget Management",
      icon: Box,
      color: "from-purple-500 to-purple-600",
      items: [
        {
          label: "Widgets",
          path: "/widgets",
          icon: Box,
          description: "Manage chat widgets",
          badge: { text: "New", variant: "success" }
        },
        {
          label: "Widget Configurator",
          path: "/widget-configurator",
          icon: Palette,
          description: "Customize appearance"
        },
        {
          label: "Widget Testing",
          path: "/widget-testing",
          icon: TestTube,
          description: "Test functionality"
        },
      ]
    },
    {
      name: "content",
      label: "Content & AI",
      icon: Brain,
      color: "from-emerald-500 to-emerald-600",
      items: [
        {
          label: "Context Rules",
          path: "/context-rules",
          icon: FileText,
          description: "Define AI behavior"
        },
        {
          label: "Templates",
          path: "/templates",
          icon: FileText,
          description: "Response templates"
        },
        {
          label: "AI Hub",
          path: "/ai-hub",
          icon: Sparkles,
          description: "AI capabilities",
          badge: { text: "Pro", variant: "premium" }
        },
        {
          label: "AI Module",
          path: "/ai-module",
          icon: Database,
          description: "Core AI engine"
        },
        {
          label: "AI Model Manager",
          path: "/ai-model-manager",
          icon: BrainCircuit,
          description: "Manage AI models"
        },
        {
          label: "AI Provider Manager",
          path: "/ai-provider-manager",
          icon: Cloud,
          description: "External AI services"
        },
      ]
    },
    {
      name: "admin",
      label: "Administration",
      icon: Shield,
      color: "from-red-500 to-red-600",
      items: [
        {
          id: "admin-dashboard",
          label: "Admin Panel",
          path: "/dashboard",
          icon: Shield,
          description: "System administration",
          badge: { text: "Admin", variant: "destructive" }
        },
        {
          id: "admin-users",
          label: "Users",
          path: "/users",
          icon: Users,
          description: "User management"
        },
        {
          id: "admin-roles",
          label: "Roles",
          path: "/roles",
          icon: UserCheck,
          description: "Role definitions"
        },
        {
          id: "admin-permissions",
          label: "Permissions",
          path: "/permissions",
          icon: Key,
          description: "Access control"
        },
        {
          id: "admin-activity-logs",
          label: "Activity Logs",
          path: "/activity-logs",
          icon: Activity,
          description: "System activity"
        },
        {
          id: "admin-notifications",
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
          description: "System alerts"
        },
        {
          id: "admin-settings",
          label: "Settings",
          path: "/settings",
          icon: Settings,
          description: "System configuration"
        },
        {
          id: "admin-widgets",
          label: "Widget Admin",
          path: "/admin-widgets",
          icon: Box,
          description: "Widget administration"
        },
      ]
    }
  ];

  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "premium":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200";
      case "destructive":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <>
      {/* Enhanced Logo Section */}
      <SidebarGroup>
        <motion.div
          className="flex items-center px-4 py-4 mb-4 border-b border-border/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-background shadow-sm" />
            </div>
            <AnimatePresence>
              {state !== "collapsed" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex-1"
                >
                  <div className="space-y-1">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      ChatAdmin
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium">
                      AI-Powered Platform
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </SidebarGroup>

      {/* Enhanced Menu Groups */}
      {menuGroups.map((group, groupIndex) => (
        <SidebarGroup key={group.name} className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 + 0.2 }}
          >
            <SidebarGroupLabel
              className={cn(
                "cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-accent/60 group mb-2",
                state === "collapsed" && "justify-center px-2"
              )}
              onClick={() => toggleGroup(group.name)}
            >
              <div className={cn(
                "flex items-center gap-3 flex-1",
                state === "collapsed" && "justify-center"
              )}>
                <div className={cn(
                  "w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm",
                  group.color
                )}>
                  <group.icon size={14} className="text-white" />
                </div>
                <AnimatePresence>
                  {state !== "collapsed" && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden flex items-center justify-between flex-1"
                    >
                      <span className="font-semibold text-sm text-foreground/90">
                        {group.label}
                      </span>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: expandedGroups.includes(group.name) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SidebarGroupLabel>

            <AnimatePresence>
              {(expandedGroups.includes(group.name) || state === "collapsed") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <SidebarGroupContent className="px-2">
                    <SidebarMenu className="space-y-2">
                      {group.items.map((item, itemIndex) => (
                        <SidebarMenuItem key={item.id || `${group.name}-item-${itemIndex}`}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                          >
                            <SidebarMenuButton
                              asChild
                              isActive={isActive(item.path)}
                              tooltip={`${item.label}${item.description ? ` - ${item.description}` : ''}`}
                              className={cn(
                                "group relative rounded-xl transition-all duration-200 hover:shadow-md min-h-[44px] px-3 py-2",
                                isActive(item.path)
                                  ? "bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 shadow-sm text-primary"
                                  : "hover:bg-accent/70 hover:shadow-sm"
                              )}
                            >
                              <Link to={item.path} className="flex items-center gap-3 w-full">
                                <div className={cn(
                                  "p-2 rounded-lg transition-all duration-200 flex-shrink-0",
                                  isActive(item.path)
                                    ? "text-primary bg-primary/15 shadow-sm"
                                    : "text-muted-foreground group-hover:text-foreground group-hover:bg-accent/50"
                                )}>
                                  <item.icon size={16} />
                                </div>
                                <AnimatePresence>
                                  {state !== "collapsed" && (
                                    <motion.div
                                      initial={{ opacity: 0, width: 0 }}
                                      animate={{ opacity: 1, width: "auto" }}
                                      exit={{ opacity: 0, width: 0 }}
                                      className="flex items-center justify-between flex-1 overflow-hidden min-w-0"
                                    >
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className={cn(
                                          "font-medium text-sm transition-colors duration-200 truncate",
                                          isActive(item.path) ? "text-primary" : "text-foreground"
                                        )}>
                                          {item.label}
                                        </span>
                                        {item.description && (
                                          <span className="text-xs text-muted-foreground truncate">
                                            {item.description}
                                          </span>
                                        )}
                                      </div>
                                      {item.badge && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="ml-2 flex-shrink-0"
                                        >
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              "text-xs px-2 py-0.5 border font-medium",
                                              getBadgeVariant(item.badge.variant)
                                            )}
                                          >
                                            {item.badge.text}
                                          </Badge>
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Link>
                            </SidebarMenuButton>
                          </motion.div>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </SidebarGroup>
      ))}
    </>
  );
};
