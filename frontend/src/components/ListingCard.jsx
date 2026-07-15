import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useWishlistStore from '../store/useWishlistStore';
import toast from 'react-hot-toast';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  
  const isWishlisted = wishlistIds.includes(listing._id);

  // Sync wishlist on mount if not already fetched (handled in ListingDetail/App usually)
  React.useEffect(() => {
    if (isAuthenticated && wishlistIds.length === 0) {
      useWishlistStore.getState().fetchWishlist();
    }
  }, [isAuthenticated, wishlistIds.length]);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add properties to your wishlist.');
      navigate('/login');
      return;
    }
    await toggleWishlist(listing);
  };

  const getPriceText = () => {
    if (!listing.price) return 'Price on Request';
    const formattedPrice = listing.price.toLocaleString('en-IN');
    if (listing.priceType === 'per_month') return `₹ ${formattedPrice} / month`;
    if (listing.priceType === 'per_year') return `₹ ${formattedPrice} / year`;
    return `₹ ${formattedPrice}`;
  };

  const propertyDetails = [
    listing.propertyType ? listing.propertyType.charAt(0).toUpperCase() + listing.propertyType.slice(1) : '',
    listing.bedrooms ? `${listing.bedrooms} BHK` : '',
    listing.area ? `${listing.area} Sq.Ft.` : ''
  ].filter(Boolean).join(' • ');

  const locationText = typeof listing.location === 'object' ? `${listing.location.city}, ${listing.location.state}` : (listing.location || 'Location missing');

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -4 }}
      className="group cursor-pointer flex flex-col gap-3 w-full bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
      onClick={() => navigate(`/listings/${listing._id}`)}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
        <img 
          src={listing.images?.[0]?.url || listing.image?.url || listing.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={listing.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/50 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isWishlisted ? 'fill-primary text-primary' : 'text-white'}`} 
          />
        </button>
        {listing.listingType && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
            FOR {listing.listingType}
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-secondary text-lg truncate pr-4">&#8377; {getPriceText().replace('₹ ', '')}</h3>
        </div>
        
        <p className="font-semibold text-secondary truncate">{listing.title}</p>
        
        {propertyDetails && (
          <p className="text-gray-500 text-sm truncate">{propertyDetails}</p>
        )}
        
        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{locationText}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
