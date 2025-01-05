import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAdmin');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      error.response = {
        data: {
          error: 'Network error. Please check your connection and try again.'
        }
      };
    }

    return Promise.reject(error);
  }
);

// API methods
const apiMethods = {
  // Auth endpoints
  auth: {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    getProfile: () => API.get('/auth/profile'),
    updateProfile: (data) => API.put('/auth/profile', data),
    changePassword: (data) => API.put('/auth/change-password', data)
  },

  // Events endpoints
  events: {
    getAll: () => API.get('/events'),
    getOne: (id) => API.get(`/events/${id}`),
    create: (data) => API.post('/events', data),
    update: (id, data) => API.put(`/events/${id}`, data),
    delete: (id) => API.delete(`/events/${id}`),
    register: (id) => API.post(`/events/${id}/register`),
    unregister: (id) => API.delete(`/events/${id}/register`)
  },

  // Admin endpoints
  admin: {
    getUsers: () => API.get('/admin/users'),
    updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
    deleteUser: (id) => API.delete(`/admin/users/${id}`),
    getStats: () => API.get('/admin/stats')
  }
};

// Error handler helper
export const handleApiError = (error) => {
  const errorMessage = error.response?.data?.error || 
    error.message || 
    'An unexpected error occurred';
  
  return {
    error: errorMessage,
    details: error.response?.data?.details
  };
};

export default {
  ...API,
  ...apiMethods,
  handleApiError
};