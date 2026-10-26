import json
import os
import re

with open('scripts/generate_standalone_service_pages.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Define the presentation section generator
presentation_builder = '''
    # Build Presentation Steps HTML
    pres_steps = s.get('presentation_steps', [])
    pres_imgs_html = ''
    pres_steps_html = ''

    if pres_steps:
        for idx, step in enumerate(pres_steps):
            s_num = idx + 1
            active_cls = ' active' if s_num == 1 else ''
            pres_imgs_html += f\'\'\'
            <img id="presImg{s_num}" src="{step[\'image\']}" alt="{s_num}-bosqich: {step[\'title\']}" class="pres-screen-img{active_cls}"/>\'\'\'
            
            tags_html = ''.join(f'<span class="pres-tag">{t}</span>' for t in step.get('tags', []))
            pres_steps_html += f\'\'\'
            <div class="pres-step-item{active_cls}" data-step="{s_num}" onclick="switchPresStep({s_num})">
              <div class="pres-step-num">{s_num}</div>
              <div class="pres-step-content">
                <h4>{step[\'title\']}</h4>
                <p>{step[\'desc\']}</p>
                <div class="pres-step-tags">
                  {tags_html}
                </div>
              </div>
            </div>\'\'\'

        presentation_section_html = f\'\'\'
    <!-- ==================== INTERACTIVE PRESENTATION ==================== -->
    <section id="presentation" class="svc-presentation-sec">
      <div class="wrap">
        <div class="svc-pres-head">
          <span class="svc-pres-badge">✨ Professional Taqdimot</span>
          <h2 class="svc-pres-title">{s[\'title\']} — Qanday Ishlaydi?</h2>
          <p class="svc-pres-sub">Quyidagi bosqichlarni bosib, ushbu tizimning to‘liq ishlash ketma-ketligi va professional imkoniyatlari bilan jonli tanishing:</p>
        </div>

        <div class="svc-pres-grid">
          <!-- Left: Phone Device Mockup -->
          <div class="device-frame-wrap">
            <div class="device-phone">
              <div class="device-speaker"></div>
              <div class="device-screen-box">
                {pres_imgs_html}
              </div>
            </div>
            <div style="text-align:center;margin-top:14px;font-size:13px;color:#94a3b8;font-weight:600;">
              <span id="presStepCounter">1-bosqich / {len(pres_steps)} ta bosqich</span>
            </div>
          </div>

          <!-- Right: Interactive Stepper -->
          <div class="pres-stepper">
            {pres_steps_html}

            <div class="pres-controls">
              <button class="pres-nav-btn" onclick="prevPresStep()">← Oldingi qadam</button>
              <a href="#apply-section" class="btn btn-sm btn-p" style="padding:10px 20px;">Xizmatga ariza qoldirish</a>
              <button class="pres-nav-btn" onclick="nextPresStep()">Keyingi qadam →</button>
            </div>
          </div>
        </div>
      </div>
    </section>\'\'\'
    else:
        presentation_section_html = ''
'''

# Update SERVICES list in generate_standalone_service_pages.py to add presentation_steps to each service
tgshop_steps = [
  {
    'title': 'Katalog va Mahsulotlar Vitrinasi',
    'desc': 'Telegram WebApp ochilishi bilan xaridor oldida yuqori sifatli qorong‘u (luxury dark) dizayndagi tovarlar katalogi, qulay toifalar (Outerwear, Footwear, Denim), narx filtrlari va qidiruv chiqadi. Hech qanday ilova yuklash shart emas.',
    'image': '/images/services/tgshop-steps/step1-catalog.png',
    'tags': ['Telegram WebApp', 'Katalog & Qidiruv', 'Kategoriyalar', 'In-Stock filtri']
  },
  {
    'title': 'Rang, Narx va O‘lchov Tanlovi',
    'desc': 'Mahsulot ichiga kirilganda xaridor tovar fotosurati, tavsifi, narxi, mavjud ranglar palitrasi (Shade: Black) va o‘lchamlarni ([XS], [S], [M], [L], [XL], [2XL]) bitta tegishda tanlaydi va savatga qo‘shadi.',
    'image': '/images/services/tgshop-steps/step2-variants.png',
    'tags': ['Rang tanlash', 'O‘lcham [XS-2XL]', 'Tovar xususiyatlari', 'Qoldiqlar nazorati']
  },
  {
    'title': 'Yetkazib Berish va To‘lov Tanlovlari',
    'desc': 'Buyurtmani rasmiylashtirishda xaridor ismi, telefoni, yetkazib berish usuli ([Courier Delivery] kuryer orqali yoki [Store Pickup] do‘kondan olib ketish), manzil va to‘lov turi ([Cash on Delivery] naqd, [Click], [Payme], [Card Transfer]) tanlanadi. Dastavka narxi avtomatik hisoblanadi.',
    'image': '/images/services/tgshop-steps/step3-checkout.png',
    'tags': ['Courier Delivery', 'Store Pickup', 'Click & Payme', 'Naqd to‘lov']
  },
  {
    'title': 'Berilgan Zakaz Yetib Kelish Holati (Real-time Tracking)',
    'desc': 'Buyurtma berilgach, mijoz Telegramda buyurtmaning real-vaqt holatini kuzatib boradi: ❶ Placed (Qabul qilindi) → ❷ Paid / Unpaid (To‘landi) → ❸ Packed (Qadoqlandi) → ❹ Dispatched (Kuryerga berildi) → ❺ Delivered (Yetkazildi). Bitta tugma bilan buyurtmani takrorlash imkoniyati.',
    'image': '/images/services/tgshop-steps/step4-tracking.png',
    'tags': ['Real-Time Tracking', '5 ta status', 'Push-xabarnoma', 'Takroriy buyurtma']
  }
]

online_store_steps = [
  {
    'title': 'Veb-sayt Vitrinasi va Mahsulotlar Qidiruvi',
    'desc': 'Katta ekranlar va smartfonlar uchun moslashuvchan internet-do‘kon vitrinasi. Qulay toifalar, jonli qidiruv va narx saralash.',
    'image': '/images/services/svc-online-store.png',
    'tags': ['SEO veb-sayt', 'Filtrlar', 'Savat']
  },
  {
    'title': 'Tovar Kartasi, Ranglar va O‘lchamlar',
    'desc': 'Xaridor tovar rasmlari, parametrlari va sharhlari bilan tanishadi. Bitta tugma bilan savatga qo‘shadi.',
    'image': '/images/services/tgshop-steps/step2-variants.png',
    'tags': ['Parametrlar', 'Ranglar', 'Tavsif']
  },
  {
    'title': 'Onlayn To‘lov va Kuryerlik Integratsiyasi',
    'desc': 'Payme, Click, Uzum orqali xavfsiz to‘lov va Yandex Go yetkazib berish xizmati bilan avtomatik hisob.',
    'image': '/images/services/tgshop-steps/step3-checkout.png',
    'tags': ['Payme & Click', 'Yandex Go', 'Fiskal chek']
  },
  {
    'title': '1C va Kassa Bilan Ikki Tomonlama Aloqa',
    'desc': 'Saytdagi har bir xarid avtomatik ravishda do‘koningizdagi kassa tizimi bilan sinxronlashadi va qoldiq yangilanadi.',
    'image': '/images/hero/hero-analytics-dashboard.png',
    'tags': ['1C sinxronizatsiya', 'Qoldiqlar', 'Kassa integratsiyasi']
  }
]

accounting_steps = [
  {
    'title': '1C va Kassa Bazasiga Xavfsiz Ulanish',
    'desc': 'Moliya va savdo dasturlaringiz (1C, iiko, Billz) shifrlangan xavfsiz kanal orqali Telegram botga ulanadi.',
    'image': '/images/services/svc-accounting-bots.png',
    'tags': ['1C API', 'Shifrlash', 'Xavfsiz ulanish']
  },
  {
    'title': 'Kunlik Tushum va Smena Yopilishi Xabarlari',
    'desc': 'Har kuni kassir smenani topshirganda yoki soat 20:00 da naqd, plastik va umumiy tushum hisoboti keladi.',
    'image': '/images/hero/hero-analytics-dashboard.png',
    'tags': ['Kunlik hisobot', 'Kassa farqi', 'Naqd va karta']
  },
  {
    'title': 'Kam Qolgan Tovarlar va Defitsit Xabarnomasi',
    'desc': 'Do‘kondagi tovar qoldig‘i belgilangan me’yordan kamaysa, ta’minotchiga buyurtma berish uchun bot ogohlantiradi.',
    'image': '/images/hero/hero-pos-terminal.png',
    'tags': ['Qoldiq nazorati', 'Avto-ogohlantirish', 'Ombor']
  },
  {
    'title': 'Sof Foyda, Rentabellik va Rahbar Tahlili',
    'desc': 'Direktor uchun barcha filiallar bo‘yicha konsolidatsiyalashgan sof foyda, rentabellik va oylik taqqoslama grafiklar.',
    'image': '/images/services/svc-accounting-bots.png',
    'tags': ['Sof foyda', 'Filiallar tahlili', 'Rahbar hisoboti']
  }
]

attendance_steps = [
  {
    'title': '0.2s Face ID Biometrik Aniqlash',
    'desc': 'Xodim eshik yoki turniket oldiga kelganda 0.2 soniyada yuzidan aniqlanadi va ruxsat beriladi.',
    'image': '/images/services/svc-attendance.png',
    'tags': ['0.2s Face ID', '99.9% aniqlik', 'Anti-spoofing']
  },
  {
    'title': 'Kechikishlar va Ish Vaqti Daqiqabay Tahlili',
    'desc': 'Har bir xodimning kelgan va ketgan daqiqasi avtomatik qayd etiladi, sababsiz kechikishlar hisoblanadi.',
    'image': '/images/hero/hero-face-attendance.png',
    'tags': ['Daqiqabay hisob', 'Kechikishlar', 'Smena nazorati']
  },
  {
    'title': 'Telegram Orqali Rahbarga Avto-Xabarnoma',
    'desc': 'Xodim ishga kelishi bilan rahbarning Telegramiga rasm va vaqt ko‘rsatilgan bildirishnoma yetib boradi.',
    'image': '/images/services/svc-attendance.png',
    'tags': ['Telegram bot', 'Xodim kelishi', 'Jonli bildirish']
  },
  {
    'title': '1C ZUP va T-13 Maosh Tabeliga Eksport',
    'desc': 'Oy oxirida bir bosishda buxgalteriya uchun tayyor T-13 jadvali shakllanadi va maosh hisoblashga uzatiladi.',
    'image': '/images/hero/hero-analytics-dashboard.png',
    'tags': ['T-13 jadval', '1C ZUP', 'Oylik maosh']
  }
]

ai_steps = [
  {
    'title': 'Odam Sanash va Mijozlar Oqimi (People Counter)',
    'desc': 'Do‘konga kun davomida necha kishi kirdi va ularning qanchasi xarid qildi — konversiya aniq hisoblanadi.',
    'image': '/images/services/svc-ai-cameras.png',
    'tags': ['People Counter', 'Konversiya', 'Kirish-chiqish']
  },
  {
    'title': 'Gavjum Zonalar Issiqlik Xaritasi (Heatmap)',
    'desc': 'Xaridorlar do‘konning qaysi rastalari oldida ko‘proq to‘xtayotganini qizil/sariq issiqlik xaritasi ko‘rsatadi.',
    'image': '/images/hero/hero-ai-camera-heatmap.png',
    'tags': ['Heatmap', 'Rastalar tahlili', 'Mijoz qiziqishi']
  },
  {
    'title': 'Kassa Cheki Bilan Sinxron Video Nazorat',
    'desc': 'Kassir tovar urganida chek matni kamera videosi ustiga chiqadi — qaytarilmagan cheklar va firibgarliklar fosh bo‘ladi.',
    'image': '/images/hero/hero-pos-terminal.png',
    'tags': ['Kassa sinxroni', 'Chek nazorati', 'Qalloblik fosh']
  },
  {
    'title': 'Navbat Monitoringi va Xavfsizlik Signallari',
    'desc': 'Kassada 4 tadan ortiq odam navbatda tursa, administratsiyaga zudlik bilan xabarnoma boradi.',
    'image': '/images/services/svc-ai-cameras.png',
    'tags': ['Navbat nazorati', 'Smart signal', '24/7 arxiv']
  }
]

equipment_steps = [
  {
    'title': 'Savdo Sohasi Bo‘yicha Texnika Tanlash',
    'desc': 'Do‘koningiz yo‘nalishi (kiyim, supermarket, restoran)ga mos sensorli monoblok, skaner va printerlar sarlavhalanadi.',
    'image': '/images/services/svc-equipment-setup.png',
    'tags': ['POS apparatlar', 'Skanerlar', 'Printerlar']
  },
  {
    'title': 'Toshkent Omboridan 1 Kunda Tezkor Yetkazish',
    'desc': 'Barcha buyurtma qilingan texnikalar 24 soat ichida to‘liq komplektatsiya bilan manzilingizga yetkaziladi.',
    'image': '/images/hero/hero-printer-scanner.png',
    'tags': ['1 kunda yetkazish', 'Ombor zaxirasi', 'Xavfsiz qadoq']
  },
  {
    'title': 'Joyida Montaj va Kassa Dasturlariga Ulash',
    'desc': 'Muhandislarimiz barcha drayverlarni o‘rnatadi, Billz, Jowi, R-Keeper, iiko, 1C tizimlari bilan to‘liq integratsiya qiladi.',
    'image': '/images/hero/hero-pos-terminal.png',
    'tags': ['Joyida montaj', 'Drayverlar', '100% integratsiya']
  },
  {
    'title': 'Kassirlarni O‘qitish va Rasmiy 1 Yil Kafolat',
    'desc': 'Kassir xodimlaringizga uskunadan foydalanish o‘rgatiladi, rasmiy kafolat taloni rasmiylashtiriladi.',
    'image': '/images/services/svc-equipment-setup.png',
    'tags': ['Xodimlar treningi', '1 yil kafolat', 'Doimiy servis']
  }
]

print("Defined all steps.")
