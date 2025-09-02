import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';


export default function LoginForm({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { message, login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result) {
      navigate('/dashboard', { replace: true });
    }
  };

  // Kullanıcı zaten giriş yaptıysa dashboard'a yönlendir
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }


  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Giriş Yap</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="current-password"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <button
        onClick={onForgotPassword}
        className="text-blue-500 hover:text-blue-700 text-center text-sm"
      >
        Şifremi unuttum
      </button>

      {message && (
        <div className="text-center">
          <p
            className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-500'
              }`}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
