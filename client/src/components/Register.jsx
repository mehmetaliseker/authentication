import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { message, register, isLoading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ first_name: firstName, last_name: lastName, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Kayıt Ol</h2>

      <input
        type="text"
        placeholder="Ad"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        disabled={isLoading}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
      />

      <input
        type="text"
        placeholder="Soyad"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        disabled={isLoading}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
      />

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
        {isLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
      </button>

      {message && (
        <p className={`text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
