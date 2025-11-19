import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/auth/hooks/useAuth';
import { useForm } from '../components/auth/hooks/useForm';
import { useNavigation } from '../components/shared/hooks/useNavigation';
import { Navigate } from 'react-router-dom';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import Message from '../components/shared/Message';
import countries from '../data/countries.json';

export default function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { goTo } = useNavigation();
  const { values, handleChange, isSubmitting, setIsSubmitting, setValue } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    country: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Kullanıcının Google ile giriş yapıp yapmadığını kontrol et
  const isGoogleUser = user?.firebase_uid != null;

  useEffect(() => {
    if (user) {
      setValue('first_name', user.first_name || '');
      setValue('last_name', user.last_name || '');
      setValue('email', user.email || '');
      setValue('birth_date', user.birth_date ? new Date(user.birth_date).toISOString().split('T')[0] : '');
      setValue('country', user.country || '');
    }
  }, [user, setValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);
    setMessage('');

    try {
      const updateData = {
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: values.birth_date,
        country: values.country
      };

      // Email sadece Google kullanıcısı değilse gönder
      if (!isGoogleUser) {
        updateData.email = values.email;
      }

      // Şifre sadece girilmişse ekle
      if (values.password) {
        updateData.password = values.password;
      }

      const result = await updateProfile(updateData);
      
      if (result) {
        setMessage('✅ Profil başarıyla güncellendi');
        // Şifre alanını temizle
        setValue('password', '');
        setTimeout(() => {
          goTo('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage(`❌ ${error.message || 'Profil güncellenirken bir hata oluştu'}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil Güncelle</h1>
              <p className="text-gray-600">Bilgilerinizi güncelleyin</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad *
                  </label>
                  <Input
                    type="text"
                    name="first_name"
                    value={values.first_name}
                    onChange={handleChange}
                    placeholder="Adınızı girin"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad *
                  </label>
                  <Input
                    type="text"
                    name="last_name"
                    value={values.last_name}
                    onChange={handleChange}
                    placeholder="Soyadınızı girin"
                    required
                    className="w-full"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email adresinizi girin"
                  required
                  disabled={isGoogleUser}
                  className={`w-full ${isGoogleUser ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre (Opsiyonel)
                </label>
                <Input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Yeni şifrenizi girin (boş bırakabilirsiniz)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Son 3 şifrenizden farklı olmalıdır
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doğum Tarihi
                  </label>
                  <Input
                    type="date"
                    name="birth_date"
                    value={values.birth_date}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ülke
                  </label>
                  <select
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Ülke seçin...</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Message message={message} />
                </motion.div>
              )}

              <motion.div
                className="flex gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isLoading || isSubmitting}
                    className="w-full"
                  >
                    {isLoading || isSubmitting ? 'Güncelleniyor...' : 'Profili Güncelle'}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => goTo('/dashboard')}
                    className="px-8"
                  >
                    İptal
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
