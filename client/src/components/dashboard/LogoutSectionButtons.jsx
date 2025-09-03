import React from 'react';
import Button from '../shared/Button';

export default function LogoutSectionButtons({ 
  showConfirm, 
  isLoading, 
  onConfirmLogout, 
  onLogout, 
  onCancelLogout 
}) {
  if (!showConfirm) {
    return (
      <Button
        onClick={onConfirmLogout}
        variant="danger"
        disabled={isLoading}
        className="w-full"
      >
        Çıkış Yap
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 text-center">
        Çıkış yapmak istediğinizden emin misiniz?
      </p>
      <div className="flex gap-3">
        <Button
          onClick={onLogout}
          variant="danger"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Çıkış Yapılıyor...' : 'Evet, Çıkış Yap'}
        </Button>
        <Button
          onClick={onCancelLogout}
          variant="secondary"
          disabled={isLoading}
          className="flex-1"
        >
          İptal
        </Button>
      </div>
    </div>
  );
}
