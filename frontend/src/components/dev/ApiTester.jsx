import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { getCurrentUser } from '../../api/authService';
import { getAllListings } from '../../api/listingService';

const ApiTester = () => {
  if (!import.meta.env.DEV) return null;

  const [tests, setTests] = useState({
    listings: { status: 'pending', time: 0, error: null },
    auth: { status: 'pending', time: 0, error: null }
  });

  const runTests = async () => {
    // Test Listings
    try {
      const start1 = performance.now();
      await getAllListings();
      setTests(t => ({ ...t, listings: { status: 'success', time: Math.round(performance.now() - start1) } }));
    } catch (e) {
      setTests(t => ({ ...t, listings: { status: 'error', error: e.message } }));
    }

    // Test Auth
    try {
      const start2 = performance.now();
      await getCurrentUser();
      setTests(t => ({ ...t, auth: { status: 'success', time: Math.round(performance.now() - start2) } }));
    } catch (e) {
      setTests(t => ({ ...t, auth: { status: 'error', error: e.message } }));
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 z-50 text-xs w-72">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">API Status</h3>
        <button onClick={runTests} className="text-blue-500 hover:underline">Refresh</button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span>GET /listings</span>
          <span className="text-right">
            {tests.listings.status === 'success' ? `✅ ${tests.listings.time}ms` : '❌ Failed'}
            {tests.listings.error && <div className="text-red-500 text-[10px]">{tests.listings.error}</div>}
          </span>
        </div>
        
        <div className="flex justify-between items-start">
          <span>GET /auth/me</span>
          <span className="text-right">
            {tests.auth.status === 'success' ? `✅ ${tests.auth.time}ms` : '❌ Failed'}
            {tests.auth.error && <div className="text-red-500 text-[10px]">{tests.auth.error}</div>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
