
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavigation } from "./SidebarNavigation";
import { UserProfileFooter } from "./UserProfileFooter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent>
            <SidebarNavigation />
          </SidebarContent>
          <SidebarFooter>
            <UserProfileFooter />
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
