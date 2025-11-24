import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { sendAppointmentConfirmation, sendNewAppointmentNotification } from '@/lib/mailjet';
import { SLOT_DURATION_MIN } from '@/config/schedule';

// GET /api/appointments - Récupérer tous les rendez-vous (authentification requise)
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('fromDate');
    const serviceId = searchParams.get('serviceId');

    // Construction des filtres
    const where: {
      createdAt?: {
        gte?: Date;
      };
      serviceId?: string;
    } = {};

    if (fromDate) {
      where.createdAt = {
        gte: new Date(fromDate),
      };
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        service: true,
        availabilities: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Créer un rendez-vous (public pour les clients)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lastname, firstname, phone, email, note, serviceId, startAvailabilityId } = body;

    // Validation
    if (!lastname || !firstname || !phone || !serviceId) {
      return NextResponse.json(
        { error: 'Le nom, prénom, téléphone et service sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que le service existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    // Vérification de la disponibilité de départ (multi-slots)
    if (!startAvailabilityId) {
      return NextResponse.json(
        { error: 'startAvailabilityId est requis' },
        { status: 400 }
      );
    }

    const startSlot = await prisma.availability.findUnique({
      where: { id: startAvailabilityId },
    });

    if (!startSlot) {
      return NextResponse.json(
        { error: 'Créneau de départ non trouvé' },
        { status: 404 }
      );
    }
    if (startSlot.isBlocked) {
      return NextResponse.json(
        { error: 'Créneau bloqué' },
        { status: 403 }
      );
    }
    if (startSlot.isBooked) {
      return NextResponse.json(
        { error: 'Créneau déjà réservé' },
        { status: 409 }
      );
    }
    if (startSlot.date < new Date()) {
      return NextResponse.json(
        { error: 'Créneau dans le passé' },
        { status: 400 }
      );
    }

    // Calcul du nombre de slots nécessaires
    const neededSlots = Math.max(1, Math.ceil(service.durationMin / SLOT_DURATION_MIN));

    // Récupérer les slots contigus
    const dayStart = new Date(startSlot.date);
    dayStart.setHours(0,0,0,0);
    const nextDay = new Date(dayStart.getTime() + 86400000);

    const sameDaySlots = await prisma.availability.findMany({
      where: {
        date: { gte: dayStart, lt: nextDay },
      },
      orderBy: { date: 'asc' },
    });
    const index = sameDaySlots.findIndex((s: { id: string }) => s.id === startAvailabilityId);
    if (index === -1) {
      return NextResponse.json({ error: 'Incohérence créneau' }, { status: 409 });
    }
    const chosen: { id: string; date: Date; isBlocked: boolean; isBooked: boolean }[] = [];
    for (let i = index; i < sameDaySlots.length && chosen.length < neededSlots; i++) {
      const slot = sameDaySlots[i];
      // Vérifier contiguïté (30 min exact entre slots successifs)
      if (chosen.length > 0) {
        const prev = chosen[chosen.length - 1];
        const diffMin = (slot.date.getTime() - prev.date.getTime()) / 60000;
        if (diffMin !== SLOT_DURATION_MIN) break; // stop si trou
      }
      if (slot.isBlocked || slot.isBooked) break;
      chosen.push(slot);
    }
    if (chosen.length < neededSlots) {
      return NextResponse.json({ error: 'Créneaux contigus insuffisants' }, { status: 409 });
    }

    // Créer le rendez-vous dans une transaction
    const appointment = await prisma.$transaction(async (tx) => {
      const newAppt = await tx.appointment.create({
        data: {
          lastname,
          firstname,
          phone,
          email: email ?? null,
          note: note ?? null,
          serviceId,
        },
        include: { service: true },
      });
      await tx.availability.updateMany({
        where: { id: { in: chosen.map((c: { id: string }) => c.id) } },
        data: { isBooked: true, appointmentId: newAppt.id },
      });
      const bookedSlots = await tx.availability.findMany({
        where: { appointmentId: newAppt.id },
        orderBy: { date: 'asc' },
      });
      return { ...newAppt, availabilities: bookedSlots };
    });

    // Envoyer les emails de confirmation
    const clientName = `${appointment.firstname} ${appointment.lastname}`;
    const serviceName = appointment.service.service;
    const appointmentDate = appointment.availabilities[0]?.date;

    // Email au client si une adresse email est fournie
    if (appointment.email) {
      try {
        await sendAppointmentConfirmation({
          to: appointment.email,
          clientName,
          serviceName,
          appointmentDate,
          appointmentId: appointment.id,
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email au client:', emailError);
        // Ne pas bloquer la création du RDV si l'email échoue
      }
    }

    // Email à l'administrateur
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await sendNewAppointmentNotification({
          adminEmail,
          clientName,
          clientPhone: appointment.phone,
          clientEmail: appointment.email || undefined,
          serviceName,
          appointmentDate,
          appointmentId: appointment.id,
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email à l\'admin:', emailError);
        // Ne pas bloquer la création du RDV si l'email échoue
      }
    }

    return NextResponse.json(
      {
        success: true,
        appointment,
        message: 'Rendez-vous créé avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}
