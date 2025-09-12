import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { FormSkeleton } from '../shared/Skeleton';
import Message from '../shared/Message';

export default function ForgotPasswordForm({ onBack, onResetPassword }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <FormSkeleton />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Şifre sıfırlama linki email adresinize gönderildi');
        if (data.token) {
          onResetPassword(data.token);
        }
      } else {
        setMessage(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      setMessage('❌ Sunucuya bağlanılamadı');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mr-3"></div>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Şifremi Unuttum</h1>
        <p className="text-gray-600">E-posta adresinizi girin, size şifre sıfırlama linki gönderelim</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Email Input */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            type="email"
            placeholder="E-posta adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        {/* Gönder Butonu */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
          >
            {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
          </Button>
        </motion.div>
      </motion.form>

      {/* Geri Dön Linki */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-8"
      >
        <button
          onClick={onBack}
          className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
        >
          ← Geri Dön
        </button>
      </motion.div>

      {/* Mesaj */}
      <Message message={message} />
    </div>
  );
}
