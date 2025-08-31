import React, { useState, useEffect } from 'react';

export default function ResetPassword({ token, onSuccess, onBack }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`http://localhost:3001/auth/verify-reset-token/${token}`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setIsValidToken(true);
        setMessage('✅ Token geçerli. Yeni şifrenizi girin.');
      } else {
        setIsValidToken(false);
        setMessage('❌ Geçersiz veya süresi dolmuş token.');
      }
    } catch (error) {
      setIsValidToken(false);
      setMessage('❌ Token doğrulanamadı.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('❌ Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setMessage('❌ Şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:3001/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Şifreniz başarıyla sıfırlandı!');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Şifre sıfırlanamadı'}`);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('❌ Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Geçersiz Token</h2>
        <p className="text-center text-red-500">{message}</p>
        <button
          onClick={onBack}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Giriş sayfasına dön
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Yeni Şifre Belirleme</h2>
      <p className="text-center text-gray-600 text-sm">
        Yeni şifrenizi girin ve onaylayın.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Yeni Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Şifre Tekrar"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Şifre Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
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

