import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiBaseUrl = 'http://localhost:3001';
      const userId = user?.id ? `&userId=${user.id}` : '';
      const response = await fetch(`${apiBaseUrl}/search?q=${encodeURIComponent(searchQuery.trim())}${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Arama işlemi başarısız oldu');
      }

      const data = await response.json();
      const items = data.items || [];
      
      // Eğer sonuç bulunamadıysa 404 sayfasına yönlendir
      if (items.length === 0) {
        handleClose();
        navigate('/404');
        return;
      }
      
      setSearchResults(items);
    } catch (err) {
      console.error('Arama hatası:', err);
      setError(err.message || 'Arama işlemi sırasında bir hata oluştu');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{ top: '120px', left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.div
          className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/30 h-[70vh] overflow-hidden mx-4"
          style={{ width: '1400px', maxWidth: '95vw' }}
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
                onClick={handleClose}
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
                  onKeyPress={handleKeyPress}
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
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Aranıyor...
                  </>
                ) : (
                  'Ara'
                )}
              </button>
            </div>

            {/* Arama Sonuçları */}
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent max-h-96">
              {error ? (
                <div className="text-center py-8">
                  <div className="text-red-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Arama Hatası</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="animate-spin w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg">"{searchQuery}" için arama yapılıyor...</p>
                    <p className="text-sm mt-2">Lütfen bekleyiniz...</p>
                  </div>
                </div>
              ) : hasSearched && searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-slate-300 text-sm mb-4 px-1">
                    "{searchQuery}" için {searchResults.length} sonuç bulundu
                  </div>
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={index}
                      className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => {
                        if (result.link === '#' || !result.link) {
                          handleClose();
                          navigate('/404');
                        } else {
                          window.open(result.link, '_blank');
                        }
                      }}
                    >
                      <h3 className="text-white font-medium text-lg mb-2 hover:text-purple-300 transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                        {result.snippet}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-400">{result.displayLink}</span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : hasSearched && searchResults.length === 0 && !error ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg">"{searchQuery}" için sonuç bulunamadı</p>
                    <p className="text-sm mt-2">Farklı anahtar kelimeler deneyin</p>
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
