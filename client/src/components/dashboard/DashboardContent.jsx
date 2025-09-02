import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AccountInfo from './AccountInfo';
import SecurityInfo from './SecurityInfo';

export default function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccountInfo user={user} />
        <SecurityInfo />
      </div>
    </div>
  );
}
