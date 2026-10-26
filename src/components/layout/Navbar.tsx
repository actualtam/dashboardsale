'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top utility bar */}
      <div className="topbar">
        <div className="wrap">
          <div className="topbar-l">
            <span className="label">Menejer bilan bog‘lanish:</span>
            <a className="phone" href={`tel:${siteConfig.phoneClean}`}>{siteConfig.phone}</a>
            <a className="pill pill-tg" href={siteConfig.telegramUrl} target="_blank" rel="noopener noreferrer">
              <span className="tg-dot">
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="#fff" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                </svg>
              </span>
              Telegram
            </a>
          </div>
          <div className="topbar-r">
            <span className="pill hours">
              <svg className="ico" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
              Du–Sha 09:00–19:00
            </span>
            <span className="pill">
              <svg className="ico" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>
              </svg>
              UZ
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <header className="nav">
        <div className="wrap">
          <Link href="/" className="logo" aria-label="DashboardSale — bosh sahifa">
            <span className="logo-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                <rect x="3" y="13" width="4.500" height="8" rx="1.500"/>
                <rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/>
                <rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/>
              </svg>
            </span>
            <span className="logo-word">DashboardSale</span>
          </Link>
          <nav className="nav-links" aria-label="Asosiy menyu">
            <Link href="/#services">Xizmatlar</Link>
            <Link href="/equipment" className={pathname?.startsWith('/equipment') ? 'text-[#0b5cff]' : ''}>Uskunalar</Link>
            <Link href="/#process">Jarayon</Link>
            <Link href="/#why-us">Nega biz</Link>
            <Link href="/#faq">Savol-javob</Link>
            <Link href="/contact" className={pathname === '/contact' ? 'text-[#0b5cff]' : ''}>Aloqa</Link>
          </nav>
          <div className="nav-cta">
            <Link href="/contact" className="btn btn-soft nav-demo">Demo olish</Link>
            <button
              className="burger"
              id="burger"
              aria-label="Menyuni ochish"
              aria-expanded={drawerOpen}
              style={{ transform: drawerOpen ? 'rotate(45deg)' : '' }}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <svg className="ico" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"/><path d="M5 12h14"/>
              </svg>
            </button>
          </div>
        </div>
        <div className={`drawer ${drawerOpen ? 'open' : ''}`} id="drawer">
          <div className="wrap">
            <Link className="dl" href="/#services" onClick={() => setDrawerOpen(false)}>Xizmatlar</Link>
            <Link className="dl" href="/equipment" onClick={() => setDrawerOpen(false)}>Uskunalar</Link>
            <Link className="dl" href="/#process" onClick={() => setDrawerOpen(false)}>Jarayon</Link>
            <Link className="dl" href="/#why-us" onClick={() => setDrawerOpen(false)}>Nega biz</Link>
            <Link className="dl" href="/#faq" onClick={() => setDrawerOpen(false)}>Savol-javob</Link>
            <Link className="dl" href="/contact" onClick={() => setDrawerOpen(false)}>Aloqa</Link>
            <Link className="btn btn-primary" href="/contact" onClick={() => setDrawerOpen(false)}>Demo olish</Link>
          </div>
        </div>
      </header>
    </>
  );
}
