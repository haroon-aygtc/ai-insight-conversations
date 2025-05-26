
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
      label: "Main",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: BarChartBig, badge: "3" },
        { label: "Chat", path: "/chat", icon: MessageSquare },
        { label: "Widgets", path: "/widgets", icon: Box, badge: "New" },
        { label: "Widget Configurator", path: "/widget-configurator", icon: PanelLeft },
        { label: "Widget Testing", path: "/widget-testing", icon: TestTube },
      ]
    },
    {
      name: "content",
      label: "Content & AI",
      items: [
        { label: "Context Rules", path: "/context-rules", icon: FileText },
        { label: "Templates", path: "/templates", icon: Box },
        { label: "AI Hub", path: "/ai-hub", icon: Sparkles },
        { label: "AI Module", path: "/ai-module", icon: Database },
        { label: "AI Model Manager", path: "/ai-model-manager", icon: BrainCircuit },
        { label: "AI Provider Manager", path: "/ai-provider-manager", icon: Cloud },
      ]
    },
    {
      name: "admin",
      label: "Administration",
      items: [
        { label: "Users", path: "/users", icon: Users },
        { label: "Roles", path: "/roles", icon: Shield },
        { label: "Permissions", path: "/permissions", icon: Shield },
        { label: "Notifications", path: "/notifications", icon: Bell },
        { label: "Settings", path: "/settings", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Enhanced Logo Section */}
      <SidebarGroup>
        <motion.div 
          className="flex items-center px-4 py-3 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <MessageSquare size={18} className="text-white" />
            </div>
            <AnimatePresence>
              {state !== "collapsed" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    ChatAdmin
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </SidebarGroup>

      {/* Enhanced Menu Groups */}
      {menuGroups.map((group, groupIndex) => (
        <SidebarGroup key={group.name} className="mt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 + 0.2 }}
          >
            <SidebarGroupLabel 
              className={cn(
                "cursor-pointer flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50",
                state === "collapsed" && "justify-center"
              )}
              onClick={() => toggleGroup(group.name)}
            >
              <span className={cn(state === "collapsed" && "sr-only")}>
                {group.label}
              </span>
              <AnimatePresence>
                {state !== "collapsed" && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: expandedGroups.includes(group.name) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                      {group.items.map((item, itemIndex) => (
                        <SidebarMenuItem key={item.path}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                          >
                            <SidebarMenuButton
                              asChild
                              isActive={isActive(item.path)}
                              tooltip={item.label}
                              className={cn(
                                "group relative rounded-xl transition-all duration-200 hover:shadow-md",
                                isActive(item.path) 
                                  ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm" 
                                  : "hover:bg-accent/60"
                              )}
                            >
                              <Link to={item.path} className="flex items-center gap-3 w-full">
                                <div className={cn(
                                  "p-1.5 rounded-lg transition-colors duration-200",
                                  isActive(item.path) 
                                    ? "text-primary bg-primary/10" 
                                    : "text-muted-foreground group-hover:text-foreground"
                                )}>
                                  <item.icon size={18} />
                                </div>
                                <AnimatePresence>
                                  {state !== "collapsed" && (
                                    <motion.div
                                      initial={{ opacity: 0, width: 0 }}
                                      animate={{ opacity: 1, width: "auto" }}
                                      exit={{ opacity: 0, width: 0 }}
                                      className="flex items-center justify-between flex-1 overflow-hidden"
                                    >
                                      <span className={cn(
                                        "font-medium transition-colors duration-200",
                                        isActive(item.path) ? "text-primary" : ""
                                      )}>
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className={cn(
                                            "px-2 py-0.5 text-xs rounded-full font-medium",
                                            item.badge === "New" 
                                              ? "bg-green-100 text-green-700" 
                                              : "bg-primary/10 text-primary"
                                          )}
                                        >
                                          {item.badge}
                                        </motion.span>
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
