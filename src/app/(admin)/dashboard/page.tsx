'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
  TrendingUp,
  CreditCard,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  Warehouse,
  DollarSign,
  Download,
  Send,
  Building2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { t, currentBranchId } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?branchId=${currentBranchId}&range=${dateRange}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data', err);
        setLoading(false);
      });
  }, [currentBranchId, dateRange]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">{t('loading')}</span>
        </div>
      </div>
    );
  }

  const { metrics, charts, topProducts, lowStockAlerts, recentSales } = data;
  const grossMargin = metrics.netSales > 0 ? ((metrics.grossProfit / metrics.netSales) * 100).toFixed(1) : '0';
  const netMargin = metrics.netSales > 0 ? ((metrics.netProfit / metrics.netSales) * 100).toFixed(1) : '0';

  const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

  const exportCSV = () => {
    let csv = 'Metric,Value\n';
    csv += `Gross Sales,${metrics.grossSales}\n`;
    csv += `Net Sales,${metrics.netSales}\n`;
    csv += `Gross Profit,${metrics.grossProfit}\n`;
    csv += `Operating Expenses,${metrics.totalExpenses}\n`;
    csv += `Net Profit,${metrics.netProfit}\n`;
    csv += `Transactions,${metrics.transactions}\n`;
    csv += `Average Ticket,${metrics.avgTicket}\n`;
    csv += `Inventory Valuation,${metrics.inventoryValuation}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dashboardsale_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>DashboardSale Executive Overview</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time retail operational analytics, double-entry inventory ledger, and fiscal cash reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Quarter to Date</option>
            <option value="all">Lifetime History</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid with improved tactile texture */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Sales */}
        <div className="ds-card p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('netSales')}</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatCurrency(metrics.netSales)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <span>Gross: {formatCurrency(metrics.grossSales)}</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">-{formatCurrency(metrics.discountTotal)} disc</span>
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="ds-card p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('grossProfit')}</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/50">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
              {formatCurrency(metrics.grossProfit)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-800 font-semibold">
              <ArrowUpRight size={13} />
              <span>{grossMargin}% Gross Margin (COGS: {formatCurrency(metrics.costTotal)})</span>
            </div>
          </div>
        </div>

        {/* Operating Expenses & Net Profit */}
        <div className="ds-card p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('netProfit')}</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <Receipt size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatCurrency(metrics.netProfit)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <span>Expenses: {formatCurrency(metrics.totalExpenses)}</span>
              <span>•</span>
              <span className="font-bold text-slate-700">{netMargin}% Net</span>
            </div>
          </div>
        </div>

        {/* Transactions & Basket */}
        <div className="ds-card p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('transactions')}</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <CreditCard size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {metrics.transactions}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
              <span>Avg Basket: {formatCurrency(metrics.avgTicket)}</span>
              <span>•</span>
              <span>{metrics.unitsSold} units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Inventory & Discrepancies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="ds-card p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              <Warehouse size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('inventoryValue')}</div>
              <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                {formatCurrency(metrics.inventoryValuation)}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Cost basis valuation</span>
        </div>

        <div className="ds-card p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('lowStockAlerts')}</div>
              <div className="text-lg font-bold text-amber-700 mt-0.5">
                {lowStockAlerts.length} variants below threshold
              </div>
            </div>
          </div>
          <a href="/inventory" className="text-xs text-slate-900 font-bold hover:underline">
            View Ledger →
          </a>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="ds-card p-5 rounded-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue & Gross Margin Trajectory</h2>
              <p className="text-xs text-slate-500">Daily net sales and realized gross profit</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
                <span className="text-slate-600 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-slate-600 font-medium">Gross Profit</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.salesTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), '']}
                  labelStyle={{ fontWeight: 'bold' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="ds-card p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('salesByPayment')}</h2>
            <p className="text-xs text-slate-500">Breakdown by tender payment method</p>

            <div className="h-52 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.salesByPayment}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {charts.salesByPayment.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {charts.salesByPayment.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Top Sellers & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Best Sellers */}
        <div className="ds-card p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">{t('topSelling')}</h2>
            <a href="/analytics" className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline">
              Full Report →
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((p: any, idx: number) => (
              <div key={p.name} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{p.name}</div>
                    <div className="text-[11px] text-slate-500">{p.quantity} units sold</div>
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900 font-mono">
                  {formatCurrency(p.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="ds-card p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Transactions</h2>
            <a href="/sales" className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline">
              View All →
            </a>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSales.map((s: any) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-900">{s.saleNumber}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {s.paymentMethod}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {s.branchName} • {formatDate(s.createdAt)}
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900 font-mono">
                  {formatCurrency(s.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
