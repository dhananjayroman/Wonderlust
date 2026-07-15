import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  loading = false, 
  fullWidth = false, 
  type = 'button',
  className = ''
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-[#E61E4D] shadow-md hover:shadow-lg disabled:bg-opacity-70",
    outline: "border-2 border-gray-300 text-secondary hover:border-gray-800 bg-white",
    ghost: "text-gray-600 hover:bg-gray-100"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {loading ? 'Loading...' : label}
    </button>
  );
};

export default Button;
