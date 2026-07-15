import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck, RefreshCw } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Button from './Button';
import InputField from './InputField';

const PhoneVerificationModal = ({ isOpen, onClose, onSuccess }) => {
  const { sendPhoneOTP, verifyPhoneOTP, user } = useAuth();
  
  const [phone, setPhone] = useState(user?.phone || '');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Code Input
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setLoading(true);
    try {
      await sendPhoneOTP(phone);
      toast.success(`Verification code sent to +91 ${phone}`);
      setStep(2);
      setCountdown(60); // 60s countdown for resend
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      toast.error('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneOTP(phone, code);
      toast.success('Phone number verified successfully!');
      if (onSuccess) onSuccess(phone);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-gray-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 1 ? (
            <div className="flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Verify Mobile Number</h2>
              <p className="text-gray-500 text-sm mb-6">
                To keep your account secure and enable communication with prospective buyers/renters, please verify your mobile number.
              </p>

              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Indian Mobile Number (+91)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-[14px] text-gray-500 font-semibold text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength="10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:border-primary text-secondary font-semibold tracking-wide transition-all shadow-inner bg-gray-50/50"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    label={loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    fullWidth
                    loading={loading}
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-5 text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">Enter Security Code</h2>
              <p className="text-gray-500 text-sm mb-6">
                We have sent a 6-digit verification code to <span className="font-semibold text-secondary">+91 {phone}</span>.
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <InputField
                  label="6-Digit OTP Code"
                  name="code"
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center font-bold tracking-[0.5em] text-lg rounded-2xl"
                  required
                />

                <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                  <span>Didn't receive the code?</span>
                  {countdown > 0 ? (
                    <span className="font-medium text-gray-400">Resend in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Resend OTP
                    </button>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-grow py-3 border border-gray-200 hover:bg-gray-50 rounded-2xl text-secondary font-bold transition-colors"
                  >
                    Back
                  </button>
                  <div className="flex-[2]">
                    <Button
                      type="submit"
                      label={loading ? 'Verifying...' : 'Verify Code'}
                      fullWidth
                      loading={loading}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PhoneVerificationModal;
