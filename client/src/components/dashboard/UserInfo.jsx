import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function UserInfo() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Kullanıcı bilgileri yükleniyor...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Belirtilmemiş';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        👤 Kullanıcı Bilgileri
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Ad
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
              {user.first_name || 'Belirtilmemiş'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Soyad
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
              {user.last_name || 'Belirtilmemiş'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Doğum Tarihi
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
              {formatDate(user.birth_date)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Yaş
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
              {calculateAge(user.birth_date)} yaş
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              E-posta
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
              {user.email}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Ülke
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
              {user.country || 'Belirtilmemiş'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Kullanıcı ID
            </label>
            <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20 font-mono text-sm">
              {user.id}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email Doğrulama
            </label>
            <p className={`p-3 rounded-lg text-sm font-medium ${
              user.is_verified 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {user.is_verified ? '✅ Doğrulanmış' : '⚠️ Doğrulanmamış'}
            </p>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6 pt-6 border-t border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white/80">Hesap Durumu</h3>
            <p className="text-sm text-green-400 mt-1 font-semibold">✅ Aktif</p>
          </div>
          
          <div className="text-center">
            <h3 className="text-sm font-medium text-white/80">Kayıt Tarihi</h3>
            <p className="text-sm text-white/70 mt-1">
              {formatDate(user.created_at)}
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white/80">Son Güncelleme</h3>
            <p className="text-sm text-white/70 mt-1">
              {formatDate(user.updated_at)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
