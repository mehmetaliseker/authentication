import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import AnimatedPage from '../components/shared/AnimatedPage';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { pageConfigs } from '../config/pageConfigs';

export default function ForgotPassword() {
  const { goTo } = useNavigation();

  const handleBack = () => {
    goTo('/login');
  };

  const handleResetPassword = (token) => {
    goTo(`/reset-password/${token}`);
  };

  return (
    <AnimatedPage 
      backgroundGradient={pageConfigs.forgotPassword.backgroundGradient}
      circles={pageConfigs.forgotPassword.circles}
    >
      <ForgotPasswordForm 
        onBack={handleBack} 
        onResetPassword={handleResetPassword} 
      />
    </AnimatedPage>
  );
}