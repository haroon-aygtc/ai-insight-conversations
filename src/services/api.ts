
class ApiService {
  private baseURL: string;
  private csrfToken: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  }

  async getCsrfToken(forceRefresh = false): Promise<string> {
    if (this.csrfToken && !forceRefresh) {
      return this.csrfToken;
    }

    try {
      const response = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Extract CSRF token from cookie
        const cookies = document.cookie.split(';');
        const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
        if (xsrfCookie) {
          this.csrfToken = decodeURIComponent(xsrfCookie.split('=')[1]);
        }
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }

    return this.csrfToken || '';
  }

  debugCookies() {
    console.log('All cookies:', document.cookie);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get CSRF token
    await this.getCsrfToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.csrfToken) {
      headers['X-XSRF-TOKEN'] = this.csrfToken;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      
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
