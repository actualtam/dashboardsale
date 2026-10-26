import json
import os
import shutil

print("Reading all scraped products...")
with open('all_scraped_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Priority screenshot scanners
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
    return 'LARIBA GROUP'

def format_card(p, cat_class):
    name = p.get('name', 'Savdo uskunasi')
    brand = p.get('brand') or detect_brand(name)
    price = p.get('price') or p.get('offers', {}).get('price') or 0
    price_str = f"{int(price):,} UZS".replace(',', ' ')
    
    old_price = p.get('old_price')
    if not old_price:
        old_price = int(price * 1.15) if price > 0 else 0
    old_price_str = f"{int(old_price):,} UZS".replace(',', ' ')
    
    discount = p.get('discount')
    if not discount:
        diff = round((1 - (price / old_price)) * 100, 1) if old_price > price else 0
        discount = f"-{diff}%" if diff > 0 else "-5%"
    
    img = p.get('img') or (p.get('local_images') and p.get('local_images')[0]) or ''
    remote_img = p.get('remote_img') or (p.get('image') and p.get('image')[0]) or ''
    
    spec1 = p.get('spec1')
    spec2 = p.get('spec2')
    spec3 = p.get('spec3')
    
    if not spec1:
        desc = p.get('description', '')
        lines = [l.strip() for l in desc.split('\n') if l.strip() and len(l.strip()) > 6]
        spec1 = lines[0][:32] if len(lines) > 0 else 'Sensorli ekran va yuqori tezlik'
        spec2 = lines[1][:32] if len(lines) > 1 else 'Barcha kassa dasturlariga mos'
        spec3 = lines[2][:32] if len(lines) > 2 else 'Rasmiy 1 yil kafolat'
    
    escaped_name = name.replace("'", "\\'").replace('"', '&quot;')
    
    return f'''
    <div class="prod-card {cat_class}" data-name="{escaped_name.lower()}" data-brand="{brand.lower()}">
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
    </div>
    '''

statsionar_cards = ''.join(format_card(p, 'cat-statsionar') for p in SCREENSHOT_STATSIONAR)
qol_cards = ''.join(format_card(p, 'cat-qol') for p in SCREENSHOT_QOL)
monoblok_cards = ''.join(format_card(p, 'cat-monoblok') for p in [x for x in products if 'monoblok' in (x.get('category') or '').lower()][:15])
printer_cards = ''.join(format_card(p, 'cat-printer') for p in [x for x in products if 'printer' in (x.get('category') or '').lower()][:12])
drawer_scale_cards = ''.join(format_card(p, 'cat-drawers') for p in [x for x in products if any(k in (x.get('category') or '').lower() for k in ['quti', 'taroz', 'antikraj'])][:12])

catalog_markup = f'''
    <!-- Search and Filter Header -->
    <div class="equip-catalog-header">
      <div class="equip-search-bar">
        <svg class="search-ico" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" id="equipSearchInput" placeholder="Mahsulotlar va toifalarni qidirish..." oninput="handleEquipSearch(this.value)"/>
        <button id="equipClearBtn" class="search-clear" onclick="clearEquipSearch()">✕</button>
      </div>

      <div class="equip-filter-tabs">
        <button class="filter-tab active" data-cat="all" onclick="setEquipFilter('all', this)"><span data-i18n="tab_all">Barchasi</span> (122)</button>
        <button class="filter-tab" data-cat="cat-statsionar" onclick="setEquipFilter('cat-statsionar', this)"><span data-i18n="tab_stat">Statsionar skanerlar</span> ({len(SCREENSHOT_STATSIONAR)})</button>
        <button class="filter-tab" data-cat="cat-qol" onclick="setEquipFilter('cat-qol', this)"><span data-i18n="tab_hand">Qo‘l skanerlari</span> ({len(SCREENSHOT_QOL)})</button>
        <button class="filter-tab" data-cat="cat-monoblok" onclick="setEquipFilter('cat-monoblok', this)"><span data-i18n="tab_mono">POS Monobloklar</span></button>
        <button class="filter-tab" data-cat="cat-printer" onclick="setEquipFilter('cat-printer', this)"><span data-i18n="tab_print">Printerlar</span></button>
        <button class="filter-tab" data-cat="cat-drawers" onclick="setEquipFilter('cat-drawers', this)"><span data-i18n="tab_draw">Qutilar & Tarozilar</span></button>
      </div>
    </div>

    <!-- Section 1: Statsionar skaner -->
    <div class="equip-section-block" id="sec-statsionar">
      <div class="equip-section-title">
        <h3 data-i18n="sec_stat_title">Statsionar skanerlar (Ko‘p nurli & 2D)</h3>
        <span class="equip-count-tag">{len(SCREENSHOT_STATSIONAR)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {statsionar_cards}
      </div>
    </div>

    <!-- Section 2: Qo'l skaneri -->
    <div class="equip-section-block" id="sec-qol">
      <div class="equip-section-title">
        <h3 data-i18n="sec_hand_title">Qo‘l skanerlari (Simli va Bluetooth)</h3>
        <span class="equip-count-tag">{len(SCREENSHOT_QOL)} ta model omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {qol_cards}
      </div>
    </div>

    <!-- Section 3: Sensorli POS Monobloklar -->
    <div class="equip-section-block" id="sec-monoblok">
      <div class="equip-section-title">
        <h3 data-i18n="sec_mono_title">Sensorli POS Monobloklar</h3>
        <span class="equip-count-tag">Omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {monoblok_cards}
      </div>
    </div>

    <!-- Section 4: Chek va Barkod printerlari -->
    <div class="equip-section-block" id="sec-printer">
      <div class="equip-section-title">
        <h3 data-i18n="sec_print_title">Chek va Barkod printerlari</h3>
        <span class="equip-count-tag">Omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {printer_cards}
      </div>
    </div>

    <!-- Section 5: Kassa qutilari va Tarozilar -->
    <div class="equip-section-block" id="sec-drawers">
      <div class="equip-section-title">
        <h3 data-i18n="sec_draw_title">Kassa qutilari va Elektron tarozilar</h3>
        <span class="equip-count-tag">Omborda mavjud</span>
      </div>
      <div class="equip-cards-grid">
        {drawer_scale_cards}
      </div>
    </div>
'''

print("Catalog markup done.")
