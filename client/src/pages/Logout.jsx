import React from 'react';
import { useNavigation } from '../hooks/useAuth';
import AnimatedPage from '../components/shared/AnimatedPage';
import LogoutContent from '../components/auth/LogoutContent';
import { pageConfigs } from '../config/pageConfigs';

export default function Logout() {
  const { goTo } = useNavigation();

  const handleBackToLogin = () => {
    goTo('/login');
  };

  return (
    <AnimatedPage 
      backgroundGradient={pageConfigs.logout.backgroundGradient}
      circles={pageConfigs.logout.circles}
    >
      <LogoutContent onBackToLogin={handleBackToLogin} />
    </AnimatedPage>
  );
}