import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="loading loading-dots loading-lg text-cyan-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={location?.pathname || '/'} replace />;
  }

  return children;
};

export default PrivateRoute;
