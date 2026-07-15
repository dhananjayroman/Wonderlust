import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, UserCircle, X, Home } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-5 shadow-sm'}`}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Home className="w-8 h-8 text-primary group-hover:-translate-y-1 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight text-primary">Wonderlust</span>
        </Link>

        <div className="hidden lg:flex flex-1 max-w-lg mx-8 items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow bg-white">
          <input 
            type="text" 
            placeholder="Search city, locality, or project..." 
            className="flex-grow text-sm outline-none px-2 bg-transparent text-secondary placeholder-muted"
          />
          <button className="bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <NavLink to="/listings/new" className={({ isActive }) => `text-sm font-semibold py-2 px-4 rounded-full transition-colors ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              Add Listing
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="relative group cursor-pointer border border-gray-300 p-2 pl-3 rounded-full flex items-center gap-2 hover:shadow-md bg-white">
              <Menu className="w-5 h-5 text-gray-600" />
              <UserCircle className="w-8 h-8 text-gray-500" />
              <div className="absolute right-0 top-12 w-48 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                <div className="px-4 py-2 font-semibold border-b text-sm truncate">Hello, {user?.username}</div>
                <Link to="/dashboard/buyer" className="px-4 py-2 text-left hover:bg-gray-100 text-sm w-full font-medium">Buyer Hub</Link>
                <Link to="/dashboard/seller" className="px-4 py-2 text-left hover:bg-gray-100 text-sm w-full font-medium">Seller Hub</Link>
                {user?.role === 'admin' && (
                  <Link to="/dashboard/admin" className="px-4 py-2 text-left hover:bg-gray-100 text-sm w-full font-medium text-primary">🛡️ Admin Portal</Link>
                )}
                <button onClick={logout} className="px-4 py-2 text-left hover:bg-gray-100 text-sm w-full border-t">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="text-sm font-semibold hover:bg-gray-100 py-2 px-4 rounded-full transition-colors">Login</NavLink>
              <NavLink to="/signup" className="text-sm font-semibold bg-primary text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors">Sign Up</NavLink>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="flex flex-col py-4 px-6 space-y-4">
              {isAuthenticated && <NavLink to="/listings/new" onClick={() => setMobileMenuOpen(false)} className="font-semibold py-2">Add Listing</NavLink>}
              {isAuthenticated ? (
                <>
                  <div className="font-semibold text-gray-500 py-2">Profile ({user?.username})</div>
                  <Link to="/dashboard/buyer" onClick={() => setMobileMenuOpen(false)} className="font-semibold py-2">Buyer Hub</Link>
                  <Link to="/dashboard/seller" onClick={() => setMobileMenuOpen(false)} className="font-semibold py-2">Seller Hub</Link>
                  {user?.role === 'admin' && (
                    <Link to="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} className="font-semibold py-2 text-primary">🛡️ Admin Portal</Link>
                  )}
                  <button onClick={logout} className="text-left py-2 font-semibold text-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-semibold py-2">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="font-semibold py-2 text-primary">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
