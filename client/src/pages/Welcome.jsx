import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/auth/hooks/useAuth';
import LoginStatsTable from '../components/dashboard/LoginStatsTable';
import FriendsList from '../components/dashboard/FriendsList';
import { DashboardSkeleton } from '../components/shared/Skeleton';

function Welcome() {
  const { user } = useAuth();

  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="h-full relative overflow-hidden bg-[#0f0f1a]">
      <motion.div 
        className="h-full p-8 pt-24 relative z-10 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* İki sütunlu layout */}
        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LoginStatsTable />
          </motion.div>
          
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <FriendsList />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Welcome;
