import axios from 'axios';

// Ensure this matches your Vite environment variable or fallback
const envUrl = import.meta.env.API_URL || 'http://localhost:3000';

const baseURL = envUrl.includes('/api/astrologer') 
  ? envUrl 
  : `${envUrl.replace(/\/$/, '')}/api/astrologer`;

// 1. CONFIGURE AXIOS FOR COOKIES
const api = axios.create({
  baseURL,
  withCredentials: true, // <--- CRITICAL: Sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  }
});

const astrologerService = {
  // Login
  login: async (email, password) => {
    try {
      // Fix: Send both email and password
      const response = await api.post('/login', { email});
      
      if (response.data.success) {
        // The TOKEN is handled automatically by the browser (Set-Cookie header)
        // We return the user data
        return response.data.astrologer; 
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login service error:", error);
      throw error.response?.data?.message || error.message || "Authentication failed";
    }
  },

  // Fetch Current Astrologer (Uses the cookie automatically)
  getCurrentAstrologer: async () => {
    try {
      const response = await api.get('/current-astrologer');
      
      if (response.data.success) {
        return response.data.data; // Note: Response helper usually puts data in .data field
      }
      return null;
    } catch (error) {
      // If 401, it means cookie is missing or invalid
      console.error("Failed to fetch fresh profile data:", error);
      throw error;
    }
  },

  // Logout (Optional: Hit backend to clear cookie)
  logout: async () => {
      try {
          await api.post('/logout'); // Ensure this route exists in backend
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
  }
};

export default astrologerService;