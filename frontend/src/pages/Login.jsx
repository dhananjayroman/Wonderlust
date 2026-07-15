import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      toast.success('Welcome back to Wonderlust!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password');
      toast.error('Login failed');
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
            <h2 className="text-2xl font-bold text-secondary">Welcome back</h2>
            <p className="text-gray-500 mt-1">Login to your Wonderlust account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField 
              label="Username" 
              name="username"
              type="text"
              placeholder="Enter your username" 
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
            <InputField 
              label="Password" 
              name="password"
              type="password" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            
            {error && <div className="text-primary text-sm font-medium">{error}</div>}

            <div className="pt-2">
              <Button 
                type="submit" 
                label="Login" 
                fullWidth 
                loading={loading} 
              />
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
