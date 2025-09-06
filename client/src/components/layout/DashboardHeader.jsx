import React from 'react';
import { motion } from 'framer-motion';
import { useAuth, useNavigation } from '../../hooks/useAuth';
import Button from '../shared/Button';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const { goTo } = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateProfile = () => {
    goTo('/profile');
  };

  return (
    <header className="bg-cyan-100/30 backdrop-blur-lg shadow-lg border-b border-cyan-200/40">
      <div className="container mx-auto px-4 py-4 ">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-900">Dashboard</h1>
            <p className="text-sm text-cyan-700">
              Hoşgeldin, {user?.first_name} {user?.last_name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-cyan-800">{user?.email}</p>
              <p className="text-xs text-cyan-600">Giriş yapıldı</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleUpdateProfile}
                variant="primary"
                size="sm"
                className="mr-2"
              >
                Profili Güncelle
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleLogout}
                variant="danger"
                size="sm"
              >
                Çıkış Yap
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
