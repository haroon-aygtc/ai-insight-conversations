// Base URLs for API and authentication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const SANCTUM_URL = import.meta.env.VITE_SANCTUM_URL || 'http://localhost:8000';
interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseURL: string;
  private sanctumURL: string;
  private csrfTokenPromise: Promise<void> | null = null;
  private lastCsrfTokenFetch: number = 0;
  private readonly CSRF_TOKEN_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private retryCount: number = 0;
  private readonly MAX_RETRIES: number = 3;

  constructor(baseURL: string, sanctumURL: string) {
    this.baseURL = baseURL;
    this.sanctumURL = sanctumURL;
  }

  // Get CSRF token for Laravel Sanctum - simplified version
  async getCsrfToken(forceRefresh = false): Promise<void> {
    try {
      console.log('Fetching CSRF token from:', `${this.sanctumURL}/sanctum/csrf-cookie`);

      const response = await fetch(`${this.sanctumURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include', // This is critical for cookies
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        cache: 'no-cache'
      });

      if (!response.ok) {
        console.error('Failed to get CSRF token:', response.status, response.statusText);
        throw new Error(`Failed to get CSRF token: ${response.status}`);
      }

      // Give browser time to set the cookie
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update last fetch time
      this.lastCsrfTokenFetch = Date.now();
    } catch (error) {
      console.error('Error getting CSRF token:', error);
      throw error;
    }
  }

  

  // Debug method to check current cookies
  debugCookies(): void {
    console.log('Current cookies:', document.cookie);
    const xsrfTokenPromise = this.getCookie('XSRF-TOKEN');
    xsrfTokenPromise.then(token => {
      console.log('XSRF-TOKEN:', token ? `${token.substring(0, 10)}...` : 'Not found');
    });
    this.getCookie('laravel_session').then(session => {
      console.log('laravel_session:', session ? 'Present' : 'Not found');
    });
  }

  async getCookie(name: string): Promise<string | null> {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      // Decode URL-encoded cookie value
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Get CSRF token from cookie
    const csrfToken = await this.getCookie('XSRF-TOKEN');

    // Set up headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Only add CSRF token if it exists
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    // Ensure endpoint starts with a slash for proper URL formatting
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    try {
      const response = await fetch(`${this.baseURL}${formattedEndpoint}`, config);

      // Parse the response
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiService = new ApiService();
export default apiService;
