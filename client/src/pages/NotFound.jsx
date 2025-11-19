import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/auth/hooks/useAuth';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(10);

  // Giriş yapmamış kullanıcıları login sayfasına yönlendir
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Sadece giriş yapmış kullanıcılar için geri sayım başlat
    if (!isAuthenticated) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isAuthenticated]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Giriş yapmamış kullanıcılar hiçbir şey görmesin
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Büyük Rakam */}
          <motion.h1 
            className="text-9xl md:text-[200px] font-bold text-white/20 mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            404
          </motion.h1>

          {/* Üzgün Emoji veya İkon */}
          <motion.div
            className="text-8xl mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
          >
            😕
          </motion.div>

          {/* Ana Başlık */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Sayfa Bulunamadı
          </motion.h2>

          {/* Açıklama */}
          <motion.p
            className="text-xl text-gray-300 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Aradığınız sayfa bulunamadı veya taşınmış olabilir.
          </motion.p>

          {/* Yol Gösterme */}
          <motion.p
            className="text-lg text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Talep edilen URL: <span className="text-purple-400 font-mono">{location.pathname}</span>
          </motion.p>

          {/* Geri Sayım */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <span className="text-white text-lg">
                Ana sayfaya yönlendiriliyorsunuz... <span className="font-bold text-purple-400">{countdown}</span>
              </span>
            </div>
          </motion.div>

          {/* Butonlar */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              onClick={handleGoHome}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ana Sayfaya Dön
            </motion.button>

            <motion.button
              onClick={handleGoBack}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Geri Dön
            </motion.button>
          </motion.div>

          
        </motion.div>
      </div>
    </div>
  );
}

