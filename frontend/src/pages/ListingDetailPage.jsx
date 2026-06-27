import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then((res) => setListing(res.data.data))
      .catch(() => toast.error('Listing not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await api.post(`/bookings/${id}`);
      toast.success('Batch claimed!');
      setListing((l) => ({ ...l, status: 'claimed' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-[#090b0a] text-gray-100 relative overflow-hidden font-sans antialiased perspective-1000">

      {/* 🌌 IMMERSIVE BACKGROUND DEPTH AMBIENCE */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#1e2920] opacity-30 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#342a15] opacity-20 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-2xl mx-auto px-4 py-8">

          {/* BACK HUD TOGGLE */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            onClick={() => navigate(-1)}
            className="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white mb-6 flex items-center gap-2 group transition-colors"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span> Back to Stream
          </motion.button>

          {/* MAIN VISUAL BLOC */}
          {listing.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 14 }}
              whileHover={{ scale: 1.01, rotateX: 2 }}
              className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] mb-6 bg-neutral-900"
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover select-none"
              />
            </motion.div>
          )}

          {/* DYNAMIC SPATIAL CARD DATA CONTAINER */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.05 }}
            className="bg-[#111412]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            {/* Header Matrix */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  {listing.title}
                </h1>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  Provision Matrix / Node Log
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-white/[0.04] border border-white/10 text-emerald-400 px-3 py-1.5 rounded-lg flex-shrink-0 shadow-inner">
                {listing.foodType}
              </span>
            </div>

            {/* Description Fragment */}
            {listing.description && (
              <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
                {listing.description}
              </p>
            )}

            {/* 2x2 Spatial Parameters Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Quantity', value: `${listing.quantity} ${listing.quantityUnit || ''}` },
                { label: 'Expires', value: formatDistanceToNow(new Date(listing.expiresAt), { addSuffix: true }), accent: true },
                { label: 'Posted by', value: listing.donor?.organizationName || listing.donor?.name || 'Anonymous' },
                { label: 'Pickup Point', value: listing.location?.city || 'Zone Map Locked' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 shadow-inner">
                  <p className="text-gray-500 text-[10px] uppercase font-mono tracking-wider mb-0.5">{item.label}</p>
                  <p className={`text-sm font-bold tracking-tight ${item.accent ? 'text-amber-400' : 'text-gray-100'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Logistics Geo & Contact Meta Block */}
            <div className="border-t border-white/[0.05] pt-4 pb-2 space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.244a8 8 0 1111.314 0z" />
                </svg>
                <span className="tracking-wide">{listing.location?.address}</span>
              </div>

              {listing.donor?.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-mono text-emerald-400 font-bold tracking-wider">{listing.donor.phone}</span>
                </div>
              )}

              {listing.handlingInstructions && (
                <div className="mt-3 bg-amber-500/[0.03] border border-amber-500/20 rounded-xl p-3 flex gap-2 items-start text-amber-300/90 text-xs leading-relaxed">
                  <span className="font-mono text-amber-400 font-bold select-none">ℹ</span>
                  <p>{listing.handlingInstructions}</p>
                </div>
              )}
            </div>

            {/* DYNAMIC CTA CONTROL BLOCK */}
            <div className="mt-6">
              {user?.role === 'receiver' && listing.status === 'available' && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide shadow-[0_15px_30px_rgba(16,185,129,0.2)] transition-all"
                >
                  {claiming ? 'Securing Core Claims Node...' : 'Claim This Batch'}
                </motion.button>
              )}

              {listing.status === 'claimed' && (
                <div className="text-center py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-gray-400 text-xs uppercase font-mono tracking-widest shadow-inner">
                  🔒 Locked Asset — Secured by Logistics Node
                </div>
              )}
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}