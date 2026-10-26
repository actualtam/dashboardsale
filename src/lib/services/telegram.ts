import { prisma } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/formatters';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8937516783:AAGX7BJSiBOQxyJXPFlu1lC45htLpLros1g';
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function getBotInfo() {
  try {
    const res = await fetch(`${BASE_URL}/getMe`);
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('Failed to get Telegram bot info:', err);
    return null;
  }
}

export async function getBotUpdates() {
  try {
    const res = await fetch(`${BASE_URL}/getUpdates`);
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.error('Failed to get Telegram updates:', err);
    return [];
  }
}

export async function resolveChatId(customChatId?: string): Promise<string | null> {
  if (customChatId) return customChatId;
  if (process.env.TELEGRAM_CHAT_ID) return process.env.TELEGRAM_CHAT_ID;

  try {
    const setting = await prisma.integrationSetting.findFirst({
      where: { provider: 'TELEGRAM', enabled: true },
    });
    if (setting) {
      const config = JSON.parse(setting.configJson || '{}');
      if (config.channelId || config.chatId) {
        return config.channelId || config.chatId;
      }
    }
  } catch (e) {
    // silent
  }

  // Check recent updates to find last user chat ID
  try {
    const updates = await getBotUpdates();
    if (updates.length > 0) {
      const lastUpdate = updates[updates.length - 1];
      const chatId = lastUpdate.message?.chat?.id || lastUpdate.channel_post?.chat?.id;
      if (chatId) return String(chatId);
    }
  } catch (e) {
    // silent
  }

  return null;
}

export async function sendTelegramMessage(text: string, customChatId?: string) {
  try {
    const chatId = await resolveChatId(customChatId);
    if (!chatId) {
      console.log('ℹ️ Telegram message prepared but no active chat ID set yet:', text.substring(0, 60));
      return { success: false, reason: 'No chat ID configured yet' };
    }

    const res = await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    return { success: data.ok, result: data.result, error: data.description };
  } catch (err: any) {
    console.error('Telegram send error:', err);
    return { success: false, error: err.message };
  }
}

export async function notifyNewSale(sale: any) {
  const tender = sale.payments?.[0]?.method || 'CASH';
  const total = formatCurrency(sale.totalAmount);
  const itemsCount = sale.items?.length || 0;

  const msg = [
    `⚡ <b>DashboardSale — New POS Sale</b>`,
    `🧾 <b>Receipt:</b> <code>#${sale.saleNumber}</code>`,
    `📍 <b>Location:</b> ${sale.branch?.name || 'Main Branch'}`,
    `💰 <b>Amount:</b> <b>${total}</b>`,
    `💳 <b>Tender:</b> <code>${tender}</code>`,
    `📦 <b>Items:</b> ${itemsCount} line item(s)`,
    `⏰ <i>${formatDate(sale.createdAt)}</i>`,
  ].join('\n');

  return sendTelegramMessage(msg);
}

export async function notifyOnlineOrder(order: any) {
  const total = formatCurrency(order.totalAmount);
  const msg = [
    `🛍️ <b>DashboardSale — New Online Order!</b>`,
    `🏷️ <b>Order Number:</b> <code>#${order.orderNumber}</code>`,
    `👤 <b>Customer:</b> ${order.customerName} (${order.customerPhone})`,
    `🚚 <b>Fulfillment:</b> ${order.deliveryMethod} ${order.deliveryAddress ? `(${order.deliveryAddress})` : ''}`,
    `💰 <b>Total Due:</b> <b>${total}</b>`,
    `💳 <b>Payment:</b> ${order.paymentMethod} (${order.paymentStatus})`,
    `📦 <b>Pipeline Status:</b> <code>${order.status}</code>`,
  ].join('\n');

  return sendTelegramMessage(msg);
}

export async function notifyShiftClose(shift: any) {
  const diff = Number(shift.cashDifference || 0);
  const diffText = diff === 0 ? 'Exact match (0 discrepancy)' : formatCurrency(diff);
  const msg = [
    `💼 <b>DashboardSale — Cash Register Shift Closed</b>`,
    `📍 <b>Branch:</b> ${shift.branch?.name}`,
    `👤 <b>Cashier:</b> ${shift.cashier?.fullName || 'Cashier'}`,
    `💵 <b>Drawer Closing Cash:</b> ${formatCurrency(shift.closingCash)}`,
    `⚖️ <b>Discrepancy:</b> ${diffText}`,
    `⏰ <i>${formatDate(shift.closedAt)}</i>`,
  ].join('\n');

  return sendTelegramMessage(msg);
}

export async function notifyServiceInquiry(inquiry: {
  inquiryNumber: string;
  serviceKey: string;
  serviceTitle?: string;
  customerName: string;
  phone: string;
  businessName?: string | null;
  message?: string | null;
  preferredContact?: string;
}) {
  const cleanPhone = inquiry.phone.replace(/[^0-9+]/g, '');
  const lines = [
    `📋 <b>Yangi xizmat so‘rovi:</b> <code>#${inquiry.inquiryNumber}</code>`,
    `🏷️ <b>Xizmat:</b> ${inquiry.serviceTitle || inquiry.serviceKey}`,
    `👤 <b>Mijoz:</b> ${inquiry.customerName}`,
    `📞 <b>Telefon:</b> <a href="tel:${cleanPhone}">${inquiry.phone}</a>`,
  ];

  if (inquiry.businessName) {
    lines.push(`🏢 <b>Korxona:</b> ${inquiry.businessName}`);
  }
  if (inquiry.message) {
    lines.push(`💬 <b>Izoh / Talab:</b> ${inquiry.message}`);
  }
  if (inquiry.preferredContact) {
    lines.push(`📲 <b>Afzal ko‘rilgan aloqa:</b> ${inquiry.preferredContact}`);
  }
  lines.push(`⏰ <i>${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</i>`);

  return sendTelegramMessage(lines.join('\n'));
}

export async function notifyEquipmentOrder(order: {
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryMethod: string;
  address?: string | null;
  items: Array<{ name: string; quantity: number; price?: number; sku?: string }>;
  totalAmount: number;
  notes?: string | null;
}) {
  const cleanPhone = order.phone.replace(/[^0-9+]/g, '');
  const itemsText = order.items
    .map((item) => `  • ${item.name} (${item.quantity} dona)${item.price ? ` — ${formatCurrency(item.price * item.quantity)}` : ''}`)
    .join('\n');

  const lines = [
    `🛒 <b>Yangi uskuna buyurtmasi:</b> <code>#${order.orderNumber}</code>`,
    `👤 <b>Xaridor:</b> ${order.customerName}`,
    `📞 <b>Telefon:</b> <a href="tel:${cleanPhone}">${order.phone}</a>`,
    `🚚 <b>Yetkazib berish:</b> ${order.deliveryMethod === 'COURIER' ? 'Kuryer orqali' : 'Olib ketish (Samovivoz)'}`,
  ];

  if (order.address) {
    lines.push(`📍 <b>Manzil:</b> ${order.address}`);
  }
  if (order.items && order.items.length > 0) {
    lines.push(`📦 <b>Mahsulotlar:</b>\n${itemsText}`);
  }
  lines.push(`💰 <b>Jami summa:</b> <b>${formatCurrency(order.totalAmount)}</b>`);
  if (order.notes) {
    lines.push(`📝 <b>Qo‘shimcha izoh:</b> ${order.notes}`);
  }
  lines.push(`⏰ <i>${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</i>`);

  return sendTelegramMessage(lines.join('\n'));
}

