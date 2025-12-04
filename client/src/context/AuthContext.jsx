import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- HELPER: Normalize User Data ---
  // This solves the issue where name doesn't show up immediately
  const getCleanUser = (data) => {
    if (!data) return null;
    // 1. If response is inside 'data' key (common in checkAuth)
    if (data.data && !data.fullName) return data.data; 
    // 2. If response is inside 'user' key (common in login)
    if (data.user) return data.user;
    // 3. If data IS the user object
    return data;
  };

  // 1. CHECK SESSION ON MOUNT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // authService.checkAuth() already attempts to return clean data
        const userData = await authService.checkAuth();
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. LOGIN
  const login = async (credentials) => {
    setLoading(true);
    try {
      // Ensure credentials is an object { email, password }
      const email = credentials.email || credentials;
      const password = credentials.password;

      // Call service
      const response = await authService.login({ email, password });
      
      // FIX: Unwrap the user from the response immediately
      const cleanUser = getCleanUser(response);

      if (cleanUser) {
        setUser(cleanUser);
        setIsAuthenticated(true);
        return cleanUser;
      } else {
        throw new Error("Login succeeded but no user data found.");
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. GOOGLE LOGIN
  const googleLogin = async (token) => {
    setLoading(true);
    try {
      const response = await authService.googleLogin(token);
      const cleanUser = getCleanUser(response);
      
      setUser(cleanUser);
      setIsAuthenticated(true);
      return cleanUser;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. LOGOUT
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    // Since you use cookies, you don't need to clear localStorage token
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