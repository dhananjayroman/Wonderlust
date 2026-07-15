import { create } from 'zustand';
import authService from '../api/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Check current session on mount
  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getCurrentUser();
      if (response.data?.success) {
        set({ user: response.data.data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Log in user
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ username, password });
      if (response.data?.success) {
        set({ user: response.data.data, isAuthenticated: true, error: null });
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (err) {
      const msg = err.message || 'Login failed';
      set({ error: msg, isAuthenticated: false });
      return { success: false, message: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  // Log out user
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, error: null });
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err.message);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  // Register user
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      if (response.data?.success) {
        set({ user: response.data.data, isAuthenticated: true, error: null });
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Registration failed' };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      set({ error: msg });
      return { success: false, message: msg };
    } finally {
      set({ isLoading: false });
    }
  }
}));
