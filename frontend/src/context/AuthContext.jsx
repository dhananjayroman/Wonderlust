import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, signupUser, logoutUser, getCurrentUser, sendOTP, verifyOTP } from '../api/authService';
import { addToWishlist, removeFromWishlist } from '../api/wishlistService';
import FullPageLoader from '../components/FullPageLoader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const data = await getCurrentUser();
      setUser(data.user || data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user || data);
    setIsAuthenticated(true);
  };

  const signup = async (username, email, password) => {
    const data = await signupUser(username, email, password);
    if (data.user || data) {
      setUser(data.user || data);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const sendPhoneOTP = async (phone) => {
    return await sendOTP(phone);
  };

  const verifyPhoneOTP = async (phone, code) => {
    const data = await verifyOTP(phone, code);
    if (data.isPhoneVerified) {
      setUser(prev => prev ? { ...prev, isPhoneVerified: true, phone } : null);
    }
    return data;
  };

  const addToWishlistContext = async (listingId) => {
    try {
      const updatedWishlist = await addToWishlist(listingId);
      setUser(prev => prev ? { ...prev, wishlist: updatedWishlist } : null);
      return updatedWishlist;
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlistContext = async (listingId) => {
    try {
      const updatedWishlist = await removeFromWishlist(listingId);
      setUser(prev => prev ? { ...prev, wishlist: updatedWishlist } : null);
      return updatedWishlist;
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      throw error;
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      signup, 
      logout, 
      checkAuth, 
      sendPhoneOTP, 
      verifyPhoneOTP,
      addToWishlistContext,
      removeFromWishlistContext
    }}>
      {children}
    </AuthContext.Provider>
  );

};

// Re-export useAuth hook here for convenience or export separately
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};
