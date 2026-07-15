import axios from './axios';

const listingService = {
  getAllListings: async () => {
    return await axios.get('/api/listings');
  },

  getListingById: async (id) => {
    return await axios.get(`/api/listings/${id}`);
  },

  createListing: async (formData) => {
    // Send standard FormData for multiple files
    return await axios.post('/api/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateListing: async (id, formData) => {
    return await axios.put(`/api/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteListing: async (id) => {
    return await axios.delete(`/api/listings/${id}`);
  },

  searchListings: async (queryParams) => {
    return await axios.get('/api/listings/search', { params: queryParams });
  },

  addReview: async (listingId, reviewData) => {
    return await axios.post(`/api/listings/${listingId}/reviews`, reviewData);
  },

  deleteReview: async (listingId, reviewId) => {
    return await axios.delete(`/api/listings/${listingId}/reviews/${reviewId}`);
  }
};

// Named exports for hooks and components (unwrapping response.data)
export const getAllListings = async () => {
  const response = await axios.get('/api/listings');
  return response.data?.data || response.data || response;
};

export const getListingById = async (id) => {
  const response = await axios.get(`/api/listings/${id}`);
  return response.data?.data || response.data || response;
};

export const createListing = async (formData) => {
  const response = await axios.post('/api/listings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data?.data || response.data || response;
};

export const updateListing = async (id, formData) => {
  const response = await axios.put(`/api/listings/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data?.data || response.data || response;
};

export const deleteListing = async (id) => {
  const response = await axios.delete(`/api/listings/${id}`);
  return response.data?.data || response.data || response;
};

export const searchListings = async (queryParams) => {
  const response = await axios.get('/api/listings/search', { params: queryParams });
  return response.data?.data || response.data || response;
};

export const addReview = async (listingId, reviewData) => {
  const response = await axios.post(`/api/listings/${listingId}/reviews`, reviewData);
  return response.data?.data || response.data || response;
};

export const deleteReview = async (listingId, reviewId) => {
  const response = await axios.delete(`/api/listings/${listingId}/reviews/${reviewId}`);
  return response.data?.data || response.data || response;
};

export default listingService;

