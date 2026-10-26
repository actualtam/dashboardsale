import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('query');

    const products = await prisma.product.findMany({
      where: {
        active: true,
        ...(categoryId && categoryId !== 'all' ? { categoryId } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { variants: { some: { sku: { contains: query, mode: 'insensitive' } } } },
                { variants: { some: { barcode: { contains: query } } } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        brand: true,
        supplier: true,
        variants: {
          include: {
            balances: {
              include: { warehouse: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      categoryId,
      brandId,
      supplierId,
      unit = 'pcs',
      variants, // array of { size, color, sku, barcode, costPrice, sellingPrice, minStockAlert }
    } = body;

    const business = await prisma.business.findFirst();
    if (!business) return NextResponse.json({ error: 'No business found' }, { status: 400 });

    const newProduct = await prisma.product.create({
      data: {
        businessId: business.id,
        name,
        description,
        categoryId,
        brandId: brandId || null,
        supplierId: supplierId || null,
        unit,
        variants: {
          create: variants.map((v: any) => ({
            sku: v.sku,
            barcode: v.barcode || null,
            size: v.size || 'Regular',
            color: v.color || 'Standard',
            costPrice: Number(v.costPrice),
            sellingPrice: Number(v.sellingPrice),
            minStockAlert: Number(v.minStockAlert || 5),
          })),
        },
      },
      include: {
        variants: true,
        category: true,
      },
    });

    // Populate initial 0 balances in all warehouses
    const warehouses = await prisma.warehouse.findMany({ where: { businessId: business.id } });
    for (const v of newProduct.variants) {
      for (const wh of warehouses) {
        await prisma.inventoryBalance.create({
          data: {
            businessId: business.id,
            branchId: wh.branchId,
            warehouseId: wh.id,
            variantId: v.id,
            quantityOnHand: 0,
          },
        });
      }
    }

    return NextResponse.json(newProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
