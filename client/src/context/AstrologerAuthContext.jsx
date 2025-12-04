import React, { createContext, useContext, useState, useEffect } from 'react';
import astrologerService from '../services/astrologerService';

const AstrologerAuthContext = createContext();

export const useAstrologerAuth = () => {
  return useContext(AstrologerAuthContext);
};

export const AstrologerAuthProvider = ({ children }) => {
  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- HELPER: Normalize Data ---
  // Ensure we extract the inner object if the service returns a wrapper
  const handleAstrologerData = (data) => {
    if (!data) return null;
    // If the service returns { success: true, astrologer: {...} } instead of just {...}
    if (data.astrologer) return data.astrologer;
    if (data.data) return data.data;
    return data;
  };

  // 1. Check Session on Mount
  const checkAstrologerSession = async () => {
    try {
      // Don't set loading true here if you want background refresh
      // But for initial load, we keep it:
      if (!astrologer) setLoading(true);

      const data = await astrologerService.getCurrentAstrologer();
      const cleanData = handleAstrologerData(data);

      if (cleanData) {
        setAstrologer(cleanData);
        setIsAuthenticated(true);
      } else {
        setAstrologer(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAstrologer(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAstrologerSession();
  }, []);

  // 2. Login Wrapper
  const login = async (email) => {
    setLoading(true);
    try {
      const data = await astrologerService.login(email);
      
      // FIX: Normalize immediately so dashboard gets data without refresh
      const cleanData = handleAstrologerData(data);

      setAstrologer(cleanData);
      setIsAuthenticated(true);
      return cleanData;
    } catch (error) {
      setIsAuthenticated(false);
      setAstrologer(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 3. Logout Wrapper
  const logout = async () => {
    try {
      await astrologerService.logout();
    } catch (error) {
      console.error("Logout error", error);
    }
    setAstrologer(null);
    setIsAuthenticated(false);
  };

  const value = {
    astrologer,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAstrologerSession
  };

  return (
    <AstrologerAuthContext.Provider value={value}>
      {children}
    </AstrologerAuthContext.Provider>
  );
};

export default AstrologerAuthContext;