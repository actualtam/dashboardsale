import json
import os
import shutil
import re

print("Rebuilding all 6 standalone service pages with interactive presentations...")

with open('public/dashboardsale.html', 'r', encoding='utf-8') as f:
    full_html = f.read()

# Extract <head>...</head>
head_start = full_html.find('<head>')
head_end = full_html.find('</head>') + len('</head>')
common_head = full_html[head_start:head_end]

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

service_css = '''
<style>
/* Service Pages Shared Styles */
.svc-page-hero {
  padding: 56px 0 40px;
  background: linear-gradient(180deg, var(--soft) 0%, var(--white) 100%);
  border-bottom: 1px solid var(--line);
}
.svc-page-hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 48px;
  align-items: center;
}
@media (max-width: 900px) {
  .svc-page-hero-grid { grid-template-columns: 1fr; gap: 32px; }
}
.svc-page-hero-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.025em;
  color: var(--ink);
  margin-bottom: 16px;
}
.svc-page-hero-sub {
  font-size: 16.5px;
  line-height: 1.65;
  color: var(--mute);
  margin-bottom: 24px;
}
.svc-page-hero-btns {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.svc-page-hero-visual {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(15,19,32,0.08);
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  position: relative;
}
.svc-page-hero-img {
  width: 100%;
  height: auto;
  max-height: 440px;
  object-fit: cover;
  display: block;
}

/* Interactive Presentation Stepper Styles */
.svc-presentation-sec {
  padding: 64px 0;
  background: #090d16;
  color: #fff;
  border-top: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.svc-pres-head {
  text-align: center;
  max-width: 840px;
  margin: 0 auto 40px;
}
.svc-pres-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 999px;
  background: rgba(11,92,255,0.18);
  color: #3b82f6;
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 14px;
  border: 1px solid rgba(11,92,255,0.3);
}
.svc-pres-title {
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.22;
}
.svc-pres-sub {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
}

.svc-pres-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 48px;
  align-items: center;
}
.svc-pres-grid.landscape-grid {
  grid-template-columns: 1.15fr 0.85fr;
  gap: 44px;
}
@media (max-width: 960px) {
  .svc-pres-grid, .svc-pres-grid.landscape-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

/* Smartphone & Stend Device Mockup */
.device-frame-wrap {
  position: relative;
  max-width: 360px;
  margin: 0 auto;
}
.device-frame-wrap.device-landscape {
  max-width: 640px;
  width: 100%;
}
.device-phone {
  background: #181f2f;
  border-radius: 44px;
  padding: 12px;
  box-shadow: 0 30px 70px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.12), inset 0 0 0 2px #0c101a;
  position: relative;
}
.device-frame-wrap.device-landscape .device-phone {
  border-radius: 26px;
  padding: 12px;
  background: #141a27;
  border: 1.5px solid rgba(255,255,255,0.14);
  box-shadow: 0 30px 80px rgba(0,0,0,0.65), 0 0 40px rgba(11,92,255,0.16);
}
.device-speaker {
  width: 90px;
  height: 18px;
  background: #090d16;
  border-radius: 0 0 12px 12px;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}
.device-frame-wrap.device-landscape .device-speaker {
  display: none;
}
.device-screen-box {
  border-radius: 34px;
  overflow: hidden;
  background: #000;
  position: relative;
  aspect-ratio: 459 / 1024;
}
.device-frame-wrap.device-landscape .device-screen-box {
  border-radius: 18px;
  aspect-ratio: 1024 / 682;
  background: #090d16;
}
.pres-screen-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;
  opacity: 0;
  transition: opacity 0.35s ease, transform 0.35s ease;
  transform: scale(0.98);
}
.pres-screen-img.active {
  display: block;
  opacity: 1;
  transform: scale(1);
}

/* 3D Visual in Equipment Presentation */
.equip-3d-vis {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: linear-gradient(160deg, #e6f0ff, #c3d8f7);
  z-index: 2;
}
.equip-3d-vis canvas.gl {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}
.equip-3d-vis.has-gl > .fallback-vis {
  display: none !important;
}
.btn-toggle-vis {
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(255,255,255,0.08);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-toggle-vis:hover {
  background: rgba(255,255,255,0.14);
  color: #fff;
}
.btn-toggle-vis.active {
  background: #0b5cff;
  color: #fff;
  border-color: #0b5cff;
  box-shadow: 0 4px 14px rgba(11,92,255,0.4);
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

/* Stepper items */
.pres-stepper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pres-step-item {
  background: rgba(255,255,255,0.03);
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 22px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  display: flex;
  gap: 18px;
}
.pres-step-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(11,92,255,0.4);
}
.pres-step-item.active {
  background: rgba(11,92,255,0.14);
  border-color: #0b5cff;
  box-shadow: 0 10px 28px rgba(11,92,255,0.22);
}
.pres-step-num {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.pres-step-item.active .pres-step-num {
  background: #0b5cff;
  color: #fff;
  box-shadow: 0 4px 14px rgba(11,92,255,0.4);
}
.pres-step-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}
.pres-step-content p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}
.pres-step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.pres-tag {
  font-size: 11.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255,255,255,0.06);
  color: #cbd5e1;
}
.pres-step-item.active .pres-tag {
  background: rgba(11,92,255,0.25);
  color: #93c5fd;
}
.pres-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 14px;
}
.pres-nav-btn {
  padding: 10px 18px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  transition: all 0.2s;
}
.pres-nav-btn:hover {
  background: #0b5cff;
  border-color: #0b5cff;
}

/* Systems & Architecture Section */
.svc-system-section {
  padding: 60px 0;
  border-bottom: 1px solid var(--line);
}
.svc-system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.svc-system-item {
  background: var(--soft);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--line);
}
.svc-system-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--tint);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 12px;
}
.svc-system-item h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 6px;
}
.svc-system-item p {
  font-size: 13.5px;
  color: var(--mute);
  line-height: 1.5;
}

/* Features Grid */
.svc-capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 28px;
}
.svc-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--shadow);
  transition: transform 0.2s, border-color 0.2s;
}
.svc-card:hover {
  transform: translateY(-3px);
  border-color: var(--blue);
}
.svc-card-ico {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--tint);
  color: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.svc-card-ico svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}
.svc-card h4 {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 8px;
}
.svc-card p {
  font-size: 14px;
  color: var(--mute);
  line-height: 1.6;
}

/* Steps */
.svc-steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 28px;
}
.step-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 22px;
  position: relative;
}
.step-badge {
  font-size: 24px;
  font-weight: 800;
  color: var(--blue);
  margin-bottom: 10px;
}
.step-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 6px;
}
.step-card p {
  font-size: 13.5px;
  color: var(--mute);
  line-height: 1.55;
}

/* Application Form Section */
.svc-apply-sec {
  padding: 64px 0;
  background: linear-gradient(180deg, var(--white) 0%, var(--soft) 100%);
  border-top: 1px solid var(--line);
}
.svc-apply-card {
  background: var(--card-bg);
  border: 1.5px solid var(--card-border);
  border-radius: 24px;
  padding: 40px;
  max-width: 780px;
  margin: 0 auto;
  box-shadow: 0 20px 50px rgba(15,19,32,0.06);
}
.svc-apply-head {
  text-align: center;
  margin-bottom: 28px;
}
.svc-apply-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--tint);
  color: var(--blue);
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}
.svc-apply-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--ink);
  margin-bottom: 10px;
}
.svc-apply-desc {
  font-size: 15px;
  color: var(--mute);
  line-height: 1.6;
}
.svc-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
@media (max-width: 600px) {
  .svc-form-grid { grid-template-columns: 1fr; }
  .svc-apply-card { padding: 24px; }
}
.svc-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.svc-input-label {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
}
.svc-input-field {
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: var(--card-bg);
  color: var(--ink);
  font-size: 14.5px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.svc-input-field:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(11,92,255,0.12);
}
.svc-select-field {
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: var(--card-bg);
  color: var(--ink);
  font-size: 14.5px;
  outline: none;
  cursor: pointer;
}
.svc-textarea-field {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: var(--card-bg);
  color: var(--ink);
  font-size: 14.5px;
  outline: none;
  min-height: 90px;
  resize: vertical;
}
.svc-apply-submit {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  background: var(--blue);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(11,92,255,0.25);
  transition: all 0.2s;
  margin-top: 10px;
}
.svc-apply-submit:hover {
  background: var(--blue-d);
  transform: translateY(-1px);
}

/* Packages */
.svc-packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 28px;
}
.pkg-card {
  background: var(--card-bg);
  border: 1.5px solid var(--card-border);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow);
}
.pkg-popular {
  border-color: var(--blue);
  box-shadow: 0 16px 36px rgba(11,92,255,0.14);
}
.pop-ribbon {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--blue);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.04em;
}
.pkg-price {
  font-size: 24px;
  font-weight: 800;
  color: var(--blue);
  margin: 12px 0;
}
.pkg-desc {
  font-size: 14px;
  color: var(--mute);
  margin-bottom: 16px;
}
.pkg-feats {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pkg-feats li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--ink);
}
.pkg-feats svg {
  width: 16px;
  height: 16px;
  color: var(--ok);
  flex-shrink: 0;
}
</style>
'''

