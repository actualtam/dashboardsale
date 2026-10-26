import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { slug: 'pos-terminals', nameUz: 'Monobloklar va POS terminallar', icon: 'Monitor', sortOrder: 1, description: 'Sensorli ekranli tezkor monobloklar va kassa kompyuterlari' },
  { slug: 'receipt-printers', nameUz: 'Chek printerlar', icon: 'Printer', sortOrder: 2, description: '58mm va 80mm termal tezkor chek va kvitansiya printerlari' },
  { slug: 'barcode-scanners', nameUz: 'Shtrix-kod skanerlar', icon: 'QrCode', sortOrder: 3, description: '1D va 2D QR-kod skanerlari, simli va simsiz modellar' },
  { slug: 'cash-drawers', nameUz: 'Kassa qutilari', icon: 'Vault', sortOrder: 4, description: 'Avtomat ochiluvchi metall pullar qutisi' },
  { slug: 'biometric-attendance', nameUz: 'Face ID va biometriya', icon: 'Fingerprint', sortOrder: 5, description: 'Yuzni tanish va barmoq izi orqali xodimlar davomatini hisoblash terminallari' },
  { slug: 'nfc-readers', nameUz: 'NFC o‘quvchilar va kartalar', icon: 'CreditCard', sortOrder: 6, description: 'Mijozlar kartalari, NFC o‘quvchilar va sodiqlik tizimi jihozlari' },
  { slug: 'accessories', nameUz: 'Aksessuarlar va sarf materiallari', icon: 'Layers', sortOrder: 7, description: 'Chek qog‘ozlari, ushlagichlar va kabellar' },
];

async function main() {
  console.log('Seeding Hardware Categories...');
  for (const cat of categories) {
    await prisma.hardwareCategory.upsert({
      where: { slug: cat.slug },
      update: {
        nameUz: cat.nameUz,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        description: cat.description,
      },
      create: {
        slug: cat.slug,
        nameUz: cat.nameUz,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        description: cat.description,
      },
    });
  }
  console.log('Hardware Categories Seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
