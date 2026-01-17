// Rate limiting simple en mémoire (sans Redis)
// Pour un usage avec peu de connexions, cette solution est suffisante

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Stockage en mémoire des compteurs de rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Nettoyer les entrées expirées toutes les minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Nettoyage toutes les minutes

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Rate limiter pour les routes d'authentification (plus strict)
const authConfig: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

// Rate limiter pour les routes publiques (création de rendez-vous, etc.)
const publicConfig: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 heure
};

// Rate limiter pour les routes API générales
const apiConfig: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 60 * 1000, // 1 heure
};

function checkRateLimitInternal(
  identifier: string,
  config: RateLimitConfig
): { success: true; remaining: number; reset: number } | { success: false; remaining: number; reset: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Nouvelle fenêtre ou fenêtre expirée
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      reset: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    // Limite atteinte
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  // Incrémenter le compteur
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime,
  };
}

// Helper pour obtenir l'identifiant du client (IP)
export function getRateLimitIdentifier(request: Request): string {
  // Essayer de récupérer l'IP depuis les headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
  
  return ip;
}

// Rate limiter pour l'authentification
export const authRateLimiter = {
  limit: (identifier: string) => checkRateLimitInternal(identifier, authConfig),
};

// Rate limiter pour les routes publiques
export const publicRateLimiter = {
  limit: (identifier: string) => checkRateLimitInternal(identifier, publicConfig),
};

// Rate limiter pour les routes API générales
export const apiRateLimiter = {
  limit: (identifier: string) => checkRateLimitInternal(identifier, apiConfig),
};

// Helper pour vérifier le rate limit et retourner une réponse si dépassé
export async function checkRateLimit(
  rateLimiter: { limit: (id: string) => ReturnType<typeof checkRateLimitInternal> },
  identifier: string
): Promise<{ success: true } | { success: false; response: Response }> {
  const result = rateLimiter.limit(identifier);

  if (!result.success) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: 'Trop de requêtes. Veuillez réessayer plus tard.',
          remaining: result.remaining,
          reset: new Date(result.reset).toISOString(),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}
