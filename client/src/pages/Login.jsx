import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  const { goTo } = useNavigation();

  const handleForgotPassword = () => {
    goTo('/forgot-password');
  };

  return <LoginForm onForgotPassword={handleForgotPassword} />;
}