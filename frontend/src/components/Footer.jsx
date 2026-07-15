import React from 'react';
import { Home, Link as LinkIcon, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Home className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold tracking-tight text-white">Wonderlust</span>
            </Link>
            <p className="text-sm">Your trusted marketplace for buying, selling, and renting premium properties.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Properties</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/?listingType=sale" className="hover:text-white transition-colors">Buy Property</Link></li>
              <li><Link to="/?listingType=rent" className="hover:text-white transition-colors">Rent Property</Link></li>
              <li><Link to="/listings/new" className="hover:text-white transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Safety Information</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors p-2 bg-gray-800 rounded-full"><LinkIcon className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-gray-800 rounded-full"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Wonderlust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
