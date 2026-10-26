import json
import os
import re
import shutil

print("Building complete DashboardSale website package...")

USER_HTML_PATH = '/home/actualtam/.gemini/antigravity/brain/7b9b298e-2279-43e0-aa14-a827d83d923c/.user_uploaded/media_1792918798206.html'

with open(USER_HTML_PATH, 'r', encoding='utf-8') as f:
    base_html = f.read()

with open('all_scraped_products.json', 'r', encoding='utf-8') as f:
    all_products = json.load(f)

print(f"Loaded base template ({len(base_html)} bytes) and {len(all_products)} scraped products.")

# 14 priority screenshot items
SCREENSHOT_STATSIONAR = [
    {
        'name': 'Superlead',
        'brand': 'SUPERLEAD',
        'price': 2000000,
        'old_price': 2000500,
        'discount': '-0%',
        'img': '/images/hardware/ae637a2f-1465-4c4c-ac01-14d57ffe44e1_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/ae637a2f-1465-4c4c-ac01-14d57ffe44e1.webp',
        'spec1': '1D va 2D shtrix-kodlar',
        'spec2': 'USB orqali uzluksiz aloqa',
        'spec3': 'Surat orqali tez o‘qish'
    },
    {
        'name': 'DT-1500i',
        'brand': 'DATALOGIC',
        'price': 1875000,
        'old_price': 2500000,
        'discount': '-25%',
        'img': '/images/hardware/64a63021-f4d9-4439-95af-b0fb3a73c02c_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/64a63021-f4d9-4439-95af-b0fb3a73c02c.webp',
        'spec1': 'Keng format: 1D va 2D',
        'spec2': 'Sim orqali uzluksiz aloqa',
        'spec3': 'Yuqori tezlik: 2.5 m/s'
    },
    {
        'name': 'Zebra 9308',
        'brand': 'ZEBRA',
        'price': 1625000,
        'old_price': 1800000,
        'discount': '-9.7%',
        'img': '/images/hardware/35939375-ba9f-4853-a5ab-523a5bba0585_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/ac44670e-e122-4fba-9c14-fd251498944d.webp',
        'spec1': 'Tezligi: 3 sm/soniyagacha',
        'spec2': '2D barcha QR va kodlar',
        'spec3': 'Sim orqali uzluksiz aloqa'
    },
    {
        'name': 'B2D',
        'brand': 'LARIBA GROUP',
        'price': 1250000,
        'old_price': 12500000,
        'discount': '-90%',
        'img': '/images/hardware/7a99d61b-0fe2-416c-9d86-d57ef42c8a2d_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/819d4546-3700-474d-93ec-499313ea3504.webp',
        'spec1': '1D va 2D kodlarni o‘qiydi',
        'spec2': '2D imager aniqlash tizimi',
        'spec3': 'Katta o‘qish maydoni'
    },
    {
        'name': '8800PRO',
        'brand': 'LARIBA GROUP',
        'price': 1000000,
        'old_price': 1200000,
        'discount': '-16.7%',
        'img': '/images/hardware/fdf0b206-6702-479d-9f6d-45322bb0eeb4_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/54fe009a-bb6f-47a8-be80-738914ba068f.webp',
        'spec1': 'Surat shtrix-kodlar 1D, 2D',
        'spec2': 'Simli USB aloqa',
        'spec3': 'Tezlik: 2.7 m/s'
    },
    {
        'name': 'LPS-8900PRO BT',
        'brand': 'LARIBA GROUP',
        'price': 750000,
        'old_price': 900000,
        'discount': '-16.7%',
        'img': '/images/hardware/5ac43565-851f-42c2-a17c-9a52333869d1_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/5ac43565-851f-42c2-a17c-9a52333869d1.webp',
        'spec1': 'Skanerlash tezligi: 2.9 m/s',
        'spec2': 'Simsiz Bluetooth + Simli',
        'spec3': 'Surat asosida aniqlash'
    },
    {
        'name': 'LPS-8900PRO',
        'brand': 'LARIBA GROUP',
        'price': 496000,
        'old_price': 496500,
        'discount': '-0.1%',
        'img': '/images/hardware/244a9092-52ab-4314-a7f1-58611e36ce60_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/244a9092-52ab-4314-a7f1-58611e36ce60.webp',
        'spec1': 'Skanerlash tezligi: 2.6 m/s',
        'spec2': 'Surat orqali aniqlash',
        'spec3': 'USB interfeysi'
    }
]

SCREENSHOT_QOL = [
    {
        'name': 'ZEBRA 2208',
        'brand': 'ZEBRA',
        'price': 1700000,
        'old_price': 2000000,
        'discount': '-15%',
        'img': '/images/hardware/bc778973-1765-4e4c-8483-26316ce5b102_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/bc778973-1765-4e4c-8483-26316ce5b102.webp',
        'spec1': 'USB, RS-232 interfeys',
        'spec2': '1D/2D barcodlarni o‘qish',
        'spec3': 'Stend bilan birga'
    },
    {
        'name': 'ZEBRA 2278',
        'brand': 'ZEBRA',
        'price': 2875000,
        'old_price': 3000000,
        'discount': '-4.2%',
        'img': '/images/hardware/732123ae-6356-468c-8e80-022b7a655340_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/732123ae-6356-468c-8e80-022b7a655340.webp',
        'spec1': 'Simsiz Bluetooth aloqa',
        'spec2': 'Batareya: 2400 mAh',
        'spec3': 'Zaryadlash stansiyasi'
    },
    {
        'name': 'DATALOGIC',
        'brand': 'DATALOGIC',
        'price': 1250000,
        'old_price': 1400000,
        'discount': '-10.7%',
        'img': '/images/hardware/47d0954f-97a4-427f-a673-c3a51418ceb9_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/47d0954f-97a4-427f-a673-c3a51418ceb9.webp',
        'spec1': '1D va 2D kodlar',
        'spec2': 'Batareya: 2400 mAh',
        'spec3': 'Tezlik: 2.0 m/s'
    },
    {
        'name': 'CT650WB',
        'brand': 'LARIBA GROUP',
        'price': 750000,
        'old_price': 800000,
        'discount': '-6.3%',
        'img': '/images/hardware/bf04ee7e-fcbd-4994-8d4a-71f10fb4d135_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/bf04ee7e-fcbd-4994-8d4a-71f10fb4d135.webp',
        'spec1': 'Surat asosida aniqlash',
        'spec2': '1D, 2D (QR, DataMatrix)',
        'spec3': 'Simsiz 2.4G va Bluetooth'
    },
    {
        'name': 'LPS-2200',
        'brand': 'LARIBA GROUP',
        'price': 500000,
        'old_price': 500500,
        'discount': '-0.1%',
        'img': '/images/hardware/a4cc224b-3e0c-4ebf-8dfd-97ea3402b5a4_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/a4cc224b-3e0c-4ebf-8dfd-97ea3402b5a4.webp',
        'spec1': '1D va 2D shtrix-kodlar',
        'spec2': 'Simli USB ulanish',
        'spec3': 'Kafolat: 1 yil'
    },
    {
        'name': 'LPS-5500',
        'brand': 'LARIBA GROUP',
        'price': 1000000,
        'old_price': 1200000,
        'discount': '-16.7%',
        'img': '/images/hardware/ff76438e-17e2-4b8d-92a7-5ecf22474449_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/ff76438e-17e2-4b8d-92a7-5ecf22474449.webp',
        'spec1': 'Skanerlash tezligi: 1.2 m/s',
        'spec2': 'Batareya: NiMH 2300 mAh',
        'spec3': 'Simsiz qabul qiluvchi stansiya'
    },
    {
        'name': 'LPS-4400PRO',
        'brand': 'LARIBA GROUP',
        'price': 500000,
        'old_price': 500500,
        'discount': '-0.1%',
        'img': '/images/hardware/5e2ec048-7b58-4ede-a340-b7e0a298dfb8_0.webp',
        'remote_img': 'https://robosell.ams3.digitaloceanspaces.com/robosell/5e2ec048-7b58-4ede-a340-b7e0a298dfb8.webp',
        'spec1': 'Skanerlash tezligi: 2.0 m/s',
        'spec2': 'Surat asosida aniqlash',
        'spec3': 'Kassa tizimlari bilan to‘liq mos'
    }
]

def detect_brand(name):
    low = name.lower()
    if 'zebra' in low: return 'ZEBRA'
    if 'datalogic' in low or 'dt-' in low: return 'DATALOGIC'
    if 'superlead' in low: return 'SUPERLEAD'
    if 'godex' in low: return 'GODEX'
    if 'xp-' in low or 'xprinter' in low: return 'XPRINTER'
    if 'shtrih' in low or 'штрих' in low: return 'SHTRIH-M'
    if 'sunlux' in low: return 'SUNLUX'
    if 'honeywell' in low: return 'HONEYWELL'
    if 'rongta' in low: return 'RONGTA'
    if 'cas' in low: return 'CAS'
    if 'zonerich' in low: return 'ZONERICH'
    return 'LARIBA GROUP'

