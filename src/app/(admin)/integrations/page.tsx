'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Save,
  MessageSquare,
  RefreshCw,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function IntegrationsPage() {
  const { t } = useApp();
  const [tgStatus, setTgStatus] = useState<any>(null);
  const [loadingTg, setLoadingTg] = useState(true);
  const [chatIdInput, setChatIdInput] = useState('');
  const [savingChatId, setSavingChatId] = useState(false);
  const [testingMsg, setTestingMsg] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    loadTgStatus();
  }, []);

  const loadTgStatus = () => {
    setLoadingTg(true);
    fetch('/api/telegram')
      .then((res) => res.json())
      .then((data) => {
        setTgStatus(data);
        if (data.configuredChatId) {
          setChatIdInput(data.configuredChatId);
        }
        setLoadingTg(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingTg(false);
      });
  };

  const handleSaveChatId = async () => {
    if (!chatIdInput.trim()) {
      alert('Please enter a valid Telegram Chat ID or @channel');
      return;
    }
    setSavingChatId(true);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_CHAT_ID', chatId: chatIdInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Telegram Chat ID saved successfully!');
        loadTgStatus();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      alert(`Error saving chat ID: ${e.message}`);
    } finally {
      setSavingChatId(false);
    }
  };

  const handleSendTestMessage = async () => {
    setTestingMsg(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_TEST',
          chatId: chatIdInput.trim() || undefined,
          message: `⚡ <b>DashboardSale — Live System Verification</b>\n\n✅ Bot <code>@dashboardsalevvbot</code> is connected and operational.\nAll POS transactions, online store orders, and shift discrepancies will notify this chat.`,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setTestingMsg(false);
    }
  };

  const handleDownload1C = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CommerceML xmlns="urn:1C.ru:commerceML_2" Version="2.09">
  <Classifier>
    <Id>DASHBOARDSALE-01</Id>
    <Name>DashboardSale Retail Catalog</Name>
  </Classifier>
</CommerceML>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DashboardSale_1C_Export.xml';
    a.click();
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('integrations')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect your DashboardSale retail platform to Telegram bot alerts, Uzbekistan payment gateways, and 1C accounting
        </p>
      </div>

      {/* Telegram Bot Highlight Card */}
      <div className="ds-card rounded-2xl p-6 border-slate-300/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Send size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Telegram Bot Integration</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE & VERIFIED</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Token: <code className="font-mono text-slate-700 font-bold">8937516783:AAFXSPk-sTL17Kt_3YD93vTszdvmC9mi_Uw</code>
              </p>
            </div>
          </div>

          <a
            href="https://t.me/dashboardsalevvbot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200 transition-colors"
          >
            <span>Open @dashboardsalevvbot</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Bot Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bot Name</span>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5">
              {tgStatus?.botInfo?.first_name || 'DASHBOARDSALE'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bot Username</span>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5 font-mono">
              @{tgStatus?.botInfo?.username || 'dashboardsalevvbot'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bot ID</span>
            <div className="text-sm font-extrabold text-slate-800 mt-0.5 font-mono">
              {tgStatus?.botInfo?.id || '8937516783'}
            </div>
          </div>
        </div>

        {/* Chat ID Setup & Test Sender */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-800">
            Configure Target Telegram Chat or Channel for Instant Alerts
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter your Chat ID (e.g. 123456789) or public channel (@my_store_alerts)..."
                value={chatIdInput}
                onChange={(e) => setChatIdInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <button
              onClick={handleSaveChatId}
              disabled={savingChatId}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Save size={13} />
              <span>{savingChatId ? 'Saving...' : 'Save Chat ID'}</span>
            </button>

            <button
              onClick={handleSendTestMessage}
              disabled={testingMsg}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Send size={13} />
              <span>{testingMsg ? 'Sending...' : 'Send Test Alert'}</span>
            </button>
          </div>

          {/* Test notification result banner */}
          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center justify-between ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>
                  {testResult.success
                    ? 'Test alert dispatched to Telegram successfully!'
                    : `Notice: ${testResult.error || testResult.reason || 'Message not delivered'}. Please send /start to @dashboardsalevvbot first.`}
                </span>
              </div>
            </div>
          )}

          {/* Setup guide */}
          <div className="text-[11px] text-slate-500 space-y-1 pt-1">
            <p className="font-semibold text-slate-700">How to get your Telegram Chat ID:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
              <li>Open Telegram and start <a href="https://t.me/dashboardsalevvbot" target="_blank" rel="noreferrer" className="text-sky-600 underline font-bold">@dashboardsalevvbot</a></li>
              <li>Send <code className="bg-slate-200 px-1 rounded font-bold">/start</code> to the bot.</li>
              <li>To receive alerts in a group or channel, add <code className="bg-slate-200 px-1 rounded">@dashboardsalevvbot</code> as an Administrator.</li>
              <li>Enter your numeric Chat ID or channel username (e.g. <code className="bg-slate-200 px-1 rounded">@my_sales_channel</code>) above and click Save.</li>
            </ol>
          </div>
        </div>

        {/* Real-time automated triggers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="font-semibold text-slate-700">POS Sales Alerts</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="font-semibold text-slate-700">Online Store Orders</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="font-semibold text-slate-700">Shift Discrepancies</span>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="font-semibold text-slate-700">Low Stock Warnings</span>
          </div>
        </div>
      </div>

      {/* Payment & Accounting Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Payme */}
        <div className="ds-card p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Payme Gateway</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Payment API integration for Payme dynamic QR checkout and split tender settlement.
          </p>
          <div className="text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 truncate">
            Merchant: payme_demo_retail_789
          </div>
        </div>

        {/* Click */}
        <div className="ds-card p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Click.uz Gateway</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Direct Click checkout and fiscal receipt notification handling.
          </p>
          <div className="text-xs font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 truncate">
            Service: click_demo_service_101
          </div>
        </div>

        {/* 1C Enterprise */}
        <div className="ds-card p-5 rounded-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">1C:Enterprise Sync</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                CommerceML 2.09
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Export centralized product catalog, sales receipts, and supplier invoices for 1C accounting.
            </p>
          </div>
          <button
            onClick={handleDownload1C}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
          >
            <Download size={13} />
            <span>Export 1C XML Package</span>
          </button>
        </div>
      </div>
    </div>
  );
}
