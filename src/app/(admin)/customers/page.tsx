'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Users, Plus, Search, Award } from 'lucide-react';

export default function CustomersPage() {
  const { t } = useApp();
  const [customers, setCustomers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/customers?query=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data || []);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('customers')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">CRM database, purchase history, RFM segments, and loyalty reward points</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
            />
          </div>

          <button
            onClick={() => alert('New customer modal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
          >
            <Plus size={15} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Segment</th>
              <th className="px-4 py-3">Loyalty Points</th>
              <th className="px-4 py-3 text-right">Total Orders</th>
              <th className="px-4 py-3 text-right">Lifetime Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading customers...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No customers found.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{c.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.segment === 'VIP' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-indigo-600 font-bold">
                      <Award size={13} />
                      <span>{c.currentLoyaltyPoints} pts</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-slate-900">{formatCurrency(c.totalSpend)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
