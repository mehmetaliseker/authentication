import React from 'react';
import { useRouteParams, useNavigation } from '../hooks/useAuth';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

export default function ResetPassword() {
  const { getParam } = useRouteParams();
  const { goTo } = useNavigation();
  const token = getParam('token');

  const handleSuccess = () => {
    goTo('/login');
  };

  const handleBack = () => {
    goTo('/login');
  };

  return (
    <ResetPasswordForm
      token={token}
      onSuccess={handleSuccess}
      onBack={handleBack}
    />
  );
}