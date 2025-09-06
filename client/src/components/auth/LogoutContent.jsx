import React from 'react';
import AnimatedForm from '../shared/AnimatedForm';

export default function LogoutContent({ onBackToLogin }) {
  return (
    <AnimatedForm>
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Çıkış Yapıldı</h2>
          <p className="text-gray-600">
            Başarıyla çıkış yaptınız. Güvenliğiniz için tüm oturum bilgileriniz temizlendi.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onBackToLogin}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Tekrar Giriş Yap
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Sayfayı Yenile
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Oturum bilgileriniz güvenli bir şekilde kaydedildi.</p>
        </div>
      </div>
    </AnimatedForm>
  );
}
