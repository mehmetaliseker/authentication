import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Hoşgeldin, {user?.first_name} {user?.last_name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.email}</p>
              <p className="text-xs text-gray-500">Giriş yapıldı</p>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
