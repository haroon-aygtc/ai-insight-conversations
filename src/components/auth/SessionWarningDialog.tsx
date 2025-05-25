import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import { useToast } from '@/components/ui/use-toast';

interface SessionWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const SessionWarningDialog: React.FC<SessionWarningDialogProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const remaining = authService.getSessionTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        onLogout();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      await authService.extendSession(30); // Extend by 30 minutes
      toast({
        title: "Session Extended",
        description: "Your session has been extended by 30 minutes.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Extension Failed",
        description: "Failed to extend session. Please log in again.",
        variant: "destructive",
      });
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>Your session will expire in:</p>
            <div className="text-2xl font-mono font-bold text-orange-600 text-center">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm">
              Would you like to extend your session or log out now?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onLogout} className="w-full sm:w-auto">
            Log Out Now
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExtendSession}
            disabled={isExtending}
            className="w-full sm:w-auto"
          >
            {isExtending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extending...
              </>
            ) : (
              'Extend Session'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionWarningDialog;
