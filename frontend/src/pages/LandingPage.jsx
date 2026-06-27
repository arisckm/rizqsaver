import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';

// 🌟 SOUL COMPONENT: BARKAH SHOWERING PARTICLES
const BarkahShowerOverlay = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 120 }).map((_, i) => ({
            id: i,
            x: `${Math.random() * 100}%`,
            delay: Math.random() * 8,
            duration: 10 + Math.random() * 10,
            size: `${1.5 + Math.random() * 2}px`,
            glowColor: i % 3 === 0 ? 'rgba(212, 175, 55, 0.7)' : 'rgba(163, 184, 153, 0.7)',
        }));
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        top: '-5%',
                        left: p.x,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(242, 239, 234, 0.9)',
                        boxShadow: `0 0 10px ${p.glowColor}, 0 0 16px rgba(242, 239, 234, 0.4)`,
                    }}
                    initial={{ y: -20, opacity: 0.1 }}
                    animate={{
                        y: ['0vh', '110vh'],
                        opacity: [0.1, 1, 1, 0],
                        scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

// 🌟 SOUL COMPONENT: DRIPPING NUR CLOUD ATMOSPHERE
const NURCloudAtmosphere = () => {
    const clouds = [
        { id: 1, color: '#4a5d4e', size: '60vw', top: '-10%', left: '-10%', blur: '150px' },
        { id: 2, color: '#d4af37', size: '50vw', top: '20%', right: '-15%', blur: '130px' },
        { id: 3, color: '#a3b899', size: '55vw', bottom: '-15%', left: '10%', blur: '160px' },
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
                        opacity: 0.04,
                    }}
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.03, 0.06, 0.03],
                    }}
                    transition={{
                        duration: 12 + cloud.id * 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
};

export default function LandingPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'receiver') navigate('/receiver');
            else navigate('/donor');
        }
    }, [user, navigate]);

    // Framer Motion Animation Variants for Content
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.15 }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
        }
    };

    const subtitleText = "RizqSaver transforms surplus nourishment into shared grace. Connecting honored donors with local communities, seamlessly, respectfully, and honorably.";

    return (
        <div className="min-h-screen bg-[#0e100d] text-[#f2efea] relative overflow-hidden font-sans select-none selection:bg-[#343f35] selection:text-[#f2efea]">

            <NURCloudAtmosphere />

            <AnimatePresence>
                <BarkahShowerOverlay />
            </AnimatePresence>

            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[linear-gradient(to_right,#f2efea_1px,transparent_1px),linear-gradient(to_bottom,#f2efea_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,#000_80%,transparent_100%)]" />

            {/* HEADER NAVIGATION */}
            <header className="relative z-50 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between border-b border-[#202521]/40 bg-[#0e100d]/40 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3a473c] to-[#a3b899] flex items-center justify-center border border-[#627a66]/20 shadow-[0_0_25px_rgba(163,184,153,0.3)]">
                        <span className="text-[#f2efea] font-serif italic text-2xl font-black">ر</span>
                    </div>
                    <span className="text-3xl font-serif font-black tracking-tight text-[#f2efea]">
                        Rizq<span className="text-[#d4af37] italic font-normal">Saver</span>
                    </span>
                </div>

                <Link to="/login">
                    <motion.button
                        whileHover={{ y: -3 }}
                        whileTap={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="text-sm font-bold tracking-wide text-[#f2efea]/90 bg-[#161916] px-7 py-3 rounded-full border border-[#2b332d] hover:text-[#f2efea] hover:border-[#414d44]/60 transition-all duration-300"
                    >
                        Sign In
                    </motion.button>
                </Link>
            </header>

            {/* MAIN HERO CONTENT */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">

                {/* TOP BADGE */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#1e231e]/50 border border-[#343f35]/50 mb-6 shadow-[0_0_20px_rgba(163,184,153,0.08)]"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a3b899] animate-pulse shadow-[0_0_8px_rgba(163,184,153,0.7)]" />
                    <span className="text-xs font-serif italic tracking-wide text-[#d9c5b2]">Reviving the Spirit of Abundance and Shared Grace</span>
                </motion.div>

                {/* HEADLINE */}
                <motion.h1
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl md:text-6xl font-serif font-black tracking-wide text-[#f2efea] max-w-4xl leading-[1.15] mb-6"
                >
                    <motion.span variants={wordVariants} className="inline-block font-light italic mr-3">A Gentle Space</motion.span>
                    <motion.span variants={wordVariants} className="inline-block mr-3">of</motion.span>
                    <motion.span variants={wordVariants} className="inline-block mr-3">Pure</motion.span>
                    <motion.span variants={wordVariants} className="inline-block md:block">Nourishment</motion.span>
                    <motion.span
                        variants={wordVariants}
                        className="bg-clip-text text-transparent bg-gradient-to-r from-[#f2efea] via-[#d4af37] to-[#a3b899] block mt-1"
                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: '200% auto' }}
                    >
                        Where Every Blessing Counts
                    </motion.span>
                </motion.h1>

                {/* SUBTITLE */}
                <motion.p
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-sm md:text-base text-[#b0b8ae] max-w-2xl font-serif font-light leading-relaxed mb-8 tracking-wide px-4 flex flex-wrap justify-center gap-x-1.5 gap-y-1"
                >
                    {subtitleText.split(" ").map((word, i) => (
                        <motion.span
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 4 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                            }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.p>

                {/* CTA BUTTONS */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-20 mb-10"
                >
                    <Link to="/register" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ y: 0, scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 450, damping: 22 }}
                            className="w-full sm:w-auto px-8 py-4 bg-[#425244] hover:bg-[#4b5e4d] text-[#f2efea] font-bold text-base rounded-full tracking-wide shadow-[0_12px_35px_rgba(66,82,68,0.18)] border-b-2 border-[#2b362c] transition-colors duration-200"
                        >
                            Share Your Grace ✨
                        </motion.button>
                    </Link>

                    <Link to="/login" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ y: 0, scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 450, damping: 22 }}
                            className="w-full sm:w-auto px-8 py-4 bg-[#1b1e1a] hover:bg-[#232722] text-[#c4cdc3] font-bold text-base rounded-full tracking-wide border border-[#2c332d] transition-colors duration-200"
                        >
                            Claim Blessings (Charities)
                        </motion.button>
                    </Link>
                </motion.div>

                {/* 🌟 CUSTOM ANIMATED DONATION FIGURE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.9 }}
                    className="relative flex flex-col justify-center items-center w-full max-w-xs mx-auto mt-4 h-48 select-none"
                >
                    {/* Ambient Glow Aura */}
                    <div className="absolute w-44 h-44 bg-gradient-to-t from-[#4a5d4e]/20 via-[#d4af37]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

                    {/* Rising Grace Sparks from the Donation Vessel */}
                    <div className="absolute bottom-16 w-16 h-24 overflow-visible pointer-events-none">
                        {[...Array(4)].map((_, idx) => (
                            <motion.span
                                key={idx}
                                className="absolute rounded-full bg-gradient-to-r from-[#d4af37] to-[#f2efea]"
                                style={{
                                    left: `${20 + idx * 20}%`,
                                    bottom: '0%',
                                    width: idx % 2 === 0 ? '4px' : '6px',
                                    height: idx % 2 === 0 ? '4px' : '6px',
                                    filter: 'blur(0.5px)',
                                    boxShadow: '0 0 8px #d4af37'
                                }}
                                animate={{
                                    y: [-10, -70],
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1.2, 0.2]
                                }}
                                transition={{
                                    duration: 2.5 + idx * 0.4,
                                    repeat: Infinity,
                                    delay: idx * 0.6,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>

                    {/* Floating Heart / Seed of Light (The Blessing Asset) */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                    >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="url(#heartGradient)" />
                            <defs>
                                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f2efea" />
                                    <stop offset="50%" stopColor="#d4af37" />
                                    <stop offset="100%" stopColor="#a3b899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Supporting Hands / Honored Vessel (Receiving & Giving Structure) */}
                    <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="mt-3 opacity-70 filter drop-shadow-[0_4px_10px_rgba(163,184,153,0.3)]"
                    >
                        <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Left hand curvature */}
                            <path d="M4 14C12 18 24 19 32 19" stroke="#a3b899" strokeWidth="1.5" strokeLinecap="round" />
                            {/* Right hand curvature */}
                            <path d="M68 14C60 18 48 19 40 19" stroke="#a3b899" strokeWidth="1.5" strokeLinecap="round" />
                            {/* Base center altar glow path */}
                            <path d="M28 20C32 21 40 21 44 20" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                        </svg>
                    </motion.div>

                    {/* Conceptual Subtitle Indicator */}
                    <span className="text-[10px] font-serif italic tracking-[0.2em] text-[#b0b8ae]/60 mt-4 uppercase">
                        Vessel of Shared Abundance
                    </span>
                </motion.div>

            </main>
        </div>
    );
}