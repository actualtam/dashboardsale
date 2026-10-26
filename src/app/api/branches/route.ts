import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      include: {
        warehouses: true,
        cashRegisters: true,
      },
    });
    return NextResponse.json(branches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
