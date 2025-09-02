import React from 'react';
import UserInfo from '../components/dashboard/UserInfo';
import LogoutSection from '../components/dashboard/LogoutSection';

function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Hesap bilgilerinizi görüntüleyin ve güvenlik ayarlarınızı yönetin.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserInfo />
        <LogoutSection />
      </div>
    </div>
  );
}

export default Dashboard;