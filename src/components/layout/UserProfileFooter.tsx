
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";

export const UserProfileFooter = () => {
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  if (!user) {
    return null;
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-2 border-t border-border"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 p-3 h-auto hover:bg-accent/50 transition-colors duration-200"
          >
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {state !== "collapsed" && (
              <div className="flex items-center justify-between flex-1">
                <div className="text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          className="w-56 mb-2"
          sideOffset={8}
        >
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};
