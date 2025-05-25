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

  constructor(baseURL: string, sanctumURL: string) {
    this.baseURL = baseURL;
    this.sanctumURL = sanctumURL;
  }

  // Get CSRF token for Laravel Sanctum
  async getCsrfToken(): Promise<void> {
    try {
      const response = await fetch(`${this.sanctumURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to get CSRF token:', response.status, response.statusText);
        throw new Error(`Failed to get CSRF token: ${response.status}`);
      }

      console.log('CSRF token request successful');
    } catch (error) {
      console.error('Error getting CSRF token:', error);
      throw error;
    }
  }

  // Debug method to check current cookies
  debugCookies(): void {
    console.log('Current cookies:', document.cookie);
    console.log('XSRF-TOKEN:', this.getCookie('XSRF-TOKEN'));
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
    }

    const config: RequestInit = {
      headers,
      credentials: 'include', // Always include cookies
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Clear any stored user data and redirect to login
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Unauthorized');
        }

        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
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
    // Get CSRF token before making the request
    await this.getCsrfToken();

    // Wait a bit to ensure the cookie is set
    await new Promise(resolve => setTimeout(resolve, 100));

    // Debug: Check if token is available
    const token = await this.getCookie('XSRF-TOKEN');
    console.log('CSRF token before request:', token ? 'Present' : 'Missing');

    try {
      return await this.request<T>(endpoint, options);
    } catch (error) {
      // If CSRF error, try once more with fresh token
      if (error instanceof Error && (error.message.includes('CSRF') || error.message.includes('token mismatch'))) {
        console.log('CSRF error detected, retrying with fresh token...');
        this.debugCookies();

        await this.getCsrfToken();
        await new Promise(resolve => setTimeout(resolve, 200)); // Longer wait

        const retryToken = await this.getCookie('XSRF-TOKEN');
        console.log('CSRF token after retry:', retryToken ? 'Present' : 'Missing');

        return await this.request<T>(endpoint, options);
      }
      throw error;
    }
  }
}

export const apiService = new ApiService(API_BASE_URL, SANCTUM_URL);

// Export for debugging
export const debugCookies = () => apiService.debugCookies();

export default apiService;
