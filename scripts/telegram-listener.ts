import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8937516783:AAGX7BJSiBOQxyJXPFlu1lC45htLpLros1g';
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const FILE_BASE_URL = `https://api.telegram.org/file/bot${BOT_TOKEN}`;
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'hardware');

const BASE_DOMAIN = 'https://actualtam.github.io/dashboardsale';
const MINI_APP_URL = `${BASE_DOMAIN}/index.html`;
const MINI_APP_EQUIPMENT_URL = `${BASE_DOMAIN}/market.html`;
const SERVICE_TG_SHOP_URL = `${BASE_DOMAIN}/services-tg-shop.html`;
const SERVICE_ONLINE_URL = `${BASE_DOMAIN}/services-online-store.html`;
const SERVICE_BOTS_URL = `${BASE_DOMAIN}/services-accounting-bots.html`;
const SERVICE_ATTENDANCE_URL = `${BASE_DOMAIN}/services-attendance.html`;
const SERVICE_AI_URL = `${BASE_DOMAIN}/services-ai-cameras.html`;
const SERVICE_SETUP_URL = `${BASE_DOMAIN}/services-equipment-setup.html`;

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function setupMenuButton() {
  try {
    const res = await fetch(`${BASE_URL}/setChatMenuButton`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: '🛍️ Do‘kon',
          web_app: {
            url: MINI_APP_URL
          }
        }
      })
    });
    const data = await res.json();
    console.log('[Telegram Listener] Menu button setup result:', data);
  } catch (err) {
    console.error('[Telegram Listener] Failed to set menu button:', err);
  }
}

async function sendMessage(chatId: string | number, text: string, replyMarkup?: any) {
  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const res = await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to send TG message:', err);
  }
}

