'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Store,
  CreditCard,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ChevronDown,
  Send,
} from 'lucide-react';

export default function Header() {
  const { lang, setLang, t, currentBranchId, setCurrentBranchId, branches, setBranches, shiftStatus } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBranches(data);
        }
      })
      .catch((err) => console.error('Failed to fetch branches', err));
  }, [setBranches]);

  const currentBranchName =
    currentBranchId === 'all'
      ? t('allBranches')
      : branches.find((b) => b.id === currentBranchId)?.name || t('allBranches');

  const notifications = [
    { id: 1, title: 'Telegram Connected', desc: 'Bot @DashboardSale777bot is active for instant sales notifications', type: 'success' },
    { id: 2, title: 'Low Stock Alert', desc: 'Heavyweight Hoodie (Navy - L) has 3 units left', type: 'warn' },
    { id: 3, title: 'Shift Balanced', desc: 'POS-01 register closing cash reconciled with zero discrepancy', type: 'info' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-20 no-print">
      {/* Left: Branch selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors shadow-xs"
          >
            <Store size={14} className="text-slate-600" />
            <span>{currentBranchName}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {showBranchMenu && (
            <div className="absolute left-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Select Store Location
              </div>
              <button
                onClick={() => {
                  setCurrentBranchId('all');
                  setShowBranchMenu(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  currentBranchId === 'all' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'
                }`}
              >
                <span>{t('allBranches')}</span>
                {currentBranchId === 'all' && <CheckCircle2 size={13} className="text-slate-900" />}
              </button>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setCurrentBranchId(b.id);
                    setShowBranchMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    currentBranchId === b.id ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {currentBranchId === b.id && <CheckCircle2 size={13} className="text-slate-900" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shift status pill */}
        <Link
          href="/pos"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 transition-colors shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>{shiftStatus === 'OPEN' ? t('shiftStatusOpen') : t('shiftStatusClosed')}</span>
          <span className="text-emerald-600 text-[10px] font-normal">| POS-01</span>
        </Link>

        {/* Telegram status badge */}
        <Link
          href="/integrations"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-medium hover:bg-sky-100 transition-colors"
          title="Telegram Bot Connected"
        >
          <Send size={12} className="text-sky-600" />
          <span>@DashboardSale777bot</span>
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick POS button */}
        <Link
          href="/pos"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all border border-slate-900/10"
        >
          <CreditCard size={14} />
          <span>{t('pos')}</span>
        </Link>

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs"
          >
            <Globe size={13} className="text-slate-500" />
            <span className="uppercase text-[11px]">{lang}</span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setLang('uz');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between ${
                  lang === 'uz' ? 'text-slate-900 font-bold' : 'text-slate-700'
                }`}
              >
                <span>Oʻzbekcha</span>
                {lang === 'uz' && <CheckCircle2 size={12} />}
              </button>
              <button
                onClick={() => {
                  setLang('ru');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between ${
                  lang === 'ru' ? 'text-slate-900 font-bold' : 'text-slate-700'
                }`}
              >
                <span>Русский</span>
                {lang === 'ru' && <CheckCircle2 size={12} />}
              </button>
              <button
                onClick={() => {
                  setLang('en');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between ${
                  lang === 'en' ? 'text-slate-900 font-bold' : 'text-slate-700'
                }`}
              >
                <span>English</span>
                {lang === 'en' && <CheckCircle2 size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative shadow-xs"
            title="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                  3 unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      {n.type === 'warn' && <AlertTriangle size={13} className="text-amber-500" />}
                      {n.type === 'success' && <CheckCircle2 size={13} className="text-emerald-500" />}
                      <span>{n.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
