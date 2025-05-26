import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';

interface SessionWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A simplified session warning dialog for use with Laravel Sanctum
 * This component is much simpler now that we're using pure Laravel Sanctum
 * for authentication without custom session management
 */
export const SessionWarningDialog: React.FC<SessionWarningDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { logout } = useAuth();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">
              Your session has expired. Please log in again to continue.
            </p>
            <p className="text-sm text-muted-foreground">
              For security reasons, inactive sessions are automatically terminated.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={logout}>
            Log In Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionWarningDialog;
