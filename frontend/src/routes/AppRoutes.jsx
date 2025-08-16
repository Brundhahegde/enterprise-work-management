import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthForm from '../features/auth/AuthForm';
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/dashboard" element={
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      }/>
    </Routes>
  );
}
