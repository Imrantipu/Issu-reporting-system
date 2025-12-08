import React from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';
import { FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['staff-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/staff/stats');
      return res.data;
    },
    enabled: !!user,
  });

  const { data: issuesData } = useQuery({
    queryKey: ['staff-recent-issues'],
    queryFn: async () => {
      const res = await apiClient.get('/staff/assigned-issues', { params: { limit: 5 } });
      return res.data;
    },
    enabled: !!user,
  });

  const recentIssues = issuesData?.data || [];

  const statCards = [
    {
      label: 'Assigned Issues',
      value: stats?.assignedIssuesCount || 0,
      icon: FileText,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
    {
      label: 'Resolved',
      value: stats?.resolvedIssuesCount || 0,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'In Progress',
      value: stats?.inProgressIssuesCount || 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Pending',
      value: stats?.pendingIssuesCount || 0,
      icon: TrendingUp,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
  ];

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
        <span className="eyebrow">Staff Dashboard</span>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.displayName || 'Staff'}!</h1>
        <p className="text-slate-600">Manage and update assigned issues</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/dashboard/staff/assigned-issues"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
          >
            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-3 text-white shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Assigned Issues</p>
              <p className="text-sm text-slate-600">View and update</p>
            </div>
          </Link>

          <Link
            to="/all-issues"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
          >
            <div className="rounded-xl bg-slate-900 p-3 text-white shadow-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">All Issues</p>
              <p className="text-sm text-slate-600">Browse public board</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Assigned Issues */}
      <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-6 shadow-xl shadow-cyan-200/40">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Assignments</h2>
          <Link
            to="/dashboard/staff/assigned-issues"
            className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-800"
          >
            View all →
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 font-semibold text-slate-600">No assigned issues yet</p>
            <p className="text-sm text-slate-500">Issues will appear here when assigned by admin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
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
                    <span>{issue.location || 'No location'}</span>
                    {issue.priority === 'high' && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                        High Priority
                      </span>
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

export default StaffDashboard;
