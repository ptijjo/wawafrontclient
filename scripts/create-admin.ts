import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'test@test.com';
    const password = 'Francoise56';
    const firstname = 'Admin';
    const lastname = 'Test';

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      return;
    }

    // Hasher le mot de passe avec bcrypt
    console.log('🔐 Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    console.log('👤 Création de l\'utilisateur...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
      },
    });

    console.log('✅ Utilisateur créé avec succès !');
    console.log('');
    console.log('📋 Informations du compte :');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nom: ${user.firstname} ${user.lastname}`);
    console.log('');
    console.log('🔑 Identifiants de connexion :');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter sur : http://localhost:3000/admin');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
