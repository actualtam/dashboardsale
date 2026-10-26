import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function cleanDb() {
  const models = [
    'auditLog', 'notification', 'onlineOrderItem', 'onlineOrder',
    'expense', 'expenseCategory', 'purchaseOrderItem', 'purchaseOrder',
    'refundItem', 'refund', 'payment', 'saleItem', 'sale',
    'cashMovement', 'cashShift', 'cashRegister', 'inventoryMovement',
    'inventoryBalance', 'stockTransferItem', 'stockTransfer',
    'stockCountItem', 'stockCount', 'productVariant', 'product',
    'brand', 'category', 'supplier', 'loyaltyTransaction',
    'customer', 'promotion', 'giftCertificate', 'integrationSetting',
    'warehouse', 'businessMembership', 'branch', 'business', 'user'
  ];

  for (const m of models) {
    if ((prisma as any)[m]) {
      await (prisma as any)[m].deleteMany({});
    }
  }
}
