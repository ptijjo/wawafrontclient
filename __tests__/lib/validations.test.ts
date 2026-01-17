import { describe, it, expect } from '@jest/globals';
import {
  loginSchema,
  createAppointmentSchema,
  createServiceSchema,
  objectIdSchema,
  emailSchema,
  phoneSchema,
  nameSchema,
} from '@/lib/validations';

describe('Validations', () => {
  describe('objectIdSchema', () => {
    it('devrait accepter un ObjectId valide', () => {
      const validId = '507f1f77bcf86cd799439011';
      expect(objectIdSchema.safeParse(validId).success).toBe(true);
    });

    it('devrait rejeter un ObjectId invalide', () => {
      const invalidId = 'invalid-id';
      expect(objectIdSchema.safeParse(invalidId).success).toBe(false);
    });
  });

  describe('emailSchema', () => {
    it('devrait accepter un email valide', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      expect(emailSchema.safeParse('invalid-email').success).toBe(false);
    });
  });

  describe('phoneSchema', () => {
    it('devrait accepter un numéro français valide', () => {
      expect(phoneSchema.safeParse('0612345678').success).toBe(true);
      expect(phoneSchema.safeParse('+33612345678').success).toBe(true);
    });

    it('devrait rejeter un numéro invalide', () => {
      expect(phoneSchema.safeParse('123').success).toBe(false);
    });
  });

  describe('nameSchema', () => {
    it('devrait accepter un nom valide', () => {
      expect(nameSchema.safeParse('Dupont').success).toBe(true);
      expect(nameSchema.safeParse("O'Brien").success).toBe(true);
    });

    it('devrait rejeter un nom avec des caractères invalides', () => {
      expect(nameSchema.safeParse('Dupont123').success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('devrait accepter des données de connexion valides', () => {
      const valid = {
        email: 'test@example.com',
        password: 'password123',
      };
      expect(loginSchema.safeParse(valid).success).toBe(true);
    });

    it('devrait rejeter un mot de passe trop court', () => {
      const invalid = {
        email: 'test@example.com',
        password: 'short',
      };
      expect(loginSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('createAppointmentSchema', () => {
    it('devrait accepter un rendez-vous valide', () => {
      const valid = {
        lastname: 'Dupont',
        firstname: 'Jean',
        phone: '0612345678',
        email: 'jean@example.com',
        serviceId: '507f1f77bcf86cd799439011',
        startAvailabilityId: '507f1f77bcf86cd799439012',
      };
      expect(createAppointmentSchema.safeParse(valid).success).toBe(true);
    });

    it('devrait rejeter un rendez-vous avec des données invalides', () => {
      const invalid = {
        lastname: '',
        firstname: 'Jean',
        phone: '123',
        serviceId: 'invalid',
      };
      expect(createAppointmentSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('createServiceSchema', () => {
    it('devrait accepter un service valide', () => {
      const valid = {
        service: 'COIFFURE',
        durationMin: 60,
        price: 50,
      };
      expect(createServiceSchema.safeParse(valid).success).toBe(true);
    });

    it('devrait rejeter un type de service invalide', () => {
      const invalid = {
        service: 'INVALID',
        durationMin: 60,
      };
      expect(createServiceSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
