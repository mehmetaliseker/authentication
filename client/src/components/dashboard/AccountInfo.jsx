import React from 'react';

export default function AccountInfo({ user }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="font-medium text-blue-800">Hesap Bilgileri</h3>
      <p className="text-blue-600 mt-2">
        Email: {user?.email}<br/>
        Ad: {user?.first_name}<br/>
        Soyad: {user?.last_name}<br/>
        Doğrulama: {user?.is_verified ? '✅ Doğrulanmış' : '❌ Doğrulanmamış'}
      </p>
    </div>
  );
}
