import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { saleId, items, reason = 'Customer return' } = body; // items: array of { saleItemId, variantId, quantity, refundAmount, restock }

    if (!saleId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing refund data' }, { status: 400 });
    }

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        branch: {
          include: { warehouses: true },
        },
      },
    });

    if (!sale) return NextResponse.json({ error: 'Sale not found' }, { status: 404 });

    const warehouse = sale.branch.warehouses.find((w) => w.isDefault) || sale.branch.warehouses[0];
    const totalRefund = items.reduce((acc: number, item: any) => acc + Number(item.refundAmount), 0);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Restock items if eligible
      for (const item of items) {
        if (item.restock !== false) {
          await tx.inventoryBalance.update({
            where: {
              warehouseId_variantId: {
                warehouseId: warehouse.id,
                variantId: item.variantId,
              },
            },
            data: {
              quantityOnHand: { increment: item.quantity },
            },
          });

          await tx.inventoryMovement.create({
            data: {
              businessId: sale.businessId,
              branchId: sale.branchId,
              warehouseId: warehouse.id,
              variantId: item.variantId,
              movementType: 'RETURN',
              quantity: item.quantity,
              costBasis: 0,
              referenceType: 'Refund',
              reason: `Restocked return from sale ${sale.saleNumber}`,
            },
          });
        }
      }

      // 2. Create Refund record
      const count = await tx.refund.count({ where: { businessId: sale.businessId } });
      const refundNumber = `REF-${2000 + count + 1}`;

      const refund = await tx.refund.create({
        data: {
          saleId: sale.id,
          businessId: sale.businessId,
          branchId: sale.branchId,
          cashierId: sale.cashierId,
          refundNumber,
          totalRefundAmount: totalRefund,
          reason,
          items: {
            create: items.map((i: any) => ({
              saleItemId: i.saleItemId,
              variantId: i.variantId,
              quantity: i.quantity,
              unitPrice: i.refundAmount / i.quantity,
              refundAmount: i.refundAmount,
              restocked: i.restock !== false,
            })),
          },
        },
      });

      // 3. Update Sale status
      await tx.sale.update({
        where: { id: sale.id },
        data: {
          status: 'REFUNDED',
        },
      });

      return refund;
    });

    return NextResponse.json({ success: true, refund: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
