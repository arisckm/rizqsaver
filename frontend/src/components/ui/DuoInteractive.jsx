import React from 'react';
import { motion } from 'framer-motion';

// 🌟 THE 3D BOUNCY BUTTON
// Give it a shadow color that matches its background for that Duolingo plastic block look!
export function DuoButton({ children, onClick, className = "", variant = "primary" }) {
    const isSecondary = variant === "secondary";

    return (
        <motion.button
            onClick={onClick}
            className={`
        relative px-6 py-3 font-bold text-center rounded-2xl tracking-wide transition-colors duration-100
        ${isSecondary
                    ? "bg-surface-900 text-surface-200 border-2 border-surface-800 border-b-4 active:border-b-2"
                    : "bg-brand-600 text-white border-b-4 border-brand-800 active:border-b-0"} 
        ${className}
      `}
            whileHover={{ y: -2 }}
            whileTap={{ y: 2 }}
            transition={{ type: "spring", stiffness: 600, damping: 15 }}
        >
            {children}
        </motion.button>
    );
}

// 🌟 THE STAGGERED ELEMENT CONTAINER
// Wrap your stats grid or donor listing rows in this to make them wave onto the screen!
export function DuoStaggerContainer({ children, className = "" }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 } // Spacing between each card's entrance
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={className}
        >
            {children}
        </motion.div>
    );
}

// 🌟 THE INDIVIDUAL STAGGER CARD
export function DuoStaggerItem({ children, className = "" }) {
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 15 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }} // Bounces slightly up when hovered!
            className={className}
        >
            {children}
        </motion.div>
    );
}