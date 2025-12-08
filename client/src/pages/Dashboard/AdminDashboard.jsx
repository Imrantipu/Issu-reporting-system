import React from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';
import { FileText, Users, UserCog, DollarSign, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/stats');
      return res.data;
    },
    enabled: !!user,
  });

  const statCards = [
    {
      label: 'Total Issues',
      value: stats?.totalIssues || 0,
      icon: FileText,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Staff Members',
      value: stats?.totalStaff || 0,
      icon: UserCog,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Total Payments',
      value: `${stats?.totalPayments || 0} BDT`,
      icon: DollarSign,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
    {
      label: 'Resolved Issues',
      value: stats?.resolvedIssues || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Pending Issues',
      value: stats?.pendingIssues || 0,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  const latestIssues = stats?.latestIssues || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-dots loading-lg text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="eyebrow">Admin Dashboard</span>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Admin!</h1>
        <p className="text-slate-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="glass-panel overflow-hidden rounded-2xl border border-slate-100/70 bg-white/85 shadow-lg shadow-cyan-200/40 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`rounded-2xl ${card.bgColor} p-3`}>
                  <card.icon className={`h-8 w-8 ${card.textColor}`} />
                </div>
              </div>
            </div>
            <div className={`h-2 bg-gradient-to-r ${card.color}`} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-6 shadow-xl shadow-cyan-200/40">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/admin/all-issues"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
          >
            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-3 text-white shadow-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">All Issues</p>
              <p className="text-xs text-slate-600">Manage & assign</p>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/manage-users"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
          >
            <div className="rounded-xl bg-slate-900 p-3 text-white shadow-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Users</p>
              <p className="text-xs text-slate-600">Block/unblock</p>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/manage-staff"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
          >
            <div className="rounded-xl bg-amber-500 p-3 text-white shadow-lg">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Staff</p>
              <p className="text-xs text-slate-600">Create accounts</p>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/payments"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
          >
            <div className="rounded-xl bg-rose-500 p-3 text-white shadow-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Payments</p>
              <p className="text-xs text-slate-600">View history</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Latest Issues */}
      <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-6 shadow-xl shadow-cyan-200/40">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Latest Issues</h2>
          <Link
            to="/dashboard/admin/all-issues"
            className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800"
          >
            View all →
          </Link>
        </div>

        {latestIssues.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 font-semibold text-slate-600">No issues yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {latestIssues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{issue.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                        issue.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : issue.status === 'in-progress' || issue.status === 'working'
                          ? 'bg-cyan-50 text-cyan-700'
                          : issue.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                      {issue.category}
                    </span>
                    <span>By: {issue.createdBy?.name || issue.createdBy?.email}</span>
                    {issue.assignedStaff ? (
                      <span className="text-emerald-700">Assigned to: {issue.assignedStaff.name || issue.assignedStaff.email}</span>
                    ) : (
                      <span className="text-amber-700">Not assigned</span>
                    )}
                  </div>
                </div>
                <span className="text-cyan-700 opacity-0 transition group-hover:opacity-100">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
