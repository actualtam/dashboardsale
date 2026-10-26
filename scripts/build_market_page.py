import json
import os
import re
import html
import shutil

print("Building dedicated DashboardSale Market Page (market.html)...")

with open('public/dashboardsale.html', 'r', encoding='utf-8') as f:
    full_html = f.read()

# Extract <head>...</head>
head_start = full_html.find('<head>')
head_end = full_html.find('</head>') + len('</head>')
common_head = full_html[head_start:head_end]

# Replace title in head
common_head = re.sub(r'<title>.*?</title>', '<title>Jihozlar do‘koni — DashboardSale | Kassa uskunalari, monobloklar, skanerlar va printerlar</title>', common_head)

# Extract SVG symbols
svg_start = full_html.find('<svg xmlns="http://www.w3.org/2000/svg" style="display:none">')
svg_end = full_html.find('</svg>', svg_start) + len('</svg>')
common_svgs = full_html[svg_start:svg_end]

# Extract Topbar
tb_start = full_html.find('<div class="topbar">')
tb_end = full_html.find('<header class="nav">')
common_topbar = full_html[tb_start:tb_end]

# Extract Footer
foot_start = full_html.find('<footer>')
foot_end = full_html.find('</footer>', foot_start) + len('</footer>')
common_foot = full_html[foot_start:foot_end]

with open('all_scraped_products.json', 'r', encoding='utf-8') as f:
    all_products = json.load(f)

print(f"Loaded {len(all_products)} products.")

def format_uzs(val):
    try:
        n = int(round(float(val)))
        return f"{n:,}".replace(",", " ") + " so‘m"
    except:
        return "Kelishilgan narxda"

def get_category_info(p):
    cat = (p.get('category') or '').lower()
    nm = (p.get('name') or '').lower()
    desc = (p.get('description') or '').lower()
    
    if 'statsionar' in cat or 'statsionar' in nm or 'superlead' in nm or 'dt-1500' in nm:
        return 'scanners', 'Statsionar skanerlar', 'Сканеры', 'Skaner'
    if 'qo‘l' in cat or 'qol' in cat or ('skaner' in cat and 'statsionar' not in cat) or ('skaner' in nm and 'statsionar' not in nm):
        return 'scanners', 'Qo‘l skanerlari', 'Сканеры', 'Skaner'
    if 'monoblok' in cat or 'monoblok' in nm or 'lps-27' in nm:
        return 'monobloks', 'POS Monobloklar', 'POS Моноблоки', 'Monoblok'
    if 'chek printer' in cat or 'barkod printer' in cat or 'printer' in cat or 'printer' in nm:
        return 'printers', 'Chek va barkod printerlari', 'Принтеры', 'Printer'
    if 'quti' in cat or 'pul' in cat or 'tarozi' in cat or 'taroz' in cat or '405-10' in nm:
        return 'scales_drawers', 'Tarozilar va Pul qutilari', 'Весы и ящики', 'Kassa jihozi'
    if 'antikraj' in cat or 'chaqir' in cat:
        return 'security', 'Xavfsizlik tizimlari', 'Системы безопасности', 'Xavfsizlik'
    if 'doska' in cat or 'stend' in cat:
        return 'interactive', 'Interaktiv doskalar', 'Интерактивные доски', 'Smart doska'
    if 'qog‘oz' in cat or 'lenta' in cat or 'ribbon' in cat or 'chek' in cat or 'etiket' in cat or 'mm' in nm:
        return 'supplies', 'Chek lentalari va etiketkalar', 'Чековые ленты', 'Sarf'
    return 'other', 'Boshqa uskunalar', 'Другое оборудование', 'Uskuna'

def extract_brand(name, desc):
    text = (name + " " + desc).upper()
    if 'ZEBRA' in text:
        return 'ZEBRA', '#111827'
    if 'SUPERLEAD' in text:
        return 'SUPERLEAD', '#e53e3e'
    if 'DATALOGIC' in text:
        return 'DATALOGIC', '#0284c7'
    if 'LARIBA' in text or 'LPS' in text:
        return 'LARIBA GROUP', '#0f766e'
    if 'HIKVISION' in text:
        return 'HIKVISION', '#dc2626'
    if 'ZKTECO' in text:
        return 'ZKTECO', '#16a34a'
    if 'XPRINTER' in text:
        return 'XPRINTER', '#2563eb'
    if 'RONGTA' in text:
        return 'RONGTA', '#7c3aed'
    if 'MINDEO' in text:
        return 'MINDEO', '#d97706'
    return 'PREMIUM POS', '#475569'

def extract_specs(desc, name):
    specs = []
    lines = [l.strip() for l in re.split(r'[\r\n]+|\b\d+[\.:\)]\s*', desc) if l.strip()]
    for l in lines:
        if len(l) > 3 and not l.startswith('⚙️') and not l.startswith('Texnik'):
            clean = re.sub(r'^\d+[\s\.:\)]*', '', l).strip()
            if len(clean) > 3:
                specs.append(clean[:60])
        if len(specs) >= 3:
            break
    
    defaults = [
        "Rasmiy 1 yil kafolat va servis",
        "Yuqori tezlik va barqaror ishlash",
        "Barcha kassa dasturlariga to‘liq mos"
    ]
    while len(specs) < 3:
        specs.append(defaults[len(specs)])
    return specs[:3]

