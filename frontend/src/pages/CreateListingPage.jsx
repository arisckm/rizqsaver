import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', foodType: 'veg',
    quantity: '', quantityUnit: 'servings',
    expiresAt: '', handlingInstructions: '',
    'location.address': '', 'location.city': '',
  });
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (image) formData.append('image', image);

    try {
      await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Listing posted successfully!');
      navigate('/donor');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors?.length) {
        toast.error(errors[0].message);
      } else {
        toast.error(err.response?.data?.message || 'Failed to share listing.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: "'Fredoka', sans-serif" }}
      className="min-h-screen text-white relative overflow-hidden antialiased tracking-wide bg-[#060807]"
    >

      {/* 🌊 NATIVE TAILWIND GRAPHICAL SILK WAVES AS SEEN IN image_a1673f.jpg */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left Waves */}
        <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[60vh] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-gradient-to-tr from-[#0a0f0c] to-[#121915]/30 opacity-70 blur-xl transform rotate-12" />

        {/* Left Side Rolling Curve */}
        <div className="absolute top-[30%] left-[-15%] w-[50vw] h-[50vh] rounded-[50%_30%_40%_60%_/_50%_60%_40%_50%] bg-gradient-to-r from-[#0b100d] to-transparent opacity-80" />

        {/* Right Side Rolling Ambient Wave */}
        <div className="absolute top-[20%] right-[-25%] w-[70vw] h-[70vh] rounded-[60%_40%_50%_50%_/_40%_40%_60%_60%] bg-gradient-to-l from-[#0e1612]/40 via-[#090e0b]/20 to-transparent opacity-90 transform -rotate-12" />

        {/* Bottom Ambient Glow Edge */}
        <div className="absolute bottom-[-5%] right-[-10%] w-[50vw] h-[40vh] rounded-full bg-[#131d18]/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-2xl mx-auto px-4 py-12">

          {/* CLEAN COMMUNITY HEADER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 text-center sm:text-left"
          >
            <h1 className="text-4xl font-bold tracking-wide text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300">Surplus Rizq</span>
            </h1>
            <p className="text-sm text-emerald-400/80 font-medium mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              List clean, edible excess food to connect with community distribution networks.
            </p>
          </motion.div>

          {/* MASTER COMPONENT FORM LAYER */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="space-y-6 bg-[#0a0d0b]/95 backdrop-blur-2xl border-2 border-white/[0.12] rounded-[2.5rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95)]"
          >
            {/* IMAGE UPLOAD BOX */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 pl-1">
                Food Image Attachment
              </label>
              <label className="block cursor-pointer group">
                <div className={`border-2 border-dashed rounded-2xl transition-all duration-200 relative overflow-hidden aspect-video max-h-48 flex items-center justify-center bg-[#141a17] ${preview ? 'border-emerald-400 shadow-md' : 'border-white/[0.12] hover:border-emerald-400/60'
                  }`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <span className="text-2xl mb-2 filter drop-shadow-[0_4px_10px_rgba(52,211,153,0.3)]">📷</span>
                      <span className="text-xs font-bold text-gray-200 group-hover:text-emerald-300 transition-colors uppercase tracking-wider">Upload Item Imagery</span>
                      <span className="text-[10px] text-emerald-400/50 mt-1 font-medium">RAW, JPG, PNG, WEBP · MAX 5MB</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <Field label="Listing Title *">
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="e.g. 15 Servings of Chicken Biryani"
              />
            </Field>

            <Field label="Description & Allergen Notes">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="Provide details regarding preparation time, packaging format, or potential allergens..."
              />
            </Field>

            {/* SELECTION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Food Category Spectrum *">
                <div className="relative">
                  <select
                    required
                    value={form.foodType}
                    onChange={(e) => setForm({ ...form, foodType: e.target.value })}
                    className={`${inputClass} appearance-none capitalize font-bold`}
                  >
                    {['veg', 'non-veg', 'vegan', 'mixed'].map((t) => (
                      <option key={t} value={t} className="bg-[#0e1210] text-white font-bold">{t}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-400 text-xs font-bold">▼</div>
                </div>
              </Field>

              <Field label="Quantity Parameters *">
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className={`${inputClass} w-24 text-center text-emerald-300 bg-[#121815] font-bold`}
                    placeholder="10"
                  />
                  <div className="relative flex-1">
                    <select
                      value={form.quantityUnit}
                      onChange={(e) => setForm({ ...form, quantityUnit: e.target.value })}
                      className={`${inputClass} appearance-none font-bold`}
                    >
                      {['servings', 'portions', 'packs', 'kg', 'litres'].map((u) => (
                        <option key={u} value={u} className="bg-[#0e1210] text-white font-bold">{u}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-400 text-xs font-bold">▼</div>
                  </div>
                </div>
              </Field>
            </div>

            <Field label="Critical Expiry Horizon *">
              <input
                type="datetime-local"
                required
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className={`${inputClass} text-amber-300 font-bold`}
              />
            </Field>

            <Field label="Handling Instructions">
              <input
                type="text"
                value={form.handlingInstructions}
                onChange={(e) => setForm({ ...form, handlingInstructions: e.target.value })}
                className={inputClass}
                placeholder="e.g. Keep insulated, thermal storage required during transit"
              />
            </Field>

            {/* LOCATION BOX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-white/[0.08] pt-6">
              <Field label="Transfer Point Address *">
                <input
                  type="text"
                  required
                  value={form['location.address']}
                  onChange={(e) => setForm({ ...form, 'location.address': e.target.value })}
                  className={inputClass}
                  placeholder="Street details for logistics pickup"
                />
              </Field>
              <Field label="City Hub *">
                <input
                  type="text"
                  required
                  value={form['location.city']}
                  onChange={(e) => setForm({ ...form, 'location.city': e.target.value })}
                  className={inputClass}
                  placeholder="Lahore"
                />
              </Field>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/donor')}
                className="flex-1 bg-white/[0.02] hover:bg-white/[0.08] border-2 border-white/[0.12] text-gray-200 font-bold py-4 rounded-full text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50 text-neutral-950 font-bold py-4 rounded-full text-xs uppercase tracking-widest shadow-[0_15px_35px_rgba(52,211,153,0.35)] transition-all"
              >
                {loading ? 'Processing...' : 'Broadcast Node Listing'}
              </motion.button>
            </div>
          </motion.form>
        </main>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="w-full">
    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2 pl-1">
      {label}
    </label>
    {children}
  </div>
);

const inputClass = "w-full bg-[#131916]/90 border-2 border-white/[0.12] text-white font-medium rounded-2xl px-4 py-4 text-sm focus:outline-none focus:border-emerald-400 focus:bg-[#19211d] focus:ring-4 focus:ring-emerald-400/10 shadow-inner transition-all duration-150 placeholder-gray-500 tracking-wide";