import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const query = searchParams.get('query')?.toLowerCase();
    const categoryId = searchParams.get('categoryId');

    // Find warehouse for this branch
    let warehouseId: string | undefined;
    if (branchId && branchId !== 'all') {
      const wh = await prisma.warehouse.findFirst({
        where: { branchId, isDefault: true },
      });
      warehouseId = wh?.id;
    }

    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(categoryId && categoryId !== 'all' ? { categoryId } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                {
                  variants: {
                    some: {
                      OR: [
                        { sku: { contains: query, mode: 'insensitive' } },
                        { barcode: { contains: query } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        brand: true,
        variants: {
          where: { active: true },
          include: {
            balances: warehouseId ? { where: { warehouseId } } : true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ products, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
