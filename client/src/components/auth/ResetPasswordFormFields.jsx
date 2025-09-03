import React from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function ResetPasswordFormFields({ 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword, 
  isLoading, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        type="password"
        placeholder="Yeni Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Input
        type="password"
        placeholder="Şifre Tekrar"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? 'Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
      </Button>
    </form>
  );
}
