import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { createServiceSchema } from '@/lib/validations';
import { apiRateLimiter, getRateLimitIdentifier, checkRateLimit } from '@/lib/rate-limit';

// GET /api/services - Récupérer tous les services (public pour les clients)
export async function GET(request: NextRequest) {
  // Rate limiting
  const identifier = getRateLimitIdentifier(request);
  const rateLimitCheck = await checkRateLimit(apiRateLimiter, identifier);
  if (!rateLimitCheck.success) {
    return rateLimitCheck.response;
  }

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

// POST /api/services - Créer un nouveau service (authentification requise)
export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getRateLimitIdentifier(request);
  const rateLimitCheck = await checkRateLimit(apiRateLimiter, identifier);
  if (!rateLimitCheck.success) {
    return rateLimitCheck.response;
  }

  // Authentification requise
  const auth = await requireAuth(request);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const body = await request.json();
    
    // Validation avec Zod
    const validationResult = createServiceSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { service, durationMin, price, description } = validationResult.data;

    // Créer le service
    const newService = await prisma.service.create({
      data: {
        service,
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
