import React from 'react';
import { useNavigation } from '../../hooks/useAuth';
import Button from '../shared/Button';

export default function LoginFormHeader() {
  const { goTo } = useNavigation();
  
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Giriş Yap</h2>
      
      <div className="flex justify-center">
        <Button
          onClick={() => goTo('/register')}
          variant="register"
          size="lg"
        >
          Kayıt Ol
        </Button>
      </div>
    </>
  );
}
