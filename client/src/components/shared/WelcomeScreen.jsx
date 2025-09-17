import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeScreen({ user }) {
  return (
    <motion.div 
      className="h-full flex flex-col justify-center items-center p-8 pt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.h1 
          className="text-6xl font-bold text-white mb-8 bg-white/20 backdrop-blur-sm px-12 py-8 rounded-3xl border border-white/30"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hoş Geldiniz
        </motion.h1>
        
        <motion.div
          className="bg-white/10 backdrop-blur-sm px-8 py-6 rounded-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-3xl text-white font-semibold">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-gray-300 text-lg mt-2">{user?.email}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
