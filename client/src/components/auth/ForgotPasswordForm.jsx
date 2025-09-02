import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordForm({ onBack, onResetPassword }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        // Development için token'ı kullan
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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Şifremi Unuttum</h2>

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

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
        </button>
      </form>

      <button
        onClick={onBack}
        className="text-blue-500 hover:text-blue-700 text-center text-sm"
      >
        Geri Dön
      </button>

      {message && (
        <p className={`text-center text-sm ${
          message.includes('✅') ? 'text-green-600' : 'text-red-500'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
