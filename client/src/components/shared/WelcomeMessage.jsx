import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormSkeleton } from './Skeleton';

export default function WelcomeMessage({ user, onComplete }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          onComplete?.();
        }, 500); // Animasyon bitince callback'i çağır
      }, 2000); // 2 saniye göster

      return () => clearTimeout(timer);
    }
  }, [user, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border border-white/20"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.5 
            }}
          >
            {/* Yükleme Spinner */}
            <motion.div
              className="w-20 h-20 mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <div className="relative w-full h-full">
                <motion.div
                  className="absolute inset-0 border-4 border-white/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Yükleniyor...
            </motion.h2>
            
            <motion.p
              className="text-lg text-white/80 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Hoş geldiniz, ana sayfaya yönlendiriliyorsunuz
            </motion.p>
            
            <motion.div
              className="mt-6 w-full bg-white/20 rounded-full h-2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
