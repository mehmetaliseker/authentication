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
        className="w-full"
      />

      <Input
        type="password"
        placeholder="Şifre Tekrar"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
        autoComplete="new-password"
        className="w-full"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Sıfırlanıyor...' : 'Şifreyi Sıfırla'}
      </Button>
    </form>
  );
}
