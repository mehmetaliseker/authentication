import React from 'react';
import { useNavigation } from '../../hooks/useAuth';
import Button from '../shared/Button';

export default function RegisterFormHeader() {
  const { goTo } = useNavigation();
  
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">Kayıt Ol</h2>
      
      <div className="flex justify-center">
        <Button
          onClick={() => goTo('/login')}
          variant="primary"
          size="lg"
        >
          Giriş Yap
        </Button>
      </div>
    </>
  );
}
