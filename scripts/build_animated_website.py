import os
import re
import shutil

USER_HTML_PATH = '/home/actualtam/.gemini/antigravity/brain/7b9b298e-2279-43e0-aa14-a827d83d923c/.user_uploaded/media_1792940337317.html'

with open(USER_HTML_PATH, 'r', encoding='utf-8') as f:
    html = f.read()

print(f"Loaded user animated HTML template ({len(html)} bytes)")

# 1. Inject Telegram WebApp SDK & Theme CSS in <head>
theme_css = '''
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    /* Theme support */
    [data-theme="dark"] {
      --white: #0c101a;
      --soft: #141a27;
      --line: #222c3d;
      --ink: #f0f4fc;
      --mute: #9aa5b9;
      --tint: #142244;
      --card-bg: #141a27;
      --card-border: #222c3d;
    }
    .motion-toggle-btn {
      display: inline-flex; align-items: center; gap: 6px;
      height: 44px; padding: 0 16px; border-radius: 999px;
      background: var(--soft); font-weight: 700; font-size: 13.5px;
      color: var(--ink); border: 1px solid var(--line);
      cursor: pointer; transition: all .2s;
    }
    .motion-toggle-btn:hover { background: var(--tint); color: var(--blue); }
    .motion-toggle-btn.active { background: var(--blue); color: #fff; border-color: var(--blue); }
    .theme-toggle-btn {
      display: inline-flex; align-items: center; gap: 6px;
      height: 44px; padding: 0 16px; border-radius: 999px;
      background: var(--soft); font-weight: 700; font-size: 14px;
      color: var(--ink); border: 1px solid var(--line);
      cursor: pointer; transition: all .2s;
    }
    .theme-toggle-btn:hover { background: var(--tint); color: var(--blue); }
    .lang-switcher {
      display: inline-flex; align-items: center; gap: 4px;
      background: var(--soft); border-radius: 999px; padding: 4px;
      border: 1px solid var(--line);
    }
    .lang-btn {
      padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700;
      color: var(--mute); background: none; border: 0; cursor: pointer; transition: all .15s;
    }
    .lang-btn.active, .lang-btn:hover { background: var(--blue); color: #fff; }
    
    /* Service card click styling */
    .svc, .svc-wide { cursor: pointer; }
    .svc-hero {
      background: var(--tint); border-radius: 44px; padding: 48px;
      display: flex; flex-direction: column; gap: 32px;
      border: 2px solid rgba(11,92,255,0.2);
      box-shadow: 0 16px 40px rgba(11,92,255,0.08);
      transition: all .25s ease;
    }
    .svc-hero:hover { transform: translateY(-4px); box-shadow: 0 24px 50px rgba(11,92,255,0.18); }
    .svc-hero-split { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: center; }
    @media (max-width: 900px) { .svc-hero-split { grid-template-columns: 1fr; } }
    .svc-icon-tile { width: 56px; height: 56px; border-radius: 16px; background: var(--soft); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; padding: 8px; }
    .svc-icon-img { width: 100%; height: 100%; object-fit: contain; }
    .badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 700; background: var(--tint); color: var(--blue); }
    .svc-visual-img { width: 100%; height: auto; max-height: 280px; object-fit: contain; border-radius: 20px; }
    
    /* Ensure WebGL canvases fill cleanly */
    .shot canvas.gl, .install-vis canvas.gl {
      border-radius: inherit;
    }
  </style>
'''
html = html.replace('</head>', theme_css + '\n</head>')

# 2. Update Topbar
new_topbar = '''
  <div class="topbar">
    <div class="wrap">
      <div class="topbar-l">
        <span class="label">Menejer bilan bog‘lanish:</span>
        <a class="phone" href="tel:+998781130022">+998 78 113 00 22</a>
        <a class="pill pill-tg" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
          <span class="tg-dot"><svg viewBox="0 0 24 24"><use href="#i-send"/></svg></span>
          Telegram Bot
        </a>
      </div>
      <div class="topbar-r">
        <span class="pill hours"><svg class="ico"><use href="#i-clock"/></svg>Du–Sha 09:00–19:00</span>
        <button class="motion-toggle-btn" onclick="toggle3DMotion()" id="motionToggleBtn" title="3D Animatsiyani yoqish / Harakatsiz">
          <span class="motion-icon">⏸️</span>
          <span class="motion-text">Harakatsiz</span>
        </button>
        <button class="theme-toggle-btn" onclick="toggleTheme()" title="Qora / Oq fon">
          <span class="theme-icon">🌙</span>
          <span class="theme-text">Tungi</span>
        </button>
        <div class="lang-switcher">
          <button class="lang-btn active" data-lang="uz" onclick="setLanguage('uz')">UZ</button>
          <button class="lang-btn" data-lang="ru" onclick="setLanguage('ru')">RU</button>
          <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
        </div>
      </div>
    </div>
  </div>
'''
tb_start = html.find('<!-- ==================== TOP BAR ==================== -->')
if tb_start == -1: tb_start = html.find('<div class="topbar">')
tb_end = html.find('<!-- ==================== NAV ==================== -->')
if tb_start != -1 and tb_end != -1:
    html = html[:tb_start] + '<!-- ==================== TOP BAR ==================== -->' + new_topbar + '\n  ' + html[tb_end:]

