import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutSectionWarning from './LogoutSectionWarning';
import LogoutSectionButtons from './LogoutSectionButtons';

export default function LogoutSection() {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleConfirmLogout = () => {
    setShowConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Güvenlik</h2>
      
      <div className="space-y-4">
        <LogoutSectionWarning />
        
        <LogoutSectionButtons
          showConfirm={showConfirm}
          isLoading={isLoading}
          onConfirmLogout={handleConfirmLogout}
          onLogout={handleLogout}
          onCancelLogout={handleCancelLogout}
        />
      </div>
    </div>
  );
}
