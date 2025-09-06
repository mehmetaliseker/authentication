import React from 'react';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import AnimatedForm from '../shared/AnimatedForm';
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
    password: '',
    birth_date: '',
    country: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Yaş kontrolü
    if (values.birth_date) {
      const birthDate = new Date(values.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // Henüz doğum günü gelmemiş
        const actualAge = age - 1;
        if (actualAge < 18) {
          alert('18 yaşından küçük kullanıcılar kayıt olamaz. Lütfen doğum tarihinizi kontrol edin.');
          setIsSubmitting(false);
          return;
        }
      } else if (age < 18) {
        alert('18 yaşından küçük kullanıcılar kayıt olamaz. Lütfen doğum tarihinizi kontrol edin.');
        setIsSubmitting(false);
        return;
      }
    }
    
    const result = await register(values);
    if (result) {
      setTimeout(() => {
        goTo('/login');
      }, 2000);
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatedForm>
      <RegisterFormHeader />
      <RegisterFormFields
        formData={values}
        handleChange={handleChange}
        isLoading={isLoading || isSubmitting}
        onSubmit={handleSubmit}
      />
      <RegisterFormFooter message={message} />
    </AnimatedForm>
  );
}