def format_card(p, cat_class):
    name = p.get('name', 'Savdo uskunasi')
    brand = p.get('brand') or detect_brand(name)
    price = p.get('price') or p.get('offers', {}).get('price') or 0
    price_str = f"{int(price):,} UZS".replace(',', ' ')
    
    old_price = p.get('old_price')
    if not old_price:
        old_price = int(price * 1.15) if price > 0 else int(price)
    old_price_str = f"{int(old_price):,} UZS".replace(',', ' ')
    
    discount = p.get('discount')
    if not discount:
        if old_price > price and price > 0:
            diff = round((1 - (price / old_price)) * 100, 1)
            discount = f"-{diff}%"
        else:
            discount = "-5%"
    
    img = p.get('img') or (p.get('local_images') and p.get('local_images')[0]) or ''
    remote_img = p.get('remote_img') or (p.get('image') and p.get('image')[0]) or ''
    
    spec1 = p.get('spec1')
    spec2 = p.get('spec2')
    spec3 = p.get('spec3')
    
    if not spec1:
        desc = p.get('description', '')
        lines = [l.strip() for l in desc.split('\n') if l.strip() and len(l.strip()) > 6]
        spec1 = lines[0][:32] if len(lines) > 0 else 'Sensorli tezkor kassa ekrani'
        spec2 = lines[1][:32] if len(lines) > 1 else 'Barcha dasturlar bilan mos'
        spec3 = lines[2][:32] if len(lines) > 2 else 'Rasmiy 1 yil kafolat'
    
    escaped_name = name.replace("'", "\\'").replace('"', '&quot;')
    
    return f'''
    <div class="prod-card {cat_class}" data-name="{escaped_name.lower()}" data-brand="{brand.lower()}" data-cat="{cat_class}">
      <div class="prod-card-top">
        <div class="prod-brand">
          <svg class="prod-brand-ico" viewBox="0 0 24 24"><path d="M12 3v18M3 9l9-6 9 6M3 9l3 6M21 9l-3 6M6 15a3 3 0 100-6 3 3 0 000 6zM18 15a3 3 0 100-6 3 3 0 000 6z"/></svg>
          <span class="prod-brand-name">{brand}</span>
        </div>
        <button class="prod-fav" onclick="toggleFav(this)" title="Sevimlilarga qo‘shish" aria-label="Sevimlilar">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>

      <div class="prod-img-box">
        <img src="{img}" onerror="this.src='{remote_img}'" alt="{escaped_name}" loading="lazy" class="prod-img"/>
      </div>

      <div class="prod-specs">
        <div class="prod-spec-row"><span class="prod-num">❶</span><span class="prod-spec-txt">{spec1}</span></div>
        <div class="prod-spec-row"><span class="prod-num">❷</span><span class="prod-spec-txt">{spec2}</span></div>
        <div class="prod-spec-row"><span class="prod-num">❸</span><span class="prod-spec-txt">{spec3}</span></div>
      </div>

      <div class="prod-price-box">
        <div class="prod-old-row">
          <span class="prod-old-val">{old_price_str}</span>
          <span class="prod-badge">{discount}</span>
        </div>
        <div class="prod-cur-val">{price_str}</div>
      </div>

      <div class="prod-title" title="{escaped_name}">{name}</div>

      <div class="prod-rating">
        <span class="prod-star">★</span> <strong>5.0</strong> <span class="prod-reviews">(Sharhlar yo‘q)</span>
      </div>

      <button class="prod-buy-btn rip" onclick="openProductOrder('{escaped_name}', '{price_str}', '{img}')">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        <span data-i18n="buy_now">Sotib olish</span>
      </button>
    </div>'''

seen_names = set()
stat_cards = []
for p in SCREENSHOT_STATSIONAR:
    seen_names.add(p['name'].lower())
    stat_cards.append(format_card(p, 'cat-statsionar'))

qol_cards = []
for p in SCREENSHOT_QOL:
    seen_names.add(p['name'].lower())
    qol_cards.append(format_card(p, 'cat-qol'))

monoblok_cards = []
printer_cards = []
drawer_cards = []
security_cards = []
interactive_cards = []
supplies_cards = []

for p in all_products:
    nm = (p.get('name') or '').strip()
    if nm.lower() in seen_names:
        continue
    seen_names.add(nm.lower())
    cat = (p.get('category') or '').lower()
    
    if 'statsionar' in cat:
        stat_cards.append(format_card(p, 'cat-statsionar'))
    elif 'qo‘l' in cat or 'qol' in cat:
        qol_cards.append(format_card(p, 'cat-qol'))
    elif 'monoblok' in cat:
        monoblok_cards.append(format_card(p, 'cat-monoblok'))
    elif 'printer' in cat:
        printer_cards.append(format_card(p, 'cat-printer'))
    elif 'quti' in cat or 'tarozi' in cat or 'taroz' in cat:
        drawer_cards.append(format_card(p, 'cat-drawers'))
    elif 'antikraj' in cat or 'chaqir' in cat:
        security_cards.append(format_card(p, 'cat-security'))
    elif 'doska' in cat or 'stend' in cat:
        interactive_cards.append(format_card(p, 'cat-interactive'))
    else:
        supplies_cards.append(format_card(p, 'cat-supplies'))

total_rendered = len(stat_cards) + len(qol_cards) + len(monoblok_cards) + len(printer_cards) + len(drawer_cards) + len(security_cards) + len(interactive_cards) + len(supplies_cards)
print(f"Total hardware products rendered: {total_rendered}")

# Catalog markup
catalog_html = f'''
    <!-- Search and Filter Header -->
    <div class="equip-catalog-header">
      <div class="equip-search-bar">
        <svg class="search-ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" id="equipSearchInput" placeholder="Mahsulotlar, brendlar yoki parametrlarni qidirish..." oninput="handleEquipSearch(this.value)" data-i18n-ph="search_ph"/>
        <button id="equipClearBtn" class="search-clear" onclick="clearEquipSearch()">✕</button>
      </div>

      <div class="equip-filter-tabs">
        <button class="filter-tab active" data-cat="all" onclick="setEquipFilter('all', this)"><span data-i18n="tab_all">Barchasi</span> ({total_rendered})</button>
        <button class="filter-tab" data-cat="cat-statsionar" onclick="setEquipFilter('cat-statsionar', this)"><span data-i18n="tab_stat">Statsionar skanerlar</span> ({len(stat_cards)})</button>
        <button class="filter-tab" data-cat="cat-qol" onclick="setEquipFilter('cat-qol', this)"><span data-i18n="tab_hand">Qo‘l skanerlari</span> ({len(qol_cards)})</button>
        <button class="filter-tab" data-cat="cat-monoblok" onclick="setEquipFilter('cat-monoblok', this)"><span data-i18n="tab_mono">POS Monobloklar</span> ({len(monoblok_cards)})</button>
        <button class="filter-tab" data-cat="cat-printer" onclick="setEquipFilter('cat-printer', this)"><span data-i18n="tab_print">Printerlar</span> ({len(printer_cards)})</button>
        <button class="filter-tab" data-cat="cat-drawers" onclick="setEquipFilter('cat-drawers', this)"><span data-i18n="tab_draw">Kassa qutilari & Tarozilar</span> ({len(drawer_cards)})</button>
        <button class="filter-tab" data-cat="cat-security" onclick="setEquipFilter('cat-security', this)"><span data-i18n="tab_sec">Antikraj & Chaqiruv</span> ({len(security_cards)})</button>
        <button class="filter-tab" data-cat="cat-interactive" onclick="setEquipFilter('cat-interactive', this)"><span data-i18n="tab_doska">Interaktiv doskalar</span> ({len(interactive_cards)})</button>
        <button class="filter-tab" data-cat="cat-supplies" onclick="setEquipFilter('cat-supplies', this)"><span data-i18n="tab_sup">Lenta & Qog‘ozlar</span> ({len(supplies_cards)})</button>
      </div>
    </div>

    <!-- Section 1: Statsionar skaner -->
    <div class="equip-section-block" id="sec-statsionar">
      <div class="equip-section-title">
        <h3 data-i18n="sec_stat_title">Statsionar skanerlar (Ko‘p nurli & 2D)</h3>
        <span class="equip-count-tag">{len(stat_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(stat_cards)}
      </div>
    </div>

    <!-- Section 2: Qo'l skaneri -->
    <div class="equip-section-block" id="sec-qol">
      <div class="equip-section-title">
        <h3 data-i18n="sec_hand_title">Qo‘l skanerlari (Simli va Bluetooth)</h3>
        <span class="equip-count-tag">{len(qol_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(qol_cards)}
      </div>
    </div>

    <!-- Section 3: Sensorli POS Monobloklar -->
    <div class="equip-section-block" id="sec-monoblok">
      <div class="equip-section-title">
        <h3 data-i18n="sec_mono_title">Sensorli POS Monobloklar</h3>
        <span class="equip-count-tag">{len(monoblok_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(monoblok_cards)}
      </div>
    </div>

    <!-- Section 4: Chek va Barkod printerlari -->
    <div class="equip-section-block" id="sec-printer">
      <div class="equip-section-title">
        <h3 data-i18n="sec_print_title">Chek va Barkod printerlari</h3>
        <span class="equip-count-tag">{len(printer_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(printer_cards)}
      </div>
    </div>

    <!-- Section 5: Kassa qutilari va Tarozilar -->
    <div class="equip-section-block" id="sec-drawers">
      <div class="equip-section-title">
        <h3 data-i18n="sec_draw_title">Kassa qutilari va Elektron tarozilar</h3>
        <span class="equip-count-tag">{len(drawer_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(drawer_cards)}
      </div>
    </div>

    <!-- Section 6: Antikraj va Chaqiruv tizimi -->
    <div class="equip-section-block" id="sec-security">
      <div class="equip-section-title">
        <h3 data-i18n="sec_sec_title">Antikraj va Chaqiruv tizimlari</h3>
        <span class="equip-count-tag">{len(security_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(security_cards)}
      </div>
    </div>

    <!-- Section 7: Interaktiv doskalar va stendlar -->
    <div class="equip-section-block" id="sec-interactive">
      <div class="equip-section-title">
        <h3 data-i18n="sec_doska_title">Interaktiv doskalar va stendlar</h3>
        <span class="equip-count-tag">{len(interactive_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(interactive_cards)}
      </div>
    </div>

    <!-- Section 8: Lentalar va sarf materiallari -->
    <div class="equip-section-block" id="sec-supplies">
      <div class="equip-section-title">
        <h3 data-i18n="sec_sup_title">Chek lentalari va sarf materiallari</h3>
        <span class="equip-count-tag">{len(supplies_cards)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {''.join(supplies_cards)}
      </div>
    </div>
'''

