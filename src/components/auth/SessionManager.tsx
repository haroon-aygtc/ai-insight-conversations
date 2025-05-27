
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SessionInfo, authService } from '@/services/auth';
import { formatDistanceToNow } from 'date-fns';
import { Monitor, Smartphone, Tablet, MapPin, Clock, X, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await authService.getActiveSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await authService.terminateSession(sessionId);
      toast({
        title: "Session terminated",
        description: "The session has been successfully terminated",
      });
      fetchSessions(); // Refresh the list
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await authService.logoutAllDevices();
      toast({
        title: "All sessions terminated",
        description: "You have been logged out from all devices",
      });
      fetchSessions(); // Refresh the list
    } catch (error) {
      console.error('Error logging out all devices:', error);
      toast({
        title: "Error",
        description: "Failed to logout from all devices",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('mobile') || deviceLower.includes('phone')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (deviceLower.includes('tablet') || deviceLower.includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    } else {
      return <Monitor className="h-4 w-4" />;
    }
  };

  const formatLastActive = (lastActive: string) => {
    try {
      const date = new Date(lastActive);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSessions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will terminate all active sessions across all devices. You will need to log in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogoutAllDevices} className="bg-red-500 hover:bg-red-600">
                    Logout All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active sessions found
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  session.is_current ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${session.is_current ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {getDeviceIcon(session.device)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{session.device}</p>
                      {session.is_current && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Last active {formatLastActive(session.last_active)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {!session.is_current && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Terminate Session</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to terminate this session? This will log out the device immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleTerminateSession(session.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Terminate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
