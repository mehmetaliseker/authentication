import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{ top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
      >
        <motion.div
          className="bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-600/30 p-8 mx-4"
          style={{ width: '450px', maxWidth: '90vw' }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Çıkış Yapmak İstediğinize Emin Misiniz?
            </h2>
            <p className="text-gray-300">
              Çıkış yaparsanız tekrar giriş yapmanız gerekecek.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={onCancel}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Hayır
            </motion.button>
            <motion.button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Evet, Çıkış Yap
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