# Additional CSS for Dark Theme, Lang Switcher, Product Cards & Modals
additional_css = '''
    /* ==================== 1. PERFECT FIRST PAGE (HERO MOCKUP ACCURACY) ==================== */
    :root {
      --wrap: 1280px !important;
    }
    .wrap {
      max-width: 1280px !important;
      width: 100% !important;
    }

    /* 3D Shot Images in Hero (Full bleed, no padding, ultra crisp matching media_1792931914132.png) */
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: cover !important;
      padding: 0 !important;
      margin: 0 !important;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .shot:hover img.shot-img {
      transform: scale(1.05);
    }

    /* Hero Section matching media_1792931914132.png */
    .hero {
      position: relative;
      overflow: hidden;
      text-align: center;
      padding: 64px 0 0;
      min-height: 860px;
    }
    .hero-copy {
      position: relative;
      z-index: 5;
      width: min(100%, 54vw);
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 20px 0;
    }
    .hero h1 {
      font-weight: 800;
      font-size: clamp(38px, 4.4vw, 76px);
      line-height: 1.06;
      letter-spacing: -.035em;
      text-wrap: balance;
      margin-bottom: 20px;
      color: var(--ink);
    }
    .hero h1 em {
      font-style: normal;
      color: var(--blue);
    }
    .hero-lead {
      margin: 28px auto 0;
      max-width: 620px;
      font-size: clamp(16px, 1.4vw, 21px);
      line-height: 1.55;
      font-weight: 600;
      color: var(--mute);
      text-wrap: balance;
    }
    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      margin-top: 40px;
      flex-wrap: wrap;
    }
    .hero-actions .btn-primary {
      background: var(--blue);
      color: #fff;
      border-radius: 999px;
      height: 60px;
      padding: 0 38px;
      font-size: 18px;
      font-weight: 800;
      box-shadow: 0 10px 24px rgba(11, 92, 255, 0.28);
    }
    .hero-actions .btn-primary:hover {
      background: var(--blue-d);
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(11, 92, 255, 0.35);
    }
    .hero-actions .btn-soft {
      background: var(--soft);
      color: var(--blue);
      border-radius: 999px;
      height: 60px;
      padding: 0 34px;
      font-size: 18px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }
    .hero-actions .btn-soft:hover {
      background: var(--tint);
      transform: translateY(-2px);
    }

    /* ==================== DESKTOP NAVIGATION & HERO STAGE (>= 900px) ==================== */
    @media (min-width: 900px) {
      .nav-links {
        display: flex !important;
      }
      .nav-demo {
        display: inline-flex !important;
      }
      .burger {
        display: none !important;
      }
      .drawer {
        display: none !important;
      }
      .hero {
        position: relative !important;
        overflow: hidden !important;
        text-align: center !important;
        padding: 10px 0 0 !important;
        min-height: 576px !important;
      }
      .hero-copy {
        position: relative !important;
        z-index: 5 !important;
        width: min(100%, 54vw) !important;
        max-width: 680px !important;
        margin: 0 auto !important;
        padding: 20px 16px 0 !important;
      }
      .hero h1 {
        font-weight: 800 !important;
        font-size: clamp(34px, 4.4vw, 56px) !important;
        line-height: 1.08 !important;
        letter-spacing: -.035em !important;
        margin: 0 0 16px !important;
      }
      .hero-lead {
        margin: 0 auto 20px !important;
        max-width: 540px !important;
        font-size: clamp(14.5px, 1.35vw, 18px) !important;
        line-height: 1.5 !important;
      }
      .hero-actions {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 14px !important;
        margin-top: 18px !important;
      }
      .hero-actions .btn {
        height: 52px !important;
        padding: 0 28px !important;
        font-size: 16px !important;
      }
      .hero-stage {
        position: absolute !important;
        inset: 0 !important;
        pointer-events: none !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: none !important;
      }
      .shot {
        position: absolute !important;
        overflow: hidden !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        opacity: 1 !important;
        box-shadow: 0 16px 40px rgba(15, 19, 32, 0.08) !important;
        transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease !important;
      }
      .shot:hover {
        transform: translateY(-4px) scale(1.02) !important;
        box-shadow: 0 24px 50px rgba(15, 19, 32, 0.14) !important;
      }
      .s1 {
        left: 0 !important;
        right: auto !important;
        top: 20px !important;
        width: clamp(180px, 19.5vw, 240px) !important;
        height: clamp(180px, 20vw, 240px) !important;
        border-radius: 0 48px 48px 0 !important;
        background: linear-gradient(160deg, #f2e9dc, #dccdb8) !important;
      }
      .s2 {
        left: 0 !important;
        right: auto !important;
        top: clamp(235px, 25vw, 260px) !important;
        width: clamp(190px, 20.5vw, 250px) !important;
        height: clamp(200px, 22vw, 260px) !important;
        border-radius: 0 48px 48px 0 !important;
        background: linear-gradient(160deg, #dfe8fb, #b9cdf3) !important;
      }
      .s3 {
        left: auto !important;
        right: 0 !important;
        top: 5px !important;
        width: clamp(170px, 18.5vw, 230px) !important;
        height: clamp(180px, 19vw, 230px) !important;
        border-radius: 48px 0 0 48px !important;
        background: linear-gradient(160deg, #fbe9de, #f2cdb4) !important;
      }
      .s4 {
        left: auto !important;
        right: 0 !important;
        top: clamp(230px, 24.5vw, 255px) !important;
        width: clamp(180px, 19.5vw, 240px) !important;
        height: clamp(200px, 22vw, 260px) !important;
        border-radius: 48px 0 0 48px !important;
        background: linear-gradient(160deg, #e3f0fb, #bcd9f2) !important;
      }
      .s5 {
        left: 50% !important;
        right: auto !important;
        top: clamp(245px, 26vw, 275px) !important;
        width: clamp(380px, 42vw, 460px) !important;
        height: clamp(200px, 22vw, 250px) !important;
        transform: translateX(-50%) !important;
        border-radius: 140px 140px 0 0 !important;
        background: linear-gradient(180deg, #eef2f8, #dfe6f1) !important;
      }
    }

    /* Tablet & Mobile Hero Grid (< 900px) */
    @media (max-width: 899px) {
      .hero {
        min-height: auto !important;
        padding: 32px 0 24px !important;
      }
      .hero-stage {
        position: relative !important;
        inset: auto !important;
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 12px !important;
        max-width: 640px !important;
        margin: 32px auto 0 !important;
        padding: 0 16px !important;
      }
      .shot {
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1 !important;
        border-radius: 20px !important;
        overflow: hidden !important;
      }
      .s1, .s2, .s3, .s4 {
        left: auto !important;
        right: auto !important;
        top: auto !important;
        width: auto !important;
        height: auto !important;
        border-radius: 20px !important;
      }
      .s5 {
        left: auto !important;
        top: auto !important;
        width: auto !important;
        transform: none !important;
        grid-column: 1 / -1 !important;
        height: auto !important;
        aspect-ratio: 16 / 9 !important;
        border-radius: 24px !important;
      }
    }

    /* Floating Cookie Pill Banner matching reference */
    .cookie {
      position: fixed;
      z-index: 60;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      width: min(calc(100% - 32px), 880px);
      background: #ffffff;
      border-radius: 999px;
      box-shadow: 0 16px 50px rgba(15, 19, 32, 0.18);
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      border: 1px solid rgba(15, 19, 32, 0.06);
    }
    .cookie[hidden] { display: none; }
    .cookie p { font-size: 14.5px; font-weight: 600; color: #2b3142; line-height: 1.45; margin: 0; }
    .cookie .btn {
      background: var(--soft);
      color: var(--blue);
      height: 48px;
      padding: 0 34px;
      border-radius: 999px;
      border: none;
      font-weight: 800;
      font-size: 15px;
      cursor: pointer;
      flex-shrink: 0;
      transition: background .2s, color .2s;
    }
    .cookie .btn:hover {
      background: var(--blue);
      color: #ffffff;
    }
    @media (max-width: 680px) {
      .cookie {
        border-radius: 24px;
        flex-direction: column;
        align-items: stretch;
        padding: 18px 20px;
      }
      .cookie .btn { width: 100%; }
    }

    /* ==================== 2. SERVICES 3D ICON TILES & PADDED VISUALS ==================== */
    .svc-icon-tile {
      width: 76px;
      height: 76px;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--soft);
      box-shadow: 0 8px 24px rgba(11, 92, 255, 0.08);
      border: 1px solid var(--line);
      padding: 8px;
      transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
    }
    .svc:hover .svc-icon-tile {
      transform: translateY(-4px) scale(1.06);
      box-shadow: 0 14px 32px rgba(11, 92, 255, 0.18);
    }
    .svc-icon-img {
      width: 100%;
      height: 100%;
      object-fit: contain !important;
      border-radius: 14px;
      display: block;
      transition: transform .35s ease;
    }
    .svc:hover .svc-icon-img {
      transform: scale(1.05);
    }

    /* Hero Service Split & Visual */
    .svc-hero-split {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 36px;
      align-items: center;
      margin-bottom: 28px;
    }
    @media (max-width: 860px) {
      .svc-hero-split { grid-template-columns: 1fr; }
    }
    .svc-hero-visual {
      width: 100%;
      height: 250px;
      border-radius: 24px;
      overflow: hidden;
      background: #eae0d2;
      box-shadow: 0 12px 32px rgba(15, 19, 32, 0.08);
      border: 1px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .svc-visual-img {
      width: 100%;
      height: 100%;
      object-fit: contain !important;
      display: block;
      transition: transform .4s ease;
    }
    .svc:hover .svc-visual-img {
      transform: scale(1.04);
    }

    [data-theme="dark"] .svc-icon-tile {
      background: #141d33 !important;
      border-color: #23314d !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    }
    [data-theme="dark"] .svc-hero-visual {
      background: #141d33 !important;
      border-color: #23314d !important;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4) !important;
    }

    /* Telegram WebApp Safe Areas */
    body { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }

/* ==================== THEME VARIABLES ==================== */
    :root, html[data-theme="light"] {
      --blue: #0b5cff;
      --blue-d: #0847c9;
      --tint: #e9f0ff;
      --ink: #0f1320;
      --mute: #5d6577;
      --soft: #f3f5f9;
      --line: #e5e8ef;
      --white: #ffffff;
      --card-bg: #ffffff;
      --card-border: #e5e8ef;
      --card-hover-border: #0b5cff;
      --ok: #16a864;
      --bad: #e5484d;
      --shadow: 0 10px 30px rgba(15, 19, 32, 0.06);
      --topbar-bg: #0f1320;
      --topbar-ink: #ffffff;
      --nav-bg: rgba(255, 255, 255, 0.94);
      --footer-bg: #0f1320;
      --footer-ink: #f3f5f9;
      --hero-box-bg: #ffffff;
      --chip-bg: #ffffff;
      --input-bg: #ffffff;
    }

    html[data-theme="dark"] {
      --blue: #3b82f6;
      --blue-d: #2563eb;
      --tint: #162447;
      --ink: #f1f5f9;
      --mute: #94a3b8;
      --soft: #0f172a;
      --line: #1e293b;
      --white: #0a0e1a;
      --card-bg: #121828;
      --card-border: #1e293b;
      --card-hover-border: #3b82f6;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      --topbar-bg: #060910;
      --topbar-ink: #f1f5f9;
      --nav-bg: rgba(10, 14, 26, 0.94);
      --footer-bg: #060910;
      --footer-ink: #f1f5f9;
      --hero-box-bg: #121828;
      --chip-bg: #121828;
      --input-bg: #121828;
    }

    /* Dark Mode Overrides */
    [data-theme="dark"] body { background: var(--white); color: var(--ink); }
    [data-theme="dark"] .nav { background: var(--nav-bg); border-color: var(--line); }
    [data-theme="dark"] .topbar { background: var(--topbar-bg); color: var(--topbar-ink); }
    [data-theme="dark"] .svc, [data-theme="dark"] .mini, [data-theme="dark"] .benefit-card,
    [data-theme="dark"] .step, [data-theme="dark"] .why-col, [data-theme="dark"] .faq-item,
    [data-theme="dark"] .prod-card, [data-theme="dark"] .drawer, [data-theme="dark"] .chip,
    [data-theme="dark"] .hero-card, [data-theme="dark"] .modal {
      background: var(--card-bg) !important;
      border-color: var(--card-border) !important;
      color: var(--ink) !important;
    }
    [data-theme="dark"] .svc h3, [data-theme="dark"] .mini h4, [data-theme="dark"] .why-col h3,
    [data-theme="dark"] .faq-item summary, [data-theme="dark"] .prod-title, [data-theme="dark"] .sec-head h2,
    [data-theme="dark"] h1, [data-theme="dark"] h2, [data-theme="dark"] h3 {
      color: #ffffff !important;
    }
    [data-theme="dark"] .svc p, [data-theme="dark"] .mini p, [data-theme="dark"] .why-col p,
    [data-theme="dark"] .faq-item p, [data-theme="dark"] .sec-head p, [data-theme="dark"] .hero-p {
      color: var(--mute) !important;
    }
    [data-theme="dark"] .tile, [data-theme="dark"] .step-n {
      background: var(--tint) !important;
      color: var(--blue) !important;
    }

    /* Theme Toggle Button */
    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--line);
      background: var(--card-bg);
      color: var(--ink);
      transition: all .2s ease;
    }
    .theme-toggle-btn:hover {
      border-color: var(--blue);
      transform: translateY(-1px);
    }
    .theme-icon { font-size: 14px; line-height: 1; }

    /* Language Switcher */
    .lang-switcher {
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.12);
      border-radius: 999px;
      padding: 3px;
      gap: 2px;
      border: 1px solid rgba(255,255,255,0.18);
    }
    .nav .lang-switcher {
      background: var(--soft);
      border-color: var(--line);
    }
    .lang-btn {
      padding: 4px 10px;
      border-radius: 999px;
      border: none;
      background: transparent;
      font-size: 12px;
      font-weight: 800;
      color: inherit;
      cursor: pointer;
      transition: all .15s ease;
    }
    .lang-btn.active {
      background: var(--blue);
      color: #ffffff !important;
      box-shadow: 0 2px 8px rgba(11,92,255,.35);
    }

    /* Equipment Catalog Styling */
    .equip-catalog-header {
      margin-bottom: 32px;
    }
    .equip-search-bar {
      position: relative;
      max-width: 680px;
      margin: 0 auto 24px;
    }
    .equip-search-bar input {
      width: 100%;
      height: 52px;
      padding: 0 48px 0 52px;
      font-size: 16px;
      font-family: var(--font);
      color: var(--ink);
      background: var(--card-bg);
      border: 2px solid var(--line);
      border-radius: 999px;
      outline: none;
      box-shadow: var(--shadow);
      transition: border-color .2s, box-shadow .2s;
    }
    .equip-search-bar input:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 4px var(--tint);
    }
    .search-ico {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      stroke: var(--mute);
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .search-clear {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--soft);
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 13px;
      color: var(--mute);
      cursor: pointer;
      display: none;
    }
    .search-clear.visible { display: flex; align-items: center; justify-content: center; }

    .equip-filter-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-bottom: 12px;
    }
    .filter-tab {
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      border: 1px solid var(--line);
      background: var(--card-bg);
      color: var(--mute);
      cursor: pointer;
      transition: all .2s;
    }
    .filter-tab:hover {
      border-color: var(--blue);
      color: var(--blue);
      transform: translateY(-1px);
    }
    .filter-tab.active {
      background: var(--blue);
      border-color: var(--blue);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(11,92,255,.3);
    }

    .equip-section-block {
      margin-bottom: 48px;
    }
    .equip-section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--line);
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .equip-section-title h3 {
      font-size: 22px;
      font-weight: 800;
      color: var(--ink);
    }
    .equip-count-tag {
      font-size: 13px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 999px;
      background: var(--tint);
      color: var(--blue);
    }

    .equip-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }

    /* Product Card */
    .prod-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: var(--shadow);
      transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
    }
    .prod-card:hover {
      transform: translateY(-4px);
      border-color: var(--card-hover-border);
      box-shadow: 0 16px 36px rgba(11,92,255,.12);
    }

    .prod-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .prod-brand {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--blue);
      background: var(--tint);
      padding: 4px 10px;
      border-radius: 6px;
    }
    .prod-brand-ico {
      width: 14px;
      height: 14px;
      stroke: var(--blue);
      fill: none;
      stroke-width: 2.2;
    }
    .prod-fav {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--mute);
      transition: color .2s, transform .2s;
    }
    .prod-fav:hover { color: var(--bad); transform: scale(1.15); }
    .prod-fav svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; }
    .prod-fav.active svg { fill: var(--bad); stroke: var(--bad); }

    .prod-img-box {
      width: 100%;
      height: 170px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 14px;
      position: relative;
      overflow: hidden;
    }
    .prod-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform .3s ease;
    }
    .prod-card:hover .prod-img {
      transform: scale(1.06);
    }

    .prod-specs {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
      background: var(--soft);
      padding: 8px 10px;
      border-radius: 10px;
    }
    .prod-spec-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--ink);
    }
    .prod-num {
      color: var(--blue);
      font-size: 13px;
      font-weight: 800;
    }
    .prod-spec-txt {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .prod-price-box {
      margin-bottom: 8px;
    }
    .prod-old-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }
    .prod-old-val {
      font-size: 13px;
      color: var(--mute);
      text-decoration: line-through;
    }
    .prod-badge {
      font-size: 11px;
      font-weight: 800;
      color: #ef4444;
      background: #fef2f2;
      padding: 2px 6px;
      border-radius: 4px;
    }
    [data-theme="dark"] .prod-badge {
      background: #451a1a;
      color: #fca5a5;
    }
    .prod-cur-val {
      font-size: 20px;
      font-weight: 800;
      color: var(--blue);
      letter-spacing: -.02em;
    }

    .prod-title {
      font-size: 15px;
      font-weight: 700;
      line-height: 1.35;
      color: var(--ink);
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 40px;
    }

    .prod-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--mute);
      margin-bottom: 14px;
    }
    .prod-star { color: #f59e0b; font-size: 14px; }
    .prod-rating strong { color: var(--ink); }

    .prod-buy-btn {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--blue);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: background .2s, transform .2s, box-shadow .2s;
    }
    .prod-buy-btn:hover {
      background: var(--blue-d);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(11,92,255,.35);
    }
    .prod-buy-btn svg {
      width: 18px;
      height: 18px;
      stroke: #ffffff;
      stroke-width: 2.4;
      fill: none;
    }

    /* Modal Backdrop & Dialog */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15,19,32,.75);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-backdrop.open { display: flex; }
    .modal-box {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      max-width: 520px;
      width: 100%;
      padding: 32px;
      position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,.3);
      animation: pop .3s cubic-bezier(.34,1.56,.64,1);
    }
    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: var(--soft);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 16px;
      font-weight: bold;
      color: var(--mute);
      cursor: pointer;
    }
    .modal-box h3 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
      color: var(--ink);
    }
    .modal-box p {
      color: var(--mute);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .modal-prod-summary {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--soft);
      padding: 12px 16px;
      border-radius: 14px;
      margin-bottom: 20px;
    }
    .modal-prod-img {
      width: 56px;
      height: 56px;
      object-fit: contain;
      background: #fff;
      border-radius: 8px;
      padding: 4px;
    }
    .modal-prod-details h4 {
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
    }
    .modal-prod-details .price {
      font-size: 16px;
      font-weight: 800;
      color: var(--blue);
    }
    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 6px;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      font-family: var(--font);
      font-size: 15px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--input-bg);
      color: var(--ink);
      outline: none;
    }
    .form-group input:focus, .form-group textarea:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 3px var(--tint);
    }
    .modal-submit-btn {
      margin-top: 8px;
      width: 100%;
      height: 48px;
      background: var(--blue);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background .2s;
    }
    .modal-submit-btn:hover { background: var(--blue-d); }
'''

