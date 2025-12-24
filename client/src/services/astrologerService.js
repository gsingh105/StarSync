import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const baseURL = envUrl.includes('/api/astrologer')
  ? envUrl
  : `${envUrl.replace(/\/$/, '')}/api/astrologer`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const astrologerService = {
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


  logout: async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error(e);
    }
  },

  getCurrentAstrologer: async () => {
    try {
      const response = await api.get('/current-astrologer');
      return response.data.data || response.data.astrologer;
    } catch (error) {
      return null;
    }
  },

  register: async (astrologerData) => {
    try {
      const isFormData = astrologerData instanceof FormData;

      const config = {
        headers: {
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

  getAll: async () => {
    try {
      const response = await api.get('/')
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
};

export default astrologerService;