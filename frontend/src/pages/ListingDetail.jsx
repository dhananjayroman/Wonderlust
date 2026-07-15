import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart, Share, User, Edit3, Trash2, Maximize, BedDouble, Bath, Home as HomeIcon } from 'lucide-react';
import useListing from '../hooks/useListing';
import useAuth from '../hooks/useAuth';
import useWishlistStore from '../store/useWishlistStore';
import { deleteListing, addReview, deleteReview as apiDeleteReview } from '../api/listingService';
import MapView from '../components/MapView';
import ReviewCard from '../components/ReviewCard';
import Button from '../components/Button';
import StickyLeadGenerationCard from '../components/StickyLeadGenerationCard';
import InputField from '../components/InputField';
import toast from 'react-hot-toast';
import FullPageLoader from '../components/FullPageLoader';
import ErrorBanner from '../components/ErrorBanner';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, reviews, setReviews, loading, error, refetch } = useListing(id);
  const { user, isAuthenticated } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  
  const isWishlisted = wishlistIds.includes(id);
  
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && wishlistIds.length === 0) {
      useWishlistStore.getState().fetchWishlist();
    }
  }, [isAuthenticated, wishlistIds.length]);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add properties to your wishlist.');
      navigate('/login');
      return;
    }
    await toggleWishlist(listing);
  };

  if (loading) return <FullPageLoader />;
  if (error || !listing) return <div className="pt-20 px-8"><ErrorBanner message={error || 'Listing not found'} onRetry={refetch} /></div>;

  const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(true);
    try {
      await deleteListing(id);
      toast.success('Listing deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to delete listing');
      setDeleting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login');
    if (!reviewData.comment.trim()) return toast.error('Please write a comment');

    setSubmittingReview(true);
    try {
      const data = await addReview(id, reviewData);
      toast.success('Review added successfully');
      setReviews(data.reviews || data.listing?.reviews || []);
      setReviewData({ rating: 5, comment: '' });
      refetch(); 
    } catch (err) {
      toast.error(err.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await apiDeleteReview(id, reviewId);
      toast.success('Review deleted');
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  const locationText = typeof listing.location === 'object' 
    ? `${listing.location.city}, ${listing.location.state}` 
    : (listing.location || 'Location missing');

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-28 pb-32">
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {listing.listingType && (
                <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  FOR {listing.listingType}
                </span>
              )}
              {listing.propertyType && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                  {listing.propertyType}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-3">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {locationText}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-secondary fill-current" /> {listing.rating || 4.8} ({reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0">
            <button 
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!'); }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors border border-gray-200"
            >
              <Share className="w-4 h-4" /> Share
            </button>
            <button 
              onClick={handleWishlist}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-xl text-gray-700 transition-colors border border-gray-200"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-3xl mb-12">
        <img 
          src={listing.images?.[0]?.url || listing.image?.url || listing.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'} 
          alt={listing.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        <div className="lg:col-span-2 space-y-10">
          
          <div className="flex justify-between items-center pb-8 border-b">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-4">
                {listing.propertyType ? listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1) : 'Property'} listed by {listing.owner?.username || 'Owner'}
              </h2>
              <div className="flex flex-wrap gap-3 text-gray-700 font-medium text-sm">
                {listing.bedrooms > 0 && <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"><BedDouble className="w-4 h-4 text-gray-500" /> {listing.bedrooms} Bedrooms</span>}
                {listing.bathrooms > 0 && <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"><Bath className="w-4 h-4 text-gray-500" /> {listing.bathrooms} Baths</span>}
                {listing.area > 0 && <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"><Maximize className="w-4 h-4 text-gray-500" /> {listing.area} Sq.Ft.</span>}
                {listing.furnished && <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl capitalize"><HomeIcon className="w-4 h-4 text-gray-500" /> {listing.furnished.replace('_', ' ')}</span>}
              </div>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner border border-blue-100 shrink-0 hidden md:flex">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>

          {isOwner && (
            <div className="p-4 bg-gray-50 border rounded-2xl flex gap-4 pb-4">
              <Button 
                label="Edit Listing" 
                variant="outline"
                onClick={() => navigate(`/listings/${id}/edit`)}
                icon={<Edit3 className="w-4 h-4" />}
              />
              <Button 
                label="Delete" 
                variant="outline"
                className="text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50"
                onClick={handleDeleteListing}
                loading={deleting}
              />
            </div>
          )}

          <div className="pb-8 border-b">
            <h3 className="text-xl font-bold mb-4">About this property</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="pb-8 border-b">
            <h3 className="text-xl font-bold mb-6">Property Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Property Type</p>
                <p className="font-semibold text-secondary capitalize">{listing.propertyType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Listing Type</p>
                <p className="font-semibold text-secondary capitalize">{listing.listingType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Floor</p>
                <p className="font-semibold text-secondary">{listing.floor || 0} of {listing.totalFloors || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Address</p>
                <p className="font-semibold text-secondary">{typeof listing.location === 'object' ? listing.location.address : 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">RERA Number</p>
                <p className="font-semibold text-secondary">{listing.reraNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="pb-8 border-b">
            <h3 className="text-xl font-bold mb-4">Location on map</h3>
            <MapView location={typeof listing.location === 'object' ? `${listing.location.address}, ${listing.location.city}, ${listing.location.state}` : listing.location} geometry={listing.geometry} />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 fill-current text-secondary" />
              {listing.rating || 4.8} · {reviews.length} reviews
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {reviews.map(review => (
                <ReviewCard 
                  key={review._id} 
                  review={review} 
                  currentUser={user}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>

            {isAuthenticated && (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="text-lg font-bold mb-4">Leave a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-secondary block mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <InputField 
                    type="textarea"
                    placeholder="Share your experience..."
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  />
                  <Button type="submit" label="Submit Review" loading={submittingReview} />
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block relative">
          <StickyLeadGenerationCard listing={listing} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
