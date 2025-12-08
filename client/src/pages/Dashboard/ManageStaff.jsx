import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const ManageStaff = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['all-staff'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users');
      return res.data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/create-staff', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Staff account created successfully!');
      queryClient.invalidateQueries({ queryKey: ['all-staff'] });
      setShowCreateForm(false);
      setFormData({ name: '', email: '', password: '', phone: '' });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Failed to create staff account';
      toast.error(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }
    createMutation.mutate(formData);
  };

  const staffList = (data || []).filter((u) => u.role === 'staff');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="eyebrow">Manage Staff</span>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Staff Accounts</h1>
            <p className="text-slate-600">Create and manage staff members</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <UserPlus className="h-4 w-4" />
            Create Staff Account
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-6 shadow-xl shadow-cyan-200/40">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Create New Staff Account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="Enter staff name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="e.g., +880 1234567890"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="staff@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {createMutation.isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-dots loading-lg text-cyan-600" />
        </div>
      ) : staffList.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-10 text-center shadow-xl shadow-cyan-200/40">
          <p className="text-lg font-semibold text-slate-600">No staff accounts yet</p>
          <p className="mt-2 text-slate-500">Create staff accounts to assign issues</p>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{staff.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{staff.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{staff.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(staff.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
