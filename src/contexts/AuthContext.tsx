import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, authService } from '@/services/auth';
import SessionWarningDialog from '@/components/auth/SessionWarningDialog';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionTimeRemaining: number;
  isSessionExpiringSoon: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  extendSession: (minutes?: number) => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [isSessionExpiringSoon, setIsSessionExpiringSoon] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Update session time remaining periodically
  useEffect(() => {
    if (!user) return;

    const updateSessionTime = () => {
      const timeRemaining = authService.getSessionTimeRemaining();
      setSessionTimeRemaining(timeRemaining);
      setIsSessionExpiringSoon(authService.isSessionExpiringSoon());
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleSessionExpired = () => {
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please log in again.",
      variant: "destructive",
    });
    setUser(null);
    navigate('/login');
  };

  const initializeAuth = async () => {
    try {
      const storedUser = authService.getStoredUser();

      if (storedUser) {
        setUser(storedUser);

        // Start session monitoring
        authService.startSessionMonitoring();

        // Set up session callbacks
        authService.setSessionWarningCallback(() => {
          setShowSessionWarning(true);
        });

        authService.setSessionExpiredCallback(() => {
          handleSessionExpired();
        });

        // Try to verify the session is still valid
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Session expired or invalid, clear stored data
          console.error('Session validation failed:', error);
          authService.clearAuth();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      authService.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const user = await authService.register(data);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const logoutAllDevices = async () => {
    setIsLoading(true);
    try {
      await authService.logoutAllDevices();
    } catch (error) {
      console.error('Logout all devices failed:', error);
      throw error;
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const extendSession = async (minutes: number = 30) => {
    try {
      await authService.extendSession(minutes);
      // Update session time after extension
      const timeRemaining = authService.getSessionTimeRemaining();
      setSessionTimeRemaining(timeRemaining);
      setIsSessionExpiringSoon(authService.isSessionExpiringSoon());
    } catch (error) {
      console.error('Session extension failed:', error);
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => user?.roles.includes(role)) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => user?.permissions.includes(permission)) || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    sessionTimeRemaining,
    isSessionExpiringSoon,
    login,
    register,
    logout,
    logoutAllDevices,
    extendSession,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionWarningDialog
        isOpen={showSessionWarning}
        onClose={() => setShowSessionWarning(false)}
        onLogout={logout}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
