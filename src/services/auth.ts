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
}

export const authService = new AuthService();
export default authService;
