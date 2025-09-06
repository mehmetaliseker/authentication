import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import AnimatedPage from '../components/shared/AnimatedPage';
import LoginForm from '../components/auth/LoginForm';
import { pageConfigs } from '../config/pageConfigs';

export default function Login() {
  const { goTo } = useNavigation();

  const handleForgotPassword = () => {
    goTo('/forgot-password');
  };

  return (
    <AnimatedPage 
      backgroundGradient={pageConfigs.login.backgroundGradient}
      circles={pageConfigs.login.circles}
    >
      <LoginForm onForgotPassword={handleForgotPassword} />
    </AnimatedPage>
  );
}