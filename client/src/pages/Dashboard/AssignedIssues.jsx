import React, { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import { Eye, Edit } from 'lucide-react';

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In-Progress',
  working: 'Working',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
};

const AssignedIssues = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('All');
  const [updateModal, setUpdateModal] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', message: '' });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assigned-issues', statusFilter],
    queryFn: async () => {
      const params = {
        status: statusFilter !== 'All' ? statusFilter : undefined,
      };
      const res = await apiClient.get('/staff/assigned-issues', { params });
      return res.data;
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.patch(`/staff/issues/${id}/update-status`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Issue status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['assigned-issues'] });
      queryClient.invalidateQueries({ queryKey: ['staff-stats'] });
      setUpdateModal(null);
      setUpdateForm({ status: '', message: '' });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Update failed';
      toast.error(msg);
    },
  });

  const handleUpdateClick = (issue) => {
    setUpdateModal(issue);
    setUpdateForm({
      status: issue.status,
      message: '',
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateForm.message.trim()) {
      toast.error('Please provide an update message');
      return;
    }
    updateMutation.mutate({
      id: updateModal._id,
      data: updateForm,
    });
  };

  const issues = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="eyebrow">Assigned Issues</span>
        <h1 className="text-3xl font-bold text-slate-900">Your Assigned Issues</h1>
        <p className="text-slate-600">Manage and update status of issues assigned to you</p>
      </div>

      {/* Filter */}
      <div className="glass-panel rounded-2xl border border-slate-100/70 bg-white/85 p-4 shadow-lg shadow-cyan-200/40">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100 sm:w-64"
        >
          <option value="All">All status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="working">Working</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-dots loading-lg text-cyan-600" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          Failed to load issues: {error?.response?.data?.message || error?.message}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {issues.length === 0 ? (
            <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-10 text-center shadow-xl shadow-cyan-200/40">
              <p className="text-lg font-semibold text-slate-600">No assigned issues found</p>
              <p className="mt-2 text-slate-500">
                {statusFilter === 'All'
                  ? 'No issues have been assigned to you yet'
                  : `No ${statusFilter} issues found`}
              </p>
            </div>
          ) : (
            <div className="glass-panel overflow-hidden rounded-3xl border border-slate-100/70 bg-white/85 shadow-xl shadow-cyan-200/40">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Reporter</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {issues.map((issue) => (
                      <tr key={issue._id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{issue.title}</div>
                          {issue.priority === 'high' && (
                            <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                              High Priority
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                            {issue.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                              issue.status === 'resolved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : issue.status === 'in-progress' || issue.status === 'working'
                                ? 'bg-cyan-50 text-cyan-700'
                                : issue.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700'
                                : issue.status === 'closed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {statusLabels[issue.status] || issue.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {issue.createdBy?.name || issue.createdBy?.email || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{issue.location || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/issues/${issue._id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Link>
                            {issue.status !== 'closed' && (
                              <button
                                onClick={() => handleUpdateClick(issue)}
                                className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                              >
                                <Edit className="h-3 w-3" />
                                Update
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total Count */}
          {issues.length > 0 && (
            <div className="text-center text-sm text-slate-600">
              Showing {issues.length} issue{issues.length !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}

      {/* Update Status Modal */}
      {updateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Update Issue Status</h3>
            <p className="mt-1 text-sm text-slate-600">{updateModal.title}</p>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">New Status</label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="working">Working</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Update Message</label>
                <textarea
                  value={updateForm.message}
                  onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="Describe what action was taken..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUpdateModal(null)}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {updateMutation.isLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
