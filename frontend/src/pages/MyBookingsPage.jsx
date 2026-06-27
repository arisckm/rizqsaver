import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import api from '../lib/api';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 8 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my-bookings')
      .then((res) => setBookings(res.data.data))
      .catch(() => toast.error('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#090b0a] text-gray-100 relative overflow-hidden font-sans antialiased perspective-1000">

      {/* Immersive Atmospheric Environment underlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#1e2920] opacity-30 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#342a15] opacity-20 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 py-8">

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Claims</span>
            </h1>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-white/[0.02] border border-white/[0.05] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 border border-white/[0.06] bg-white/[0.02] rounded-2xl">
              <p className="text-sm text-gray-400 font-light">No claims yet.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {bookings.map((b) => (
                <motion.div
                  key={b._id}
                  variants={cardVariants}
                  whileHover={{
                    y: -4,
                    rotateX: 2.5,
                    scale: 1.008,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)"
                  }}
                  className="bg-[#111412]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex gap-4 items-center relative overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-emerald-500/20"
                >
                  {/* Strict structural enforcement for Image on Left */}
                  {b.listing?.imageUrl && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-neutral-900 shadow-md">
                      <img
                        src={b.listing.imageUrl}
                        alt={b.listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Text Meta Content on Right */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                        {b.listing?.title || 'Untitled Provision'}
                      </h3>

                      <span className={`text-[9px] uppercase font-bold tracking-[0.12em] px-2.5 py-1 rounded-md border flex-shrink-0 shadow-inner ${b.status === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : b.status === 'cancelled'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                        {b.status || 'pending'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {b.donor?.organizationName || b.donor?.name || 'Sanctuary Partner'}
                    </p>

                    <div className="mt-2 space-y-1 text-xs text-gray-400 font-normal">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <svg className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.244a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="truncate text-gray-400">
                          {b.listing?.location?.address ? `${b.listing.location.address}, ${b.listing.location.city || ''}` : 'No address specified'}
                        </span>
                      </div>

                      {b.donor?.phone && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-emerald-400/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-emerald-400 font-semibold">{b.donor.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] text-gray-500 flex justify-between items-center">
                      <span className="italic normal-case">
                        Claimed {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}