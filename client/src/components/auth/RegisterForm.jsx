import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegisterFormHeader from './RegisterFormHeader';
import RegisterFormFields from './RegisterFormFields';
import RegisterFormFooter from './RegisterFormFooter';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const { message, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    if (result) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <RegisterFormHeader />
      
      <RegisterFormFields
        formData={formData}
        handleChange={handleChange}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
      
      <RegisterFormFooter message={message} />
    </div>
  );
}
