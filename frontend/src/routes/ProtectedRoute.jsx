// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) {
//     return <Navigate to="/" />;
//   }
//   return children;
// };

// export default ProtectedRoute;
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function RequireRole({ children, roles }) {
  const role = useSelector(state => state.auth.role);
  if (!roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

// Usage:
<Route path="/admin-dashboard" element={
  <RequireRole roles={['Admin']}>
    <AdminDashboard />
  </RequireRole>
} />
