export interface ServicePackage {
  name: string;
  price: string;
  desc: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceDetail {
  slug: string;
  htmlFile: string;
  badge: string;
  title: string;
  shortDesc: string;
  heroHeadline: string;
  heroSubtitle: string;
  icon: string;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  steps: {
    step: string;
    title: string;
    desc: string;
  }[];
  packages: ServicePackage[];
  faq: {
    q: string;
    a: string;
  }[];
}

export const SERVICES: ServiceDetail[] = [
  {
    slug: 'online-store',
    htmlFile: 'services-online-store.html',
    badge: 'Ko‘p kanalli savdo',
    title: 'Veb-saytlar va savdo ilovalari',
    shortDesc: 'Do‘koningiz uchun zamonaviy veb-sayt, mobil ilova va Telegram savdo boti.',
    heroHeadline: 'Brendingiz uchun to‘liq quvvatli onlayn savdo platformasi',
    heroSubtitle: 'Mahsulotlar katalogi, qulay savat, Payme / Click / Uzum orqali onlayn to‘lov va kuryerlik yetkazib berish integratsiyasi bilan ko‘p kanalli savdo tizimi.',
    icon: 'cart',
    features: [
      {
        title: 'Katalog, qidiruv va moslashuvchan filtrlar',
        description: 'Mijozlar o‘lcham, rang, narx va brend bo‘yicha sekund ichida kerakli mahsulotni topadi.',
        icon: 'search',
      },
      {
        title: 'Payme, Click, Uzum to‘lov integratsiyasi',
        description: 'Rasmiy fiskal chek shakllanishi va mablag‘larning to‘g‘ridan-to‘g‘ri hisob raqamga tushishi.',
        icon: 'card',
      },
      {
        title: 'Telegram WebApp savdo boti',
        description: 'Mijoz qo‘shimcha ilova yuklamasdan, to‘g‘ridan-to‘g‘ri Telegram ichida tovar tanlab buyurtma beradi.',
        icon: 'bot',
      },
      {
        title: 'Yandex Go va kuryerlik integratsiyasi',
        description: 'Xarita orqali yetkazib berish narxini avtomatik hisoblash va kuryer chaqirish.',
        icon: 'pin',
      },
      {
        title: '1C va Kassa tizimi bilan sinxronizatsiya',
        description: 'Saytdagi qoldiqlar do‘koningizdagi kassa bilan bir zumda sinxronlashadi, ortiqcha sotuv bo‘lmaydi.',
        icon: 'sync',
      },
      {
        title: 'Tezkor SEO va mobil moslashuvchanlik',
        description: 'Google va Yandex qidiruv tizimlarida yuqori o‘rinlar hamda barcha telefonlarda ideal ishlash.',
        icon: 'speed',
      },
    ],
    steps: [
      { step: '01', title: 'Struktura va dizayn', desc: 'Sohangizga mos brend uslubi va qulay xarid yo‘lagi (UX) ishlab chiqiladi.' },
      { step: '02', title: 'Dasturlash va to‘lovlar', desc: 'Sayt, mobil ilova, to‘lov tizimlari va kuryerlik servislari ulanadi.' },
      { step: '03', title: 'Ombor va 1C integratsiyasi', desc: 'Barcha tovarlar, narxlar va qoldiqlar bazangiz bilan sinxronlashtiriladi.' },
      { step: '04', title: 'Ishga tushirish va trening', desc: 'Sayt serverga yuklanadi, xodimlaringizga buyurtmalarni qabul qilish o‘rgatiladi.' },
    ],
    packages: [
      {
        name: 'Telegram Savdo Boti',
        price: '3 500 000 UZS',
        desc: 'Tez va qulay boshlash uchun eng samarali yechim',
        features: ['Telegram WebApp katalog', 'Click va Payme to‘lovlari', 'Buyurtmalar guruhi va adminka', '1C qoldiqlar importi', '1 oy bepul texnik ko‘mak'],
      },
      {
        name: 'Veb-sayt + Telegram Bot',
        price: '8 500 000 UZS',
        desc: 'O‘rta va yirik savdo bizneslari uchun eng ommabop paket',
        features: ['Zamonaviy tezkor Veb-sayt', 'Telegram savdo boti', 'Payme, Click, Uzum integratsiyasi', 'Yandex Go yetkazib berish xaritasi', 'Do‘kon kassa tizimi bilan sinxronizatsiya', 'SEO optimizatsiya va 3 oy kafolat'],
        isPopular: true,
      },
      {
        name: 'Enterprise E-Commerce',
        price: '18 000 000 UZS',
        desc: 'Brendlar va tarmoqli riteyllar uchun premium platforma',
        features: ['Web-sayt + iOS & Android ilovalar', 'Shaxsiy mijoz kabineti va sodiqlik tizimi', 'Multi-filial omborlar boshqaruvi', 'Maxsus ERP / 1C integratsiyasi', 'To‘liq texnik ko‘mak va 1 yil kafolat'],
      },
    ],
    faq: [
      { q: 'Sayt qancha vaqtda tayyor bo‘ladi?', a: 'Telegram savdo boti 3-5 kunda, to‘liq veb-sayt esa o‘rtacha 10-14 ish kunida tayyorlanadi.' },
      { q: 'Tovarlarni qanday kiritamiz?', a: '1C, Excel yoki amaldagi kassa dasturingizdan avtomatik yuklab beramiz.' },
      { q: 'Saytga o‘zgartirish kiritish osonmi?', a: 'Ha, qulay boshqaruv paneli (Admin panel) orqali narxlar, aksiyalar va tovarlarni o‘zingiz oson o‘zgartirasiz.' },
    ],
  },
  {
    slug: 'accounting-bots',
    htmlFile: 'services-accounting-bots.html',
    badge: '1C va Moliya',
    title: 'Buxgalteriya va biznes botlari',
    shortDesc: '1C / ERP tizimlari bilan to‘g‘ridan-to‘g‘ri sinxronlashuvchi aqlli hisobot botlari.',
    heroHeadline: 'Biznesingizning barcha ko‘rsatkichlari cho‘ntagingizdagi Telegramda',
    heroSubtitle: 'Smena yopilishi, kunlik naqd va terminalsiz tushum, kam qolgan tovarlar va rentabellik haqida Telegram orqali 24/7 avtomatik hisobotlar.',
    icon: 'bot',
    features: [
      {
        title: '1C:Korxona va ERP bilan to‘g‘ridan-to‘g‘ri aloqa',
        description: 'Hech qanday qo‘lda kiritishlarsiz, 1C ma’lumotlar bazasidan to‘g‘ridan-to‘g‘ri xavfsiz o‘qiladi.',
        icon: 'sync',
      },
      {
        title: 'Smena ochilishi va yopilishi signallari',
        description: 'Qaysi kassir soat nechada kassa smenasini ochdi yoki yopdi, kassa qoldig‘i qancha — bir zumda xabar keladi.',
        icon: 'bell',
      },
      {
        title: 'Kunlik tushum va to‘lov turlari taqsimoti',
        description: 'Naqd pul, bank kartasi (terminal), Click, Payme va nasiya orqali tushumlar alohida ko‘rinadi.',
        icon: 'chart',
      },
      {
        title: 'Kam qolgan tovarlar bo‘yicha ogohlantirish',
        description: 'Eng xaridorgir tovarlar omborda kritik miqdorga tushishi bilan ta’minotchiga buyurtma berish haqida eslatma.',
        icon: 'box',
      },
      {
        title: 'Qarzdorliklar va yetkazib beruvchilar balansi',
        description: 'Kimdan qancha qarzimiz bor va qaysi mijozning muddati o‘tgan qarzi mavjudligini kuzatish.',
        icon: 'users',
      },
      {
        title: 'Xodimlar uchun ruxsat chegaralari',
        description: 'Direktor, buxgalter va do‘kon boshqaruvchisi faqat o‘ziga tegishli raqamlarni ko‘radi.',
        icon: 'lock',
      },
    ],
    steps: [
      { step: '01', title: 'Tizim audit', desc: 'Amaldagi 1C konfiguratsiyasi (8.3, Savdo boshqaruvi, Buxgalteriya) va kerakli hisobotlar belgilanadi.' },
      { step: '02', title: 'API va modul o‘rnatish', desc: '1C serveriga xavfsiz shifrlangan ma’lumot uzatish moduli o‘rnatiladi.' },
      { step: '03', title: 'Telegram bot dasturlash', desc: 'Grafiklar, tugmalar va bildirishnoma vaqtlari sizning talabingizga ko‘ra sozlanadi.' },
      { step: '04', title: 'Test va sinov', desc: 'Real ma’lumotlar asosida 3 kun davomida to‘liq tekshirilib, topshiriladi.' },
    ],
    packages: [
      {
        name: 'Standart 1C Kassa Boti',
        price: '2 900 000 UZS',
        desc: 'Bitta savdo nuqtasi uchun ideal',
        features: ['Kunlik tushum hisoboti', 'Smena ochilish/yopilish xabari', 'To‘lov turlari bo‘yicha hisobot', 'Telegram bildirishnomalar', '1 yil kafolat'],
      },
      {
        name: 'Tarmoqli Moliya Boti',
        price: '5 500 000 UZS',
        desc: '2 tadan 10 tagacha filiallar uchun',
        features: ['Barcha filiallar tushumi alohida va umumiy', 'Kam qolgan tovarlar nazorati', 'Qarzdorliklar balansi', 'Direktor va menejerlar rollari', '3 oy bepul sozlash va kafolat'],
        isPopular: true,
      },
      {
        name: 'Custom ERP Boshqaruv Boti',
        price: '9 000 000 UZS',
        desc: 'Katta korxona va distribyutsiya kompaniyalari uchun',
        features: ['Buyurtmalarni tasdiqlash funksiyasi', 'Omborlararo transferlarni tasdiqlash', 'P&L va foyda tahlili', 'Xodimlar maoshi hisob-kitobi', 'To‘liq xavfsizlik auditi va monitoring'],
      },
    ],
    faq: [
      { q: '1C bazamiz xavfsizligiga kafolat bormi?', a: 'Ha, bot faqat xavfsiz o‘qish huquqi bilan ishlaydi, bazaga yozish huquqiga ega bo‘lmaydi. Ma’lumotlar shifrlangan SSL kanali orqali uzatiladi.' },
      { q: 'Internet o‘chib qolsa bot nima bo‘ladi?', a: 'Internet yoqilishi bilan 1C serveri navbatdagi to‘plangan hisobotlarni bir zumda Telegramga yetkazadi.' },
      { q: 'Qaysi 1C versiyalariga to‘g‘ri keladi?', a: '1C 8.2, 8.3 platformalarining barcha konfiguratsiyalari (УТ, Розница, Бухгалтерия, УНФ) bilan ishlaydi.' },
    ],
  },
  {
    slug: 'attendance',
    htmlFile: 'services-attendance.html',
    badge: 'Xodimlar intizomi',
    title: 'Xodimlar davomati va nazorat tizimlari',
    shortDesc: 'Face ID va biometriya orqali xodimlar keldi-ketdisini aniq qayd etish.',
    heroHeadline: 'Xodimlar keldi-ketdisini daqiqasigacha aniq hisoblang',
    heroSubtitle: 'Face ID yuzdan tanish terminallari, kechikishlar statistikasi va oylik ish haqi tabeliga avtomatik integratsiya.',
    icon: 'face',
    features: [
      {
        title: '0.2 soniyada Face ID orqali aniqlash',
        description: 'Xodim terminal oldidan o‘tishi bilan yuzi taniladi. Niqob, kepka va ko‘zoynakda ham adashmaydi.',
        icon: 'face',
      },
      {
        title: 'Foto / Video orqali aldashdan 100% himoya',
        description: 'Jonli inson yuzini (Liveness detection) tekshiruvchi ikki kamerali 3D sensorlar orqali soxtalashtirish imkonsiz.',
        icon: 'shield',
      },
      {
        title: 'Kechikishlar va erta ketishlar tahlili',
        description: 'Belgilangan ish grafigiga ko‘ra har bir daqiqa hisobga olinadi va oylik tabel shakllanadi.',
        icon: 'clock',
      },
      {
        title: 'Turniket va eshik qulflari boshqaruvi',
        description: 'Faqat ruxsati bor xodimlar uchun magnit eshiklar va turniketlar avtomatik ochiladi.',
        icon: 'lock',
      },
      {
        title: 'Telegram bot orqali rahbar va xodim xabardorligi',
        description: 'Rahbarga kim kechikkani haqida ertalab hisobot boradi, xodim esa o‘z davomatini Telegramda ko‘ra oladi.',
        icon: 'bot',
      },
      {
        title: '1C:ZUP va maosh hisoblash integratsiyasi',
        description: 'Ishlangan soatlar bir tugma orqali buxgalteriyaning ish haqi hisoblash dasturiga yuklanadi.',
        icon: 'sync',
      },
    ],
    steps: [
      { step: '01', title: 'Obyekt ko‘rigi', desc: 'Do‘kon, ofis yoki sexdagi kirish eshiklari, turniket o‘rnatish joylari o‘rganiladi.' },
      { step: '02', title: 'Terminal va montaj', desc: 'Face ID terminallari, magnit qulflar va kabellar sifatli o‘rnatiladi.' },
      { step: '03', title: 'Dastur va xodimlar ro‘yxati', desc: 'Dastur o‘rnatilib, xodimlarning suratlari va ish jadvallari kiritiladi.' },
      { step: '04', title: 'Trening va topshirish', desc: 'HR mutaxassis va rahbarlarga hisobotlarni olish o‘rgatiladi.' },
    ],
    packages: [
      {
        name: 'Kichik Jamoa (1 ta Terminal)',
        price: '3 800 000 UZS',
        desc: '30 tagacha xodimga ega kichik do‘kon yoki ofis',
        features: ['1 ta Face ID biometrik terminal', 'Dasturiy ta’minot va o‘rnatish', 'Kechikishlar hisoboti', 'Xodimlar uchun bazani sozlash', '1 yil rasmiy kafolat'],
      },
      {
        name: 'Ofis & Savdo Nuqtasi',
        price: '6 900 000 UZS',
        desc: '100 tagacha xodimi bor korxona va do‘konlar',
        features: ['1 ta Premium Face ID terminal + Magnit qulf', 'Eshik montaji va chiqish tugmasi', 'Telegram bot hisobotlari', 'Oylik tabel va kechikishlar tahlili', '1C ZUP eksport moduli', '1 yil kafolat va servis'],
        isPopular: true,
      },
      {
        name: 'Korxona va Zavod (Turniket)',
        price: '14 500 000 UZS',
        desc: 'Katta oqimli korxonalar, omborlar va fabrikalar',
        features: ['Tripod / Flap turniket montaji', '2 ta Face ID terminal (Kirish/Chiqish)', 'Ko‘p smenali grafiklar va ruxsatnomalar', 'Avtomat maosh tabeli', 'VIP texnik ko‘mak va montaj'],
      },
    ],
    faq: [
      { q: 'Xodim boshqasining o‘rniga belgilab ketishi mumkinmi?', a: 'Mutlaqo yo‘q. Face ID biometriya faqat jonli inson yuzini tekshiradi, rasm yoki telefon ekranidagi videoni qabul qilmaydi.' },
      { q: 'Elektr o‘chib qolsa terminal ishlaydimi?', a: 'Ha, zaxira akkumulyator (UPS) bilan 4-8 soat uzluksiz ishlaydi va o‘z xotirasida barcha qaydlarni saqlab qoladi.' },
      { q: 'Filiallar ko‘p bo‘lsa bir joydan nazorat qilsa bo‘ladimi?', a: 'Ha, bulutli markaziy dastur orqali 20 ta filialdagi barcha xodimlarning davomatini bitta kompyuterdan ko‘rasiz.' },
    ],
  },
  {
    slug: 'ai-cameras',
    htmlFile: 'services-ai-cameras.html',
    badge: 'Aqlli Videokuzatuv',
    title: 'AI kamera va aqlli monitoring',
    shortDesc: 'Savdo hududlari, kassa intizomi va mijozlar oqimining sun’iy intellekt nazorati.',
    heroHeadline: 'Savdo nuqtangizni sun’iy intellekt ko‘zlari bilan nazorat qiling',
    heroSubtitle: 'Mijozlar oqimi hisoblagichi, gavjum zonalar xaritasi (Heatmap), kassadagi shubhali harakatlar va xodimlar nazorati.',
    icon: 'camera',
    features: [
      {
        title: 'Mijozlar oqimi hisobi (People Counting)',
        description: 'Do‘konga necha kishi kirdi va ularning nechtasi xarid qildi — do‘koningiz konversiya koeffitsiyentini aniqlang.',
        icon: 'users',
      },
      {
        title: 'Savdo zali issiqlik xaritasi (Heatmap)',
        description: 'Mijozlar do‘konning qaysi polkasi oldida eng ko‘p to‘xtalmoqda va qaysi hududlar e’tibordan chetda qolayotganini ko‘rsatadi.',
        icon: 'map',
      },
      {
        title: 'Kassadagi qoidabuzarliklar nazorati',
        description: 'Chek urmasdan tovar berish, kassani ochiq qoldirish yoki tovar qaytarishdagi shubhali holatlar bo‘yicha darhol signal.',
        icon: 'alert',
      },
      {
        title: 'Kassa navbat monitoringi',
        description: 'Kassada 4 tadan ortiq odam to‘plansa, menejerga zudlik bilan ikkinchi kassani ochish haqida xabarnoma yuboriladi.',
        icon: 'clock',
      },
      {
        title: 'Xodimlar ish o‘rnida yo‘qligini fosh etish',
        description: 'Kassir yoki sotuvchi ish joyini sababsiz uzoq vaqt tark etsa, tizim buni videoda belgilab qo‘yadi.',
        icon: 'eye',
      },
      {
        title: 'Mobil ilovadan 24/7 jonli kuzatish',
        description: 'Dunyoning istalgan nuqtasidan turib audio va yuqori sifatli 4K tasvirni onlayn kuzatish imkoniyati.',
        icon: 'phone',
      },
    ],
    steps: [
      { step: '01', title: 'Savdo zali loyihasi', desc: 'Kameralarning ko‘rish burchagi va fokus nuqtalari hisoblanadi.' },
      { step: '02', title: 'AI uskunalar montaji', desc: 'Yuqori sezgirlikdagi IP kameralar va AI videoregistrator o‘rnatiladi.' },
      { step: '03', title: 'Neyrotarmoqni o‘rgatish', desc: 'Hududlar, hisoblash chiziqlari va kassa zonalari tizimga kiritiladi.' },
      { step: '04', title: 'Telegram ogohlantirishlar', desc: 'Kassadagi xavfli holatlar bo‘yicha bildirishnomalar Telegramga ulanadi.' },
    ],
    packages: [
      {
        name: 'Do‘kon AI Monitoring (4 ta kamera)',
        price: '7 500 000 UZS',
        desc: 'Bitta savdo zali va kassa zonasi uchun',
        features: ['4 ta 4MP AI IP kamera', '1 ta AI videoregistrator + 2TB xotira', 'Mijozlar hisoblagichi (People Counter)', 'Kassa zonasi nazorati', 'Montaj va kabel ishlari bilan', '1 yil to‘liq kafolat'],
      },
      {
        name: 'Supermarket & Tarmoq (8 ta kamera)',
        price: '15 000 000 UZS',
        desc: 'Katta savdo maydonlari va tarmoq do‘konlar',
        features: ['8 ta Smart AI kamera (Kassa + Polka + Kirish)', 'Issiqlik xaritasi (Heatmap) moduli', 'Kassada navbat detektori', 'Telegram orqali avariyniy xabarnomalar', 'Mobil ilova va markaziy boshqaruv', '1 yil kafolat va VIP servis'],
        isPopular: true,
      },
      {
        name: 'Enterprise Riteyl (16+ kamera)',
        price: 'Shartnoma asosida',
        desc: 'Gipermarketlar, savdo markazlari va omborxonalar',
        features: ['Ko‘p serverli arxitektura', 'Mijozlar yuzini tanish (VIP & Stop list)', 'Kassa cheklari bilan videoni bog‘lash (POS-Video)', 'Maxsus sun’iy intellekt skriptlari', '24/7 texnik nazorat xizmati'],
      },
    ],
    faq: [
      { q: 'Eski oddiy kameralarimizni AI ga aylantirsa bo‘ladimi?', a: 'Ko‘p hollarda ha! Bizning AI serverimiz mavjud kameralar oqimini qabul qilib, ularga sun’iy intellekt tahlilini qo‘shib bera oladi.' },
      { q: 'Mijozlar sonini qanchalik aniq hisoblaydi?', a: 'Bizning AI modellarimiz 98%+ aniqlik bilan odamlar va aravachalarni bir-biridan ajratib sanaydi.' },
      { q: 'Internet sekin bo‘lsa video to‘xtab qolmaydimi?', a: 'Lokal server do‘kon ichida ishlaydi, shuning uchun internet tezligidan qat’i nazar tahlil uzluksiz ishlayveradi.' },
    ],
  },
  {
    slug: 'equipment-setup',
    htmlFile: 'services-equipment-setup.html',
    badge: 'Uskunalar va Montaj',
    title: 'Biznes uskunalari va montaj',
    shortDesc: 'Do‘kon va restoranlar uchun barcha turdagi kassa texnikasini yetkazish va montaj qilish.',
    heroHeadline: 'Savdo va xizmat ko‘rsatish uchun ishonchli kassa texnikasi',
    heroSubtitle: 'Sensorli POS monobloklar, 2D skanerlar, tezkor chek printerlari, kassa qutilari va ularni dasturga to‘liq ulab berish.',
    icon: 'monitor',
    features: [
      {
        title: 'Sensorli POS Monobloklar',
        description: '15.6" Full HD IPS sensorli ekranlar, kuchli protsessorlar, chang va namlikdan himoyalangan korpus.',
        icon: 'monitor',
      },
      {
        title: '1D / 2D Shtrix-kod va QR Skanerlar',
        description: 'Superlead, Datalogic va Zebra brendlarining simli, simsiz va statsionar stol usti skanerlari.',
        icon: 'scan',
      },
      {
        title: 'Tezkor termal chek printerlari',
        description: '80mm va 58mm o‘lchamdagi avtomatik pichoqli, siyohsiz ishlovchi termal printerlar.',
        icon: 'printer',
      },
      {
        title: 'Avtomatik metall pul qutilari',
        description: 'Chek urilganda avtomatik ochiluvchi, mustahkam metall podshipnikli kassa tortmalari.',
        icon: 'drawer',
      },
      {
        title: 'Toshkent omboridan bepul yetkazish',
        description: 'Barcha uskunalar Toshkent omborimizda mavjud. Buyurtma kuni bepul yetkazib beramiz.',
        icon: 'truck',
      },
      {
        title: 'Joyida montaj va 1C/POS ga ulash',
        description: 'Mutaxassisimiz do‘koningizga borib, drayverlarni sozlaydi va kassirga ishlatishni o‘rgatadi.',
        icon: 'tool',
      },
    ],
    steps: [
      { step: '01', title: 'Ehtiyojni aniqlash', desc: 'Do‘kon turi va kassirlar soniga mos uskunalar to‘plami tanlanadi.' },
      { step: '02', title: 'Yetkazib berish', desc: 'Toshkent bo‘ylab bir necha soat ichida to‘liq to‘plam ombordan yetkaziladi.' },
      { step: '03', title: 'O‘rnatish va montaj', desc: 'Monoblok, printer, skaner va kassa qutisi kabellari yashirin montaj qilinadi.' },
      { step: '04', title: 'Dasturga ulash va kafolat', desc: '1C / BILLZ / DashboardSale kassa dasturlariga ulanib, rasmiy kafolat beriladi.' },
    ],
    packages: [
      {
        name: 'Kassa To‘plami "Start"',
        price: '2 400 000 UZS',
        desc: 'Kompyuteri bor savdo nuqtalari uchun',
        features: ['58mm Termal chek printeri', '2D Shtrix-kod va QR skaneri', 'Avtomatik metall pul qutisi', 'Bepul yetkazish va sozlash', '1 yil rasmiy kafolat'],
      },
      {
        name: 'Kassa To‘plami "Standart"',
        price: '5 800 000 UZS',
        desc: 'Do‘kon, kafe va kiyim-kechak biznesi uchun',
        features: ['15.6" Sensorli POS Monoblok (8GB / 128GB SSD)', '80mm Avtomatik pichoqli chek printeri', '2D Stol usti statsionar skaneri', 'Metall kassa tortmasi', 'Bepul montaj va 1C/POS dasturga ulash', '1 yil kafolat va texnik ko‘mak'],
        isPopular: true,
      },
      {
        name: 'Supermarket / Restoran "Pro"',
        price: '9 500 000 UZS',
        desc: 'Katta oqimli savdo va restoranlar uchun',
        features: ['Dual-Screen 15.6"+11.6" Mijoz ekranli POS Monoblok', 'Superlead / Datalogic ko‘p nurli 2D skaner', 'Elektron shtrix-kodli taroziga ulash', '80mm tezyurar chek printeri', 'Zaxira quvvat bloki (UPS)', '24/7 ustuvor servis xizmati'],
      },
    ],
    faq: [
      { q: 'Uskunalarga qancha kafolat beriladi?', a: 'Barcha uskunalarimizga 1 yil to‘liq rasmiy servis kafolati beriladi. Nosozlik bo‘lsa o‘zimiz borib ta’mirlaymiz yoki almashtiramiz.' },
      { q: 'Bizdagi dasturga (masalan 1C yoki Jowi) to‘g‘ri keladimi?', a: 'Ha, barcha skaner va printerlarimiz 1C, BILLZ, Jowi, R-Keeper, Poster va boshqa barcha dasturlarga 100% mos keladi.' },
      { q: 'Viloyatlarga yetkazib berish bormi?', a: 'Ha, O‘zbekistonning barcha viloyatlariga BTS yoki Fargo pochtasi orqali 24 soatda xavfsiz yetkazib beramiz.' },
    ],
  },
];
