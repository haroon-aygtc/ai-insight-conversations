import apiService from './api';
import * as RoleConstants from '@/constants/roles';
import * as PermissionConstants from '@/constants/permissions';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  roles: Array<string | { id: number; name: string; guard_name: string; description?: string; created_at?: string; updated_at?: string; pivot?: any }>;
  permissions: Array<string | { id: number; name: string; guard_name: string; created_at?: string; updated_at?: string; pivot?: any }>;
  last_activity?: string;
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
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  description: string;
  ip_address: string;
  user_agent?: string;
  created_at: string;
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
  page: number;
  perPage: number;
}

/**
 * Get the currently authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiService.get<{ user: User }>('/auth/user');

    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from auth API');
    }

    return response.data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

/**
 * Login a user with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await apiService.post<{ user: User }>('/auth/login', credentials);

    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from login API');
    }

    return response.data.user;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Invalid credentials or server error');
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await apiService.post<{ user: User }>('/auth/register', data);

    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from register API');
    }

    return response.data.user;
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Registration failed. Please try again.');
  }
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiService.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Log out from all devices
 */
export const logoutAllDevices = async (): Promise<void> => {
  try {
    await apiService.post('/auth/logout-all-devices');
  } catch (error) {
    console.error('Logout all devices error:', error);
    throw error;
  }
};

/**
 * Refresh authentication
 */
export const refreshAuth = async (): Promise<User> => {
  try {
    const response = await apiService.post<{ user: User }>('/auth/refresh');

    if (!response.data || !response.data.user) {
      throw new Error('Invalid response format from refresh API');
    }

    return response.data.user;
  } catch (error) {
    console.error('Refresh auth error:', error);
    throw error;
  }
};

/**
 * Get user activity logs
 */
export const getActivityLogs = async (page: number = 1, perPage: number = 20): Promise<ActivityLogsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('per_page', perPage.toString());

    const response = await apiService.get<ActivityLogsResponse>(`/auth/activity-logs?${queryParams.toString()}`);

    if (!response.data) {
      throw new Error('Invalid response format from activity logs API');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
};

export const authService = {
  getCurrentUser,
  login,
  register,
  logout,
  logoutAllDevices,
  refreshAuth,
  getActivityLogs
};

export default authService;
