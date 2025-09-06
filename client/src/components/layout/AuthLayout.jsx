import React from 'react';
import { Outlet } from 'react-router-dom';
import ApiStatus from './ApiStatus';

export default function AuthLayout() {
  return (
    <>
      <ApiStatus />
      <Outlet />
    </>
  );
}
