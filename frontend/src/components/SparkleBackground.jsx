import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SparkleBackground() {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        // Generate an array of random positions & sizes for the sparkles
        const generatedSparkles = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2, // Sizes between 2px and 6px
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 5,
            duration: Math.random() * 4 + 4, // Twinkle speed
        }));
        setSparkles(generatedSparkles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {sparkles.map((sparkle) => (
                <motion.div
                    key={sparkle.id}
                    className="absolute rounded-full bg-gradient-to-r from-emerald-300 to-amber-200"
                    style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        width: sparkle.size,
                        height: sparkle.size,
                        // That beautiful glowing Pinterest aura
                        boxShadow: '0 0 12px 3px rgba(110, 231, 183, 0.4), 0 0 20px 6px rgba(253, 230, 138, 0.2)',
                    }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [0.8, 1.3, 0.8],
                        y: [0, -30, 0], // Gentle floating drift
                    }}
                    transition={{
                        duration: sparkle.duration,
                        delay: sparkle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}