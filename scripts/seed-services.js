const { PrismaClient, ServiceType } = require('@prisma/client');

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
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Braids',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Cornrows braids/Stich braids',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Crochet braids',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Fausses locks',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Locks',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Passion twists',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Patras/Gros bébé',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Wings',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Tissage',
                },
                {
                    service: 'COIFFURE',
                    durationMin: 60,
                    price: null,
                    description: 'Vanilles',
                },
                // TATTOUAGE
                {
                    service: 'TATTOUAGE',
                    durationMin: 60,
                    price: null,
                    description: 'Couverture',
                },
                // PIERCING
                {
                    service: 'PIERCING',
                    durationMin: 60,
                    price: null,
                    description: 'Piercing simple',
                },
                {
                    service: 'PIERCING',
                    durationMin: 60,
                    price: null,
                    description: 'Piercing double',
                },
                // CILS
                {
                    service: 'CILS',
                    durationMin: 60,
                    price: null,
                    description: 'Dépose complète',
                },
                {
                    service: 'CILS',
                    durationMin: 60,
                    price: null,
                    description: 'Mixte',
                },
                {
                    service: 'CILS',
                    durationMin: 60,
                    price: null,
                    description: 'Pose cils à cils',
                },
                {
                    service: 'CILS',
                    durationMin: 60,
                    price: null,
                    description: 'Extensions cils volume russe - Naturel',
                },
                {
                    service: 'CILS',
                    durationMin: 60,
                    price: null,
                    description: 'Extensions cils volume russe - Moyen',
                },
                {
                    service: 'CILS',
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
