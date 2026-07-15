/*
WONDERLUST — INTEGRATION CHECKLIST
─────────────────────────────────────
CSS:
[x] @tailwind directives in index.css
[x] index.css imported in main.jsx
[x] tailwind.config.js content paths correct
[x] postcss.config.js present and correct
[x] Custom colors added to theme

BACKEND:
[x] .env file complete with all variables
[x] MongoDB connected and verified
[x] CORS configured with credentials:true
[x] Passport.js configured correctly
[x] Session stored in MongoDB
[x] Multer + Cloudinary working
[x] Mapbox geocoding saving coordinates
[x] All 10 API routes returning correct responses
[x] Error handler middleware added

FRONTEND ↔ BACKEND:
[x] Axios withCredentials:true
[x] Proxy set up in vite.config.js
[x] AuthContext restoring session on mount
[x] Protected routes working
[x] Image upload sending FormData
[x] Toast notifications on success/error
*/

import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FullPageLoader from './components/FullPageLoader';
import ApiTester from './components/dev/ApiTester';
import TestTailwind from './components/TestTailwind';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const AddListing = lazy(() => import('./pages/AddListing'));
const EditListing = lazy(() => import('./pages/EditListing'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const PageWrapper = ({ children }) => (
  <motion.div {...pageTransition}>
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<FullPageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/test" element={<PageWrapper><TestTailwind /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
              <Route path="/listings/:id" element={<PageWrapper><ListingDetail /></PageWrapper>} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/listings/new" element={<PageWrapper><AddListing /></PageWrapper>} />
                <Route path="/listings/:id/edit" element={<PageWrapper><EditListing /></PageWrapper>} />
                <Route path="/dashboard/buyer" element={<PageWrapper><BuyerDashboard /></PageWrapper>} />
                <Route path="/dashboard/seller" element={<PageWrapper><SellerDashboard /></PageWrapper>} />
                <Route path="/dashboard/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <ApiTester />
      <Toaster 
        position="top-center" 
        toastOptions={{
          success: { duration: 3000, style: { background: '#10B981', color: '#fff' } },
          error: { duration: 4000, style: { background: '#EF4444', color: '#fff' } }
        }} 
      />
    </div>
  );
}

export default App;
