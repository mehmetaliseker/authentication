import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useNavigation } from '../../hooks/useAuth';
import Button from '../shared/Button';
import TodoModal from '../todo/TodoModal';
import SearchModal from '../shared/SearchModal';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { goTo } = useNavigation();
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateProfile = () => {
    goTo('/profile');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/40 backdrop-blur-lg shadow-lg border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-white/70">
              Hoşgeldin, {user?.first_name} {user?.last_name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-white/60">Giriş yapıldı</p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setIsSearchModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Arama Motoru
              </motion.button>
              
              <motion.button
                onClick={() => setIsTodoModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                To-Do
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Çıkış Yap
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
      
      {/* Todo Modal */}
      <TodoModal 
        isOpen={isTodoModalOpen} 
        onClose={() => setIsTodoModalOpen(false)} 
      />
    </header>
  );
}
