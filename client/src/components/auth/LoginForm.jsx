import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useForm } from './hooks/useForm';
import { useNavigation } from '../shared/hooks/useNavigation';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { FormSkeleton } from '../shared/Skeleton';
import Message from '../shared/Message';

export default function LoginForm({ onForgotPassword }) {
  const { message, login, loginWithGoogle, isLoading, isAuthenticated } = useAuth();
  const { goTo } = useNavigation();
  const { values, handleChange, isSubmitting, setIsSubmitting } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(values.email, values.password);

    if (result) {
      goTo('/dashboard', { replace: true });
    }
    setIsSubmitting(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
          <div className="w-8 h-8 bg-purple-600 rounded-lg mr-3"></div>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Giriş Yap</h1>
        <p className="text-gray-600">Lütfen bilgilerinizi girin</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Email Input */}
        <p className='text-gray-600 text-md font-medium ml-2'>E-mail:</p>
        <motion.div>
          <Input
            type="email"
            placeholder="E-posta adresi"
            value={values.email}
            onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } })}
            required
            disabled={isLoading || isSubmitting}
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        {/* Password Input */}
        <p className='text-gray-600 text-md font-medium ml-2'>Şifre:</p>
        <motion.div>
          <Input
            type="password"
            placeholder="Şifre"
            value={values.password}
            onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
            required
            disabled={isLoading || isSubmitting}
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        {/* Şifremi Unuttum Linki */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200"
          >
            Şifremi unuttum
          </button>
        </div>



        {/* Giriş Yap Butonu */}
        <motion.div>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
          >
            {isLoading || isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </motion.div>

        {/* Google ve Firebase ile Giriş Butonları */}
        <motion.div className="grid grid-cols-2 gap-3 pb-3">
          {/* Google ile Giriş - Sadece Görsel */}
          <Button
            type="button"
            variant="secondary"
            disabled={true}
            className="bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium cursor-not-allowed opacity-60 transition-all duration-200 flex flex-col items-center justify-center gap-1"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-xs">Google ile Giriş</span>
          </Button>

          {/* Firebase ile Giriş - Çalışan */}
          <Button
            type="button"
            variant="secondary"
            onClick={loginWithGoogle}
            className="bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center gap-1"
            disabled={isLoading || isSubmitting}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#FFA611" d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14.03a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
            </svg>
            <span className="text-xs">{isLoading ? 'Giriş yapılıyor...' : 'Firebase ile Giriş'}</span>
          </Button>
        </motion.div>
      </motion.form>


      {/* Kayıt Ol Linki */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-8"
      >
        <p className="text-gray-600">
          Hesabın mı yok?{' '}
          <button
            onClick={() => goTo('/register')}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
          >
            Kayıt ol
          </button>
        </p>
      </motion.div>

      {/* Mesaj */}
      <Message message={message} />
    </div>
  );
}
