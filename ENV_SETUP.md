# Configuration des Variables d'Environnement

Ce document liste toutes les variables d'environnement nécessaires pour le bon fonctionnement de l'application.

## Variables Requises

### Base de données
```env
DATABASE_URL="mongodb://localhost:27017/wavabangs"
# OU pour MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/wavabangs?retryWrites=true&w=majority"
```

**⚠️ IMPORTANT**: Assurez-vous d'utiliser MongoDB, pas SQLite. Le schéma Prisma est configuré pour MongoDB.

### Authentification JWT
```env
JWT_SECRET="votre-secret-jwt-tres-long-et-securise-changez-moi"
JWT_REFRESH_SECRET="votre-secret-refresh-jwt-tres-long-et-securise-changez-moi"
```

**⚠️ CRITIQUE**: Ces secrets doivent être:
- Uniques et aléatoires
- Longs (minimum 32 caractères)
- Jamais commités dans le dépôt Git
- Différents en production et développement

### Rate Limiting
Le rate limiting est géré en mémoire (pas besoin de Redis).
Les limites sont :
- Authentification : 5 requêtes par 15 minutes
- Routes publiques : 10 requêtes par heure
- API générales : 100 requêtes par heure

**Note**: Pour un usage avec beaucoup de connexions, vous pourriez vouloir utiliser Redis plus tard.

### Email (Mailjet)
```env
MAILJET_API_KEY="your-mailjet-api-key"
MAILJET_SECRET_KEY="your-mailjet-secret-key"
MAILJET_SENDER_EMAIL="noreply@votredomaine.com"
MAILJET_SENDER_NAME="WavaBANGS"
ADMIN_EMAIL="admin@votredomaine.com"
```

### Sécurité
```env
MAX_LOGIN_ATTEMPTS="3"
LOCKOUT_DURATION_MINUTES="30"
NODE_ENV="production" # ou "development"
```

## Configuration de Production

En production, assurez-vous que:
1. Toutes les variables sont définies
2. `NODE_ENV=production`
3. Les secrets JWT sont forts et uniques
4. MongoDB est accessible et sécurisé
5. Les emails sont configurés avec un domaine vérifié

## Vérification

Pour vérifier que toutes les variables sont correctement configurées, vous pouvez exécuter:

```bash
node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓' : '✗'); console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓' : '✗'); console.log('MAILJET_API_KEY:', process.env.MAILJET_API_KEY ? '✓' : '✗');"
```
