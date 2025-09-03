import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import LoginFormHeader from './LoginFormHeader';
import LoginFormFields from './LoginFormFields';
import LoginFormFooter from './LoginFormFooter';

export default function LoginForm({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { message, login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result) {
      navigate('/dashboard', { replace: true });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col gap-4">
      <LoginFormHeader />
      
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      
      <LoginFormFooter
        onForgotPassword={onForgotPassword}
        message={message}
      />
    </div>
  );
}
