import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    const customers = await prisma.customer.findMany({
      where: query
        ? {
            OR: [
              { fullName: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {},
      include: {
        sales: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { totalSpend: 'desc' },
    });

    return NextResponse.json(customers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, address, segment = 'REGULAR' } = body;

    const business = await prisma.business.findFirst();

    const customer = await prisma.customer.create({
      data: {
        businessId: business!.id,
        fullName,
        phone,
        email,
        address,
        segment,
      },
    });

    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