# 3. Update Nav
new_nav = '''
  <header class="nav">
    <div class="wrap">
      <a href="#" class="logo" aria-label="DashboardSale — bosh sahifa">
        <span class="logo-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="13" width="4.500" height="8" rx="1.500"/><rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/><rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/></svg>
        </span>
        <span class="logo-word">DashboardSale</span>
      </a>
      <nav class="nav-links" aria-label="Asosiy menyu">
        <a href="#services">Xizmatlar</a>
        <a href="market.html" style="font-weight:800;color:var(--blue);">Jihozlar</a>
        <a href="#process">Jarayon</a>
        <a href="#install">Montaj</a>
        <a href="#why-us">Nega biz</a>
        <a href="#faq">Savol-javob</a>
      </nav>
      <div class="nav-cta">
        <a class="btn btn-primary nav-demo" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
          <svg class="ico"><use href="#i-send"/></svg>
          <span>Telegram</span>
        </a>
        <button class="burger" id="burger" aria-label="Menyuni ochish" aria-expanded="false" aria-controls="drawer">
          <svg class="ico"><use href="#i-plus"/></svg>
        </button>
      </div>
    </div>
    <div class="drawer" id="drawer">
      <div class="wrap">
        <a class="dl" href="#services">Xizmatlar</a>
        <a class="dl" href="market.html" style="font-weight:800;color:var(--blue);">🛍 Jihozlar do‘koni</a>
        <a class="dl" href="#process">Jarayon</a>
        <a class="dl" href="#install">Montaj</a>
        <a class="dl" href="#why-us">Nega biz</a>
        <a class="dl" href="#faq">Savol-javob</a>
        <a class="dl" href="#contact">Aloqa</a>
        <a class="btn btn-primary" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">Telegram orqali bog‘lanish</a>
      </div>
    </div>
  </header>
'''
nav_start = html.find('<!-- ==================== NAV ==================== -->')
nav_end = html.find('<main>')
if nav_start != -1 and nav_end != -1:
    html = html[:nav_start] + '<!-- ==================== NAV ==================== -->' + new_nav + '\n\n  ' + html[nav_end:]

# 4. In Hero actions, update buttons
html = html.replace('href="#equipment"', 'href="market.html"')
html = html.replace('Uskunalar katalogi', 'Jihozlar do‘koni')

