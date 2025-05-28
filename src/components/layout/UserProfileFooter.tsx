
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
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // The logout function in AuthContext already handles navigation and toast notifications
      await logout();
      // No need to navigate or show toast here as it's handled in the AuthContext
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Logout error in component:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Generate user initials
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="px-4 py-3 border-t border-border/50">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-accent/60 cursor-pointer transition-all duration-200 group">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground truncate">
                {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || 'No email'}
              </span>
              {user?.roles && user.roles.length > 0 && (
                <span className="text-xs text-primary font-medium">
                  {user.roles[0]}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="User settings"
            >
              <Settings size={14} />
            </Button>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-72 p-0 border-0 shadow-2xl" align="start">
          <div className="bg-gradient-to-br from-card to-card/95 rounded-xl p-4 border border-border/50">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email || 'No email'}</p>
                  {user?.roles && user.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.roles.map((role, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-border/50 pt-3 space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-left h-10 px-3 rounded-lg hover:bg-accent/60">
                  <Settings size={16} className="mr-3 text-muted-foreground" />
                  <span className="font-medium">Account Settings</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-left h-10 px-3 rounded-lg hover:bg-accent/60">
                  <HelpCircle size={16} className="mr-3 text-muted-foreground" />
                  <span className="font-medium">Help & Support</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-10 px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      disabled={isLoggingOut || isLoading}
                    >
                      {isLoggingOut ? (
                        <Loader2 size={16} className="mr-3 animate-spin" />
                      ) : (
                        <LogOut size={16} className="mr-3" />
                      )}
                      <span className="font-medium">
                        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to sign out? You will need to log in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Signing Out...
                          </>
                        ) : (
                          'Sign Out'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