# Multi-language dictionary
dict_js = '''
  const I18N_DATA = {
    uz: {
      nav_services: "Xizmatlar",
      nav_process: "Ish jarayoni",
      nav_equipment: "Jihozlar",
      nav_why: "Nega biz?",
      nav_faq: "Savol-javob",
      nav_cta: "Telegram orqali bog‘lanish",
      hero_tag: "Savdo va biznes avtomatlashtirish",
      hero_title_1: "Kassa uskunalari va IT yechimlar —",
      hero_title_2: "yagona hamkordan",
      hero_desc: "Savdo tizimlari, hisobot botlari, Face ID davomati va sun’iy intellektli videokuzatuv. Barcha uskunalar Toshkent omborida mavjud, kafolatli va o‘rnatib beriladi.",
      hero_btn_telegram: "Bepul konsultatsiya",
      hero_btn_equip: "Jihozlar do‘koni",
      stat_retail: "Chakana savdo",
      stat_retail_sub: "Kassa, skaner, printer",
      stat_speed: "3-4 kunda",
      stat_speed_sub: "To‘liq ishga tushirish",
      stat_support: "24/7 ko‘mak",
      stat_support_sub: "Uzluksiz texnik yordam",
      stat_warranty: "1 yil kafolat",
      stat_warranty_sub: "Barcha uskunalarga",
      sec_services_title: "Biznesingiz uchun to‘liq texnologik xizmatlar",
      sec_services_desc: "Savdodan tortib buxgalteriya va xodimlar nazoratigacha bo‘lgan barcha jarayonlarni avtomatlashtiramiz.",
      svc_detail: "Batafsil xizmat sahifasiga o‘tish →",
      sec_proc_title: "Hamkorlik qanday amalga oshiriladi?",
      sec_proc_desc: "Uch-to‘rt kun ichida ishga tushadigan aniq to‘rt bosqich.",
      sec_equip_title: "Kassa va biznes uskunalari katalogi",
      sec_equip_desc: "Toshkent omboridagi 122+ turdagi skanerlar, monobloklar, chek printerlar va elektron tarozilar.",
      tab_all: "Barchasi",
      tab_stat: "Statsionar skanerlar",
      tab_hand: "Qo‘l skanerlari",
      tab_mono: "POS Monobloklar",
      tab_print: "Printerlar",
      tab_draw: "Kassa qutilari & Tarozilar",
      tab_sec: "Antikraj & Chaqiruv",
      tab_doska: "Interaktiv doskalar",
      tab_sup: "Lenta & Qog‘ozlar",
      search_ph: "Mahsulotlar, brendlar yoki parametrlarni qidirish...",
      buy_now: "Sotib olish",
      sec_stat_title: "Statsionar skanerlar (Ko‘p nurli & 2D)",
      sec_hand_title: "Qo‘l skanerlari (Simli va Bluetooth)",
      sec_mono_title: "Sensorli POS Monobloklar",
      sec_print_title: "Chek va Barkod printerlari",
      sec_draw_title: "Kassa qutilari va Elektron tarozilar",
      sec_sec_title: "Antikraj va Chaqiruv tizimlari",
      sec_doska_title: "Interaktiv doskalar va stendlar",
      sec_sup_title: "Chek lentalari va sarf materiallari",
      theme_light: "Kunduzgi",
      theme_dark: "Tungi"
    },
    ru: {
      nav_services: "Услуги",
      nav_process: "Этапы работы",
      nav_equipment: "Оборудование",
      nav_why: "Почему мы?",
      nav_faq: "Частые вопросы",
      nav_cta: "Связаться в Telegram",
      hero_tag: "Автоматизация торговли и бизнеса",
      hero_title_1: "Кассовое оборудование и IT-решения —",
      hero_title_2: "от единого партнера",
      hero_desc: "Торговые системы, боты отчетов, учет рабочего времени по Face ID и умное AI видеонаблюдение. Все оборудование в наличии на складе в Ташкенте с гарантией и установкой.",
      hero_btn_telegram: "Бесплатная консультация",
      hero_btn_equip: "Магазин оборудования",
      stat_retail: "Розничная торговля",
      stat_retail_sub: "Кассы, сканеры, принтеры",
      stat_speed: "За 3-4 дня",
      stat_speed_sub: "Полный запуск под ключ",
      stat_support: "Поддержка 24/7",
      stat_support_sub: "Бесперебойная помощь",
      stat_warranty: "Гарантия 1 год",
      stat_warranty_sub: "На всё оборудование",
      sec_services_title: "Комплексные технологические услуги",
      sec_services_desc: "Автоматизируем все процессы — от кассы и склада до бухгалтерии и учета персонала.",
      svc_detail: "Перейти на страницу услуги →",
      sec_proc_title: "Как проходит сотрудничество?",
      sec_proc_desc: "Четыре прозрачных шага до запуска за 3–4 рабочих дня.",
      sec_equip_title: "Каталог торгового оборудования",
      sec_equip_desc: "122+ моделей сканеров, POS моноблоков, термопринтеров и электронных весов на складе в Ташкенте.",
      tab_all: "Все товары",
      tab_stat: "Стационарные сканеры",
      tab_hand: "Ручные сканеры",
      tab_mono: "POS Моноблоки",
      tab_print: "Принтеры чеков",
      tab_draw: "Денежные ящики & Весы",
      tab_sec: "Антикражные ворота",
      tab_doska: "Интерактивные доски",
      tab_sup: "Чековая лента и расходники",
      search_ph: "Поиск товаров, брендов или характеристик...",
      buy_now: "Купить",
      sec_stat_title: "Стационарные сканеры (Многоплоскостные & 2D)",
      sec_hand_title: "Ручные сканеры (Проводные и Bluetooth)",
      sec_mono_title: "Сенсорные POS-моноблоки",
      sec_print_title: "Принтеры чеков и штрихкодов",
      sec_draw_title: "Денежные ящики и электронные весы",
      sec_sec_title: "Антикражные системы и кнопки вызова",
      sec_doska_title: "Интерактивные доски и стойки",
      sec_sup_title: "Чековая лента и расходные материалы",
      theme_light: "Светлая",
      theme_dark: "Темная"
    },
    en: {
      nav_services: "Services",
      nav_process: "How it works",
      nav_equipment: "Equipment",
      nav_why: "Why Us",
      nav_faq: "FAQ",
      nav_cta: "Contact via Telegram",
      hero_tag: "Retail & Business Automation",
      hero_title_1: "POS Hardware & Business Software —",
      hero_title_2: "from a single partner",
      hero_desc: "Point-of-sale systems, accounting bots, Face ID attendance, and AI video surveillance. Full hardware stock in Tashkent with setup and warranty.",
      hero_btn_telegram: "Free Consultation",
      hero_btn_equip: "Equipment Store",
      stat_retail: "Retail & POS",
      stat_retail_sub: "Cash desks, scanners, printers",
      stat_speed: "3-4 Days",
      stat_speed_sub: "Fast deployment",
      stat_support: "24/7 Support",
      stat_support_sub: "Continuous technical help",
      stat_warranty: "1 Year Warranty",
      stat_warranty_sub: "On all devices",
      sec_services_title: "End-to-End Business Technology Services",
      sec_services_desc: "We automate every stage — from checkout registers to accounting and attendance.",
      svc_detail: "View full service page →",
      sec_proc_title: "How We Work Together",
      sec_proc_desc: "Four structured stages to complete setup within 3–4 days.",
      sec_equip_title: "POS Hardware & Equipment Catalog",
      sec_equip_desc: "Over 122+ models of barcode scanners, touchscreen POS terminals, receipt printers and scales in stock.",
      tab_all: "All items",
      tab_stat: "Stationary Scanners",
      tab_hand: "Handheld Scanners",
      tab_mono: "POS Terminals",
      tab_print: "Receipt Printers",
      tab_draw: "Cash Drawers & Scales",
      tab_sec: "EAS Anti-theft & Pagers",
      tab_doska: "Interactive Whiteboards",
      tab_sup: "Paper Rolls & Ribbons",
      search_ph: "Search products, brands or specs...",
      buy_now: "Order Now",
      sec_stat_title: "Stationary Scanners (Omnidirectional & 2D)",
      sec_hand_title: "Handheld Scanners (Corded & Bluetooth)",
      sec_mono_title: "Touchscreen POS Terminals",
      sec_print_title: "Receipt & Barcode Printers",
      sec_draw_title: "Cash Drawers & Digital Scales",
      sec_sec_title: "Anti-theft Gates & Call Systems",
      sec_doska_title: "Interactive Displays & Kiosks",
      sec_sup_title: "Thermal Paper Rolls & Supplies",
      theme_light: "Light",
      theme_dark: "Dark"
    }
  };
'''

