import React from 'react';
import { useAuth, useForm, useNavigation } from '../../hooks/useAuth';
import LogoutSectionWarning from './LogoutSectionWarning';
import LogoutSectionButtons from './LogoutSectionButtons';

export default function LogoutSection() {
  const { logout, isLoading } = useAuth();
  const { goTo } = useNavigation();
  const { values, setValue } = useForm({ showConfirm: false });

  const handleLogout = async () => {
    await logout();
    goTo('/login');
  };

  const handleConfirmLogout = () => {
    setValue('showConfirm', true);
  };

  const handleCancelLogout = () => {
    setValue('showConfirm', false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Güvenlik</h2>
      
      <div className="space-y-4">
        <LogoutSectionWarning />
        
        <LogoutSectionButtons
          showConfirm={values.showConfirm}
          isLoading={isLoading}
          onConfirmLogout={handleConfirmLogout}
          onLogout={handleLogout}
          onCancelLogout={handleCancelLogout}
        />
      </div>
    </div>
  );
}
