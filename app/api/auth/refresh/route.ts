import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this';

interface JwtPayload {
  userId: string;
  jti: string;
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Token de rafraîchissement manquant' },
        { status: 401 }
      );
    }

    // Vérifier et décoder le refresh token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        { error: 'Token de rafraîchissement invalide ou expiré' },
        { status: 401 }
      );
    }

    // Vérifier si la session existe et est valide
    const session = await prisma.session.findUnique({
      where: { jti: decoded.jti },
      include: { user: true },
    });

    if (!session || session.isRevoked || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    // Générer un nouveau access token
    const accessToken = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return NextResponse.json(
      {
        success: true,
        accessToken,
        user: {
          id: session.user.id,
          email: session.user.email,
          firstname: session.user.firstname,
          lastname: session.user.lastname,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du rafraîchissement' },
      { status: 500 }
    );
  }
}
