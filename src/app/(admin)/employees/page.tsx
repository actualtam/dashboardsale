'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserCheck, Plus, Shield } from 'lucide-react';

export default function EmployeesPage() {
  const { t } = useApp();
  const staff = [
    { name: 'Temur Alimov', email: 'admin@billz-retail.uz', role: 'Business Owner', branch: 'All Locations' },
    { name: 'Nodira Karimova', email: 'manager@billz-retail.uz', role: 'Branch Manager', branch: 'Chilanzar Store' },
    { name: 'Jasur Bekmirzaev', email: 'cashier@billz-retail.uz', role: 'Cashier (POS)', branch: 'Chilanzar Store' },
    { name: 'Madina Umarova', email: 'accountant@billz-retail.uz', role: 'Accountant', branch: 'All Locations' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('employees')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Staff directory, role-based access control (RBAC), and branch assignments</p>
        </div>
        <button
          onClick={() => alert('Invite employee')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
        >
          <Plus size={15} />
          <span>Invite Staff</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Staff Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Branch Assignment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{s.name}</div>
                  <div className="text-[11px] text-slate-400">{s.email}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-indigo-700">{s.role}</td>
                <td className="px-4 py-3 text-slate-600">{s.branch}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
