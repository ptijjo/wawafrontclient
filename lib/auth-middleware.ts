import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET doit être défini dans les variables d\'environnement');
}

interface JwtPayload {
  userId: string;
  jti: string;
}

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  user?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
}

/**
 * Middleware d'authentification qui vérifie le refresh token dans les cookies
 * et retourne l'ID de l'utilisateur connecté
 */
export async function authMiddleware(request: NextRequest): Promise<
  | { success: true; userId: string; user: NonNullable<AuthenticatedRequest['user']> }
  | { success: false; error: string; status: number }
> {
  try {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return {
        success: false,
        error: 'Non authentifié - Token manquant',
        status: 401,
      };
    }

    // Vérifier et décoder le refresh token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      return {
        success: false,
        error: 'Token invalide ou expiré',
        status: 401,
      };
    }

    // Vérifier si la session existe et est valide
    const session = await prisma.session.findUnique({
      where: { jti: decoded.jti },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            desactivateAccountDate: true,
          },
        },
      },
    });

    if (!session) {
      return {
        success: false,
        error: 'Session introuvable',
        status: 401,
      };
    }

    if (session.isRevoked) {
      return {
        success: false,
        error: 'Session révoquée',
        status: 401,
      };
    }

    if (new Date(session.expiresAt) < new Date()) {
      return {
        success: false,
        error: 'Session expirée',
        status: 401,
      };
    }

    // Vérifier si le compte est désactivé
    if (session.user.desactivateAccountDate) {
      return {
        success: false,
        error: 'Compte désactivé',
        status: 403,
      };
    }

    return {
      success: true,
      userId: session.user.id,
      user: {
        id: session.user.id,
        email: session.user.email,
        firstname: session.user.firstname,
        lastname: session.user.lastname,
      },
    };
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    return {
      success: false,
      error: 'Erreur serveur d\'authentification',
      status: 500,
    };
  }
}

/**
 * Helper pour protéger une route API
 * Utilisation dans une route API:
 * 
 * export async function GET(request: NextRequest) {
 *   const auth = await requireAuth(request);
 *   if (!auth.success) {
 *     return auth.response;
 *   }
 *   
 *   // Utiliser auth.userId et auth.user
 *   const userId = auth.userId;
 * }
 */
export async function requireAuth(request: NextRequest): Promise<
  | { success: true; userId: string; user: NonNullable<AuthenticatedRequest['user']>; response?: never }
  | { success: false; response: NextResponse; userId?: never; user?: never }
> {
  const result = await authMiddleware(request);

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: result.error },
        { status: result.status }
      ),
    };
  }

  return {
    success: true,
    userId: result.userId,
    user: result.user,
  };
}
