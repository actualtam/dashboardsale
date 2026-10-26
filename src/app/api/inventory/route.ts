import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const tab = searchParams.get('tab') || 'balances';

    if (tab === 'movements') {
      const movements = await prisma.inventoryMovement.findMany({
        where: {
          ...(branchId && branchId !== 'all' ? { branchId } : {}),
        },
        include: {
          variant: {
            include: { product: true },
          },
          warehouse: {
            include: { branch: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return NextResponse.json(movements);
    }

    // Default: balances
    const balances = await prisma.inventoryBalance.findMany({
      where: {
        ...(branchId && branchId !== 'all' ? { branchId } : {}),
      },
      include: {
        variant: {
          include: {
            product: { include: { category: true, brand: true } },
          },
        },
        warehouse: {
          include: { branch: true },
        },
      },
      orderBy: { quantityOnHand: 'asc' },
    });

    return NextResponse.json(balances);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Adjust stock / write off
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { balanceId, newQuantity, reason = 'Inventory adjustment' } = body;

    const balance = await prisma.inventoryBalance.findUnique({
      where: { id: balanceId },
      include: { variant: true },
    });

    if (!balance) return NextResponse.json({ error: 'Balance not found' }, { status: 404 });

    const diff = Number(newQuantity) - balance.quantityOnHand;

    await prisma.$transaction([
      prisma.inventoryBalance.update({
        where: { id: balanceId },
        data: { quantityOnHand: Number(newQuantity) },
      }),
      prisma.inventoryMovement.create({
        data: {
          businessId: balance.businessId,
          branchId: balance.branchId,
          warehouseId: balance.warehouseId,
          variantId: balance.variantId,
          movementType: diff >= 0 ? 'ADJUSTMENT' : 'WRITE_OFF',
          quantity: diff,
          costBasis: balance.variant.costPrice,
          referenceType: 'ManualAdjustment',
          reason,
        },
      }),
    ]);

    return NextResponse.json({ success: true, updatedQty: newQuantity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
