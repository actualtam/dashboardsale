import { PrismaClient, RoleType, ShiftStatus, SaleStatus, PurchaseOrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning up database ---');
  const { cleanDb } = await import("./cleanup"); await cleanDb();

  console.log('--- Creating Users ---');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  const owner = await prisma.user.create({
    data: {
      email: 'admin@billz-retail.uz',
      fullName: 'Temur Alimov',
      phone: '+998901234567',
      passwordHash,
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@billz-retail.uz',
      fullName: 'Nodira Karimova',
      phone: '+998912345678',
      passwordHash: await bcrypt.hash('manager123', salt),
    },
  });

  const cashier = await prisma.user.create({
    data: {
      email: 'cashier@billz-retail.uz',
      fullName: 'Jasur Bekmirzaev',
      phone: '+998933456789',
      passwordHash: await bcrypt.hash('cashier123', salt),
    },
  });

  const accountant = await prisma.user.create({
    data: {
      email: 'accountant@billz-retail.uz',
      fullName: 'Madina Umarova',
      phone: '+998974567890',
      passwordHash: await bcrypt.hash('accountant123', salt),
    },
  });

  console.log('--- Creating Business & Branches ---');
  const business = await prisma.business.create({
    data: {
      name: 'Tashkent Retail Hub',
      legalName: 'Tashkent Retail Hub LLC',
      taxId: '308945201',
      currency: 'UZS',
      timezone: 'Asia/Tashkent',
      phone: '+998712001122',
      email: 'contact@billz-retail.uz',
      address: 'Tashkent, Chilanzar 12, Bunyodkor Ave 45',
      taxRate: 12.0,
    },
  });

  const branchChilanzar = await prisma.branch.create({
    data: {
      businessId: business.id,
      name: 'Chilanzar Store',
      code: 'CHIL-01',
      address: 'Bunyodkor Ave 45, Chilanzar District, Tashkent',
      phone: '+998712001123',
      managerName: 'Nodira Karimova',
      isMain: true,
    },
  });

  const branchAmirTimur = await prisma.branch.create({
    data: {
      businessId: business.id,
      name: 'Amir Timur Store',
      code: 'ATIM-02',
      address: 'Amir Timur St 108, Mirabad District, Tashkent',
      phone: '+998712001124',
      managerName: 'Sardor Rakhimov',
    },
  });

  const branchSamarkand = await prisma.branch.create({
    data: {
      businessId: business.id,
      name: 'Samarkand Flagship',
      code: 'SAM-03',
      address: 'University Boulevard 15, Samarkand',
      phone: '+998662304455',
      managerName: 'Shokhrukh Mirzayev',
    },
  });

  // Assign memberships
  await prisma.businessMembership.createMany({
    data: [
      { businessId: business.id, userId: owner.id, role: RoleType.OWNER, defaultBranchId: branchChilanzar.id },
      { businessId: business.id, userId: manager.id, role: RoleType.BRANCH_MANAGER, defaultBranchId: branchChilanzar.id },
      { businessId: business.id, userId: cashier.id, role: RoleType.CASHIER, defaultBranchId: branchChilanzar.id },
      { businessId: business.id, userId: accountant.id, role: RoleType.ACCOUNTANT, defaultBranchId: branchChilanzar.id },
    ],
  });

  console.log('--- Creating Warehouses & Registers ---');
  const whChilanzar = await prisma.warehouse.create({
    data: {
      businessId: business.id,
      branchId: branchChilanzar.id,
      name: 'Chilanzar Main Warehouse',
      code: 'WH-CHIL',
      isDefault: true,
    },
  });

  const whAmirTimur = await prisma.warehouse.create({
    data: {
      businessId: business.id,
      branchId: branchAmirTimur.id,
      name: 'Amir Timur Stockroom',
      code: 'WH-ATIM',
      isDefault: true,
    },
  });

  const whSamarkand = await prisma.warehouse.create({
    data: {
      businessId: business.id,
      branchId: branchSamarkand.id,
      name: 'Samarkand Depot',
      code: 'WH-SAM',
      isDefault: true,
    },
  });

  const regChilanzar1 = await prisma.cashRegister.create({
    data: {
      businessId: business.id,
      branchId: branchChilanzar.id,
      name: 'Chilanzar POS 1 (Main Checkout)',
      code: 'POS-01',
    },
  });

  const regChilanzar2 = await prisma.cashRegister.create({
    data: {
      businessId: business.id,
      branchId: branchChilanzar.id,
      name: 'Chilanzar POS 2 (Express)',
      code: 'POS-02',
    },
  });

  const regAmirTimur1 = await prisma.cashRegister.create({
    data: {
      businessId: business.id,
      branchId: branchAmirTimur.id,
      name: 'Amir Timur POS 1',
      code: 'POS-AT-01',
    },
  });

  // Open shift for Cashier
  const openShift = await prisma.cashShift.create({
    data: {
      businessId: business.id,
      branchId: branchChilanzar.id,
      cashRegisterId: regChilanzar1.id,
      cashierId: cashier.id,
      openingCash: 500000, // 500,000 UZS starting cash float
      status: ShiftStatus.OPEN,
      notes: 'Morning shift started on time',
    },
  });

  console.log('--- Creating Categories, Brands, Suppliers ---');
  const catApparel = await prisma.category.create({
    data: { businessId: business.id, name: 'Clothing & Footwear', code: 'APP' },
  });
  const catElectronics = await prisma.category.create({
    data: { businessId: business.id, name: 'Electronics & Gadgets', code: 'ELEC' },
  });
  const catCosmetics = await prisma.category.create({
    data: { businessId: business.id, name: 'Beauty & Cosmetics', code: 'BEAUTY' },
  });
  const catGrocery = await prisma.category.create({
    data: { businessId: business.id, name: 'Gourmet & Coffee', code: 'GROC' },
  });

  const brandZara = await prisma.brand.create({ data: { businessId: business.id, name: 'Terra Pro' } });
  const brandSamsung = await prisma.brand.create({ data: { businessId: business.id, name: 'Anker' } });
  const brandLoreal = await prisma.brand.create({ data: { businessId: business.id, name: "L'Oreal" } });
  const brandCoffee = await prisma.brand.create({ data: { businessId: business.id, name: 'Coffee Roasters UZ' } });

  const supTextile = await prisma.supplier.create({
    data: {
      businessId: business.id,
      name: 'Textile Distribution LLC',
      contactPerson: 'Farrukh Sharipov',
      phone: '+998909876543',
      email: 'textile@supplier.uz',
      taxId: '304958102',
      address: 'Tashkent, Sergeli Industrial Zone',
      currentBalance: 12500000,
    },
  });

  const supTech = await prisma.supplier.create({
    data: {
      businessId: business.id,
      name: 'Global Electronics Import',
      contactPerson: 'Bobur Mansurov',
      phone: '+998918765432',
      email: 'tech@supplier.uz',
      taxId: '307892114',
      address: 'Tashkent, Shaykhontokhur St 12',
      currentBalance: 24000000,
    },
  });

  console.log('--- Generating 100+ Products and Variants ---');
  const variantsToSeed: any[] = [];
  let barcodeCounter = 478000100001;

  // 1. Apparel: 8 Products x 8 variants = 64 variants
  const apparelItems = [
    { name: 'Classic Oxford Cotton Shirt', prefix: 'SHIRT-OXF', cost: 110000, price: 240000 },
    { name: 'Slim Fit Denim Jeans', prefix: 'JEANS-SLM', cost: 140000, price: 320000 },
    { name: 'Premium Heavyweight Hoodie', prefix: 'HOOD-PRM', cost: 160000, price: 380000 },
    { name: 'Casual Crewneck T-Shirt', prefix: 'TSH-CREW', cost: 55000, price: 130000 },
    { name: 'Water-Resistant Windbreaker Jacket', prefix: 'JCKT-WND', cost: 220000, price: 490000 },
    { name: 'Urban Leather Sneakers', prefix: 'SNKR-URB', cost: 250000, price: 580000 },
    { name: 'Chino Stretch Pants', prefix: 'CHIN-STR', cost: 130000, price: 290000 },
    { name: 'Merino Wool Knit Sweater', prefix: 'SWTR-WOL', cost: 180000, price: 420000 },
  ];

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Navy', 'Olive'];

  for (const item of apparelItems) {
    const product = await prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: catApparel.id,
        brandId: brandZara.id,
        supplierId: supTextile.id,
        name: item.name,
        description: `High-quality retail apparel crafted for modern daily wear.`,
        unit: 'pcs',
        taxRate: 12.0,
      },
    });

    for (const size of sizes) {
      for (const color of colors) {
        variantsToSeed.push({
          productId: product.id,
          sku: `${item.prefix}-${color.substring(0, 3).toUpperCase()}-${size}`,
          barcode: String(barcodeCounter++),
          size,
          color,
          costPrice: item.cost,
          sellingPrice: item.price,
          minStockAlert: 5,
        });
      }
    }
  }

  // 2. Electronics: 6 Products x 4 variants = 24 variants
  const techItems = [
    { name: 'Anker PowerCore 20000mAh Power Bank', prefix: 'ANK-PB-20', cost: 240000, price: 450000, colors: ['Black', 'White'] },
    { name: 'Soundcore Wireless Bluetooth Earbuds', prefix: 'ANK-EAR-TWS', cost: 310000, price: 620000, colors: ['Black', 'White', 'Navy'] },
    { name: 'USB-C GaN 65W Fast Wall Charger', prefix: 'CHG-GAN-65', cost: 120000, price: 260000, colors: ['White', 'Black'] },
    { name: 'Braided Nylon Lightning / Type-C Cable', prefix: 'CBL-BRD-2M', cost: 35000, price: 85000, colors: ['Red', 'Black', 'Silver'] },
    { name: 'Magnetic Car Mount Wireless Charger', prefix: 'MNT-WRL-15', cost: 95000, price: 210000, colors: ['Black', 'Grey'] },
    { name: 'Surge Protector 6-Outlet Power Strip', prefix: 'PWR-STP-6O', cost: 110000, price: 230000, colors: ['White', 'Black'] },
  ];

  for (const item of techItems) {
    const product = await prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: catElectronics.id,
        brandId: brandSamsung.id,
        supplierId: supTech.id,
        name: item.name,
        description: `Certified tech accessory with local manufacturer warranty.`,
        unit: 'pcs',
        taxRate: 12.0,
      },
    });

    for (const color of item.colors) {
      variantsToSeed.push({
        productId: product.id,
        sku: `${item.prefix}-${color.substring(0, 3).toUpperCase()}`,
        barcode: String(barcodeCounter++),
        size: 'Standard',
        color,
        costPrice: item.cost,
        sellingPrice: item.price,
        minStockAlert: 8,
      });
    }
  }

  // 3. Beauty & Gourmet: 8 Products x 2 variants = 16 variants
  const beautyGourmetItems = [
    { cat: catCosmetics, brand: brandLoreal, name: 'Revitalift Hyaluronic Acid Serum 50ml', prefix: 'REV-SER-50', cost: 115000, price: 215000 },
    { cat: catCosmetics, brand: brandLoreal, name: 'Matte Signature Waterproof Eyeliner', prefix: 'MAT-EYE-WP', cost: 55000, price: 115000 },
    { cat: catCosmetics, brand: brandLoreal, name: 'Hydra Genius Moisturizer Cream', prefix: 'HYD-GEN-CRM', cost: 85000, price: 175000 },
    { cat: catCosmetics, brand: brandLoreal, name: 'Infaillible 24H Fresh Wear Foundation', prefix: 'FND-24H-FW', cost: 125000, price: 245000 },
    { cat: catGrocery, brand: brandCoffee, name: 'Tashkent Roast Ethiopian Yirgacheffe 250g', prefix: 'COF-ETH-250', cost: 65000, price: 125000 },
    { cat: catGrocery, brand: brandCoffee, name: 'Espresso Supremo Dark Blend 1kg', prefix: 'COF-SUP-1KG', cost: 145000, price: 290000 },
    { cat: catGrocery, brand: brandCoffee, name: 'Artisanal Green Tea with Jasmine 100g', prefix: 'TEA-GRN-100', cost: 35000, price: 75000 },
    { cat: catGrocery, brand: brandCoffee, name: 'Artisan Dark Chocolate 72% Hazelnut', prefix: 'CHC-DRK-100', cost: 25000, price: 55000 },
  ];

  for (const item of beautyGourmetItems) {
    const product = await prisma.product.create({
      data: {
        businessId: business.id,
        categoryId: item.cat.id,
        brandId: item.brand.id,
        name: item.name,
        description: `Premium quality consumer product.`,
        unit: 'pack',
        taxRate: 12.0,
      },
    });

    variantsToSeed.push({
      productId: product.id,
      sku: `${item.prefix}-REG`,
      barcode: String(barcodeCounter++),
      size: 'Default',
      color: 'Standard',
      costPrice: item.cost,
      sellingPrice: item.price,
      minStockAlert: 10,
    });
  }

  console.log(`Total variants prepared: ${variantsToSeed.length}`);
  const createdVariants = [];
  for (const v of variantsToSeed) {
    const created = await prisma.productVariant.create({ data: v });
    createdVariants.push(created);
  }

  console.log('--- Initializing Stock & Inventory Ledger ---');
  // Stock each warehouse with variants
  const warehouses = [whChilanzar, whAmirTimur, whSamarkand];
  for (const wh of warehouses) {
    for (let i = 0; i < createdVariants.length; i++) {
      const variant = createdVariants[i];
      // give Chilanzar more stock, others varying quantities
      const baseQty = wh.code === 'WH-CHIL' ? 25 + (i % 20) : (wh.code === 'WH-ATIM' ? 12 + (i % 10) : 8 + (i % 8));

      // 1. Ledger entry
      await prisma.inventoryMovement.create({
        data: {
          businessId: business.id,
          branchId: wh.branchId,
          warehouseId: wh.id,
          variantId: variant.id,
          movementType: 'PURCHASE_RECEIPT',
          quantity: baseQty,
          costBasis: variant.costPrice,
          referenceType: 'InitialSetup',
          reason: 'Initial store inventory opening',
          actorId: owner.id,
        },
      });

      // 2. Maintained balance
      await prisma.inventoryBalance.create({
        data: {
          businessId: business.id,
          branchId: wh.branchId,
          warehouseId: wh.id,
          variantId: variant.id,
          quantityOnHand: baseQty,
          quantityReserved: 0,
        },
      });
    }
  }

  console.log('--- Creating Customers & CRM Records ---');
  const customerNames = [
    { name: 'Alisher Usmonov', phone: '+998901112233', segment: 'VIP', points: 450 },
    { name: 'Dilnoza Karimova', phone: '+998902223344', segment: 'VIP', points: 680 },
    { name: 'Bekzod Khasanov', phone: '+998913334455', segment: 'REGULAR', points: 150 },
    { name: 'Shakhnoza Rustamova', phone: '+998934445566', segment: 'REGULAR', points: 220 },
    { name: 'Jamshid Tursunov', phone: '+998945556677', segment: 'NEW', points: 50 },
    { name: 'Otabek Mukhamedov', phone: '+998976667788', segment: 'REGULAR', points: 180 },
    { name: 'Gulzoda Akhmedova', phone: '+998987778899', segment: 'INACTIVE', points: 30 },
  ];

  const createdCustomers = [];
  for (const c of customerNames) {
    const cust = await prisma.customer.create({
      data: {
        businessId: business.id,
        fullName: c.name,
        phone: c.phone,
        email: `${c.name.toLowerCase().replace(' ', '.')}@mail.uz`,
        address: 'Tashkent, Yunusabad 4',
        segment: c.segment,
        currentLoyaltyPoints: c.points,
      },
    });
    createdCustomers.push(cust);
  }

  console.log('--- Creating Promotions & Discounts ---');
  const promo10 = await prisma.promotion.create({
    data: {
      businessId: business.id,
      name: 'Welcome 10% Discount',
      description: '10% discount on entire cart for first-time shoppers',
      type: 'PERCENTAGE',
      value: 10.0,
      promoCode: 'WELCOME10',
      active: true,
      startsAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  const promoSpring = await prisma.promotion.create({
    data: {
      businessId: business.id,
      name: 'Spring 50,000 UZS Off',
      description: '50,000 UZS off when spending 400,000 UZS or more',
      type: 'FIXED',
      value: 50000,
      minSpend: 400000,
      promoCode: 'SPRING50',
      active: true,
    },
  });

  console.log('--- Creating Historical Sales & POS Transactions ---');
  // Seed 35 realistic sales transactions
  const paymentMethods = ['CASH', 'UZCARD', 'HUMO', 'PAYME', 'CLICK'];

  for (let i = 1; i <= 35; i++) {
    const daysAgo = Math.floor((35 - i) / 2);
    const saleDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - (i % 8) * 3600 * 1000);
    const targetBranch = i % 4 === 0 ? branchAmirTimur : (i % 7 === 0 ? branchSamarkand : branchChilanzar);
    const targetWH = targetBranch.id === branchChilanzar.id ? whChilanzar : (targetBranch.id === branchAmirTimur.id ? whAmirTimur : whSamarkand);
    const assignedCustomer = i % 3 === 0 ? createdCustomers[i % createdCustomers.length] : null;

    // Pick 2-4 items
    const numItems = 1 + (i % 3);
    let subtotal = 0;
    let costTotal = 0;
    const saleItemsData = [];

    for (let k = 0; k < numItems; k++) {
      const variant = createdVariants[(i * 3 + k) % createdVariants.length];
      const qty = 1 + (k % 2);
      const itemSubtotal = Number(variant.sellingPrice) * qty;
      const itemCost = Number(variant.costPrice) * qty;
      subtotal += itemSubtotal;
      costTotal += itemCost;

      saleItemsData.push({
        variantId: variant.id,
        quantity: qty,
        unitCost: variant.costPrice,
        unitPrice: variant.sellingPrice,
        discountAmount: 0,
        taxAmount: (itemSubtotal * 0.12) / 1.12, // included QQS 12%
        totalAmount: itemSubtotal,
      });

      // Update inventory balance & movement
      await prisma.inventoryBalance.update({
        where: {
          warehouseId_variantId: {
            warehouseId: targetWH.id,
            variantId: variant.id,
          },
        },
        data: {
          quantityOnHand: { decrement: qty },
        },
      });

      await prisma.inventoryMovement.create({
        data: {
          businessId: business.id,
          branchId: targetBranch.id,
          warehouseId: targetWH.id,
          variantId: variant.id,
          movementType: 'SALE',
          quantity: -qty,
          costBasis: variant.costPrice,
          referenceType: 'Sale',
          reason: `Sale receipt CHK-${1000 + i}`,
          actorId: cashier.id,
          createdAt: saleDate,
        },
      });
    }

    const discountTotal = i % 5 === 0 ? 30000 : 0;
    const finalTotal = subtotal - discountTotal;
    const grossProfit = finalTotal - costTotal;

    const sale = await prisma.sale.create({
      data: {
        businessId: business.id,
        branchId: targetBranch.id,
        cashRegisterId: regChilanzar1.id,
        cashierId: cashier.id,
        customerId: assignedCustomer?.id,
        shiftId: openShift.id,
        saleNumber: `CHK-${1000 + i}`,
        status: SaleStatus.COMPLETED,
        subtotal,
        discountTotal,
        taxTotal: (finalTotal * 0.12) / 1.12,
        totalAmount: finalTotal,
        costTotal,
        grossProfit,
        createdAt: saleDate,
        items: {
          create: saleItemsData,
        },
      },
    });

    // Payment record
    const method = paymentMethods[i % paymentMethods.length];
    await prisma.payment.create({
      data: {
        saleId: sale.id,
        method,
        amount: finalTotal,
        transactionRef: `TXN-${method}-${sale.saleNumber}`,
        createdAt: saleDate,
      },
    });

    if (assignedCustomer) {
      await prisma.customer.update({
        where: { id: assignedCustomer.id },
        data: {
          totalSpend: { increment: finalTotal },
          totalOrders: { increment: 1 },
          currentLoyaltyPoints: { increment: Math.floor(finalTotal / 50000) },
        },
      });
    }
  }

  console.log('--- Creating Operating Expenses ---');
  const expRent = await prisma.expenseCategory.create({
    data: { businessId: business.id, name: 'Store Rent & Lease', code: 'RENT' },
  });
  const expUtil = await prisma.expenseCategory.create({
    data: { businessId: business.id, name: 'Utilities & Internet', code: 'UTIL' },
  });
  const expSalary = await prisma.expenseCategory.create({
    data: { businessId: business.id, name: 'Staff Meals & Daily Petty Cash', code: 'PETTY' },
  });

  await prisma.expense.createMany({
    data: [
      {
        businessId: business.id,
        branchId: branchChilanzar.id,
        categoryId: expRent.id,
        amount: 8500000,
        description: 'Monthly store rental - Chilanzar branch',
        paymentMethod: 'BANK_TRANSFER',
        status: 'APPROVED',
        expenseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        businessId: business.id,
        branchId: branchChilanzar.id,
        categoryId: expUtil.id,
        amount: 1200000,
        description: 'Electricity and fiber internet connection',
        paymentMethod: 'BANK_TRANSFER',
        status: 'APPROVED',
        expenseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        businessId: business.id,
        branchId: branchChilanzar.id,
        categoryId: expSalary.id,
        amount: 350000,
        description: 'Cashier team lunch and office supplies',
        paymentMethod: 'CASH',
        status: 'APPROVED',
        expenseDate: new Date(),
      },
    ],
  });

  console.log('--- Creating Purchase Orders ---');
  const po1 = await prisma.purchaseOrder.create({
    data: {
      businessId: business.id,
      branchId: branchChilanzar.id,
      warehouseId: whChilanzar.id,
      supplierId: supTextile.id,
      orderNumber: 'PO-2026-001',
      status: PurchaseOrderStatus.RECEIVED,
      subtotal: 18500000,
      totalAmount: 18500000,
      notes: 'Autumn apparel restock delivered',
      expectedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { variantId: createdVariants[0].id, quantityOrdered: 50, quantityReceived: 50, unitCost: createdVariants[0].costPrice, totalCost: Number(createdVariants[0].costPrice) * 50 },
          { variantId: createdVariants[1].id, quantityOrdered: 40, quantityReceived: 40, unitCost: createdVariants[1].costPrice, totalCost: Number(createdVariants[1].costPrice) * 40 },
        ],
      },
    },
  });

  console.log('--- Creating Integrations Settings ---');
  await prisma.integrationSetting.createMany({
    data: [
      {
        businessId: business.id,
        provider: 'PAYME',
        enabled: true,
        configJson: JSON.stringify({ merchantId: 'payme_demo_retail_789', testMode: true, cashbackPercent: 1.0 }),
      },
      {
        businessId: business.id,
        provider: 'CLICK',
        enabled: true,
        configJson: JSON.stringify({ serviceId: 'click_demo_service_101', merchantId: 'click_m_442', testMode: true }),
      },
      {
        businessId: business.id,
        provider: 'TELEGRAM',
        enabled: true,
        configJson: JSON.stringify({ botToken: 'bot_demo_token_xyz', channelId: '@tashkent_retail_alerts', notifyShifts: true, notifyLowStock: true }),
      },
      {
        businessId: business.id,
        provider: 'ONEC',
        enabled: true,
        configJson: JSON.stringify({ autoExportDaily: true, format: 'XML_STANDARD', warehouseMapping: 'MAIN_TASHKENT' }),
      },
    ],
  });

  console.log('--- Creating Online Orders ---');
  const onlineOrder1 = await prisma.onlineOrder.create({
    data: {
      businessId: business.id,
      branchId: branchChilanzar.id,
      customerId: createdCustomers[0].id,
      orderNumber: 'ONL-2026-101',
      customerName: 'Alisher Usmonov',
      customerPhone: '+998901112233',
      deliveryMethod: 'DELIVERY',
      deliveryAddress: 'Tashkent, Mirzo Ulugbek, Buyuk Ipak Yoli 14, Apt 22',
      status: 'PROCESSING',
      paymentMethod: 'PAYME',
      paymentStatus: 'PAID',
      subtotal: 580000,
      deliveryFee: 25000,
      totalAmount: 605000,
      notes: 'Please call before delivery',
      items: {
        create: [
          { variantId: createdVariants[5].id, quantity: 1, unitPrice: createdVariants[5].sellingPrice, totalAmount: createdVariants[5].sellingPrice },
        ],
      },
    },
  });

  console.log('--- Seed Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
