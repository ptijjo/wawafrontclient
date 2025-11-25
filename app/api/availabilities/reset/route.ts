import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

// DELETE /api/availabilities/reset - Supprimer toutes les disponibilités non réservées
export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);

  if (!auth.success) {
    return auth.response;
  }

  try {
    // Supprimer uniquement les disponibilités non réservées
    const result = await prisma.availability.deleteMany({
      where: {
        isBooked: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${result.count} disponibilités non réservées supprimées`,
        info: 'Les nouvelles disponibilités avec des créneaux de 60 minutes seront régénérées automatiquement',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression des disponibilités' },
      { status: 500 }
    );
  }
}
