import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Supprimer les services existants
    await prisma.service.deleteMany({});
    console.log('Services existants supprimés');

    // Créer les services
    const services = await prisma.service.createMany({
      data: [
        // COIFFURE
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price:null,
          description: 'Braids',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Cornrows braids/Stich braids',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Crochet braids',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Fausses locks',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Locks',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Passion twists',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Patras/Gros bébé',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Wings',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Tissage',
        },
        {
          service: ServiceType.COIFFURE,
          durationMin: 60,
          price: null,
          description: 'Vanilles',
        },
        // TATTOUAGE
        {
          service: ServiceType.TATTOUAGE,
          durationMin: 60,
          price: null,
          description: 'Couverture',
        },
        // PIERCING
        {
          service: ServiceType.PIERCING,
          durationMin: 60,
          price: null,
          description: 'Piercing simple',
        },
        {
          service: ServiceType.PIERCING,
          durationMin: 60,
          price: null,
          description: 'Piercing double',
        },
        // CILS
        {
          service: ServiceType.CILS,
          durationMin: 60,
          price: null,
          description: 'Dépose complète',
        },
        {
          service: ServiceType.CILS,
          durationMin: 60,
          price: null,
          description: 'Mixte',
        },
        {
          service: ServiceType.CILS,
          durationMin: 60,
          price: null,
          description: 'Pose cils à cils',
        },
        {
          service: ServiceType.CILS,
          durationMin: 60,
          price: null,
          description: 'Extensions cils volume russe - Naturel',
        },
        {
          service: ServiceType.CILS,
          durationMin: 60,
          price: null,
          description: 'Extensions cils volume russe - Moyen',
        },
        {
          service: ServiceType.CILS,
          durationMin: 60,
          price: null,
          description: 'Extensions cils volume russe - Très fourni',
        },
      ],
    });

    console.log(`✅ ${services.count} services créés avec succès`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des services:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
