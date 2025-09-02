import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserInfo() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Kullanıcı bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Kullanıcı Bilgileri</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {user.first_name || 'Belirtilmemiş'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soyad
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {user.last_name || 'Belirtilmemiş'}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {user.email}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı ID
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md font-mono text-sm">
              {user.id}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Hesap Durumu</h3>
            <p className="text-sm text-green-600 mt-1">Aktif</p>
          </div>
          
          <div className="text-right">
            <h3 className="text-sm font-medium text-gray-700">Son Giriş</h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
