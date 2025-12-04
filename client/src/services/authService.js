import axios from 'axios';

// 1. Fix: Vite requires env variables to start with VITE_
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true, // IMPORTANT: Cookies are used for the token
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  
  register: async (userData) => {
    const response = await api.post('/register', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
    });
    return response.data;
  },

  login: async (credentials) => {
    // 2. Fix: Ensure we send exactly what the backend expects
    const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password
    });
    // Returns the whole object (e.g., { success: true, user: {...} })
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
      // Returns ONLY the user data
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
  }
};

export default authService;