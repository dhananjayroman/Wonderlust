import axios from './axios';

// Dashboard stats
export const getAdminStats = async () => {
  const response = await axios.get('/api/admin/stats');
  return response.data?.data || response.data || response;
};

// Users
export const getAllUsers = async () => {
  const response = await axios.get('/api/admin/users');
  return response.data?.data || response.data || response;
};

// Listings
export const getAllListingsAdmin = async () => {
  const response = await axios.get('/api/admin/listings');
  return response.data?.data || response.data || response;
};

export const getPendingListings = async () => {
  const response = await axios.get('/api/admin/listings/pending');
  return response.data?.data || response.data || response;
};

export const moderateListing = async (id, action) => {
  const response = await axios.put(`/api/admin/listings/${id}/moderate`, { action });
  return response.data?.data || response.data || response;
};

// Seller verification
export const getPendingSellerRequests = async () => {
  const response = await axios.get('/api/admin/seller-requests');
  return response.data?.data || response.data || response;
};

export const moderateSellerRequest = async (id, action) => {
  const response = await axios.put(`/api/admin/users/${id}/moderate-seller`, { action });
  return response.data?.data || response.data || response;
};
