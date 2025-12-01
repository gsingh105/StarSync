import axios from 'axios';

const API_URL = import.meta.env.API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api/astrologer/`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const astrologerService = {
  getAll: async () => {
    try {
      const response = await api.get('/');
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error("Failed to fetch astrologers", error);
      throw error;
    }
  }
};

export default astrologerService;