processed_products = []
categories_count = {
    'all': len(all_products),
    'monobloks': 0,
    'scanners': 0,
    'printers': 0,
    'scales_drawers': 0,
    'security': 0,
    'interactive': 0,
    'supplies': 0,
    'other': 0
}

for idx, p in enumerate(all_products):
    name = (p.get('name') or '').strip()
    raw_desc = (p.get('description') or '').strip()
    cat_key, cat_label_uz, cat_label_ru, badge_name = get_category_info(p)
    categories_count[cat_key] = categories_count.get(cat_key, 0) + 1
    
    brand_name, brand_color = extract_brand(name, raw_desc)
    specs = extract_specs(raw_desc, name)
    
    local_imgs = p.get('local_images', [])
    remote_imgs = p.get('image', [])
    img_path = ''
    if local_imgs and os.path.exists(os.path.join('public', local_imgs[0].lstrip('/'))):
        img_path = local_imgs[0]
    elif remote_imgs:
        img_path = remote_imgs[0]
    else:
        img_path = '/images/hero/hero-pos-terminal.png'
    
    fallback_img = remote_imgs[0] if remote_imgs else '/images/hero/hero-pos-terminal.png'
    
    price_val = 0
    try:
        price_val = float(p.get('offers', {}).get('price', 0))
    except:
        price_val = 0
    
    if price_val > 0:
        price_str = format_uzs(price_val)
        old_val = int(price_val * 1.15)
        old_price_str = format_uzs(old_val)
        discount = "-15%"
    else:
        price_str = "Kelishilgan narxda"
        old_price_str = ""
        discount = "Yangi"
    
    processed_products.append({
        'id': f"prod_{idx+1}",
        'sku': p.get('sku', f"SKU-{idx+1}"),
        'name': name,
        'cat_key': cat_key,
        'cat_label_uz': cat_label_uz,
        'cat_label_ru': cat_label_ru,
        'badge': badge_name,
        'brand': brand_name,
        'brand_color': brand_color,
        'img': img_path,
        'fallback_img': fallback_img,
        'price_val': price_val,
        'price_str': price_str,
        'old_price_str': old_price_str,
        'discount': discount,
        'spec1': specs[0],
        'spec2': specs[1],
        'spec3': specs[2],
        'raw_description': raw_desc
    })

