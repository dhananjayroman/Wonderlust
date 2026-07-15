import axios from './axios';

// Default export service (returning full Axios response for zustand / other files)
const authService = {
  login: async (credentials) => {
    return await axios.post('/api/auth/login', credentials);
  },

  register: async (userData) => {
    return await axios.post('/api/auth/signup', userData);
  },

  logout: async () => {
    return await axios.post('/api/auth/logout');
  },

  getCurrentUser: async () => {
    return await axios.get('/api/auth/me');
  },

  sendOTP: async (phone) => {
    return await axios.post('/api/auth/send-otp', { phone });
  },

  verifyOTP: async (phone, otp) => {
    return await axios.post('/api/auth/verify-otp', { phone, otp });
  }
};

// Named exports for context and other files (unwrapping response.data)
export const loginUser = async (email, password) => {
  const response = await axios.post('/api/auth/login', { username: email, password });
  return response.data?.data || response.data || response;
};

export const signupUser = async (username, email, password) => {
  const response = await axios.post('/api/auth/signup', { username, email, password });
  return response.data?.data || response.data || response;
};

export const logoutUser = async () => {
  const response = await axios.post('/api/auth/logout');
  return response.data?.data || response.data || response;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/api/auth/me');
  return response.data?.data || response.data || response;
};

export const sendOTP = async (phone) => {
  const response = await axios.post('/api/auth/send-otp', { phone });
  return response.data?.data || response.data || response;
};

export const verifyOTP = async (phone, otp) => {
  const response = await axios.post('/api/auth/verify-otp', { phone, otp });
  return response.data?.data || response.data || response;
};

export const requestSellerVerification = async () => {
  const response = await axios.post('/api/auth/request-seller');
  return response.data?.data || response.data || response;
};

export default authService;

