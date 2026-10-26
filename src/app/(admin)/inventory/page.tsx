'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import Link from 'next/link';
import {
  Warehouse,
  ArrowLeftRight,
  ClipboardCheck,
  AlertTriangle,
  History,
  Edit3,
  X,
  CheckCircle2,
  Search,
} from 'lucide-react';

export default function InventoryPage() {
  const { t, currentBranchId } = useApp();
  const [tab, setTab] = useState<'balances' | 'movements'>('balances');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeAdjustBalance, setActiveAdjustBalance] = useState<any>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Stock count discrepancy reconciliation');
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentBranchId, tab]);

  const loadData = () => {
    setLoading(true);
    fetch(`/api/inventory?branchId=${currentBranchId}&tab=${tab}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleAdjust = async () => {
    if (!activeAdjustBalance) return;
    setAdjusting(true);

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balanceId: activeAdjustBalance.id,
          newQuantity,
          reason: adjustReason,
        }),
      });

      if (!res.ok) throw new Error('Adjustment failed');

      alert('Stock balance updated and ledger movement logged.');
      setActiveAdjustBalance(null);
      loadData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setAdjusting(false);
    }
  };

  const filteredData = data.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (tab === 'balances') {
      return (
        item.variant?.product?.name?.toLowerCase().includes(q) ||
        item.variant?.sku?.toLowerCase().includes(q) ||
        item.warehouse?.name?.toLowerCase().includes(q)
      );
    } else {
      return (
        item.variant?.product?.name?.toLowerCase().includes(q) ||
        item.movementType?.toLowerCase().includes(q) ||
        item.reason?.toLowerCase().includes(q)
      );
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('inventory')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Double-entry inventory ledger, multi-warehouse stock balances, and discrepancy adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/inventory/transfers"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <ArrowLeftRight size={14} className="text-indigo-600" />
            <span>Transfers</span>
          </Link>
          <Link
            href="/inventory/stocktake"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <ClipboardCheck size={14} className="text-emerald-600" />
            <span>Stocktake</span>
          </Link>
        </div>
      </div>

      {/* Tab Switcher & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('balances')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'balances'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Warehouse Stock Balances
          </button>
          <button
            onClick={() => setTab('movements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'movements'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Ledger Movement History (Audit)
          </button>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter list..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'balances' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Product / Variant</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3">Cost Basis</th>
                  <th className="px-4 py-3">Retail Price</th>
                  <th className="px-4 py-3">Quantity on Hand</th>
                  <th className="px-4 py-3">Total Value</th>
                  <th className="px-4 py-3 text-center">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading stock...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">No stock records found.</td>
                  </tr>
                ) : (
                  filteredData.map((b) => {
                    const isLow = b.quantityOnHand <= b.variant.minStockAlert;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{b.variant.product.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {b.variant.size} • {b.variant.color}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                          {b.variant.sku}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {b.warehouse.name}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {formatCurrency(b.variant.costPrice)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {formatCurrency(b.variant.sellingPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isLow ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {b.quantityOnHand} units
                          </span>
                        </td>
                        <td className="px-4 py-3 font-extrabold text-slate-900">
                          {formatCurrency(b.quantityOnHand * Number(b.variant.costPrice))}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              setActiveAdjustBalance(b);
                              setNewQuantity(b.quantityOnHand);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            title="Adjust quantity"
                          >
                            <Edit3 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Product / SKU</th>
                  <th className="px-4 py-3">Warehouse</th>
                  <th className="px-4 py-3 text-right">Delta Qty</th>
                  <th className="px-4 py-3">Reason / Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading ledger...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No ledger movements found.</td>
                  </tr>
                ) : (
                  filteredData.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-slate-500">{formatDate(m.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            m.movementType === 'SALE'
                              ? 'bg-blue-50 text-blue-700'
                              : m.movementType === 'RETURN'
                              ? 'bg-emerald-50 text-emerald-700'
                              : m.movementType === 'PURCHASE_RECEIPT'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.movementType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{m.variant.product.name}</div>
                        <div className="text-[10px] text-slate-400">{m.variant.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{m.warehouse.name}</td>
                      <td className={`px-4 py-3 text-right font-black ${m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">{m.reason || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Adjust Modal */}
      {activeAdjustBalance && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Adjust Physical Stock</h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeAdjustBalance.variant.product.name} ({activeAdjustBalance.variant.size} / {activeAdjustBalance.variant.color})
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">New Physical Quantity</label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Audit Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setActiveAdjustBalance(null)}
                className="flex-1 py-2 border rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                disabled={adjusting}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                {adjusting ? 'Adjusting...' : 'Confirm & Log Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
