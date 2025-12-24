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


  const handleAstrologerData = (data) => {
    if (!data) return null;
    if (data.astrologer) return data.astrologer;
    if (data.data) return data.data;
    return data;
  };

  const checkAstrologerSession = async () => {
    try {

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