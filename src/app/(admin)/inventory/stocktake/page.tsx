'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ClipboardCheck } from 'lucide-react';

export default function StocktakePage() {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('stocktake')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Conduct physical inventory audits, count variances, and generate automated reconciliation adjustments
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto">
        <ClipboardCheck size={40} className="text-indigo-600 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900">Start Physical Inventory Stock Count</h3>
        <p className="text-xs text-slate-500 mt-1">
          Lock or snapshot warehouse balances, scan physical items with wireless barcode scanners, and reconcile discrepancies.
        </p>
        <button
          onClick={() => alert('New physical stock count cycle initiated.')}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
        >
          Begin New Inventory Audit
        </button>
      </div>
    </div>
  );
}
