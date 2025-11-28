import axios from 'axios';

// Configure base URL - Uses window.location for fallback if env var is missing
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true, // Important: This enables sending cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      // --- FIX IS HERE ---
      // We accept the data exactly as the component sends it.
      // The component sends { fullName, email, password }, so we use those keys.
      const response = await api.post('/register', {
        fullName: userData.fullName, // Changed from userData.name to userData.fullName
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      });

      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Optional: Call backend logout endpoint if you implement it
      // await api.post('/logout');
      
      // Clear local storage
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user;
  },

  // Get user token (if stored separately)
  getToken: () => {
    const user = authService.getCurrentUser();
    return user?.token || null;
  },

  // Update user data in localStorage
  updateUser: (userData) => {
    try {
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error updating user data:', error);
      return null;
    }
  }
};

export default authService;