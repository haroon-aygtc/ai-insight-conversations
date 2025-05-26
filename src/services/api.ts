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

  private async fetchCsrfToken(): Promise<void> {
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

      // Debug - log cookies after token fetch
      this.debugCookies();
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Get CSRF token
    const csrfToken = await this.getCookie('XSRF-TOKEN');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers as Record<string, string>,
    };

    // Only add CSRF token if it exists
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
    } else {
      // Get a fresh token if we don't have one
      await this.getCsrfToken(true);
      const freshToken = await this.getCookie('XSRF-TOKEN');
      if (freshToken) {
        headers['X-XSRF-TOKEN'] = freshToken;
      }
    }

    const config: RequestInit = {
      headers,
      credentials: 'include', // Always include cookies
      mode: 'cors',
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Parse the response
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = null;
      }

      if (!response.ok) {
        // Create a standard error object
        const error: any = new Error(
          responseData?.message || `Server error: ${response.status}`
        );
        
        // Add response data to the error object
        error.status = response.status;
        error.response = {
          status: response.status,
          data: responseData
        };

        // Handle unauthorized errors (401)
        if (response.status === 401) {
          // Clear user data from storage
          sessionStorage.removeItem('user');
          
          // Don't redirect automatically - let the calling code handle the error
          // This prevents unexpected redirects during form submissions
          console.error('Authentication error: User is not authenticated');
          error.isAuthError = true;
        }

        if (response.status === 419) {
          error.message = 'CSRF token mismatch';
          // Get a fresh token and redirect to login
          await this.getCsrfToken(true);
          window.location.href = '/login';
        }

        if (response.status === 422 && responseData?.errors) {
          // Validation errors
          error.message = 'Validation failed';
        }

        throw error;
      }

      return { data: responseData };
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.requestWithCsrf<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.requestWithCsrf<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.requestWithCsrf<T>(endpoint, { method: 'DELETE' });
  }

  private async requestWithCsrf<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    // Always get a fresh CSRF token before mutating requests
    await this.getCsrfToken();
    
    // Make the request
    return await this.request<T>(endpoint, options);
  }
}

export const apiService = new ApiService(API_BASE_URL, SANCTUM_URL);

// Export for debugging
export const debugCookies = () => apiService.debugCookies();

export default apiService;
