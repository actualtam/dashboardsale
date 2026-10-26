'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { BarChart3, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('analytics')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive retail performance analytics and business intelligence reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Sales by Product Category', desc: 'Breakdown of revenue and gross margin by apparel, gadgets, cosmetics' },
          { title: 'Dead-Stock & Slow Movers', desc: 'Identifies inventory sitting unsold for over 60 days to plan markdowns' },
          { title: 'Cashier & Staff Sales Performance', desc: 'Volume and average ticket breakdown by shift and employee' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
            <p className="text-xs text-slate-500">{card.desc}</p>
            <button
              onClick={() => alert(`Generating ${card.title} report...`)}
              className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
            >
              Generate Report →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
