import re

print("Applying perfect 3D icon tiles and padded visuals...")

with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update CSS for .svc-icon-tile, .svc-hero-visual, and .shot img.shot-img
icon_tile_css = '''
    /* ==================== 3D ICON TILES & PADDED VISUALS ==================== */
    .svc-icon-tile {
      width: 68px;
      height: 68px;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--soft);
      box-shadow: 0 8px 24px rgba(11, 92, 255, 0.1);
      border: 1px solid var(--line);
      padding: 4px;
      transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
    }
    .svc:hover .svc-icon-tile {
      transform: translateY(-4px) scale(1.08);
      box-shadow: 0 14px 32px rgba(11, 92, 255, 0.2);
    }
    .svc-icon-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 16px;
      display: block;
      transition: transform .35s ease;
    }
    .svc:hover .svc-icon-img {
      transform: scale(1.06);
    }

    /* Hero Service Split & Visual */
    .svc-hero-split {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 32px;
      align-items: center;
      margin-bottom: 24px;
    }
    @media (max-width: 860px) {
      .svc-hero-split { grid-template-columns: 1fr; }
    }
    .svc-hero-visual {
      width: 100%;
      height: 220px;
      border-radius: 24px;
      overflow: hidden;
      background: #fbf7f2;
      box-shadow: 0 12px 32px rgba(15, 19, 32, 0.08);
      border: 1px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .svc-visual-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: transform .4s ease;
    }
    .svc:hover .svc-visual-img {
      transform: scale(1.05);
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

    /* Padded Shot Images in Hero */
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
'''

