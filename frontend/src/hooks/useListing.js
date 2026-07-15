import { useState, useEffect, useCallback } from 'react';
import { getListingById } from '../api/listingService';

const useListing = (id) => {
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListing = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getListingById(id);
      setListing(data.listing || data);
      setReviews(data.reviews || data.listing?.reviews || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch listing');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  return { listing, setListing, reviews, setReviews, loading, error, refetch: fetchListing };
};

export default useListing;
