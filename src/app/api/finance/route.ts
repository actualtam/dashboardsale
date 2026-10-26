import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');

    const whereBranch = branchId && branchId !== 'all' ? { branchId } : {};

    // 1. Sales
    const sales = await prisma.sale.findMany({
      where: {
        ...whereBranch,
        status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] },
      },
    });

    // 2. Expenses
    const expenses = await prisma.expense.findMany({
      where: whereBranch,
      include: { category: true, branch: true },
      orderBy: { expenseDate: 'desc' },
    });

    // 3. Categories
    const categories = await prisma.expenseCategory.findMany();

    let revenue = 0;
    let cogs = 0;
    for (const s of sales) {
      revenue += Number(s.totalAmount);
      cogs += Number(s.costTotal);
    }

    const grossProfit = revenue - cogs;
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const netProfit = grossProfit - totalExpenses;

    return NextResponse.json({
      pl: {
        revenue,
        cogs,
        grossProfit,
        grossMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
        totalExpenses,
        netProfit,
        netMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
      },
      expenses,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { branchId, categoryId, amount, description, paymentMethod = 'CASH' } = body;

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });

    const expense = await prisma.expense.create({
      data: {
        businessId: branch!.businessId,
        branchId,
        categoryId,
        amount: Number(amount),
        description,
        paymentMethod,
        status: 'APPROVED',
      },
    });

    return NextResponse.json(expense);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
