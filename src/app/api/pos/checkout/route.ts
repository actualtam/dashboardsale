import { notifyNewSale } from "@/lib/services/telegram";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      branchId,
      customerId,
      shiftId,
      items, // array of { variantId, quantity, unitPrice, unitCost, discountAmount }
      payments, // array of { method, amount }
      discountTotal = 0,
      notes = '',
    } = body;

    if (!branchId || !items || items.length === 0 || !payments || payments.length === 0) {
      return NextResponse.json({ error: 'Missing required checkout information' }, { status: 400 });
    }

    // Resolve branch warehouse and register
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        warehouses: true,
        cashRegisters: true,
        business: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const warehouse = branch.warehouses.find((w) => w.isDefault) || branch.warehouses[0];
    const cashRegister = branch.cashRegisters[0];

    // Calculate totals
    let calculatedSubtotal = 0;
    let calculatedCostTotal = 0;

    for (const item of items) {
      const itemTotal = Number(item.unitPrice) * item.quantity;
      const itemCost = Number(item.unitCost) * item.quantity;
      calculatedSubtotal += itemTotal;
      calculatedCostTotal += itemCost;
    }

    const totalAmount = Math.max(0, calculatedSubtotal - Number(discountTotal));
    const grossProfit = totalAmount - calculatedCostTotal;
    const taxTotal = Math.round((totalAmount * 0.12) / 1.12); // Uzbek 12% QQS

    // Execute atomic Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check stock & decrement inventory
      for (const item of items) {
        const balance = await tx.inventoryBalance.findUnique({
          where: {
            warehouseId_variantId: {
              warehouseId: warehouse.id,
              variantId: item.variantId,
            },
          },
        });

        if (!balance || balance.quantityOnHand < item.quantity) {
          throw new Error(`Insufficient stock for item ${item.variantId}. Available: ${balance?.quantityOnHand || 0}`);
        }

        // Decrement balance
        await tx.inventoryBalance.update({
          where: {
            warehouseId_variantId: {
              warehouseId: warehouse.id,
              variantId: item.variantId,
            },
          },
          data: {
            quantityOnHand: { decrement: item.quantity },
          },
        });

        // Insert inventory movement ledger record
        await tx.inventoryMovement.create({
          data: {
            businessId: branch.businessId,
            branchId: branch.id,
            warehouseId: warehouse.id,
            variantId: item.variantId,
            movementType: 'SALE',
            quantity: -item.quantity,
            costBasis: item.unitCost,
            referenceType: 'Sale',
            reason: 'POS Sale Checkout',
          },
        });
      }

      // 2. Generate unique sale receipt number
      const count = await tx.sale.count({ where: { businessId: branch.businessId } });
      const saleNumber = `CHK-${1000 + count + 1}`;

      // Pick any cashier user or fallback
      const cashier = await tx.user.findFirst();

      // 3. Create Sale Record
      const newSale = await tx.sale.create({
        data: {
          businessId: branch.businessId,
          branchId: branch.id,
          cashRegisterId: cashRegister?.id || '',
          cashierId: cashier?.id || '',
          customerId: customerId || null,
          shiftId: shiftId || null,
          saleNumber,
          status: 'COMPLETED',
          subtotal: calculatedSubtotal,
          discountTotal: Number(discountTotal),
          taxTotal,
          totalAmount,
          costTotal: calculatedCostTotal,
          grossProfit,
          notes,
          items: {
            create: items.map((i: any) => ({
              variantId: i.variantId,
              quantity: i.quantity,
              unitCost: i.unitCost,
              unitPrice: i.unitPrice,
              discountAmount: i.discountAmount || 0,
              taxAmount: Math.round(((Number(i.unitPrice) * i.quantity) * 0.12) / 1.12),
              totalAmount: Number(i.unitPrice) * i.quantity - (i.discountAmount || 0),
            })),
          },
          payments: {
            create: payments.map((p: any) => ({
              method: p.method,
              amount: p.amount,
              transactionRef: `TXN-${p.method}-${saleNumber}`,
              status: 'SUCCESS',
            })),
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
          payments: true,
          customer: true,
          branch: true,
        },
      });

      // 4. Update customer loyalty if attached
      if (customerId) {
        const pointsEarned = Math.floor(totalAmount / 50000); // 1 point per 50,000 UZS
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalSpend: { increment: totalAmount },
            totalOrders: { increment: 1 },
            currentLoyaltyPoints: { increment: pointsEarned },
          },
        });

        if (pointsEarned > 0) {
          await tx.loyaltyTransaction.create({
            data: {
              customerId,
              type: 'EARN',
              points: pointsEarned,
              saleId: newSale.id,
              notes: `Earned from purchase ${saleNumber}`,
            },
          });
        }
      }

      return newSale;
    });

    notifyNewSale(result).catch((e) => console.error("TG sale notify error:", e));
    return NextResponse.json({ success: true, sale: result });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
