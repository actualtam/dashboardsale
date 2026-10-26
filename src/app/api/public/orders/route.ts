import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { notifyEquipmentOrder } from '@/lib/services/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, deliveryMethod, address, notes, items, totalAmount } = body;

    if (!customerName || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Ismingizni to‘liq kiriting.' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, error: 'Telefon raqamingizni to‘g‘ri kiriting.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Buyurtmada kamida bitta mahsulot bo‘lishi zarur.' },
        { status: 400 }
      );
    }

    const calculatedTotal = items.reduce((sum: number, it: any) => {
      const p = Number(it.price || 0);
      const q = Number(it.quantity || 1);
      return sum + p * q;
    }, 0);

    const finalAmount = totalAmount ? Number(totalAmount) : calculatedTotal;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `EQ-${dateStr}-${randomSuffix}`;

    const order = await prisma.equipmentOrder.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryMethod: deliveryMethod === 'PICKUP' ? 'PICKUP' : 'COURIER',
        address: address?.trim() || null,
        notes: notes?.trim() || null,
        itemsJson: JSON.stringify(items),
        totalAmount: finalAmount,
        status: 'NEW',
      },
    });

    notifyEquipmentOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      deliveryMethod: order.deliveryMethod,
      address: order.address,
      items,
      totalAmount: finalAmount,
      notes: order.notes,
    }).catch((err) => {
      console.error('Failed to dispatch Telegram equipment order notification:', err);
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      message: 'Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorimiz bog‘lanadi.',
    });
  } catch (error: any) {
    console.error('Failed to submit equipment order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
