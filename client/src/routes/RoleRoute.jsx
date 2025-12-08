import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import apiClient from '../lib/apiClient';

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading: authLoading } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          // Fetch user from database to get role
          const response = await apiClient.get('/users/me');
          setDbUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUser();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="loading loading-dots loading-lg text-cyan-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={location?.pathname || '/'} replace />;
  }

  // Check if user's role is allowed
  if (dbUser && allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPaths = {
      admin: '/dashboard/admin',
      staff: '/dashboard/staff',
      citizen: '/dashboard/citizen',
    };
    return <Navigate to={dashboardPaths[dbUser.role] || '/'} replace />;
  }

  return children;
};

export default RoleRoute;