# 5. Update Services section
new_services = '''
  <!-- ==================== SERVICES ==================== -->
  <section id="services" class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2>Biznesingiz uchun to‘liq texnologik xizmatlar</h2>
        <p>Savdodan tortib buxgalteriya, xodimlar nazorati va kassa jihozlarigacha bo‘lgan barcha jarayonlarni avtomatlashtiramiz. Har bir xizmat alohida tizimga va interaktiv taqdimotga ega.</p>
      </div>

      <!-- Hero Service: Telegram Mini App do'koni va yetkazib berish (TGShop) -->
      <article class="svc-hero" onclick="location.href='services-tg-shop.html#presentation'">
        <div class="svc-hero-split">
          <div class="svc-lead">
            <div class="svc-icon-tile">
              <img src="/images/services/icon-tg-shop.png" alt="Telegram Mini App Do‘koni" class="svc-icon-img"/>
            </div>
            <span class="badge" style="background:#0b5cff;color:#fff;margin-bottom:12px;">⚡ Yangi & Eng ommabop</span>
            <h3 style="font-size:28px;font-weight:800;margin:8px 0 12px;line-height:1.2;">Telegram Mini App do‘koni va yetkazib berish (TGShop)</h3>
            <p style="font-size:16px;color:var(--mute);line-height:1.6;margin-bottom:18px;">Mijozlaringiz hech qanday ilova yuklamasdan, to‘g‘ridan-to‘g‘ri Telegram ichida tovar tanlaydi, rang/o‘lcham belgilaydi, geolokatsiyasini yuborib Yandex Go orqali Click/Payme bilan xarid qiladi. Kuryer boti, buyurtma statuslari va 1C integratsiyasi bilan to‘liq jihozlangan tizim!</p>
            <a class="svc-link" href="services-tg-shop.html#presentation" style="font-weight:800;color:var(--blue);" onclick="event.stopPropagation();">
              <span>Batafsil 4 bosqichli jonli taqdimotni ko‘rish</span>
              <svg class="ico"><use href="#i-arrow"/></svg>
            </a>
          </div>
          <div style="background:#e4f3fa;border-radius:24px;padding:20px;display:flex;align-items:center;justify-content:center;">
            <img src="/images/services/svc-tg-shop.png" alt="Telegram Mini App do‘koni va dastavka tizimi" class="svc-visual-img" loading="eager"/>
          </div>
        </div>
        <div class="mini-grid">
          <div class="mini"><h4>📱 WebApp vitrina</h4><p>Qulay katalog, rang/o‘lcham tanlash, savat va promokodlar.</p></div>
          <div class="mini"><h4>📍 Geolokatsiya & Dastavka</h4><p>Xaritadan manzilni tanlash va Yandex Go orqali avto-hisob.</p></div>
          <div class="mini"><h4>💳 Click, Payme, Uzum</h4><p>Bir bosishda xavfsiz onlayn to‘lov va fiskal chek.</p></div>
          <div class="mini"><h4>🛵 Kuryer boti & Statuslar</h4><p>Buyurtma yo‘lda xabarnomasi va kuryerlar uchun alohida bot.</p></div>
        </div>
      </article>

      <div class="svc-grid" style="margin-top:28px;">
        <!-- Service 2: Veb-saytlar va savdo ilovalari -->
        <article class="svc" onclick="location.href='services-online-store.html#presentation'">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-pos-terminal.png" alt="Veb-saytlar" class="svc-icon-img"/>
          </div>
          <span class="badge" style="margin-bottom:8px;">Ko‘p kanalli savdo</span>
          <h3>Veb-saytlar va onlayn savdo platformasi</h3>
          <p>Do‘koningiz uchun zamonaviy veb-sayt, savat, onlayn to‘lov va kuryerlik yetkazib berish integratsiyasi bilan to‘liq jihozlangan savdo tizimlari.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Tezkor katalog, savat va qidiruv filtrlari</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Payme, Click, Uzum orqali onlayn to‘lov</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Do‘kondagi kassa bilan qoldiqlar sinxronizatsiyasi</li>
          </ul>
          <a class="svc-link" href="services-online-store.html#presentation" onclick="event.stopPropagation();">
            <span>Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 3: Buxgalteriya va biznes botlari -->
        <article class="svc" onclick="location.href='services-accounting-bots.html#presentation'">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-analytics-dashboard.png" alt="Buxgalteriya botlari" class="svc-icon-img"/>
          </div>
          <span class="badge" style="margin-bottom:8px;">1C & Moliya nazorati</span>
          <h3>Buxgalteriya va biznes botlari</h3>
          <p>1C / ERP tizimlari bilan to‘g‘ridan-to‘g‘ri sinxronlashuvchi, smena yopilishi, kunlik tushum va qoldiqlar haqida Telegram orqali xabar beruvchi aqlli botlar.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>1C:Korxona va ERP bilan ikki tomonlama sinxronizatsiya</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kunlik tushum, kassa hisoboti va kassir smenasi</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kam qolgan tovarlar bo‘yicha avtomatik xabarnoma</li>
          </ul>
          <a class="svc-link" href="services-accounting-bots.html#presentation" onclick="event.stopPropagation();">
            <span>Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 4: Xodimlar davomati va nazorat tizimlari -->
        <article class="svc" onclick="location.href='services-attendance.html#presentation'">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-face-attendance.png" alt="Face ID davomat" class="svc-icon-img"/>
          </div>
          <span class="badge" style="margin-bottom:8px;">Biometriya</span>
          <h3>Xodimlar davomati va nazorat tizimlari</h3>
          <p>Face ID va biometriya orqali xodimlar keldi-ketdisini aniq qayd etish. Kechikishlar va sababsiz kelmasliklarni hisoblab, oylik maosh jadvaliga uzatish.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Face ID biometrik terminallari va turniket montaji</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kechikishlar va ish vaqti daqiqasigacha tahlili</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Oylik maosh hisob-kitobi bilan avtomat integratsiya</li>
          </ul>
          <a class="svc-link" href="services-attendance.html#presentation" onclick="event.stopPropagation();">
            <span>Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 5: AI kamera va aqlli monitoring -->
        <article class="svc" onclick="location.href='services-ai-cameras.html#presentation'">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-ai-camera-heatmap.png" alt="AI videokuzatuv" class="svc-icon-img"/>
          </div>
          <span class="badge" style="margin-bottom:8px;">Smart monitoring</span>
          <h3>AI kamera va aqlli monitoring</h3>
          <p>Sun’iy intellekt asosidagi videokuzatuv tizimi savdo nuqtasidagi eng gavjum hududlarni aniqlaydi, kassadagi qallobliklarni fosh etadi va xavfsizlikni ta’minlaydi.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Mijozlar oqimi va eng gavjum zonalar xaritasi (Heatmap)</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kassadagi navbat monitoringi va xizmat ko‘rsatish tezligi</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kassadagi shubhali holatlar va qoidabuzarliklar nazorati</li>
          </ul>
          <a class="svc-link" href="services-ai-cameras.html#presentation" onclick="event.stopPropagation();">
            <span>Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 6: Kassa uskunalarini o‘rnatish va montaj -->
        <article class="svc" onclick="location.href='services-equipment-setup.html#presentation'">
          <div class="svc-icon-tile">
            <img src="/images/services/icon-equipment-setup.png" alt="Kassa uskunalari" class="svc-icon-img"/>
          </div>
          <span class="badge" style="margin-bottom:8px;">Kassa uskunalari</span>
          <h3>Kassa uskunalarini o‘rnatish va montaj</h3>
          <p>Sensorli monobloklar, chek printerlari, 2D shtrix-kod skanerlari va kassa qutilarini yetkazib berish, montaj qilish va 1 kunda ishga tushirish.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Sensorli POS Monobloklar (15.6" IPS FHD)</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Tezkor chek printerlari (80mm avtomatik pichoq)</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Shtrix-kod skanerlari (1D / 2D / QR) va metall kassa qutilari</li>
          </ul>
          <a class="svc-link" href="services-equipment-setup.html#presentation" onclick="event.stopPropagation();">
            <span>Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>
      </div>
    </div>
  </section>
'''
svc_start = html.find('<!-- ==================== SERVICES ==================== -->')
svc_end = html.find('<!-- ==================== PROCESS ==================== -->')
if svc_start != -1 and svc_end != -1:
    html = html[:svc_start] + new_services + '\n\n  ' + html[svc_end:]

