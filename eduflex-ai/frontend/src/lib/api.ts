import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    },
    register: async (userData: any) => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
    getCurrentUser: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
  },
  users: {
    getStudents: async () => {
      const response = await apiClient.get('/users/students');
      return response.data;
    },
    getStudentReport: async (id: string) => {
      const response = await apiClient.get(`/users/${id}/report`);
      return response.data;
    }
  },
  assignments: {
    create: async (data: any) => {
      const response = await apiClient.post('/assignments/', data);
      return response.data;
    },
    list: async () => {
      const response = await apiClient.get('/assignments/');
      return response.data;
    },
    get: async (id: string) => {
      const response = await apiClient.get(`/assignments/${id}`);
      return response.data;
    },
    submit: async (id: string, answers: any) => {
       const response = await apiClient.post(`/submissions`, { assignment_id: id, answers });
       return response.data; 
    },
    getAnalytics: async (id: string, generate: boolean = false) => {
      const response = generate 
        ? await apiClient.post(`/analytics/assignment/${id}`) 
        : await apiClient.get(`/analytics/assignment/${id}`);
      return response.data;
    }
  }
};
