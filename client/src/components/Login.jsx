import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { message, login, isLoading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

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
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
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
        <p className={`text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
