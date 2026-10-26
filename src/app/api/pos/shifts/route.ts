import { notifyShiftClose } from "@/lib/services/telegram";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');

    const shift = await prisma.cashShift.findFirst({
      where: {
        ...(branchId && branchId !== 'all' ? { branchId } : {}),
        status: 'OPEN',
      },
      include: {
        cashier: true,
        cashRegister: true,
        branch: true,
        movements: true,
        sales: {
          include: { payments: true },
        },
      },
      orderBy: { openedAt: 'desc' },
    });

    return NextResponse.json(shift);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, shiftId, branchId, openingCash, closingCash, amount, reason, type } = body;

    if (action === 'OPEN') {
      const branch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: { cashRegisters: true },
      });
      const register = branch?.cashRegisters[0];
      const cashier = await prisma.user.findFirst();

      const newShift = await prisma.cashShift.create({
        data: {
          businessId: branch!.businessId,
          branchId: branch!.id,
          cashRegisterId: register!.id,
          cashierId: cashier!.id,
          openingCash: Number(openingCash || 0),
          status: 'OPEN',
        },
      });

      return NextResponse.json(newShift);
    }

    if (action === 'MOVEMENT') {
      const movement = await prisma.cashMovement.create({
        data: {
          shiftId,
          type, // IN or OUT
          amount: Number(amount),
          reason: reason || 'Cash drop / payout',
        },
      });
      return NextResponse.json(movement);
    }

    if (action === 'CLOSE') {
      const shift = await prisma.cashShift.findUnique({
        where: { id: shiftId },
        include: {
          movements: true,
          sales: {
            include: { payments: true },
          },
        },
      });

      if (!shift) return NextResponse.json({ error: 'Shift not found' }, { status: 404 });

      // Calculate expected cash: opening + cash sales + cash in - cash out
      let expectedCash = Number(shift.openingCash);
      for (const s of shift.sales) {
        for (const p of s.payments) {
          if (p.method === 'CASH') {
            expectedCash += Number(p.amount);
          }
        }
      }
      for (const m of shift.movements) {
        if (m.type === 'IN') expectedCash += Number(m.amount);
        if (m.type === 'OUT') expectedCash -= Number(m.amount);
      }

      const diff = Number(closingCash) - expectedCash;

      const closed = await prisma.cashShift.update({
        where: { id: shiftId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
          closingCash: Number(closingCash),
          expectedCash,
          cashDifference: diff,
        },
      });

      notifyShiftClose(closed).catch((e) => console.error("TG shift notify error:", e));
      return NextResponse.json(closed);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
