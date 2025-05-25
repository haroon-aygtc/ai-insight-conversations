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
  last_activity?: string;
  session_id?: string;
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
  expires_at?: string;
  session_lifetime?: number;
}

export interface SessionInfo {
  id: string;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  is_current: boolean;
  location?: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SessionWarningConfig {
  warningTime: number; // minutes before expiry to show warning
  extendTime: number; // minutes to extend session
}

class AuthService {
  private sessionTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private sessionWarningCallback: (() => void) | null = null;
  private sessionExpiredCallback: (() => void) | null = null;
  private readonly ACTIVITY_INTERVAL = 60000; // 1 minute
  private readonly SESSION_WARNING_TIME = 5; // 5 minutes before expiry

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);

    if (response.data?.user) {
      // Store user data and session info
      sessionStorage.setItem('user', JSON.stringify(response.data.user));

      // Store session expiry if provided
      if (response.data.expires_at) {
        sessionStorage.setItem('session_expires_at', response.data.expires_at);
      }

      // Store session lifetime for calculations
      if (response.data.session_lifetime) {
        sessionStorage.setItem('session_lifetime', response.data.session_lifetime.toString());
      }

      // Log login activity
      await this.logActivity('login', 'User logged in successfully');

      // Start session monitoring
      this.startSessionMonitoring();

      // Start activity tracking
      this.startActivityTracking();

      return response.data.user;
    }

    throw new Error('Login failed');
  }

  async register(data: RegisterData): Promise<User> {
    const response = await apiService.post<AuthResponse>('/auth/register', data);

    if (response.data?.user) {
      // Store user data in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }

    throw new Error('Registration failed');
  }

  async logout(): Promise<void> {
    try {
      // Log logout activity before clearing data
      await this.logActivity('logout', 'User logged out');

      await apiService.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Stop all timers
      this.stopSessionMonitoring();

      // Clear all authentication data
      this.clearAuth();
    }
  }

  // Logout from all devices/sessions
  async logoutAllDevices(): Promise<void> {
    try {
      await this.logActivity('logout_all_devices', 'User logged out from all devices');
      await apiService.post('/auth/logout-all-devices');
    } catch (error) {
      console.error('Logout all devices failed:', error);
      throw error;
    } finally {
      this.stopSessionMonitoring();
      this.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/auth/user');

    if (response.data?.user) {
      // Update stored user data
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }

    throw new Error('Failed to get current user');
  }

  getStoredUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    // Check if user data exists in session storage
    return !!this.getStoredUser();
  }

  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.roles.includes(role) || false;
  }

  hasPermission(permission: string): boolean {
    const user = this.getStoredUser();
    return user?.permissions.includes(permission) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();
    return roles.some(role => user?.roles.includes(role)) || false;
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getStoredUser();
    return permissions.some(permission => user?.permissions.includes(permission)) || false;
  }

  // Session Management Methods
  startSessionMonitoring(): void {
    this.stopSessionMonitoring(); // Clear any existing timers

    const expiresAt = sessionStorage.getItem('session_expires_at');
    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;

    if (timeUntilExpiry <= 0) {
      this.handleSessionExpired();
      return;
    }

    // Set warning timer (5 minutes before expiry)
    const warningTime = timeUntilExpiry - (this.SESSION_WARNING_TIME * 60 * 1000);
    if (warningTime > 0) {
      this.warningTimer = setTimeout(() => {
        this.handleSessionWarning();
      }, warningTime);
    }

    // Set expiry timer
    this.sessionTimer = setTimeout(() => {
      this.handleSessionExpired();
    }, timeUntilExpiry);
  }

  stopSessionMonitoring(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  startActivityTracking(): void {
    this.activityTimer = setInterval(() => {
      this.updateLastActivity();
    }, this.ACTIVITY_INTERVAL);

    // Track user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, this.handleUserActivity.bind(this), true);
    });
  }

  private handleUserActivity(): void {
    this.updateLastActivity();
  }

  private async updateLastActivity(): Promise<void> {
    try {
      await apiService.post('/auth/update-activity');
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  }

  private handleSessionWarning(): void {
    if (this.sessionWarningCallback) {
      this.sessionWarningCallback();
    }
  }

  private handleSessionExpired(): void {
    this.logActivity('session_expired', 'Session expired automatically');
    this.clearAuth();
    if (this.sessionExpiredCallback) {
      this.sessionExpiredCallback();
    }
  }

  // Session extension
  async extendSession(minutes: number = 30): Promise<void> {
    try {
      const response = await apiService.post<{ expires_at: string }>('/auth/extend-session', {
        extend_minutes: minutes
      });

      if (response.data?.expires_at) {
        sessionStorage.setItem('session_expires_at', response.data.expires_at);
        this.startSessionMonitoring(); // Restart monitoring with new expiry
        await this.logActivity('session_extended', `Session extended by ${minutes} minutes`);
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      throw error;
    }
  }

  // Session callbacks
  setSessionWarningCallback(callback: () => void): void {
    this.sessionWarningCallback = callback;
  }

  setSessionExpiredCallback(callback: () => void): void {
    this.sessionExpiredCallback = callback;
  }

  // Get active sessions
  async getActiveSessions(): Promise<SessionInfo[]> {
    try {
      const response = await apiService.get<{ sessions: SessionInfo[] }>('/auth/sessions');
      return response.data?.sessions || [];
    } catch (error) {
      console.error('Failed to get active sessions:', error);
      return [];
    }
  }

  // Terminate specific session
  async terminateSession(sessionId: string): Promise<void> {
    try {
      await this.logActivity('session_terminated', `Terminated session: ${sessionId}`);
      await apiService.delete(`/auth/sessions/${sessionId}`);
    } catch (error) {
      console.error('Failed to terminate session:', error);
      throw error;
    }
  }

  // Activity Logging
  async logActivity(action: string, description: string): Promise<void> {
    try {
      await apiService.post('/auth/log-activity', {
        action,
        description,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw error for logging failures
    }
  }

  // Get activity logs
  async getActivityLogs(page: number = 1, limit: number = 50): Promise<{ logs: ActivityLog[], total: number }> {
    try {
      const response = await apiService.get<{ logs: ActivityLog[], total: number }>(`/auth/activity-logs?page=${page}&limit=${limit}`);
      return response.data || { logs: [], total: 0 };
    } catch (error) {
      console.error('Failed to get activity logs:', error);
      return { logs: [], total: 0 };
    }
  }

  // Check session status
  getSessionTimeRemaining(): number {
    const expiresAt = sessionStorage.getItem('session_expires_at');
    if (!expiresAt) return 0;

    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    return Math.max(0, expiryTime - currentTime);
  }

  isSessionExpiringSoon(warningMinutes: number = 5): boolean {
    const timeRemaining = this.getSessionTimeRemaining();
    return timeRemaining > 0 && timeRemaining <= (warningMinutes * 60 * 1000);
  }

  // Clear all authentication data
  clearAuth(): void {
    // Stop all timers
    this.stopSessionMonitoring();

    // Clear session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('session_expires_at');
    sessionStorage.removeItem('session_lifetime');

    // Clear any legacy localStorage items (for backward compatibility)
    localStorage.removeItem('chatadmin-authenticated');
    localStorage.removeItem('user');

    // Clear any other auth-related storage
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthService();
export default authService;
