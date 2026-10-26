import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const inStock = searchParams.get('inStock');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (inStock === 'true') {
      where.inStock = true;
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { nameUz: { contains: q, mode: 'insensitive' } },
        { nameRu: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { descriptionUz: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.hardwareProduct.count({ where }),
      prisma.hardwareProduct.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          category: {
            select: {
              slug: true,
              nameUz: true,
              nameRu: true,
            },
          },
        },
      }),
    ]);

    const data = products.map((p) => {
      let images: string[] = [];
      let specs: Record<string, string> = {};
      let compatibility: string[] = [];

      try {
        images = JSON.parse(p.imagesJson || '[]');
      } catch (e) {}

      try {
        specs = JSON.parse(p.specsJson || '{}');
      } catch (e) {}

      try {
        compatibility = JSON.parse(p.compatJson || '[]');
      } catch (e) {}

      return {
        id: p.id,
        slug: p.slug,
        sku: p.sku,
        nameUz: p.nameUz,
        nameRu: p.nameRu,
        categorySlug: p.categorySlug,
        categoryName: p.category?.nameUz || p.categorySlug,
        price: p.price ? Number(p.price) : null,
        currency: p.currency,
        priceOnRequest: p.priceOnRequest,
        descriptionUz: p.descriptionUz,
        descriptionRu: p.descriptionRu,
        images,
        specs,
        compatibility,
        inStock: p.inStock,
        isPublished: p.isPublished,
        createdAt: p.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      data,
    });
  } catch (error: any) {
    console.error('Failed to list products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
