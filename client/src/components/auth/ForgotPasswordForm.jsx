import React, { useState } from 'react';
import ForgotPasswordFormHeader from './ForgotPasswordFormHeader';
import ForgotPasswordFormFields from './ForgotPasswordFormFields';
import ForgotPasswordFormFooter from './ForgotPasswordFormFooter';

export default function ForgotPasswordForm({ onBack, onResetPassword }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Şifre sıfırlama linki email adresinize gönderildi');
        if (data.token) {
          onResetPassword(data.token);
        }
      } else {
        setMessage(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      setMessage('❌ Sunucuya bağlanılamadı');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ForgotPasswordFormHeader />
      
      <ForgotPasswordFormFields
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      
      <ForgotPasswordFormFooter
        onBack={onBack}
        message={message}
      />
    </div>
  );
}
