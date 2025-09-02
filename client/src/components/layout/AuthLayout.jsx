import React from 'react';
import { Outlet } from 'react-router-dom';
import ApiStatus from './ApiStatus';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <ApiStatus />
        <Outlet />
      </div>
    </div>
  );
}
