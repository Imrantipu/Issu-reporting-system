import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const StaffProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ['staff-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me');
      return res.data;
    },
    enabled: !!user,
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.patch('/users/me', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['staff-profile'] });
      setIsEditing(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Update failed';
      toast.error(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

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
        <span className="eyebrow">Profile</span>
        <h1 className="text-3xl font-bold text-slate-900">Your Staff Profile</h1>
        <p className="text-slate-600">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="glass-panel overflow-hidden rounded-3xl border border-slate-100/70 bg-white/85 shadow-xl shadow-cyan-200/40">
        <div className="h-24 bg-gradient-to-r from-cyan-500 to-emerald-500" />
        <div className="relative px-6 pb-6">
          <div className="absolute -top-12 flex items-end gap-4">
            <img
              src={user?.photoURL || 'https://i.ibb.co/L8Gj18j/user-placeholder.jpg'}
              alt="Profile"
              className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg"
            />
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{dbUser?.name || user?.displayName || 'Staff'}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  <Briefcase className="h-3 w-3" />
                  Staff
                </span>
              </div>
              <p className="text-sm text-slate-600">{dbUser?.role || 'Staff Member'}</p>
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="rounded-lg bg-cyan-100 p-2">
                  <Mail className="h-5 w-5 text-cyan-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">{dbUser?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <Phone className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-900">{dbUser?.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 md:col-span-2">
                <div className="rounded-lg bg-amber-100 p-2">
                  <MapPin className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Address</p>
                  <p className="font-semibold text-slate-900">{dbUser?.address || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-6 shadow-xl shadow-cyan-200/40">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Update Information</h3>
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
                  placeholder="Enter your full name"
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

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  placeholder="Enter your full address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateMutation.isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffProfile;
