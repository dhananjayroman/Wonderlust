import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, Phone } from 'lucide-react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import PhoneVerificationModal from '../components/PhoneVerificationModal';

const AddListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'total',
    propertyType: 'flat',
    listingType: 'sale',
    bedrooms: '0',
    bathrooms: '0',
    area: '',
    floor: '0',
    totalFloors: '0',
    furnished: 'unfurnished',
    address: '',
    city: '',
    state: '',
    pincode: '',
    reraNumber: '',
    phone: user?.phone || '',
    whatsapp: user?.phone || '',
    image: null
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    const submitData = new FormData();
    submitData.append('listing[title]', formData.title);
    submitData.append('listing[description]', formData.description);
    submitData.append('listing[price]', formData.price);
    submitData.append('listing[priceType]', formData.priceType);
    submitData.append('listing[propertyType]', formData.propertyType);
    submitData.append('listing[listingType]', formData.listingType);
    submitData.append('listing[bedrooms]', formData.bedrooms);
    submitData.append('listing[bathrooms]', formData.bathrooms);
    submitData.append('listing[area]', formData.area);
    submitData.append('listing[floor]', formData.floor);
    submitData.append('listing[totalFloors]', formData.totalFloors);
    submitData.append('listing[furnished]', formData.furnished);
    submitData.append('listing[reraNumber]', formData.reraNumber);
    
    // Location
    submitData.append('listing[location][address]', formData.address);
    submitData.append('listing[location][city]', formData.city);
    submitData.append('listing[location][state]', formData.state);
    submitData.append('listing[location][pincode]', formData.pincode);

    // Contact
    submitData.append('listing[contact][phone]', formData.phone);
    submitData.append('listing[contact][whatsapp]', formData.whatsapp);

    if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const { data } = await axios.post('/api/listings', submitData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      toast.success('Property listed successfully!');
      navigate(`/listings/${data.listing?._id || data._id || ''}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!user?.isPhoneVerified) {
    return (
      <div className="container mx-auto px-4 md:px-8 max-w-xl pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
            <Phone className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">Verification Required</h2>
          <p className="text-gray-500 mb-6 leading-relaxed text-sm md:text-base">
            To maintain a trusted marketplace for buying, selling, and renting properties, we require all partners to verify their mobile number before posting any new listings.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-primary/90 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Verify Mobile Number
          </button>
          <PhoneVerificationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-4xl pt-28 pb-20">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Post a Property</h1>
          <p className="text-muted">Fill in the details below to list your property on Wonderlust.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info Card */}
          <motion.div variants={sectionVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField label="Property Title" name="title" placeholder="e.g. 3 BHK Luxury Flat in Bandra" value={formData.title} onChange={handleChange} required />
              </div>
              <InputField 
                type="select" label="Listing Type" name="listingType" value={formData.listingType} onChange={handleChange} required
                options={[ {label: 'For Sale', value: 'sale'}, {label: 'For Rent', value: 'rent'}, {label: 'For Lease', value: 'lease'} ]} 
              />
              <InputField 
                type="select" label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleChange} required
                options={[ {label: 'Flat / Apartment', value: 'flat'}, {label: 'Independent House', value: 'house'}, {label: 'Villa', value: 'villa'}, {label: 'Farmhouse', value: 'farmhouse'}, {label: 'Plot / Land', value: 'plot'}, {label: 'PG / Hostel', value: 'pg'}, {label: 'Office Space', value: 'office'}, {label: 'Shop', value: 'shop'} ]} 
              />
              <div className="md:col-span-2">
                <InputField type="textarea" label="Property Description" name="description" placeholder="Describe your property's best features..." value={formData.description} onChange={handleChange} required />
              </div>
            </div>
          </motion.div>

          {/* Property Details Card */}
          <motion.div variants={sectionVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField type="number" label="Bedrooms" name="bedrooms" min="0" value={formData.bedrooms} onChange={handleChange} />
              <InputField type="number" label="Bathrooms" name="bathrooms" min="0" value={formData.bathrooms} onChange={handleChange} />
              <InputField type="number" label="Area (Sq. Ft.)" name="area" min="0" placeholder="e.g. 1500" value={formData.area} onChange={handleChange} required />
              <InputField type="number" label="Property on Floor" name="floor" min="0" value={formData.floor} onChange={handleChange} />
              <InputField type="number" label="Total Floors" name="totalFloors" min="0" value={formData.totalFloors} onChange={handleChange} />
              <InputField 
                type="select" label="Furnishing Status" name="furnished" value={formData.furnished} onChange={handleChange}
                options={[ {label: 'Fully Furnished', value: 'furnished'}, {label: 'Semi Furnished', value: 'semi'}, {label: 'Unfurnished', value: 'unfurnished'} ]} 
              />
            </div>
          </motion.div>

          {/* Pricing & Location Card */}
          <motion.div variants={sectionVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Pricing & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField type="number" label="Price (₹)" name="price" min="0" placeholder="e.g. 5000000" value={formData.price} onChange={handleChange} required />
              <InputField 
                type="select" label="Pricing Structure" name="priceType" value={formData.priceType} onChange={handleChange} required
                options={[ {label: 'Total Price', value: 'total'}, {label: 'Per Month (Rent)', value: 'per_month'}, {label: 'Per Year', value: 'per_year'} ]} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <div className="md:col-span-2">
                <InputField label="Address / Locality" name="address" placeholder="e.g. 123, MG Road" value={formData.address} onChange={handleChange} required />
              </div>
              <InputField label="City" name="city" placeholder="e.g. Mumbai" value={formData.city} onChange={handleChange} required />
              <InputField label="State" name="state" placeholder="e.g. Maharashtra" value={formData.state} onChange={handleChange} required />
              <InputField label="Pincode" name="pincode" placeholder="e.g. 400001" value={formData.pincode} onChange={handleChange} required />
              <InputField label="RERA Number (Optional)" name="reraNumber" placeholder="e.g. PR/MH/12345" value={formData.reraNumber} onChange={handleChange} />
            </div>
          </motion.div>

          {/* Contact & Media Card */}
          <motion.div variants={sectionVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-secondary mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Contact & Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InputField type="tel" label="Contact Phone" name="phone" value={formData.phone} onChange={handleChange} required />
              <InputField type="tel" label="WhatsApp Number" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-semibold text-secondary mb-1.5 block">Property Images (Select Primary Cover Image)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                {preview ? (
                  <div className="w-full relative h-64 rounded-xl overflow-hidden shadow-sm">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-muted mb-3" />
                    <p className="font-semibold text-secondary">Drag and drop or click to upload</p>
                    <p className="text-sm text-muted mt-1">High quality JPEG or PNG</p>
                  </>
                )}
              </div>
              {loading && progress > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={sectionVariants} className="pt-4 flex justify-end">
            <div className="w-full md:w-1/3">
              <Button type="submit" label={loading ? 'Posting...' : 'Post Property Now'} fullWidth loading={loading} />
            </div>
          </motion.div>

        </form>
      </motion.div>
    </div>
  );
};

export default AddListing;
