
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { EnhancedSidebarNavigation } from "./EnhancedSidebarNavigation";
import { UserProfileFooter } from "./UserProfileFooter";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
  Bell,
  Search,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface EnhancedMainLayoutProps {
  children: React.ReactNode;
}

export const EnhancedMainLayout = ({ children }: EnhancedMainLayoutProps) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
          {/* Enhanced Header */}
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm"
          >
            <div className="flex items-center gap-4">
              {/* Enhanced Search */}
              <motion.div 
                className={`relative flex items-center transition-all duration-300 ${
                  searchFocused ? 'w-80' : 'w-64'
                }`}
                whileFocus={{ scale: 1.02 }}
              >
                <Search 
                  size={18} 
                  className={`absolute left-3 transition-colors duration-200 ${
                    searchFocused ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <Input
                  placeholder="Search anything..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`pl-10 pr-4 h-10 rounded-xl border-2 transition-all duration-200 ${
                    searchFocused 
                      ? 'border-primary/30 shadow-lg shadow-primary/10 bg-background' 
                      : 'border-border bg-background/50'
                  }`}
                />
                <AnimatePresence>
                  {searchValue && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-12 left-0 right-0 bg-card border border-border rounded-xl shadow-xl z-50 p-2"
                    >
                      <div className="text-sm text-muted-foreground p-2">
                        Search results for "{searchValue}"
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EnhancedButton variant="ghost" size="sm" leftIcon={<Sparkles size={16} />}>
                  AI Assistant
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm" leftIcon={<Zap size={16} />}>
                  Quick Actions
                </EnhancedButton>
              </motion.div>

              <div className="h-6 w-px bg-border/50" />

              <ThemeToggle />

              {/* Enhanced Notifications */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <EnhancedButton variant="ghost" size="icon" className="relative">
                      <Bell size={18} />
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                      />
                    </EnhancedButton>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="w-80 p-0 border-0 shadow-2xl">
                  <div className="bg-gradient-to-br from-card to-card/95 rounded-xl p-4 border border-border/50">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Bell size={16} className="text-primary" />
                      Notifications
                    </h4>
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/20 transition-colors cursor-pointer"
                        >
                          <p className="font-medium text-sm">New widget deployed</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Widget "Customer Support" is now live on example.com
                          </p>
                          <p className="text-xs text-primary mt-2">{i} hour ago</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <EnhancedButton variant="ghost" size="icon">
                <Settings size={18} />
              </EnhancedButton>
            </div>
          </motion.header>

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
