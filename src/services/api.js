import axios from 'axios';
import { authService } from './authService';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      authService.logout();
      // You might want to redirect to login here
    }
    
    const message = error.response?.data?.message || 
                   error.message || 
                   'Error de conexión';
    
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Assignment endpoints
export const assignmentAPI = {
  getAssignments: () => api.get('/assignments'),
  getTeacherAssignments: () => api.get('/assignments/teacher'),
  createAssignment: (data) => api.post('/assignments', data),
  updateAssignment: (id, data) => api.put(`/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/assignments/${id}`),
  getAssignmentById: (id) => api.get(`/assignments/${id}`),
};

// Submission endpoints
export const submissionAPI = {
  submitAssignment: (data) => api.post('/submissions', data),
  getSubmissions: () => api.get('/submissions/student'),
  getAssignmentSubmissions: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  gradeSubmission: (id, data) => api.put(`/submissions/${id}/grade`, data),
  getSubmissionById: (id) => api.get(`/submissions/${id}`),
};

// User endpoints
export const userAPI = {
  getUsers: (role) => api.get(`/users?role=${role}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deactivateUser: (id) => api.delete(`/users/${id}`),
};

// Performance endpoints
export const performanceAPI = {
  getTeacherPerformance: (teacherId, period) => 
    api.get(`/performance/teacher/${teacherId}?period=${period}`),
  getAllTeachersPerformance: () => api.get('/performance/teachers'),
};

export default api;