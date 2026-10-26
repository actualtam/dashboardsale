'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const ADMIN_PATHS = [
  '/dashboard',
  '/pos',
  '/inventory',
  '/products',
  '/sales',
  '/customers',
  '/suppliers',
  '/purchases',
  '/analytics',
  '/finance',
  '/employees',
  '/marketing',
  '/integrations',
  '/settings',
  '/online-orders',
  '/transfers',
  '/store',
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine if current route is an admin/internal dashboard route
  const isAdminRoute = ADMIN_PATHS.some((path) => pathname === path || pathname?.startsWith(`${path}/`));
  const isPos = pathname === '/pos';

  // Public B2B Website & Storefront (No sidebar, sticky top Navbar & rich Footer)
  if (!isAdminRoute) {
    if (pathname === '/') {
      return (
        <div className="min-h-screen flex flex-col bg-white text-[#0f1320] selection:bg-[#0b5cff] selection:text-white">
          <main className="flex-1">{children}</main>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-white text-[#0f1320] selection:bg-[#0b5cff] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  // POS Fullscreen Cashier Terminal
  if (isPos) {
    return <main className="h-screen overflow-hidden bg-slate-950">{children}</main>;
  }

  // Retail SaaS Admin Shell with Sidebar and Top Header
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 ml-64">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