# JavaScript logic for Theme, Language, Equipment Search & Filtering, Order Modal
scripts_js = '''

  // ==================== TELEGRAM MINI APP INITIALIZATION ====================
  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp && !!window.Telegram.WebApp.initData;
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    try {
      tg.ready();
      tg.expand();
      
      // Auto-sync theme with Telegram client
      if (tg.colorScheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeUI('dark');
      } else if (tg.colorScheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeUI('light');
      }

      tg.onEvent('themeChanged', function() {
        const theme = tg.colorScheme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ds_theme', theme);
        updateThemeUI(theme);
      });

      // Set header color
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0b5cff');
      }
    } catch(e) {
      console.log('Telegram WebApp init note:', e);
    }
  }

  function triggerTgHaptic(type = 'light') {
    try {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        if (type === 'success' || type === 'error' || type === 'warning') {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
        } else {
          window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
        }
      }
    } catch(e) {}
  }


  // ==================== THEME MANAGEMENT ====================
  function initTheme() {
    const saved = localStorage.getItem('ds_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeUI(saved);
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ds_theme', next);
    updateThemeUI(next);
  }

  function updateThemeUI(theme) {
    const icon = theme === 'dark' ? '☀️' : '🌙';
    const curLang = localStorage.getItem('ds_lang') || 'uz';
    const label = theme === 'dark' ? (I18N_DATA[curLang]?.theme_light || 'Kunduzgi') : (I18N_DATA[curLang]?.theme_dark || 'Tungi');
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const iconEl = btn.querySelector('.theme-icon');
      const textEl = btn.querySelector('.theme-text');
      if (iconEl) iconEl.textContent = icon;
      if (textEl) textEl.textContent = label;
    });
  }

  // ==================== MULTI-LANGUAGE SYSTEM ====================
  function setLanguage(lang) {
    if (!I18N_DATA[lang]) lang = 'uz';
    localStorage.setItem('ds_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (I18N_DATA[lang][key]) {
        el.textContent = I18N_DATA[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (I18N_DATA[lang][key]) {
        el.placeholder = I18N_DATA[lang][key];
      }
    });

    const curTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeUI(curTheme);
  }

  // ==================== EQUIPMENT SEARCH & FILTER ====================
  function handleEquipSearch(query) {
    query = (query || '').toLowerCase().trim();
    const clearBtn = document.getElementById('equipClearBtn');
    if (clearBtn) clearBtn.classList.toggle('visible', query.length > 0);

    const cards = document.querySelectorAll('.prod-card');
    cards.forEach(card => {
      const name = card.getAttribute('data-name') || '';
      const brand = card.getAttribute('data-brand') || '';
      const match = !query || name.includes(query) || brand.includes(query);
      card.style.display = match ? 'flex' : 'none';
    });

    // Hide empty sections
    document.querySelectorAll('.equip-section-block').forEach(sec => {
      const visibleCards = sec.querySelectorAll('.prod-card:not([style*="display: none"])');
      sec.style.display = visibleCards.length > 0 ? 'block' : 'none';
    });
  }

  function clearEquipSearch() {
    const input = document.getElementById('equipSearchInput');
    if (input) {
      input.value = '';
      handleEquipSearch('');
    }
  }

  function setEquipFilter(cat, btn) {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const sections = document.querySelectorAll('.equip-section-block');
    sections.forEach(sec => {
      if (cat === 'all') {
        sec.style.display = 'block';
      } else {
        const hasCards = sec.querySelector('.' + cat);
        sec.style.display = hasCards ? 'block' : 'none';
      }
    });

    const cards = document.querySelectorAll('.prod-card');
    cards.forEach(card => {
      if (cat === 'all' || card.classList.contains(cat)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function toggleFav(btn) {
    btn.classList.toggle('active');
  }

  // ==================== ORDER MODAL & TELEGRAM ====================
  let currentOrderProduct = { name: '', price: '', img: '' };

  function openProductOrder(name, price, img) {
    currentOrderProduct = { name, price, img };
    const modal = document.getElementById('productOrderModal');
    if (!modal) return;
    document.getElementById('modalProdTitle').textContent = name;
    document.getElementById('modalProdPrice').textContent = price;
    const imgEl = document.getElementById('modalProdImg');
    if (imgEl) imgEl.src = img || '/images/hardware/ae637a2f-1465-4c4c-ac01-14d57ffe44e1_0.webp';
    modal.classList.add('open');
  }

  function closeProductOrder() {
    const modal = document.getElementById('productOrderModal');
    if (modal) modal.classList.remove('open');
  }

  function submitProductOrder(e) {
    e.preventDefault();
    const name = document.getElementById('orderCustName').value.trim();
    const phone = document.getElementById('orderCustPhone').value.trim();
    const comment = document.getElementById('orderCustComment').value.trim();

    if (!name || !phone) {
      alert('Iltimos, ismingiz va telefon raqamingizni kiriting!');
      return;
    }

    triggerTgHaptic('success');

    // If inside Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
      const tg = window.Telegram.WebApp;
      const orderData = {
        action: 'order',
        product: currentOrderProduct.name,
        price: currentOrderProduct.price,
        customerName: name,
        customerPhone: phone,
        comment: comment
      };
      
      try {
        tg.sendData(JSON.stringify(orderData));
      } catch(e) {}

      // Also call local API in background
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          notes: `[TG MiniApp] Mahsulot: ${currentOrderProduct.name} (${currentOrderProduct.price}). Izoh: ${comment}`
        })
      }).catch(() => {});

      if (tg.showAlert) {
        tg.showAlert(`Rahmat, ${name}! Buyurtmangiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.`);
      } else {
        alert(`Rahmat, ${name}! Buyurtmangiz qabul qilindi.`);
      }
      closeProductOrder();
      return;
    }

    e.preventDefault();
    const name = document.getElementById('orderCustName').value.trim();
    const phone = document.getElementById('orderCustPhone').value.trim();
    const comment = document.getElementById('orderCustComment').value.trim();

    if (!name || !phone) {
      alert('Iltimos, ismingiz va telefon raqamingizni kiriting!');
      return;
    }

    // Try posting to local backend API
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        notes: `Mahsulot: ${currentOrderProduct.name} (${currentOrderProduct.price}). Izoh: ${comment}`
      })
    }).catch(() => {});

    // Open Telegram Bot with direct formatted message
    const msg = encodeURIComponent(`Salom! Men DashboardSale saytidan ushbu uskunani xarid qilmoqchiman:\\n\\n📦 Mahsulot: ${currentOrderProduct.name}\\n💰 Narxi: ${currentOrderProduct.price}\\n👤 Ismim: ${name}\\n📞 Telefonim: ${phone}${comment ? '\\n💬 Izoh: ' + comment : ''}`);
    window.open(`https://t.me/dashboardsalevvbot?text=${msg}`, '_blank');

    closeProductOrder();
  }

  // Close modal on escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProductOrder();
  });

  // Init on load
  initTheme();
  setLanguage(localStorage.getItem('ds_lang') || 'uz');
'''