# Market specific CSS
market_css = '''
<style>
/* Market Page Styles */
.market-nav-link.active {
  color: var(--blue) !important;
  font-weight: 800;
  position: relative;
}
.market-nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2.5px;
  background: var(--blue);
  border-radius: 2px;
}

.market-hero {
  padding: 42px 0 28px;
  background: linear-gradient(180deg, var(--soft) 0%, var(--white) 100%);
  border-bottom: 1px solid var(--line);
}
.market-hero-head {
  text-align: center;
  max-width: 840px;
  margin: 0 auto;
}
.market-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: var(--tint);
  color: var(--blue);
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 14px;
  border: 1px solid rgba(11,92,255,0.12);
}
.market-hero-title {
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.025em;
  color: var(--ink);
  margin-bottom: 14px;
}
.market-hero-sub {
  font-size: 16px;
  line-height: 1.6;
  color: var(--mute);
  margin: 0 auto 20px;
}

.market-stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed var(--line);
}
.market-stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}
.market-stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--tint);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* Toolbar */
.market-toolbar {
  position: sticky;
  top: 72px;
  z-index: 40;
  background: var(--nav-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.market-search-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.market-search-box {
  flex: 1;
  min-width: 280px;
  position: relative;
  display: flex;
  align-items: center;
}
.market-search-box input {
  width: 100%;
  height: 48px;
  padding: 0 44px 0 46px;
  background: var(--card-bg);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
  transition: all 0.2s ease;
}
.market-search-box input:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(11,92,255,0.12);
}
.market-search-ico {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: var(--mute);
  pointer-events: none;
}
.market-search-clear {
  position: absolute;
  right: 14px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--soft);
  border: none;
  color: var(--mute);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.market-search-clear:hover {
  background: var(--bad);
  color: #fff;
}

.market-sort-select {
  height: 48px;
  padding: 0 16px;
  background: var(--card-bg);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.market-sort-select:focus {
  border-color: var(--blue);
}

.market-cat-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}
.market-cat-pill {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--card-bg);
  border: 1px solid var(--line);
  color: var(--mute);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.market-cat-pill:hover {
  border-color: var(--blue);
  color: var(--blue);
}
.market-cat-pill.active {
  background: var(--blue);
  border-color: var(--blue);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(11,92,255,0.25);
}
.market-cat-count {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(0,0,0,0.06);
}
.market-cat-pill.active .market-cat-count {
  background: rgba(255,255,255,0.25);
  color: #fff;
}

/* Secondary Info Bar */
.market-results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  font-size: 14px;
  color: var(--mute);
}
.market-results-count {
  font-weight: 700;
  color: var(--ink);
}

/* Product Grid */
.market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding-bottom: 60px;
}

.market-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  box-shadow: var(--shadow);
}
.market-card:hover {
  transform: translateY(-4px);
  border-color: var(--blue);
  box-shadow: 0 16px 36px rgba(11,92,255,0.12);
}

.market-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 12px;
}
.market-brand-badge {
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.04em;
  font-size: 11px;
  text-transform: uppercase;
}
.market-stock-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--ok);
  font-weight: 600;
  font-size: 11.5px;
}
.market-stock-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 8px var(--ok);
}

.market-img-wrap {
  width: 100%;
  aspect-ratio: 1/1;
  background: #f8fafc;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 14px;
  position: relative;
  border: 1px solid var(--line);
}
[data-theme="dark"] .market-img-wrap {
  background: #101626;
}
.market-img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.market-card:hover .market-img {
  transform: scale(1.06);
}

.market-card-category {
  font-size: 12px;
  font-weight: 600;
  color: var(--mute);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.market-card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.35;
  margin-bottom: 12px;
  height: 44px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.market-specs-list {
  background: var(--soft);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.market-spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--ink);
}
.market-spec-num {
  font-size: 11px;
  color: var(--blue);
  font-weight: 700;
}
.market-spec-txt {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.market-price-box {
  margin-top: auto;
  margin-bottom: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}
.market-old-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
}
.market-old-price {
  text-decoration: line-through;
  color: var(--mute);
}
.market-discount-pill {
  padding: 2px 6px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  font-weight: 700;
  font-size: 11px;
}
[data-theme="dark"] .market-discount-pill {
  background: rgba(220,38,38,0.2);
}
.market-curr-price {
  font-size: 20px;
  font-weight: 800;
  color: var(--blue);
}

.market-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.market-btn-detail {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--soft);
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
  border: 1px solid var(--line);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}
.market-btn-detail:hover {
  background: var(--tint);
  color: var(--blue);
  border-color: var(--blue);
}
.market-btn-order {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--blue);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}
.market-btn-order:hover {
  background: var(--blue-d);
  box-shadow: 0 4px 14px rgba(11,92,255,0.3);
}

/* Modal */
.market-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,19,32,0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.market-modal-backdrop.open {
  display: flex;
}
.market-modal {
  background: var(--card-bg);
  border-radius: 24px;
  max-width: 860px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--card-border);
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  animation: modalPop 0.25s cubic-bezier(0.16,1,0.3,1);
}
@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
@media (max-width: 768px) {
  .market-modal {
    grid-template-columns: 1fr;
  }
}
.market-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--soft);
  border: none;
  color: var(--mute);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.market-modal-close:hover {
  background: var(--bad);
  color: #fff;
}
.market-modal-left {
  padding: 32px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--line);
  border-radius: 24px 0 0 24px;
}
[data-theme="dark"] .market-modal-left {
  background: #0d121f;
}
@media (max-width: 768px) {
  .market-modal-left {
    border-right: none;
    border-bottom: 1px solid var(--line);
    border-radius: 24px 24px 0 0;
  }
}
.market-modal-img {
  max-width: 100%;
  max-height: 280px;
  object-fit: contain;
  margin-bottom: 20px;
}
.market-modal-right {
  padding: 32px;
  display: flex;
  flex-direction: column;
}
.market-modal-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--ink);
  line-height: 1.3;
  margin-bottom: 8px;
}
.market-modal-price {
  font-size: 24px;
  font-weight: 800;
  color: var(--blue);
  margin-bottom: 16px;
}
.market-modal-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--mute);
  margin-bottom: 20px;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 6px;
}

.market-order-form {
  background: var(--soft);
  border-radius: 14px;
  padding: 18px;
  margin-top: auto;
}
.market-form-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.market-form-row {
  margin-bottom: 10px;
}
.market-form-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--card-bg);
  font-size: 14px;
  color: var(--ink);
}
.market-form-input:focus {
  outline: none;
  border-color: var(--blue);
}
.market-form-submit {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  background: var(--blue);
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}
.market-form-submit:hover {
  background: var(--blue-d);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  grid-column: 1 / -1;
  display: none;
}
.empty-state-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.empty-state h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 6px;
}
.empty-state p {
  font-size: 14px;
  color: var(--mute);
}
</style>
'''

