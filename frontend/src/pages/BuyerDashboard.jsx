import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSentInquiries } from '../api/inquiryService';
import { requestSellerVerification } from '../api/authService';
import useWishlistStore from '../store/useWishlistStore';
import ListingCard from '../components/ListingCard';
import FullPageLoader from '../components/FullPageLoader';
import ErrorBanner from '../components/ErrorBanner';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { BadgeCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

const BuyerDashboard = () => {
  const { wishlistItems, fetchWishlist, isLoading: wishlistLoading } = useWishlistStore();
  const { user, checkAuth } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('wishlist');

  useEffect(() => {
    fetchWishlist();
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const data = await getSentInquiries();
      setInquiries(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch inquiries');
      toast.error('Could not load your inquiries');
    } finally {
      setInquiriesLoading(false);
    }
  };

  if (wishlistLoading && inquiriesLoading) return <FullPageLoader />;
  if (error) return <div className="pt-28 px-8"><ErrorBanner message={error} onRetry={fetchInquiries} /></div>;

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-28 pb-32">
      <h1 className="text-3xl font-bold text-secondary mb-8">Buyer Hub</h1>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-6 font-semibold transition-colors relative ${activeTab === 'wishlist' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Saved Properties ({wishlistItems.length})
          {activeTab === 'wishlist' && (
            <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-3 px-6 font-semibold transition-colors relative ${activeTab === 'inquiries' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          My Inquiries ({inquiries.length})
          {activeTab === 'inquiries' && (
            <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {activeTab === 'wishlist' && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">You haven't saved any properties yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">You haven't sent any inquiries yet.</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={inquiry.property?.image?.url || inquiry.property?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                    alt={inquiry.property?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-secondary truncate pr-4">{inquiry.property?.title || 'Property Unavailable'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                        ${inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                        ${inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${inquiry.status === 'responded' ? 'bg-green-100 text-green-800' : ''}
                        ${inquiry.status === 'closed' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">
                      Seller: {inquiry.seller?.username} | Contact: {inquiry.seller?.phone}
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm italic text-gray-700 border border-gray-100">
                      "{inquiry.message}"
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-4">
                    Sent on: {new Date(inquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── Become a Seller Section ─── */}
      {!user?.isSeller && (
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <BadgeCheck className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-secondary mb-1">Become a Verified Seller</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  List your properties on Wonderlust and connect with genuine buyers.
                  Get a verified seller badge to build trust and attract more inquiries.
                </p>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                {user?.verificationRequestStatus === 'none' || !user?.verificationRequestStatus ? (
                  <button
                    onClick={async () => {
                      setSellerLoading(true);
                      try {
                        await requestSellerVerification();
                        await checkAuth();
                        toast.success('Seller verification request submitted!');
                      } catch (err) {
                        toast.error(err.response?.data?.message || err.message || 'Failed to submit request');
                      } finally {
                        setSellerLoading(false);
                      }
                    }}
                    disabled={sellerLoading}
                    className="w-full md:w-auto px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <BadgeCheck className="w-5 h-5" />
                    {sellerLoading ? 'Submitting...' : 'Apply Now'}
                  </button>
                ) : user?.verificationRequestStatus === 'pending' ? (
                  <div className="flex items-center gap-2 px-5 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 font-semibold text-sm">
                    <Clock className="w-4 h-4" /> Request Pending Review
                  </div>
                ) : user?.verificationRequestStatus === 'rejected' ? (
                  <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-sm">
                    <XCircle className="w-4 h-4" /> Request Rejected
                  </div>
                ) : user?.verificationRequestStatus === 'approved' ? (
                  <div className="flex items-center gap-2 px-5 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Approved!
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
