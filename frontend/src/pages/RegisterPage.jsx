import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'receiver',
    organizationName: '', phone: '', city: '', address: '',
  });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      toast.success('Account created!');
      navigate(form.role === 'donor' ? '/donor' : '/receiver');
    } else {
      toast.error(result.message);
    }
  };

  const isDonor = form.role === 'donor';

  return (
    <div className="min-h-screen bg-[#090b0a] text-gray-100 flex items-center justify-center px-4 py-12 relative overflow-hidden antialiased perspective-1000">

      {/* 🌌 BACKGROUND DEPTH AMBIENCE */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#1c261e] opacity-30 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2e2616] opacity-20 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.012] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* BRAND IDENTITY HEADER - Inspired by luxury editorial typography */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/15 to-amber-500/5 border border-emerald-500/20 shadow-[0_4px_15px_rgba(52,211,153,0.1)] mb-4">
            <span className="text-xl filter drop-shadow-[0_2px_4px_rgba(52,211,153,0.2)]">🌿</span>
          </div>

          {/* High-fashion elegant Serif Heading style */}
          <h1
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-normal tracking-wide text-white"
          >
            Rizq<span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-amber-200">Saver</span>
          </h1>

          <p
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="text-[11px] text-gray-400 font-medium tracking-widest uppercase mt-2.5 max-w-xs mx-auto opacity-80"
          >
            The Tactical Food Allocation Network
          </p>
        </motion.div>

        {/* COMPONENT ENTRY INTERFACE */}
        <motion.form
          layout
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30, rotateX: 2 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 15 }}
          className="bg-[#111412]/85 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 space-y-5 shadow-[0_30px_70px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.03)]"
        >
          {/* ROLE SELECTOR MATRIX */}
          <div className="grid grid-cols-2 gap-2 bg-[#050706] p-1.5 rounded-full border border-white/[0.05]">
            {['receiver', 'donor'].map((r) => {
              const active = form.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className={`py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${active
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.2)]'
                      : 'text-gray-400 hover:text-white bg-transparent'
                    }`}
                >
                  {r === 'donor' ? '🍽️ Donor' : '🤝 Receiver'}
                </button>
              );
            })}
          </div>

          <Field label="Full Name Signature">
            <input type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass} placeholder="Enter your beautiful identity" />
          </Field>

          {/* DYNAMIC FIELD COMPONENT SLIDERS */}
          <AnimatePresence mode="popLayout">
            {isDonor && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Field label="Organization Entity">
                  <input type="text" required={isDonor} value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                    className={inputClass} placeholder="Restaurant or company name" />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Electronic Mail Core">
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass} placeholder="name@domain.com" />
          </Field>

          <Field label="Access Authentication Key">
            <input type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass} placeholder="••••••••••••" />
          </Field>

          {/* GRID CONFIGURATIONS */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Operational City">
              <input type="text" required value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={inputClass} placeholder="Lahore" />
            </Field>
            <Field label="Communications Line">
              <input type="tel" required value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass} placeholder="03xx-xxxxxxx" />
            </Field>
          </div>

          {/* SYSTEM WARNING BANNER */}
          <AnimatePresence>
            {isDonor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-[11px] text-amber-300 bg-amber-500/[0.04] border border-amber-500/15 rounded-2xl p-3.5 flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-xs mt-0.5 opacity-80">✨</span>
                <span>Donor authorizations undergo secure administrative routing before catalog publication rights initialize.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTION EMITTER */}
          <motion.button
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-neutral-950 font-extrabold py-3.5 rounded-full text-xs uppercase tracking-widest shadow-[0_12px_30px_rgba(16,185,129,0.15)] transition-all mt-2"
          >
            {loading ? 'Initializing Matrix...' : 'Create Account Node'}
          </motion.button>
        </motion.form>

        {/* FOOTER CALLOUT ACTION */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          className="text-center text-xs text-gray-400 mt-8 tracking-wide font-medium"
        >
          Already holding an access token?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors underline underline-offset-4 decoration-emerald-500/30">
            Sign in here
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

// Custom typography tags for clean input context mapping
const Field = ({ label, children }) => (
  <div className="w-full">
    <label
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5 pl-1"
    >
      {label}
    </label>
    {children}
  </div>
);

const inputClass = "w-full bg-[#161a17] border border-white/[0.08] text-white rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-emerald-400/60 focus:bg-[#1b211d] focus:ring-4 focus:ring-emerald-400/5 shadow-inner transition-all duration-200 placeholder-gray-500 font-medium tracking-wide";