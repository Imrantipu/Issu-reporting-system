import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  'in-progress': 'bg-cyan-50 text-cyan-700',
  working: 'bg-cyan-50 text-cyan-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-slate-100 text-slate-700',
  rejected: 'bg-rose-50 text-rose-700',
};

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In-Progress',
  working: 'Working',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
};

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['issue', id],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const res = await apiClient.get(`/issues/${id}`);
      return res.data;
    },
  });

  const issue = useMemo(() => {
    if (!data) return null;
    return {
      id: data._id,
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      priority: data.priority,
      location: data.location,
      image: data.imageUrl,
      upvotes: data.upvotes?.length || 0,
      createdBy: data.createdBy,
      assignedStaff: data.assignedStaff,
      timeline: data.timeline || [],
      isBoosted: data.isBoosted,
    };
  }, [data]);

  const sortedTimeline = useMemo(() => {
    if (!issue?.timeline) return [];
    return [...issue.timeline].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [issue]);

  const isOwner = issue && user?.email && issue.createdBy?.email === user.email;
  const isPending = issue?.status === 'pending';
  const isBoosted = issue?.priority === 'high' || issue?.isBoosted;

  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`/issues/${id}/upvote`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Upvote added successfully!');
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Upvote failed';
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete(`/issues/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Issue deleted successfully!');
      navigate('/all-issues');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Delete failed';
      toast.error(msg);
    },
  });

  const boostMutation = useMutation({
    mutationFn: async () => {
      // Starts the boost payment intent; full Stripe flow still needed to confirm.
      const res = await apiClient.post('/payments/boost-intent', { issueId: id });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Boost payment initiated! Complete payment to apply priority.');
      // TODO: Open Stripe payment modal here
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Boost failed';
      toast.error(msg);
    },
  });

  const handleUpvote = () => {
    if (!user) {
      toast.error('Please login to upvote');
      navigate('/login', { state: location?.pathname || '/' });
      return;
    }
    if (isOwner) {
      toast.error('You cannot upvote your own issue');
      return;
    }
    upvoteMutation.mutate();
  };

  const handleBoost = () => {
    if (!user) {
      toast.error('Please login to boost priority');
      navigate('/login', { state: location?.pathname || '/' });
      return;
    }
    if (isBoosted) {
      toast.info('This issue is already boosted');
      return;
    }
    boostMutation.mutate();
  };

  const handleDelete = () => {
    if (!isOwner) {
      toast.error('Only the reporter can delete this issue');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteMutation.mutate();
  };

  const handleEdit = () => {
    // TODO: Implement edit modal or navigate to edit page
    toast.info('Edit functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-dots loading-lg text-cyan-600" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          Failed to load issue: {error?.response?.data?.message || error?.message}
        </div>
      )}

      {!isLoading && issue && (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="eyebrow">Issue details</span>
              <h1 className="text-3xl font-bold text-slate-900">{issue.title}</h1>
              <div className="flex flex-wrap gap-2 text-sm font-semibold">
                <span className={`rounded-full px-3 py-1 ${statusStyles[issue.status] || 'bg-slate-100 text-slate-700'}`}>
                  {statusLabels[issue.status] || issue.status}
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-white">{issue.category}</span>
                <span className={`rounded-full px-3 py-1 ${issue.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-slate-100 text-slate-800'}`}>
                  {issue.priority === 'high' ? 'High (Boosted)' : 'Normal'}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isOwner && isPending && (
                <button onClick={handleEdit} className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100">
                  Edit issue
                </button>
              )}
              {isOwner && (
                <button onClick={handleDelete} className="rounded-full border border-rose-100 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-100">
                  Delete
                </button>
              )}
              {!isBoosted && (
                <button
                  onClick={handleBoost}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Boost priority (100tk)
                </button>
              )}
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="mx-4 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-slate-900">Delete Issue?</h3>
                <p className="mt-2 text-slate-600">
                  Are you sure you want to delete this issue? This action cannot be undone.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="glass-panel overflow-hidden rounded-3xl border border-slate-100/70 bg-white/85 shadow-2xl shadow-cyan-200/40">
              <div className="h-64 w-full overflow-hidden">
                <img src={issue.image || 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&auto=format&fit=crop'} alt={issue.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4 p-6">
                <p className="text-slate-700">{issue.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {issue.location}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                    Reporter: {issue.createdBy?.name || issue.createdBy?.email}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Upvotes: {issue.upvotes}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpvote}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
                  >
                    <span aria-hidden>⬆</span>
                    Upvote
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-white">{issue.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-5 shadow-xl shadow-cyan-200/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Assigned staff</p>
                    <p className="text-lg font-semibold text-slate-900">{issue.assignedStaff?.name || 'Not assigned'}</p>
                  </div>
                  {issue.assignedStaff && (
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-slate-100">
                      <img src={issue.assignedStaff.photoUrl || 'https://i.ibb.co/L8Gj18j/user-placeholder.jpg'} alt={issue.assignedStaff.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
                {issue.assignedStaff && (
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>Email: {issue.assignedStaff.email}</p>
                    {issue.assignedStaff.phone && <p>Phone: {issue.assignedStaff.phone}</p>}
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-5 shadow-xl shadow-cyan-200/40">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900">Timeline</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Read-only history</p>
                </div>
                <div className="mt-4 space-y-4">
                  {sortedTimeline.length === 0 && <p className="text-sm text-slate-500">No updates yet.</p>}
                  {sortedTimeline.map((item, idx) => (
                    <div key={`${item.createdAt || idx}`} className="flex items-start gap-3">
                      <div className="mt-1 h-3 w-3 rounded-full bg-cyan-500" />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                          <span className={`rounded-full px-2 py-1 ${statusStyles[item.status] || 'bg-slate-100 text-slate-700'}`}>{statusLabels[item.status] || item.status}</span>
                          <span>{item.updatedByRole || 'Unknown'}</span>
                          {item.updatedBy?.name || item.updatedBy?.email ? (
                            <span className="text-slate-500">{item.updatedBy?.name || item.updatedBy?.email}</span>
                          ) : null}
                          <span className="text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</span>
                        </div>
                        <p className="text-sm text-slate-700">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/all-issues" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100">
              Back to All Issues
            </Link>
            <Link to="/" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-200/60">
              Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default IssueDetails;
