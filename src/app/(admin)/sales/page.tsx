'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  Search,
  Filter,
  Receipt,
  RotateCcw,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';

export default function SalesHistoryPage() {
  const { t, currentBranchId } = useApp();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeSale, setActiveSale] = useState<any>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('Customer exchange / return');
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/sales?branchId=${currentBranchId}&query=${query}&status=${selectedStatus}`)
      .then((res) => res.json())
      .then((data) => {
        setSales(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentBranchId, query, selectedStatus]);

  const handleRefund = async () => {
    if (!activeSale) return;
    setRefunding(true);

    try {
      const refundItems = activeSale.items.map((i: any) => ({
        saleItemId: i.id,
        variantId: i.variantId,
        quantity: i.quantity,
        refundAmount: i.totalAmount,
        restock: true,
      }));

      const res = await fetch('/api/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saleId: activeSale.id,
          items: refundItems,
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`Refund processed! Code: ${data.refund.refundNumber}. Goods restocked.`);
      setShowRefundModal(false);
      setActiveSale(null);

      // Refresh sales
      fetch(`/api/sales?branchId=${currentBranchId}`)
        .then((res) => res.json())
        .then((d) => setSales(d || []));
    } catch (err: any) {
      alert(`Refund error: ${err.message}`);
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('salesHistory')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of completed customer sales, tender types, and processed refunds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search receipt # or customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Receipt #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No sales transactions found.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-600">
                      {sale.saleNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(sale.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {sale.branch?.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {sale.customer ? sale.customer.fullName : 'Guest'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {sale.items.length} items
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {sale.payments[0]?.method || 'CASH'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sale.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setActiveSale(sale)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Detail / Refund Modal */}
      {activeSale && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Sale Receipt: {activeSale.saleNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeSale.branch?.name} • {formatDate(activeSale.createdAt)}
                </p>
              </div>
              <button onClick={() => setActiveSale(null)} className="p-1 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Line Items */}
            <div className="mt-4 divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {activeSale.items.map((item: any) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">
                      {item.variant.product.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.variant.size} / {item.variant.color} • {item.quantity} x {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatCurrency(item.totalAmount)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(activeSale.subtotal)}</span>
              </div>
              {Number(activeSale.discountTotal) > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(activeSale.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t">
                <span>Total Amount:</span>
                <span>{formatCurrency(activeSale.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Gross Profit from transaction:</span>
                <span className="text-emerald-600 font-semibold">{formatCurrency(activeSale.grossProfit)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex gap-2">
              {activeSale.status === 'COMPLETED' && (
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={15} />
                  <span>Process Refund & Restock</span>
                </button>
              )}
              <button
                onClick={() => setActiveSale(null)}
                className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundModal && activeSale && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Confirm Customer Return & Refund</h3>
            <p className="text-xs text-slate-500 mt-1">
              Refund total <span className="font-bold text-rose-600">{formatCurrency(activeSale.totalAmount)}</span> to customer.
              Inventory will be automatically restocked into warehouse ledger.
            </p>

            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-700">Reason for Return</label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 py-2 border rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                {refunding ? 'Processing...' : 'Authorize Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
