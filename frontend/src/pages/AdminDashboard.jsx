import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Building2, BadgeCheck, Clock, CheckCircle2, XCircle,
  TrendingUp, Eye, ChevronDown, Search, RefreshCw
} from 'lucide-react';
import {
  getAdminStats, getAllUsers, getPendingListings,
  moderateListing, getPendingSellerRequests, moderateSellerRequest
} from '../api/adminService';
import useAuth from '../hooks/useAuth';
import FullPageLoader from '../components/FullPageLoader';
import ErrorBanner from '../components/ErrorBanner';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'listings', label: 'Property Moderation', icon: Building2 },
  { id: 'sellers', label: 'Seller Verification', icon: BadgeCheck },
  { id: 'users', label: 'User Management', icon: Users },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData, listingsData, sellersData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getPendingListings(),
        getPendingSellerRequests()
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setPendingListings(listingsData || []);
      setSellerRequests(sellersData || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
      toast.error('Could not load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleModerateListing = async (id, action) => {
    setActionLoading(id);
    try {
      await moderateListing(id, action);
      setPendingListings(prev => prev.filter(l => l._id !== id));
      setStats(prev => prev ? { ...prev, pendingListings: Math.max(0, prev.pendingListings - 1) } : prev);
      toast.success(`Listing ${action}d successfully`);
    } catch (err) {
      toast.error(err.message || `Failed to ${action} listing`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleModerateSellerRequest = async (id, action) => {
    setActionLoading(id);
    try {
      await moderateSellerRequest(id, action);
      setSellerRequests(prev => prev.filter(u => u._id !== id));
      setStats(prev => prev ? { ...prev, pendingSellerRequests: Math.max(0, prev.pendingSellerRequests - 1) } : prev);
      toast.success(`Seller request ${action}d successfully`);
    } catch (err) {
      toast.error(err.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 md:px-8 max-w-xl pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">Access Denied</h2>
          <p className="text-gray-500 leading-relaxed">
            You do not have admin privileges. Contact the system administrator for access.
          </p>
        </motion.div>
      </div>
    );
  }

  if (loading) return <FullPageLoader />;
  if (error) return <div className="pt-28 px-8"><ErrorBanner message={error} onRetry={fetchAll} /></div>;

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-28 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Admin Portal
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Trust & Safety Management Dashboard</p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-8 gap-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-5 font-semibold transition-colors relative whitespace-nowrap text-sm
                ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'listings' && stats?.pendingListings > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{stats.pendingListings}</span>
              )}
              {tab.id === 'sellers' && stats?.pendingSellerRequests > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{stats.pendingSellerRequests}</span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="admin-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && stats && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
              { label: 'Total Listings', value: stats.totalListings, icon: Building2, color: 'green' },
              { label: 'Pending Listings', value: stats.pendingListings, icon: Clock, color: 'orange' },
              { label: 'Seller Requests', value: stats.pendingSellerRequests, icon: BadgeCheck, color: 'purple' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className={`bg-${stat.color}-100 p-4 rounded-xl text-${stat.color}-600`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">{stat.label}</p>
                    <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl p-6">
            <h3 className="font-bold text-secondary mb-4 text-lg">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.pendingListings > 0 && (
                <button
                  onClick={() => setActiveTab('listings')}
                  className="flex items-center gap-3 bg-white border border-orange-200 rounded-xl p-4 hover:border-orange-400 transition-colors text-left"
                >
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Clock className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-secondary">{stats.pendingListings} listing{stats.pendingListings > 1 ? 's' : ''} awaiting review</p>
                    <p className="text-gray-500 text-xs">Click to review and moderate</p>
                  </div>
                </button>
              )}
              {stats.pendingSellerRequests > 0 && (
                <button
                  onClick={() => setActiveTab('sellers')}
                  className="flex items-center gap-3 bg-white border border-purple-200 rounded-xl p-4 hover:border-purple-400 transition-colors text-left"
                >
                  <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><BadgeCheck className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-secondary">{stats.pendingSellerRequests} seller request{stats.pendingSellerRequests > 1 ? 's' : ''} pending</p>
                    <p className="text-gray-500 text-xs">Click to verify sellers</p>
                  </div>
                </button>
              )}
              {stats.pendingListings === 0 && stats.pendingSellerRequests === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p className="font-semibold">All caught up! Nothing requires your attention.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── PROPERTY MODERATION TAB ─── */}
      {activeTab === 'listings' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="space-y-4">
            {pendingListings.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p className="text-gray-500 font-semibold">No listings pending moderation.</p>
              </div>
            ) : (
              pendingListings.map((listing) => (
                <div key={listing._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Image */}
                    <div className="w-full md:w-40 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-secondary">{listing.title}</h3>
                          <p className="text-gray-500 text-sm">
                            {listing.location?.city}, {listing.location?.state} • ₹{listing.price?.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold uppercase">Pending</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span>By: <strong className="text-gray-600">{listing.owner?.username}</strong></span>
                        <span>•</span>
                        <span>{listing.owner?.email}</span>
                        <span>•</span>
                        <span>{new Date(listing.postedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleModerateListing(listing._id, 'approve')}
                          disabled={actionLoading === listing._id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleModerateListing(listing._id, 'reject')}
                          disabled={actionLoading === listing._id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* ─── SELLER VERIFICATION TAB ─── */}
      {activeTab === 'sellers' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="space-y-4">
            {sellerRequests.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p className="text-gray-500 font-semibold">No pending seller verification requests.</p>
              </div>
            ) : (
              sellerRequests.map((u) => (
                <div key={u._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">{u.username?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-secondary">{u.username}</h3>
                    <p className="text-gray-500 text-sm">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {u.isPhoneVerified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">📱 Phone Verified</span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => handleModerateSellerRequest(u._id, 'approve')}
                      disabled={actionLoading === u._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleModerateSellerRequest(u._id, 'reject')}
                      disabled={actionLoading === u._id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* ─── USER MANAGEMENT TAB ─── */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl outline-none focus:border-primary text-sm transition-all bg-gray-50/50"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Phone Verified</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-secondary flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{u.username?.charAt(0).toUpperCase()}</span>
                      </div>
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isSeller ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">✓ Verified</span>
                      ) : u.verificationRequestStatus === 'pending' ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">Pending</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.isPhoneVerified ? (
                        <span className="text-green-500 font-semibold text-sm">✓</span>
                      ) : (
                        <span className="text-gray-400 text-sm">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found</p>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
