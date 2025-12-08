import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../lib/apiClient';

const Payments = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['all-payments'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/payments');
      return res.data;
    },
    enabled: !!user,
  });

  const payments = data || [];
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="eyebrow">Payments</span>
        <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
        <p className="text-slate-600">View all platform payments and revenue</p>
      </div>

      {/* Revenue Card */}
      <div className="glass-panel overflow-hidden rounded-3xl border border-slate-100/70 bg-white/85 shadow-xl shadow-cyan-200/40">
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-white">
          <p className="text-sm font-semibold opacity-90">Total Revenue (Completed)</p>
          <p className="mt-1 text-4xl font-bold">{totalRevenue.toLocaleString()} BDT</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-dots loading-lg text-cyan-600" />
        </div>
      ) : payments.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-100/70 bg-white/85 p-10 text-center shadow-xl shadow-cyan-200/40">
          <p className="text-lg font-semibold text-slate-600">No payments yet</p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-3xl border border-slate-100/70 bg-white/85 shadow-xl shadow-cyan-200/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {payment.user?.name || payment.user?.email || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {payment.type === 'subscription' ? 'Subscription' : 'Boost'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{payment.amount} BDT</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          payment.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : payment.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(payment.createdAt).toLocaleString()}
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

export default Payments;
