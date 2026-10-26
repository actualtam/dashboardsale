import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { notifyServiceInquiry } from '@/lib/services/telegram';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, serviceKey, businessName, message, preferredContact } = body;

    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Ismingizni to‘liq kiriting (kamida 2 harf).' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, error: 'Telefon raqamingizni to‘g‘ri kiriting.' },
        { status: 400 }
      );
    }

    // Generate unique inquiry number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inquiryNumber = `INQ-${dateStr}-${randomSuffix}`;

    // Get IP address from headers
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    const matchedService = siteConfig.services.find((s) => s.key === serviceKey);
    const serviceTitle = matchedService ? matchedService.title : (serviceKey || 'Umumiy konsultatsiya');

    const inquiry = await prisma.serviceInquiry.create({
      data: {
        inquiryNumber,
        serviceKey: serviceKey || 'general',
        customerName: customerName.trim(),
        phone: phone.trim(),
        businessName: businessName?.trim() || null,
        message: message?.trim() || null,
        preferredContact: preferredContact === 'PHONE' ? 'PHONE' : 'TELEGRAM',
        ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : null,
      },
    });

    // Notify Telegram bot in background
    notifyServiceInquiry({
      inquiryNumber: inquiry.inquiryNumber,
      serviceKey: inquiry.serviceKey,
      serviceTitle,
      customerName: inquiry.customerName,
      phone: inquiry.phone,
      businessName: inquiry.businessName,
      message: inquiry.message,
      preferredContact: inquiry.preferredContact,
    }).catch((err) => {
      console.error('Failed to send Telegram notification for inquiry:', err);
    });

    return NextResponse.json({
      success: true,
      inquiryNumber: inquiry.inquiryNumber,
      message: 'So‘rovingiz qabul qilindi. Mutaxassisimiz tez orada siz bilan bog‘lanadi!',
    });
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