SERVICES = [
  {
    'slug': 'tg-shop',
    'filename': 'services-tg-shop.html',
    'badge': 'Telegram Savdo & Dastavka',
    'title': 'Telegram Mini App Do‘koni va Yetkazib Berish Tizimi (TGShop)',
    'headline': 'Do‘koningiz uchun to‘liq quvvatli Telegram Mini App va tezkor dastavka',
    'subtitle': 'Mijozlaringiz hech qanday ilova yuklamasdan, to‘g‘ridan-to‘g‘ri Telegram ichida tovar tanlaydi, rang/o‘lcham tanlaydi, lokatsiyasini yuborib yetkazib berish (Yandex Go) orqali Click/Payme bilan xarid qiladi. Xuddi TGShop kabi mukammal ekotizim!',
    'image': '/images/services/svc-tg-shop.png',
    'icon': '/images/services/icon-tg-shop.png',
    'bg': '#e4f3fa',
    'presentation_steps': [
      {
        'title': '1. Katalog va Mahsulotlar Vitrinasi',
        'desc': 'Telegram WebApp ochilishi bilan xaridor oldida yuqori sifatli qorong‘u (luxury dark) dizayndagi tovarlar katalogi, qulay toifalar (Outerwear, Footwear, Denim), narx filtrlari va qidiruv chiqadi. Hech qanday ilova yuklash shart emas.',
        'image': '/images/services/tgshop-steps/step1-catalog.png',
        'tags': ['Telegram WebApp', 'Katalog & Qidiruv', 'Kategoriyalar', 'In-Stock filtri']
      },
      {
        'title': '2. Rang, Narx va O‘lchov Tanlovi',
        'desc': 'Mahsulot ichiga kirilganda xaridor tovar fotosurati, tavsifi, narxi, mavjud ranglar palitrasi (Shade: Black) va o‘lchamlarni ([XS], [S], [M], [L], [XL], [2XL]) bitta tegishda tanlaydi va savatga qo‘shadi.',
        'image': '/images/services/tgshop-steps/step2-variants.png',
        'tags': ['Rang tanlash', 'O‘lcham [XS-2XL]', 'Tovar xususiyatlari', 'Qoldiqlar nazorati']
      },
      {
        'title': '3. Yetkazib Berish va To‘lov Tanlovlari',
        'desc': 'Buyurtmani rasmiylashtirishda xaridor ismi, telefoni, yetkazib berish usuli ([Courier Delivery] kuryer orqali yoki [Store Pickup] do‘kondan olib ketish), manzil va to‘lov turi ([Cash on Delivery] naqd, [Click], [Payme], [Card Transfer]) tanlanadi. Dastavka narxi avtomatik hisoblanadi.',
        'image': '/images/services/tgshop-steps/step3-checkout.png',
        'tags': ['Courier Delivery', 'Store Pickup', 'Click & Payme', 'Naqd to‘lov']
      },
      {
        'title': '4. Berilgan Zakaz Yetib Kelish Holati (Real-time Tracking)',
        'desc': 'Buyurtma berilgach, mijoz Telegramda buyurtmaning real-vaqt holatini kuzatib boradi: ❶ Placed (Qabul qilindi) → ❷ Paid / Unpaid (To‘landi) → ❸ Packed (Qadoqlandi) → ❹ Dispatched (Kuryerga berildi) → ❺ Delivered (Yetkazildi). Bitta tugma bilan buyurtmani takrorlash imkoniyati.',
        'image': '/images/services/tgshop-steps/step4-tracking.png',
        'tags': ['Real-Time Tracking', '5 ta status', 'Push-xabarnoma', 'Takroriy buyurtma']
      }
    ],
    'system_title': 'Telegram Mini App Ekotizimining Tuzilishi',
    'system_desc': 'Ushbu yechim faqat oddiy bot emas — u xaridor vitrinasi, kuryerlar ilovasi, ombor qoldiqlari va boshqaruv panelini birlashtiruvchi yaxlit platformadir.',
    'system_items': [
      ('📱 WebApp Vitrina', 'Telegram ichida 1 sekundda ochiluvchi ultra-tezkor katalog, chiroyli dizayn va savat.'),
      ('🛵 Kuryer va Dastavka Boti', 'Buyurtma tushishi bilan kuryerga xarita marshruti va mijoz telefoni avtomat yuboriladi.'),
      ('🔄 1C & Kassa Sinxronizatsiyasi', 'Do‘kondagi tovar qoldiqlari va narxlar avtomatik Telegram do‘konda yangilanadi.'),
      ('📊 CRM & Analitika Paneli', 'Mijozlar telefon raqamlari, buyurtmalar tarixi va push-reklama tarqatish imkoniyati.')
    ],
    'features': [
      ('Tovar variatsiyalari va parametrlari', 'Mijoz o‘lcham (S, M, L, XL), rang, hajm yoki to‘plamni qulay tanlaydi. Har bir parametr o‘z narxi va qoldig‘iga ega bo‘ladi.'),
      ('Geolokatsiya va Yandex Go Dastavka', 'Xaridor Telegram xaritasida lokatsiyasini belgilaydi. Tizim masofani va yetkazib berish narxini (km bo‘yicha yoki tarifda) avtomatik hisoblaydi.'),
      ('Click, Payme va Uzum to‘lovlari', 'Karta orqali bir bosishda xavfsiz to‘lov. Mablag‘ to‘g‘ridan-to‘g‘ri hisob raqamingizga tushadi va fiskal elektron chek shakllanadi.'),
      ('Buyurtma statuslari va Push-xabarlar', 'Xaridorga har bir bosqich bo‘yicha avtomatik xabar boradi: "Qabul qilindi" → "Tayyorlanmoqda" → "Kuryer yo‘lda" → "Yetkazildi".'),
      ('Kuryer va Oshxona/Ombor boti', 'Kuryer alohida bot orqali buyurtmani qabul qiladi, mijozga qo‘ng‘iroq qiladi va Yandex Navigator orqali yo‘nalish oladi.'),
      ('Promokodlar va sodiqlik tizimi', 'Aksiyalar, doimiy mijozlar uchun keshbek, chegirma kuponlari va minimal buyurtma summasini sozlash imkoniyati.')
    ],
    'steps': [
      ('01', 'Ariza va talablarni aniqlash', 'Do‘koningiz yo‘nalishi, mahsulotlar soni va yetkazib berish qoidalari o‘rganiladi.'),
      ('02', 'Dizayn va katalog yuklash', 'Telegram WebApp uchun brendingiz ranglari va logotipi bilan zamonaviy vitrina sozlanadi.'),
      ('03', 'To‘lov va dastavka ulanishi', 'Click, Payme, Yandex Go yetkazib berish integratsiyasi va kuryer boti ulanadi.'),
      ('04', 'Xodimlarni o‘qitish va start', 'Buyurtmalarni boshqarish bo‘yicha ko‘rsatma beriladi va rasmiy ishga tushiriladi.')
    ],
    'packages': [
      ('TG Mini Standart', '3 900 000 UZS', 'Kichik savdo va do‘konlar uchun ideal boshlang‘ich yechim', ['Telegram WebApp katalog', 'Interaktiv savat va qidiruv', 'Click va Payme to‘lovlari', 'Buyurtmalar Telegram guruhi', '1 oy bepul texnik ko‘mak'], False),
      ('TG Mini Dastavka Pro', '7 900 000 UZS', 'Kafelar, restoranlar va yetkazib beruvchi riteyllar uchun eng ommabop', ['To‘liq TGShop funksionalligi', 'Geolokatsiya bo‘yicha avto-dastavka', 'Yandex Go kuryer integratsiyasi', 'Alohida Kuryer boti va statuslar', '1C / Kassa qoldiqlar sinxronizatsiyasi', '3 oy bepul texnik ko‘mak'], True),
      ('TG Enterprise Tarmoq', '16 500 000 UZS', 'Ko‘p filialli tarmoqlar va yirik brendlar uchun platforma', ['Multi-filial (eng yaqin filialdan yetkazish)', 'Shaxsiy CRM va mijozlar bazasi', 'Avtomatik Push-xabarnomalar', 'iiko / Jowi / 1C to‘liq integratsiyasi', '1 yil kafolat va 24/7 ko‘mak'], False)
    ],
    'faqs': [
      ('Mijoz do‘kondan foydalanishi uchun qo‘shimcha ilova yuklashi kerakmi?', 'Yo‘q! Mijoz Telegram ilovasidan chiqmagan holda, bitta tugma bilan zamonaviy to‘liq do‘kondan foydalanadi.'),
      ('Yetkazib berish narxi qanday hisoblanadi?', 'Xaridor o‘z lokatsiyasini yuborganida, xaritadagi filialingizdan uning manzilgacha bo‘lgan masofa (km) avtomatik hisoblanadi va belgilangan tarif bo‘yicha chekka qo‘shiladi.'),
      ('Xizmatdan qanday foydalanish mumkin?', 'Quyidagi forma orqali ariza qoldiring. Mutaxassisimiz 15 daqiqada siz bilan bog‘lanib, barcha talablaringiz bo‘yicha bepul namuna (demo) ko‘rsatadi.')
    ]
  },
  {
    'slug': 'online-store',
    'filename': 'services-online-store.html',
    'badge': 'Ko‘p kanalli savdo',
    'title': 'Veb-saytlar va Ko‘p Kanalli E-Commerce Platformasi',
    'headline': 'Brendingiz uchun rasmiy veb-sayt va onlayn savdo platformasi',
    'subtitle': 'Do‘koningiz uchun zamonaviy veb-sayt, mobil versiya va markaziy boshqaruv. Payme, Click, Uzum orqali to‘lovlar, kassa apparati bilan to‘liq qoldiqlar sinxronizatsiyasi.',
    'image': '/images/services/svc-online-store.png',
    'icon': '/images/hero/hero-pos-terminal.png',
    'bg': '#eae0d2',
    'presentation_steps': [
      {
        'title': '1. Zamonaviy Veb-vitrina va Qidiruv',
        'desc': 'Katta ekranlar va smartfonlar uchun moslashuvchan internet-do‘kon vitrinasi. Qulay toifalar, jonli qidiruv va narx saralash.',
        'image': '/images/services/svc-online-store.png',
        'tags': ['SEO veb-sayt', 'Filtrlar', 'Savat']
      },
      {
        'title': '2. Tovar Kartasi, Ranglar va O‘lchamlar',
        'desc': 'Xaridor tovar rasmlari, parametrlari va sharhlari bilan tanishadi. Bitta tugma bilan savatga qo‘shadi.',
        'image': '/images/services/tgshop-steps/step2-variants.png',
        'tags': ['Parametrlar', 'Ranglar', 'Tavsif']
      },
      {
        'title': '3. Onlayn To‘lov va Kuryerlik Integratsiyasi',
        'desc': 'Payme, Click, Uzum orqali xavfsiz to‘lov va Yandex Go yetkazib berish xizmati bilan avtomatik hisob.',
        'image': '/images/services/tgshop-steps/step3-checkout.png',
        'tags': ['Payme & Click', 'Yandex Go', 'Fiskal chek']
      },
      {
        'title': '4. 1C va Kassa Bilan Ikki Tomonlama Aloqa',
        'desc': 'Saytdagi har bir xarid avtomatik ravishda do‘koningizdagi kassa tizimi bilan sinxronlashadi va qoldiq yangilanadi.',
        'image': '/images/hero/hero-analytics-dashboard.png',
        'tags': ['1C sinxronizatsiya', 'Qoldiqlar', 'Kassa integratsiyasi']
      }
    ],
    'system_title': 'Veb-sayt va Savdo Ekotizimining Ishlash Prinsipi',
    'system_desc': 'Internet-do‘koningiz oflayn kassa dasturlari va ombor bilan uzviy bog‘lanadi — sotilgan tovar avtomat qoldiqdan ayiriladi.',
    'system_items': [
      ('🛒 Tezkor Veb-do‘kon', 'SEO optimizatsiyalangan, Google va Yandex qidiruv tizimlarida yuqori o‘rinlarda chiquvchi zamonaviy sayt.'),
      ('💳 Fiskal Onlayn To‘lov', 'Payme, Click, Uzum orqali xavfsiz to‘lovlar va elektron chek yaratish.'),
      ('🔄 Kassa Sinxronizatsiyasi', 'Billz, 1C, Jowi kassa tizimi bilan ikki tomonlama integratsiya.'),
      ('📱 Mobil Moslashuv', 'Barcha smartfon va planshetlarda ilovadek qulay ishlash.')
    ],
    'features': [
      ('Katalog, qidiruv va chuqur filtrlar', 'Mijozlar o‘lcham, rang, narx va brend bo‘yicha sekund ichida kerakli mahsulotni topadi.'),
      ('Payme, Click, Uzum to‘lov integratsiyasi', 'Rasmiy fiskal chek shakllanishi va mablag‘larning to‘g‘ridan-to‘g‘ri hisob raqamga tushishi.'),
      ('Yandex Go va kuryerlik integratsiyasi', 'Xarita orqali yetkazib berish narxini avtomatik hisoblash va kuryer chaqirish.'),
      ('1C va Kassa tizimi bilan sinxronizatsiya', 'Saytdagi qoldiqlar do‘koningizdagi kassa bilan bir zumda sinxronlashadi, ortiqcha sotuv bo‘lmaydi.'),
      ('Tezkor SEO va mobil moslashuvchanlik', 'Google va Yandex qidiruv tizimlarida yuqori o‘rinlar hamda barcha telefonlarda ideal ishlash.'),
      ('Multi-til va Valyuta', 'O‘zbek, rus va ingliz tillarida so‘m hamda xorijiy kartalarni qabul qilish.')
    ],
    'steps': [
      ('01', 'Struktura va dizayn', 'Sohangizga mos brend uslubi va qulay xarid yo‘lagi (UX) ishlab chiqiladi.'),
      ('02', 'Dasturlash va to‘lovlar', 'Sayt, to‘lov tizimlari va kuryerlik servislari ulanadi.'),
      ('03', 'Ombor va 1C integratsiyasi', 'Barcha tovarlar, narxlar va qoldiqlar bazangiz bilan sinxronlashtiriladi.'),
      ('04', 'Ishga tushirish va trening', 'Sayt serverga yuklanadi, xodimlaringizga buyurtmalarni qabul qilish o‘rgatiladi.')
    ],
    'packages': [
      ('Start Do‘kon', '4 500 000 UZS', 'Tez va qulay boshlash uchun veb-sayt', ['Tezkor internet-do‘kon', 'Click va Payme to‘lovlari', 'Buyurtmalar paneli', '1 oy bepul texnik ko‘mak'], False),
      ('Veb-sayt + Kassa Integratsiya', '8 900 000 UZS', 'O‘rta va yirik savdo bizneslari uchun eng ommabop', ['Zamonaviy tezkor Veb-sayt', 'Do‘kon kassa tizimi bilan sinxronizatsiya', 'Payme, Click, Uzum integratsiyasi', 'Yandex Go yetkazib berish xaritasi', 'SEO optimizatsiya va 3 oy kafolat'], True),
      ('Enterprise E-Commerce', '18 000 000 UZS', 'Brendlar va tarmoqli riteyllar uchun premium platforma', ['Web-sayt + iOS & Android ilovalar', 'Shaxsiy mijoz kabineti va sodiqlik tizimi', 'Multi-filial omborlar boshqaruvi', 'Maxsus ERP / 1C integratsiyasi', 'To‘liq texnik ko‘mak va 1 yil kafolat'], False)
    ],
    'faqs': [
      ('Sayt qancha vaqtda tayyor bo‘ladi?', 'Standart do‘kon 7-10 ish kunida to‘liq ishga tushiriladi.'),
      ('To‘lov tizimlarini ulashda yordam berasizmi?', 'Ha, Payme Business, Click Merchant va Uzum bilan shartnoma tuzish va ulashda to‘liq yordam beramiz.'),
      ('Saytdagi tovarlar kassa bilan qanday bog‘lanadi?', '1C yoki POS kassa dasturingiz API orqali ulanadi. Kassada tovar sotilsa, saytdan avtomatik qoldiq kamayadi.')
    ]
  },
  {
    'slug': 'accounting-bots',
    'filename': 'services-accounting-bots.html',
    'badge': '1C & Moliya nazorati',
    'title': 'Buxgalteriya va Hisobot Telegram Botlari',
    'headline': 'Biznesingiz moliyaviy hisobotlari va kassa nazorati cho‘ntagingizda',
    'subtitle': '1C, ERP va kassa apparatlari bilan bog‘langan aqlli hisobot boti har kuni avtomatik tushum, sof foyda, xarajatlar va ombor qoldiqlarini Telegram orqali rahbarga yetkazadi.',
    'image': '/images/services/svc-accounting-bots.png',
    'icon': '/images/hero/hero-analytics-dashboard.png',
    'bg': '#cee5f6',
    'presentation_steps': [
      {
        'title': '1. 1C va Kassa Bazasiga Xavfsiz Ulanish',
        'desc': 'Moliya va savdo dasturlaringiz (1C, iiko, Billz) shifrlangan xavfsiz kanal orqali Telegram botga ulanadi.',
        'image': '/images/services/svc-accounting-bots.png',
        'tags': ['1C API', 'Shifrlash', 'Xavfsiz ulanish']
      },
      {
        'title': '2. Kunlik Tushum va Smena Yopilishi Xabarlari',
        'desc': 'Har kuni kassir smenani topshirganda yoki soat 20:00 da naqd, plastik va umumiy tushum hisoboti keladi.',
        'image': '/images/hero/hero-analytics-dashboard.png',
        'tags': ['Kunlik hisobot', 'Kassa farqi', 'Naqd va karta']
      },
      {
        'title': '3. Kam Qolgan Tovarlar va Defitsit Xabarnomasi',
        'desc': 'Do‘kondagi tovar qoldig‘i belgilangan me’yordan kamaysa, ta’minotchiga buyurtma berish uchun bot ogohlantiradi.',
        'image': '/images/hero/hero-pos-terminal.png',
        'tags': ['Qoldiq nazorati', 'Avto-ogohlantirish', 'Ombor']
      },
      {
        'title': '4. Sof Foyda, Rentabellik va Rahbar Tahlili',
        'desc': 'Direktor uchun barcha filiallar bo‘yicha konsolidatsiyalashgan sof foyda, rentabellik va oylik taqqoslama grafiklar.',
        'image': '/images/services/svc-accounting-bots.png',
        'tags': ['Sof foyda', 'Filiallar tahlili', 'Rahbar hisoboti']
      }
    ],
    'system_title': 'Moliya va Hisobot Tizimining Arxitekturasi',
    'system_desc': '1C bazangiz va kassangizdan ma’lumotlar shifrlangan kanal orqali olinib, daqiqama-daqiqa tahlil qilinadi.',
    'system_items': [
      ('📊 Kunlik Avto-Hisobot', 'Har kuni soat 20:00 da kunlik umumiy savdo, naqd/plastik tushum va xarajatlar tahlili.'),
      ('⚠️ Xavf va Qoldiq Xabarnomasi', 'Kassada tovar qoldig‘i kritik darajaga tushsa, menejerga darhol bildirishnoma.'),
      ('💰 Kassir Smenasi Yopilishi', 'Kassir smenani topshirganda kassa farqi (kamomad yoki ortiqcha) darhol ko‘rinadi.'),
      ('🔐 Xavfsiz Shifrlash', 'Ma’lumotlar faqat tasdiqlangan rahbar Telegram akkauntlariga yetkaziladi.')
    ],
    'features': [
      ('1C:Korxona va ERP bilan ikki tomonlama sinxronizatsiya', '1C bazasiga kirmasdan, Telegram orqali tovar narxini bilish va qoldiq tekshirish.'),
      ('Kunlik tushum va sof foyda hisoboti', 'Naqd, plastik, pul o‘tkazmasi va nasiyalar bo‘yicha alohida tahliliy hisobot.'),
      ('Kassir smenasi va tushum topshirish nazorati', 'Kassir har bir smenani yopganda, xatoliklar va farqlar darhol qayd etiladi.'),
      ('Kam qolgan tovarlar bo‘yicha avtomatik ogohlantirish', 'Xaridorgir tovarlar tugab qolishidan oldin ta’minotchiga buyurtma berish haqida eslatma.'),
      ('Qarzdorlik va nasiyalar monitoringi', 'Mijozlar va ta’minotchilar oldidagi muddati o‘tgan qarzlarni avtomatik ko‘rsatish.'),
      ('Xodimlar samaradorligi (KPI)', 'Har bir sotuvchi yoki kassirning kunlik sotuv hajmini monitoring qilish.')
    ],
    'steps': [
      ('01', 'Moliya tizimini tahlil qilish', 'Qaysi dastur (1C, iiko, Billz) ishlatilayotgani va kerakli hisobotlar formati o‘rganiladi.'),
      ('02', 'API va bot integratsiyasi', 'Serveringiz bilan xavfsiz shifrlangan ma’lumot uzatish yo‘lagi quriladi.'),
      ('03', 'Ruxsatlar va xavfsizlik', 'Faqat rahbar va vakolatli shaxslarga kirish huquqi sozlanadi.'),
      ('04', 'Sinov va ishga tushirish', 'Haqiqiy savdo ma’lumotlari tekshirilib, bot to‘liq ishga topshiriladi.')
    ],
    'packages': [
      ('Boshlang‘ich Kassa Boti', '1 900 000 UZS', 'Bitta do‘kon yoki savdo nuqtasi uchun hisobot boti', ['Kunlik tushum hisoboti', 'Kassir smenasi xabari', 'Kam qolgan tovarlar ro‘yxati', '1 ta 1C bazaga ulanish'], False),
      ('Moliya Pro Boti', '4 500 000 UZS', 'Filialli va dinamik bizneslar uchun to‘liq analitika', ['1C bilan to‘liq ikki tomonlama aloqa', 'Sof foyda va rentabellik hisobi', 'Xarajatlar modullari (Kassa chiqimi)', 'Qarzdorlik va nasiyalar nazorati', 'Multi-filial hisobotlari'], True),
      ('Korporativ ERP Boti', '9 800 000 UZS', 'Tarmoqli korxonalar va distribyutsiyalar uchun', ['Cheksiz filiallar integratsiyasi', 'Maxsus KPI algoritmlari', 'Bosh buxgalter va direktor darajadagi alohida panellar', '24/7 shaxsiy muhandis ko‘magi'], False)
    ],
    'faqs': [
      ('1C versiyamiz eski bo‘lsa ham ulasa bo‘ladimi?', 'Ha, 1C 8.2, 8.3, 7.7 hamda istalgan SQL/Postgres bazalarga xavfsiz ulay olamiz.'),
      ('Ma’lumotlar xavfsizligi kafolatlanadimi?', 'Ha, ma’lumotlar shifrlangan holda faqat sizning Telegram ID raqamingizga yuboriladi, uchinchi shaxslarga chiqmaydi.'),
      ('Hisobot shaklini o‘zimizga moslashtira olamizmi?', 'Albatta! Sizga qaysi ko‘rsatkichlar muhim bo‘lsa (masalan, faqat sof tushum yoki har soatlik grafik), aynan shu ko‘rinishda sozlab beramiz.')
    ]
  },
  {
    'slug': 'attendance',
    'filename': 'services-attendance.html',
    'badge': 'Biometrik nazorat',
    'title': 'Face ID Davomat va Xodimlar Ish Vaqti Nazorati',
    'headline': 'Face ID biometriya orqali xodimlar intizomi va aniq daqiqabay davomat',
    'subtitle': '0.2 soniyada yuzni aniqlaydigan biometrik terminallar, turniketlar va Telegram xabarnomalar tizimi. Kechikishlar va sababsiz qoldirilgan vaqtlarni aniq hisoblab, oylik maosh tizimiga avtomat uzatish.',
    'image': '/images/services/svc-attendance.png',
    'icon': '/images/hero/hero-face-attendance.png',
    'bg': '#d8e5f8',
    'presentation_steps': [
      {
        'title': '1. 0.2s Face ID Biometrik Aniqlash',
        'desc': 'Xodim eshik yoki turniket oldiga kelganda 0.2 soniyada yuzidan aniqlanadi va ruxsat beriladi.',
        'image': '/images/services/svc-attendance.png',
        'tags': ['0.2s Face ID', '99.9% aniqlik', 'Anti-spoofing']
      },
      {
        'title': '2. Kechikishlar va Ish Vaqti Daqiqabay Tahlili',
        'desc': 'Har bir xodimning kelgan va ketgan daqiqasi avtomatik qayd etiladi, sababsiz kechikishlar hisoblanadi.',
        'image': '/images/hero/hero-face-attendance.png',
        'tags': ['Daqiqabay hisob', 'Kechikishlar', 'Smena nazorati']
      },
      {
        'title': '3. Telegram Orqali Rahbarga Avto-Xabarnoma',
        'desc': 'Xodim ishga kelishi bilan rahbarning Telegramiga rasm va vaqt ko‘rsatilgan bildirishnoma yetib boradi.',
        'image': '/images/services/svc-attendance.png',
        'tags': ['Telegram bot', 'Xodim kelishi', 'Jonli bildirish']
      },
      {
        'title': '4. 1C ZUP va T-13 Maosh Tabeliga Eksport',
        'desc': 'Oy oxirida bir bosishda buxgalteriya uchun tayyor T-13 jadvali shakllanadi va maosh hisoblashga uzatiladi.',
        'image': '/images/hero/hero-analytics-dashboard.png',
        'tags': ['T-13 jadval', '1C ZUP', 'Oylik maosh']
      }
    ],
    'system_title': 'Biometrik Nazorat Tizimining Imkoniyatlari',
    'system_desc': 'ZKTeco va Hikvision apparatlari yordamida har bir xodimning kirish-chiqishi daqiqasigacha qayd etiladi.',
    'system_items': [
      ('⚡ 0.2s Face ID Aniqlash', 'Niqobda yoki yorug‘lik yetarli bo‘lmaganda ham 99.9% aniqlikda xodimni taniydi.'),
      ('🚫 Rasmdan Himoya (Anti-Spoofing)', 'Telefon yoki qog‘ozdagi rasm orqali aldashning oldini oluvchi 3D infraqizil skaner.'),
      ('📲 Telegram Xabarnoma', 'Xodim kelganida va ketganida rahbar va xodimning o‘ziga bir zumda xabar boradi.'),
      ('📑 T-13 Oylik Jadval', 'Oylik maosh hisoblash uchun 1C ZUP tizimiga tayyor T-13 jadvalini eksport qilish.')
    ],
    'features': [
      ('0.2 soniyada yuzni aniqlash', 'Niqobda va turli yorug‘likda ham 99.9% aniqlik bilan xodimni taniydi.'),
      ('Surat bilan aldashning oldini olish', '3D infraqizil datchiklar telefon yoki qog‘ozdagi rasm orqali belgilanishga yo‘l qo‘ymaydi.'),
      ('Telegramga darhol xabarnoma', 'Xodim ishga kelishi yoki ketishi bilan rahbarga yoki o‘ziga Telegram orqali xabar boradi.'),
      ('Kechikishlar va jarimalar hisobi', 'Har bir daqiqa hisobga olinadi, oylik maosh tizimi uchun tayyor hisobot shakllanadi.'),
      ('Turniket va eshik qulflari (Smart Lock)', 'Faqat ruxsat berilgan xodimlar uchun eshik avtomatik ochiladi.'),
      ('Masofaviy filiallar markazlashuvi', 'Barcha viloyatdagi filiallar yagona boshqaruv paneliga ulanadi.')
    ],
    'steps': [
      ('01', 'Obyektni o‘rganish', 'Kirish eshigi, turniket va xodimlar soni bo‘yicha texnik loyiha tuziladi.'),
      ('02', 'Uskunalar montaji', 'Face ID terminal, qulf va tarmoq kabellari sifatli o‘rnatiladi.'),
      ('03', 'Xodimlar yuzini ro‘yxatga olish', 'Barcha xodimlar bazaga kiritiladi va ish grafiki sozlanadi.'),
      ('04', '1C va bot integratsiyasi', 'Buxgalteriya va Telegram guruhi bilan sinxronizatsiya qilinadi.')
    ],
    'packages': [
      ('Bitta Eshik Nazorati', '2 800 000 UZS', 'Kichik ofis yoki do‘kon uchun qulay boshlang‘ich yechim', ['Face ID biometrik terminal', 'Smart qulf va montaj', 'Davomat dasturi o‘rnatish', 'Xodimlar bazasini kiritish'], False),
      ('Turniket + Face ID', '8 900 000 UZS', 'Katta ofislar, o‘quv markazlari va korxonalar uchun', ['ZKTeco / Hikvision turniket', '2 ta Face ID terminal (kirish/chiqish)', 'Telegram xabarnomalar boti', '1C oylik maosh hisobi integratsiyasi', '1 yil rasmiy kafolat'], True),
      ('Tarmoqli Korporativ Tizim', '19 500 000 UZS', 'Ko‘p filialli tarmoqlar va fabrikalar uchun', ['Markazlashgan server dasturi', 'Barcha filiallar yagona bazada', 'HR boshqaruv paneli', '24/7 texnik ko‘mak'], False)
    ],
    'faqs': [
      ('Elektr o‘chsa eshik yopiq qoladimi?', 'Barcha tizimlarimiz zaxira akkumulyator (UPS) bilan jihozlanadi va elektr o‘chganda ham 4-6 soat uzluksiz ishlaydi.'),
      ('Xodimlar bitta terminaldan boshqa filialda ham o‘ta oladimi?', 'Ha, tarmoqli tizimda xodim barcha filiallarda o‘z yuzi bilan tanib olinadi.'),
      ('Oylik hisob-kitob qanday osonlashadi?', 'Oy oxirida bir tugma bilan T-13 shaklidagi hisobot yuklab olinadi va 1C ZUP tizimiga eksport qilinadi.')
    ]
  },
  {
    'slug': 'ai-cameras',
    'filename': 'services-ai-cameras.html',
    'badge': 'Smart monitoring',
    'title': 'AI Videokuzatuv va Mijozlar Oqimi Xaritasi (Heatmap)',
    'headline': 'Sun’iy intellektli videokuzatuv, gavjumlik xaritasi va chek nazorati',
    'subtitle': 'Sun’iy intellekt asosidagi aqlli kameralar savdo nuqtasidagi mijozlar oqimini hisoblaydi, rastalar oldidagi qiziqish xaritasini (Heatmap) tuzadi va kassadagi shubhali amallarni aniqlaydi.',
    'image': '/images/services/svc-ai-cameras.png',
    'icon': '/images/hero/hero-ai-camera-heatmap.png',
    'bg': '#bdcadc',
    'presentation_steps': [
      {
        'title': '1. Odam Sanash va Mijozlar Oqimi (People Counter)',
        'desc': 'Do‘konga kun davomida necha kishi kirdi va ularning qanchasi xarid qildi — konversiya aniq hisoblanadi.',
        'image': '/images/services/svc-ai-cameras.png',
        'tags': ['People Counter', 'Konversiya', 'Kirish-chiqish']
      },
      {
        'title': '2. Gavjum Zonalar Issiqlik Xaritasi (Heatmap)',
        'desc': 'Xaridorlar do‘konning qaysi rastalari oldida ko‘proq to‘xtayotganini qizil/sariq issiqlik xaritasi ko‘rsatadi.',
        'image': '/images/hero/hero-ai-camera-heatmap.png',
        'tags': ['Heatmap', 'Rastalar tahlili', 'Mijoz qiziqishi']
      },
      {
        'title': '3. Kassa Cheki Bilan Sinxron Video Nazorat',
        'desc': 'Kassir tovar urganida chek matni kamera videosi ustiga chiqadi — qaytarilmagan cheklar va firibgarliklar fosh bo‘ladi.',
        'image': '/images/hero/hero-pos-terminal.png',
        'tags': ['Kassa sinxroni', 'Chek nazorati', 'Qalloblik fosh']
      },
      {
        'title': '4. Navbat Monitoringi va Xavfsizlik Signallari',
        'desc': 'Kassada 4 tadan ortiq odam navbatda tursa, administratsiyaga zudlik bilan xabarnoma boradi.',
        'image': '/images/services/svc-ai-cameras.png',
        'tags': ['Navbat nazorati', 'Smart signal', '24/7 arxiv']
      }
    ],
    'system_title': 'Sun’iy Intellektli Monitoring Tizimi',
    'system_desc': 'Oddiy kameralardan farqli o‘laroq, AI kameralar xatti-harakatlarni tahlil qiladi va savdoni oshirishga yordam beradi.',
    'system_items': [
      ('👥 Odam Sanash (People Counter)', 'Kun davomida do‘konga kirgan mijozlar soni va xarid qilganlar ulushi (konversiya).'),
      ('🔥 Issiqlik Xaritasi (Heatmap)', 'Xaridorlar eng ko‘p qaysi tovarlar va rastalar oldida to‘xtayotganini ko‘rsatadi.'),
      ('🧾 Kassa Cheki bilan Sinxron Video', 'Kassir har bir tovar urganida, chek ekranga video bilan birga chiqadi — qallobliklar fosh bo‘ladi.'),
      ('🚨 Navbat Nazorati', 'Kassa oldida 4 tadan ortiq odam to‘plansa, menejerga darhol xabarnoma boradi.')
    ],
    'features': [
      ('Mijozlar oqimi hisoblagichi (People Counter)', 'Do‘konga kun davomida qancha odam kirdi va ularning necha foizi xarid qildi (konversiya).'),
      ('Gavjum zonalar xaritasi (Heatmap)', 'Xaridorlar eng ko‘p qaysi rastalar oldida to‘xtayotganini issiqlik xaritasi orqali ko‘rsatadi.'),
      ('Kassadagi xavfsizlik va chek nazorati', 'Kassa apparatidagi chek ekranga video bilan sinxron chiqadi, qaytarmasdan berish va qallobliklar ushlanadi.'),
      ('Navbatlar uzunligini nazorat qilish', 'Kassada 4 tadan ortiq odam to‘plansa, menejerga darhol xabarnoma boradi.'),
      ('Avtomobil raqamlarini aniqlash (LPR)', 'Avtoturargoh shlagbaumini avtomatik ochish va mijozlar tashrif tarixini yuritish.'),
      ('Tungi rangli tasvir (ColorVu)', 'To‘liq qorong‘ulikda ham tiniq rangli video yozib olish.')
    ],
    'steps': [
      ('01', 'Bino va maydon tahlili', 'Ko‘r zonalar (dead zones) yo‘q qilinadigan aniq kamera o‘rnatish rejasi chiziladi.'),
      ('02', 'Kabel tortish va montaj', 'Sifatli mis tarmoq kabellari va IP kameralar estetik o‘rnatiladi.'),
      ('03', 'AI algoritmlarni sozlash', 'Odam sanash, yuz tanish va kassa integratsiyasi ulanadi.'),
      ('04', 'Telefon va kompyuterga ulash', 'Dunyoning istalgan nuqtasidan jonli ko‘rish va arxivni tekshirish sozlanadi.')
    ],
    'packages': [
      ('Do‘kon Kassa Monitoringi', '4 200 000 UZS', '4 ta IP kamera + Kassa usti mikrofoni bilan', ['4 dona 4MP IP kamera', 'Kassa zonasi audio yozuv', '1 oylik video arxiv', 'Mobil ilova orqali ko‘rish'], False),
      ('AI Smart Riteyl To‘plami', '9 800 000 UZS', 'Mijozlar oqimi va tahlil tizimi bilan', ['8 dona AI IP kamera', 'People Counter odam hisoblagich', 'Gavjum zonalar xaritasi (Heatmap)', 'Kassa cheklari bilan sinxron arxiv', '1 yil kafolat va servis'], True),
      ('Supermarket & Ombor Majmuasi', '22 000 000 UZS', '16+ kamerali yirik obyektlar uchun', ['16 dona 4K UltraHD kameralar', 'Yuz tanish va avtomobil raqami (LPR)', 'Smart signalizatsiya va dinamik', '2 oylik xavfsiz arxiv'], False)
    ],
    'faqs': [
      ('Kameradagi yozuvlarni telefondan ko‘rsa bo‘ladimi?', 'Ha, iOS va Android uchun rasmiy ilova orqali dunyoning istalgan nuqtasidan jonli va arxiv yozuvlarini ko‘rishingiz mumkin.'),
      ('Kassadagi firibgarliklarni kamera qanday aniqlaydi?', 'Kamera kassa dasturi bilan bog‘lanadi. Kassir tovar urmasdan pul olsa yoki chekni bekor qilsa, o‘sha soniya qizil ramka bilan belgilanadi.'),
      ('Internet o‘chib qolsa kameralar yozishdan to‘xtab qoladimi?', 'Yo‘q, kameralar lokal xotira (NVR yoki SD karta)ga yozishni to‘xtatmasdan davom ettiradi.')
    ]
  },
  {
    'slug': 'equipment-setup',
    'filename': 'services-equipment-setup.html',
    'badge': 'Kassa va jihozlar',
    'is_landscape': True,
    'title': 'Kassa Uskunalarini O‘rnatish, Montaj va Servis',
    'headline': 'Professional kassa apparatlari montaji va kafolatli texnik servis',
    'subtitle': 'Monobloklar, chek va barkod printerlari, 2D skanerlar, kassa qutilari va elektron tarozilarni Toshkent omboridan to‘g‘ridan-to‘g‘ri yetkazib beramiz, 1 kunda o‘rnatamiz va dasturlar bilan moslaymiz.',
    'image': '/images/services/svc-equipment-setup.png',
    'icon': '/images/services/icon-equipment-setup.png',
    'bg': '#e8f0fe',
    'presentation_steps': [
      {
        'title': '1. To‘liq Kassa Majmuasi (Turnkey POS Stend)',
        'desc': 'DashboardSale tomonidan yetkazib beriladigan to‘liq kassa ish stendi: Sensorli POS Monoblok, 2D shtrix-kod skaneri, 80mm tezkor chek printeri, metall pul qutisi, montaj asboblari va sinovdan o‘tgan sertifikatlangan komplektatsiya.',
        'image': '/images/services/equipment-steps/step1-full-counter.png',
        'tags': ['To‘liq komplektatsiya', 'Kassa stendi', 'Sensorli monoblok', '1 kunda montaj']
      },
      {
        'title': '2. Sensorli POS Monoblok va Metall Kassa Qutisi',
        'desc': '15.6 dyuymli IPS Full HD sensorli ekran, yuqori tezlikdagi protsessor va Billz / Jowi / 1C savdo dasturlari. Kassa qutisi metall korpusli bo‘lib, chek chop etilishi bilan avtomatik ochiladi.',
        'image': '/images/services/equipment-steps/step2-monoblok-drawer.png',
        'tags': ['15.6" IPS FHD', 'Multi-touch', 'Avtomat pul qutisi', '1C / Billz integratsiya']
      },
      {
        'title': '3. 2D Shtrix-Kod Skaneri va Lazerli O‘qish',
        'desc': 'Lazerli 1D / 2D / QR kod skaneri tovar qutisidagi shtrix-kod va Markirovka (Asl Belgisi) kodlarini 0.1 sekundda xatosiz taniydi. Mutaxassisimiz tomonidan optik burchagi va tezligi sinovdan o‘tkaziladi.',
        'image': '/images/services/equipment-steps/step3-scanner-laser.png',
        'tags': ['2D Lazer skaner', '0.1s tezkor o‘qish', 'Markirovka (Asl Belgisi)', 'QR-kod']
      },
      {
        'title': '4. 80mm Chek Printeri, Sinov va Rasmiy 1 Yil Kafolat',
        'desc': 'Avtomatik pichoqli tezkor 80mm termoprinter cheklarni bir zumda chiqaradi. Barcha apparatlar "POS - sinovdan o‘tgan / Yaroqli" tekshiruvidan o‘tadi va rasmiy 1 yillik kafolat taloni bilan topshiriladi.',
        'image': '/images/services/equipment-steps/step4-printer-tested.png',
        'tags': ['80mm avto-pichoq', 'Sinovdan o‘tgan (QC pass)', '1 yil rasmiy kafolat', 'Doimiy servis']
      }
    ],
    'system_title': 'Kassa Texnikasi va Montaj Standartlari',
    'system_desc': 'Biz faqat apparat sotmaymiz, balki to‘liq ishga tushirib, xodimlaringizni o‘qitib, rasmiy 1 yil kafolat beramiz.',
    'system_items': [
      ('🚀 1 Kunda O‘rnatish', 'Toshkent shahri va viloyatlarga uskunalar o‘z vaqtida yetkaziladi va mutaxassis o‘rnatadi.'),
      ('💻 100% Dasturiy Moslik', 'Billz, Jowi, R-Keeper, iiko, 1C:Kassa, EasyTrade va barcha tizimlar bilan integratsiya.'),
      ('🛡 Rasmiy 1 Yil Kafolat', 'Zavod kafolati, nosozlik yuz berganda tezkor zaxira apparat bilan almashtirib berish.'),
      ('🎓 Kassir va Xodimlar Treningi', 'Chek chiqarish, lenta almashtirish va xatoliklarni bartaraf etish bo‘yicha to‘liq o‘qitish.')
    ],
    'features': [
      ('1 kunda yetkazish va sozlash', 'Toshkent shahri va viloyatlarga uskunalar o‘z vaqtida yetkaziladi va mutaxassis tomonidan o‘rnatiladi.'),
      ('Barcha kassa dasturlariga to‘liq mos', 'Billz, Jowi, R-Keeper, iiko, 1C:Kassa, EasyTrade va boshqa tizimlar bilan 100% integratsiya.'),
      ('Rasmiy 1 yil kafolat va servis', 'Zavod kafolati, bepul diagnostika va nosozlik yuz berganda tezkor zaxira apparat bilan almashtirish.'),
      ('Fiskal modul va soliq integratsiyasi', 'Online-NKM va soliq talablariga mos chek chiqarish mexanizmlarini to‘g‘ri sozlash.'),
      ('Kassir va xodimlarni o‘qitish', 'Uskunalardan to‘g‘ri foydalanish, lenta almashtirish va xatoliklarni bartaraf qilish bo‘yicha trening.'),
      ('Zaxira ehtiyot qismlar va lentalar', 'Doimiy sarf materiallari: 80mm/58mm termolenta, termo-etiketkalar va kabellar omborda mavjud.')
    ],
    'steps': [
      ('01', 'Uskunalar tanlash', 'Savdo yo‘nalishingiz (kiyim, oziq-ovqat, kafe)ga mos texnika to‘plami tanlanadi.'),
      ('02', 'Yetkazib berish', 'Barcha buyurtma qilingan jihozlar ombordan yetkaziladi.'),
      ('03', 'O‘rnatish va dasturlarga ulash', 'Monoblok, printer, skaner va tarozilar yagona tizimga ulanadi.'),
      ('04', 'Kafolat berish va xodimlarni o‘qitish', 'Rasmiy kafolat taloni rasmiylashtiriladi va kassirlar o‘qitiladi.')
    ],
    'packages': [
      ('Start Kassa Komplekti', '4 800 000 UZS', 'Kichik butik va kiyim do‘konlari uchun', ['Sensorli POS Monoblok (15.6" IPS)', 'Tezkor 2D shtrix-kod skaneri', '58mm Chek printeri', '1 kunda montaj va sozlash', '1 yil kafolat'], False),
      ('Standart Supermarket Komplekti', '7 900 000 UZS', 'Oziq-ovqat va gavjum chakana savdo uchun eng ommabop', ['Kuchaytirilgan POS Monoblok (i5, 8GB)', 'Statsionar ko‘p nurli 2D skaner', '80mm avto-pichoqli chek printer', 'Metall pul qutisi (avtomat ochiladi)', 'Joyida o‘rnatish va 1C integratsiya', '1 yil to‘liq kafolat'], True),
      ('Premium Gipermarket & Tarozili', '14 500 000 UZS', 'Yirik savdo markazlari va tarmoqli riteyl', ['2 ekranli sensorli POS monoblok (mijoz ekrani bilan)', 'Datalogic / Zebra statsionar skaner', '80mm chek + Barkod printeri', 'Barkod chiqaruvchi elektron tarozi', 'Zaxira apparat bilan almashtirish kafolati'], False)
    ],
    'faqs': [
      ('Uskunalarga qancha muddat kafolat beriladi?', 'Barcha yangi uskunalarimizga rasmiy 1 yil to‘liq kafolat beriladi.'),
      ('Viloyatlarga ham yetkazib o‘rnatib berasizmi?', 'Ha, butun O‘zbekiston bo‘ylab yetkazamiz va mutaxassisimiz masofadan yoki joyiga borib o‘rnatadi.'),
      ('Alohida jihozlar do‘koni bormi?', 'Ha! Bizning alohida Jihozlar do‘konimizda (market.html) 120 dan ortiq barcha modellar narxlari va parametrlari bilan mavjud.')
    ]
  }
]

