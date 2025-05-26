
import React, { useState } from 'react';
import { User, LogOut, Settings, HelpCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const UserProfileFooter = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred during logout",
        variant: "destructive",
      });
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
    <div className="px-3 py-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-slate-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarFallback className="bg-slate-800 text-slate-100 text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
                </span>
                <span className="text-xs text-slate-500">{user?.email || 'No email'}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="User settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
            </Button>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-56" align="start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-slate-800 text-slate-100 text-lg font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {user?.full_name || `${user?.first_name} ${user?.last_name}` || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email || 'No email'}</p>
                {user?.roles && user.roles.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Role: {user.roles.join(', ')}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <Settings size={16} className="mr-2" />
                Account Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-left">
                <HelpCircle size={16} className="mr-2" />
                Help & Support
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50"
                    disabled={isLoggingOut || isLoading}
                  >
                    {isLoggingOut ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <LogOut size={16} className="mr-2" />
                    )}
                    {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
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
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