# Generate Product Cards HTML
cards_html = []
for p in processed_products:
    escaped_name = html.escape(p['name'])
    
    card = f'''
    <div class="market-card" data-id="{p['id']}" data-cat="{p['cat_key']}" data-price="{p['price_val']}" data-name="{escaped_name.lower()}" data-brand="{p['brand'].lower()}" data-search="{escaped_name.lower()} {p['brand'].lower()} {p['cat_label_uz'].lower()} {p['spec1'].lower()} {p['spec2'].lower()} {p['spec3'].lower()}">
      <div class="market-card-top">
        <span class="market-brand-badge" style="background:{p['brand_color']}15;color:{p['brand_color']};border:1px solid {p['brand_color']}30;">{p['brand']}</span>
        <div class="market-stock-pill"><span class="market-stock-dot"></span> <span data-i18n="stock_avail">Mavjud</span></div>
      </div>

      <div class="market-img-wrap">
        <img src="{p['img']}" onerror="this.src='{p['fallback_img']}'" alt="{escaped_name}" loading="lazy" class="market-img"/>
      </div>

      <div class="market-card-category">{p['cat_label_uz']}</div>
      <div class="market-card-title" title="{escaped_name}">{escaped_name}</div>

      <div class="market-specs-list">
        <div class="market-spec-item"><span class="market-spec-num">❶</span><span class="market-spec-txt">{p['spec1']}</span></div>
        <div class="market-spec-item"><span class="market-spec-num">❷</span><span class="market-spec-txt">{p['spec2']}</span></div>
        <div class="market-spec-item"><span class="market-spec-num">❸</span><span class="market-spec-txt">{p['spec3']}</span></div>
      </div>

      <div class="market-price-box">
        <div class="market-old-price-row">
          <span class="market-old-price">{p['old_price_str']}</span>
          <span class="market-discount-pill">{p['discount']}</span>
        </div>
        <div class="market-curr-price">{p['price_str']}</div>
      </div>

      <div class="market-card-actions">
        <button class="market-btn-detail" onclick="openMarketDetail('{p['id']}')" data-i18n="btn_detail">Batafsil</button>
        <button class="market-btn-order" onclick="openFastOrder('{p['id']}')">
          <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><use href="#i-send"/></svg>
          <span data-i18n="btn_order">Buyurtma</span>
        </button>
      </div>
    </div>
    '''
    cards_html.append(card)

# Build JSON DB
products_json = json.dumps(processed_products, ensure_ascii=False)