# Generate each service page
for s in SERVICES:
    # Build System Items HTML
    system_items_html = ''
    for title, desc in s.get('system_items', []):
        system_items_html += f'''
        <div class="svc-system-item">
          <div class="svc-system-icon">⚡</div>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>'''

    # Build Capabilities HTML
    feats_html = ''
    for title, desc in s['features']:
        feats_html += f'''
        <div class="svc-card">
          <div class="svc-card-ico"><svg viewBox="0 0 24 24"><use href="#i-check"/></svg></div>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>'''

    # Build Steps HTML
    steps_html = ''
    for num, title, desc in s['steps']:
        steps_html += f'''
        <div class="step-card">
          <div class="step-badge">{num}</div>
          <h4>{title}</h4>
          <p>{desc}</p>
        </div>'''

    # Build Packages HTML
    pkgs_html = ''
    for name, price, desc, feats, popular in s['packages']:
        pop_class = ' pkg-popular' if popular else ''
        ribbon = '<div class="pop-ribbon">Eng ommabop</div>' if popular else ''
        f_list = ''.join(f'<li><svg class="ico"><use href="#i-check"/></svg>{f}</li>' for f in feats)
        pkgs_html += f'''
        <div class="pkg-card{pop_class}">
          {ribbon}
          <h3>{name}</h3>
          <p class="pkg-desc">{desc}</p>
          <div class="pkg-price">{price}</div>
          <ul class="pkg-feats">
            {f_list}
          </ul>
          <a class="btn btn-p rip" style="margin-top:auto;width:100%;text-align:center;display:block;" href="#apply-section" onclick="prefillServiceApply('{s['title']}', '{name}')">
            Ushbu tarifga ariza qoldirish
          </a>
        </div>'''

    # Build FAQs HTML
    faqs_html = ''
    for q, a in s['faqs']:
        faqs_html += f'''
        <details class="faq-item">
          <summary><span>{q}</span><span class="plus">＋</span></summary>
          <p>{a}</p>
        </details>'''

    # Build Presentation Section HTML
    pres_steps = s.get('presentation_steps', [])
    pres_imgs_html = ''
    pres_steps_html = ''

    for idx, step in enumerate(pres_steps):
        s_num = idx + 1
        active_cls = ' active' if s_num == 1 else ''
        pres_imgs_html += f'''
                <img id="presImg{s_num}" src="{step['image']}" alt="{s_num}-bosqich: {step['title']}" class="pres-screen-img{active_cls}"/>'''
        
        tags_html = ''.join(f'<span class="pres-tag">{t}</span>' for t in step.get('tags', []))
        pres_steps_html += f'''
            <div class="pres-step-item{active_cls}" data-step="{s_num}" onclick="switchPresStep({s_num})">
              <div class="pres-step-num">{s_num}</div>
              <div class="pres-step-content">
                <h4>{step['title']}</h4>
                <p>{step['desc']}</p>
                <div class="pres-step-tags">
                  {tags_html}
                </div>
              </div>
            </div>'''

    grid_cls = ' landscape-grid' if s.get('is_landscape') else ''
    wrap_cls = ' device-landscape' if s.get('is_landscape') else ''

    vis_3d_box = ''
    vis_toggle_btns = ''
    if s.get('slug') == 'equipment-setup':
        vis_3d_box = '''
                <div class="equip-3d-vis" id="equip3dVis">
                  <div style="position:absolute;top:14px;left:14px;z-index:10;display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:rgba(11,92,255,0.88);color:#fff;font-size:12px;font-weight:800;backdrop-filter:blur(8px);box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                    <span>🎮 Jonli 3D Kassa Stendi</span>
                  </div>
                  <img class="fallback-vis" src="/images/services/equipment-steps/step1-full-counter.png" style="width:100%;height:100%;object-fit:cover;" alt="Kassa jihozlari montaji 3D"/>
                </div>'''
        vis_toggle_btns = '''
            <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:16px;">
              <button id="btn3d" class="btn-toggle-vis active" onclick="setVisMode('3d')">🎮 Jonli 3D Montaj</button>
              <button id="btnPhotos" class="btn-toggle-vis" onclick="setVisMode('photos')">📸 Bosqichma-bosqich fotolar</button>
            </div>'''

    presentation_section_html = f'''
    <!-- ==================== INTERACTIVE PRESENTATION ==================== -->
    <section id="presentation" class="svc-presentation-sec">
      <div class="wrap">
        <div class="svc-pres-head">
          <span class="svc-pres-badge">✨ Professional Taqdimot</span>
          <h2 class="svc-pres-title">{s['title']} — Qanday Ishlaydi?</h2>
          <p class="svc-pres-sub">Quyidagi {len(pres_steps)} ta bosqichni bosing va tizimning to‘liq ishlash ketma-ketligi hamda xaridor tajribasi bilan jonli tanishing:</p>
        </div>

        <div class="svc-pres-grid{grid_cls}">
          <!-- Left: Phone / Stend Device Frame -->
          <div class="device-frame-wrap{wrap_cls}">
            <div class="device-phone">
              <div class="device-speaker"></div>
              <div class="device-screen-box">
                {vis_3d_box}
                {pres_imgs_html}
              </div>
            </div>
            {vis_toggle_btns}
            <div style="text-align:center;margin-top:14px;font-size:13px;color:#94a3b8;font-weight:600;">
              <span id="presStepCounter">1-bosqich / {len(pres_steps)} ta bosqich</span>
            </div>
          </div>

          <!-- Right: Interactive Stepper -->
          <div class="pres-stepper">
            {pres_steps_html}

            <div class="pres-controls">
              <button class="pres-nav-btn" onclick="prevPresStep({len(pres_steps)})">← Oldingi qadam</button>
              <a href="#apply-section" class="btn btn-sm btn-p" style="padding:10px 20px;">Xizmatga ariza qoldirish</a>
              <button class="pres-nav-btn" onclick="nextPresStep({len(pres_steps)})">Keyingi qadam →</button>
            </div>
          </div>
        </div>
      </div>
    </section>'''

    extra_3d_script = ''
    if s.get('slug') == 'equipment-setup':
        extra_3d_script = '''
  <script src="/js/dashboardsale-3d.js"></script>
  <script>
  function setVisMode(mode) {
    const box3d = document.getElementById('equip3dVis');
    const btn3d = document.getElementById('btn3d');
    const btnPhotos = document.getElementById('btnPhotos');
    if (mode === '3d') {
      if (box3d) box3d.style.display = 'block';
      if (btn3d) btn3d.classList.add('active');
      if (btnPhotos) btnPhotos.classList.remove('active');
    } else {
      if (box3d) box3d.style.display = 'none';
      if (btn3d) btn3d.classList.remove('active');
      if (btnPhotos) btnPhotos.classList.add('active');
    }
  }
  </script>'''

    page_content = f'''<!DOCTYPE html>
<html lang="uz">
{common_head}
{service_css}
<body>
  {common_svgs}
  {common_topbar}

  <!-- ==================== SERVICE PAGE NAV ==================== -->
  <header class="nav">
    <div class="wrap">
      <a href="dashboardsale.html" class="logo" aria-label="DashboardSale — bosh sahifa">
        <span class="logo-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><rect x="3" y="13" width="4.500" height="8" rx="1.500"/><rect x="9.750" y="8" width="4.500" height="13" rx="1.500"/><rect x="16.500" y="3" width="4.500" height="18" rx="1.500"/></svg>
        </span>
        <span class="logo-txt">Dashboard<span>Sale</span></span>
      </a>

      <nav class="nav-links">
        <a href="dashboardsale.html" style="font-weight:800;color:var(--blue);">← Bosh sahifa</a>
        <a href="dashboardsale.html#services">Barcha xizmatlar</a>
        <a href="#presentation" style="font-weight:700;color:var(--blue);">Taqdimot</a>
        <a href="market.html">Jihozlar</a>
        <a href="#apply-section" style="font-weight:700;color:var(--blue);">Ariza qoldirish</a>
        <a href="dashboardsale.html#contact">Bog‘lanish</a>
      </nav>

      <div class="nav-cta" style="display:flex;align-items:center;gap:12px;">
        <button class="motion-toggle-btn" onclick="toggle3DMotion()" id="motionToggleBtn" title="3D Animatsiyani yoqish / Harakatsiz">
          <span class="motion-icon">⏸️</span>
          <span class="motion-text">Harakatsiz</span>
        </button>
        <button class="theme-toggle-btn" onclick="toggleTheme()" title="Qora / Oq fon">
          <span class="theme-icon">🌙</span>
          <span class="theme-text">Tungi</span>
        </button>
        <a class="btn btn-sm btn-p rip" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
          <svg class="ico"><use href="#i-send"/></svg>
          <span>Telegram</span>
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- ==================== HERO ==================== -->
    <section class="sec svc-page-hero">
      <div class="wrap">
        <div class="svc-page-hero-grid">
          <div class="svc-page-hero-info">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
              <div class="svc-icon-tile" style="width:58px;height:58px;padding:6px;margin-bottom:0;border-radius:18px;background:var(--card-bg);border:1px solid var(--card-border);box-shadow:0 6px 18px rgba(11,92,255,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <img src="{s['icon']}" alt="{s['title']}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;display:block;"/>
              </div>
              <span class="badge" style="margin-bottom:0;">{s['badge']}</span>
            </div>
            <h1 class="svc-page-hero-title">
              {s['headline']}
            </h1>
            <p class="svc-page-hero-sub">
              {s['subtitle']}
            </p>
            <div class="svc-page-hero-btns">
              <a class="btn btn-p btn-lg rip" href="#presentation">
                <svg class="ico"><use href="#i-arrow"/></svg>
                <span>Jonli taqdimotni ko‘rish</span>
              </a>
              <a class="btn btn-s btn-lg" href="#apply-section">
                <span>Ariza qoldirish</span>
              </a>
            </div>
          </div>
          <div class="svc-page-hero-visual" style="background:{s['bg']};">
            <img src="{s['image']}" alt="{s['title']}" class="svc-page-hero-img" loading="eager"/>
          </div>
        </div>
      </div>
    </section>

    {presentation_section_html}

    <!-- ==================== SYSTEM ARCHITECTURE ==================== -->
    <section class="sec svc-system-section">
      <div class="wrap">
        <div class="sec-head">
          <h2>{s['system_title']}</h2>
          <p>{s['system_desc']}</p>
        </div>
        <div class="svc-system-grid">
          {system_items_html}
        </div>
      </div>
    </section>

    <!-- ==================== FEATURES ==================== -->
    <section class="sec">
      <div class="wrap">
        <div class="sec-head">
          <h2>Xizmat imkoniyatlari va asosiy funksiyalari</h2>
          <p>Biznesingiz samaradorligini oshiruvchi texnologik qulayliklar</p>
        </div>
        <div class="svc-capabilities-grid">
          {feats_html}
        </div>
      </div>
    </section>

    <!-- ==================== PROCESS ==================== -->
    <section class="sec" style="background:var(--soft);">
      <div class="wrap">
        <div class="sec-head">
          <h2>Qanday ishga tushiramiz?</h2>
          <p>4 qadamda to‘liq tayyor holatga keltirish rejasi</p>
        </div>
        <div class="svc-steps-grid">
          {steps_html}
        </div>
      </div>
    </section>

    <!-- ==================== APPLICATION FORM ==================== -->
    <section id="apply-section" class="sec svc-apply-sec">
      <div class="wrap">
        <div class="svc-apply-card">
          <div class="svc-apply-head">
            <span class="svc-apply-badge">📋 Rasmiy buyurtma va ulanish</span>
            <h2 class="svc-apply-title">Ushbu xizmatdan foydalanish uchun ariza qoldiring</h2>
            <p class="svc-apply-desc">Ma’lumotlaringizni qoldiring. Mutaxassisimiz 15 daqiqa ichida siz bilan bog‘lanib, biznesingiz uchun eng optimal tizimni namoyish (demo) qiladi va narxini hisoblab beradi.</p>
          </div>

          <form id="serviceApplyForm" onsubmit="handleServiceApplySubmit(event, '{s['title']}')">
            <div class="svc-form-grid">
              <div class="svc-input-group">
                <label class="svc-input-label">Biznes / Do‘koningiz nomi *</label>
                <input type="text" id="applyStoreName" class="svc-input-field" placeholder="Masalan: Safia Bakery yoki Bellissimo" required/>
              </div>
              <div class="svc-input-group">
                <label class="svc-input-label">Mas’ul shaxs ismi *</label>
                <input type="text" id="applyContactName" class="svc-input-field" placeholder="Ismingiz" required/>
              </div>
            </div>

            <div class="svc-form-grid">
              <div class="svc-input-group">
                <label class="svc-input-label">Telefon raqamingiz *</label>
                <input type="tel" id="applyPhone" class="svc-input-field" value="+998 " required/>
              </div>
              <div class="svc-input-group">
                <label class="svc-input-label">Savdo sohasi / Yo‘nalish</label>
                <select id="applyCategory" class="svc-select-field">
                  <option value="retail">Chakana savdo (Kiyim, butik, parfyumeriya)</option>
                  <option value="food">Oziq-ovqat / Supermarket / Fast-food</option>
                  <option value="services">Xizmat ko‘rsatish / Ofis</option>
                  <option value="warehouse">Ulgurji savdo va omborxona</option>
                  <option value="other">Boshqa soha</option>
                </select>
              </div>
            </div>

            <div class="svc-input-group" style="margin-bottom:16px;">
              <label class="svc-input-label">Qo‘shimcha talab yoki izohlaringiz</label>
              <textarea id="applyNotes" class="svc-textarea-field" placeholder="Filiallar soni, kuryerlar yoki hozirda ishlatayotgan dasturingiz haqida yozishingiz mumkin..."></textarea>
            </div>

            <button type="submit" class="svc-apply-submit rip">
              <svg style="width:20px;height:20px;fill:currentColor" viewBox="0 0 24 24"><use href="#i-send"/></svg>
              <span>Arizani Telegram orqali yuborish</span>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- ==================== PACKAGES ==================== -->
    <section id="packages" class="sec">
      <div class="wrap">
        <div class="sec-head">
          <h2>Tariflar va to‘plamlar narxi</h2>
          <p>Biznesingiz ko‘lamiga mos professional paketni tanlang</p>
        </div>
        <div class="svc-packages-grid">
          {pkgs_html}
        </div>
      </div>
    </section>

    <!-- ==================== FAQ ==================== -->
    <section class="sec" style="background:var(--soft);">
      <div class="wrap">
        <div class="sec-head">
          <h2>Ko‘p beriladigan savollar</h2>
          <p>Xizmat bo‘yicha eng muhim savollarga mutaxassis javoblari</p>
        </div>
        <div class="faq-list" style="max-width:820px;margin:0 auto;">
          {faqs_html}
        </div>
      </div>
    </section>
  </main>

  {common_foot}

  <script>
  let currentPresStep = 1;
  function switchPresStep(step) {{
    currentPresStep = step;
    document.querySelectorAll('.pres-screen-img').forEach((img, idx) => {{
      img.classList.toggle('active', (idx + 1) === step);
    }});
    document.querySelectorAll('.pres-step-item').forEach(item => {{
      const s = parseInt(item.getAttribute('data-step') || '1');
      item.classList.toggle('active', s === step);
    }});
    const total = document.querySelectorAll('.pres-step-item').length;
    const counter = document.getElementById('presStepCounter');
    if (counter) counter.textContent = step + '-bosqich / ' + total + ' ta bosqich';
    if (typeof setVisMode === 'function' && step > 1) {{
      setVisMode('photos');
    }}
  }}

  window.addEventListener('DOMContentLoaded', () => {{
    try {{
      const params = new URLSearchParams(window.location.search);
      const step = parseInt(params.get('step') || '1');
      if (step >= 1 && step <= 10) {{
        switchPresStep(step);
      }}
    }} catch(e) {{}}
  }});

  function nextPresStep(total) {{
    let next = currentPresStep + 1;
    if (next > total) next = 1;
    switchPresStep(next);
  }}

  function prevPresStep(total) {{
    let prev = currentPresStep - 1;
    if (prev < 1) prev = total;
    switchPresStep(prev);
  }}

  function prefillServiceApply(serviceTitle, packageName) {{
    const notes = document.getElementById('applyNotes');
    if (notes) {{
      notes.value = `Tanlangan tarif: ${{packageName}} (${{serviceTitle}})`;
    }}
  }}

  function handleServiceApplySubmit(e, serviceTitle) {{
    e.preventDefault();
    const store = document.getElementById('applyStoreName').value.trim();
    const name = document.getElementById('applyContactName').value.trim();
    const phone = document.getElementById('applyPhone').value.trim();
    const cat = document.getElementById('applyCategory').value;
    const notes = document.getElementById('applyNotes').value.trim();

    if (!phone || phone.length < 9) {{
      alert('Iltimos, telefon raqamingizni to‘liq kiriting!');
      return;
    }}

    const data = {{
      type: 'service_application',
      service: serviceTitle,
      store: store,
      name: name,
      phone: phone,
      category: cat,
      notes: notes
    }};

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.sendData) {{
      window.Telegram.WebApp.sendData(JSON.stringify(data));
      alert('Arizangiz qabul qilindi! Menejerimiz tez orada bog‘lanadi.');
      document.getElementById('serviceApplyForm').reset();
      return;
    }}

    const tgUrl = `https://t.me/dashboardsalevvbot?start=apply_${{encodeURIComponent(store || 'service')}}`;
    window.open(tgUrl, '_blank');
    alert('Arizangiz qabul qilindi! Menejerimiz tez orada bog‘lanadi.');
    document.getElementById('serviceApplyForm').reset();
  }}

  function toggleTheme() {{
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {{ localStorage.setItem('theme', next); }} catch(e) {{}}
    const btn = document.querySelector('.theme-toggle-btn .theme-icon');
    if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
  }}
  </script>
  {extra_3d_script}
</body>
</html>'''

    out_path = os.path.join('public', s['filename'])
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(page_content)
    
    # Copy to bundle and scratch
    shutil.copy(out_path, os.path.join('dashboardsale-bundle', s['filename']))
    shutil.copy(out_path, os.path.join('/home/actualtam/.gemini/antigravity/scratch', s['filename']))
    print(f"Created dedicated service page with presentation: {out_path}")

print("All 6 dedicated standalone service pages updated!")
