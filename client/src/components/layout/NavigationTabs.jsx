import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavigationTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAuthPage = !location.pathname.includes('forgot-password') && 
                     !location.pathname.includes('reset-password');

  if (!isAuthPage) return null;

  return (
    <div className="flex mb-6">
      <button
        onClick={() => navigate('/login')}
        className={`flex-1 py-2 px-4 rounded-l-md transition ${
          location.pathname === '/login'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Giriş Yap
      </button>
      <button
        onClick={() => navigate('/register')}
        className={`flex-1 py-2 px-4 rounded-r-md transition ${
          location.pathname === '/register'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Kayıt Ol
      </button>
    </div>
  );
}
