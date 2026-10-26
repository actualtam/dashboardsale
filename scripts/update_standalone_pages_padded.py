import re

with open('scripts/generate_standalone_service_pages.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update SERVICES data with bg and icon
old_services_start = code.find("SERVICES = [")
old_services_end = code.find("# Generate each service page")

new_services_data = '''SERVICES = [
  {
    'slug': 'online-store',
    'image': '/images/services/svc-online-store.png',
    'icon': '/images/hero/hero-pos-terminal.png',
    'bg': '#eae0d2',
    'filename': 'services-online-store.html',
    'badge': 'Ko‘p kanalli savdo',
    'title': 'Veb-saytlar va savdo ilovalari',
    'headline': 'Brendingiz uchun to‘liq quvvatli onlayn savdo platformasi',
    'subtitle': 'Mahsulotlar katalogi, qulay savat, Payme / Click / Uzum orqali onlayn to‘lov va kuryerlik yetkazib berish integratsiyasi bilan ko‘p kanalli savdo tizimi.',
    'features': [
      ('Katalog, qidiruv va filtrlar', 'Mijozlar o‘lcham, rang, narx va brend bo‘yicha sekund ichida kerakli mahsulotni topadi.'),
      ('Payme, Click, Uzum to‘lov integratsiyasi', 'Rasmiy fiskal chek shakllanishi va mablag‘larning to‘g‘ridan-to‘g‘ri hisob raqamga tushishi.'),
      ('Telegram WebApp savdo boti', 'Mijoz qo‘shimcha ilova yuklamasdan, to‘g‘ridan-to‘g‘ri Telegram ichida tovar tanlab buyurtma beradi.'),
      ('Yandex Go va kuryerlik integratsiyasi', 'Xarita orqali yetkazib berish narxini avtomatik hisoblash va kuryer chaqirish.'),
      ('1C va Kassa tizimi bilan sinxronizatsiya', 'Saytdagi qoldiqlar do‘koningizdagi kassa bilan bir zumda sinxronlashadi, ortiqcha sotuv bo‘lmaydi.'),
      ('Tezkor SEO va mobil moslashuvchanlik', 'Google va Yandex qidiruv tizimlarida yuqori o‘rinlar hamda barcha telefonlarda ideal ishlash.')
    ],
    'steps': [
      ('01', 'Struktura va dizayn', 'Sohangizga mos brend uslubi va qulay xarid yo‘lagi (UX) ishlab chiqiladi.'),
      ('02', 'Dasturlash va to‘lovlar', 'Sayt, mobil ilova, to‘lov tizimlari va kuryerlik servislari ulanadi.'),
      ('03', 'Ombor va 1C integratsiyasi', 'Barcha tovarlar, narxlar va qoldiqlar bazangiz bilan sinxronlashtiriladi.'),
      ('04', 'Ishga tushirish va trening', 'Sayt serverga yuklanadi, xodimlaringizga buyurtmalarni qabul qilish o‘rgatiladi.')
    ],
    'packages': [
      ('Telegram Savdo Boti', '3 500 000 UZS', 'Tez va qulay boshlash uchun eng samarali yechim', ['Telegram WebApp katalog', 'Click va Payme to‘lovlari', 'Buyurtmalar guruhi va adminka', '1C qoldiqlar importi', '1 oy bepul texnik ko‘mak'], False),
      ('Veb-sayt + Telegram Bot', '8 500 000 UZS', 'O‘rta va yirik savdo bizneslari uchun eng ommabop paket', ['Zamonaviy tezkor Veb-sayt', 'Telegram savdo boti', 'Payme, Click, Uzum integratsiyasi', 'Yandex Go yetkazib berish xaritasi', 'Do‘kon kassa tizimi bilan sinxronizatsiya', 'SEO optimizatsiya va 3 oy kafolat'], True),
      ('Enterprise E-Commerce', '18 000 000 UZS', 'Brendlar va tarmoqli riteyllar uchun premium platforma', ['Web-sayt + iOS & Android ilovalar', 'Shaxsiy mijoz kabineti va sodiqlik tizimi', 'Multi-filial omborlar boshqaruvi', 'Maxsus ERP / 1C integratsiyasi', 'To‘liq texnik ko‘mak va 1 yil kafolat'], False)
    ],
    'faqs': [
      ('Sayt qancha vaqtda tayyor bo‘ladi?', 'Standart do‘kon 7-10 ish kunida, Telegram bot esa 3-5 kunda to‘liq ishga tushiriladi.'),
      ('To‘lov tizimlarini ulashda yordam berasizmi?', 'Ha, Payme Business, Click Merchant va Uzum bilan shartnoma tuzish va ulashda to‘liq yordam beramiz.'),
      ('Saytdagi tovarlar kassa bilan qanday bog‘lanadi?', '1C yoki POS kassa dasturingiz API orqali ulanadi. Kassada tovar sotilsa, saytdan avtomatik qoldiq kamayadi.')
    ]
  },
  {
    'slug': 'accounting-bots',
    'image': '/images/services/svc-accounting-bots.png',
    'icon': '/images/hero/hero-analytics-dashboard.png',
    'bg': '#cee5f6',
    'filename': 'services-accounting-bots.html',
    'badge': 'Moliyaviy nazorat',
    'title': 'Buxgalteriya va hisobot botlari',
    'headline': 'Kassa va moliyaviy hisobotlar har kuni Telegramingizda',
    'subtitle': '1C / ERP tizimlari bilan to‘g‘ridan-to‘g‘ri sinxronlashuvchi, smena yopilishi, kunlik tushum, qoldiqlar va xarajatlar haqida Telegram orqali real vaqtda xabar beruvchi aqlli botlar.',
    'features': [
      ('1C va ERP bilan to‘g‘ridan-to‘g‘ri aloqa', 'Ma’lumotlar bazasiga to‘g‘ridan-to‘g‘ri xavfsiz ulanish va sekundiga yangilanish.'),
      ('Kunlik tushum va kassa hisoboti', 'Har oqshom filiallar bo‘yicha naqd, karta va umumiy tushum haqida jamlangan hisobot.'),
      ('Kam qolgan tovarlar bo‘yicha ogohlantirish', 'Omborda tovar kritik minimumga yetganda, ta’minotchi menejerga avtomatik signal yuboriladi.'),
      ('Kassirlar smenasi va tafovut nazorati', 'Kassa ochilishi, yopilishi va smenadagi har qanday tafovutlar darhol rahbarga yetkaziladi.'),
      ('Xarajatlar va inkassatsiya kiritish', 'Do‘kondagi mayda xarajatlarni kassir bot orqali kiritadi va avtomatik 1C ga tushadi.'),
      ('Ko‘p darajali huquqlar tizimi', 'Direktor to‘liq hisobotni, filial boshqaruvchisi esa faqat o‘z do‘konini ko‘radi.')
    ],
    'steps': [
      ('01', 'Hisobotlar audit va talablar', 'Qaysi ko‘rsatkichlar (KPI, tushum, qoldiq) sizga eng muhimligi aniqlanadi.'),
      ('02', '1C / Baza bilan integratsiya', 'Serveringizga xavfsiz shifrlangan modul o‘rnatiladi.'),
      ('03', 'Bot ssenariysi va rollar', 'Rahbar, moliyachi va filial menejerlariga ruxsatlar taqsimlanadi.'),
      ('04', 'Sinov va ishga tushirish', 'Real savdo jarayonida bot sinovdan o‘tkaziladi va xodimlar o‘rgatiladi.')
    ],
    'packages': [
      ('Kassa Tushum Boti', '2 500 000 UZS', 'Kichik do‘kon va kafelar uchun kunlik nazorat', ['Smena yopilish hisoboti', 'Naqd va karta tushumlari', 'Telegram orqali xabarnoma', '1 ta filial uchun sozlash'], False),
      ('1C Smart Moliyaviy Bot', '5 500 000 UZS', 'Savdo tarmoqlari va o‘rta bizneslar uchun mukammal yechim', ['1C:Korxona bilan to‘liq integratsiya', 'Multi-filial tushumlar tahlili', 'Kam qolgan tovarlar monitoringi', 'Xarajatlar kiritish moduli', '3 oy kafolat va qo‘llab-quvvatlash'], True),
      ('Enterprise Analytics Bot', '12 000 000 UZS', 'Yirik korxonalar va ishlab chiqarish uchun maxsus bot', ['ERP / CRM / 1C multi-baza', 'Foyda va zarar (P&L) hisoboti', 'Kassirlar va sotuvchilar KPI si', 'Maxsus xavfsizlik protokoli'], False)
    ],
    'faqs': [
      ('1C bazamiz xavfsizligi qanday ta’minlanadi?', 'Bot to‘g‘ridan-to‘g‘ri ma’lumotlar bazasini o‘zgartirmaydi, faqat o‘qish huquqi bilan xavfsiz API orqali ishlaydi.'),
      ('Agar internet o‘chib qolsa hisobotlar nima bo‘ladi?', 'Internet tiklangach, barcha qoldiq va tushumlar ketma-ketlikda botga uzatiladi.'),
      ('Bir nechta filiallarimiz bo‘lsa har biriga alohida to‘laymizmi?', 'Standart va Enterprise paketlarida filiallar soni cheklanmagan bo‘lib, jamlangan hisobot beriladi.')
    ]
  },
  {
    'slug': 'attendance',
    'image': '/images/services/svc-attendance.png',
    'icon': '/images/hero/hero-face-attendance.png',
    'bg': '#cad9f5',
    'filename': 'services-attendance.html',
    'badge': 'Intizom va nazorat',
    'title': 'Face ID va xodimlar davomati',
    'headline': 'Biometriya orqali xodimlar davomati va oylik hisob-kitob',
    'subtitle': 'Face ID va barmoq izi biometrik terminallari orqali xodimlar keldi-ketdisini aniq qayd etish. Kechikishlar va sababsiz qoldirilgan vaqtlarni hisoblab, oylik maosh jadvaliga avtomat uzatish.',
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
      ('03', 'Xodimlar yuzini ro‘yxatga olish', 'Barcha xodimlar bazaga kiritiladi va ish grafiki (smena) sozlanadi.'),
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
    'image': '/images/services/svc-ai-cameras.png',
    'icon': '/images/hero/hero-ai-camera-heatmap.png',
    'bg': '#bdcadc',
    'filename': 'services-ai-cameras.html',
    'badge': 'Smart monitoring',
    'title': 'AI kamera va aqlli monitoring',
    'headline': 'Sun’iy intellektli videokuzatuv va xavfsizlik nazorati',
    'subtitle': 'Sun’iy intellekt asosidagi aqlli kameralar savdo nuqtasidagi mijozlar oqimini hisoblaydi, gavjum hududlar xaritasini (Heatmap) tuzadi va kassadagi qallobliklarni darhol fosh etadi.',
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
    'image': '/images/services/svc-equipment-setup.png',
    'icon': '/images/hero/hero-printer-scanner.png',
    'bg': '#f5e1d2',
    'filename': 'services-equipment-setup.html',
    'badge': 'Kassa va jihozlar',
    'title': 'Kassa uskunalarini o‘rnatish va montaj',
    'headline': 'Kassa texnikasini professional sozlash va kafolatli servis',
    'subtitle': 'Monobloklar, chek va barkod printerlari, 2D skanerlar, kassa qutilari va elektron tarozilarni Toshkent omboridan to‘g‘ridan-to‘g‘ri yetkazib beramiz, 1 kunda o‘rnatamiz va dasturlar bilan moslaymiz.',
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
      ('02', 'Yetkazib berish va montaj', 'Mutaxassisimiz uskunalar bilan manzilingizga boradi va ish o‘rnini jihozlaydi.'),
      ('03', 'Drayverlar va kassa dasturini ulash', 'Windows/Android tizimlariga barcha printer va skanerlar ulanadi.'),
      ('04', 'Sinov xaridlari va xodimlarni o‘qitish', 'Real kassa cheki chiqarilib, kassirlar to‘liq o‘qitiladi.')
    ],
    'packages': [
      ('Mini Kassa To‘plami', '2 900 000 UZS', 'Kichik butik va kantselyariya do‘konlari uchun', ['Qo‘l skaneri 1D/2D USB', 'Tezkor chek printeri 58mm', 'Avtomatik metall kassa qutisi', 'O‘rnatish va sozlash bepul'], False),
      ('Standart Savdo To‘plami', '6 800 000 UZS', 'Eng ommabop: Minimarket, kiyim do‘koni va dorixonalar uchun', ['Sensorli POS Monoblok 15.6" IPS', 'Ko‘p nurli 2D statsionar skaner', 'Chek printeri 80mm avto-keskich bilan', 'Kassa qutisi va kabellar', '1 yil kafolat va kassa dasturiga ulash'], True),
      ('Premium Supermarket To‘plami', '13 500 000 UZS', 'Yirik oziq-ovqat tarmoqlari va supermarketlar uchun', ['Ikki ekranli POS Monoblok (15.6" + 11.6")', 'Tezkor sanoat 2D skaneri', 'Barkod etiketka printeri', 'Shtrix-kodli elektron savdo tarozisi', 'Metall og‘ir kassa qutisi va UPS'], False)
    ],
    'faqs': [
      ('Uskunalarga qancha muddat kafolat beriladi?', 'Barcha yangi uskunalarimizga rasmiy 1 yil to‘liq kafolat beriladi.'),
      ('Viloyatlarga ham yetkazib o‘rnatib berasizmi?', 'Ha, butun O‘zbekiston bo‘ylab BTS / Fargo kuryerlik orqali yetkazamiz va mutaxassisimiz masofadan yoki joyiga borib o‘rnatadi.'),
      ('Agar dasturimiz ishlamay qolsa kimga murojaat qilamiz?', 'Bizning 24/7 texnik yordam markazimiz doim aloqada bo‘ladi. Zarur bo‘lsa mutaxassisimiz do‘koningizga tashrif buyuradi.')
    ]
  }
]
'''

code = code[:old_services_start] + new_services_data + code[old_services_end:]

# 2. Update the Hero markup inside generation loop
old_hero_markup = '''          <div class="svc-page-hero-info">
            <span class="badge" style="margin-bottom:16px;">{s['badge']}</span>
            <h1 class="svc-page-hero-title">
              {s['headline']}
            </h1>
            <p class="svc-page-hero-sub">
              {s['subtitle']}
            </p>
            <div class="svc-page-hero-btns">
              <a class="btn btn-p btn-lg rip" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
                <svg class="ico"><use href="#i-send"/></svg>
                <span>Bepul konsultatsiya olish</span>
              </a>
              <a class="btn btn-s btn-lg" href="#packages">
                <span>Tariflar va narxlar</span>
              </a>
            </div>
          </div>
          <div class="svc-page-hero-visual">
            <img src="{s['image']}" alt="{s['title']}" class="svc-page-hero-img" loading="eager"/>
          </div>'''

new_hero_markup = '''          <div class="svc-page-hero-info">
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
              <a class="btn btn-p btn-lg rip" href="https://t.me/dashboardsalevvbot" target="_blank" rel="noopener">
                <svg class="ico"><use href="#i-send"/></svg>
                <span>Bepul konsultatsiya olish</span>
              </a>
              <a class="btn btn-s btn-lg" href="#packages">
                <span>Tariflar va narxlar</span>
              </a>
            </div>
          </div>
          <div class="svc-page-hero-visual" style="background:{s['bg']};">
            <img src="{s['image']}" alt="{s['title']}" class="svc-page-hero-img" loading="eager"/>
          </div>'''

code = code.replace(old_hero_markup, new_hero_markup)

# 3. Update CSS in generate_standalone_service_pages.py
old_css_visual = '''.svc-page-hero-visual {{
      width: 100%;
      height: 320px;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 48px rgba(15, 19, 32, 0.1);
      background: var(--card-bg);
      border: 1px solid var(--card-border);
    }}
    .svc-page-hero-img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform .4s ease;
    }}
    .svc-page-hero-visual:hover .svc-page-hero-img {{
      transform: scale(1.05);
    }}
    [data-theme="dark"] .svc-page-hero-visual {{
      background: #141d33 !important;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
    }}'''

new_css_visual = '''.svc-page-hero-visual {{
      width: 100%;
      height: 340px;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 48px rgba(15, 19, 32, 0.08);
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }}
    .svc-page-hero-img {{
      width: 100%;
      height: 100%;
      object-fit: contain !important;
      display: block;
      transition: transform .4s ease;
    }}
    .svc-page-hero-visual:hover .svc-page-hero-img {{
      transform: scale(1.04);
    }}
    [data-theme="dark"] .svc-page-hero-visual {{
      background: #141d33 !important;
      border-color: #23314d !important;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
    }}'''

code = code.replace(old_css_visual, new_css_visual)

# 4. Add Telegram BackButton script before </body>
tg_script = '''
  <script>
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.ready();
        tg.expand();
        if (tg.BackButton) {
          tg.BackButton.show();
          tg.BackButton.onClick(function() {
            window.location.href = 'dashboardsale.html';
          });
        }
        if (tg.colorScheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch(e) {}
    }
  </script>
'''

if 'tg.BackButton.show()' not in code:
    code = code.replace('{common_modal}', '{common_modal}\n' + tg_script)

with open('scripts/generate_standalone_service_pages.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scripts/generate_standalone_service_pages.py successfully!")
