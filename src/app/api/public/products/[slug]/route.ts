import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const product = await prisma.hardwareProduct.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product || !product.isPublished) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let images: string[] = [];
    let specs: Record<string, string> = {};
    let compatibility: string[] = [];

    try {
      images = JSON.parse(product.imagesJson || '[]');
    } catch (e) {}

    try {
      specs = JSON.parse(product.specsJson || '{}');
    } catch (e) {}

    try {
      compatibility = JSON.parse(product.compatJson || '[]');
    } catch (e) {}

    // Fetch related products in the same category
    const related = await prisma.hardwareProduct.findMany({
      where: {
        categorySlug: product.categorySlug,
        slug: { not: slug },
        isPublished: true,
      },
      take: 4,
      orderBy: { sortOrder: 'asc' },
    });

    const relatedFormatted = related.map((r) => {
      let rImages: string[] = [];
      try {
        rImages = JSON.parse(r.imagesJson || '[]');
      } catch (e) {}
      return {
        id: r.id,
        slug: r.slug,
        sku: r.sku,
        nameUz: r.nameUz,
        price: r.price ? Number(r.price) : null,
        priceOnRequest: r.priceOnRequest,
        currency: r.currency,
        images: rImages,
        inStock: r.inStock,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        nameUz: product.nameUz,
        nameRu: product.nameRu,
        categorySlug: product.categorySlug,
        categoryName: product.category.nameUz,
        price: product.price ? Number(product.price) : null,
        currency: product.currency,
        priceOnRequest: product.priceOnRequest,
        descriptionUz: product.descriptionUz,
        descriptionRu: product.descriptionRu,
        images,
        specs,
        compatibility,
        inStock: product.inStock,
        related: relatedFormatted,
      },
    });
  } catch (error: any) {
    console.error('Failed to get product detail:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
