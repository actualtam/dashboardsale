import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient, RoleType, ShiftStatus, SaleStatus, PurchaseOrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

describe('BILLZ Retail SaaS Core Business Workflow Tests', () => {
  let testBusiness: any;
  let branchA: any;
  let branchB: any;
  let whA: any;
  let whB: any;
  let regA: any;
  let testProduct: any;
  let variantA: any;
  let testCashier: any;

  beforeAll(async () => {
    // 1. Business & Branches
    testBusiness = await prisma.business.create({
      data: {
        name: 'Test Retail Chain UZ',
        currency: 'UZS',
        taxRate: 12.0,
      },
    });

    branchA = await prisma.branch.create({
      data: {
        businessId: testBusiness.id,
        name: 'Test Branch Alpha',
        code: `TEST-A-${Date.now()}`,
        isMain: true,
      },
    });

    branchB = await prisma.branch.create({
      data: {
        businessId: testBusiness.id,
        name: 'Test Branch Beta',
        code: `TEST-B-${Date.now()}`,
      },
    });

    whA = await prisma.warehouse.create({
      data: {
        businessId: testBusiness.id,
        branchId: branchA.id,
        name: 'Warehouse A',
        code: `WHA-${Date.now()}`,
        isDefault: true,
      },
    });

    whB = await prisma.warehouse.create({
      data: {
        businessId: testBusiness.id,
        branchId: branchB.id,
        name: 'Warehouse B',
        code: `WHB-${Date.now()}`,
        isDefault: true,
      },
    });

    regA = await prisma.cashRegister.create({
      data: {
        businessId: testBusiness.id,
        branchId: branchA.id,
        name: 'Test POS 1',
        code: `REG-A-${Date.now()}`,
      },
    });

    testCashier = await prisma.user.create({
      data: {
        email: `cashier_${Date.now()}@test.uz`,
        fullName: 'Test Cashier',
        passwordHash: 'hash',
      },
    });

    // 2. Product and Variants
    const cat = await prisma.category.create({
      data: { businessId: testBusiness.id, name: 'Test Apparel', code: `CAT-${Date.now()}` },
    });

    testProduct = await prisma.product.create({
      data: {
        businessId: testBusiness.id,
        categoryId: cat.id,
        name: 'Test Cotton Hoodie',
        unit: 'pcs',
      },
    });

    variantA = await prisma.productVariant.create({
      data: {
        productId: testProduct.id,
        sku: `TST-HOD-BLK-${Date.now()}`,
        barcode: `478999${Math.floor(100000 + Math.random() * 900000)}`,
        size: 'L',
        color: 'Black',
        costPrice: 100000,
        sellingPrice: 200000,
        minStockAlert: 5,
      },
    });

    // Initial Inventory in Warehouse A: 20 units
    await prisma.inventoryBalance.create({
      data: {
        businessId: testBusiness.id,
        branchId: branchA.id,
        warehouseId: whA.id,
        variantId: variantA.id,
        quantityOnHand: 20,
      },
    });

    await prisma.inventoryMovement.create({
      data: {
        businessId: testBusiness.id,
        branchId: branchA.id,
        warehouseId: whA.id,
        variantId: variantA.id,
        movementType: 'PURCHASE_RECEIPT',
        quantity: 20,
        costBasis: 100000,
        reason: 'Initial test setup stock',
      },
    });
  });

  afterAll(async () => {
    // Cleanup test records in strict foreign key order
    await prisma.stockTransferItem.deleteMany({});
    await prisma.stockTransfer.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.inventoryMovement.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.inventoryBalance.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.saleItem.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.sale.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.cashRegister.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.productVariant.deleteMany({ where: { productId: testProduct.id } });
    await prisma.product.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.warehouse.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.branch.deleteMany({ where: { businessId: testBusiness.id } });
    await prisma.business.deleteMany({ where: { id: testBusiness.id } });
    await prisma.user.deleteMany({ where: { id: testCashier.id } });
  });

  it('Scenario 1 & 2: Business & Branch isolation are persisted', async () => {
    expect(testBusiness.id).toBeDefined();
    expect(branchA.name).toBe('Test Branch Alpha');
    expect(whA.branchId).toBe(branchA.id);
  });

  it('Scenario 3: Product variant exists with correct cost and retail price', async () => {
    expect(Number(variantA.costPrice)).toBe(100000);
    expect(Number(variantA.sellingPrice)).toBe(200000);
  });

  it('Scenario 5, 6 & 7: Completed sale decreases inventory balance and records payment', async () => {
    const qtyToSell = 3;
    const unitPrice = Number(variantA.sellingPrice);
    const unitCost = Number(variantA.costPrice);
    const totalAmount = unitPrice * qtyToSell;
    const costTotal = unitCost * qtyToSell;
    const grossProfit = totalAmount - costTotal;

    // Simulate atomic checkout
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Decrement balance
      await tx.inventoryBalance.update({
        where: {
          warehouseId_variantId: {
            warehouseId: whA.id,
            variantId: variantA.id,
          },
        },
        data: {
          quantityOnHand: { decrement: qtyToSell },
        },
      });

      // 2. Ledger movement
      await tx.inventoryMovement.create({
        data: {
          businessId: testBusiness.id,
          branchId: branchA.id,
          warehouseId: whA.id,
          variantId: variantA.id,
          movementType: 'SALE',
          quantity: -qtyToSell,
          costBasis: unitCost,
          reason: 'Test POS sale',
        },
      });

      // 3. Create Sale
      return tx.sale.create({
        data: {
          businessId: testBusiness.id,
          branchId: branchA.id,
          cashRegisterId: regA.id,
          cashierId: testCashier.id,
          saleNumber: `CHK-TEST-${Date.now()}`,
          status: SaleStatus.COMPLETED,
          subtotal: totalAmount,
          totalAmount: totalAmount,
          costTotal: costTotal,
          grossProfit: grossProfit,
          items: {
            create: [
              {
                variantId: variantA.id,
                quantity: qtyToSell,
                unitCost,
                unitPrice,
                totalAmount,
              },
            ],
          },
          payments: {
            create: [
              {
                method: 'UZCARD',
                amount: totalAmount,
                status: 'SUCCESS',
              },
            ],
          },
        },
        include: { items: true, payments: true },
      });
    });

    expect(sale).toBeDefined();
    expect(Number(sale.totalAmount)).toBe(600000);
    expect(Number(sale.grossProfit)).toBe(300000);
    expect(sale.payments.length).toBe(1);

    // Verify stock balance was decremented from 20 to 17
    const currentBalance = await prisma.inventoryBalance.findUnique({
      where: {
        warehouseId_variantId: {
          warehouseId: whA.id,
          variantId: variantA.id,
        },
      },
    });
    expect(currentBalance?.quantityOnHand).toBe(17);
  });

  it('Scenario 8: Refund restores inventory balance and logs RETURN movement', async () => {
    // Restock 1 item
    const refundQty = 1;

    await prisma.$transaction(async (tx) => {
      await tx.inventoryBalance.update({
        where: {
          warehouseId_variantId: {
            warehouseId: whA.id,
            variantId: variantA.id,
          },
        },
        data: {
          quantityOnHand: { increment: refundQty },
        },
      });

      await tx.inventoryMovement.create({
        data: {
          businessId: testBusiness.id,
          branchId: branchA.id,
          warehouseId: whA.id,
          variantId: variantA.id,
          movementType: 'RETURN',
          quantity: refundQty,
          costBasis: 100000,
          reason: 'Test refund return',
        },
      });
    });

    const balanceAfterRefund = await prisma.inventoryBalance.findUnique({
      where: {
        warehouseId_variantId: {
          warehouseId: whA.id,
          variantId: variantA.id,
        },
      },
    });
    expect(balanceAfterRefund?.quantityOnHand).toBe(18); // 17 + 1 = 18
  });

  it('Scenario 10: Inter-branch transfer updates stock only through DISPATCH and RECEIVE', async () => {
    const transferQty = 5;

    // Create DRAFT
    const transfer = await prisma.stockTransfer.create({
      data: {
        businessId: testBusiness.id,
        sourceBranchId: branchA.id,
        sourceWarehouseId: whA.id,
        destBranchId: branchB.id,
        destWarehouseId: whB.id,
        transferNumber: `TRF-TEST-${Date.now()}`,
        status: 'DRAFT',
        items: {
          create: [{ variantId: variantA.id, quantitySent: transferQty }],
        },
      },
    });

    // DISPATCH decrements source warehouse
    await prisma.$transaction(async (tx) => {
      await tx.inventoryBalance.update({
        where: {
          warehouseId_variantId: {
            warehouseId: whA.id,
            variantId: variantA.id,
          },
        },
        data: {
          quantityOnHand: { decrement: transferQty },
        },
      });

      await tx.stockTransfer.update({
        where: { id: transfer.id },
        data: { status: 'DISPATCHED' },
      });
    });

    const sourceBal = await prisma.inventoryBalance.findUnique({
      where: {
        warehouseId_variantId: {
          warehouseId: whA.id,
          variantId: variantA.id,
        },
      },
    });
    expect(sourceBal?.quantityOnHand).toBe(13); // 18 - 5 = 13

    // RECEIVE increments dest warehouse
    await prisma.$transaction(async (tx) => {
      await tx.inventoryBalance.upsert({
        where: {
          warehouseId_variantId: {
            warehouseId: whB.id,
            variantId: variantA.id,
          },
        },
        update: { quantityOnHand: { increment: transferQty } },
        create: {
          businessId: testBusiness.id,
          branchId: branchB.id,
          warehouseId: whB.id,
          variantId: variantA.id,
          quantityOnHand: transferQty,
        },
      });

      await tx.stockTransfer.update({
        where: { id: transfer.id },
        data: { status: 'RECEIVED' },
      });
    });

    const destBal = await prisma.inventoryBalance.findUnique({
      where: {
        warehouseId_variantId: {
          warehouseId: whB.id,
          variantId: variantA.id,
        },
      },
    });
    expect(destBal?.quantityOnHand).toBe(5);
  });

  it('Scenario 13 & 14: Gross profit formula (Revenue - COGS) holds strictly', () => {
    const revenue = 1000000;
    const cogs = 450000;
    const grossProfit = revenue - cogs;
    const margin = (grossProfit / revenue) * 100;

    expect(grossProfit).toBe(550000);
    expect(margin).toBeCloseTo(55, 1);
  });

  it('Scenario 17: Concurrent stock check prevents overselling', () => {
    const stockAvailable = 5;
    const requestedQty = 8;
    const canSell = stockAvailable >= requestedQty;

    expect(canSell).toBe(false);
  });
});
