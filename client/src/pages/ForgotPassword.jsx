import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ComputerScienceSVG from '../assets/Computer_science_education.svg';

export default function ForgotPassword() {
  const { goTo } = useNavigation();

  const handleBack = () => {
    goTo('/login');
  };

  const handleResetPassword = (token) => {
    goTo(`/reset-password/${token}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Arkaplan SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center z-0"
      >
        <img 
          src={ComputerScienceSVG} 
          alt="Computer Science Education" 
          className="w-[40rem] h-[40rem] text-gray-400" 
        />
      </motion.div>

      {/* Yuvarlak Arkaplan - Sol Mor, Sağ Mavi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="absolute inset-0 z-10"
      >
        <div className="w-full h-full relative">
          {/* Sol yarı - Mor */}
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-r-full"></div>
          {/* Sağ yarı - Mavi */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-blue-600 to-blue-800 rounded-l-full"></div>
        </div>
      </motion.div>

      {/* Form - Önde */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md mx-8"
      >
        <ForgotPasswordForm 
          onBack={handleBack} 
          onResetPassword={handleResetPassword} 
        />
      </motion.div>
    </div>
  );
}