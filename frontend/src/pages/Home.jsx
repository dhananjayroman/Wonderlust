import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import useListings from '../hooks/useListings';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import ErrorBanner from '../components/ErrorBanner';

const Home = () => {
  const { listings, loading, error, refetch } = useListings();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = useMemo(() => {
    if (!searchQuery) return listings;
    const query = searchQuery.toLowerCase();
    return listings.filter(l => 
      l.title?.toLowerCase().includes(query) || 
      l.location?.toLowerCase().includes(query) ||
      l.country?.toLowerCase().includes(query)
    );
  }, [listings, searchQuery]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-20">
      <div className="relative h-[80vh] min-h-[500px] max-h-[800px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto flex flex-col items-center gap-8 mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 drop-shadow-lg"
          >
            Find Your Perfect Stay
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-2xl bg-white rounded-full p-2 flex items-center shadow-2xl"
          >
            <div className="flex-grow px-6">
              <input 
                type="text" 
                placeholder="Search by title or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-secondary font-medium placeholder-gray-500"
              />
            </div>
            <button className="bg-primary hover:bg-[#E61E4D] text-white p-4 rounded-full transition-colors shadow-md">
              <Search className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16 pt-8">
        <h2 className="text-3xl font-bold text-secondary mb-8">Explore Listings</h2>
        
        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
            {[...Array(8)].map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : filteredListings.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10"
          >
            {filteredListings.map(listing => (
              <motion.div key={listing._id} variants={itemVariants}>
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <h3 className="text-xl font-semibold text-gray-600">No listings found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
