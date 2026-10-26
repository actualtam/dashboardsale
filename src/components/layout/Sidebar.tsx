'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  CreditCard,
  ReceiptText,
  Package,
  Warehouse,
  ArrowLeftRight,
  ClipboardCheck,
  ShoppingBag,
  Truck,
  Users,
  Tag,
  DollarSign,
  UserCheck,
  BarChart3,
  Globe,
  Truck as OrderIcon,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const menuSections = [
    {
      title: 'CORE OPERATING',
      items: [
        { label: t('overview'), href: '/dashboard', icon: LayoutDashboard },
        { label: t('pos'), href: '/pos', icon: CreditCard, highlight: true },
        { label: t('salesHistory'), href: '/sales', icon: ReceiptText },
      ],
    },
    {
      title: 'INVENTORY & CATALOG',
      items: [
        { label: t('products'), href: '/products', icon: Package },
        { label: t('inventory'), href: '/inventory', icon: Warehouse },
        { label: t('transfers'), href: '/inventory/transfers', icon: ArrowLeftRight },
        { label: t('stocktake'), href: '/inventory/stocktake', icon: ClipboardCheck },
      ],
    },
    {
      title: 'COMMERCE & CRM',
      items: [
        { label: t('purchases'), href: '/purchases', icon: ShoppingBag },
        { label: t('suppliers'), href: '/suppliers', icon: Truck },
        { label: t('customers'), href: '/customers', icon: Users },
        { label: t('marketing'), href: '/marketing', icon: Tag },
      ],
    },
    {
      title: 'MANAGEMENT & BI',
      items: [
        { label: t('finance'), href: '/finance', icon: DollarSign },
        { label: t('employees'), href: '/employees', icon: UserCheck },
        { label: t('analytics'), href: '/analytics', icon: BarChart3 },
        { label: t('onlineOrders'), href: '/online-orders', icon: OrderIcon },
      ],
    },
    {
      title: 'SYSTEM SETTINGS',
      items: [
        { label: t('integrations'), href: '/integrations', icon: Cpu },
        { label: t('settings'), href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-white border-r border-slate-200/90 transition-all duration-200 flex flex-col no-print ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-xs border border-slate-800">
              DS
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-sm leading-none flex items-center gap-1.5">
                <span>DashboardSale</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  OS
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Tashkent Flagship</div>
            </div>
          </Link>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm mx-auto shadow-xs border border-slate-800">
            DS
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {menuSections.map((section, sidx) => (
          <div key={sidx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : item.highlight
                      ? 'bg-slate-100/90 text-slate-900 hover:bg-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={17} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}

        {/* External Storefront link */}
        <div className="pt-2 border-t border-slate-100">
          <Link
            href="/store"
            target="_blank"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/70 hover:bg-slate-100 transition-all"
            title={collapsed ? 'Customer Storefront' : undefined}
          >
            <Globe size={16} className="flex-shrink-0 text-slate-500" />
            {!collapsed && <span className="truncate">Online Storefront ↗</span>}
          </Link>
        </div>
      </div>

      {/* User footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-700">
              TA
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Temur Alimov</div>
              <div className="text-[10px] text-slate-500 font-medium">System Admin</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
