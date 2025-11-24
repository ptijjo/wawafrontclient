import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { ACTIVE_WEEK_DAYS, enumerateSlots, TimeBlock } from '@/config/schedule';

interface OverrideBody {
  date: string;
  blocks: TimeBlock[];
  preserveBooked?: boolean;
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const body: OverrideBody = await request.json();
    if (!body.date || !body.blocks || body.blocks.length === 0) {
      return NextResponse.json({ error: 'date et blocks requis' }, { status: 400 });
    }
    const day = new Date(body.date);
    if (isNaN(day.getTime())) return NextResponse.json({ error: 'date invalide' }, { status: 400 });
    day.setHours(0,0,0,0);
    const dow = day.getDay();
    if (!ACTIVE_WEEK_DAYS.includes(dow)) return NextResponse.json({ error: 'Jour non actif' }, { status: 400 });

    const tomorrow = new Date(day.getTime() + 86400000);

    const existing = await prisma.availability.findMany({
      where: { date: { gte: day, lt: tomorrow } },
    });

    // Supprimer ou marquer pour suppression les non réservés
    for (const slot of existing) {
      if (slot.isBooked && body.preserveBooked !== false) continue; // conserver les réservés
      await prisma.availability.delete({ where: { id: slot.id } });
    }

    // Créer les nouveaux slots
    const newSlotsDates = enumerateSlots(day, body.blocks);
    const data = newSlotsDates.map(d => ({ date: d }));
    await prisma.availability.createMany({ data });

    const finalSlots = await prisma.availability.findMany({
      where: { date: { gte: day, lt: tomorrow } },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, date: day, slots: finalSlots.length }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erreur serveur override journée' }, { status: 500 });
  }
}
