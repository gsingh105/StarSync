// src/services/astrologerService.js
import axios from 'axios';

// 1. Setup Base URL
const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const baseURL = envUrl.includes('/api/astrologer') 
  ? envUrl 
  : `${envUrl.replace(/\/$/, '')}/api/astrologer`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  // Remove default headers here so we can control them per request
});

const astrologerService = {
  // Login
  login: async (email) => {
    try {
      const response = await api.post('/login', { email });
      if (response.data.success) {
        return response.data.astrologer || response.data.data || response.data.user; 
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Logout
  logout: async () => {
      try { await api.post('/logout'); } catch (e) { console.error(e); }
  },

  // Get Current
  getCurrentAstrologer: async () => {
    try {
      const response = await api.get('/current-astrologer');
      return response.data.data || response.data.astrologer; 
    } catch (error) {
      return null; 
    }
  },

  // --- REGISTER (FIXED FOR FILE UPLOAD) ---
  register: async (astrologerData) => {
    try {
      const isFormData = astrologerData instanceof FormData;
      
      const config = {
        headers: {
          // CRITICAL FIX: 
          // If it is FormData, set Content-Type to undefined.
          // This lets the browser generate the correct boundary automatically.
          // If we manually set 'multipart/form-data', the upload WILL FAIL.
          'Content-Type': isFormData ? undefined : 'application/json',
        }
      };

      const response = await api.post('/add', astrologerData, config);
      return response.data;
    } catch (error) {
      console.error("Register Error:", error.response?.data);
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