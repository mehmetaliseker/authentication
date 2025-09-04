import React from 'react';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import RegisterFormHeader from './RegisterFormHeader';
import RegisterFormFields from './RegisterFormFields';
import RegisterFormFooter from './RegisterFormFooter';

export default function RegisterForm() {
  const { message, register, isLoading } = useAuth();
  const { goTo } = useNavigation();
  const { values, handleChange, isSubmitting, setIsSubmitting } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await register(values);
    if (result) {
      setTimeout(() => {
        goTo('/login');
      }, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <RegisterFormHeader />
      
      <RegisterFormFields
        formData={values}
        handleChange={handleChange}
        isLoading={isLoading || isSubmitting}
        onSubmit={handleSubmit}
      />
      
      <RegisterFormFooter message={message} />
    </div>
  );
}
