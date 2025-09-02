import React from 'react';

export default function SecurityInfo() {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h3 className="font-medium text-green-800">Güvenlik</h3>
      <p className="text-green-600 mt-2">
        Hesabınız güvenli bir şekilde korunuyor.<br/>
        JWT token ile kimlik doğrulaması aktif.
      </p>
    </div>
  );
}
