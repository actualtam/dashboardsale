'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('online_store');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('ds_cookie_ok') !== '1') {
        setCookieVisible(true);
      }
    } catch (e) {
      // Ignore in SSR/restricted environments
    }
  }, []);

  const handleCookieOk = () => {
    setCookieVisible(false);
    try {
      localStorage.setItem('ds_cookie_ok', '1');
    } catch (e) {}
  };

  const openModal = (serviceKey: string) => {
    setModalService(serviceKey);
    setFormSubmitted(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      serviceKey: modalService,
      customerName,
      phone: customerPhone,
      businessName,
      message: customerMessage,
      preferredContact: 'TELEGRAM',
    };

    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
      } else {
        alert('Xatolik: ' + (data.error || 'Qaytadan urinib ko‘ring'));
      }
    } catch (err) {
      // Fallback display success and invite to Telegram
      setFormSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Icon sprite */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
          <symbol id="i-send" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></symbol>
          <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></symbol>
          <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
          <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>
          <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></symbol>
          <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/></symbol>
          <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
          <symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></symbol>
          <symbol id="i-plug" viewBox="0 0 24 24"><path d="M9 3v5"/><path d="M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0V8Z"/><path d="M12 17v4"/></symbol>
          <symbol id="i-wrench" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0 5 5L21 12.6 12.6 21 3 11.4l8.4-8.4 3.3 3.3Z" transform="scale(.9) translate(1.3 1.3)"/></symbol>
          <symbol id="i-headset" viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/><path d="M19 20c0 1-2 2-5 2"/></symbol>
          <symbol id="i-cart" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .6H18a1 1 0 0 0 1-.8L20.5 8H6"/></symbol>
          <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></symbol>
          <symbol id="i-face" viewBox="0 0 24 24"><path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 10v1"/><path d="M15 10v1"/><path d="M9.5 15.5c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1"/></symbol>
          <symbol id="i-camera" viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><circle cx="12" cy="13" r="3.5"/></symbol>
          <symbol id="i-box" viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></symbol>
          <symbol id="i-monitor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2.5"/><path d="M8 21h8"/><path d="M12 17v4"/></symbol>
          <symbol id="i-printer" viewBox="0 0 24 24"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></symbol>
          <symbol id="i-scan" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></symbol>
          <symbol id="i-drawer" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="11" rx="2"/><path d="M5 9 6.5 4h11L19 9"/><path d="M9 14h6"/></symbol>
          <symbol id="i-nfc" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M9 9.5a4 4 0 0 1 0 5"/><path d="M12.5 8a6.5 6.5 0 0 1 0 8"/></symbol>
          <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.800 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
          <symbol id="i-bot" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="4"/><path d="M12 4v4"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></symbol>
          <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.600a3.500 3.500 0 0 1 0 6.800"/><path d="M18 14.500a6.500 6.500 0 0 1 3.500 5.500"/></symbol>
        </defs>
      </svg>

      {/* ==================== TOP BAR ==================== */}
      <div className="topbar">
        <div className="wrap">
          <div className="topbar-l">
            <span className="label">Menejer bilan bog‘lanish:</span>
            <a className="phone" href="tel:+998901234567">+998 90 123 45 67</a>
            <a className="pill pill-tg" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener noreferrer">
              <span className="tg-dot"><svg viewBox="0 0 24 24"><use href="#i-send"/></svg></span>
              Telegram
            </a>
          </div>
          <div className="topbar-r">
            <span className="pill hours"><svg className="ico"><use href="#i-clock"/></svg>Du–Sha 09:00–19:00</span>
            <span className="pill"><svg className="ico"><use href="#i-globe"/></svg>UZ</span>
          </div>
        </div>
      </div>

      {/* ==================== NAV ==================== */}
      <header className="nav">
        <div className="wrap">
          <Link href="/" className="logo" aria-label="DashboardSale — bosh sahifa">
            <span className="logo-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="13" width="4.500" height="8" rx="1.500"/><rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/><rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/></svg>
            </span>
            <span className="logo-word">DashboardSale</span>
          </Link>
          <nav className="nav-links" aria-label="Asosiy menyu">
            <a href="#services">Xizmatlar</a>
            <a href="#equipment">Uskunalar</a>
            <a href="#process">Jarayon</a>
            <a href="#why-us">Nega biz</a>
            <a href="#faq">Savol-javob</a>
          </nav>
          <div className="nav-cta">
            <button className="btn btn-soft nav-demo" onClick={() => openModal('general')}>Demo olish</button>
            <button
              className="burger"
              id="burger"
              aria-label="Menyuni ochish"
              aria-expanded={drawerOpen}
              style={{ transform: drawerOpen ? 'rotate(45deg)' : '' }}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <svg className="ico"><use href="#i-plus"/></svg>
            </button>
          </div>
        </div>
        <div className={`drawer ${drawerOpen ? 'open' : ''}`} id="drawer">
          <div className="wrap">
            <a className="dl" href="#services" onClick={() => setDrawerOpen(false)}>Xizmatlar</a>
            <a className="dl" href="#equipment" onClick={() => setDrawerOpen(false)}>Uskunalar</a>
            <a className="dl" href="#process" onClick={() => setDrawerOpen(false)}>Jarayon</a>
            <a className="dl" href="#why-us" onClick={() => setDrawerOpen(false)}>Nega biz</a>
            <a className="dl" href="#faq" onClick={() => setDrawerOpen(false)}>Savol-javob</a>
            <a className="dl" href="#contact" onClick={() => setDrawerOpen(false)}>Aloqa</a>
            <button className="btn btn-primary" onClick={() => { setDrawerOpen(false); openModal('general'); }}>Demo olish</button>
          </div>
        </div>
      </header>

      <main>
        {/* ==================== HERO ==================== */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Biznesingiz uchun texnologiya, <em>tartib va nazorat</em></h1>
            <p className="hero-lead">Savdo tizimlari, biznes botlari, davomat nazorati va AI yechimlari — uskunalar bilan birgalikda, yagona hamkor orqali.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => openModal('online_store')}>Hozir sinab ko‘rish</button>
              <a className="btn btn-soft btn-lg" href="#equipment"><svg className="ico" style={{ width: 22, height: 22, stroke: 'none' }}><use href="#i-play"/></svg>Uskunalar katalogi</a>
            </div>
          </div>

          <div className="hero-stage">
            {/* 1: POS monoblok */}
            <div className="shot s1" role="img" aria-label="POS monoblok ekrani">
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <ellipse cx="200" cy="356" rx="130" ry="12" fill="#3b2e1c" opacity=".14"/>
                <path d="M176 300h48l10 48h-68z" fill="#2a2f3a"/>
                <rect x="128" y="344" width="144" height="12" rx="6" fill="#1a1e27"/>
                <rect x="52" y="76" width="296" height="228" rx="24" fill="#171b24"/>
                <rect x="62" y="86" width="276" height="208" rx="16" fill="#fff"/>
                <rect x="74" y="98" width="86" height="12" rx="6" fill="#dfe6f3"/>
                <circle cx="318" cy="104" r="8" fill="#0b5cff"/>
                <g>
                  <rect x="74" y="124" width="56" height="48" rx="12" fill="#0b5cff"/>
                  <rect x="136" y="124" width="56" height="48" rx="12" fill="#e9f0ff"/>
                  <rect x="198" y="124" width="56" height="48" rx="12" fill="#f3f5f9"/>
                  <rect x="74" y="178" width="56" height="48" rx="12" fill="#f3f5f9"/>
                  <rect x="136" y="178" width="56" height="48" rx="12" fill="#e9f0ff"/>
                  <rect x="198" y="178" width="56" height="48" rx="12" fill="#f3f5f9"/>
                  <rect x="74" y="232" width="56" height="48" rx="12" fill="#e9f0ff"/>
                  <rect x="136" y="232" width="56" height="48" rx="12" fill="#f3f5f9"/>
                  <rect x="198" y="232" width="56" height="48" rx="12" fill="#e9f0ff"/>
                </g>
                <rect x="266" y="124" width="62" height="102" rx="12" fill="#f3f5f9"/>
                <rect x="274" y="134" width="40" height="6" rx="3" fill="#c7cfdf"/>
                <rect x="274" y="148" width="46" height="6" rx="3" fill="#dde3ef"/>
                <rect x="274" y="162" width="34" height="6" rx="3" fill="#dde3ef"/>
                <rect x="274" y="176" width="44" height="6" rx="3" fill="#dde3ef"/>
                <rect x="274" y="204" width="46" height="10" rx="5" fill="#171b24"/>
                <rect x="266" y="236" width="62" height="44" rx="14" fill="#16a864"/>
                <path d="m284 258 7 7 13-14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* 2: Face ID */}
            <div className="shot s2" role="img" aria-label="Face ID davomat terminali">
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect x="120" y="36" width="160" height="330" rx="32" fill="#1b2130"/>
                <rect x="132" y="60" width="136" height="206" rx="20" fill="#0c111d"/>
                <circle cx="200" cy="48" r="4" fill="#3a4357"/>
                <g stroke="#4b8bff" strokeWidth="4" fill="none" strokeLinecap="round">
                  <path d="M146 96v-12a8 8 0 0 1 8-8h12"/><path d="M234 76h12a8 8 0 0 1 8 8v12"/>
                  <path d="M254 232v12a8 8 0 0 1-8 8h-12"/><path d="M166 252h-12a8 8 0 0 1-8-8v-12"/>
                </g>
                <circle cx="200" cy="122" r="23" fill="none" stroke="#dbe5ff" strokeWidth="4"/>
                <path d="M160 212c4-22 20-32 40-32s36 10 40 32" fill="none" stroke="#dbe5ff" strokeWidth="4" strokeLinecap="round"/>
                <rect x="152" y="220" width="96" height="26" rx="13" fill="#16a864"/>
                <text x="200" y="237.500" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#fff" fontFamily="Manrope, Arial, sans-serif">Keldi 09:02</text>
                <rect x="156" y="286" width="88" height="56" rx="16" fill="#252d41"/>
                <g stroke="#6c7a99" strokeWidth="3" fill="none" strokeLinecap="round"><path d="M188 306a10 10 0 0 1 0 16"/><path d="M200 301a16 16 0 0 1 0 26"/></g>
                <rect x="296" y="120" width="76" height="58" rx="18" fill="#fff" opacity=".92"/>
                <text x="334" y="145" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5d6577" fontFamily="Manrope, Arial, sans-serif">Bugun</text>
                <text x="334" y="166" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f1320" fontFamily="Manrope, Arial, sans-serif">42/45</text>
              </svg>
            </div>

            {/* 3: Chek printer + skaner */}
            <div className="shot s3" role="img" aria-label="Chek printeri va shtrix-kod skaneri">
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <path d="M138 30h124v176H138z" fill="#fff"/>
                <path d="M138 30h124v176l-10.300-8-10.300 8-10.300-8-10.300 8-10.300-8-10.300 8-10.300-8-10.300 8-10.300-8-10.300 8-10.300-8-10.300 8-10.300-8Z" fill="#fff" opacity="0"/>
                <rect x="154" y="48" width="64" height="8" rx="4" fill="#c7cfdf"/>
                <rect x="154" y="66" width="92" height="6" rx="3" fill="#e1e6f0"/>
                <rect x="154" y="80" width="80" height="6" rx="3" fill="#e1e6f0"/>
                <rect x="154" y="94" width="88" height="6" rx="3" fill="#e1e6f0"/>
                <rect x="154" y="120" width="92" height="1.500" fill="#c7cfdf"/>
                <text x="154" y="142" fontSize="12" fontWeight="800" fill="#0f1320" fontFamily="Manrope, Arial, sans-serif">Jami</text>
                <text x="246" y="142" textAnchor="end" fontSize="12" fontWeight="800" fill="#0b5cff" fontFamily="Manrope, Arial, sans-serif">248 000</text>
                <g fill="#0f1320"><rect x="154" y="158" width="3" height="28"/><rect x="160" y="158" width="6" height="28"/><rect x="169" y="158" width="2" height="28"/><rect x="174" y="158" width="5" height="28"/><rect x="182" y="158" width="3" height="28"/><rect x="188" y="158" width="7" height="28"/><rect x="198" y="158" width="2" height="28"/><rect x="203" y="158" width="4" height="28"/><rect x="210" y="158" width="6" height="28"/><rect x="219" y="158" width="2" height="28"/><rect x="224" y="158" width="4" height="28"/><rect x="231" y="158" width="3" height="28"/></g>
                <rect x="72" y="204" width="256" height="116" rx="26" fill="#fff"/>
                <rect x="72" y="204" width="256" height="44" rx="22" fill="#e9edf5"/>
                <rect x="72" y="226" width="256" height="22" fill="#e9edf5"/>
                <rect x="104" y="238" width="192" height="12" rx="6" fill="#262b37"/>
                <circle cx="104" cy="284" r="6" fill="#16a864"/>
                <rect x="124" y="279" width="64" height="10" rx="5" fill="#dfe5f0"/>
                <rect x="262" y="270" width="38" height="28" rx="10" fill="#0b5cff"/>
                <ellipse cx="200" cy="330" rx="140" ry="9" fill="#5a3a22" opacity=".14"/>
                {/* skaner */}
                <g transform="translate(250 300) rotate(-8)">
                  <rect x="0" y="0" width="86" height="40" rx="14" fill="#1a1e27"/>
                  <rect x="60" y="8" width="20" height="24" rx="6" fill="#4b8bff"/>
                  <path d="M14 38 6 86c-1 6 3 10 9 10h12c5 0 9-3 9-9l5-49Z" fill="#2a2f3a"/>
                </g>
              </svg>
            </div>

            {/* 4: Dashboard planshet */}
            <div className="shot s4" role="img" aria-label="Savdo hisoboti paneli">
              <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b5cff" stopOpacity=".28"/><stop offset="1" stopColor="#0b5cff" stopOpacity="0"/></linearGradient>
                </defs>
                <g transform="rotate(-5 200 210)">
                  <rect x="34" y="84" width="332" height="244" rx="22" fill="#151922"/>
                  <rect x="44" y="94" width="312" height="224" rx="14" fill="#fff"/>
                  <rect x="44" y="94" width="62" height="224" rx="14" fill="#f3f5f9"/>
                  <rect x="56" y="110" width="38" height="8" rx="4" fill="#0b5cff"/>
                  <rect x="56" y="130" width="30" height="6" rx="3" fill="#c7cfdf"/>
                  <rect x="56" y="146" width="34" height="6" rx="3" fill="#c7cfdf"/>
                  <rect x="56" y="162" width="26" height="6" rx="3" fill="#c7cfdf"/>
                  <text x="122" y="122" fontSize="11" fontWeight="700" fill="#5d6577" fontFamily="Manrope, Arial, sans-serif">Tushum</text>
                  <text x="122" y="148" fontSize="24" fontWeight="800" fill="#0f1320" fontFamily="Manrope, Arial, sans-serif">128,4 mln</text>
                  <path d="M122 270 L152 252 L182 258 L212 224 L242 232 L272 192 L302 200 L340 168 L340 296 L122 296Z" fill="url(#gArea)"/>
                  <path d="M122 270 L152 252 L182 258 L212 224 L242 232 L272 192 L302 200 L340 168" fill="none" stroke="#0b5cff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="340" cy="168" r="6" fill="#fff" stroke="#0b5cff" strokeWidth="4"/>
                  <g fill="#dfe6f3"><rect x="126" y="284" width="14" height="12" rx="3"/><rect x="156" y="284" width="14" height="12" rx="3"/><rect x="186" y="284" width="14" height="12" rx="3"/><rect x="216" y="284" width="14" height="12" rx="3"/></g>
                </g>
                <g transform="rotate(-5 200 210)">
                  <rect x="262" y="58" width="96" height="48" rx="24" fill="#fff" stroke="#e5e8ef"/>
                  <circle cx="286" cy="82" r="11" fill="#e3f7ec"/>
                  <path d="m281 85 5-6 5 6" fill="none" stroke="#16a864" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="304" y="87" fontSize="15" fontWeight="800" fill="#16a864" fontFamily="Manrope, Arial, sans-serif">+24%</text>
                </g>
              </svg>
            </div>

            {/* 5: AI monitoring */}
            <div className="shot s5" role="img" aria-label="Do‘kon ichidagi mijozlar oqimi xaritasi">
              <svg viewBox="0 0 720 340" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
                <defs>
                  <radialGradient id="hHot"><stop offset="0" stopColor="#ff4d3d" stopOpacity=".62"/><stop offset=".55" stopColor="#ff9a3d" stopOpacity=".28"/><stop offset="1" stopColor="#ffd23d" stopOpacity="0"/></radialGradient>
                  <linearGradient id="gCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b5cff" stopOpacity=".26"/><stop offset="1" stopColor="#0b5cff" stopOpacity="0"/></linearGradient>
                </defs>
                <g fill="#cfd8e8">
                  <rect x="120" y="130" width="58" height="150" rx="10"/><rect x="198" y="130" width="58" height="150" rx="10"/>
                  <rect x="300" y="130" width="58" height="150" rx="10"/><rect x="378" y="130" width="58" height="150" rx="10"/>
                  <rect x="480" y="130" width="58" height="150" rx="10"/><rect x="558" y="130" width="58" height="150" rx="10"/>
                </g>
                <rect x="268" y="296" width="184" height="44" rx="14" fill="#0b5cff"/>
                <rect x="286" y="308" width="60" height="8" rx="4" fill="#fff" opacity=".7"/>
                <ellipse cx="278" cy="214" rx="64" ry="78" fill="url(#hHot)"/>
                <ellipse cx="470" cy="190" rx="52" ry="62" fill="url(#hHot)" opacity=".75"/>
                <ellipse cx="360" cy="276" rx="86" ry="34" fill="url(#hHot)" opacity=".9"/>
                <path d="M360 40 L222 300 L498 300Z" fill="url(#gCone)"/>
                <circle cx="360" cy="40" r="20" fill="#fff"/>
                <circle cx="360" cy="40" r="20" fill="none" stroke="#0b5cff" strokeWidth="4"/>
                <circle cx="360" cy="40" r="8" fill="#0b5cff"/>
                <rect x="488" y="78" width="136" height="40" rx="20" fill="#fff"/>
                <text x="556" y="103" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f1320" fontFamily="Manrope, Arial, sans-serif">Navbat: 2 kishi</text>
                <rect x="96" y="78" width="124" height="40" rx="20" fill="#fff"/>
                <text x="158" y="103" textAnchor="middle" fontSize="14" fontWeight="800" fill="#e5484d" fontFamily="Manrope, Arial, sans-serif">Gavjum zona</text>
              </svg>
            </div>
          </div>
        </section>

        {/* ==================== BENEFITS ==================== */}
        <section className="benefits" aria-label="Asosiy afzalliklar">
          <div className="wrap">
            <div className="benefits-grid">
              <article className="benefit">
                <span className="tile"><svg className="ico"><use href="#i-layers"/></svg></span>
                <div><h3>Yagona ekotizim</h3><p>Dasturiy ta’minot va kassa uskunalari bitta hamkor tomonidan taqdim etiladi.</p></div>
              </article>
              <article className="benefit">
                <span className="tile"><svg className="ico"><use href="#i-plug"/></svg></span>
                <div><h3>To‘liq moslik</h3><p>1C, savdo dasturlari va kassa protokollari bilan professional sozlash.</p></div>
              </article>
              <article className="benefit">
                <span className="tile"><svg className="ico"><use href="#i-wrench"/></svg></span>
                <div><h3>Joyida o‘rnatish</h3><p>Mutaxassislar tomonidan Toshkent va viloyatlarda montaj va xodimlarni o‘rgatish.</p></div>
              </article>
              <article className="benefit">
                <span className="tile"><svg className="ico"><use href="#i-headset"/></svg></span>
                <div><h3>Doimiy texnik aloqa</h3><p>Muammolarni tezkor hal qilish va konsultatsiya uchun to‘g‘ridan-to‘g‘ri muhandislar.</p></div>
              </article>
            </div>
          </div>
        </section>

        {/* ==================== SERVICES ==================== */}
        <section id="services" className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Biznesni avtomatlashtirish yechimlari</h2>
              <p>Do‘kon, restoran, dorixona va korxonalar uchun dasturiy ta’minot, hisobot botlari va kassa texnikasi.</p>
            </div>

            <article className="svc-wide cursor-pointer" onClick={() => window.location.href = '/services/online-store'}>
              <div className="svc-copy">
                <span className="tile" style={{ background: '#fff' }}><svg className="ico"><use href="#i-cart"/></svg></span>
                <h3><Link href="/services/online-store" className="hover:text-[#0b5cff] transition-colors">Veb-saytlar va savdo ilovalari</Link></h3>
                <p>Do‘koningiz uchun zamonaviy veb-sayt, mobil ilova va Telegram savdo boti. Mahsulotlar katalogi, savat, onlayn to‘lov va kuryerlik yetkazib berish integratsiyasi bilan to‘liq jihozlangan ko‘p kanalli savdo tizimlari.</p>
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-6">
                  <Link href="/services/online-store" onClick={(e) => e.stopPropagation()} className="svc-link">
                    Batafsil sahifa va tariflar <svg className="ico"><use href="#i-arrow"/></svg>
                  </Link>
                  <button className="btn btn-soft btn-sm rip" onClick={(e) => { e.stopPropagation(); openModal('online_store'); }}>
                    Tezkor so‘rov
                  </button>
                </div>
              </div>
              <div className="mini-grid">
                <div className="mini"><h4>Katalog va savat</h4><p>Qulay filtrlar, mahsulot parametrlari (o‘lcham, rang) va qoldiqlar nazorati.</p></div>
                <div className="mini"><h4>To‘lov tizimlari</h4><p>Payme, Click, Uzum orqali xavfsiz to‘lovlar va chek shakllanishi.</p></div>
                <div className="mini"><h4>Telegram savdo boti</h4><p>Ilova yuklab olmasdan Telegram orqali to‘g‘ridan-to‘g‘ri buyurtma olish.</p></div>
                <div className="mini"><h4>Yetkazib berish</h4><p>Kuryer xizmati va geolokatsiya orqali manzilni aniq belgilash.</p></div>
              </div>
            </article>

            <div className="svc-grid">
              <article className="svc cursor-pointer" onClick={() => window.location.href = '/services/accounting-bots'}>
                <span className="tile"><svg className="ico"><use href="#i-bot"/></svg></span>
                <h3><Link href="/services/accounting-bots" className="hover:text-[#0b5cff] transition-colors">Buxgalteriya va biznes botlari</Link></h3>
                <p>1C / ERP tizimlari bilan to‘g‘ridan-to‘g‘ri sinxronlashuvchi, smena yopilishi, kunlik tushum va qoldiqlar haqida Telegram orqali xabar beruvchi aqlli botlar.</p>
                <ul className="checks">
                  <li><svg className="ico"><use href="#i-check"/></svg>1C:Korxona va ERP bilan ikki tomonlama sinxronizatsiya</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Kunlik tushum, kassa hisoboti va kassir smenasi</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Kam qolgan tovarlar bo‘yicha avtomatik xabarnoma</li>
                </ul>
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-6">
                  <Link href="/services/accounting-bots" onClick={(e) => e.stopPropagation()} className="svc-link">
                    Batafsil sahifa va tariflar <svg className="ico"><use href="#i-arrow"/></svg>
                  </Link>
                  <button className="btn btn-soft btn-sm rip" onClick={(e) => { e.stopPropagation(); openModal('accounting_bots'); }}>
                    Tezkor so‘rov
                  </button>
                </div>
              </article>

              <article className="svc cursor-pointer" onClick={() => window.location.href = '/services/attendance'}>
                <span className="tile"><svg className="ico"><use href="#i-face"/></svg></span>
                <h3><Link href="/services/attendance" className="hover:text-[#0b5cff] transition-colors">Xodimlar davomati va nazorat tizimlari</Link></h3>
                <p>Face ID va biometriya orqali xodimlar keldi-ketdisini aniq qayd etish. Kechikishlar va sababsiz kelmasliklarni hisoblab, oylik maosh jadvaliga uzatish.</p>
                <ul className="checks">
                  <li><svg className="ico"><use href="#i-check"/></svg>Face ID biometrik terminallari va turniket montaji</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Kechikishlar va ish vaqti daqiqasigacha tahlili</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Oylik maosh hisob-kitobi bilan avtomat integratsiya</li>
                </ul>
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-6">
                  <Link href="/services/attendance" onClick={(e) => e.stopPropagation()} className="svc-link">
                    Batafsil sahifa va tariflar <svg className="ico"><use href="#i-arrow"/></svg>
                  </Link>
                  <button className="btn btn-soft btn-sm rip" onClick={(e) => { e.stopPropagation(); openModal('attendance'); }}>
                    Tezkor so‘rov
                  </button>
                </div>
              </article>

              <article className="svc cursor-pointer" onClick={() => window.location.href = '/services/ai-cameras'}>
                <span className="tile"><svg className="ico"><use href="#i-camera"/></svg></span>
                <h3><Link href="/services/ai-cameras" className="hover:text-[#0b5cff] transition-colors">AI kamera va aqlli monitoring</Link></h3>
                <p>Sun’iy intellekt asosidagi videokuzatuv tizimi savdo nuqtasidagi eng gavjum hududlarni aniqlaydi, kassadagi qallobliklarni fosh etadi va xavfsizlikni ta’minlaydi.</p>
                <ul className="checks">
                  <li><svg className="ico"><use href="#i-check"/></svg>Mijozlar oqimi va eng gavjum zonalar xaritasi (Heatmap)</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Kassadagi navbat monitoringi va xizmat ko‘rsatish tezligi</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Kassadagi shubhali holatlar va qoidabuzarliklar nazorati</li>
                </ul>
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-6">
                  <Link href="/services/ai-cameras" onClick={(e) => e.stopPropagation()} className="svc-link">
                    Batafsil sahifa va tariflar <svg className="ico"><use href="#i-arrow"/></svg>
                  </Link>
                  <button className="btn btn-soft btn-sm rip" onClick={(e) => { e.stopPropagation(); openModal('ai_cameras'); }}>
                    Tezkor so‘rov
                  </button>
                </div>
              </article>

              <article className="svc cursor-pointer" onClick={() => window.location.href = '/services/equipment-setup'}>
                <span className="tile"><svg className="ico"><use href="#i-monitor"/></svg></span>
                <h3><Link href="/services/equipment-setup" className="hover:text-[#0b5cff] transition-colors">Biznes uskunalari va montaj</Link></h3>
                <p>Chakana savdo va xizmat ko‘rsatish sohalari uchun zarur barcha kassa texnikasini yetkazib beramiz, joyida o‘rnatamiz va kafolatli texnik ko‘mak beramiz.</p>
                <ul className="checks">
                  <li><svg className="ico"><use href="#i-check"/></svg>Sensorli POS Monobloklar (15.6" IPS FHD)</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Tezkor chek printerlari (80mm avtomatik pichoq)</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Shtrix-kod skanerlari (1D / 2D / QR) va metall kassa qutilari</li>
                </ul>
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-6">
                  <Link href="/services/equipment-setup" onClick={(e) => e.stopPropagation()} className="svc-link">
                    Batafsil sahifa va tariflar <svg className="ico"><use href="#i-arrow"/></svg>
                  </Link>
                  <a className="btn btn-soft btn-sm rip" href="#equipment" onClick={(e) => e.stopPropagation()}>
                    Uskunalar do‘koni
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ==================== PROCESS ==================== */}
        <section id="process" className="sec process">
          <div className="wrap">
            <div className="sec-head">
              <h2>Hamkorlik qanday amalga oshiriladi?</h2>
              <p>Uch-to‘rt kun ichida ishga tushadigan aniq to‘rt bosqich.</p>
            </div>
            <ol className="steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li className="step">
                <div className="step-n">1</div>
                <h3>Ehtiyojlarni o‘rganish</h3>
                <p>Savdo nuqtalari soni, amaldagi dasturlar va kerakli kassa uskunalari ro‘yxatini aniqlaymiz.</p>
              </li>
              <li className="step">
                <div className="step-n">2</div>
                <h3>Smeta va yechim tanlash</h3>
                <p>Byudjetingizga mos dasturiy ta’minot va sertifikatlangan apparat smetasini tasdiqlaymiz.</p>
              </li>
              <li className="step">
                <div className="step-n">3</div>
                <h3>O‘rnatish va sozlash</h3>
                <p>Uskunalar Toshkent bo‘yicha yetkaziladi, drayverlar o‘rnatiladi va xodimlar o‘rgatiladi.</p>
              </li>
              <li className="step">
                <div className="step-n">4</div>
                <h3>Doimiy texnik ko‘mak</h3>
                <p>Kafolat doirasida uzluksiz texnik yordam va sarf materiallari bilan ta’minlash.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ==================== EQUIPMENT ==================== */}
        <section id="equipment" className="sec">
          <div className="wrap">
            <div className="sec-head">
              <h2>Kassa va biznes uskunalari</h2>
              <p>Toshkent omboridagi mavjud uskunalar bo‘yicha narxlarni Telegram orqali bilib oling.</p>
            </div>

            <div className="equip">
              <h3>Uskunalar katalogi yangilanmoqda</h3>
              <p>Biznesingiz uchun monobloklar, chek printerlar, skanerlar va biometrik qurilmalarning to‘liq assortimenti tez kunda saytda e’lon qilinadi. Hozirgi mavjud uskunalar ro‘yxati va narxlarini Telegram orqali olishingiz mumkin.</p>

              <div className="chips">
                <div className="chip"><span className="tile"><svg className="ico"><use href="#i-monitor"/></svg></span>Monobloklar va POS terminallar</div>
                <div className="chip"><span className="tile"><svg className="ico"><use href="#i-printer"/></svg></span>Chek printerlar (58mm / 80mm)</div>
                <div className="chip"><span className="tile"><svg className="ico"><use href="#i-scan"/></svg></span>Shtrix-kod skanerlar (1D / 2D)</div>
                <div className="chip"><span className="tile"><svg className="ico"><use href="#i-drawer"/></svg></span>Avtomatik kassa qutilari</div>
                <div className="chip"><span className="tile"><svg className="ico"><use href="#i-face"/></svg></span>Face ID va biometrik terminallar</div>
                <div className="chip"><span className="tile"><svg className="ico"><use href="#i-nfc"/></svg></span>NFC kartalar va o‘quvchilar</div>
              </div>

              <div className="equip-actions">
                <a className="btn btn-primary" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener noreferrer"><svg className="ico"><use href="#i-send"/></svg>Telegram orqali narxlar ro‘yxatini olish</a>
                <button className="btn btn-white" onClick={() => openModal('equipment_setup')}>Menejerga so‘rov qoldirish</button>
              </div>
              <div className="equip-meta"><svg className="ico"><use href="#i-pin"/></svg>Toshkent ombori</div>
            </div>
          </div>
        </section>

        {/* ==================== WHY US ==================== */}
        <section id="why-us" className="sec" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head">
              <h2>Dasturiy ta’minot va kassa apparatlari yagona mas’uliyat ostida</h2>
              <p>Odatda dastur bir joydan, uskuna boshqa joydan olinadi. Nosozlik chiqsa, tomonlar bir-birini ayblaydi. DashboardSale bu muammoni yo‘q qiladi.</p>
            </div>
            <div className="why">
              <div className="why-col why-old">
                <h3>Bozordagi an’anaviy usul</h3>
                <ul>
                  <li><svg className="ico"><use href="#i-x"/></svg>Dastur va uskunalar alohida joylardan olinadi.</li>
                  <li><svg className="ico"><use href="#i-x"/></svg>Muammo chiqqanda tomonlar aybni bir-biriga ag‘daradi.</li>
                  <li><svg className="ico"><use href="#i-x"/></svg>Drayverlar va fiskal protokollar mos kelmasligi xavfi.</li>
                  <li><svg className="ico"><use href="#i-x"/></svg>Kafolat va servis xizmati noaniq yoki yo‘q.</li>
                </ul>
              </div>
              <div className="why-col why-new">
                <h3>DashboardSale tizimi</h3>
                <ul>
                  <li><svg className="ico"><use href="#i-check"/></svg>Dastur va apparat bir-biriga 100% moslashtirilgan.</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Yagona servis markazi to‘liq javobgarlikni oladi.</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>Sinovdan o‘tgan drayverlar bilan to‘liq sozlanadi.</li>
                  <li><svg className="ico"><use href="#i-check"/></svg>12 oylik rasmiy servis kafolati va doimiy texnik ko‘mak.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section id="faq" className="sec" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head" style={{ marginBottom: 44 }}>
              <h2>Ko‘p beriladigan savollar</h2>
            </div>
            <div className="faq">
              <details name="faq" open>
                <summary>Uskunalar qanday kafolat bilan yetkazib beriladi?<span className="plus"><svg className="ico"><use href="#i-plus"/></svg></span></summary>
                <div className="ans">Biz taqdim etayotgan barcha monobloklar, termal chek printerlar, shtrix-kod skanerlar va biometrik terminallar rasmiy 12 oylik servis kafolatiga ega.</div>
              </details>
              <details name="faq">
                <summary>Mavjud 1C yoki savdo dasturlarimizga ulay olasizlarmi?<span className="plus"><svg className="ico"><use href="#i-plus"/></svg></span></summary>
                <div className="ans">Ha, biz taqdim etayotgan uskunalar va hisob-kitob botlari 1C, BILLZ, Jowi, R-Keeper, iiko hamda boshqa ommabop dasturlar bilan to‘liq mos keladi va sinovdan o‘tgan drayverlarga ega.</div>
              </details>
              <details name="faq">
                <summary>Buyurtma qancha vaqtda yetkazib beriladi va o‘rnatiladi?<span className="plus"><svg className="ico"><use href="#i-plus"/></svg></span></summary>
                <div className="ans">Toshkent shahri bo‘ylab buyurtmalar tasdiqlangan kuni yoki 24 soat ichida yetkazib beriladi va mutaxassislarimiz tomonidan o‘rnatiladi. Viloyatlarga yetkazib berish 1-2 ish kuni ichida amalga oshiriladi.</div>
              </details>
              <details name="faq">
                <summary>Dasturiy ta’minotni uskunalar xarid qilmasdan ham buyurtma qilish mumkinmi?<span className="plus"><svg className="ico"><use href="#i-plus"/></svg></span></summary>
                <div className="ans">Albatta. Agar sizda tayyor kompyuter va uskunalar mavjud bo‘lsa, biz faqat dasturiy ta’minot, Telegram savdo boti yoki davomat tizimini o‘rnatib sozlab beramiz.</div>
              </details>
              <details name="faq">
                <summary>To‘lov qanday shakllarda qabul qilinadi?<span className="plus"><svg className="ico"><use href="#i-plus"/></svg></span></summary>
                <div className="ans">Yuridik shaxslar uchun shartnoma asosida bank o‘tkazmasi (hisobvaraq-faktura bilan), korporativ kartalar hamda Payme, Click orqali to‘lovlarni qabul qilamiz.</div>
              </details>
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section id="contact" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="cta">
              <h2>Biznesingiz uchun optimal yechimni hisoblab beramiz</h2>
              <p>Savdo nuqtangizga mos dasturiy modul va kassa apparatlari to‘plamini tanlash bo‘yicha mutaxassisimiz bilan maslahatlashing.</p>
              <div className="row">
                <button className="btn btn-white btn-lg" onClick={() => openModal('general')}>Bepul konsultatsiya olish</button>
                <a className="btn btn-ghost-w btn-lg" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener noreferrer"><svg className="ico"><use href="#i-send"/></svg>Telegram orqali yozish</a>
              </div>
              <div className="meta">Qo‘ng‘iroq qiling: <a href="tel:+998901234567">+998 90 123 45 67</a> · Toshkent, O‘zbekiston</div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer>
        <div className="wrap">
          <div className="foot">
            <div>
              <Link href="/" className="logo" aria-label="DashboardSale">
                <span className="logo-mark" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="13" width="4.500" height="8" rx="1.500"/><rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/><rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/></svg>
                </span>
                <span className="logo-word" style={{ fontSize: 18 }}>DashboardSale</span>
              </Link>
              <p>Savdo tizimlari, biznes botlari, davomat nazorati va AI yechimlari — uskunalar bilan birgalikda, yagona hamkor orqali.</p>
            </div>
            <div>
              <h4>Xizmatlar</h4>
              <ul>
                <li><a href="#services">Veb-saytlar va savdo ilovalari</a></li>
                <li><a href="#services">Buxgalteriya va biznes botlari</a></li>
                <li><a href="#services">Xodimlar davomati</a></li>
                <li><a href="#services">AI kamera va monitoring</a></li>
                <li><a href="#services">Biznes uskunalari va montaj</a></li>
              </ul>
            </div>
            <div>
              <h4>Uskunalar</h4>
              <ul>
                <li><a href="#equipment">Monobloklar va POS terminallar</a></li>
                <li><a href="#equipment">Chek printerlar</a></li>
                <li><a href="#equipment">Shtrix-kod skanerlar</a></li>
                <li><a href="#equipment">Kassa qutilari</a></li>
                <li><a href="#equipment">Face ID va biometriya</a></li>
              </ul>
            </div>
            <div>
              <h4>Aloqa</h4>
              <ul>
                <li><a className="phone-l" href="tel:+998901234567">+998 90 123 45 67</a></li>
                <li><a href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener noreferrer">Telegram bot</a></li>
                <li><a href="#contact">Toshkent, O‘zbekiston</a></li>
                <li><a href="#contact">Du–Sha: 09:00–19:00</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 DashboardSale. Barcha huquqlar himoyalangan.</span>
            <span>Toshkent bo‘yicha texnik ko‘rik va konsultatsiya bepul.</span>
          </div>
        </div>
      </footer>

      {/* ==================== COOKIE ==================== */}
      {cookieVisible && (
        <div className="cookie" id="cookie" role="region" aria-label="Cookie xabari">
          <p>Biz saytdan qulay foydalanish uchun cookie fayllaridan foydalanamiz. Saytdan foydalanishni davom ettirib, shu fayllar bilan ishlashga rozilik bildirasiz.</p>
          <button className="btn" id="cookieOk" onClick={handleCookieOk}>Yaxshi</button>
        </div>
      )}

      {/* ==================== MODAL ==================== */}
      {modalOpen && (
        <div id="inquiryModal" className="modal" onClick={(e) => { if ((e.target as HTMLElement).id === 'inquiryModal') closeModal(); }}>
          <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div className="modal-head">
              <div>
                <h3 id="modalTitle">Konsultatsiya so‘rovi</h3>
                <p>Telefon raqamingizni qoldiring, mutaxassis siz bilan bog‘lanadi.</p>
              </div>
              <button className="x" onClick={closeModal} aria-label="Yopish"><svg className="ico"><use href="#i-x"/></svg></button>
            </div>

            {!formSubmitted ? (
              <form id="inquiryForm" onSubmit={handleFormSubmit}>
                <label className="field"><span>Xizmat yo‘nalishi</span>
                  <select
                    id="modalServiceSelect"
                    className="input"
                    value={modalService}
                    onChange={(e) => setModalService(e.target.value)}
                  >
                    <option value="online_store">Veb-saytlar va savdo ilovalari</option>
                    <option value="accounting_bots">Buxgalteriya va biznes botlari</option>
                    <option value="attendance">Xodimlar davomati va nazorat tizimlari</option>
                    <option value="ai_cameras">AI kamera va aqlli monitoring</option>
                    <option value="equipment_setup">Biznes uskunalari va montaj</option>
                    <option value="general">Umumiy konsultatsiya / Boshqa</option>
                  </select>
                </label>
                <div className="form-row">
                  <label className="field"><span>Ismingiz</span>
                    <input
                      className="input"
                      type="text"
                      required
                      placeholder="Sardor Aliyev"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      autoComplete="name"
                    />
                  </label>
                  <label className="field"><span>Telefon</span>
                    <input
                      className="input"
                      type="tel"
                      required
                      placeholder="+998 90 123 45 67"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </label>
                </div>
                <label className="field"><span>Do‘kon yoki korxona nomi</span>
                  <input
                    className="input"
                    type="text"
                    placeholder="Masalan: Safia Resto yoki Minimarket"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </label>
                <label className="field"><span>Savol yoki talablaringiz</span>
                  <textarea
                    className="input"
                    rows={2}
                    placeholder="Qanday muammoni hal qilmoqchisiz..."
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                  />
                </label>
                <button type="submit" id="submitBtn" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Yuborilmoqda...' : 'So‘rovni yuborish'}
                </button>
              </form>
            ) : (
              <div id="successNotice" className="done">
                <span className="tile"><svg className="ico"><use href="#i-check"/></svg></span>
                <h4>So‘rovingiz qabul qilindi</h4>
                <p>Mutaxassisimiz tez orada siz bilan bog‘lanadi.</p>
                <a className="btn btn-primary" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener noreferrer">Telegram orqali yozish</a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
