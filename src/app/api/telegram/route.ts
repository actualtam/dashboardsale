import { NextRequest, NextResponse } from 'next/server';
import { getBotInfo, getBotUpdates, sendTelegramMessage } from '@/lib/services/telegram';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const botInfo = await getBotInfo();
    const updates = await getBotUpdates();

    const setting = await prisma.integrationSetting.findFirst({
      where: { provider: 'TELEGRAM' },
    });

    const config = JSON.parse(setting?.configJson || '{}');

    return NextResponse.json({
      connected: !!botInfo,
      botInfo,
      configuredChatId: config.channelId || config.chatId || process.env.TELEGRAM_CHAT_ID || '',
      recentUpdatesCount: updates.length,
      recentChats: updates.map((u: any) => ({
        chatId: u.message?.chat?.id || u.channel_post?.chat?.id,
        title: u.message?.chat?.title || u.message?.chat?.first_name || 'Direct Chat',
        username: u.message?.chat?.username || '',
        text: u.message?.text || '',
        date: u.message?.date,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, chatId, message } = body;

    const business = await prisma.business.findFirst();

    if (action === 'SAVE_CHAT_ID') {
      await prisma.integrationSetting.upsert({
        where: {
          businessId_provider: {
            businessId: business!.id,
            provider: 'TELEGRAM',
          },
        },
        update: {
          enabled: true,
          configJson: JSON.stringify({
            botToken: process.env.TELEGRAM_BOT_TOKEN || '8937516783:AAFXSPk-sTL17Kt_3YD93vTszdvmC9mi_Uw',
            chatId,
            channelId: chatId,
            notifySales: true,
            notifyShifts: true,
            notifyOrders: true,
          }),
        },
        create: {
          businessId: business!.id,
          provider: 'TELEGRAM',
          enabled: true,
          configJson: JSON.stringify({
            botToken: process.env.TELEGRAM_BOT_TOKEN || '8937516783:AAFXSPk-sTL17Kt_3YD93vTszdvmC9mi_Uw',
            chatId,
            channelId: chatId,
            notifySales: true,
            notifyShifts: true,
            notifyOrders: true,
          }),
        },
      });

      return NextResponse.json({ success: true, savedChatId: chatId });
    }

    if (action === 'SEND_TEST') {
      const text = message || `✨ <b>DashboardSale Test Notification</b>\nConnected successfully to Telegram Bot <code>@dashboardsalevvbot</code>.\n\nAll real POS sales, shift closings, and online orders will dispatch to this channel!`;
      const result = await sendTelegramMessage(text, chatId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
