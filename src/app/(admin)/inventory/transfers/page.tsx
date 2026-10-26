'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/formatters';
import {
  ArrowLeftRight,
  Plus,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  Truck,
} from 'lucide-react';

export default function TransfersPage() {
  const { t, branches } = useApp();
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [sourceBranchId, setSourceBranchId] = useState('');
  const [destBranchId, setDestBranchId] = useState('');
  const [notes, setNotes] = useState('Weekly stock replenishment');

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = () => {
    setLoading(true);
    fetch('/api/transfers')
      .then((res) => res.json())
      .then((data) => {
        setTransfers(data || []);
        setLoading(false);
      });
  };

  const handleDispatch = async (transferId: string) => {
    if (!confirm('Dispatch transfer? Source warehouse stock will be decremented.')) return;
    const res = await fetch('/api/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DISPATCH', transferId }),
    });
    if (res.ok) {
      alert('Transfer marked as DISPATCHED.');
      loadTransfers();
    }
  };

  const handleReceive = async (transferId: string) => {
    if (!confirm('Confirm receipt of goods? Destination warehouse stock will be incremented.')) return;
    const res = await fetch('/api/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RECEIVE', transferId }),
    });
    if (res.ok) {
      alert('Transfer marked as RECEIVED.');
      loadTransfers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inter-Branch Stock Transfers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-controlled 3-stage transfer lifecycle: Draft → Dispatched → Received
          </p>
        </div>

        <button
          onClick={() => {
            if (branches.length >= 2) {
              setSourceBranchId(branches[0].id);
              setDestBranchId(branches[1].id);
              setShowNewModal(true);
            } else {
              alert('Need at least 2 branches to transfer stock.');
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Plus size={15} />
          <span>New Transfer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Transfer #</th>
                <th className="px-4 py-3">Source Branch</th>
                <th className="px-4 py-3">Destination Branch</th>
                <th className="px-4 py-3">Items Sent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-center">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading transfers...</td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No stock transfers found.</td>
                </tr>
              ) : (
                transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-600">{tr.transferNumber}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{tr.sourceBranch?.name}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{tr.destBranch?.name}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {tr.items.reduce((a: number, b: any) => a + b.quantitySent, 0)} units ({tr.items.length} lines)
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tr.status === 'RECEIVED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : tr.status === 'DISPATCHED'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(tr.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      {tr.status === 'DRAFT' && (
                        <button
                          onClick={() => handleDispatch(tr.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                        >
                          Dispatch →
                        </button>
                      )}
                      {tr.status === 'DISPATCHED' && (
                        <button
                          onClick={() => handleReceive(tr.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Confirm Receipt ✓
                        </button>
                      )}
                      {tr.status === 'RECEIVED' && (
                        <span className="text-[11px] font-semibold text-slate-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
