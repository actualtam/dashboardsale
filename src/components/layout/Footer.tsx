'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Link href="/" className="logo" aria-label="DashboardSale">
              <span className="logo-mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <rect x="3" y="13" width="4.500" height="8" rx="1.500"/>
                  <rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/>
                  <rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/>
                </svg>
              </span>
              <span className="logo-word" style={{ fontSize: 18 }}>DashboardSale</span>
            </Link>
            <p>Savdo tizimlari, biznes botlari, davomat nazorati va AI yechimlari — uskunalar bilan birgalikda, yagona hamkor orqali.</p>
          </div>
          <div>
            <h4>Xizmatlar</h4>
            <ul>
              <li><Link href="/#services">Veb-saytlar va savdo ilovalari</Link></li>
              <li><Link href="/#services">Buxgalteriya va biznes botlari</Link></li>
              <li><Link href="/#services">Xodimlar davomati</Link></li>
              <li><Link href="/#services">AI kamera va monitoring</Link></li>
              <li><Link href="/#services">Biznes uskunalari va montaj</Link></li>
            </ul>
          </div>
          <div>
            <h4>Uskunalar</h4>
            <ul>
              <li><Link href="/equipment">Monobloklar va POS terminallar</Link></li>
              <li><Link href="/equipment">Chek printerlar</Link></li>
              <li><Link href="/equipment">Shtrix-kod skanerlar</Link></li>
              <li><Link href="/equipment">Kassa qutilari</Link></li>
              <li><Link href="/equipment">Face ID va biometriya</Link></li>
            </ul>
          </div>
          <div>
            <h4>Aloqa</h4>
            <ul>
              <li><a className="phone-l" href={`tel:${siteConfig.phoneClean}`}>{siteConfig.phone}</a></li>
              <li><a href={siteConfig.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram bot</a></li>
              <li><Link href="/contact">Toshkent, O‘zbekiston</Link></li>
              <li><Link href="/contact">Du–Sha: 09:00–19:00</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 DashboardSale. Barcha huquqlar himoyalangan.</span>
          <span>Toshkent bo‘yicha texnik ko‘rik va konsultatsiya bepul.</span>
        </div>
      </div>
    </footer>
  );
}
