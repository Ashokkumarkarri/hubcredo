import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// Leads API
export const leadsAPI = {
  analyze: (url) => api.post('/api/leads/analyze', { url }),
  getAll: (params) => api.get('/api/leads', { params }),
  getById: (id) => api.get(`/api/leads/${id}`),
  delete: (id) => api.delete(`/api/leads/${id}`),
  getStats: () => api.get('/api/leads/stats/overview'),
  sendEmail: (data) => api.post('/api/leads/send-email', data),
};

export default api;
