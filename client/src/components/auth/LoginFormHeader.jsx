import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';

export default function LoginFormHeader() {
  const navigate = useNavigate();
  
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Giriş Yap</h2>
      
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/register')}
          variant="primary"
          size="lg"
        >
          Kayıt Ol
        </Button>
      </div>
    </>
  );
}
