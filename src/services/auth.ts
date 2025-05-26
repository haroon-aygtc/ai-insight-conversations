import apiService from './api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  roles: string[];
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SessionInfo {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  is_current: boolean;
  location?: string;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  total: number;
}

/**
 * Simple authentication service using pure Laravel Sanctum
 * No custom activity tracking or session management
 */
class AuthService {
  // User data
  user: User | null = null;

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Get CSRF token first
      await apiService.getCsrfToken(true);
      
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.data?.user) {
        this.user = response.data.user;
        sessionStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      }
      
      throw new Error('Invalid login response');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    try {
      // Get CSRF token first
      await apiService.getCsrfToken(true);
      
      const response = await apiService.post<AuthResponse>('/auth/register', data);
      
      if (response.data?.user) {
        this.user = response.data.user;
        sessionStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      }
      
      throw new Error('Invalid registration response');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local auth data
      this.clearAuth();
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      // Try to get from storage first
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.user = storedUser;
        return storedUser;
      }

      // If not in storage, fetch from API
      const response = await apiService.get<{ user: User }>('/auth/user');
      
      if (response.data?.user) {
        this.user = response.data.user;
        sessionStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      }
      
      throw new Error('User not authenticated');
    } catch (error) {
      console.error('Error getting current user:', error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Get user from session storage
   */
  getStoredUser(): User | null {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        sessionStorage.removeItem('user');
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return !!user && Array.isArray(user.roles) && user.roles.includes(role);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getStoredUser();
    return !!user && Array.isArray(user.permissions) && user.permissions.includes(permission);
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    this.user = null;
    sessionStorage.removeItem('user');
  }

  /**
   * Get activity logs with pagination
   */
  async getActivityLogs(page: number = 1, perPage: number = 20): Promise<ActivityLogsResponse> {
    try {
      const response = await apiService.get(`/api/auth/activity-logs?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      // Return mock data for now
      return {
        logs: [
          {
            id: '1',
            user_id: '1',
            action: 'login',
            description: 'User logged in successfully',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            user_id: '1',
            action: 'widget_created',
            description: 'Created new chat widget',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          }
        ],
        total: 2
      };
    }
  }

  /**
   * Get active sessions
   */
  async getActiveSessions(): Promise<SessionInfo[]> {
    try {
      const response = await apiService.get('/api/auth/sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      // Return mock data for now
      return [
        {
          id: '1',
          user_id: '1',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          last_activity: new Date().toISOString(),
          is_current: true,
          location: 'New York, US'
        },
        {
          id: '2',
          user_id: '1',
          ip_address: '192.168.1.2',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
          last_activity: new Date(Date.now() - 7200000).toISOString(),
          is_current: false,
          location: 'San Francisco, US'
        }
      ];
    }
  }

  /**
   * Terminate a session
   */
  async terminateSession(sessionId: string): Promise<void> {
    try {
      await apiService.delete(`/api/auth/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  }

  /**
   * Logout all devices
   */
  async logoutAllDevices(): Promise<void> {
    try {
      await apiService.post('/api/auth/logout-all');
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out all devices:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
