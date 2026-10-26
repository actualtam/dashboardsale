import re
import os

print("Updating scripts/build_full_website.py with real 3D render assets...")

with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    script_text = f.read()

# 1. Update additional_css with .shot-img and .svc-visual styles
css_insertion = '''
    /* Real 3D Render Image Styles */
    .shot {
      position: absolute;
      overflow: hidden;
      box-shadow: 0 16px 44px rgba(15, 19, 32, 0.08);
      transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
      pointer-events: auto;
      cursor: pointer;
    }
    .shot img.shot-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .shot:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 28px 64px rgba(11, 92, 255, 0.18);
      z-index: 10;
    }
    .shot:hover img.shot-img {
      transform: scale(1.06);
    }

    .svc-hero-split {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 32px;
      align-items: center;
      margin-bottom: 24px;
    }
    @media (max-width: 860px) {
      .svc-hero-split { grid-template-columns: 1fr; }
    }
    .svc-hero-visual {
      width: 100%;
      height: 240px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(15, 19, 32, 0.08);
      background: linear-gradient(135deg, #fbf7f2, #ede2d3);
    }
    .svc-card-visual {
      width: 100%;
      height: 180px;
      border-radius: 18px;
      overflow: hidden;
      margin-bottom: 20px;
      background: var(--soft);
      box-shadow: 0 8px 24px rgba(15, 19, 32, 0.06);
    }
    .svc-visual-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform .4s cubic-bezier(.2,.8,.2,1);
    }
    .svc:hover .svc-visual-img {
      transform: scale(1.06);
    }
    [data-theme="dark"] .svc-card-visual,
    [data-theme="dark"] .svc-hero-visual {
      background: #141d33 !important;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
'''

# 2. Define the new 3D hero stage
new_hero_stage_code = '''
# 3D Render Hero Stage
new_hero_stage = \'\'\'
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
\'\'\'
'''

# 3. Define the updated new_services_html with 3D renders
updated_services_html = '''
# Update Services section with direct links and 3D visual render cards
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
            <span class="badge" style="margin-bottom:12px;">Ko‘p kanalli savdo</span>
            <h3>Veb-saytlar va savdo ilovalari</h3>
            <p>Do‘koningiz uchun zamonaviy veb-sayt, mobil ilova va Telegram savdo boti. Mahsulotlar katalogi, savat, onlayn to‘lov va kuryerlik yetkazib berish integratsiyasi bilan to‘liq jihozlangan ko‘p kanalli savdo tizimlari.</p>
            <a class="svc-link" href="services-online-store.html">
              <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
              <svg class="ico"><use href="#i-arrow"/></svg>
            </a>
          </div>
          <div class="svc-hero-visual">
            <img src="/images/services/svc-online-store.png" alt="Sensorli POS monoblok va savdo tizimlari" class="svc-visual-img" loading="lazy"/>
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
          <div class="svc-card-visual">
            <img src="/images/services/svc-accounting-bots.png" alt="Buxgalteriya va savdo tahlili botlari" class="svc-visual-img" loading="lazy"/>
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
          <div class="svc-card-visual">
            <img src="/images/services/svc-attendance.png" alt="Face ID biometriya va davomat nazorati" class="svc-visual-img" loading="lazy"/>
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
          <div class="svc-card-visual">
            <img src="/images/services/svc-ai-cameras.png" alt="AI videokuzatuv va gavjum zonalar xaritasi" class="svc-visual-img" loading="lazy"/>
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
          <div class="svc-card-visual">
            <img src="/images/services/svc-equipment-setup.png" alt="Chek printerlari va shtrix-kod skanerlari" class="svc-visual-img" loading="lazy"/>
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
ns_idx = script_text.find("# Update Services section with direct links to separate pages")
ns_end = script_text.find("# Update Equipment section in base HTML")
if ns_idx != -1 and ns_end != -1:
    script_text = script_text[:ns_idx] + updated_services_html + '\n\n' + script_text[ns_end:]

# Insert CSS into additional_css
css_idx = script_text.find("additional_css = '''") + len("additional_css = '''")
script_text = script_text[:css_idx] + css_insertion + script_text[css_idx:]

# Insert hero-stage replacement in execution part
repl_hero_logic = '''
# 3.1 Replace hero-stage with Real 3D renders
hs_start = output_html.find('<div class="hero-stage">')
hs_end = output_html.find('</div>\\n  </section>', hs_start) + len('</div>')
if hs_start != -1 and hs_end != -1:
    output_html = output_html[:hs_start] + new_hero_stage.strip() + output_html[hs_end:]
'''

eq_repl_idx = script_text.find("# 5. Replace Equipment section")
if eq_repl_idx != -1:
    script_text = script_text[:eq_repl_idx] + new_hero_stage_code + '\n' + repl_hero_logic + '\n\n' + script_text[eq_repl_idx:]

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(script_text)

print("Updated scripts/build_full_website.py successfully!")
