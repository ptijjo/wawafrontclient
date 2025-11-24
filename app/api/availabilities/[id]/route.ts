import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/availabilities/[id] - Récupérer une disponibilité par ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const availability = await prisma.availability.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!availability) {
      return NextResponse.json(
        { error: 'Disponibilité non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        availability,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération de la disponibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la disponibilité' },
      { status: 500 }
    );
  }
}

// PATCH /api/availabilities/[id] - Mettre à jour une disponibilité (authentification requise)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { date, isBooked, isBlocked, blockedNote } = body;

    // Vérifier si la disponibilité existe
    const existingAvailability = await prisma.availability.findUnique({
      where: { id },
      include: {
        appointment: true,
      },
    });

    if (!existingAvailability) {
      return NextResponse.json(
        { error: 'Disponibilité non trouvée' },
        { status: 404 }
      );
    }

    // Validation de la date si fournie
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: 'Format de date invalide' },
          { status: 400 }
        );
      }

      // Vérifier qu'il n'existe pas déjà une autre disponibilité à cette date
      const duplicateAvailability = await prisma.availability.findFirst({
        where: {
          date: dateObj,
          id: {
            not: id,
          },
        },
      });

      if (duplicateAvailability) {
        return NextResponse.json(
          { error: 'Une disponibilité existe déjà pour cette date et heure' },
          { status: 409 }
        );
      }
    }

    // Si on essaie de marquer comme non réservé mais qu'il y a un rendez-vous
    if (isBooked === false && existingAvailability.appointment) {
      return NextResponse.json(
        { error: 'Impossible de marquer comme disponible car un rendez-vous est associé' },
        { status: 409 }
      );
    }

    // Si on essaie de bloquer une disponibilité qui a déjà un rendez-vous
    if (isBlocked === true && existingAvailability.appointment) {
      return NextResponse.json(
        { error: 'Impossible de bloquer cette disponibilité car elle a un rendez-vous associé' },
        { status: 409 }
      );
    }

    // Mettre à jour la disponibilité
    const updatedAvailability = await prisma.availability.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(isBooked !== undefined && { isBooked }),
        ...(isBlocked !== undefined && { isBlocked }),
        ...(blockedNote !== undefined && { blockedNote }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        availability: updatedAvailability,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la disponibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la disponibilité' },
      { status: 500 }
    );
  }
}

// DELETE /api/availabilities/[id] - Supprimer une disponibilité (authentification requise)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    const { id } = await params;

    // Vérifier si la disponibilité existe
    const existingAvailability = await prisma.availability.findUnique({
      where: { id },
      include: {
        appointment: true,
      },
    });

    if (!existingAvailability) {
      return NextResponse.json(
        { error: 'Disponibilité non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a un rendez-vous associé
    if (existingAvailability.appointment) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer cette disponibilité car elle a un rendez-vous associé',
          appointment: {
            id: existingAvailability.appointment.id,
            client: `${existingAvailability.appointment.firstname} ${existingAvailability.appointment.lastname}`,
          },
        },
        { status: 409 }
      );
    }

    // Supprimer la disponibilité
    await prisma.availability.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Disponibilité supprimée avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la disponibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la disponibilité' },
      { status: 500 }
    );
  }
}
