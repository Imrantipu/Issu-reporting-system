import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import apiClient from '../lib/apiClient';
import { Home, FileText, PlusCircle, User, Users, Settings, LogOut, Menu, X, BarChart3, UserCog, DollarSign, Shield } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setDbUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUser();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (!dbUser) return [];

    const roleNavItems = {
      citizen: [
        { path: '/dashboard/citizen', icon: BarChart3, label: 'Dashboard' },
        { path: '/dashboard/citizen/my-issues', icon: FileText, label: 'My Issues' },
        { path: '/dashboard/citizen/report-issue', icon: PlusCircle, label: 'Report Issue' },
        { path: '/dashboard/citizen/profile', icon: User, label: 'Profile' },
      ],
      staff: [
        { path: '/dashboard/staff', icon: BarChart3, label: 'Dashboard' },
        { path: '/dashboard/staff/assigned-issues', icon: FileText, label: 'Assigned Issues' },
        { path: '/dashboard/staff/profile', icon: User, label: 'Profile' },
      ],
      admin: [
        { path: '/dashboard/admin', icon: BarChart3, label: 'Dashboard' },
        { path: '/dashboard/admin/all-issues', icon: FileText, label: 'All Issues' },
        { path: '/dashboard/admin/manage-users', icon: Users, label: 'Manage Users' },
        { path: '/dashboard/admin/manage-staff', icon: UserCog, label: 'Manage Staff' },
        { path: '/dashboard/admin/payments', icon: DollarSign, label: 'Payments' },
        { path: '/dashboard/admin/profile', icon: User, label: 'Profile' },
      ],
    };

    return roleNavItems[dbUser.role] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-dots loading-lg text-cyan-600" />
      </div>
    );
  }

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-cyan-600" />
              <span className="text-lg font-bold text-gray-800">PIRS</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring ring-cyan-200 ring-offset-2">
                  <img src={dbUser?.photoUrl || user?.photoURL || 'https://via.placeholder.com/40'} alt={dbUser?.name} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{dbUser?.name || 'User'}</p>
                <div className="flex items-center gap-1">
                  <span className={`badge badge-xs ${
                    dbUser?.role === 'admin' ? 'badge-error' :
                    dbUser?.role === 'staff' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {dbUser?.role}
                  </span>
                  {dbUser?.premium && (
                    <span className="badge badge-xs badge-accent">Premium</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Home Link */}
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-600" />
              <span className="font-bold text-gray-800">PIRS</span>
            </Link>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
