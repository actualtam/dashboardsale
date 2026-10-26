import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const query = searchParams.get('query');
    const status = searchParams.get('status');

    const sales = await prisma.sale.findMany({
      where: {
        ...(branchId && branchId !== 'all' ? { branchId } : {}),
        ...(status ? { status: status as any } : {}),
        ...(query
          ? {
              OR: [
                { saleNumber: { contains: query, mode: 'insensitive' } },
                { customer: { fullName: { contains: query, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        branch: true,
        cashier: true,
        customer: true,
        payments: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        refunds: {
          include: { items: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(sales);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
