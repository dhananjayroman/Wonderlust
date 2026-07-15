import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true
});

// Request Interceptor
instance.interceptors.request.use((config) => {
  // If you use token instead of session cookie, attach here
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/api/auth/me') || error.config?.url?.includes('/api/auth/wishlist') || error.config?.url?.includes('/api/auth/login');

    if (process.env.NODE_ENV === 'development') {
      // Suppress 401 console errors for initial auth/session checks to prevent console spam
      if (!(error.response?.status === 401 && isAuthEndpoint)) {
        console.error('API Error:', error.response || error.message);
      }
    }
    
    // Return readable error without forcing a hard window.location reload,
    // as ProtectedRoute and zustand stores gracefully handle unauthenticated states.
    const message = error.response?.data?.message || 'Network Error. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default instance;
