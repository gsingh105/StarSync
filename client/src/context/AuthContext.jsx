import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.checkAuth();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Standard Login
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.data); 
    return data;
  };

  // Google Login Wrapper
  const googleLogin = async (accessToken) => {
    const data = await authService.googleLogin(accessToken);
    setUser(data.data);
    return data;
  };

  // Logout
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);