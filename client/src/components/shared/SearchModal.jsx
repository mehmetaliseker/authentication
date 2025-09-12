import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ top: '315px', left: 0, right: 0, bottom: '100px' }}
      >
        <motion.div
          className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/30 w-full max-w-4xl h-[70vh] overflow-hidden mx-4"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-600/30 bg-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Arama Motoru</h2>
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-slate-600 rounded-lg border border-slate-500/50"
                title="Kapat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 flex flex-col h-full">
            {/* Arama Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Arama yapın..."
                  className="w-full bg-slate-700/50 text-white placeholder-slate-400 p-4 pl-12 rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                />
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => {
                  // Arama işlemi burada yapılacak
                  console.log('Arama:', searchQuery);
                }}
                disabled={!searchQuery.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-medium transition-colors"
              >
                Ara
              </button>
            </div>

            {/* Arama Sonuçları */}
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent max-h-96">
              {searchQuery.trim() ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg">"{searchQuery}" için arama yapılıyor...</p>
                    <p className="text-sm mt-2">Arama sonuçları burada görünecek</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-slate-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg">Arama yapmak için bir terim girin</p>
                    <p className="text-sm mt-2">Yukarıdaki arama kutusuna yazmaya başlayın</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
