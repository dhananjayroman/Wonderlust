import axios from './axios';

export const getWishlist = async () => {
  const response = await axios.get('/api/auth/wishlist');
  return response.data?.data || response.data || response;
};

export const addToWishlist = async (listingId) => {
  const response = await axios.post('/api/auth/wishlist', { listingId });
  return response.data?.data || response.data || response;
};

export const removeFromWishlist = async (listingId) => {
  const response = await axios.delete(`/api/auth/wishlist/${listingId}`);
  return response.data?.data || response.data || response;
};
