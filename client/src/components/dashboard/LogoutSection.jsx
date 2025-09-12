import React from 'react';
import { motion } from 'framer-motion';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import LogoutSectionWarning from './LogoutSectionWarning';
import LogoutSectionButtons from './LogoutSectionButtons';

export default function LogoutSection() {
  const { logout, isLoading } = useAuth();
  const { goTo } = useNavigation();
  const { values, setValue } = useForm({ showConfirm: false });

  const handleLogout = async () => {
    await logout();
    goTo('/login');
  };

  const handleConfirmLogout = () => {
    setValue('showConfirm', true);
  };

  const handleCancelLogout = () => {
    setValue('showConfirm', false);
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        🔒 Güvenlik
      </motion.h2>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <LogoutSectionWarning />
        
        <LogoutSectionButtons
          showConfirm={values.showConfirm}
          isLoading={isLoading}
          onConfirmLogout={handleConfirmLogout}
          onLogout={handleLogout}
          onCancelLogout={handleCancelLogout}
        />
      </motion.div>
    </motion.div>
  );
}
