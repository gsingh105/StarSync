import axios from 'axios';

// 1. FIX: Use VITE_API_URL
const envUrl = import.meta.env.API_URL || 'http://localhost:3000';

const baseURL = envUrl.includes('/api/astrologer') 
  ? envUrl 
  : `${envUrl.replace(/\/$/, '')}/api/astrologer`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const astrologerService = {
  // Login
  login: async (email) => {
    try {
      // Note: You usually need a password here too, but following your code structure:
      const response = await api.post('/login', { email });
      
      if (response.data.success) {
        // 2. FIX: Robust Data Extraction
        // Check 'astrologer' OR 'data' OR 'user' to ensure we get the object
        return response.data.astrologer || response.data.data || response.data.user; 
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login service error:", error);
      throw error.response?.data?.message || error.message || "Authentication failed";
    }
  },

  // Fetch Current Astrologer
  getCurrentAstrologer: async () => {
    try {
      const response = await api.get('/current-astrologer');
      if (response.data.success) {
        // This was already working, but let's be safe
        return response.data.data || response.data.astrologer; 
      }
      return null;
    } catch (error) {
      // Don't throw here, just return null so the context knows we aren't logged in
      return null; 
    }
  },

  logout: async () => {
      try {
          await api.post('/logout'); 
      } catch (e) {
          console.error(e);
      }
  },

  register: async (astrologerData) => {
    try {
      const response = await api.post('/add', astrologerData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  getAll: async() => {
    try {
      const response = await api.get('/')
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
};

export default astrologerService;