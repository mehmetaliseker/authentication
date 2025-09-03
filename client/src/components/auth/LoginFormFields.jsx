import React from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function LoginFormFields({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
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
      />

      <Input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
      </Button>
    </form>
  );
}
