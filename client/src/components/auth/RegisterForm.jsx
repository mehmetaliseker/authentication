import React from 'react';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { FormSkeleton } from '../shared/Skeleton';
import Message from '../shared/Message';

export default function RegisterForm() {
  const { message, register, isLoading } = useAuth();
  const { goTo } = useNavigation();
  const { values, handleChange, isSubmitting, setIsSubmitting } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birth_date: '',
    country: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Yaş kontrolü
    if (values.birth_date) {
      const birthDate = new Date(values.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // Henüz doğum günü gelmemiş
        const actualAge = age - 1;
        if (actualAge < 18) {
          alert('18 yaşından küçük kullanıcılar kayıt olamaz. Lütfen doğum tarihinizi kontrol edin.');
          setIsSubmitting(false);
          return;
        }
      } else if (age < 18) {
        alert('18 yaşından küçük kullanıcılar kayıt olamaz. Lütfen doğum tarihinizi kontrol edin.');
        setIsSubmitting(false);
        return;
      }
    }
    
    const result = await register(values);
    if (result) {
      setTimeout(() => {
        goTo('/login');
      }, 2000);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3"></div>
          <span className="text-2xl font-bold text-gray-800">Authentication System</span>
        </div>
      </motion.div>

      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Kayıt Ol</h1>
        <p className="text-gray-600">Hesabınızı oluşturun</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Ad ve Soyad - Yan yana */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div>
            <Input
              type="text"
              name="first_name"
              placeholder="Ad"
              value={values.first_name}
              onChange={handleChange}
              required
              disabled={isLoading || isSubmitting}
              autoComplete="given-name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
          <motion.div>
            <Input
              type="text"
              name="last_name"
              placeholder="Soyad"
              value={values.last_name}
              onChange={handleChange}
              required
              disabled={isLoading || isSubmitting}
              autoComplete="family-name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Email Input */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            type="email"
            name="email"
            placeholder="E-posta adresi"
            value={values.email}
            onChange={handleChange}
            required
            disabled={isLoading || isSubmitting}
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        {/* Password Input */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            type="password"
            name="password"
            placeholder="Şifre"
            value={values.password}
            onChange={handleChange}
            required
            disabled={isLoading || isSubmitting}
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        {/* Doğum Tarihi ve Ülke - Yan yana */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div>
            <Input
              type="date"
              name="birth_date"
              placeholder="Doğum Tarihi"
              value={values.birth_date}
              onChange={handleChange}
              disabled={isLoading || isSubmitting}
              autoComplete="bday"
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
          <motion.div>
            <Input
              type="text"
              name="country"
              placeholder="Ülke"
              value={values.country}
              onChange={handleChange}
              disabled={isLoading || isSubmitting}
              autoComplete="country"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
        </div>

        {/* Kayıt Ol Butonu */}
        <motion.div>
          <Button
            type="submit"
            variant="register"
            disabled={isLoading || isSubmitting}
            className="w-full py-3 rounded-lg font-medium transition-all duration-200"
          >
            {isLoading || isSubmitting ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </Button>
        </motion.div>
      </motion.form>

      {/* Giriş Yap Linki */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-8"
      >
        <p className="text-gray-600">
          Zaten hesabın var mı?{' '}
          <button
            onClick={() => goTo('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Giriş yap
          </button>
        </p>
      </motion.div>

      {/* Mesaj */}
      <Message message={message} />
    </div>
  );
}
