import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getReceivedInquiries, updateInquiryStatus } from '../api/inquiryService';
import { getAllListings } from '../api/listingService';
import useAuth from '../hooks/useAuth';
import FullPageLoader from '../components/FullPageLoader';
import ErrorBanner from '../components/ErrorBanner';
import toast from 'react-hot-toast';
import { Eye, MessageSquare, TrendingUp } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inquiries');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [inquiriesData, listingsData] = await Promise.all([
        getReceivedInquiries(),
        getAllListings() // Ideally this should be fetchListingsBySeller, but for now filtering locally or expecting backend to handle if owner route exists. Let's filter locally.
      ]);
      setInquiries(inquiriesData || []);
      
      const myProperties = (listingsData?.docs || listingsData || []).filter(
        listing => listing.owner?._id === user?._id || listing.owner === user?._id
      );
      setListings(myProperties);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      toast.error('Could not load your dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus);
      setInquiries(inquiries.map(inq => inq._id === inquiryId ? { ...inq, status: newStatus } : inq));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <FullPageLoader />;
  if (error) return <div className="pt-28 px-8"><ErrorBanner message={error} onRetry={fetchDashboardData} /></div>;

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-28 pb-32">
      <h1 className="text-3xl font-bold text-secondary mb-8">Seller Hub</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Active Listings</p>
            <p className="text-2xl font-bold text-secondary">{listings.length}</p>
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-xl text-green-600"><MessageSquare className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Leads</p>
            <p className="text-2xl font-bold text-secondary">{inquiries.length}</p>
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-xl text-purple-600"><Eye className="w-6 h-6" /></div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Unread Inquiries</p>
            <p className="text-2xl font-bold text-secondary">{inquiries.filter(i => i.status === 'new').length}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-3 px-6 font-semibold transition-colors relative ${activeTab === 'inquiries' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Lead Inbox
          {activeTab === 'inquiries' && (
            <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-6 font-semibold transition-colors relative ${activeTab === 'listings' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          My Properties
          {activeTab === 'listings' && (
            <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">You haven't received any inquiries yet.</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={inquiry.property?.image?.url || inquiry.property?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                    alt={inquiry.property?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-secondary">{inquiry.buyer?.username}</h3>
                      <select 
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                        className={`text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 border outline-none
                          ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                          ${inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                          ${inquiry.status === 'responded' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          ${inquiry.status === 'closed' ? 'bg-gray-100 text-gray-800 border-gray-200' : ''}
                        `}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">
                      Interested in: {inquiry.property?.title} <br/>
                      Contact: {inquiry.phone} | {inquiry.email}
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm italic text-gray-700 border border-gray-100">
                      "{inquiry.message}"
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-4">
                    Received on: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">You don't have any active listings.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white border rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {listings.map(listing => (
                    <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-secondary">{listing.title}</td>
                      <td className="px-6 py-4">&#8377; {listing.price?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-gray-500">{typeof listing.location === 'object' ? `${listing.location.city || ''}, ${listing.location.state || ''}` : listing.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.status === 'active' ? 'bg-green-100 text-green-700' :
                          listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          listing.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          listing.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                          listing.status === 'rented' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {listing.status ? listing.status.charAt(0).toUpperCase() + listing.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
