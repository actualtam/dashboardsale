'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ShoppingBag, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function OnlineOrdersPage() {
  const { t } = useApp();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []));
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    loadOrders();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('onlineOrders')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">E-commerce omnichannel orders, picking & packing, and delivery dispatch</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Update Pipeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-indigo-600">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{o.customerName}</div>
                  <div className="text-[11px] text-slate-400">{o.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{o.deliveryMethod} ({o.deliveryAddress || 'Pickup'})</td>
                <td className="px-4 py-3 font-semibold text-slate-700">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(o.totalAmount)}</td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="p-1 border rounded text-[11px]"
                  >
                    <option value="NEW">NEW</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
