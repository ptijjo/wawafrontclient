import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/appointments/[id] - Récupérer un rendez-vous par ID (authentification requise)
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

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true, availabilities: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        appointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du rendez-vous' },
      { status: 500 }
    );
  }
}

// PATCH /api/appointments/[id] - Mettre à jour un rendez-vous (authentification requise)
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
    const { lastname, firstname, phone, email, note, serviceId } = body;

    // Vérifier si le rendez-vous existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: { availabilities: true, service: true },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Si le service change, vérifier qu'il existe
    if (serviceId && serviceId !== existingAppointment.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service) {
        return NextResponse.json(
          { error: 'Service non trouvé' },
          { status: 404 }
        );
      }
    }

    // Si la disponibilité change
    // Pas de redimensionnement des slots dans cette version (multi-slots déjà occupés)

    // Mettre à jour le rendez-vous dans une transaction
    const updatedAppointment = await prisma.$transaction(async (tx: typeof prisma) => {
      const updated = await tx.appointment.update({
        where: { id },
        data: {
          ...(lastname && { lastname }),
          ...(firstname && { firstname }),
          ...(phone && { phone }),
          ...(email !== undefined && { email }),
          ...(note !== undefined && { note }),
          ...(serviceId && { serviceId }),
        },
        include: { service: true, availabilities: true },
      });
      return updated;
    });

    return NextResponse.json(
      {
        success: true,
        appointment: updatedAppointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] - Supprimer un rendez-vous (authentification requise)
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

    // Vérifier si le rendez-vous existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: { availabilities: true },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le rendez-vous dans une transaction
    await prisma.$transaction(async (tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      await tx.appointment.delete({
        where: { id },
      });

      // Libérer la disponibilité si elle existe
      await tx.availability.updateMany({
        where: { appointmentId: id },
        data: { isBooked: false, appointmentId: null },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Rendez-vous supprimé avec succès',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
