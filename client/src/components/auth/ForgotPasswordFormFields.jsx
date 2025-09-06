import React from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function ForgotPasswordFormFields({ 
  email, 
  setEmail, 
  isLoading, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
        autoComplete="email"
        className="w-full"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
      </Button>
    </form>
  );
}
