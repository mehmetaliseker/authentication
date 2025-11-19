import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/hooks/useAuth';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function ProfilePopup({ isOpen, onClose, onProfileClick, onLogoutModalChange }) {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    onLogoutModalChange?.(true);
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutConfirm(false);
    onLogoutModalChange?.(false);
    onClose();
    window.location.href = '/login';
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
    onLogoutModalChange?.(false);
  };

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  const handleHomeClick = () => {
    window.location.href = '/';
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            className="absolute top-full right-0 mt-2 w-64 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-white/60 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <motion.button
                onClick={handleHomeClick}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Ana Sayfa</span>
              </motion.button>

              <motion.button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Bilgilerim</span>
              </motion.button>

              <motion.button
                onClick={handleLogoutClick}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Çıkış Yap</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Logout Confirmation Modal */}
          <LogoutConfirmModal 
            isOpen={showLogoutConfirm}
            onConfirm={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
          />
        </>
      )}
    </AnimatePresence>
  );
}
