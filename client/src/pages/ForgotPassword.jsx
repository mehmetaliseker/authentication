import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  const { goTo } = useNavigation();

  const handleBack = () => {
    goTo('/login');
  };

  const handleResetPassword = (token) => {
    goTo(`/reset-password/${token}`);
  };

  return (
    <ForgotPasswordForm 
      onBack={handleBack} 
      onResetPassword={handleResetPassword} 
    />
  );
}