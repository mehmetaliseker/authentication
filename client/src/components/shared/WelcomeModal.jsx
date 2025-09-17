import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeModal({ isOpen, user, onComplete }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // 3 saniye sonra otomatik kapat

      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md w-full mx-4"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading Animation */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Hoş Geldiniz!
              </h2>
              <p className="text-white/80 mb-2">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-white/60 text-sm">
                Yükleniyor...
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="mt-6 w-full bg-white/20 rounded-full h-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
