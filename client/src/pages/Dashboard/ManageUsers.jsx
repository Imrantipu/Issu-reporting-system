import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import { Ban, CheckCircle, Crown } from 'lucide-react';

const ManageUsers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [blockModal, setBlockModal] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users');
      return res.data;
    },
    enabled: !!user,
  });

  const blockMutation = useMutation({
    mutationFn: async ({ userId, blocked }) => {
      const res = await apiClient.patch(`/admin/users/${userId}`, { blocked });
      return res.data;
    },
    onSuccess: (_, { blocked }) => {
      toast.success(blocked ? 'User blocked successfully!' : 'User unblocked successfully!');
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      setBlockModal(null);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Action failed';
      toast.error(msg);
    },
  });

  const handleBlockClick = (user) => {
    setBlockModal(user);
  };

  const confirmBlock = (blocked) => {
    if (blockModal) {
      blockMutation.mutate({
        userId: blockModal._id,
        blocked,
      });
    }
  };

  const users = (data || []).filter((u) => u.role === 'citizen');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="eyebrow">Manage Users</span>
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-600">Block or unblock citizen accounts</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-dots loading-lg text-cyan-600" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          Failed to load users: {error?.response?.data?.message || error?.message}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {users.length === 0 ? (
            <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-10 text-center shadow-xl shadow-cyan-200/40">
              <p className="text-lg font-semibold text-slate-600">No users found</p>
            </div>
          ) : (
            <div className="glass-panel overflow-hidden rounded-3xl border border-slate-100/70 bg-white/85 shadow-xl shadow-cyan-200/40">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Subscription</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((citizen) => (
                      <tr key={citizen._id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{citizen.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{citizen.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{citizen.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {citizen.premium ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                              <Crown className="h-3 w-3" />
                              Premium
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600">Free</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {citizen.blocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                              <Ban className="h-3 w-3" />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(citizen.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleBlockClick(citizen)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                citizen.blocked
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              {citizen.blocked ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban className="h-3 w-3" />
                                  Block
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {users.length > 0 && (
            <div className="text-center text-sm text-slate-600">
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}

      {/* Block/Unblock Confirmation Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              {blockModal.blocked ? 'Unblock User?' : 'Block User?'}
            </h3>
            <p className="mt-2 text-slate-600">
              {blockModal.blocked
                ? `Are you sure you want to unblock "${blockModal.name || blockModal.email}"? They will be able to use the platform again.`
                : `Are you sure you want to block "${blockModal.name || blockModal.email}"? They will not be able to submit new issues or access their account.`}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setBlockModal(null)}
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmBlock(!blockModal.blocked)}
                disabled={blockMutation.isLoading}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
                  blockModal.blocked
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {blockMutation.isLoading ? 'Processing...' : blockModal.blocked ? 'Unblock User' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
