import React from 'react';
import AnimatedPage from '../components/shared/AnimatedPage';
import RegisterForm from '../components/auth/RegisterForm';
import { pageConfigs } from '../config/pageConfigs';

export default function Register() {
  return (
    <AnimatedPage 
      backgroundGradient={pageConfigs.register.backgroundGradient}
      circles={pageConfigs.register.circles}
    >
      <RegisterForm />
    </AnimatedPage>
  );
}