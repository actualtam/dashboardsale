import { notifyOnlineOrder } from "@/lib/services/telegram";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.onlineOrder.findMany({
      include: {
        branch: true,
        customer: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      branchId,
      customerName,
      customerPhone,
      deliveryMethod = 'DELIVERY',
      deliveryAddress,
      paymentMethod = 'CASH',
      items, // array of { variantId, quantity, unitPrice }
      notes,
    } = body;

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return NextResponse.json({ error: 'Branch not found' }, { status: 404 });

    const subtotal = items.reduce((acc: number, i: any) => acc + Number(i.unitPrice) * i.quantity, 0);
    const deliveryFee = deliveryMethod === 'DELIVERY' ? 25000 : 0;
    const totalAmount = subtotal + deliveryFee;

    const count = await prisma.onlineOrder.count({ where: { businessId: branch.businessId } });
    const orderNumber = `ONL-${2026 + count + 1}`;

    const order = await prisma.onlineOrder.create({
      data: {
        businessId: branch.businessId,
        branchId,
        orderNumber,
        customerName,
        customerPhone,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'DELIVERY' ? deliveryAddress : null,
        paymentMethod,
        paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
        status: 'NEW',
        subtotal,
        deliveryFee,
        totalAmount,
        notes,
        items: {
          create: items.map((i: any) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalAmount: Number(i.unitPrice) * i.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    notifyOnlineOrder(order).catch((e) => console.error("TG order notify error:", e));
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    const updated = await prisma.onlineOrder.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