# 6. Update Equipment section with 4 categories and big market button
new_equipment = '''
  <!-- ==================== EQUIPMENT ==================== -->
  <section id="equipment" class="sec equip-sec" style="background:linear-gradient(180deg, var(--white) 0%, var(--soft) 100%);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
    <div class="wrap">
      <div class="sec-head" style="max-width:800px;margin:0 auto 36px;text-align:center;">
        <span class="badge" style="margin-bottom:12px;">Rasmiy kassa uskunalari do‘koni</span>
        <h2 data-i18n="sec_equip_title">Kassa va Savdo Jihozlari Do‘koni</h2>
        <p data-i18n="sec_equip_desc">Barcha kassa va savdo uskunalarimiz uchun alohida to‘liq qidiruvli, toifalangan va saralangan do‘kon sahifasi ishga tushirildi. 120 dan ortiq POS monobloklar, 2D skanerlar, printerlar va elektron tarozilar rasmiy 1 yil kafolat bilan.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:20px;margin-bottom:36px;">
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:18px;padding:24px;box-shadow:var(--shadow);text-align:center;">
          <div style="width:60px;height:60px;border-radius:14px;background:var(--tint);color:var(--blue);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">💻</div>
          <h4 style="font-size:18px;font-weight:700;color:var(--ink);margin-bottom:8px;">POS Monobloklar</h4>
          <p style="font-size:13.5px;color:var(--mute);line-height:1.5;margin-bottom:12px;">15.6" IPS sensorli ekranlar, i5 protsessorlar, 2 ekranli modellar.</p>
          <span style="font-size:12.5px;font-weight:700;color:var(--blue);background:var(--tint);padding:4px 10px;border-radius:999px;">23 ta model mavjud</span>
        </div>

        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:18px;padding:24px;box-shadow:var(--shadow);text-align:center;">
          <div style="width:60px;height:60px;border-radius:14px;background:var(--tint);color:var(--blue);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">🔍</div>
          <h4 style="font-size:18px;font-weight:700;color:var(--ink);margin-bottom:8px;">1D / 2D Skanerlar</h4>
          <p style="font-size:13.5px;color:var(--mute);line-height:1.5;margin-bottom:12px;">Statsionar ko‘p nurli va simsiz Bluetooth qo‘l skanerlari.</p>
          <span style="font-size:12.5px;font-weight:700;color:var(--blue);background:var(--tint);padding:4px 10px;border-radius:999px;">15 ta model mavjud</span>
        </div>

        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:18px;padding:24px;box-shadow:var(--shadow);text-align:center;">
          <div style="width:60px;height:60px;border-radius:14px;background:var(--tint);color:var(--blue);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">🖨</div>
          <h4 style="font-size:18px;font-weight:700;color:var(--ink);margin-bottom:8px;">Chek & Barkod Printerlar</h4>
          <p style="font-size:13.5px;color:var(--mute);line-height:1.5;margin-bottom:12px;">80mm avto-pichoqli chek printerlar va termo-etiketka chop etish.</p>
          <span style="font-size:12.5px;font-weight:700;color:var(--blue);background:var(--tint);padding:4px 10px;border-radius:999px;">18 ta model mavjud</span>
        </div>

        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:18px;padding:24px;box-shadow:var(--shadow);text-align:center;">
          <div style="width:60px;height:60px;border-radius:14px;background:var(--tint);color:var(--blue);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:26px;">⚖️</div>
          <h4 style="font-size:18px;font-weight:700;color:var(--ink);margin-bottom:8px;">Tarozilar & Qutilar</h4>
          <p style="font-size:13.5px;color:var(--mute);line-height:1.5;margin-bottom:12px;">Elektron savdo tarozilari, metall avtomat kassa qutilari.</p>
          <span style="font-size:12.5px;font-weight:700;color:var(--blue);background:var(--tint);padding:4px 10px;border-radius:999px;">10 ta model mavjud</span>
        </div>
      </div>

      <div style="text-align:center;padding:10px 0;">
        <a href="market.html" class="btn btn-primary btn-lg" style="display:inline-flex;align-items:center;gap:12px;font-size:17px;font-weight:800;padding:16px 36px;border-radius:14px;box-shadow:0 10px 28px rgba(11,92,255,0.25);">
          <svg class="ico" style="width:20px;height:20px;"><use href="#i-arrow"/></svg>
          <span>🛍 Jihozlar do‘koniga o‘tish (Barcha 120+ uskunani ko‘rish) →</span>
        </a>
      </div>
    </div>
  </section>
'''
eq_start = html.find('<!-- ==================== EQUIPMENT ==================== -->')
eq_end = html.find('<!-- ==================== WHY US ==================== -->')
if eq_start != -1 and eq_end != -1:
    html = html[:eq_start] + new_equipment + '\n\n  ' + html[eq_end:]

