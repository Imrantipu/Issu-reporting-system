import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In-Progress',
  working: 'Working',
  resolved: 'Resolved',
  closed: 'Closed',
  rejected: 'Rejected',
};

const badgeClasses = (type, value) => {
  if (type === 'status') {
    if (value === 'resolved') return 'bg-emerald-50 text-emerald-700';
    if (value === 'in-progress' || value === 'working') return 'bg-cyan-50 text-cyan-700';
    if (value === 'closed') return 'bg-slate-100 text-slate-700';
    if (value === 'rejected') return 'bg-rose-50 text-rose-700';
    return 'bg-amber-50 text-amber-700';
  }
  if (type === 'priority') {
    return value === 'high'
      ? 'bg-rose-50 text-rose-700 border border-rose-100'
      : 'bg-slate-900 text-white';
  }
  return '';
};

const AllIssues = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['issues', { searchTerm, categoryFilter, statusFilter, priorityFilter, page }],
    queryFn: async () => {
      const params = {
        q: searchTerm || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        priority: priorityFilter !== 'All' ? priorityFilter.toLowerCase() : undefined,
        page,
        limit,
      };
      const res = await apiClient.get('/issues', { params });
      return res.data;
    },
  });

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, statusFilter, priorityFilter]);

  const issues = useMemo(() => {
    const list = data?.data || [];
    return list.map((issue) => ({
      id: issue._id,
      title: issue.title,
      category: issue.category,
      status: issue.status,
      priority: issue.priority,
      location: issue.location,
      upvotes: issue.upvotes?.length || 0,
      createdBy: issue.createdBy,
      assignedStaff: issue.assignedStaff,
      image: issue.imageUrl,
      isBoosted: issue.isBoosted,
    }));
  }, [data]);

  const upvoteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.post(`/issues/${id}/upvote`);
      return res.data;
    },
    onSuccess: (_, id) => {
      toast.success('Upvote added successfully!');
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Upvote failed';
      toast.error(msg);
    },
  });

  const handleUpvote = (issue) => {
    // Redirect to login if not authenticated
    if (!user) {
      toast.error('Please login to upvote');
      navigate('/login', { state: `/issues/${issue.id}` });
      return;
    }

    // Prevent self-upvote
    if (issue.createdBy?._id === user.uid || issue.createdBy?.email === user.email) {
      toast.error('You cannot upvote your own issue');
      return;
    }

    upvoteMutation.mutate(issue.id);
  };

  const totalPages = Math.ceil((data?.total || 0) / limit);
  const showPagination = totalPages > 1;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="eyebrow">All issues</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Public issue board</h1>
            <p className="text-slate-600">Browse, search, and upvote issues that matter. Boosted (High) stay on top.</p>
          </div>
          <Link
            to="/dashboard/citizen/report-issue"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Report an issue
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="glass-panel grid gap-3 rounded-2xl border border-slate-100/70 bg-white/85 p-4 shadow-lg shadow-cyan-200/40 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Search by title, category, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
        >
          <option value="All">All categories</option>
          <option value="Road Safety">Road Safety</option>
          <option value="Lighting">Lighting</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Water">Water</option>
          <option value="Traffic">Traffic</option>
          <option value="Footpath">Footpath</option>
        </select>
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1 lg:grid-cols-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">All status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="working">Working</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-100"
          >
            <option value="All">All priority</option>
            <option value="High">High (Boosted)</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
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
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {issues.map((issue) => (
              <article
                key={issue.id}
                className="glass-panel group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100/70 bg-white/90 shadow-lg shadow-cyan-200/40 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={issue.image || 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop'}
                    alt={issue.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${badgeClasses('status', issue.status)}`}>
                      {statusLabels[issue.status] || issue.status}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${badgeClasses('priority', issue.priority)}`}>
                      {issue.priority === 'high' ? 'High (Boosted)' : 'Normal'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                      {issue.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">#{issue.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{issue.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {issue.location}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleUpvote(issue)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100"
                    >
                      <span aria-hidden>⬆</span>
                      Upvote
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-white">{issue.upvotes}</span>
                    </button>

                    <Link
                      to={`/issues/${issue.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:gap-3"
                    >
                      View details
                      <span aria-hidden>↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {issues.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              No issues match your filters yet.
            </div>
          )}

          {/* Pagination Controls */}
          {showPagination && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span aria-hidden>←</span>
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                        page === pageNum
                          ? 'bg-slate-900 text-white shadow-lg shadow-cyan-200/60'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <span aria-hidden>→</span>
              </button>
            </div>
          )}

          {/* Page Info */}
          {data?.total > 0 && (
            <div className="text-center text-sm text-slate-600">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total} issues
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllIssues;
