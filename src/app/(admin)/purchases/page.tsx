'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ShoppingBag, Plus, Truck, CheckCircle2 } from 'lucide-react';

export default function PurchasesPage() {
  const { t } = useApp();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/purchases')
      .then((res) => res.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('purchases')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage purchase orders, incoming stock deliveries, and supplier invoicing</p>
        </div>
        <button
          onClick={() => alert('New purchase order creator')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Plus size={15} />
          <span>New Purchase Order</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Warehouse</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expected Date</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-4 py-3 font-bold text-indigo-600">PO-2026-001</td>
              <td className="px-4 py-3 font-medium text-slate-800">Textile Distribution LLC</td>
              <td className="px-4 py-3 text-slate-600">Chilanzar Main Warehouse</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  RECEIVED
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{formatDate(new Date())}</td>
              <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(18500000)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
