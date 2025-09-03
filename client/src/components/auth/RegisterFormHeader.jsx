import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';

export default function RegisterFormHeader() {
  const navigate = useNavigate();
  
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Kayıt Ol</h2>
      
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/login')}
          variant="primary"
          size="lg"
        >
          Giriş Yap
        </Button>
      </div>
    </>
  );
}
