import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

// POST /api/availabilities/block-range - Bloquer plusieurs créneaux pour vacances/indisponibilité (authentification requise)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { startDate, endDate, blockedNote, timeSlots } = body;

    // Validation
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'La date de début et de fin sont requises' },
        { status: 400 }
      );
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Format de date invalide' },
        { status: 400 }
      );
    }

    if (startDateObj >= endDateObj) {
      return NextResponse.json(
        { error: 'La date de début doit être avant la date de fin' },
        { status: 400 }
      );
    }

    if (startDateObj < new Date()) {
      return NextResponse.json(
        { error: 'La date de début ne peut pas être dans le passé' },
        { status: 400 }
      );
    }

    // Si des créneaux horaires spécifiques sont fournis, les utiliser
    // Sinon, créer un blocage pour toute la journée
    const slots: string[] = timeSlots && Array.isArray(timeSlots) && timeSlots.length > 0
      ? timeSlots
      : ['00:00']; // Blocage toute la journée

    const createdAvailabilities = [];
    const errors = [];

    // Créer les disponibilités bloquées pour chaque jour
    const currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      for (const timeSlot of slots) {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotDate = new Date(currentDate);
        slotDate.setHours(hours || 0, minutes || 0, 0, 0);

        try {
          // Vérifier si une disponibilité existe déjà
          const existing = await prisma.availability.findFirst({
            where: { date: slotDate },
            include: { appointment: true },
          });

          if (existing) {
            if (existing.appointment) {
              errors.push({
                date: slotDate.toISOString(),
                error: 'Un rendez-vous existe déjà pour ce créneau',
              });
              continue;
            }

            // Mettre à jour pour bloquer
            const updated = await prisma.availability.update({
              where: { id: existing.id },
              data: {
                isBlocked: true,
                blockedNote: blockedNote || 'Indisponibilité',
              },
            });
            createdAvailabilities.push(updated);
          } else {
            // Créer une nouvelle disponibilité bloquée
            const created = await prisma.availability.create({
              data: {
                date: slotDate,
                isBooked: false,
                isBlocked: true,
                blockedNote: blockedNote || 'Indisponibilité',
              },
            });
            createdAvailabilities.push(created);
          }
        } catch (error) {
          console.error(`Erreur pour le créneau ${slotDate}:`, error);
          errors.push({
            date: slotDate.toISOString(),
            error: 'Erreur lors de la création/mise à jour',
          });
        }
      }

      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return NextResponse.json(
      {
        success: true,
        message: `${createdAvailabilities.length} créneaux bloqués avec succès`,
        created: createdAvailabilities.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors du blocage des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du blocage des disponibilités' },
      { status: 500 }
    );
  }
}
