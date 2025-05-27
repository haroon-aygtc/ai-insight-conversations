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
  action: string;
  timestamp: string;
  details: string;
  ip_address?: string;
}

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  total: number;
}

class AuthService {
  user: User | null = null;

  async login(credentials: LoginCredentials): Promise<User> {
    try {
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

  async register(data: RegisterData): Promise<User> {
    try {
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

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.user = storedUser;
        return storedUser;
      }

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

  isAuthenticated(): boolean {
    return !!this.getStoredUser();
  }

  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return !!user && Array.isArray(user.roles) && user.roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    const user = this.getStoredUser();
    return !!user && Array.isArray(user.permissions) && user.permissions.includes(permission);
  }

  clearAuth(): void {
    this.user = null;
    sessionStorage.removeItem('user');
  }

  async getActivityLogs(): Promise<{ logs: ActivityLog[]; total: number }> {
    try {
      const response = await apiService.get('/api/user/activity-logs');
      const data = response.data as any;
      return {
        logs: data.logs || [],
        total: data.total || 0
      };
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { logs: [], total: 0 };
    }
  }

  async getActiveSessions(): Promise<SessionInfo[]> {
    try {
      const response = await apiService.get('/api/user/sessions');
      const data = response.data as any;
      return data.sessions || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      await apiService.delete(`/api/user/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  }

  async logoutAllDevices(): Promise<void> {
    try {
      await apiService.post('/api/user/logout-all');
    } catch (error) {
      console.error('Error logging out all devices:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
