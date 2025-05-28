import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, authService } from '@/services/auth';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkPermission, checkPermissions } from '@/services/permissionService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => Promise<boolean>;
  hasPermissionSync: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => Promise<boolean>;
  hasAnyPermissionSync: (permissions: string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  // With pure Laravel Sanctum, we don't need to track session time manually
  // Session management is handled by the server

  const handleSessionExpired = () => {
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please log in again.",
      variant: "destructive",
    });
    logout();
    navigate('/login');
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return Promise.resolve();
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login for development
      const mockUser = {
        id: '1',
        email,
        name: 'John Doe',
        avatar: '/api/placeholder/32/32',
        roles: ['user'],
        permissions: ['read', 'write']
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration for development
      const mockUser = {
        id: '1',
        email,
        name,
        avatar: '/api/placeholder/32/32',
        roles: ['user'],
        permissions: ['read', 'write']
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Could not create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Always clear local state first to ensure user is logged out locally
      setUser(null);

      // Try to logout from server, but don't fail if it doesn't work
      try {
        await authService.logout();

        // Show success toast only if server logout succeeded
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
      } catch (serverError) {
        console.error('Server logout error:', serverError);

        // Show warning toast but don't prevent logout
        toast({
          title: "Logout completed locally",
          description: "You have been logged out locally. Server logout encountered an issue but your session is cleared.",
          variant: "default",
        });
      }

      // Always redirect to login page regardless of server response
      navigate('/login', { replace: true });

      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);

      // Ensure user is logged out locally even if everything fails
      setUser(null);

      // Show error toast
      toast({
        title: "Logout completed",
        description: "Your local session has been cleared.",
        variant: "default",
      });

      // Always redirect to login page
      navigate('/login', { replace: true });

      return Promise.resolve(); // Don't reject, logout should always succeed locally
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;

    return user.roles.some(r =>
      typeof r === 'string' ? r === role : r.name === role
    );
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;

    // First check local permissions
    const hasLocalPermission = user.permissions.some(p =>
      typeof p === 'string' ? p === permission : p.name === permission
    );

    if (hasLocalPermission) return true;

    // If not found locally, check with the server
    try {
      const result = await checkPermission(permission);
      return result;
    } catch (error) {
      console.error(`Error checking permission ${permission}:`, error);
      return false;
    }
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user || !roles.length) return false;

    return roles.some(role =>
      user.roles.some(r => typeof r === 'string' ? r === role : r.name === role)
    );
  };

  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    if (!user || !permissions.length) return false;

    // First check local permissions
    const hasLocalPermission = permissions.some(permission =>
      user.permissions.some(p => typeof p === 'string' ? p === permission : p.name === permission)
    );

    if (hasLocalPermission) return true;

    // If not found locally, check with the server
    try {
      const result = await checkPermissions(permissions, false);
      return result.hasAnyPermission;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  // Synchronous version for use in components where async isn't suitable
  const hasPermissionSync = (permission: string): boolean => {
    if (!user) return false;

    // Super admin role always has all permissions (check for common super admin role names)
    const superAdminRoles = ['super_admin', 'super-admin', 'superadmin', 'administrator'];
    if (user.roles.some(r => {
      const roleName = typeof r === 'string' ? r : r.name;
      return superAdminRoles.includes(roleName.toLowerCase());
    })) return true;

    return user.permissions.some(p =>
      typeof p === 'string' ? p === permission : p.name === permission
    );
  };

  const hasAnyPermissionSync = (permissions: string[]): boolean => {
    if (!user || !permissions.length) return false;

    // Super admin role always has all permissions (check for common super admin role names)
    const superAdminRoles = ['super_admin', 'super-admin', 'superadmin', 'administrator'];
    if (user.roles.some(r => {
      const roleName = typeof r === 'string' ? r : r.name;
      return superAdminRoles.includes(roleName.toLowerCase());
    })) return true;

    return permissions.some(permission =>
      user.permissions.some(p => typeof p === 'string' ? p === permission : p.name === permission)
    );
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    logout,
    hasRole,
    hasPermission,
    hasPermissionSync,
    hasAnyRole,
    hasAnyPermission,
    hasAnyPermissionSync,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
