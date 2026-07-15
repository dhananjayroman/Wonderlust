import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(formData.username, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
      setErrors({ ...errors, server: err.message || 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Compass className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Join Wonderlust</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField 
              label="Username" 
              name="username"
              placeholder="Choose a username" 
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              autoComplete="username"
            />
            <InputField 
              label="Email" 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <InputField 
              label="Password" 
              name="password"
              type="password" 
              placeholder="Create a password" 
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
            <InputField 
              label="Confirm Password" 
              name="confirmPassword"
              type="password" 
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            
            {errors.server && <div className="text-primary text-sm font-medium pt-2">{errors.server}</div>}

            <div className="pt-4">
              <Button type="submit" label="Sign Up" fullWidth loading={loading} />
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Log in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
