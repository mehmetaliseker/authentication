import React from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function RegisterFormFields({ 
  formData, 
  handleChange, 
  isLoading, 
  onSubmit 
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        name="first_name"
        placeholder="Ad"
        value={formData.first_name}
        onChange={handleChange}
        required
        disabled={isLoading}
        autoComplete="given-name"
      />

      <Input
        type="text"
        name="last_name"
        placeholder="Soyad"
        value={formData.last_name}
        onChange={handleChange}
        required
        disabled={isLoading}
        autoComplete="family-name"
      />

      <Input
        type="email"
        name="email"
        placeholder="E-posta"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        type="password"
        name="password"
        placeholder="Şifre"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? 'Kayıt Oluşturuluyor...' : 'Kayıt Ol'}
      </Button>
    </form>
  );
}
