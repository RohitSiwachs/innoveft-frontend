import axios from 'axios';
import { getToken, removeToken } from './cookies';

// API base URL - change this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle success/error
api.interceptors.response.use(
  (response) => {
    // Success response (2xx)
    return response;
  },
  (error) => {
    // Error response
    if (error.response) {
      const { status, data } = error.response;

      // 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      // Extract error message
      const errorMessage = data?.error || data?.message || 'Something went wrong';
      error.message = errorMessage;
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// API methods with loading state support
export const apiRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url,
    };

    if (data) {
      config.data = data;
    }

    const response = await api(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Convenience methods
export const authAPI = {
  login: (email, password) => apiRequest('POST', '/api/auth/login', { email, password }),
  register: (email, password, name) => apiRequest('POST', '/api/auth/register', { email, password, name }),
};

export const taskAPI = {
  getAll: () => apiRequest('GET', '/api/tasks'),
  getById: (id) => apiRequest('GET', `/api/tasks/${id}`),
  create: (data) => apiRequest('POST', '/api/tasks', data),
  update: (id, data) => apiRequest('PUT', `/api/tasks/${id}`, data),
  delete: (id) => apiRequest('DELETE', `/api/tasks/${id}`),
};

export default api;
