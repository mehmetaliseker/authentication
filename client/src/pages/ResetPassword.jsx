import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <ResetPasswordForm
      token={token}
      onSuccess={handleSuccess}
      onBack={handleBack}
    />
  );
}