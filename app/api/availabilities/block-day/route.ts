import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { enumerateSlots, DEFAULT_BLOCKS, ACTIVE_WEEK_DAYS } from '@/config/schedule';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const body = await request.json();
    const { date, note } = body;
    if (!date) return NextResponse.json({ error: 'date requise' }, { status: 400 });
    const day = new Date(date);
    if (isNaN(day.getTime())) return NextResponse.json({ error: 'date invalide' }, { status: 400 });
    day.setHours(0,0,0,0);
    const dow = day.getDay();
    if (!ACTIVE_WEEK_DAYS.includes(dow)) return NextResponse.json({ error: 'Jour non actif' }, { status: 400 });

    const tomorrow = new Date(day.getTime() + 86400000);

    const existingSlots = await prisma.availability.findMany({
      where: { date: { gte: day, lt: tomorrow } },
    });
    if (existingSlots.length === 0) {
      // générer les slots si absents
      const slots = enumerateSlots(day, DEFAULT_BLOCKS).map(d => ({ date: d }));
      await prisma.availability.createMany({ data: slots });
    }

    await prisma.availability.updateMany({
      where: { date: { gte: day, lt: tomorrow } },
      data: { isBlocked: true, blockedNote: note ?? 'Blocage journée entière' },
    });

    return NextResponse.json({ success: true, date: day, note: note ?? null }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur blocage journée' }, { status: 500 });
  }
}
