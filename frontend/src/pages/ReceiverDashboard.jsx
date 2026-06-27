import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import ListingCard from '../components/ui/ListingCard';
import api from '../lib/api';
import toast from 'react-hot-toast';

const FOOD_TYPES = ['all', 'veg', 'non-veg', 'vegan', 'mixed'];

const NURCloudAtmosphere = () => {
  const clouds = [
    { id: 1, color: '#4a5d4e', size: '55vw', top: '-15%', left: '-5%', blur: '130px' },
    { id: 2, color: '#d4af37', size: '45vw', bottom: '10%', right: '-10%', blur: '140px' },
  ];
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {clouds.map(cloud => (
        <motion.div
          key={cloud.id}
          style={{
            position: 'absolute',
            top: cloud.top,
            left: cloud.left,
            right: cloud.right,
            bottom: cloud.bottom,
            width: cloud.size,
            height: cloud.size,
            borderRadius: '50%',
            backgroundColor: cloud.color,
            filter: `blur(${cloud.blur})`,
            opacity: 0.03,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 12 + cloud.id * 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default function ReceiverDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [search, setSearch] = useState('');
  const [foodType, setFoodType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append('search', search);
      if (foodType !== 'all') params.append('foodType', foodType);

      const res = await api.get(`/listings?${params}`);
      setListings(res.data.data);
      setTotalPages(res.data.pages);
    } catch {
      toast.error('Failed to load available blessings.');
    } finally {
      setLoading(false);
    }
  }, [page, search, foodType]);

  useEffect(() => {
    const delay = setTimeout(fetchListings, 300);
    return () => clearTimeout(delay);
  }, [fetchListings]);

  const handleClaim = async (listingId) => {
    setClaiming(listingId);
    try {
      await api.post(`/bookings/${listingId}`);
      toast.success('Batch claimed! Check your bookings.');
      setListings((prev) =>
        prev.map((l) => l._id === listingId ? { ...l, status: 'claimed' } : l)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to connect with blessing.');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e100d] text-[#f2efea] relative overflow-hidden font-sans select-none selection:bg-[#343f35]">
      <NURCloudAtmosphere />
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none bg-[linear-gradient(to_right,#f2efea_1px,transparent_1px),linear-gradient(to_bottom,#f2efea_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,#000_80%,transparent_100%)]" />

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-10">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-black tracking-wide text-[#f2efea]">
              Available <span className="text-[#d4af37] italic font-normal">Food Batches</span>
            </h1>
            <p className="text-xs font-serif italic text-[#b0b8ae] mt-1.5 tracking-wide">
              Browse and claim free nourishment from local donors.
            </p>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center">
            <div className="flex-1 relative w-full">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[#121512]/50 backdrop-blur-xl border border-[#232924]/80 rounded-xl px-6 py-4 text-sm text-[#f2efea] placeholder-[#4a544b] outline-none transition-all duration-300 focus:border-[#4a5d4e] shadow-inner"
                placeholder="Search food listings..."
              />
              <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a544b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* 🌟 3D TACTILE FILTERS (With inset drop-shadow steps) */}
            <div className="flex gap-2.5 flex-wrap justify-start sm:justify-end">
              {FOOD_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => { setFoodType(t); setPage(1); }}
                  className={`text-[10px] uppercase font-bold tracking-[0.15em] px-5 py-3 rounded-xl border transition-all duration-300 transform active:scale-95 ${foodType === t
                      ? 'bg-gradient-to-b from-[#e3c152] to-[#d4af37] border-[#fff/20] text-[#0e100d] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_20px_rgba(212,175,55,0.25)] font-black'
                      : 'bg-[#121512]/60 border-[#232924] text-[#b0b8ae] hover:text-white hover:border-[#343f35] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[#121512]/60 backdrop-blur-2xl border border-[#232924]/80 rounded-3xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-[#171c18]/60" />
                    <div className="p-6 space-y-4">
                      <div className="h-5 bg-[#171c18]/60 rounded-full w-3/4" />
                      <div className="h-4 bg-[#171c18]/60 rounded-full w-1/2" />
                      <div className="h-12 bg-[#202621]/80 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (

              /* 🌟 PREMIUM 3D COHESIVE EMPTY STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-16 text-center border border-[#232924] rounded-3xl bg-gradient-to-b from-[#141914]/40 to-[#0f120f]/60 backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_40px_80px_rgba(0,0,0,0.5)]"
              >
                {/* Soft Underlying Light Leak */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#3a473c]/5 via-transparent to-[#d4af37]/5 blur-3xl" />

                {/* Pure CSS 3D Glass Orb/Refraction Ring */}
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  {/* Glass Backshadow */}
                  <div className="absolute w-14 h-4 bg-black/60 rounded-full blur-md bottom-0 left-3 opacity-70" />
                  {/* Main Lens Body */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffffff]/10 to-[#d4af37]/5 border border-[#ffffff]/20 backdrop-blur-[6px] relative shadow-[inset_0_4px_12px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.4)] flex items-center justify-center"
                  >
                    {/* Internal Gold Specular Reflection */}
                    <div className="absolute top-1.5 left-3 w-4 h-2 bg-white/40 rounded-full rotate-[-15deg] blur-[0.5px]" />
                    <div className="absolute bottom-2 right-3 w-2 h-2 bg-[#d4af37]/40 rounded-full blur-[1px]" />
                    {/* Minimal abstract geometric focal element (No generic emoji) */}
                    <div className="w-3 h-3 rounded-sm bg-[#d4af37] rotate-45 shadow-[0_0_10px_#d4af37] opacity-70" />
                  </motion.div>
                </div>

                <h4 className="text-lg font-serif font-black tracking-tight text-[#f2efea] mb-1.5">No Batches Listed</h4>
                <p className="text-xs font-serif italic text-[#b0b8ae] max-w-sm leading-relaxed tracking-wide">
                  No active food donations match your current filters. Check back soon or broaden your search.
                </p>
              </motion.div>

            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onClaim={handleClaim}
                    claiming={claiming === listing._id}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12 pt-6 border-t border-[#202521]/60">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 text-xs uppercase font-bold tracking-wider bg-[#121512]/40 backdrop-blur-lg border border-[#232924] text-[#f2efea] rounded-xl disabled:opacity-30 hover:border-[#343f35] transition-colors duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.01)]"
              >
                ← Prev
              </button>
              <span className="text-[#b0b8ae] font-serif italic text-sm tracking-wide px-2">
                Page <span className="text-[#d4af37] font-bold">{page}</span> of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 text-xs uppercase font-bold tracking-wider bg-[#121512]/40 backdrop-blur-lg border border-[#232924] text-[#f2efea] rounded-xl disabled:opacity-30 hover:border-[#343f35] transition-colors duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.01)]"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}