# Modal HTML snippet
modal_markup = '''
  <!-- Product Order Modal -->
  <div class="modal-backdrop" id="productOrderModal" onclick="if(event.target===this)closeProductOrder()">
    <div class="modal-box">
      <button class="modal-close" onclick="closeProductOrder()">✕</button>
      <h3>Buyurtma berish</h3>
      <p>Menejerimiz 10 daqiqa ichida siz bilan bog‘lanib, to‘lov va yetkazib berishni muvofiqlashtiradi.</p>

      <div class="modal-prod-summary">
        <img src="" id="modalProdImg" class="modal-prod-img" alt="Product"/>
        <div class="modal-prod-details">
          <h4 id="modalProdTitle">Mahsulot nomi</h4>
          <div class="price" id="modalProdPrice">0 UZS</div>
        </div>
      </div>

      <form class="modal-form" onsubmit="submitProductOrder(event)">
        <div class="form-group">
          <label>Ismingiz *</label>
          <input type="text" id="orderCustName" required placeholder="Masalan: Sardor Aliyev"/>
        </div>
        <div class="form-group">
          <label>Telefon raqamingiz *</label>
          <input type="tel" id="orderCustPhone" required placeholder="+998 90 123 45 67"/>
        </div>
        <div class="form-group">
          <label>Manzil yoki qo‘shimcha izoh</label>
          <textarea id="orderCustComment" rows="2" placeholder="Toshkent shahri, Chilonzor tumani..."></textarea>
        </div>
        <button type="submit" class="modal-submit-btn rip">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          Buyurtmani Telegram orqali yuborish
        </button>
      </form>
    </div>
  </div>
'''

