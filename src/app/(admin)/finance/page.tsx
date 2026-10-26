'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function FinancePage() {
  const { t, currentBranchId, branches } = useApp();
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [branchId, setBranchId] = useState('');

  useEffect(() => {
    loadFinance();
  }, [currentBranchId]);

  const loadFinance = () => {
    setLoading(true);
    fetch(`/api/finance?branchId=${currentBranchId}`)
      .then((res) => res.json())
      .then((d) => {
        setFinanceData(d);
        if (d.categories?.length > 0 && !categoryId) {
          setCategoryId(d.categories[0].id);
        }
        if (branches.length > 0 && !branchId) {
          setBranchId(branches[0].id);
        }
        setLoading(false);
      });
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;
    await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branchId: branchId || branches[0]?.id,
        categoryId,
        amount: Number(amount),
        description: desc,
      }),
    });
    setShowExpenseModal(false);
    setAmount('');
    setDesc('');
    loadFinance();
  };

  if (loading || !financeData) return <div className="p-8 text-xs text-slate-400">Loading financial data...</div>;

  const { pl, expenses, categories } = financeData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('finance')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Profit & Loss statement, cost of goods sold (COGS), and operational expense ledger</p>
        </div>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Plus size={15} />
          <span>Record Expense</span>
        </button>
      </div>

      {/* P&L Statement Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">Profit & Loss (P&L) Statement</h2>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex justify-between font-semibold">
            <span>Gross Revenue (Sales):</span>
            <span className="font-bold text-slate-900">{formatCurrency(pl.revenue)}</span>
          </div>
          <div className="py-2.5 flex justify-between text-slate-600">
            <span>Cost of Goods Sold (COGS):</span>
            <span className="text-rose-600 font-semibold">-{formatCurrency(pl.cogs)}</span>
          </div>
          <div className="py-2.5 flex justify-between font-bold bg-emerald-50/50 px-2 rounded text-emerald-800">
            <span>Gross Profit:</span>
            <span>{formatCurrency(pl.grossProfit)} ({pl.grossMargin.toFixed(1)}%)</span>
          </div>
          <div className="py-2.5 flex justify-between text-slate-600">
            <span>Operating Expenses (Rent, Utilities, Staff):</span>
            <span className="text-rose-600 font-semibold">-{formatCurrency(pl.totalExpenses)}</span>
          </div>
          <div className="py-3 flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t-2">
            <span>Estimated Net Profit:</span>
            <span className={pl.netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}>
              {formatCurrency(pl.netProfit)} ({pl.netMargin.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800">
          Recorded Operational Expenses
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e: any) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">{formatDate(e.expenseDate)}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{e.category?.name}</td>
                <td className="px-4 py-3 text-slate-600">{e.branch?.name}</td>
                <td className="px-4 py-3 text-slate-600">{e.description}</td>
                <td className="px-4 py-3 text-slate-500">{e.paymentMethod}</td>
                <td className="px-4 py-3 text-right font-extrabold text-rose-600">{formatCurrency(e.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="bg-white p-5 rounded-2xl max-w-md w-full shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-slate-900">Record Operating Expense</h3>
            <div>
              <label className="text-xs font-semibold">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full mt-1 p-2 border rounded text-xs">
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold">Amount (UZS)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 p-2 border rounded text-xs font-bold" />
            </div>
            <div>
              <label className="text-xs font-semibold">Description</label>
              <input type="text" required placeholder="Reason, invoice #, payee..." value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full mt-1 p-2 border rounded text-xs" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 py-2 border rounded text-xs font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded text-xs font-bold">Save Expense</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
