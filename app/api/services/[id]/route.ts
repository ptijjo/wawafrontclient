import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { ServiceType } from '@/interfaces';

// GET /api/services/[id] - Récupérer un service par ID (authentification requise)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        appointments: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            createdAt: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        service,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du service' },
      { status: 500 }
    );
  }
}

// PATCH /api/services/[id] - Mettre à jour un service (authentification requise)
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
    const { service, durationMin, price, description } = body;

    // Vérifier si le service existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    // Validation
    if (service && !Object.values(ServiceType).includes(service as ServiceType)) {
      return NextResponse.json(
        { 
          error: 'Type de service invalide',
          validTypes: Object.values(ServiceType),
        },
        { status: 400 }
      );
    }

    if (durationMin !== undefined && (typeof durationMin !== 'number' || durationMin <= 0)) {
      return NextResponse.json(
        { error: 'La durée doit être un nombre positif' },
        { status: 400 }
      );
    }

    if (price !== undefined && price !== null && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'Le prix doit être un nombre positif ou nul' },
        { status: 400 }
      );
    }

    // Mettre à jour le service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(service && { service: service as ServiceType }),
        ...(durationMin !== undefined && { durationMin }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        service: updatedService,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Supprimer un service (authentification requise)
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

    // Vérifier si le service existe
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        appointments: true,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des rendez-vous associés
    if (existingService.appointments.length > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer ce service car il a des rendez-vous associés',
          appointmentsCount: existingService.appointments.length,
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Supprimer le service
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Service supprimé avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du service' },
      { status: 500 }
    );
  }
}
