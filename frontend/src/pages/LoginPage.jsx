import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

// 🌟 SOUL COMPONENT: DEEP NUR ATMOSPHERE (Maintains global landing aesthetic)
const NURCloudAtmosphere = () => {
  const clouds = [
    { id: 1, color: '#4a5d4e', size: '50vw', top: '-20%', left: '-10%', blur: '140px' },
    { id: 2, color: '#d4af37', size: '40vw', bottom: '-10%', right: '-10%', blur: '130px' },
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
            scale: [1, 1.06, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10 + cloud.id * 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result && result.success) {
      toast.success('Welcome back!');
      const role = result.user.role;
      navigate(role === 'donor' ? '/donor' : role === 'admin' ? '/admin' : '/receiver');
    } else {
      toast.error(result?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e100d] text-[#f2efea] relative overflow-hidden font-sans flex items-center justify-center px-6 select-none selection:bg-[#343f35]">

      {/* Global Ethereal Underlays */}
      <NURCloudAtmosphere />
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none bg-[linear-gradient(to_right,#f2efea_1px,transparent_1px),linear-gradient(to_bottom,#f2efea_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

      {/* BACK TO SANCTUARY LINK */}
      <Link to="/" className="absolute top-8 left-8 z-50 text-xs font-serif italic tracking-widest text-[#b0b8ae] hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2">
        <span>←</span> Return to Sanctuary
      </Link>

      {/* CENTRAL AUTHENTICATION VESSEL (Now with true floating dimensions) */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{
          opacity: 1,
          y: [0, -8, 0], // Continuous hovering cycle
          scale: 1
        }}
        transition={{
          initial: { duration: 1.2, ease: [0.19, 1, 0.22, 1] },
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative z-10 w-full max-w-md bg-[#111411]/40 backdrop-blur-2xl border border-[#2b352d]/40 p-10 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8),0_0_50px_-5px_rgba(74,93,78,0.15)]"
      >
        {/* Embedded Ambient Backglow behind the box itself */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-[#3a473c]/10 via-transparent to-[#d4af37]/5 opacity-60 pointer-events-none blur-xl" />

        {/* Brand Identity Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3a473c] to-[#a3b899] flex items-center justify-center border border-[#627a66]/20 mx-auto mb-4 shadow-[0_0_25px_rgba(163,184,153,0.2)]">
            <span className="text-[#f2efea] font-serif italic text-2xl font-black">ر</span>
          </div>
          <h2 className="text-3xl font-serif font-black tracking-wide mb-2">
            Rizq<span className="text-[#d4af37] italic font-normal">Saver</span>
          </h2>
          <p className="text-xs font-serif italic text-[#b0b8ae] tracking-wide">
            Re-entering the flow of shared grace
          </p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[#b0b8ae] font-medium mb-2 pl-1">
              Email Sanctuary Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#161a16]/50 border border-[#232924] focus:border-[#4a5d4e] rounded-xl px-4 py-3.5 text-sm text-[#f2efea] outline-none transition-all duration-300 placeholder-[#4a544b]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-[#b0b8ae] font-medium mb-2 pl-1">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#161a16]/50 border border-[#232924] focus:border-[#4a5d4e] rounded-xl px-4 py-3.5 text-sm text-[#f2efea] outline-none transition-all duration-300 placeholder-[#4a544b]"
              placeholder="••••••••"
            />
          </div>

          {/* Premium Organic Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            disabled={loading}
            type="submit"
            className="w-full mt-4 py-4 bg-[#425244] hover:bg-[#4b5e4d] disabled:bg-[#202621] disabled:text-[#4a544b] text-[#f2efea] font-bold text-sm rounded-xl tracking-wider shadow-[0_10px_25px_rgba(66,82,68,0.15)] border-b-2 border-[#2b362c] transition-all duration-200"
          >
            {loading ? "Validating Grace..." : "Sign In to Ecosystem"}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-xs text-[#b0b8ae]/80 font-serif">
          New to our community?{' '}
          <Link to="/register" className="text-[#d4af37] italic hover:underline ml-1">
            Register your intention here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}