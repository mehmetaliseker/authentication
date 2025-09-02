import React from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/login');
  };

  const handleResetPassword = (token) => {
    navigate(`/reset-password/${token}`);
  };

  return (
    <ForgotPasswordForm 
      onBack={handleBack} 
      onResetPassword={handleResetPassword} 
    />
  );
}