# Full Market Page HTML
market_html = f'''<!DOCTYPE html>
<html lang="uz">
{common_head}
{market_css}
<body>
  {common_svgs}
  {common_topbar}

  <!-- ==================== MARKET NAVBAR ==================== -->
  <header class="nav">
    <div class="wrap">
      <a href="dashboardsale.html" class="logo" aria-label="DashboardSale — bosh sahifa">
        <span class="logo-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="13" width="4.500" height="8" rx="1.500"/><rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/><rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/></svg>
        </span>
        <span class="logo-txt">Dashboard<span>Sale</span></span>
      </a>

      <nav class="nav-links">
        <a href="dashboardsale.html" data-i18n="nav_home">Bosh sahifa</a>
        <a href="dashboardsale.html#services" data-i18n="nav_services">Xizmatlar</a>
        <a href="market.html" class="market-nav-link active" data-i18n="nav_equip">Jihozlar</a>
        <a href="dashboardsale.html#process" data-i18n="nav_process">Jarayon</a>
        <a href="dashboardsale.html#faq" data-i18n="nav_faq">Savol-javob</a>
        <a href="dashboardsale.html#contact" data-i18n="nav_contact">Aloqa</a>
      </nav>

      <div class="nav-cta" style="display:flex;align-items:center;gap:12px;">
        <button class="theme-toggle-btn" onclick="toggleTheme()" title="Qora / Oq fon">
          <span class="theme-icon">🌙</span>
          <span class="theme-text">Tungi</span>
        </button>
        <a class="btn btn-sm btn-p rip" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
          <svg class="ico"><use href="#i-send"/></svg>
          <span>Telegram Bot</span>
        </a>
        <button class="burger" id="burger" aria-label="Menyuni ochish" aria-expanded="false" aria-controls="drawer">
          <svg class="ico"><use href="#i-plus"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div class="drawer" id="drawer">
      <div class="wrap">
        <a class="dl" href="dashboardsale.html" data-i18n="nav_home">Bosh sahifa</a>
        <a class="dl" href="dashboardsale.html#services" data-i18n="nav_services">Xizmatlar</a>
        <a class="dl" href="market.html" style="font-weight:800;color:var(--blue);" data-i18n="hero_btn_equip">Jihozlar do‘koni</a>
        <a class="dl" href="dashboardsale.html#process" data-i18n="nav_process">Jarayon</a>
        <a class="dl" href="dashboardsale.html#faq" data-i18n="nav_faq">Savol-javob</a>
        <a class="dl" href="dashboardsale.html#contact" data-i18n="nav_contact">Aloqa</a>
        <a class="btn btn-primary" href="https://t.me/dashboardsalevvbot" target="_blank" style="margin-top:12px;width:100%;text-align:center;">Telegram orqali bog‘lanish</a>
      </div>
    </div>
  </header>

  <main>
    <!-- ==================== MARKET HERO ==================== -->
    <section class="market-hero">
      <div class="wrap">
        <div class="market-hero-head">
          <div class="market-hero-badge" data-i18n="market_badge">⚡ Rasmiy kafolat & Toshkent omboridan yetkazib berish</div>
          <h1 class="market-hero-title" data-i18n="market_title">Kassa va Savdo Jihozlari Do‘koni</h1>
          <p class="market-hero-sub" data-i18n="market_sub">Biznesingiz uchun professional POS-monobloklar, statsionar va qo‘l skanerlari, chek va barkod printerlari, kassa qutilari hamda barcha sarf materiallari to‘g‘ridan-to‘g‘ri birinchi qo‘ldan.</p>
          
          <div class="market-stats-row">
            <div class="market-stat-item">
              <span class="market-stat-icon">📦</span>
              <span data-i18n="market_stat_stock">120+ uskunalar omborda</span>
            </div>
            <div class="market-stat-item">
              <span class="market-stat-icon">🚚</span>
              <span data-i18n="market_stat_speed">1 kunda tezkor yetkazish</span>
            </div>
            <div class="market-stat-item">
              <span class="market-stat-icon">🛡</span>
              <span data-i18n="market_stat_warranty">1 yil rasmiy kafolat</span>
            </div>
            <div class="market-stat-item">
              <span class="market-stat-icon">⚙️</span>
              <span data-i18n="market_stat_integ">1C & Kassa integratsiyasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== TOOLBAR & FILTERS ==================== -->
    <div class="market-toolbar">
      <div class="wrap">
        <div class="market-search-wrap">
          <div class="market-search-box">
            <svg class="market-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" id="marketSearchInput" placeholder="Jihoz nomi, model yoki brend bo‘yicha qidirish..." oninput="handleMarketSearch(this.value)" data-i18n-ph="search_ph"/>
            <button id="marketSearchClear" class="market-search-clear" onclick="clearMarketSearch()">✕</button>
          </div>
          
          <select id="marketSortSelect" class="market-sort-select" onchange="handleMarketSort(this.value)">
            <option value="popular" data-i18n="sort_pop">⚡ Ommabop uskunalar</option>
            <option value="price_asc" data-i18n="sort_asc">Narx: Arzondan qimmatga</option>
            <option value="price_desc" data-i18n="sort_desc">Narx: Qimmatdan arzonga</option>
            <option value="name_asc" data-i18n="sort_name">Nom bo‘yicha (A-Z)</option>
          </select>
        </div>

        <div class="market-cat-pills" id="marketCatPills">
          <button class="market-cat-pill active" data-cat="all" onclick="setCategoryFilter('all', this)">
            <span data-i18n="cat_all">Barchasi</span> <span class="market-cat-count">{categories_count['all']}</span>
          </button>
          <button class="market-cat-pill" data-cat="monobloks" onclick="setCategoryFilter('monobloks', this)">
            <span data-i18n="cat_mono">POS Monobloklar</span> <span class="market-cat-count">{categories_count['monobloks']}</span>
          </button>
          <button class="market-cat-pill" data-cat="scanners" onclick="setCategoryFilter('scanners', this)">
            <span data-i18n="cat_scan">Skanerlar</span> <span class="market-cat-count">{categories_count['scanners']}</span>
          </button>
          <button class="market-cat-pill" data-cat="printers" onclick="setCategoryFilter('printers', this)">
            <span data-i18n="cat_print">Printerlar</span> <span class="market-cat-count">{categories_count['printers']}</span>
          </button>
          <button class="market-cat-pill" data-cat="scales_drawers" onclick="setCategoryFilter('scales_drawers', this)">
            <span data-i18n="cat_draw">Tarozilar & Qutilar</span> <span class="market-cat-count">{categories_count['scales_drawers']}</span>
          </button>
          <button class="market-cat-pill" data-cat="security" onclick="setCategoryFilter('security', this)">
            <span data-i18n="cat_sec">Xavfsizlik tizimlari</span> <span class="market-cat-count">{categories_count['security']}</span>
          </button>
          <button class="market-cat-pill" data-cat="interactive" onclick="setCategoryFilter('interactive', this)">
            <span data-i18n="cat_doska">Interaktiv doskalar</span> <span class="market-cat-count">{categories_count['interactive']}</span>
          </button>
          <button class="market-cat-pill" data-cat="supplies" onclick="setCategoryFilter('supplies', this)">
            <span data-i18n="cat_sup">Chek lentalari</span> <span class="market-cat-count">{categories_count['supplies']}</span>
          </button>
          <button class="market-cat-pill" data-cat="other" onclick="setCategoryFilter('other', this)">
            <span data-i18n="cat_other">Boshqa jihozlar</span> <span class="market-cat-count">{categories_count['other']}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== PRODUCTS LIST ==================== -->
    <section class="sec" style="padding-top:20px;">
      <div class="wrap">
        <div class="market-results-bar">
          <div><span data-i18n="lbl_showing">Ko‘rsatilmoqda:</span> <span id="visibleCount" class="market-results-count">{len(processed_products)}</span> <span data-i18n="lbl_units">ta uskuna</span></div>
          <div id="activeFilterLabel" style="font-weight:600;color:var(--blue);">Kategoriya: Barchasi</div>
        </div>

        <div class="market-grid" id="marketProductGrid">
          {''.join(cards_html)}

          <div class="empty-state" id="marketEmptyState">
            <div class="empty-state-icon">🔍</div>
            <h3 data-i18n="empty_title">Hech qanday uskuna topilmadi</h3>
            <p data-i18n="empty_sub">Qidiruv so‘zini o‘zgartiring yoki boshqa kategoriyani tanlang.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- ==================== PRODUCT DETAIL & ORDER MODAL ==================== -->
  <div class="market-modal-backdrop" id="marketModalBackdrop" onclick="handleBackdropClick(event)">
    <div class="market-modal" id="marketModal">
      <button class="market-modal-close" onclick="closeMarketModal()">✕</button>
      
      <div class="market-modal-left">
        <span id="modalBrandBadge" class="market-brand-badge" style="margin-bottom:14px;">BRAND</span>
        <img id="modalImg" src="" alt="Uskuna" class="market-modal-img"/>
        <div class="market-stock-pill" style="margin-bottom:10px;"><span class="market-stock-dot"></span> <span data-i18n="modal_warranty">Rasmiy kafolat 1 yil</span></div>
        <div id="modalPrice" class="market-modal-price">0 so‘m</div>
      </div>

      <div class="market-modal-right">
        <span id="modalCat" style="font-size:12px;font-weight:700;color:var(--mute);text-transform:uppercase;letter-spacing:0.04em;">KATEGORIYA</span>
        <h2 id="modalTitle" class="market-modal-title">Mahsulot nomi</h2>
        
        <div class="market-specs-list" id="modalSpecsList" style="margin-bottom:16px;">
          <!-- Injected via JS -->
        </div>

        <div class="market-modal-desc" id="modalDesc">
          Tavsif yuklanmoqda...
        </div>

        <div class="market-order-form">
          <div class="market-form-title">
            <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><use href="#i-send"/></svg>
            <span data-i18n="modal_form_title">Tezkor buyurtma berish</span>
          </div>
          <div class="market-form-row">
            <input type="text" id="orderClientName" class="market-form-input" placeholder="Ismingiz" data-i18n-ph="ph_name"/>
          </div>
          <div class="market-form-row">
            <input type="tel" id="orderClientPhone" class="market-form-input" placeholder="Telefon raqamingiz (+998)" value="+998 " data-i18n-ph="ph_phone"/>
          </div>
          <button class="market-form-submit" onclick="submitProductOrder()">
            <svg style="width:18px;height:18px;fill:currentColor" viewBox="0 0 24 24"><use href="#i-send"/></svg>
            <span data-i18n="modal_btn_submit">Telegram orqali buyurtma berish</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  {common_foot}

  <!-- ==================== JAVASCRIPT ==================== -->
  <script>
  const PRODUCTS_DATA = {products_json};
  const productMap = {{}};
  PRODUCTS_DATA.forEach(p => {{ productMap[p.id] = p; }});

  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'popular';
  let activeModalProductId = null;

  const I18N = {{
    uz: {{
      nav_home: "Bosh sahifa",
      nav_services: "Xizmatlar",
      nav_equip: "Jihozlar",
      hero_btn_equip: "Jihozlar do‘koni",
      nav_process: "Jarayon",
      nav_faq: "Savol-javob",
      nav_contact: "Aloqa",
      market_badge: "⚡ Rasmiy kafolat & Toshkent omboridan yetkazib berish",
      market_title: "Kassa va Savdo Jihozlari Do‘koni",
      market_sub: "Biznesingiz uchun professional POS-monobloklar, statsionar va qo‘l skanerlari, chek va barkod printerlari, kassa qutilari hamda sarf materiallari to‘g‘ridan-to‘g‘ri birinchi qo‘ldan.",
      market_stat_stock: "120+ uskunalar omborda",
      market_stat_speed: "1 kunda tezkor yetkazish",
      market_stat_warranty: "1 yil rasmiy kafolat",
      market_stat_integ: "1C & Kassa integratsiyasi",
      search_ph: "Jihoz nomi, model yoki brend bo‘yicha qidirish...",
      sort_pop: "⚡ Ommabop uskunalar",
      sort_asc: "Narx: Arzondan qimmatga",
      sort_desc: "Narx: Qimmatdan arzonga",
      sort_name: "Nom bo‘yicha (A-Z)",
      cat_all: "Barchasi",
      cat_mono: "POS Monobloklar",
      cat_scan: "Skanerlar",
      cat_print: "Printerlar",
      cat_draw: "Tarozilar & Qutilar",
      cat_sec: "Xavfsizlik tizimlari",
      cat_doska: "Interaktiv doskalar",
      cat_sup: "Chek lentalari",
      cat_other: "Boshqa jihozlar",
      lbl_showing: "Ko‘rsatilmoqda:",
      lbl_units: "ta uskuna",
      btn_detail: "Batafsil",
      btn_order: "Buyurtma",
      stock_avail: "Mavjud",
      modal_warranty: "Rasmiy kafolat 1 yil",
      modal_form_title: "Tezkor buyurtma berish",
      ph_name: "Ismingiz",
      ph_phone: "Telefon raqamingiz (+998)",
      modal_btn_submit: "Telegram orqali buyurtma berish",
      empty_title: "Hech qanday uskuna topilmadi",
      empty_sub: "Qidiruv so‘zini o‘zgartiring yoki boshqa kategoriyani tanlang."
    }},
    ru: {{
      nav_home: "Главная",
      nav_services: "Услуги",
      nav_equip: "Оборудование",
      hero_btn_equip: "Магазин оборудования",
      nav_process: "Процесс",
      nav_faq: "Вопросы и ответы",
      nav_contact: "Контакты",
      market_badge: "⚡ Официальная гарантия и доставка со склада в Ташкенте",
      market_title: "Магазин торгового и кассового оборудования",
      market_sub: "Профессиональные POS-моноблоки, сканеры, чековые и штрих-код принтеры, денежные ящики и расходные материалы для вашего бизнеса из первых рук.",
      market_stat_stock: "120+ единиц на складе",
      market_stat_speed: "Доставка за 1 день",
      market_stat_warranty: "Гарантия 1 год",
      market_stat_integ: "Интеграция с 1C и кассой",
      search_ph: "Поиск по названию, модели или бренду...",
      sort_pop: "⚡ Популярное оборудование",
      sort_asc: "Цена: Сначала дешевле",
      sort_desc: "Цена: Сначала дороже",
      sort_name: "По названию (А-Я)",
      cat_all: "Все",
      cat_mono: "POS Моноблоки",
      cat_scan: "Сканеры",
      cat_print: "Принтеры",
      cat_draw: "Весы и ящики",
      cat_sec: "Системы безопасности",
      cat_doska: "Интерактивные доски",
      cat_sup: "Чековые ленты",
      cat_other: "Другое оборудование",
      lbl_showing: "Отображается:",
      lbl_units: "ед. оборудования",
      btn_detail: "Подробнее",
      btn_order: "Заказать",
      stock_avail: "В наличии",
      modal_warranty: "Официальная гарантия 1 год",
      modal_form_title: "Быстрый заказ",
      ph_name: "Ваше имя",
      ph_phone: "Номер телефона (+998)",
      modal_btn_submit: "Заказать через Telegram",
      empty_title: "Оборудование не найдено",
      empty_sub: "Измените поисковый запрос или выберите другую категорию."
    }}
  }};

  function setLanguage(lang) {{
    if (!I18N[lang]) lang = 'uz';
    localStorage.setItem('ds_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {{
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    }});

    document.querySelectorAll('[data-i18n]').forEach(el => {{
      const key = el.getAttribute('data-i18n');
      if (I18N[lang] && I18N[lang][key]) {{
        el.textContent = I18N[lang][key];
      }}
    }});

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {{
      const key = el.getAttribute('data-i18n-ph');
      if (I18N[lang] && I18N[lang][key]) {{
        el.placeholder = I18N[lang][key];
      }}
    }});
  }}

  // Check saved lang
  const savedLang = localStorage.getItem('ds_lang') || 'uz';
  if (savedLang !== 'uz') setLanguage(savedLang);

  // Initialize Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {{
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }}

  // Burger Menu Toggle
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (burger && drawer) {{
    burger.addEventListener('click', () => {{
      const open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }});
  }}

  // Search
  function handleMarketSearch(query) {{
    currentSearch = query.trim().toLowerCase();
    const clearBtn = document.getElementById('marketSearchClear');
    if (clearBtn) clearBtn.style.display = currentSearch ? 'flex' : 'none';
    filterAndRender();
  }}

  function clearMarketSearch() {{
    const input = document.getElementById('marketSearchInput');
    if (input) {{
      input.value = '';
      handleMarketSearch('');
      input.focus();
    }}
  }}

  // Category Filter
  function setCategoryFilter(cat, btn) {{
    currentCategory = cat;
    document.querySelectorAll('.market-cat-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const catLabels = {{
      all: 'Barchasi',
      monobloks: 'POS Monobloklar',
      scanners: 'Skanerlar',
      printers: 'Printerlar',
      scales_drawers: 'Tarozilar & Qutilar',
      security: 'Xavfsizlik tizimlari',
      interactive: 'Interaktiv doskalar',
      supplies: 'Chek lentalari',
      other: 'Boshqa jihozlar'
    }};
    const activeLabel = document.getElementById('activeFilterLabel');
    if (activeLabel) activeLabel.textContent = 'Kategoriya: ' + (catLabels[cat] || cat);

    filterAndRender();
  }}

  // Sorting
  function handleMarketSort(sortVal) {{
    currentSort = sortVal;
    const grid = document.getElementById('marketProductGrid');
    const cards = Array.from(grid.querySelectorAll('.market-card'));

    cards.sort((a, b) => {{
      const priceA = parseFloat(a.getAttribute('data-price') || 0);
      const priceB = parseFloat(b.getAttribute('data-price') || 0);
      const nameA = a.getAttribute('data-name') || '';
      const nameB = b.getAttribute('data-name') || '';

      if (currentSort === 'price_asc') return priceA - priceB;
      if (currentSort === 'price_desc') return priceB - priceA;
      if (currentSort === 'name_asc') return nameA.localeCompare(nameB);
      return 0; // default popular
    }});

    const empty = document.getElementById('marketEmptyState');
    cards.forEach(card => grid.appendChild(card));
    grid.appendChild(empty);
  }}

  // Filter & Visibility logic
  function filterAndRender() {{
    const cards = document.querySelectorAll('.market-card');
    let visible = 0;

    cards.forEach(card => {{
      const cat = card.getAttribute('data-cat');
      const searchText = card.getAttribute('data-search') || '';

      const matchCat = (currentCategory === 'all' || cat === currentCategory);
      const matchSearch = (!currentSearch || searchText.includes(currentSearch));

      if (matchCat && matchSearch) {{
        card.style.display = 'flex';
        visible++;
      }} else {{
        card.style.display = 'none';
      }}
    }});

    const counter = document.getElementById('visibleCount');
    if (counter) counter.textContent = visible;

    const empty = document.getElementById('marketEmptyState');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }}

  // Detail Modal
  function openMarketDetail(prodId) {{
    const p = productMap[prodId];
    if (!p) return;
    activeModalProductId = prodId;

    document.getElementById('modalBrandBadge').textContent = p.brand;
    document.getElementById('modalBrandBadge').style.background = p.brand_color + '15';
    document.getElementById('modalBrandBadge').style.color = p.brand_color;
    document.getElementById('modalBrandBadge').style.borderColor = p.brand_color + '30';

    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalPrice').textContent = p.price_str;
    document.getElementById('modalCat').textContent = p.cat_label_uz;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalDesc').innerHTML = p.raw_description.replace(/\\n/g, '<br/>') || 'Ushbu uskuna haqida batafsil ma’lumot olish uchun quyidagi forma orqali so‘rov qoldiring.';

    const specsBox = document.getElementById('modalSpecsList');
    specsBox.innerHTML = `
      <div class="market-spec-item"><span class="market-spec-num">❶</span><span class="market-spec-txt">${{p.spec1}}</span></div>
      <div class="market-spec-item"><span class="market-spec-num">❷</span><span class="market-spec-txt">${{p.spec2}}</span></div>
      <div class="market-spec-item"><span class="market-spec-num">❸</span><span class="market-spec-txt">${{p.spec3}}</span></div>
    `;

    document.getElementById('marketModalBackdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }}

  function openFastOrder(prodId) {{
    openMarketDetail(prodId);
    setTimeout(() => {{
      const input = document.getElementById('orderClientName');
      if (input) input.focus();
    }}, 200);
  }}

  function closeMarketModal() {{
    document.getElementById('marketModalBackdrop').classList.remove('open');
    document.body.style.overflow = '';
  }}

  function handleBackdropClick(e) {{
    if (e.target.id === 'marketModalBackdrop') {{
      closeMarketModal();
    }}
  }}

  // Submit Order via Telegram
  function submitProductOrder() {{
    const p = productMap[activeModalProductId];
    if (!p) return;

    const name = document.getElementById('orderClientName').value.trim();
    const phone = document.getElementById('orderClientPhone').value.trim();

    if (!phone || phone.length < 9) {{
      alert('Iltimos, telefon raqamingizni to‘liq kiriting!');
      return;
    }}

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.sendData) {{
      window.Telegram.WebApp.sendData(JSON.stringify({{
        type: 'hardware_order',
        product: p.name,
        price: p.price_str,
        name: name,
        phone: phone
      }}));
      alert('Buyurtmangiz qabul qilindi! Menejerimiz tez orada bog‘lanadi.');
      closeMarketModal();
      return;
    }}

    const tgUrl = `https://t.me/dashboardsalevvbot?start=buy_${{p.id}}`;
    window.open(tgUrl, '_blank');
    alert('Buyurtmangiz qabul qilindi! Menejerimiz tez orada bog‘lanadi.');
    closeMarketModal();
  }}

  // Theme Toggle
  function toggleTheme() {{
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {{ localStorage.setItem('theme', next); }} catch(e) {{}}
    const btn = document.querySelector('.theme-toggle-btn .theme-icon');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  }}
  </script>
</body>
</html>
'''

with open('public/market.html', 'w', encoding='utf-8') as f:
    f.write(market_html)

# Copy to dashboardsale-bundle and scratch root
shutil.copy('public/market.html', '/home/actualtam/.gemini/antigravity/scratch/market.html')
shutil.copy('public/market.html', 'dashboardsale-bundle/market.html')
print("Successfully generated public/market.html and synchronized copies!")
