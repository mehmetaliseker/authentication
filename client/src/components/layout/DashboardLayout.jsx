import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
