'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useApp();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('settings')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure business entity, Uzbekistan fiscal QQS tax rate, and receipt headers</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700">Business Legal Name</label>
          <input type="text" defaultValue="Tashkent Retail Hub LLC" className="w-full mt-1 p-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700">Tax Identification Number (INN)</label>
            <input type="text" defaultValue="308945201" className="w-full mt-1 p-2 border rounded font-mono" />
          </div>
          <div>
            <label className="font-semibold text-slate-700">QQS Tax Rate (%)</label>
            <input type="number" defaultValue="12" className="w-full mt-1 p-2 border rounded font-bold" />
          </div>
        </div>
        <div>
          <label className="font-semibold text-slate-700">Default Currency</label>
          <input type="text" disabled defaultValue="UZS (Uzbekistan Som)" className="w-full mt-1 p-2 border rounded bg-slate-50 font-bold" />
        </div>
        <div>
          <label className="font-semibold text-slate-700">Timezone</label>
          <input type="text" disabled defaultValue="Asia/Tashkent (UTC+5)" className="w-full mt-1 p-2 border rounded bg-slate-50" />
        </div>
        <button
          onClick={() => alert('Settings saved!')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
