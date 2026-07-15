import { create } from 'zustand';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistService';
import toast from 'react-hot-toast';

const useWishlistStore = create((set, get) => ({
  wishlistItems: [],
  wishlistIds: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getWishlist();
      // data is an array of populated listings
      const ids = data.map(item => item._id);
      set({ wishlistItems: data, wishlistIds: ids, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch wishlist', isLoading: false });
    }
  },

  toggleWishlist: async (listing) => {
    const { wishlistIds, wishlistItems } = get();
    const isWishlisted = wishlistIds.includes(listing._id);

    // Optimistic update
    if (isWishlisted) {
      set({
        wishlistIds: wishlistIds.filter(id => id !== listing._id),
        wishlistItems: wishlistItems.filter(item => item._id !== listing._id)
      });
      try {
        await removeFromWishlist(listing._id);
        toast.success('Removed from saved properties');
      } catch (error) {
        // Revert on error
        set({ wishlistIds, wishlistItems });
        toast.error('Failed to remove from wishlist');
      }
    } else {
      set({
        wishlistIds: [...wishlistIds, listing._id],
        wishlistItems: [...wishlistItems, listing]
      });
      try {
        await addToWishlist(listing._id);
        toast.success('Saved to your properties');
      } catch (error) {
        // Revert on error
        set({ wishlistIds, wishlistItems });
        toast.error('Failed to save to wishlist');
      }
    }
  },

  clearWishlist: () => set({ wishlistItems: [], wishlistIds: [] }),
}));

export default useWishlistStore;
