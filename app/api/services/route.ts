import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { ServiceType } from '@/interfaces';

// GET /api/services - Récupérer tous les services (public pour les clients)
export async function GET(request: NextRequest) {
  // Vérifier s'il y a un paramètre 'public' pour accès public
  const { searchParams } = new URL(request.url);
  const isPublic = searchParams.get('public') === '1';

  // Si pas d'accès public demandé, vérifier l'authentification
  if (!isPublic) {
    const auth = await requireAuth(request);
    if (!auth.success) {
      return auth.response;
    }
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: {
        service: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        services,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Créer un nouveau service (accessible aux clients)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, durationMin, price, description } = body;

    // Validation
    if (!service || !durationMin) {
      return NextResponse.json(
        { error: 'Le type de service et la durée sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que le type de service est valide
    if (!Object.values(ServiceType).includes(service as ServiceType)) {
      return NextResponse.json(
        { 
          error: 'Type de service invalide',
          validTypes: Object.values(ServiceType),
        },
        { status: 400 }
      );
    }

    if (typeof durationMin !== 'number' || durationMin <= 0) {
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

    // Créer le service
    const newService = await prisma.service.create({
      data: {
        service: service as ServiceType,
        durationMin,
        price: price ?? null,
        description: description ?? null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        service: newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du service' },
      { status: 500 }
    );
  }
}
