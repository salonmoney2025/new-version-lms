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
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
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
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
