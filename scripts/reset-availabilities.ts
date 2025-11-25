import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAvailabilities() {
  try {
    console.log('🔄 Suppression de toutes les disponibilités non réservées...');
    
    const result = await prisma.availability.deleteMany({
      where: {
        isBooked: false,
      },
    });

    console.log(`✅ ${result.count} disponibilités supprimées`);
    console.log('');
    console.log('ℹ️  Les nouvelles disponibilités seront régénérées automatiquement');
    console.log('   avec des créneaux de 60 minutes lors de la prochaine requête API');
    console.log('   avec le paramètre ?autofill=1');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAvailabilities();
