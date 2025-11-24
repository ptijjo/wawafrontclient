import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { ACTIVE_WEEK_DAYS, DEFAULT_BLOCKS, enumerateSlots } from '@/config/schedule';

// Génère les créneaux de 30min (09:00-12:00, 14:00-18:00) du lundi au samedi sur N mois
async function autoFillAvailability(monthsAhead: number, startFrom?: Date) {
  const startDate = startFrom ? new Date(startFrom) : new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  // Récupérer déjà existants pour éviter les doublons
  const existing = await prisma.availability.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: { date: true },
  });
  const existingSet = new Set(existing.map((e: { date: Date }) => e.date.toISOString()));

  const toCreate: { date: Date }[] = [];

  // Ancienne fonction addSlots remplacée par enumerateSlots

  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0 dimanche ... 6 samedi
    if (!ACTIVE_WEEK_DAYS.includes(dayOfWeek)) continue;
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const slots = enumerateSlots(day, DEFAULT_BLOCKS);
    for (const slot of slots) {
      const iso = slot.toISOString();
      if (!existingSet.has(iso)) {
        toCreate.push({ date: slot });
      }
    }
  }

  if (toCreate.length > 0) {
    // Prisma 6 (sqlite) ne supporte pas skipDuplicates ici; nous avons déjà filtré l'existant via existingSet
    await prisma.availability.createMany({ data: toCreate });
  }

  return { created: toCreate.length, startDate, endDate };
}

// GET /api/availabilities - Récupérer toutes les disponibilités (public pour les clients)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isBooked = searchParams.get('isBooked');
    const isBlocked = searchParams.get('isBlocked');
    const fromDate = searchParams.get('fromDate');
    const autofill = searchParams.get('autofill'); // "1" pour déclencher génération
    const months = parseInt(searchParams.get('months') || '3', 10); // défaut 3 mois
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(500, Math.max(1, parseInt(searchParams.get('pageSize') || '100', 10))); // limite sécurité

    let autofillResult: { created: number; startDate: Date; endDate: Date } | undefined;
    if (autofill === '1') {
      // Optimisation: ne remplir que si aucun créneau existant dans la plage ciblée
      const startBoundary = fromDate ? new Date(fromDate) : new Date();
      startBoundary.setHours(0,0,0,0);
      const endBoundary = new Date(startBoundary);
      endBoundary.setMonth(endBoundary.getMonth() + months);
      const existingCount = await prisma.availability.count({
        where: {
          date: { gte: startBoundary, lt: endBoundary },
        },
      });
      if (existingCount === 0) {
        autofillResult = await autoFillAvailability(months, startBoundary);
      }
    }

    // Construction des filtres
    const where: {
      isBooked?: boolean;
      isBlocked?: boolean;
      date?: {
        gte?: Date;
      };
    } = {};

    if (isBooked !== null) {
      where.isBooked = isBooked === 'true';
    }

    if (isBlocked !== null) {
      where.isBlocked = isBlocked === 'true';
    }

    if (fromDate) {
      where.date = {
        gte: new Date(fromDate),
      };
    }

    const total = await prisma.availability.count({ where });
    const availabilities = await prisma.availability.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: 'asc' },
      include: {
        appointment: {
          select: { id: true, firstname: true, lastname: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
        availabilities,
        autofill: autofillResult ? {
          created: autofillResult.created,
          startDate: autofillResult.startDate,
          endDate: autofillResult.endDate,
        } : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
}

// POST /api/availabilities - Créer une nouvelle disponibilité (authentification requise)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { date, isBooked, isBlocked, blockedNote } = body;

    // Validation
    if (!date) {
      return NextResponse.json(
        { error: 'La date est requise' },
        { status: 400 }
      );
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: 'Format de date invalide' },
        { status: 400 }
      );
    }

    // Vérifier que la date n'est pas dans le passé
    if (dateObj < new Date()) {
      return NextResponse.json(
        { error: 'La date ne peut pas être dans le passé' },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'existe pas déjà une disponibilité à cette date exacte
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        date: dateObj,
      },
    });

    if (existingAvailability) {
      return NextResponse.json(
        { error: 'Une disponibilité existe déjà pour cette date et heure' },
        { status: 409 }
      );
    }

    // Créer la disponibilité
    const availability = await prisma.availability.create({
      data: {
        date: dateObj,
        isBooked: isBooked ?? false,
        isBlocked: isBlocked ?? false,
        blockedNote: blockedNote ?? null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        availability,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création de la disponibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la disponibilité' },
      { status: 500 }
    );
  }
}
