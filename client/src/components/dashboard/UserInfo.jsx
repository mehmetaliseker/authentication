import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { UserInfoSkeleton } from '../shared/Skeleton';
import SaveIcon from '../../assets/save-icon.svg';
import countries from '../../data/countries.json';

export default function UserInfo() {
  const { user, updateUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef(null);
  // ****inputta yazı yazmaya çalışınca her seferinde yazıyı sona atma olayı var*****

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
    setHasUnsavedChanges(false);
    setShowTooltip(false);
    let value = user[field] || '';
    
    // Doğum tarihi için özel format - timezone sorununu çöz
    if (field === 'birth_date' && value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      value = `${year}-${month}-${day}`;
    }
    
    setEditValues({ ...editValues, [field]: value });
  };

  const handleSave = async (field) => {
    setShowTooltip(false);
    
    if (editValues[field] === user[field]) {
      setEditingField(null);
      setHasUnsavedChanges(false);
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
        setHasUnsavedChanges(false);
        return;
      }
    }

    setIsUpdating(true);
    try {
      // Doğum tarihi 
      let valueToSend = editValues[field];
      if (field === 'birth_date') {
        
        if (valueToSend) {
          
          valueToSend = valueToSend; 
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
          setHasUnsavedChanges(false);
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

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(value !== user[field]);
  };

  const handleBlur = (field) => {
    if (hasUnsavedChanges) {
      setShowTooltip(true);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    } else {
      setEditingField(null);
    }
  };

  const handleCancel = (field) => {
    setEditingField(null);
    setHasUnsavedChanges(false);
    setShowTooltip(false);
    setEditValues({ ...editValues, [field]: user[field] || '' });
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const EditableField = ({ field, label, value, type = 'text', disabled = false }) => {
    const isEditing = editingField === field;
    const inputRef = useRef(null);
    const cursorPosRef = useRef(null);

    // Doğum tarihi için özel değer formatı
    const getDisplayValue = () => {
      if (field === 'birth_date' && user.birth_date) {
        const date = new Date(user.birth_date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return value || 'Belirtilmemiş';
    };

    // İmleci kaydet ve restore et
    const handleChange = (e) => {
      const { selectionStart, value } = e.target;
      cursorPosRef.current = selectionStart;
      handleInputChange(field, value);
    };

    // DOM update sonrası imleci geri koy
    useLayoutEffect(() => {
      if (isEditing && inputRef.current && cursorPosRef.current !== null) {
        inputRef.current.setSelectionRange(cursorPosRef.current, cursorPosRef.current);
      }
    }, [editValues, isEditing]);

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-white/80">
            {label}
          </label>
          {!disabled && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(field)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                disabled={isUpdating}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/60 hover:text-white">
                  <path d="M14.3601 4.07866L15.2869 3.15178C16.8226 1.61607 19.3125 1.61607 20.8482 3.15178C22.3839 4.68748 22.3839 7.17735 20.8482 8.71306L19.9213 9.63993M14.3601 4.07866C14.3601 4.07866 14.4759 6.04828 16.2138 7.78618C17.9517 9.52407 19.9213 9.63993 19.9213 9.63993M14.3601 4.07866L5.83882 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021M19.9213 9.63993L11.4001 18.1612C10.8229 18.7383 10.5344 19.0269 10.2162 19.2751C9.84082 19.5679 9.43469 19.8189 9.00498 20.0237C8.6407 20.1973 8.25352 20.3263 7.47918 20.5844L4.19792 21.6782M4.19792 21.6782L3.39584 21.9456C3.01478 22.0726 2.59466 21.9734 2.31063 21.6894C2.0266 21.4053 1.92743 20.9852 2.05445 20.6042L2.32181 19.8021M4.19792 21.6782L2.32181 19.8021" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              {isEditing && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSave(field);
                  }}
                  className="p-1 text-white hover:bg-white/10 rounded transition-colors"
                  disabled={isUpdating}
                  title="Kaydet"
                >
                  <img src={SaveIcon} alt="Kaydet" width="16" height="16" className="text-white/60 hover:text-white" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="relative">
            {field === 'country' ? (
              <select
                value={editValues[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave(field);
                  } else if (e.key === 'Escape') {
                    handleCancel(field);
                  }
                }}
                onBlur={() => handleBlur(field)}
                className="w-full text-white bg-white/20 p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                disabled={isUpdating}
              >
                <option value="" className="bg-gray-800">Ülke seçin...</option>
                {countries.map((country) => (
                  <option key={country} value={country} className="bg-gray-800">
                    {country}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={field}
                ref={inputRef}
                type={type}
                value={editValues[field] || ''}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSave(field);
                  } else if (e.key === 'Escape') {
                    handleCancel(field);
                  }
                }}
                onBlur={() => handleBlur(field)}
                className="w-full text-white bg-white/20 p-3 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                disabled={isUpdating}
              />
            )}
            {isUpdating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              </div>
            )}
            {showTooltip && hasUnsavedChanges && (
              <div className="absolute top-full left-0 mt-2 bg-yellow-600 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                Kaydedilmediğiniz değişiklikler var
                <div className="absolute -top-1 left-4 w-2 h-2 bg-yellow-600 transform rotate-45"></div>
              </div>
            )}
          </div>
        ) : (
          <p className={`text-white p-3 rounded-lg border border-white/20 ${disabled ? 'bg-white/5 cursor-not-allowed' : 'bg-white/10'}`}>
            {getDisplayValue()}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 w-full max-w-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        👤 Kullanıcı Bilgileri
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="space-y-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EditableField field="first_name" label="Ad" value={user.first_name} />
          <EditableField field="email" label="E-posta" value={user.email} disabled={!!user.firebase_uid} />
          <EditableField field="birth_date" label="Doğum Tarihi" value={formatDate(user.birth_date)} type="date" />
        </motion.div>
        
        <motion.div 
          className="space-y-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EditableField field="last_name" label="Soyad" value={user.last_name} />
          <EditableField field="country" label="Ülke" value={user.country} />
          <EditableField field="age" label="Yaş" value={`${calculateAge(user.birth_date)} yaş`} disabled={true} />
        </motion.div>
      </div>

      {/* E-posta Durumu - Full Width (2 kolon genişliğinde) */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-white/30">
          <label className="block text-sm font-medium text-white/70 mb-2 text-center">
            E-posta Doğrulama Durumu
          </label>
          <div className="flex justify-center">
            <div className={`px-6 py-3 rounded-xl text-base font-bold inline-flex items-center gap-3 shadow-lg ${
              user.firebase_uid || user.is_verified
                ? 'bg-gradient-to-r from-green-400/30 to-emerald-400/30 text-green-100 border-2 border-green-400/60' 
                : 'bg-gradient-to-r from-yellow-400/30 to-orange-400/30 text-yellow-100 border-2 border-yellow-400/60'
            }`}>
              {user.firebase_uid || user.is_verified ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Doğrulanmış
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Doğrulanmamış
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
