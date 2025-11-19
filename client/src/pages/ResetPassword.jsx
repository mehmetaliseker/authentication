import React from 'react';
import { useRouteParams } from '../components/shared/hooks/useRouteParams';
import { useNavigation } from '../components/shared/hooks/useNavigation';
import AnimatedPage from '../components/shared/AnimatedPage';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { pageConfigs } from '../config/pageConfigs';

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
    <AnimatedPage 
      backgroundGradient={pageConfigs.resetPassword.backgroundGradient}
      circles={pageConfigs.resetPassword.circles}
    >
      <ResetPasswordForm
        token={token}
        onSuccess={handleSuccess}
        onBack={handleBack}
      />
    </AnimatedPage>
  );
}