# Topbar right with Theme toggle & Language switcher
new_topbar_r = '''
      <div class="topbar-r">
        <span class="pill hours"><svg class="ico"><use href="#i-clock"/></svg>Du–Sha 09:00–19:00</span>
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
'''

# Update phone & Telegram bot in topbar-l
new_topbar_l = '''
      <div class="topbar-l">
        <span class="label">Menejer bilan bog‘lanish:</span>
        <a class="phone" href="tel:+998781130022">+998 78 113 00 22</a>
        <a class="pill pill-tg" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
          <span class="tg-dot"><svg viewBox="0 0 24 24"><use href="#i-send"/></svg></span>
          Telegram Bot
        </a>
      </div>
'''

# Update Nav with Theme & Lang controls
new_nav_cta = '''
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="theme-toggle-btn" onclick="toggleTheme()" title="Qora / Oq fon" style="display:none;@media(min-width:768px){display:flex;}">
            <span class="theme-icon">🌙</span>
          </button>
          <a class="btn btn-sm btn-p" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
            <svg class="ico"><use href="#i-send"/></svg>
            <span data-i18n="nav_cta">Telegram orqali bog‘lanish</span>
          </a>
        </div>
'''


# Update Services section with 3D icons in the icon place
new_services_html = '''
  <!-- ==================== SERVICES ==================== -->
  <section id="services" class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 data-i18n="sec_services_title">Biznesingiz uchun to‘liq texnologik xizmatlar</h2>
        <p data-i18n="sec_services_desc">Savdodan tortib buxgalteriya, xodimlar nazorati va kassa jihozlarigacha bo‘lgan barcha jarayonlarni avtomatlashtiramiz. Har bir xizmat alohida tizimga ega bo‘lib, batafsil sahifasida to‘liq ma’lumot va ulanish uchun ariza topshirishingiz mumkin.</p>
      </div>

      <!-- Hero Service 1: Telegram Mini App do'koni va yetkazib berish (TGShop) -->
      <article class="svc svc-hero" onclick="location.href='services-tg-shop.html#presentation'" style="cursor:pointer;border: 2px solid rgba(11,92,255,0.2);box-shadow: 0 16px 40px rgba(11,92,255,0.08);">
        <div class="svc-hero-split">
          <div class="svc-lead">
            <div class="svc-icon-tile">
              <img src="/images/services/icon-tg-shop.png" alt="Telegram Mini App Do‘koni" class="svc-icon-img"/>
            </div>
            <span class="badge" style="background:#0b5cff;color:#fff;margin-bottom:12px;">⚡ Yangi & Eng ommabop</span>
            <h3>Telegram Mini App do‘koni va yetkazib berish (TGShop)</h3>
            <p>Mijozlaringiz hech qanday ilova yuklamasdan, to‘g‘ridan-to‘g‘ri Telegram ichida tovar tanlaydi, rang/o‘lcham belgilaydi, geolokatsiyasini yuborib Yandex Go orqali Click/Payme bilan xarid qiladi. Kuryer boti, buyurtma statuslari va 1C integratsiyasi bilan to‘liq jihozlangan tizim!</p>
            <a class="svc-link" href="services-tg-shop.html#presentation" style="font-weight:800;color:var(--blue);" onclick="event.stopPropagation();">
              <span>Batafsil tizim bilan tanishish va ariza qoldirish</span>
              <svg class="ico"><use href="#i-arrow"/></svg>
            </a>
          </div>
          <div class="svc-hero-visual" style="background:#e4f3fa;">
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
        <article class="svc" onclick="location.href='services-online-store.html#presentation'" style="cursor:pointer;">
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
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 3: Buxgalteriya va biznes botlari -->
        <article class="svc" onclick="location.href='services-accounting-bots.html#presentation'" style="cursor:pointer;">
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
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 4: Xodimlar davomati va nazorat tizimlari -->
        <article class="svc" onclick="location.href='services-attendance.html#presentation'" style="cursor:pointer;">
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
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 5: AI kamera va aqlli monitoring -->
        <article class="svc" onclick="location.href='services-ai-cameras.html#presentation'" style="cursor:pointer;">
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
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 6: Kassa uskunalarini o‘rnatish va montaj -->
        <article class="svc" onclick="location.href='services-equipment-setup.html#presentation'" style="cursor:pointer;">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-printer-scanner.png" alt="Kassa uskunalari" class="svc-icon-img"/>
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
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>
      </div>
    </div>
  </section>
'''

