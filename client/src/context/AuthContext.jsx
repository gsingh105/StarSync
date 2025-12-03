import React, { createContext, useContext, useState, useEffect } from 'react';
// Make sure you import the service that handles Google Auth. 
// If Astrologers use Google Login, keep this. If this is for Users, import authService.
import astrologerService from '../services/astrologerService'; 
import authService from '../services/authService'

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. CHECK SESSION ON MOUNT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.checkAuth();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Not authenticated or session expired");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 2. STANDARD LOGIN (Adapted for your Login.jsx)
  // Your Login.jsx sends an object { email, password }, but loginAstrologer expected separate args.
  // This wrapper fixes that mismatch.
  const login = async (credentials) => {
    // Check if credentials is an object (from react-hook-form) or separate strings
    const email = credentials.email || credentials;
    const password = credentials.password;

    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. GOOGLE LOGIN (The missing function)
  const googleLogin = async (token) => {
    setLoading(true);
    try {
      
      const userData = await authService.googleLogin(token); 
      
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('astrologer_user'); 
  };


  const value = {
    user,
    loading,
    isAuthenticated,
    login,       
    googleLogin, 
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;