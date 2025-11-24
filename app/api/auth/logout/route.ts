import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Aucune session active' },
        { status: 200 }
      );
    }

    // Récupérer l'user-agent et l'IP pour trouver la session
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Trouver et révoquer la session correspondante
    const session = await prisma.session.findFirst({
      where: {
        userAgent,
        ipAddress,
        isRevoked: false,
      },
    });

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
        },
      });
    }

    // Supprimer le cookie
    const response = NextResponse.json(
      { success: true, message: 'Déconnexion réussie' },
      { status: 200 }
    );

    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la déconnexion' },
      { status: 500 }
    );
  }
}
