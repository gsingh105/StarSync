import axios from 'axios';

// Configure base URL
const API_URL = import.meta.env.API_URL || 'http://localhost:3000'; // Make sure this matches your backend port

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- FIX IS HERE ---
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We only want to reject the promise here.
    // We DO NOT want to force a reload (window.location.href)
    // because React Router/AuthContext will handle the redirection.
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails (e.g., token already expired),
      // we generally just want the frontend to clear its state.
    }
  },

  checkAuth: async () => {
    try {
      // If this returns 401, the interceptor passes the error here.
      // We catch it, return null, and AuthContext sets user to null.
      // No page reload happens!
      const response = await api.get('/currentUser');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      // This catches the 401 cleanly
      return null;
    }
  }
};

export default authService;