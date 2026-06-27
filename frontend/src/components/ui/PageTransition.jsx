import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
    return (
        <motion.div
            // 🌟 THE SACRED ENTRANCE: 
            // Starts blurred (misty), slightly smaller (contracted), and invisible
            initial={{
                opacity: 0,
                scale: 0.98,
                filter: "blur(15px)",
                y: 10
            }}
            // 🌟 THE NUR REVEAL:
            // Materializes into clarity with a "breathing" scale expansion
            animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                y: 0
            }}
            // 🌟 THE EVAPORATION:
            // Instead of falling, it "evaporates" upward into the Barkah shower
            exit={{
                opacity: 0,
                scale: 1.02,
                filter: "blur(20px)",
                y: -15
            }}
            transition={{
                // Slightly longer duration to feel "gentle" and patient
                duration: 0.9,
                // A very custom, high-end "Soulful" ease: 
                // Slow start, buttery middle, and a long, lingering finish
                ease: [0.19, 1, 0.22, 1]
            }}
            className="w-full min-h-screen relative z-10"
        >
            {/* 
               OPTIONAL: Subtle "Glow Flash" on entry 
               This adds a tiny 'bloom' effect as the page loads 
            */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 1.5, times: [0, 0.5, 1] }}
                className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 to-transparent pointer-events-none"
            />

            {children}
        </motion.div>
    );
}