async function downloadFile(filePath: string, destFileName: string): Promise<string> {
  const url = `${FILE_BASE_URL}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download file: ${res.statusText}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const destPath = path.join(IMAGES_DIR, destFileName);
  fs.writeFileSync(destPath, buffer);
  return `/images/hardware/${destFileName}`;
}

const mainMenuMarkup = {
  inline_keyboard: [
    [
      {
        text: '⚡ DashboardSale Mini App (Bosh Sahifa)',
        web_app: { url: MINI_APP_URL }
      }
    ],
    [
      {
        text: '🛍️ Jihozlar Do‘koni (122 ta uskuna)',
        web_app: { url: MINI_APP_EQUIPMENT_URL }
      }
    ],
    [
      {
        text: '📱 TGShop (Mini App Do‘koni & Dastavka)',
        web_app: { url: SERVICE_TG_SHOP_URL }
      }
    ],
    [
      {
        text: '🌐 Savdo Veb-saytlari',
        web_app: { url: SERVICE_ONLINE_URL }
      },
      {
        text: '🤖 1C Hisobot Botlari',
        web_app: { url: SERVICE_BOTS_URL }
      }
    ],
    [
      {
        text: '👤 Face ID Davomat',
        web_app: { url: SERVICE_ATTENDANCE_URL }
      },
      {
        text: '📹 AI Videokuzatuv',
        web_app: { url: SERVICE_AI_URL }
      }
    ],
    [
      {
        text: '🛠️ Kassa Uskunalari O‘rnatish (3D)',
        web_app: { url: SERVICE_SETUP_URL }
      }
    ]
  ]
};

async function handleUpdate(update: any) {
  const msg = update.message || update.channel_post;
  if (!msg) return;

  const chatId = msg.chat?.id;
  const text = (msg.text || msg.caption || '').trim();

  // 1. If WebApp sent data back
  if (msg.web_app_data && msg.web_app_data.data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);
      await sendMessage(
        chatId,
        `🎉 <b>Yangi Buyurtmangiz Qabul Qilindi!</b>\n\n` +
        `📦 <b>Mahsulot:</b> ${data.product || 'Uskuna'}\n` +
        `💰 <b>Narxi:</b> ${data.price || 'Kelishilgan'}\n` +
        `👤 <b>Mijoz:</b> ${data.customerName || '—'}\n` +
        `📞 <b>Telefon:</b> <code>${data.customerPhone || '—'}</code>\n` +
        (data.comment ? `💬 <b>Izoh:</b> ${data.comment}\n\n` : '\n') +
        `<i>Menejerimiz tez orada siz bilan bog‘lanib, to‘lov va Toshkent bo‘ylab yoki viloyatlarga yetkazib berishni muvofiqlashtiradi. Rahmat!</i>`,
        mainMenuMarkup
      );
      return;
    } catch (err) {
      console.error('Error parsing web_app_data:', err);
    }
  }

  // 2. Start or catalog or services command
  if (text.startsWith('/start') || text.startsWith('/catalog') || text.startsWith('/services') || text.startsWith('/help')) {
    const welcomeText =
      `👋 <b>DashboardSale — Biznes texnologiyalari va kassa uskunalari Mini App do‘koniga xush kelibsiz!</b>\n\n` +
      `⚡ <b>Imkoniyatlarimiz:</b>\n` +
      `• 122+ turdagi kassa apparatlari (skanerlar, monobloklar, printerlar, tarozilar)\n` +
      `• Veb-saytlar va Telegram savdo botlari\n` +
      `• 1C buxgalteriya va kunlik tushum hisobot botlari\n` +
      `• Face ID biometrik davomat tizimlari\n` +
      `• AI videokuzatuv va gavjum zonalar xaritasi (Heatmap)\n\n` +
      `👇 <i>Pastdagi tugmani bosing va Telegram ichida to‘liq Mini App ilovamizdan foydalaning:</i>`;

    await sendMessage(chatId, welcomeText, mainMenuMarkup);
    return;
  }

  // 3. Photo upload from admin / user to add equipment
  if (msg.photo && Array.isArray(msg.photo) && msg.photo.length > 0) {
    const largestPhoto = msg.photo[msg.photo.length - 1];
    const fileId = largestPhoto.file_id;

    await sendMessage(chatId, `⏳ <i>Rasm qabul qilinmoqda va tahlil qilinmoqda...</i>`);

    try {
      const fileRes = await fetch(`${BASE_URL}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();
      if (!fileData.ok || !fileData.result?.file_path) {
        throw new Error('Telegram getFile failed');
      }

      const ext = path.extname(fileData.result.file_path) || '.jpg';
      const fileName = `hardware_${Date.now()}_${largestPhoto.file_unique_id}${ext}`;
      const publicPath = await downloadFile(fileData.result.file_path, fileName);

      console.log(`[Telegram Listener] Photo downloaded to: ${publicPath}`);

      let categorySlug = 'pos-terminals';
      let nameUz = 'Sensorli POS Monoblok';
      let sku = `DS-${Date.now().toString().slice(-6)}`;
      let description = text || 'Professional kassa va savdo uskunasi.';

      const lower = text.toLowerCase();
      if (lower.includes('skaner') || lower.includes('scanner') || lower.includes('shtrix')) {
        categorySlug = 'barcode-scanners';
        nameUz = 'Shtrix-kod va QR skaner';
      } else if (lower.includes('printer') || lower.includes('chek') || lower.includes('чек')) {
        categorySlug = 'receipt-printers';
        nameUz = 'Termal Chek Printeri';
      } else if (lower.includes('quti') || lower.includes('kassa') || lower.includes('drawer')) {
        categorySlug = 'cash-drawers';
        nameUz = 'Avtomatik metall kassa qutisi';
      } else if (lower.includes('face') || lower.includes('davomat') || lower.includes('biometriya')) {
        categorySlug = 'biometric-attendance';
        nameUz = 'Face ID Davomat Terminali';
      }

      const priceMatch = text.match(/(\d[\d\s.,]{3,})\s*(so'?m|uzs|sum|\$)/i);
      let price = null;
      let priceOnRequest = true;
      if (priceMatch) {
        const num = parseFloat(priceMatch[1].replace(/[\s.,]/g, ''));
        if (!isNaN(num) && num > 0) {
          price = num;
          priceOnRequest = false;
        }
      }

      const slug = `${categorySlug}-${Date.now().toString().slice(-6)}`;

      const product = await prisma.hardwareProduct.create({
        data: {
          slug,
          sku,
          nameUz: text ? text.split('\n')[0].slice(0, 100) : nameUz,
          categorySlug,
          price,
          priceOnRequest,
          descriptionUz: description,
          imagesJson: JSON.stringify([publicPath]),
          specsJson: JSON.stringify({
            'Qabul qilingan sana': new Date().toLocaleDateString('uz-UZ'),
            'Holati': 'Yangi, rasmiy kafolat bilan',
          }),
          compatJson: JSON.stringify(['1C:Korxona', 'BILLZ', 'Jowi', 'R-Keeper']),
          inStock: true,
          isPublished: true,
        },
      });

      await sendMessage(
        chatId,
        `✅ <b>Rasm saqlandi va katalogga qo‘shildi!</b>\n\n` +
        `📦 <b>Nomi:</b> ${product.nameUz}\n` +
        `🏷️ <b>Kategoriya:</b> ${categorySlug}\n` +
        `🔢 <b>Artikul (SKU):</b> <code>${product.sku}</code>\n` +
        `💰 <b>Narxi:</b> ${price ? price.toLocaleString() + ' UZS' : 'So‘rov bo‘yicha'}\n\n` +
        `🛒 <i>Mini App orqali ko‘rish uchun pastdagi tugmani bosing:</i>`,
        mainMenuMarkup
      );
    } catch (err: any) {
      console.error('[Telegram Listener] Error processing photo:', err);
      await sendMessage(chatId, `❌ Rasmni yuklab olishda xatolik yuz berdi: ${err.message}`);
    }
    return;
  }

  // 4. Any other text message -> reply with Mini App menu
  await sendMessage(
    chatId,
    `Salom! Biznesingiz uchun zarur barcha kassa uskunalari va IT xizmatlarini bizning <b>Telegram Mini App</b> orqali ko‘rishingiz va xarid qilishingiz mumkin:\n\n` +
    `👇 <b>Quyidagi tugmalardan birini tanlang:</b>`,
    mainMenuMarkup
  );
}

async function poll() {
  let offset = 0;
  console.log(`[Telegram Listener] Starting polling for @dashboardsalevvbot with Mini App integration...`);
  await setupMenuButton();

  while (true) {
    try {
      const res = await fetch(`${BASE_URL}/getUpdates?offset=${offset}&timeout=15`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (err) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

poll().catch(console.error);
