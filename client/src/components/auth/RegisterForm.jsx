import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const { message, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    // Kayıt başarılı olduğunda login sayfasına yönlendir
    if (result) {
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 saniye sonra login sayfasına yönlendir
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">Kayıt Ol</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="Ad"
          value={formData.first_name}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="given-name"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Soyad"
          value={formData.last_name}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="family-name"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="email"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="new-password"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Kayıt Oluşturuluyor...' : 'Kayıt Ol'}
        </button>
      </form>

      {message && (
        <div className="text-center">
          <p className={`text-sm ${
            message.includes('✅') ? 'text-green-600' : 'text-red-500'
          }`}>
            {message}
          </p>
          {message.includes('✅') && (
            <p className="text-xs text-gray-500 mt-1">
              Login sayfasına yönlendiriliyorsunuz...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
