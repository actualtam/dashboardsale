import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY || 'dashboardsale-admin-secret-2026';
  const headerKey = request.headers.get('x-admin-api-key') || request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');

  if (headerKey && headerKey === adminKey) return true;
  if (authHeader && authHeader.replace('Bearer ', '') === adminKey) return true;

  // In local test environments without specific header, allow if in development
  if (process.env.NODE_ENV === 'development' && !process.env.STRICT_ADMIN_AUTH) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid admin key' }, { status: 401 });
  }

  try {
    const products = await prisma.hardwareProduct.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid admin key' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug,
      sku,
      nameUz,
      nameRu,
      categorySlug,
      price,
      currency,
      priceOnRequest,
      descriptionUz,
      descriptionRu,
      images,
      specs,
      compatibility,
      inStock,
      isPublished,
      sortOrder,
    } = body;

    if (!slug || !sku || !nameUz || !categorySlug) {
      return NextResponse.json(
        { success: false, error: 'slug, sku, nameUz, and categorySlug are required' },
        { status: 400 }
      );
    }

    // Ensure category exists
    const category = await prisma.hardwareCategory.findUnique({
      where: { slug: categorySlug },
    });
    if (!category) {
      return NextResponse.json(
        { success: false, error: `Category slug '${categorySlug}' does not exist` },
        { status: 400 }
      );
    }

    const imagesJson = Array.isArray(images) ? JSON.stringify(images) : typeof images === 'string' ? images : '[]';
    const specsJson = typeof specs === 'object' ? JSON.stringify(specs) : typeof specs === 'string' ? specs : '{}';
    const compatJson = Array.isArray(compatibility) ? JSON.stringify(compatibility) : typeof compatibility === 'string' ? compatibility : '[]';

    const product = await prisma.hardwareProduct.upsert({
      where: { sku },
      update: {
        slug,
        nameUz,
        nameRu: nameRu || null,
        categorySlug,
        price: price !== undefined && price !== null ? Number(price) : null,
        currency: currency || 'UZS',
        priceOnRequest: Boolean(priceOnRequest),
        descriptionUz: descriptionUz || '',
        descriptionRu: descriptionRu || null,
        imagesJson,
        specsJson,
        compatJson,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
      },
      create: {
        slug,
        sku,
        nameUz,
        nameRu: nameRu || null,
        categorySlug,
        price: price !== undefined && price !== null ? Number(price) : null,
        currency: currency || 'UZS',
        priceOnRequest: Boolean(priceOnRequest),
        descriptionUz: descriptionUz || '',
        descriptionRu: descriptionRu || null,
        imagesJson,
        specsJson,
        compatJson,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Product upserted successfully',
      data: product,
    });
  } catch (error: any) {
    console.error('Failed to create/update product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
