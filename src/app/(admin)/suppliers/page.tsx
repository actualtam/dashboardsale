'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/formatters';
import { Truck, Phone, Mail, Building, Plus } from 'lucide-react';

export default function SuppliersPage() {
  const { t } = useApp();
  const [suppliers, setSuppliers] = useState<any[]>([
    {
      id: '1',
      name: 'Textile Distribution LLC',
      contactPerson: 'Farrukh Sharipov',
      phone: '+998909876543',
      email: 'textile@supplier.uz',
      taxId: '304958102',
      address: 'Tashkent, Sergeli Industrial Zone',
      currentBalance: 12500000,
    },
    {
      id: '2',
      name: 'Global Electronics Import',
      contactPerson: 'Bobur Mansurov',
      phone: '+998918765432',
      email: 'tech@supplier.uz',
      taxId: '307892114',
      address: 'Tashkent, Shaykhontokhur St 12',
      currentBalance: 24000000,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('suppliers')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Vendor directory, contact information, tax INN, and payable balances</p>
        </div>
        <button
          onClick={() => alert('New supplier form')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Plus size={15} />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                  <p className="text-xs text-slate-500">Contact: {s.contactPerson}</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                  INN: {s.taxId}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-400" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-400" />
                  <span>{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={13} className="text-slate-400" />
                  <span>{s.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Payable Debt:</span>
              <span className="text-sm font-extrabold text-rose-600">{formatCurrency(s.currentBalance)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
