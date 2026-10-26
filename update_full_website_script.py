with open('scripts/build_full_website.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Update new_services_html to include TGShop as Hero service and all 6 services
new_services_html = '''
  <!-- ==================== SERVICES ==================== -->
  <section id="services" class="sec">
    <div class="wrap">
      <div class="sec-head">
        <h2 data-i18n="sec_services_title">Biznesingiz uchun to‘liq texnologik xizmatlar</h2>
        <p data-i18n="sec_services_desc">Savdodan tortib buxgalteriya, xodimlar nazorati va kassa jihozlarigacha bo‘lgan barcha jarayonlarni avtomatlashtiramiz. Har bir xizmat alohida tizimga ega bo‘lib, batafsil sahifasida to‘liq ma’lumot va ulanish uchun ariza topshirishingiz mumkin.</p>
      </div>

      <!-- Hero Service 1: Telegram Mini App do'koni va yetkazib berish (TGShop) -->
      <article class="svc svc-hero" style="border: 2px solid rgba(11,92,255,0.2);box-shadow: 0 16px 40px rgba(11,92,255,0.08);">
        <div class="svc-hero-split">
          <div class="svc-lead">
            <div class="svc-icon-tile">
              <img src="/images/services/icon-tg-shop.png" alt="Telegram Mini App Do‘koni" class="svc-icon-img"/>
            </div>
            <span class="badge" style="background:#0b5cff;color:#fff;margin-bottom:12px;">⚡ Yangi & Eng ommabop</span>
            <h3>Telegram Mini App do‘koni va yetkazib berish (TGShop)</h3>
            <p>Mijozlaringiz hech qanday ilova yuklamasdan, to‘g‘ridan-to‘g‘ri Telegram ichida tovar tanlaydi, rang/o‘lcham belgilaydi, geolokatsiyasini yuborib Yandex Go orqali Click/Payme bilan xarid qiladi. Kuryer boti, buyurtma statuslari va 1C integratsiyasi bilan to‘liq jihozlangan tizim!</p>
            <a class="svc-link" href="services-tg-shop.html" style="font-weight:800;color:var(--blue);">
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
        <article class="svc">
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
          <a class="svc-link" href="services-online-store.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 3: Buxgalteriya va biznes botlari -->
        <article class="svc">
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
          <a class="svc-link" href="services-accounting-bots.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 4: Xodimlar davomati va nazorat tizimlari -->
        <article class="svc">
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
          <a class="svc-link" href="services-attendance.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 5: AI kamera va aqlli monitoring -->
        <article class="svc">
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
          <a class="svc-link" href="services-ai-cameras.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>

        <!-- Service 6: Kassa uskunalarini o‘rnatish va montaj -->
        <article class="svc">
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
          <a class="svc-link" href="services-equipment-setup.html">
            <span data-i18n="svc_detail">Batafsil xizmat sahifasiga o‘tish</span>
            <svg class="ico"><use href="#i-arrow"/></svg>
          </a>
        </article>
      </div>
    </div>
  </section>
'''

# Replace new_services_html definition in scripts/build_full_website.py
import re
text = re.sub(r'new_services_html = \'\'\'.*?\'\'\'', f"new_services_html = '''{new_services_html}'''", text, flags=re.DOTALL)

# Redesign Equipment Section on Homepage to be a clean Showcase that points to market.html
new_equipment_section = '''
  <!-- ==================== EQUIPMENT SHOWCASE ==================== -->
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
        <a href="market.html" class="btn btn-p btn-lg rip" style="display:inline-flex;align-items:center;gap:12px;font-size:16.5px;font-weight:800;padding:16px 36px;border-radius:14px;box-shadow:0 10px 28px rgba(11,92,255,0.25);">
          <svg class="ico" style="width:20px;height:20px;"><use href="#i-arrow"/></svg>
          <span>🛍 Jihozlar do‘koniga o‘tish (Barcha 120+ uskunani ko‘rish) →</span>
        </a>
      </div>
    </div>
  </section>
'''

text = re.sub(r'new_equipment_section = f?\'\'\'.*?\'\'\'', f"new_equipment_section = '''{new_equipment_section}'''", text, flags=re.DOTALL)

with open('scripts/build_full_website.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated build_full_website.py with 6 services and sleek equipment showcase!")
