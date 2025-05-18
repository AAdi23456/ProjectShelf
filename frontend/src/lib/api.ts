import axios from 'axios';
import Cookies from 'js-cookie';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://projectshelf-93gi.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add authentication token to requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} Request to: ${config.baseURL}${config.url}`);
    
    // Check for token in localStorage first (used by most components)
    const localToken = localStorage.getItem('token');
    // Then check for token in cookies (alternative storage)
    const cookieToken = Cookies.get('auth_token');
    
    // Use whichever token is available
    const token = localToken || cookieToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error interceptor:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from: ${response.config.url} | Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ Error response:`, error);
    if (error.response) {
      // Server responded with a non-2xx status
      console.error(`Status: ${error.response.status} | Data:`, error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received', error.request);
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    try {
      console.log('Sending registration request with data:', userData);
      const response = await api.post('/users/register', userData);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  },
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  upgradeToCreator: async () => {
    const response = await api.post('/users/upgrade-to-creator');
    return response.data;
  },
};

// Project API
export const projectAPI = {
  getProjects: async (page = 1, limit = 10) => {
    const response = await api.get(`/projects?page=${page}&limit=${limit}`);
    return response.data;
  },
  getProjectBySlug: async (slug: string) => {
    const response = await api.get(`/projects/${slug}`);
    return response.data;
  },
  getUserProjects: async () => {
    try {
      const response = await api.get('/projects/user/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user projects:', error);
      return { projects: [] }; // Return empty projects array on error
    }
  },
  createProject: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  updateProject: async (id: string, projectData: any) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// User Profile API
export const profileAPI = {
  getUserProfile: async (username: string) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },
};

export default api; 