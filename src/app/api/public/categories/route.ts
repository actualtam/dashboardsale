import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.hardwareCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    const data = categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      nameUz: cat.nameUz,
      nameRu: cat.nameRu,
      description: cat.description,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
      productCount: cat._count.products,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Failed to fetch hardware categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
