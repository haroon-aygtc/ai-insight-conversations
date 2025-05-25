import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarNavigation } from "./SidebarNavigation";
import { UserProfileFooter } from "./UserProfileFooter";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSecondaryPanelOpen, setIsSecondaryPanelOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background dark:bg-slate-900 transition-colors duration-300">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>
          <SidebarFooter>
            <UserProfileFooter />
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center h-9 rounded-md border ${isSearchFocused ? "border-primary ring-2 ring-primary/20" : "border-input"} px-4 bg-background transition-all duration-200`}
              >
                <Search size={16} className="text-muted-foreground" />
                <input
                  placeholder="Search..."
                  className="border-0 bg-transparent pl-2 text-sm outline-none w-[180px] md:w-[240px]"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Notifications</h4>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-md border p-3 text-sm hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <p className="font-medium">New message from user</p>
                      <p className="text-muted-foreground mt-1">
                        User John D. sent a new message.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        2 minutes ago
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-md border p-3 text-sm hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <p className="font-medium">Widget installed on website</p>
                      <p className="text-muted-foreground mt-1">
                        New widget installation detected on example.com
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        1 hour ago
                      </p>
                    </motion.div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <Button variant="ghost" size="icon">
                <Settings size={18} />
              </Button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 px-6 py-6 overflow-auto">{children}</main>

            {/* Secondary panel - can be used for details, settings, etc. */}
            <div
              className={`border-l border-border bg-card transition-all duration-300 overflow-hidden ${isSecondaryPanelOpen ? "w-80" : "w-0"}`}
            >
              {isSecondaryPanelOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 h-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Details Panel</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSecondaryPanelOpen(false)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {/* Content for the secondary panel */}
                    <p className="text-sm text-muted-foreground">
                      This panel can be used to display additional information
                      or controls related to the main content.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Toggle button for secondary panel */}
            {!isSecondaryPanelOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-50 hover:opacity-100"
                onClick={() => setIsSecondaryPanelOpen(true)}
              >
                <ChevronLeft size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
