import React, { useState } from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import Button from './Button';
import InputField from './InputField';
import { createInquiry } from '../api/inquiryService';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const StickyLeadGenerationCard = ({ listing }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    message: 'Hi, I am interested in this property. Please contact me.',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const isOwner = user && listing.owner && (user._id === listing.owner._id || user._id === listing.owner);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to send an inquiry.');
      navigate('/login');
      return;
    }

    if (isOwner) {
      toast.error('You cannot send an inquiry for your own property.');
      return;
    }

    setLoading(true);
    try {
      await createInquiry({
        propertyId: listing._id,
        ...formData
      });
      toast.success('Inquiry sent successfully! The seller will contact you soon.');
      setFormData({ ...formData, message: '' }); // reset message
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to send inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!listing.contact?.whatsapp) {
      toast.error("Seller hasn't provided a WhatsApp number.");
      return;
    }
    const text = encodeURIComponent(`Hi, I'm interested in your property: ${listing.title}. Is it still available?`);
    window.open(`https://wa.me/91${listing.contact.whatsapp}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    if (!listing.contact?.phone) {
      toast.error("Seller hasn't provided a contact number.");
      return;
    }
    window.location.href = `tel:+91${listing.contact.phone}`;
  };

  return (
    <div className="sticky top-32 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
      <div className="mb-6 pb-6 border-b">
        <span className="text-2xl font-bold text-secondary">&#8377; {listing.price?.toLocaleString('en-IN')}</span>
        <span className="text-gray-500"> {listing.priceType === 'per_month' ? '/ month' : (listing.priceType === 'per_year' ? '/ year' : 'total')}</span>
      </div>

      <h3 className="text-xl font-semibold mb-4">Contact Seller</h3>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <InputField 
          type="textarea"
          placeholder="I am interested in..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
        <InputField 
          type="text"
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          pattern="\d{10}"
        />
        <InputField 
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Button 
          type="submit" 
          label="Send Inquiry" 
          fullWidth 
          loading={loading}
          disabled={isOwner}
        />
      </form>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleCall}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-secondary transition-colors font-semibold"
        >
          <Phone className="w-4 h-4" /> Call
        </button>
        <button 
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white transition-colors font-semibold"
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp
        </button>
      </div>
    </div>
  );
};

export default StickyLeadGenerationCard;
