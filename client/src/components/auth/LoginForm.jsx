import React from 'react';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { FormSkeleton } from '../shared/Skeleton';
import Message from '../shared/Message';
import { auth, googleProvider, signInWithPopup } from '../../config/firebase';

export default function LoginForm({ onForgotPassword }) {
  const { message, login, isLoading, isAuthenticated, checkAuthStatus } = useAuth();
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

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      console.log('Google login başlatılıyor...');
      
      // Firebase auth durumunu kontrol et
      if (!auth || !googleProvider) {
        throw new Error('Firebase Authentication yapılandırması eksik');
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Google login başarılı:', {
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      });
      
      // Google ID token'ı al
      const idToken = await user.getIdToken();
      console.log('ID Token alındı');
      
      // Backend'e Google token'ı gönder
      const response = await fetch('http://localhost:3001/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          photoURL: user.photoURL
        }),
      });

      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success) {
        // Token'ları localStorage'a kaydet
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Giriş başarılı, AuthContext güncelleniyor...');
        
        // AuthContext'i güncelle - checkAuthStatus çağır
        checkAuthStatus();
        
        console.log('Dashboard\'a yönlendiriliyor');
        // Dashboard'a yönlendir
        goTo('/dashboard', { replace: true });
      } else {
        console.error('Google login failed:', data.message);
        alert('Giriş başarısız: ' + data.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      
      // Hata türüne göre daha detaylı mesaj
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup kullanıcı tarafından kapatıldı');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup engellendi. Lütfen popup engelleyiciyi devre dışı bırakın.');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('Bu domain Firebase\'de yetkilendirilmemiş. Firebase Console\'da authorized domains\'e ekleyin.');
      } else if (error.code === 'auth/configuration-not-found') {
        alert('Firebase Authentication yapılandırması bulunamadı. Firebase Console\'da Authentication\'ı etkinleştirin.');
      } else if (error.code === 'auth/operation-not-allowed') {
        alert('Google Sign-In provider Firebase Console\'da etkinleştirilmemiş.');
      } else if (error.message?.includes('The requested action is invalid')) {
        alert('Firebase Console\'da Authentication > Sign-in method > Google provider\'ını etkinleştirin.');
      } else {
        alert('Google ile giriş hatası: ' + (error.message || error.code));
      }
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Google ile Giriş Butonu */}
        <motion.div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            disabled={isLoading || isSubmitting}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile giriş yap
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