# 2. Update new_services_html so cards use .svc-icon-tile in the icon place!
clean_services_html = '''
# Update Services section with 3D icons in the icon place
new_services_html = \'\'\'
  <!-- ==================== SERVICES ==================== -->
  <section id="services" class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 data-i18n="sec_services_title">Biznesingiz uchun to‘liq texnologik xizmatlar</h2>
        <p data-i18n="sec_services_desc">Savdodan tortib buxgalteriya va xodimlar nazoratigacha bo‘lgan barcha jarayonlarni avtomatlashtiramiz. Har bir xizmat bo‘yicha alohida batafsil ma’lumot, tariflar va keyslar bilan tanishing.</p>
      </div>

      <!-- Hero Service 1: Veb-saytlar va savdo ilovalari -->
      <article class="svc svc-hero">
        <div class="svc-hero-split">
          <div class="svc-lead">
            <div class="svc-icon-tile">
              <img src="/images/hero/hero-pos-terminal.png" alt="POS monoblok" class="svc-icon-img"/>
            </div>
            <span class="badge" style="margin-bottom:12px;">Ko‘p kanalli savdo</span>
            <h3>Veb-saytlar va savdo ilovalari</h3>
            <p>Do‘koningiz uchun zamonaviy veb-sayt, mobil ilova va Telegram savdo boti. Mahsulotlar katalogi, savat, onlayn to‘lov va kuryerlik yetkazib berish integratsiyasi bilan to‘liq jihozlangan ko‘p kanalli savdo tizimlari.</p>
            <a class="svc-link" href="services-online-store.html">
              <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
              <svg class="ico"><use href="#i-arrow"/></svg>
            </a>
          </div>
          <div class="svc-hero-visual">
            <img src="/images/hero/hero-pos-terminal.png" alt="Sensorli POS monoblok va savdo tizimlari" class="svc-visual-img" loading="lazy"/>
          </div>
        </div>
        <div class="mini-grid">
          <div class="mini"><h4>Katalog va savat</h4><p>Qulay filtrlar, mahsulot parametrlari (o‘lcham, rang) va qoldiqlar nazorati.</p></div>
          <div class="mini"><h4>To‘lov tizimlari</h4><p>Payme, Click, Uzum orqali xavfsiz to‘lovlar va chek shakllanishi.</p></div>
          <div class="mini"><h4>Telegram savdo boti</h4><p>Ilova yuklab olmasdan Telegram orqali to‘g‘ridan-to‘g‘ri buyurtma olish.</p></div>
          <div class="mini"><h4>Yetkazib berish</h4><p>Kuryer xizmati va geolokatsiya orqali manzilni aniq belgilash.</p></div>
        </div>
      </article>

      <div class="svc-grid">
        <!-- Service 2: Buxgalteriya va biznes botlari -->
        <article class="svc">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-analytics-dashboard.png" alt="Buxgalteriya botlari" class="svc-icon-img"/>
          </div>
          <h3>Buxgalteriya va biznes botlari</h3>
          <p>1C / ERP tizimlari bilan to‘g‘ridan-to‘g‘ri sinxronlashuvchi, smena yopilishi, kunlik tushum va qoldiqlar haqida Telegram orqali xabar beruvchi aqlli botlar.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>1C:Korxona va ERP bilan ikki tomonlama sinxronizatsiya</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kunlik tushum, kassa hisoboti va kassir smenasi</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kam qolgan tovarlar bo‘yicha avtomatik xabarnoma</li>
          </ul>
          <a class="svc-link" href="services-accounting-bots.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 3: Xodimlar davomati va nazorat tizimlari -->
        <article class="svc">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-face-attendance.png" alt="Face ID davomat" class="svc-icon-img"/>
          </div>
          <h3>Xodimlar davomati va nazorat tizimlari</h3>
          <p>Face ID va biometriya orqali xodimlar keldi-ketdisini aniq qayd etish. Kechikishlar va sababsiz kelmasliklarni hisoblab, oylik maosh jadvaliga uzatish.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Face ID biometrik terminallari va turniket montaji</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kechikishlar va ish vaqti daqiqasigacha tahlili</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Oylik maosh hisob-kitobi bilan avtomat integratsiya</li>
          </ul>
          <a class="svc-link" href="services-attendance.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 4: AI kamera va aqlli monitoring -->
        <article class="svc">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-ai-camera-heatmap.png" alt="AI videokuzatuv" class="svc-icon-img"/>
          </div>
          <h3>AI kamera va aqlli monitoring</h3>
          <p>Sun’iy intellekt asosidagi videokuzatuv tizimi savdo nuqtasidagi eng gavjum hududlarni aniqlaydi, kassadagi qallobliklarni fosh etadi va xavfsizlikni ta’minlaydi.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Mijozlar oqimi va eng gavjum zonalar xaritasi (Heatmap)</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kassadagi navbat monitoringi va xizmat ko‘rsatish tezligi</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Kassadagi shubhali holatlar va qoidabuzarliklar nazorati</li>
          </ul>
          <a class="svc-link" href="services-ai-cameras.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 5: Biznes uskunalari va montaj -->
        <article class="svc">
          <div class="svc-icon-tile">
            <img src="/images/hero/hero-printer-scanner.png" alt="Chek printerlari va skanerlar" class="svc-icon-img"/>
          </div>
          <h3>Biznes uskunalari va montaj</h3>
          <p>Chakana savdo va xizmat ko‘rsatish sohalari uchun zarur barcha kassa texnikasini yetkazib beramiz, joyida o‘rnatamiz va kafolatli texnik ko‘mak beramiz.</p>
          <ul class="checks">
            <li><svg class="ico"><use href="#i-check"/></svg>Sensorli POS Monobloklar (15.6" IPS FHD)</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Tezkor chek printerlari (80mm avtomatik pichoq)</li>
            <li><svg class="ico"><use href="#i-check"/></svg>Shtrix-kod skanerlari (1D / 2D / QR) va metall kassa qutilari</li>
          </ul>
          <a class="svc-link" href="services-equipment-setup.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>
      </div>
    </div>
  </section>
\'\'\'
'''

# Replace new_services_html definition
s_start = text.find("# Update Services section with direct links and 3D visual render cards")
if s_start == -1:
    s_start = text.find("# Update Services section with direct links to separate pages")
s_end = text.find("# 3D Render Hero Stage", s_start)
if s_start != -1 and s_end != -1:
    text = text[:s_start] + clean_services_html.strip() + '\n\n' + text[s_end:]

# Insert icon_tile_css into additional_css
css_idx = text.find("additional_css = '''") + len("additional_css = '''")
text = text[:css_idx] + icon_tile_css + text[css_idx:]

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated build_full_website.py with clean 3D icon tiles in the icon place!")
