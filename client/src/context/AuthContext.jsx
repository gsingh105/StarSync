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

  const getCleanUser = (data) => {
    if (!data) return null;
    if (data.data && !data.fullName) return data.data; 
    if (data.user) return data.user;
    return data;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.checkAuth();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        console.log(error)
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const email = credentials.email || credentials;
      const password = credentials.password;
      const response = await authService.login({ email, password });
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

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // THE FIX IS HERE: Added setUser to the object below
  const value = {
    user,
    setUser, 
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