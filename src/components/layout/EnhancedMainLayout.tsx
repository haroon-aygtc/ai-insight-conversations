
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { EnhancedSidebarNavigation } from "./EnhancedSidebarNavigation";
import { UserProfileFooter } from "./UserProfileFooter";
import { motion } from "framer-motion";
import { DashboardHeader } from "./DashboardHeader";

interface EnhancedMainLayoutProps {
  children: React.ReactNode;
}

export const EnhancedMainLayout = ({ children }: EnhancedMainLayoutProps) => {

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <EnhancedSidebarNavigation />
          </SidebarContent>
          <SidebarFooter>
            <UserProfileFooter />
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Dashboard Header with User Avatar Dropdown */}
          <DashboardHeader 
            onSearch={(query) => {
              console.log("Search query:", query);
              // Implement search functionality here
            }} 
          />

          {/* Enhanced Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