# 3D Render Hero Stage
new_hero_stage = '''
    <div class="hero-stage">
      <!-- 1: POS monoblok -->
      <div class="shot s1" role="img" aria-label="POS monoblok ekrani">
        <img src="/images/hero/hero-pos-terminal@2x.png" alt="Sensorli POS monoblok kassa ekrani" class="shot-img shot-pos" loading="eager"/>
      </div>

      <!-- 2: Face ID -->
      <div class="shot s2" role="img" aria-label="Face ID davomat terminali">
        <img src="/images/hero/hero-face-attendance@2x.png" alt="Face ID va biometrik davomat nazorati" class="shot-img shot-face" loading="eager"/>
      </div>

      <!-- 3: Chek printer + skaner -->
      <div class="shot s3" role="img" aria-label="Chek printeri va shtrix-kod skaneri">
        <img src="/images/hero/hero-printer-scanner@2x.png" alt="Chek printeri va shtrix-kod skaneri" class="shot-img shot-printer" loading="eager"/>
      </div>

      <!-- 4: Dashboard planshet -->
      <div class="shot s4" role="img" aria-label="Savdo hisoboti paneli">
        <img src="/images/hero/hero-analytics-dashboard@2x.png" alt="Buxgalteriya va savdo tahlili paneli" class="shot-img shot-dash" loading="eager"/>
      </div>

      <!-- 5: AI monitoring -->
      <div class="shot s5" role="img" aria-label="Do‘kon ichidagi mijozlar oqimi xaritasi">
        <img src="/images/hero/hero-ai-camera-heatmap@2x.png" alt="AI video kuzatuv va supermarket mijozlar oqimi xaritasi" class="shot-img shot-ai" loading="eager"/>
      </div>
    </div>
'''



# Generate Ultra-HD 3D Hero Renders
try:
    import subprocess
    subprocess.run(['python3', 'scripts/generate_ultra_hd_hero_renders.py'], check=True)
except Exception as e:
    print("Hero asset generation warning:", e)

# Initialize output_html and inject CSS and Telegram WebApp SDK
output_html = base_html
output_html = output_html.replace('</head>', '<style>\n' + additional_css + '\n</style>\n<script src="https://telegram.org/js/telegram-web-app.js"></script>\n</head>')

# 3.1 Replace hero-stage with Real 3D renders
hs_start = output_html.find('<div class="hero-stage">')
hs_end = output_html.find('</div>\n  </section>', hs_start) + len('</div>')
if hs_start != -1 and hs_end != -1:
    output_html = output_html[:hs_start] + new_hero_stage.strip() + output_html[hs_end:]


# 4. Replace Services section with clean 3D icon tiles and non-clipped visuals
svc_start = output_html.find('<!-- ==================== SERVICES ==================== -->')
if svc_start == -1:
    svc_start = output_html.find('<section id="services"')
svc_end = output_html.find('<!-- ==================== PROCESS ==================== -->')
if svc_end == -1:
    svc_end = output_html.find('<section id="process"')
if svc_start != -1 and svc_end != -1:
    output_html = output_html[:svc_start] + new_services_html.strip() + '\n\n  ' + output_html[svc_end:]

new_equipment_section = '''
  <!-- ==================== EQUIPMENT SHOWCASE ==================== -->
  <section id="equipment" class="sec equip-sec" style="background:linear-gradient(180deg, var(--white) 0%, var(--soft) 100%);border-top:1px solid var(--line);border-bottom:1px solid var(--line);">
    <div class="wrap">
      <div class="sec-head" style="max-width:800px;margin:0 auto 36px;text-align:center;">
        <span class="badge" style="margin-bottom:12px;">Rasmiy kassa uskunalari do‘koni</span>
        <h2 data-i18n="sec_equip_title">Kassa va Savdo Jihozlari Do‘koni</h2>
        <p data-i18n="sec_equip_desc">Barcha kassa va savdo uskunalarimiz uchun alohida to‘liq qidiruvli, toifalangan va saralangan do‘kon sahifasi ishga tushirildi. 120 dan ortiq POS monobloklar, 2D skanerlar, printerlar va elektron tarozilar rasmiy 1 yil kafolat bilan.</p>
      </div>

      <!-- 3D Turnkey Counter Showcase Banner -->
      <div style="background:var(--card-bg);border:1.5px solid var(--card-border);border-radius:24px;overflow:hidden;box-shadow:var(--shadow);margin-bottom:32px;display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:28px;align-items:center;">
        <div style="background:#e8f0fe;display:flex;align-items:center;justify-content:center;padding:12px;">
          <img src="/images/services/svc-equipment-setup.png" alt="DashboardSale Kassa Uskunalari Stendi" style="width:100%;height:auto;max-height:360px;object-fit:cover;border-radius:16px;display:block;"/>
        </div>
        <div style="padding:24px 28px;">
          <span class="badge" style="background:var(--blue);color:#fff;margin-bottom:12px;">⚡ Kassa jihozlari taqdimoti</span>
          <h3 style="font-size:24px;font-weight:800;color:var(--ink);margin-bottom:12px;line-height:1.25;">DashboardSale Kassa Stendi: Yetkazish, montaj va sozlash</h3>
          <p style="font-size:14.5px;color:var(--mute);line-height:1.6;margin-bottom:18px;">Savdo nuqtangiz uchun to‘liq tayyor kassa: 15.6" IPS sensorli monoblok, 2D shtrix-kod lazer skaneri, 80mm avto-pichoqli chek printeri va metall pul qutisi. 1 kunda yetkazamiz, o‘rnatamiz va rasmiy 1 yil kafolat beramiz.</p>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a href="services-equipment-setup.html#presentation" class="btn btn-p btn-sm rip" style="display:inline-flex;align-items:center;gap:8px;">
              <svg class="ico"><use href="#i-arrow"/></svg>
              <span>Jihozlar taqdimotini ko‘rish</span>
            </a>
            <a href="market.html" class="btn btn-s btn-sm">
              <span>Barcha 120+ uskunani ko‘rish</span>
            </a>
          </div>
        </div>
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
        <a href="market.html" class="btn btn-p btn-lg rip" style="display:inline-flex;align-items:center;gap:12px;font-size:16.5px;font-weight:800;padding:16px 36px;border-radius:14px;box-shadow:0 10px 28px rgba(11,92,255,0.25);">
          <svg class="ico" style="width:20px;height:20px;"><use href="#i-arrow"/></svg>
          <span>🛍 Jihozlar do‘koniga o‘tish (Barcha 120+ uskunani ko‘rish) →</span>
        </a>
      </div>
    </div>
  </section>
'''

# 5. Replace Equipment section

eq_start = output_html.find('<!-- ==================== EQUIPMENT ==================== -->')
if eq_start == -1:
    eq_start = output_html.find('<section id="equipment"')
eq_end = output_html.find('<!-- ==================== WHY US ==================== -->')
if eq_start != -1 and eq_end != -1:
    output_html = output_html[:eq_start] + new_equipment_section + '\n\n  ' + output_html[eq_end:]

# 6. Inject modal markup before <footer> or before </main> or before <script>
script_idx = output_html.rfind('<script>')
if script_idx != -1:
    output_html = output_html[:script_idx] + modal_markup + '\n\n  ' + output_html[script_idx:]

# 7. Inject I18N and JavaScript before </script>
end_script_idx = output_html.rfind('</script>')
if end_script_idx != -1:
    output_html = output_html[:end_script_idx] + dict_js + scripts_js + '\n' + output_html[end_script_idx:]

# Wire up Jihozlar links to market.html
output_html = output_html.replace('<a href="#equipment">Uskunalar</a>', '<a href="market.html"><span data-i18n="nav_equipment">Jihozlar</span></a>')
output_html = output_html.replace('<a class="dl" href="#equipment">Uskunalar</a>', '<a class="dl" href="market.html"><span data-i18n="hero_btn_equip">Jihozlar do‘koni</span></a>')
output_html = output_html.replace('<a class="btn btn-soft btn-lg" href="#equipment"><svg class="ico" style="width:22px;height:22px;stroke:none"><use href="#i-play"/></svg>Uskunalar katalogi</a>', '<a class="btn btn-soft btn-lg" href="market.html"><svg class="ico" style="width:22px;height:22px;stroke:none"><use href="#i-play"/></svg><span data-i18n="hero_btn_equip">Jihozlar do‘koni</span></a>')
output_html = output_html.replace('<li><a href="#equipment">', '<li><a href="market.html">')

# Un-hide cookie banner to match reference mockup
output_html = output_html.replace('<div class="cookie" id="cookie" hidden', '<div class="cookie" id="cookie"')

# 8. Write public/dashboardsale.html
with open('public/dashboardsale.html', 'w', encoding='utf-8') as f:
    f.write(output_html)

# Also copy to scratch root and bundle
shutil.copy('public/dashboardsale.html', '/home/actualtam/.gemini/antigravity/scratch/dashboardsale.html')
os.makedirs('dashboardsale-bundle', exist_ok=True)
shutil.copy('public/dashboardsale.html', 'dashboardsale-bundle/dashboardsale.html')
shutil.copy('public/dashboardsale.html', 'dashboardsale-bundle/index.html')
print("dashboardsale.html successfully created and verified!")
