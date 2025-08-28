import React, { useState } from 'react';

export default function ForgotPassword({ onBack, onResetPassword }) {
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
        setMessage(`✅ ${data.message}`);
        // 2 saniye sonra reset password sayfasına yönlendir
        setTimeout(() => {
          onResetPassword(data.token);
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Bir hata oluştu'}`);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Şifre Sıfırlama</h2>
      <p className="text-center text-gray-600 text-sm">
        Email adresinizi girin, size şifre sıfırlama linki göndereceğiz.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
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
        ← Giriş sayfasına dön
      </button>

      {message && (
        <p className={`text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
