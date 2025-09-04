import React from 'react';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoginFormHeader from './LoginFormHeader';
import LoginFormFields from './LoginFormFields';
import LoginFormFooter from './LoginFormFooter';

export default function LoginForm({ onForgotPassword }) {
  const { message, login, isLoading, isAuthenticated } = useAuth();
  const { goTo } = useNavigation();
  const { values, handleChange, isSubmitting, setIsSubmitting } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(values.email, values.password);

    if (result) {
      goTo('/dashboard', { replace: true });
    }
    setIsSubmitting(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col gap-4">
      <LoginFormHeader />
      
      <LoginFormFields
        email={values.email}
        setEmail={(value) => handleChange({ target: { name: 'email', value } })}
        password={values.password}
        setPassword={(value) => handleChange({ target: { name: 'password', value } })}
        isLoading={isLoading || isSubmitting}
        onSubmit={handleSubmit}
      />
      
      <LoginFormFooter
        onForgotPassword={onForgotPassword}
        message={message}
      />
    </div>
  );
}
