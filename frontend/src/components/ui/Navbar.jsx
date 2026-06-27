import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/login');
  };

  // Safe fallback routing configuration based on operational profile matrix
  const dashboardRoute = user?.role === 'donor' ? '/donor' : '/receiver/bookings';

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="max-w-7xl mx-auto bg-[#111412]/75 backdrop-blur-xl border border-white/[0.06] rounded-2xl h-16 px-4 sm:px-6 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.02)] pointer-events-auto"
      >
        {/* BRAND IDENTITY NODE */}
        <Link to={user ? dashboardRoute : '/'} className="flex items-center gap-2.5 group outline-none">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-colors duration-300">
            <span className="text-emerald-400 font-bold text-sm filter drop-shadow-[0_2px_8px_rgba(52,211,153,0.4)] transition-transform duration-300 group-hover:scale-110">🌿</span>
            <div className="absolute inset-0 bg-emerald-400/10 blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-black text-base tracking-tight text-white font-sans">
            Rizq<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Saver</span>
          </span>
        </Link>

        {/* LOGISTICS & CONTROLS MATRIX */}
        <div className="flex items-center gap-4">

          {/* Receiver Navigation Node */}
          {user?.role === 'receiver' && (
            <Link
              to="/receiver/bookings"
              className={`text-xs font-mono uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all border ${location.pathname === '/receiver/bookings'
                  ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400 font-bold'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-white/[0.05]'
                }`}
            >
              My Claims
            </Link>
          )}

          {/* Donor Navigation Node */}
          {user?.role === 'donor' && user?.isVerified && location.pathname !== '/donor/create' && (
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/donor/create"
                className="inline-flex items-center gap-1.5 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.14] border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(16,185,129,0.1)]"
              >
                + Log Food
              </Link>
            </motion.div>
          )}

          {/* ACCOUNT IDENTITY PANEL */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold text-gray-200 tracking-tight leading-none max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/70 font-black mt-1">
                  {user.role}
                </span>
              </div>

              {/* Holographic Avatar Core */}
              <div className="relative w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center text-xs font-mono font-black uppercase text-gray-300 shadow-inner">
                {user.name ? user.name.substring(0, 2) : 'OP'}
                {user.isVerified && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#090b0a] shadow-[0_0_8px_#34d399]" />
                )}
              </div>

              {/* SECURE TERMINATION ACTION */}
              <motion.button
                whileHover={{ scale: 1.05, bg: "rgba(244,63,94,0.08)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-white/[0.01] border border-white/[0.06] hover:border-rose-500/30 text-gray-400 hover:text-rose-400 p-2 rounded-xl transition-all duration-200"
                title="Disconnect Node"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
      </motion.nav>
    </header>
  );
}