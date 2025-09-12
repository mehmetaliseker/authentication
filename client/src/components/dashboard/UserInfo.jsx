import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { UserInfoSkeleton } from '../shared/Skeleton';

export default function UserInfo() {
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return <UserInfoSkeleton />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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

  const handleEdit = (field) => {
    setEditingField(field);
    let value = user[field] || '';
    
    // Doğum tarihi için özel format - timezone sorununu çöz
    if (field === 'birth_date' && value) {
      const date = new Date(value);
      // Yerel tarih formatını kullan (timezone sorununu önler)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      value = `${year}-${month}-${day}`;
    }
    
    setEditValues({ ...editValues, [field]: value });
  };

  const handleSave = async (field) => {
    if (editValues[field] === user[field]) {
      setEditingField(null);
      return;
    }

    // Doğum tarihi için 18 yaş kontrolü
    if (field === 'birth_date' && editValues[field]) {
      const birthDate = new Date(editValues[field]);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        actualAge = age - 1;
      }
      
      if (actualAge < 18) {
        alert('18 yaşından küçük kullanıcılar için doğum tarihi güncellenemez.');
        setEditingField(null);
        return;
      }
    }

    setIsUpdating(true);
    try {
      // Doğum tarihi için özel format
      let valueToSend = editValues[field];
      if (field === 'birth_date') {
        // Tarih formatını düzelt - timezone sorununu çöz
        if (valueToSend) {
          // Direkt olarak seçilen tarihi kullan (timezone dönüşümü yapma)
          valueToSend = valueToSend; // Zaten YYYY-MM-DD formatında
        }
      }

      const response = await fetch('http://localhost:3001/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ 
          userId: user.id,
          [field]: valueToSend 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          updateUser(data.user);
          setEditingField(null);
        } else {
          alert('Güncelleme başarısız oldu');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Güncelleme başarısız oldu');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyPress = (e, field) => {
    if (e.key === 'Enter') {
      handleSave(field);
    }
  };

  const EditableField = ({ field, label, value, type = 'text', disabled = false }) => {
    // Doğum tarihi için özel değer formatı
    const getDisplayValue = () => {
      if (field === 'birth_date' && user.birth_date) {
        const date = new Date(user.birth_date);
        // Yerel tarih formatını kullan (timezone sorununu önler)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return value || 'Belirtilmemiş';
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-white/80">
            {label}
          </label>
          {!disabled && (
            <button
              onClick={() => handleEdit(field)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              disabled={isUpdating}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/60 hover:text-white">
                <path d="M14.3601 4.07866L15.2869 3.15178C16.8226 1.61607 19.3125 1.61607 20.8482 3.15178C22.3839 4.68748 22.3839 7.17735 20.8482 8.71306L19.9213 9.63993M14.3601 4.07866C14.3601 4.07866 14.4759 6.04828 16.2138 7.78618C17.9517 9.52407 19.9213 9.63993 19.9213 9.63993M14.3601 4.07866L5.83882 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021M19.9213 9.63993L11.4001 18.1612C10.8229 18.7383 10.5344 19.0269 10.2162 19.2751C9.84082 19.5679 9.43469 19.8189 9.00498 20.0237C8.6407 20.1973 8.25352 20.3263 7.47918 20.5844L4.19792 21.6782M4.19792 21.6782L3.39584 21.9456C3.01478 22.0726 2.59466 21.9734 2.31063 21.6894C2.0266 21.4053 1.92743 20.9852 2.05445 20.6042L2.32181 19.8021M4.19792 21.6782L2.32181 19.8021" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          )}
        </div>
        
                  {editingField === field ? (
                    <div className="relative">
                      <input
                        type={type}
                        value={editValues[field] || ''}
                        onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                        onKeyPress={(e) => handleKeyPress(e, field)}
                        onBlur={() => handleSave(field)}
                        className="w-full text-white bg-white/20 p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoFocus
                        disabled={isUpdating}
                      />
                      {isUpdating && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-white bg-white/10 p-3 rounded-lg border border-white/20">
                      {getDisplayValue()}
                    </p>
                  )}
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
          <EditableField field="first_name" label="Ad" value={user.first_name} />
          <EditableField field="last_name" label="Soyad" value={user.last_name} />
          <EditableField field="birth_date" label="Doğum Tarihi" value={formatDate(user.birth_date)} type="date" />
          <EditableField field="age" label="Yaş" value={`${calculateAge(user.birth_date)} yaş`} disabled={true} />
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EditableField field="email" label="E-posta" value={user.email} disabled={true} />
          <EditableField field="country" label="Ülke" value={user.country} />
          <EditableField field="id" label="Kullanıcı ID" value={user.id} disabled={true} />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className="text-center">
            <h3 className="text-sm font-medium text-white/80">Son Giriş</h3>
            <p className="text-sm text-white/70 mt-1">
              {formatDateTime(user.lastLogin)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
