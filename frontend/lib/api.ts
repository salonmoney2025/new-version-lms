import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  User,
  Student,
  StaffMember,
  Course,
  Campus,
  Payment,
  PaginatedResponse,
} from '@/types';

// Type for API query parameters
type QueryParams = Record<string, string | number | boolean | undefined>;

// Extended request config to track retries
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies) in all requests
});

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookie first, then localStorage
    const tokenFromCookie = getCookie('auth-token');
    const tokenFromStorage = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const token = tokenFromCookie || tokenFromStorage;

    // DEBUG: Log token information
    console.log('[API Debug] Request to:', config.url);
    console.log('[API Debug] Token from cookie:', tokenFromCookie ? `${tokenFromCookie.substring(0, 20)}...` : 'null');
    console.log('[API Debug] Token from localStorage:', tokenFromStorage ? `${tokenFromStorage.substring(0, 20)}...` : 'null');
    console.log('[API Debug] Using token:', token ? `${token.substring(0, 20)}...` : 'null');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Debug] Authorization header set');
    } else {
      console.log('[API Debug] NO TOKEN FOUND - Request will fail with 401');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Development vs Production mode
const isDev = process.env.NODE_ENV === 'development';

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          console.log('[API] Attempting token refresh...');

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access, refresh } = response.data;

          // Update both tokens
          localStorage.setItem('access_token', access);
          if (refresh) {
            localStorage.setItem('refresh_token', refresh);
          }

          console.log('[API] Token refresh successful');

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return api(originalRequest);
        } else {
          // No refresh token available
          console.log('[API] No refresh token - redirecting to login');
          clearAuthAndRedirect();
        }
      } catch (refreshError) {
        // Refresh failed
        console.log('[API] Token refresh failed - clearing auth data');
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401) {
      // 401 without retry - clear and redirect
      console.log('[API] Unauthorized - redirecting to login');
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Helper function to clear auth and redirect
function clearAuthAndRedirect() {
  console.log('[API] Clearing authentication data...');

  // Clear storage
  localStorage.clear();
  sessionStorage.clear();

  // Clear all cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });

  // In development, show a helpful message
  if (isDev) {
    console.log('[DEV] Session expired. Redirecting to login...');
    console.log('[DEV] Tip: Use superadmin2@university.edu / admin123');
  }

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login?expired=true';
  }
}

// Authentication API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout/');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  changePassword: async (data: {
    old_password: string;
    new_password: string;
  }): Promise<void> => {
    await api.post('/auth/change-password/', data);
  },
};

// Students API
export const studentsAPI = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Student>> => {
    const response = await api.get('/students/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/students/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Student>): Promise<Student> => {
    const response = await api.post('/students/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Student>): Promise<Student> => {
    const response = await api.patch(`/students/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}/`);
  },
};

// Staff API
export const staffAPI = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<StaffMember>> => {
    const response = await api.get('/staff/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<StaffMember> => {
    const response = await api.get(`/staff/${id}/`);
    return response.data;
  },

  create: async (data: Partial<StaffMember>): Promise<StaffMember> => {
    const response = await api.post('/staff/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<StaffMember>): Promise<StaffMember> => {
    const response = await api.patch(`/staff/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/staff/${id}/`);
  },
};

// Courses API
export const coursesAPI = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Course>> => {
    const response = await api.get('/courses/courses/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/courses/${id}/`);
    return response.data;
  },

  create: async (data: Partial<Course>): Promise<Course> => {
    const response = await api.post('/courses/courses/', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Course>): Promise<Course> => {
    const response = await api.patch(`/courses/courses/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/courses/${id}/`);
  },
};

// Campuses API
export const campusesAPI = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Campus>> => {
    const response = await api.get('/campuses/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Campus> => {
    const response = await api.get(`/campuses/${id}/`);
    return response.data;
  },
};

// Finance API
export const financeAPI = {
  getPayments: async (params?: QueryParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get('/finance/payments/', { params });
    return response.data;
  },

  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post('/finance/payments/', data);
    return response.data;
  },
};

export default api;
