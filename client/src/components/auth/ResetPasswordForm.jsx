import React, { useState } from 'react';
import ResetPasswordFormHeader from './ResetPasswordFormHeader';
import ResetPasswordFormFields from './ResetPasswordFormFields';
import ResetPasswordFormFooter from './ResetPasswordFormFooter';

export default function ResetPasswordForm({ token, onSuccess, onBack }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('❌ Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:3001/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Şifreniz başarıyla sıfırlandı');
        setTimeout(() => onSuccess(), 2000);
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
      <ResetPasswordFormHeader />
      
      <ResetPasswordFormFields
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      
      <ResetPasswordFormFooter
        onBack={onBack}
        message={message}
      />
    </div>
  );
}
