import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateListingPage from './pages/CreateListingPage';
import ListingDetailPage from './pages/ListingDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LandingPage from './pages/LandingPage';

// 🌟 Global Premium Sparkles Engine Component
// Renders gentle, subtle twinkling elements deep in the background layer
function SparkleBackground() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Generates a well-balanced group of 25 sparkles spread across the full viewport
    const generatedSparkles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 2, // Sizes between 2px and 5px
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 6,
      duration: Math.random() * 5 + 4, // Twinkle oscillation speed
    }));
    setSparkles(generatedSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060807]">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-gradient-to-r from-emerald-400/80 to-amber-200/80"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            // Deep, ambient glowing dropshadow matching RizqSaver colors
            boxShadow: '0 0 14px 4px rgba(52, 211, 153, 0.25), 0 0 24px 8px rgba(253, 230, 138, 0.15)',
          }}
          animate={{
            opacity: [0.08, 0.7, 0.08],
            scale: [0.8, 1.25, 0.8],
            y: [0, -25, 0], // Graceful, slow drift upwards and down
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

// Main Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Kept for code safety / manual redirect handling if needed elsewhere
const RoleRedirect = () => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'donor') return <Navigate to="/donor" replace />;
  if (user.role === 'receiver') return <Navigate to="/receiver" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
};

// 🌟 Reusable Micro-wrapper for Global Page Transitions
// 🌟 Clean, stationary cross-fade with absolutely NO screen movement
const AnimatedPageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="w-full min-h-screen relative"
    >
      {children}
    </motion.div>
  );
};

// 🌟 Internal Orchestrator managing route change tracking triggers
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={
          <AnimatedPageWrapper>
            <LandingPage />
          </AnimatedPageWrapper>
        } />

        <Route path="/login" element={
          <AnimatedPageWrapper>
            <LoginPage />
          </AnimatedPageWrapper>
        } />

        <Route path="/register" element={
          <AnimatedPageWrapper>
            <RegisterPage />
          </AnimatedPageWrapper>
        } />

        {/* Donor Routes (Admins allowed here too for direct platform testing) */}
        <Route path="/donor" element={
          <ProtectedRoute allowedRoles={['donor', 'admin']}>
            <AnimatedPageWrapper>
              <DonorDashboard />
            </AnimatedPageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/donor/create" element={
          <ProtectedRoute allowedRoles={['donor', 'admin']}>
            <AnimatedPageWrapper>
              <CreateListingPage />
            </AnimatedPageWrapper>
          </ProtectedRoute>
        } />

        {/* Receiver Routes */}
        <Route path="/receiver" element={
          <ProtectedRoute allowedRoles={['receiver']}>
            <AnimatedPageWrapper>
              <ReceiverDashboard />
            </AnimatedPageWrapper>
          </ProtectedRoute>
        } />

        <Route path="/receiver/bookings" element={
          <ProtectedRoute allowedRoles={['receiver']}>
            <AnimatedPageWrapper>
              <MyBookingsPage />
            </AnimatedPageWrapper>
          </ProtectedRoute>
        } />

        {/* Public Detail Profile Route */}
        <Route path="/listings/:id" element={
          <AnimatedPageWrapper>
            <ListingDetailPage />
          </AnimatedPageWrapper>
        } />

        {/* Admin Dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AnimatedPageWrapper>
              <AdminDashboard />
            </AnimatedPageWrapper>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1c1917', color: '#f5f5f4', border: '1px solid #292524' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1c1917' } },
        }}
      />

      {/* Container holding layout wrappers */}
      <div className="relative min-h-screen text-white select-none selection:bg-emerald-500/30 selection:text-emerald-200">

        {/* ✨ Global background canvas that layers gracefully underneath all pages */}
        <SparkleBackground />

        {/* Front facing dashboard and portal page rendering routes */}
        <div className="relative z-10">
          <AnimatedRoutes />
        </div>

      </div>
    </BrowserRouter>
  );
}