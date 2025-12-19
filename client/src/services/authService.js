import axios from 'axios';

// Ensure VITE_API_URL is set in your .env file
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {

  register: async (userData) => {
    const response = await api.post('/register', {
      // Send both to be safe, backend will ignore the extra one
      name: userData.fullName,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/login', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },

  googleLogin: async (accessToken) => {
    const response = await api.post('/google', { accessToken });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/currentUser');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      return null;
    }
  },

  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/reset-password/${token}`, { password });
    return response.data;
  },

  updateProfile: async (formData) => {
    const response = await api.patch('/update-profile', formData);
    return response.data;
  },

};

export default authService;