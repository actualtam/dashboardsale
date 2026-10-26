export interface ServiceItem {
  key: string;
  title: string;
  shortDesc: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  iconName: string;
  badges: string[];
}

export interface StepItem {
  step: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const siteConfig = {
  name: 'DashboardSale',
  legalName: 'DashboardSale B2B Solutions',
  tagline: 'Biznesingiz samarali ishlashi uchun barcha zarur texnologiyalar.',
  description:
    'Do‘kon, savdo tarmoqlari va korxonalar uchun savdo tizimlari, hisob-kitob botlari, biometrik davomat, AI kameralar va professional kassa uskunalari.',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+998 90 123 45 67',
  phoneClean: '+998901234567',
  telegramBotUser: '@dashboardsalevvbot',
  telegramUrl: 'https://t.me/dashboardsalevvbot',
  address: 'Toshkent shahri, O‘zbekiston',
  workingHours: 'Dushanba – Shanba: 09:00 – 19:00',
  currency: 'UZS',
  social: {
    telegram: 'https://t.me/dashboardsalevvbot',
  },

  services: [
    {
      key: 'online_store',
      title: 'Veb-saytlar va savdo ilovalari',
      shortDesc: 'Do‘koningiz uchun zamonaviy veb-sayt, mobil ilova va Telegram savdo boti.',
      description:
        'Mahsulotlar katalogi, savat, onlayn to‘lov (Payme, Click, Uzum) va kuryerlik yetkazib berish integratsiyasi bilan to‘liq jihozlangan ko‘p kanalli savdo tizimlari.',
      ctaText: 'Savdo tizimini muhokama qilish',
      iconName: 'ShoppingBag',
      badges: ['Onlayn to‘lov', 'Telegram savdo bot', 'Katalog va savat', 'Kuryer xizmati integratsiyasi'],
    },
    {
      key: 'accounting_bots',
      title: 'Buxgalteriya va biznes botlari',
      shortDesc: 'Ombor hisobi, kirim-chiqim nazorati va rahbar uchun avtomatlashtirilgan hisobotlar.',
      description:
        '1C / ERP tizimlari bilan to‘g‘ridan-to‘g‘ri sinxronlashuvchi, smena yopilishi, kunlik tushum va qoldiqlar haqida Telegram orqali xabar beruvchi aqlli botlar.',
      ctaText: 'Biznes avtomatlashtirishni muhokama qilish',
      iconName: 'Bot',
      badges: ['1C / ERP sinxronizatsiya', 'Kunlik kassa hisoboti', 'Kassir smenasi', 'Qoldiqlar ogohlantirishi'],
    },
    {
      key: 'attendance',
      title: 'Xodimlar davomati va nazorat tizimlari',
      shortDesc: 'Face ID va biometriya orqali xodimlar keldi-ketdisini aniq qayd etish.',
      description:
        'Kechikishlar, erta ketishlar va sababsiz kelmasliklarni daqiqasigacha hisoblab, oylik maosh hisob-kitobiga avtomat uzatuvchi zamonaviy biometrik terminallar va turniketlar.',
      ctaText: 'Davomat tizimini oʻrnatish',
      iconName: 'Fingerprint',
      badges: ['Face ID biometriya', 'Turniket integratsiyasi', 'Kechikishlar tahlili', 'Oylik hisob-kitob'],
    },
    {
      key: 'ai_cameras',
      title: 'AI kamera va aqlli monitoring',
      shortDesc: 'Mijozlar oqimi tahlili, navbatlar nazorati va shubhali holatlarni aniqlash.',
      description:
        'Sun’iy intellekt asosidagi videokuzatuv tizimi savdo nuqtasidagi eng gavjum hududlarni aniqlaydi, kassadagi qallobliklarni fosh etadi va xavfsizlikni to‘liq kafolatlaydi.',
      ctaText: 'AI monitoringni muhokama qilish',
      iconName: 'ScanEye',
      badges: ['Issiqlik xaritasi (Heatmap)', 'Navbat monitoringi', 'Kassa xavfsizligi', '24/7 video tahlil'],
    },
    {
      key: 'equipment_setup',
      title: 'Biznes uskunalari va montaj',
      shortDesc: 'Monobloklar, chek printerlar, skanerlar, kassa qutilari va to‘liq montaj xizmati.',
      description:
        'Chakana savdo va xizmat ko‘rsatish sohalari uchun zarur barcha kassa texnikasini yetkazib beramiz, joyida o‘rnatamiz va kafolatli texnik ko‘mak taqdim etamiz.',
      ctaText: 'Uskunalarni koʻrish',
      ctaLink: '/equipment',
      iconName: 'Cpu',
      badges: ['POS Monobloklar', 'Chek printerlar', '2D Shtrix-kod skanerlar', 'Montaj va kafolat'],
    },
  ] as ServiceItem[],

  steps: [
    {
      step: '01',
      title: 'Konsultatsiya va audit',
      description: 'Biznesingiz ehtiyojlari, savdo nuqtalari soni va jarayonlarini to‘liq tahlil qilamiz.',
    },
    {
      step: '02',
      title: 'Optimal yechim tanlash',
      description: 'Zarur dasturiy ta’minot va uskunalar smetasini byudjetingizga mos ravishda shakllantiramiz.',
    },
    {
      step: '03',
      title: 'O‘rnatish va sozlash',
      description: 'Uskunalar Toshkent bo‘yicha 24 soat ichida yetkaziladi, o‘rnatiladi va xodimlar o‘rgatiladi.',
    },
    {
      step: '04',
      title: 'Doimiy texnik ko‘mak',
      description: 'Tizim uzluksiz ishlashini ta’minlash uchun haftaning 6 kuni professional texnik yordam ko‘rsatamiz.',
    },
  ] as StepItem[],

  faqs: [
    {
      question: 'Uskunalar qanday kafolat bilan yetkazib beriladi?',
      answer:
        'Biz taqdim etayotgan barcha monobloklar, termal chek printerlar, shtrix-kod skanerlar va biometrik terminallar rasmiy 12 oylik servis kafolatiga ega.',
    },
    {
      question: 'Mavjud 1C yoki savdo dasturlarimizga ulay olasizlarmi?',
      answer:
        'Ha, biz taqdim etayotgan uskunalar va hisob-kitob botlari 1C, BILLZ, Jowi, R-Keeper, iiko hamda boshqa ommabop dasturlar bilan to‘liq mos keladi va sinovdan o‘tgan drayverlarga ega.',
    },
    {
      question: 'Buyurtma qancha vaqtda yetkazib beriladi va o‘rnatiladi?',
      answer:
        'Toshkent shahri bo‘ylab buyurtmalar tasdiqlangan kuni yoki 24 soat ichida yetkazib beriladi va mutaxassislarimiz tomonidan o‘rnatiladi. Viloyatlarga yetkazib berish 1-2 ish kuni ichida amalga oshiriladi.',
    },
    {
      question: 'Dasturiy ta’minotni uskunalar xarid qilmasdan ham buyurtma qilish mumkinmi?',
      answer:
        'Albatta. Agar sizda tayyor kompyuter va uskunalar mavjud bo‘lsa, biz faqat dasturiy ta’minot, Telegram savdo boti yoki davomat tizimini o‘rnatib sozlab beramiz.',
    },
    {
      question: 'To‘lov qanday shakllarda qabul qilinadi?',
      answer:
        'Yuridik shaxslar uchun shartnoma asosida bank o‘tkazmasi (hisobvaraq-faktura bilan), korporativ kartalar hamda Payme, Click orqali to‘lovlarni qabul qilamiz.',
    },
  ] as FaqItem[],

  hardwareCategories: [
    { slug: 'pos-terminals', nameUz: 'Monobloklar va POS terminallar', icon: 'Monitor' },
    { slug: 'receipt-printers', nameUz: 'Chek printerlar', icon: 'Printer' },
    { slug: 'barcode-scanners', nameUz: 'Shtrix-kod skanerlar', icon: 'QrCode' },
    { slug: 'cash-drawers', nameUz: 'Kassa qutilari', icon: 'Vault' },
    { slug: 'biometric-attendance', nameUz: 'Face ID va biometriya', icon: 'Fingerprint' },
    { slug: 'nfc-readers', nameUz: 'NFC o‘quvchilar va kartalar', icon: 'CreditCard' },
    { slug: 'accessories', nameUz: 'Aksessuarlar va sarf materiallari', icon: 'Layers' },
  ],
};
