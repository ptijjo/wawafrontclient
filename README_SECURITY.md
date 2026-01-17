# Guide de Sécurité - WavaBANGS

Ce document décrit les améliorations de sécurité implémentées dans l'application.

## ✅ Améliorations Implémentées

### 1. Validation des Entrées avec Zod
- Toutes les entrées utilisateur sont validées avec des schémas Zod stricts
- Validation des formats (email, téléphone, ObjectId MongoDB)
- Limitation de la longueur des champs
- Protection contre l'injection de données malformées

### 2. Rate Limiting
- **Authentification**: 5 requêtes par 15 minutes
- **Routes publiques**: 10 requêtes par heure
- **API générales**: 100 requêtes par heure
- Protection contre les attaques par force brute et DDoS
- Implémentation en mémoire (suffisant pour un usage avec peu de connexions)

### 3. Authentification Renforcée
- Toutes les routes de modification nécessitent une authentification
- Validation stricte des secrets JWT (pas de valeurs par défaut)
- Vérification des sessions et expiration
- Protection contre les tokens invalides

### 4. Index MongoDB
- Index sur les champs fréquemment interrogés
- Amélioration des performances de requêtes
- Index composés pour les requêtes complexes

### 5. Envoi d'Emails
- Envoi d'emails asynchrone (non-bloquant)
- Les emails sont envoyés en arrière-plan
- Ne bloque pas les réponses API
- Gestion d'erreurs avec logging

### 6. Tests Unitaires
- Tests de validation avec Jest
- Couverture des schémas Zod
- Tests d'intégration pour les routes API

## 🔒 Bonnes Pratiques de Sécurité

### Variables d'Environnement
- **JAMAIS** commiter les secrets dans Git
- Utiliser des secrets forts et uniques
- Différencier les secrets entre dev et production

### Base de Données
- Utiliser MongoDB (pas SQLite en production)
- Configurer l'authentification MongoDB
- Utiliser des connexions sécurisées (TLS)

### Rate Limiting
- Rate limiting en mémoire (pas besoin de Redis)
- Ajuster les limites dans `lib/rate-limit.ts` selon vos besoins
- Pour un usage intensif, considérer Redis plus tard

### Emails
- Vérifier votre domaine avec Mailjet
- Utiliser SPF, DKIM, et DMARC
- Surveiller les taux de rebond

## 🚨 Points d'Attention

1. **Secrets JWT**: Doivent être changés régulièrement
2. **Rate Limiting**: Peut bloquer des utilisateurs légitimes si mal configuré
3. **Rate Limiting en mémoire**: Les compteurs sont réinitialisés au redémarrage du serveur
4. **MongoDB**: Assurez-vous que la base est accessible et sauvegardée

## 📝 Checklist de Déploiement

- [ ] Toutes les variables d'environnement sont définies
- [ ] Les secrets JWT sont forts et uniques
- [ ] MongoDB est configuré et accessible
- [ ] Mailjet est configuré avec domaine vérifié
- [ ] Les tests passent (`npm test`)
- [ ] Le build fonctionne (`npm run build`)
- [ ] Les logs sont configurés (optionnel)

## 🔄 Maintenance

- Vérifier régulièrement les logs d'erreurs
- Surveiller les tentatives de connexion échouées
- Mettre à jour les dépendances régulièrement
- Réviser les logs de rate limiting
- Surveiller les erreurs d'envoi d'emails dans les logs
