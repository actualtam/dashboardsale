import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'barcode-scanners', nameUz: 'Shtrix-kod skanerlari (Statsionar va Qo‘l)', sortOrder: 1 },
  { slug: 'pos-terminals', nameUz: 'Sensorli POS Monobloklar', sortOrder: 2 },
  { slug: 'receipt-printers', nameUz: 'Chek va Barkod printerlari', sortOrder: 3 },
  { slug: 'cash-drawers', nameUz: 'Kassa tortmalari (Pul qutilari)', sortOrder: 4 },
  { slug: 'scales', nameUz: 'Elektron savdo tarozilari', sortOrder: 5 },
  { slug: 'anti-theft', nameUz: 'Antikraj (O‘g‘rilikka qarshi) tizimlari', sortOrder: 6 },
  { slug: 'interactive-screens', nameUz: 'Interaktiv doskalar va ekranlar', sortOrder: 7 },
  { slug: 'call-systems', nameUz: 'Mijoz va xodim chaqiruv tizimlari', sortOrder: 8 },
  { slug: 'accessories', nameUz: 'Aksessuarlar, lenta va sarf materiallari', sortOrder: 9 },
  { slug: 'biometric-attendance', nameUz: 'Face ID va Biometrik davomat', sortOrder: 10 },
  { slug: 'nfc-readers', nameUz: 'NFC va RFID o‘quvchilar', sortOrder: 11 },
];

function mapCategory(rawCat: string = ''): string {
  const cat = rawCat.toLowerCase();
  if (cat.includes('skaner')) return 'barcode-scanners';
  if (cat.includes('monoblok')) return 'pos-terminals';
  if (cat.includes('printer')) return 'receipt-printers';
  if (cat.includes('pul qutisi')) return 'cash-drawers';
  if (cat.includes('taroz')) return 'scales';
  if (cat.includes('antikraj')) return 'anti-theft';
  if (cat.includes('interaktiv') || cat.includes('stend') || cat.includes('planshet')) return 'interactive-screens';
  if (cat.includes('chaqir')) return 'call-systems';
  return 'accessories';
}

function parseSpecs(desc: string = '') {
  const specs: Record<string, string> = {};
  const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
  let count = 1;
  for (const line of lines) {
    if (line.includes(':')) {
      const [k, ...v] = line.split(':');
      specs[k.replace(/^[0-9.\-⚙️\s]+/, '').trim()] = v.join(':').trim();
    } else if (line.length > 5 && line.length < 80) {
      specs[`Xususiyat ${count++}`] = line.replace(/^[0-9.\-⚙️\s]+/, '').trim();
    }
  }
  if (Object.keys(specs).length === 0) {
    specs['Tavsif'] = 'Rasmiy 1 yil kafolat, Toshkent omboridan bepul yetkazib berish va o‘rnatish.';
  }
  return specs;
}

async function main() {
  console.log('Seeding hardware categories...');
  for (const c of CATEGORIES) {
    await prisma.hardwareCategory.upsert({
      where: { slug: c.slug },
      update: { nameUz: c.nameUz, sortOrder: c.sortOrder },
      create: { slug: c.slug, nameUz: c.nameUz, sortOrder: c.sortOrder },
    });
  }

  const raw = fs.readFileSync(path.join(process.cwd(), 'all_scraped_products.json'), 'utf-8');
  const products = JSON.parse(raw);

  console.log(`Importing ${products.length} products into PostgreSQL...`);
  let count = 0;

  for (const p of products) {
    const rawSku = (p.sku || p.name || `PROD-${count}`).toString().trim();
    const cleanSku = rawSku.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40) || `SKU-${Date.now()}-${count}`;
    const slugBase = (p.name || cleanSku).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
    const slug = `${slugBase}-${cleanSku.slice(-6).toLowerCase()}`;
    
    const priceVal = p.offers?.price ? parseFloat(p.offers.price) : null;
    const catSlug = mapCategory(p.category);
    const specs = parseSpecs(p.description || '');

    const images = Array.isArray(p.local_images) && p.local_images.length > 0 
      ? p.local_images 
      : (Array.isArray(p.image) ? p.image : []);

    try {
      await prisma.hardwareProduct.upsert({
        where: { sku: cleanSku },
        update: {
          nameUz: p.name || 'Savdo uskunasi',
          categorySlug: catSlug,
          price: priceVal,
          priceOnRequest: priceVal === null || priceVal <= 0,
          descriptionUz: p.description || 'Professional savdo va servis uskunasi.',
          imagesJson: JSON.stringify(images),
          specsJson: JSON.stringify(specs),
          compatJson: JSON.stringify(['1C:Korxona', 'BILLZ', 'Jowi', 'R-Keeper', 'DashboardSale POS']),
          inStock: true,
          isPublished: true,
        },
        create: {
          slug,
          sku: cleanSku,
          nameUz: p.name || 'Savdo uskunasi',
          categorySlug: catSlug,
          price: priceVal,
          priceOnRequest: priceVal === null || priceVal <= 0,
          descriptionUz: p.description || 'Professional savdo va servis uskunasi.',
          imagesJson: JSON.stringify(images),
          specsJson: JSON.stringify(specs),
          compatJson: JSON.stringify(['1C:Korxona', 'BILLZ', 'Jowi', 'R-Keeper', 'DashboardSale POS']),
          inStock: true,
          isPublished: true,
        },
      });
      count++;
    } catch (err: any) {
      console.error(`Error importing ${p.name}:`, err.message);
    }
  }

  console.log(`Successfully imported ${count} hardware products!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