# 7. Update Install section actions to link to Telegram Bot
html = html.replace('href="https://t.me/DashboardSale777bot"', 'href="https://t.me/dashboardsalevvbot"')

# 8. Extract the second script tag (<script>(() => { ... })()</script>) and load it cleanly via /js/dashboardsale-3d.js
# First find the 2 script tags in html
s1_idx = html.find('<script>')
s2_idx = html.find('<script>', s1_idx + 1)
s2_end = html.find('</script>', s2_idx) + len('</script>')

# Replace script 2 with <script src="/js/dashboardsale-3d.js"></script>
html = html[:s2_idx] + '<script src="/js/dashboardsale-3d.js"></script>' + html[s2_end:]

# In script 1, add theme toggle and language switching functions
js_extras = '''
  // Language & Theme Handlers
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch(e) {}
    const btn = document.querySelector('.theme-toggle-btn .theme-icon');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  }
  function setLanguage(lang) {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }
'''
s1_end = html.find('</script>', s1_idx)
html = html[:s1_end] + js_extras + '\n  ' + html[s1_end:]

# Write to public/dashboardsale.html
with open('public/dashboardsale.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Also copy to root and bundle
os.makedirs('dashboardsale-bundle/js', exist_ok=True)
shutil.copy('public/dashboardsale.html', '/home/actualtam/.gemini/antigravity/scratch/dashboardsale.html')
shutil.copy('public/dashboardsale.html', 'dashboardsale-bundle/dashboardsale.html')
shutil.copy('public/dashboardsale.html', 'dashboardsale-bundle/index.html')
shutil.copy('public/js/dashboardsale-3d.js', 'dashboardsale-bundle/js/dashboardsale-3d.js')

print("Animated dashboardsale.html created successfully!")
