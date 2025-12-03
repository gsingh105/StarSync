import React, { createContext, useContext, useState, useEffect } from 'react';
import astrologerService from '../services/astrologerService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. CHECK SESSION ON MOUNT
  // Since we use cookies, we can't just check localStorage for a token.
  // We must ask the server "Am I logged in?" (via getCurrentAstrologer)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await astrologerService.getCurrentAstrologer();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If 401 or error, we are not logged in
        console.log("Not authenticated or session expired");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginAstrologer = async (email, password) => {
    setLoading(true);
    try {
      // Service handles the API call, Browser handles the cookie
      const userData = await astrologerService.login(email, password);
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Optional: Call backend to clear cookie
    await astrologerService.logout(); 
    
    setUser(null);
    setIsAuthenticated(false);
    // Clear any local storage user data if you were keeping it for UI cache
    localStorage.removeItem('astrologer_user'); 
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    loginAstrologer,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;