import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutContent from '../components/auth/LogoutContent';

export default function Logout() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return <LogoutContent onBackToLogin={handleBackToLogin} />;
}