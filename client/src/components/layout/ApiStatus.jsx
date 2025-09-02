import React, { useState } from 'react';

export default function ApiStatus() {
  const [apiStatus, setApiStatus] = useState('');

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      setApiStatus(`✅ API Çalışıyor! Status: ${data.status}`);
    } catch (error) {
      setApiStatus('❌ API Bağlantısı Başarısız');
    }
  };

  return (
    <div className="mb-6">
      {apiStatus && (
        <p className={`text-center text-sm ${
          apiStatus.includes('✅') ? 'text-green-600' : 'text-red-500'
        }`}>
          {apiStatus}
        </p>
      )}
    </div>
  );
}
