
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavigation } from "./SidebarNavigation";
import { UserProfileFooter } from "./UserProfileFooter";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center h-9 rounded-md border border-input px-4 bg-background">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  placeholder="Search..." 
                  className="border-0 bg-transparent pl-2 text-sm outline-none w-[180px] md:w-[240px]" 
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Notifications</h4>
                    <div className="rounded-md border p-3 text-sm">
                      <p className="font-medium">New message from user</p>
                      <p className="text-muted-foreground mt-1">User John D. sent a new message.</p>
                      <p className="text-xs text-muted-foreground mt-2">2 minutes ago</p>
                    </div>
                    <div className="rounded-md border p-3 text-sm">
                      <p className="font-medium">Widget installed on website</p>
                      <p className="text-muted-foreground mt-1">New widget installation detected on example.com</p>
                      <p className="text-xs text-muted-foreground mt-2">1 hour ago</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <Button variant="ghost" size="icon">
                <Settings size={18} />
              </Button>
            </div>
          </header>
          <main className="flex-1 px-6 py-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
