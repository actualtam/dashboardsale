export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const range = searchParams.get('range') || '30d';

    const whereBranch: any = {};
    if (branchId && branchId !== 'all') {
      whereBranch.branchId = branchId;
    }

    // 1. Fetch Sales
    const sales = await prisma.sale.findMany({
      where: {
        ...whereBranch,
        status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] },
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
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch Expenses
    const expenses = await prisma.expense.findMany({
      where: {
        ...whereBranch,
        status: 'APPROVED',
      },
      include: {
        category: true,
      },
    });

    // 3. Compute Metrics
    let grossSales = 0;
    let discountTotal = 0;
    let netSales = 0;
    let costTotal = 0;
    let unitsSold = 0;

    const salesByDayMap: Record<string, { date: string; revenue: number; profit: number }> = {};
    const topProductsMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    const paymentMethodsMap: Record<string, number> = {};
    const branchSalesMap: Record<string, number> = {};

    for (const s of sales) {
      const saleSubtotal = Number(s.subtotal);
      const saleDiscount = Number(s.discountTotal);
      const saleNet = Number(s.totalAmount);
      const saleCost = Number(s.costTotal);

      grossSales += saleSubtotal;
      discountTotal += saleDiscount;
      netSales += saleNet;
      costTotal += saleCost;

      // Group by date
      const dateKey = s.createdAt.toISOString().split('T')[0];
      if (!salesByDayMap[dateKey]) {
        salesByDayMap[dateKey] = { date: dateKey, revenue: 0, profit: 0 };
      }
      salesByDayMap[dateKey].revenue += saleNet;
      salesByDayMap[dateKey].profit += (saleNet - saleCost);

      // Group by branch
      const bName = s.branch?.name || 'Unknown Branch';
      branchSalesMap[bName] = (branchSalesMap[bName] || 0) + saleNet;

      // Group by tender
      for (const p of s.payments) {
        paymentMethodsMap[p.method] = (paymentMethodsMap[p.method] || 0) + Number(p.amount);
      }

      // Group items
      for (const item of s.items) {
        unitsSold += item.quantity;
        const pName = item.variant?.product?.name || 'Product';
        if (!topProductsMap[pName]) {
          topProductsMap[pName] = { name: pName, quantity: 0, revenue: 0 };
        }
        topProductsMap[pName].quantity += item.quantity;
        topProductsMap[pName].revenue += Number(item.totalAmount);
      }
    }

    const grossProfit = netSales - costTotal;
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const netProfit = grossProfit - totalExpenses;
    const transactions = sales.length;
    const avgTicket = transactions > 0 ? netSales / transactions : 0;

    // 4. Inventory Valuation & Low Stock
    const balances = await prisma.inventoryBalance.findMany({
      where: whereBranch,
      include: {
        variant: {
          include: { product: true },
        },
      },
    });

    let inventoryValuation = 0;
    const lowStockAlerts = [];

    for (const b of balances) {
      const cost = Number(b.variant.costPrice);
      inventoryValuation += b.quantityOnHand * cost;

      if (b.quantityOnHand <= b.variant.minStockAlert) {
        lowStockAlerts.push({
          id: b.id,
          name: `${b.variant.product.name} (${b.variant.size} / ${b.variant.color})`,
          sku: b.variant.sku,
          stock: b.quantityOnHand,
          minStock: b.variant.minStockAlert,
        });
      }
    }

    return NextResponse.json({
      metrics: {
        grossSales,
        discountTotal,
        netSales,
        costTotal,
        grossProfit,
        totalExpenses,
        netProfit,
        transactions,
        avgTicket,
        unitsSold,
        inventoryValuation,
      },
      charts: {
        salesTrend: Object.values(salesByDayMap).sort((a, b) => a.date.localeCompare(b.date)),
        salesByBranch: Object.entries(branchSalesMap).map(([name, value]) => ({ name, value })),
        salesByPayment: Object.entries(paymentMethodsMap).map(([name, value]) => ({ name, value })),
      },
      topProducts: Object.values(topProductsMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      lowStockAlerts: lowStockAlerts.slice(0, 8),
      recentSales: sales.slice(0, 6).map((s) => ({
        id: s.id,
        saleNumber: s.saleNumber,
        branchName: s.branch?.name,
        totalAmount: Number(s.totalAmount),
        itemsCount: s.items.length,
        paymentMethod: s.payments[0]?.method || 'CASH',
        createdAt: s.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
