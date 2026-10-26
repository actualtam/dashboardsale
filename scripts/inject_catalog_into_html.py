import shutil
import re
import os

with open('public/dashboardsale.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('catalog_cards_snippet.html', 'r', encoding='utf-8') as f:
    catalog_snippet = f.read()

# Catalog CSS
catalog_css = '''
    /* ==================== HARDWARE CATALOG STYLES ==================== */
    .equip-catalog-header { margin: 28px 0 36px; display: flex; flex-direction: column; gap: 18px; }
    .equip-search-bar { position: relative; max-width: 520px; width: 100%; }
    .equip-search-bar .search-ico { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; stroke: #94a3b8; fill: none; stroke-width: 2; pointer-events: none; }
    .equip-search-bar input { width: 100%; height: 50px; padding: 0 44px 0 48px; border-radius: 25px; border: 1.5px solid #e2e8f0; background: #fff; font-family: inherit; font-size: 15px; font-weight: 500; color: var(--ink); outline: none; transition: all .2s; }
    .equip-search-bar input:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(11,92,255,.12); }
    .search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 50%; border: none; background: #f1f5f9; color: #64748b; font-size: 13px; font-weight: 700; cursor: pointer; display: none; place-items: center; }
    .search-clear.visible { display: grid; }

    .equip-filter-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
    .filter-tab { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 10px 18px; font-family: inherit; font-size: 14px; font-weight: 700; color: #475569; cursor: pointer; transition: all .2s; white-space: nowrap; }
    .filter-tab:hover { border-color: #cbd5e1; background: #f8fafc; color: var(--ink); }
    .filter-tab.active { background: #5c59f0; border-color: #5c59f0; color: #fff; box-shadow: 0 4px 14px rgba(92,89,240,.25); }

    .equip-section-block { margin-bottom: 48px; }
    .equip-section-title { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #eef2f7; }
    .equip-section-title h3 { font-size: 24px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin: 0; }
    .equip-count-tag { font-size: 13px; font-weight: 700; color: var(--blue); background: var(--tint); padding: 4px 12px; border-radius: 12px; }

    .equip-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }

    /* Product Card matching screenshot */
    .prod-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px; display: flex; flex-direction: column; position: relative; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; box-shadow: 0 2px 8px rgba(15,19,32,.03); }
    .prod-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(15,19,32,.08); border-color: #cbd5e1; }

    .prod-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .prod-brand { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; letter-spacing: .06em; color: #1e293b; text-transform: uppercase; }
    .prod-brand-ico { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.2; color: #5c59f0; }
    .prod-fav { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; display: grid; place-items: center; transition: all .2s; }
    .prod-fav svg { width: 16px; height: 16px; fill: none; stroke: #94a3b8; stroke-width: 2; transition: all .2s; }
    .prod-fav:hover { border-color: #cbd5e1; background: #f8fafc; }
    .prod-fav.active { background: #fee2e2; border-color: #fca5a5; }
    .prod-fav.active svg { fill: #ef4444; stroke: #ef4444; }

    .prod-img-box { height: 180px; width: 100%; display: grid; place-items: center; padding: 10px; margin-bottom: 14px; background: radial-gradient(circle at center, #fafbfd 0%, #ffffff 70%); border-radius: 12px; }
    .prod-img { max-height: 100%; max-width: 100%; object-fit: contain; transition: transform .3s ease; }
    .prod-card:hover .prod-img { transform: scale(1.06); }

    .prod-specs { background: #f8fafc; border-radius: 12px; padding: 10px 12px; margin-bottom: 14px; display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 600; color: #334155; }
    .prod-spec-row { display: flex; align-items: center; gap: 8px; }
    .prod-num { color: #5c59f0; font-weight: 800; font-size: 13px; flex-shrink: 0; }
    .prod-spec-txt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .prod-price-box { margin-bottom: 4px; }
    .prod-old-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
    .prod-old-val { color: #94a3b8; font-size: 13px; text-decoration: line-through; font-weight: 600; }
    .prod-badge { color: #e5484d; font-size: 12px; font-weight: 800; background: #fee2e2; padding: 2px 7px; border-radius: 6px; }
    .prod-cur-val { color: #0f1320; font-size: 20px; font-weight: 800; letter-spacing: -.02em; }

    .prod-title { font-size: 15px; font-weight: 700; color: #475569; margin: 4px 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .prod-rating { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #d97706; margin-bottom: 14px; }
    .prod-star { color: #f59e0b; font-size: 15px; }
    .prod-reviews { color: #94a3b8; font-size: 12px; font-weight: 500; }

    .prod-buy-btn { margin-top: auto; width: 100%; background: #5c59f0; color: #fff; border: none; border-radius: 12px; padding: 12px 16px; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all .2s ease; box-shadow: 0 4px 14px rgba(92,89,240,.25); }
    .prod-buy-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.5; }
    .prod-buy-btn:hover { background: #4a47e0; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(92,89,240,.35); }

    /* Toast notification */
    .equip-toast { position: fixed; bottom: 28px; right: 28px; background: #0f1320; color: #fff; padding: 14px 22px; border-radius: 16px; font-size: 14px; font-weight: 600; box-shadow: 0 12px 36px rgba(0,0,0,.25); display: flex; align-items: center; gap: 12px; z-index: 1000; transform: translateY(100px); opacity: 0; transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); }
    .equip-toast.show { transform: translateY(0); opacity: 1; }
    .equip-toast-ico { width: 22px; height: 22px; border-radius: 50%; background: #16a864; display: grid; place-items: center; color: #fff; }
    .equip-toast-ico svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 2.5; fill: none; }
'''

# Catalog JS
catalog_js = '''
  // ==================== HARDWARE CATALOG SCRIPTS ====================
  let currentFilter = 'all';
  let favCount = 0;
  let cartCount = 0;

  function setEquipFilter(cat, btn) {
    currentFilter = cat;
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  }

  function handleEquipSearch(val) {
    const clearBtn = document.getElementById('equipClearBtn');
    if (val.trim()) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
    applyFilters();
  }

  function clearEquipSearch() {
    const input = document.getElementById('equipSearchInput');
    input.value = '';
    document.getElementById('equipClearBtn').classList.remove('visible');
    applyFilters();
  }

  function applyFilters() {
    const query = (document.getElementById('equipSearchInput')?.value || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.prod-card');

    cards.forEach(card => {
      const matchCat = currentFilter === 'all' || card.classList.contains(currentFilter);
      const name = card.getAttribute('data-name') || '';
      const brand = card.getAttribute('data-brand') || '';
      const matchSearch = !query || name.includes(query) || brand.includes(query);

      if (matchCat && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Hide empty sections if all cards hidden
    document.querySelectorAll('.equip-section-block').forEach(sec => {
      const visible = sec.querySelectorAll('.prod-card[style*="display: flex"]').length;
      if (visible === 0 && (query || currentFilter !== 'all')) {
        sec.style.display = 'none';
      } else {
        sec.style.display = 'block';
      }
    });
  }

  function toggleFav(btn) {
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      favCount++;
      showToast('Mahsulot sevimlilar ro‘yxatiga qo‘shildi');
    } else {
      favCount = Math.max(0, favCount - 1);
    }
  }

  function openProductOrder(name, price, img) {
    cartCount++;
    showToast(`"${name}" so‘rovi qabul qilindi. Menejerga yo‘naltirilmoqda...`);
    
    // Auto-fill modal with product info
    openModal('equipment_setup');
    
    setTimeout(() => {
      const notes = document.getElementById('req-notes');
      if (notes) {
        notes.value = `Tanlangan uskuna: ${name} (${price}). Yetkazib berish va o‘rnatish bo‘yicha batafsil ma'lumot kerak.`;
      }
    }, 150);
  }

  function showToast(text) {
    let toast = document.getElementById('equipToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'equipToast';
      toast.className = 'equip-toast';
      toast.innerHTML = `<span class="equip-toast-ico"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span><span id="equipToastText"></span>`;
      document.body.appendChild(toast);
    }
    document.getElementById('equipToastText').innerText = text;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
'''

# 1. Add CSS to <style>
if '/* ==================== HARDWARE CATALOG STYLES ==================== */' not in html:
    html = html.replace('</style>', f'{catalog_css}\n  </style>')

# 2. Replace equipment section content
equip_pattern = re.compile(r'(<section id="equipment" class="sec">[\s\S]*?<div class="wrap">[\s\S]*?<div class="sec-head">[\s\S]*?</div>)[\s\S]*?(</section>)', re.MULTILINE)

new_equip_body = f'''\\1
      <p style="margin-top: -16px; margin-bottom: 24px; color: var(--mute); font-size: 16px; font-weight: 500;">
        Toshkent omboridagi rasmiy kafolatlangan savdo terminallari, statsionar va qo‘l skanerlari hamda chek printerlari.
      </p>

      {catalog_snippet}

      <div class="equip-actions" style="margin-top: 48px; text-align: center;">
        <a class="btn btn-primary" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
          <svg class="ico"><use href="#i-send"/></svg>Telegram orqali narxlar ro‘yxatini olish (@dashboardsalevvbot)
        </a>
        <button class="btn btn-white" onclick="openModal('equipment_setup')">Menejerga so‘rov qoldirish</button>
      </div>
      <div class="equip-meta" style="display:flex; justify-content:center;"><svg class="ico"><use href="#i-pin"/></svg>Toshkent ombori — Bepul yetkazib berish va o‘rnatish mavjud</div>
    </div>
  \\2'''

html = equip_pattern.sub(new_equip_body, html)

# 3. Add JS before </body>
if 'applyFilters' not in html:
    html = html.replace('</body>', f'<script>\n{catalog_js}\n</script>\n</body>')

with open('public/dashboardsale.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('/home/actualtam/.gemini/antigravity/scratch/dashboardsale.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Also update bundle and static site zip
os.makedirs('dashboardsale-bundle', exist_ok=True)
with open('dashboardsale-bundle/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Copy hardware images into dashboardsale-bundle/images/hardware
os.makedirs('dashboardsale-bundle/images/hardware', exist_ok=True)
for item in os.listdir('public/images/hardware'):
    s = os.path.join('public/images/hardware', item)
    d = os.path.join('dashboardsale-bundle/images/hardware', item)
    if os.path.isfile(s) and not os.path.exists(d):
        shutil.copy2(s, d)

import zipfile
with zipfile.ZipFile('public/dashboardsale-static-site.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write('public/dashboardsale.html', 'index.html')
    z.write('dashboardsale-bundle/index.html', 'dashboardsale-bundle/index.html')
    # add images
    for root, _, files in os.walk('dashboardsale-bundle/images'):
        for file in files:
            p = os.path.join(root, file)
            z.write(p, p)

print('Updated public/dashboardsale.html, bundle, and static site zip!')
print(f'HTML size: {len(html)} bytes')
