'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Tag, Plus, CheckCircle2, Gift } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function MarketingPage() {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('marketing')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Campaigns, percentage/fixed discounts, promo codes, and gift certificates</p>
        </div>
        <button
          onClick={() => alert('New promo campaign')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Plus size={15} />
          <span>New Promotion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">PERCENTAGE</span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Welcome 10% Discount</h3>
              <p className="text-xs text-slate-500">10% discount on entire cart for first-time shoppers</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded">WELCOME10</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Active Promotion</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">FIXED AMOUNT</span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Spring 50,000 UZS Off</h3>
              <p className="text-xs text-slate-500">50,000 UZS off when spending 400,000 UZS or more</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded">SPRING50</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Active Promotion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
