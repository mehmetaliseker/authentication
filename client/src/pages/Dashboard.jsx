import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import UserInfo from '../components/dashboard/UserInfo';
import { DashboardSkeleton } from '../components/shared/Skeleton';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      className="h-full flex flex-col justify-center items-center p-8 pt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-white mb-4 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/30"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Kişisel Bilgilerim
        </motion.h1>
        <motion.p 
          className="text-gray-200 text-lg bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Hesap bilgilerinizi görüntüleyin ve düzenleyin.
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="flex justify-center max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <UserInfo />
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;