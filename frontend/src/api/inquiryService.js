import axios from './axios';

export const createInquiry = async (inquiryData) => {
  const response = await axios.post('/api/inquiries', inquiryData);
  return response.data?.data || response.data || response;
};

export const getSentInquiries = async () => {
  const response = await axios.get('/api/inquiries/sent');
  return response.data?.data || response.data || response;
};

export const getReceivedInquiries = async () => {
  const response = await axios.get('/api/inquiries/received');
  return response.data?.data || response.data || response;
};

export const updateInquiryStatus = async (id, status) => {
  const response = await axios.put(`/api/inquiries/${id}/status`, { status });
  return response.data?.data || response.data || response;
};
