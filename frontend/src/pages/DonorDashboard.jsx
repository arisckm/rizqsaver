import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import ListingCard from '../components/ui/ListingCard';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

// 3D Stagger parent configuration
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

// Spatial grid pop entrance
const itemVariants = {
  hidden: { opacity: 0, y: 25, rotateX: 6 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 110, damping: 14 }
  }
};

export default function DonorDashboard() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listRes, bookRes] = await Promise.all([
          api.get('/listings/my-listings'),
          api.get('/bookings/incoming'),
        ]);
        setListings(listRes.data.data);
        setBookings(bookRes.data.data);
      } catch {
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success('Listing removed.');
    } catch {
      toast.error('Failed to remove listing.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090b0a] text-gray-100 relative overflow-hidden font-sans antialiased perspective-1000">

      {/* 🌌 IMMERSIVE 3D BACKGROUND ENVIRONMENT */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#1e2920] opacity-30 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#342a15] opacity-20 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* HEADER SECTION */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.04] pb-6"
          >
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {user?.organizationName || user?.name || 'Donor Profile'}
              </h1>
              <p className="text-xs font-medium tracking-wide mt-1.5 flex items-center gap-1.5">
                {user?.isVerified ? (
                  <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-inner flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Verified Donor Hub
                  </span>
                ) : (
                  <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    ⏳ Pending verification — creation parameters locked
                  </span>
                )}
              </p>
            </div>
            {user?.isVerified && (
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/donor/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Log Excess Food
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* 3D FLOATING STATS COUNTERS */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: 'Total Listings', value: listings.length, color: 'from-white to-gray-400' },
              { label: 'Active', value: listings.filter((l) => l.status === 'available').length, color: 'from-emerald-400 to-teal-300' },
              { label: 'Claimed', value: listings.filter((l) => l.status === 'claimed').length, color: 'from-amber-400 to-orange-300' },
              { label: 'Incoming Bookings', value: bookings.length, color: 'from-sky-400 to-indigo-300' },
            ].map(({ label, value, color }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                whileHover={{ y: -4, rotateX: 3, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                className="bg-[#111412]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] group transition-colors hover:border-white/10"
              >
                <p className={`text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
                  {value}
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* MY LISTINGS SEGMENT */}
          <div className="mb-10">
            <h2 className="text-base font-bold uppercase tracking-widest text-gray-400 mb-4 font-mono">My Provisions Grid</h2>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-white/[0.02] border border-white/[0.05] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : listings.length === 0 ? (

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 border border-white/[0.06] bg-white/[0.01] backdrop-blur-md rounded-2xl shadow-inner"
              >
                <p className="text-sm text-gray-400 font-light mb-4">No logged provisions inside this active node.</p>
                {user?.isVerified && (
                  <Link to="/donor/create" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wide uppercase group">
                    Post your first listing <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                )}
              </motion.div>

            ) : (

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {listings.map((listing) => (
                  <motion.div
                    key={listing._id}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="relative group rounded-2xl overflow-hidden"
                  >
                    <ListingCard listing={listing} />

                    {/* Embedded Depth Utility HUD Overlay */}
                    <div className="absolute top-3 left-3 z-20">
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="bg-neutral-950/80 hover:bg-rose-950/90 border border-white/10 hover:border-rose-500/30 text-gray-300 hover:text-rose-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-lg backdrop-blur-md transition-all duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* INCOMING CLAIMS SEGMENT */}
          {bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-base font-bold uppercase tracking-widest text-gray-400 mb-4 font-mono">Incoming Logistics Traffic</h2>

              <div className="space-y-3">
                {bookings.map((b, idx) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 4, rotateX: 1.5, bg: "rgba(255,255,255,0.02)" }}
                    className="bg-[#111412]/60 backdrop-blur-xl border border-white/[0.07] rounded-xl p-4 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:border-emerald-500/20 transition-all duration-300"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-white font-bold text-sm tracking-tight truncate">{b.listing?.title || 'Untitled Batch'}</p>
                      <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>Claimant: <strong className="text-gray-200 font-semibold">{b.receiver?.organizationName || b.receiver?.name}</strong></span>
                        <span className="text-gray-600">·</span>
                        <span className="text-emerald-400 font-mono text-[11px]">{b.receiver?.phone}</span>
                      </p>
                    </div>

                    <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border flex-shrink-0 shadow-inner ${b.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                      {b.status || 'active'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}