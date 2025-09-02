import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutSection() {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleConfirmLogout = () => {
    setShowConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Güvenlik</h2>
      
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Çıkış Yap
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Hesabınızdan çıkış yapmak istediğinizden emin misiniz? 
                  Bu işlem sonrasında tekrar giriş yapmanız gerekecek.
                </p>
              </div>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <button
            onClick={handleConfirmLogout}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Çıkış Yap
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Çıkış yapmak istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Çıkış Yapılıyor...' : 'Evet, Çıkış Yap'}
              </button>
              <button
                onClick={handleCancelLogout}
                disabled={isLoading}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
