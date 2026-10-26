import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const transfers = await prisma.stockTransfer.findMany({
      include: {
        sourceBranch: true,
        destBranch: true,
        sourceWarehouse: true,
        destWarehouse: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(transfers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transferId, sourceBranchId, destBranchId, items, notes } = body;

    const business = await prisma.business.findFirst();

    if (action === 'CREATE') {
      const sourceWh = await prisma.warehouse.findFirst({ where: { branchId: sourceBranchId, isDefault: true } });
      const destWh = await prisma.warehouse.findFirst({ where: { branchId: destBranchId, isDefault: true } });
      const count = await prisma.stockTransfer.count();
      const transferNumber = `TRF-${3000 + count + 1}`;

      const transfer = await prisma.stockTransfer.create({
        data: {
          businessId: business!.id,
          sourceBranchId,
          sourceWarehouseId: sourceWh!.id,
          destBranchId,
          destWarehouseId: destWh!.id,
          transferNumber,
          status: 'DRAFT',
          notes,
          items: {
            create: items.map((i: any) => ({
              variantId: i.variantId,
              quantitySent: Number(i.quantity),
            })),
          },
        },
      });

      return NextResponse.json(transfer);
    }

    if (action === 'DISPATCH') {
      const transfer = await prisma.stockTransfer.findUnique({
        where: { id: transferId },
        include: { items: true, sourceWarehouse: true },
      });

      if (!transfer || transfer.status !== 'DRAFT') {
        return NextResponse.json({ error: 'Transfer must be in DRAFT state' }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        for (const item of transfer.items) {
          await tx.inventoryBalance.update({
            where: {
              warehouseId_variantId: {
                warehouseId: transfer.sourceWarehouseId,
                variantId: item.variantId,
              },
            },
            data: {
              quantityOnHand: { decrement: item.quantitySent },
            },
          });

          await tx.inventoryMovement.create({
            data: {
              businessId: transfer.businessId,
              branchId: transfer.sourceBranchId,
              warehouseId: transfer.sourceWarehouseId,
              variantId: item.variantId,
              movementType: 'TRANSFER_DISPATCH',
              quantity: -item.quantitySent,
              costBasis: 0,
              referenceType: 'StockTransfer',
              referenceId: transfer.id,
              reason: `Dispatched transfer ${transfer.transferNumber}`,
            },
          });
        }

        await tx.stockTransfer.update({
          where: { id: transferId },
          data: {
            status: 'DISPATCHED',
            dispatchedAt: new Date(),
          },
        });
      });

      return NextResponse.json({ success: true, status: 'DISPATCHED' });
    }

    if (action === 'RECEIVE') {
      const transfer = await prisma.stockTransfer.findUnique({
        where: { id: transferId },
        include: { items: true, destWarehouse: true },
      });

      if (!transfer || transfer.status !== 'DISPATCHED') {
        return NextResponse.json({ error: 'Transfer must be in DISPATCHED state' }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        for (const item of transfer.items) {
          await tx.inventoryBalance.upsert({
            where: {
              warehouseId_variantId: {
                warehouseId: transfer.destWarehouseId,
                variantId: item.variantId,
              },
            },
            update: {
              quantityOnHand: { increment: item.quantitySent },
            },
            create: {
              businessId: transfer.businessId,
              branchId: transfer.destBranchId,
              warehouseId: transfer.destWarehouseId,
              variantId: item.variantId,
              quantityOnHand: item.quantitySent,
            },
          });

          await tx.inventoryMovement.create({
            data: {
              businessId: transfer.businessId,
              branchId: transfer.destBranchId,
              warehouseId: transfer.destWarehouseId,
              variantId: item.variantId,
              movementType: 'TRANSFER_RECEIVE',
              quantity: item.quantitySent,
              costBasis: 0,
              referenceType: 'StockTransfer',
              referenceId: transfer.id,
              reason: `Received transfer ${transfer.transferNumber}`,
            },
          });

          await tx.stockTransferItem.update({
            where: { id: item.id },
            data: { quantityReceived: item.quantitySent },
          });
        }

        await tx.stockTransfer.update({
          where: { id: transferId },
          data: {
            status: 'RECEIVED',
            receivedAt: new Date(),
          },
        });
      });

      return NextResponse.json({ success: true, status: 'RECEIVED' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
