import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@/lib/validations';
import { authRateLimiter, getRateLimitIdentifier, checkRateLimit } from '@/lib/rate-limit';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET et JWT_REFRESH_SECRET doivent être définis dans les variables d\'environnement');
}

const MAX_LOGIN_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS) || 3;
const LOCK_TIME = (Number(process.env.LOCKOUT_DURATION_MINUTES) || 30) * 60 * 1000; // default 30 minutes

export async function POST(request: NextRequest) {
  // Rate limiting strict pour l'authentification
  const identifier = getRateLimitIdentifier(request);
  const rateLimitCheck = await checkRateLimit(authRateLimiter, identifier);
  if (!rateLimitCheck.success) {
    return rateLimitCheck.response;
  }

  try {
    const body = await request.json();
    
    // Validation avec Zod
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Récupérer les informations du client
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sessions: true,
      },
    });

    // Enregistrer la tentative de connexion (échec si user n'existe pas)
    if (!user) {
      await prisma.loginAttempt.create({
        data: {
          email,
          ipAddress,
          userAgent,
          success: false,
        },
      });

      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérifier si le compte est verrouillé
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json(
        { error: 'Compte temporairement verrouillé. Réessayez plus tard.' },
        { status: 403 }
      );
    }

    // Vérifier si le compte est désactivé
    if (user.desactivateAccountDate) {
      return NextResponse.json(
        { error: 'Ce compte a été désactivé' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incrémenter les tentatives échouées
      const failedAttempts = user.failedLoginAttempts + 1;
      const updateData: { failedLoginAttempts: number; lockedUntil?: Date } = {
        failedLoginAttempts: failedAttempts,
      };

      // Verrouiller le compte si trop de tentatives
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCK_TIME);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      // Enregistrer la tentative échouée
      await prisma.loginAttempt.create({
        data: {
          email,
          ipAddress,
          userAgent,
          success: false,
        },
      });

      return NextResponse.json(
        { 
          error: 'Email ou mot de passe incorrect',
          attemptsRemaining: Math.max(0, MAX_LOGIN_ATTEMPTS - failedAttempts),
        },
        { status: 401 }
      );
    }

    // Connexion réussie - Réinitialiser les tentatives échouées
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Enregistrer la tentative réussie
    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        success: true,
      },
    });

    // Créer un historique de connexion
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
      },
    });

    // Générer les tokens JWT
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const jti = `${user.id}-${Date.now()}`;
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        jti,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Supprimer l'ancienne session si elle existe
    if (user.sessions) {
      await prisma.session.delete({
        where: { id: user.sessions.id },
      });
    }

    // Créer une nouvelle session
    await prisma.session.create({
      data: {
        userId: user.id,
        userAgent,
        ipAddress,
        jti,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    // Créer la réponse avec les cookies
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        accessToken,
      },
      { status: 200 }
    );

    // Définir le refresh token dans un cookie httpOnly
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}
