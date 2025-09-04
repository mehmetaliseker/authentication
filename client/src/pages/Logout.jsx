import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import LogoutContent from '../components/auth/LogoutContent';

export default function Logout() {
  const { goTo } = useNavigation();

  const handleBackToLogin = () => {
    goTo('/login');
  };

  return <LogoutContent onBackToLogin={handleBackToLogin} />;
}