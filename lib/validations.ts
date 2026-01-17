import { z } from 'zod';

// Validation ObjectId MongoDB
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide');

// Validation email
export const emailSchema = z.string().email('Email invalide').max(255, 'Email trop long');

// Validation téléphone français
export const phoneSchema = z.string()
  .regex(/^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone invalide (format français requis)')
  .max(20, 'Téléphone trop long');

// Validation nom/prénom
export const nameSchema = z.string()
  .min(1, 'Le champ est requis')
  .max(100, 'Trop long (maximum 100 caractères)')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères invalides (lettres, espaces, tirets et apostrophes uniquement)');

// Validation texte libre (note, description, etc.)
export const textSchema = z.string()
  .max(1000, 'Texte trop long (maximum 1000 caractères)')
  .optional()
  .nullable();

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// Schéma de validation pour la création de rendez-vous
export const createAppointmentSchema = z.object({
  lastname: nameSchema,
  firstname: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().nullable(),
  note: textSchema,
  serviceId: objectIdSchema,
  startAvailabilityId: objectIdSchema,
});

// Schéma de validation pour la mise à jour de rendez-vous
export const updateAppointmentSchema = z.object({
  lastname: nameSchema.optional(),
  firstname: nameSchema.optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional().nullable(),
  note: textSchema,
  serviceId: objectIdSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

// Schéma de validation pour la création de service
export const createServiceSchema = z.object({
  service: z.enum(['COIFFURE', 'TATTOUAGE', 'PIERCING', 'CILS'], {
    errorMap: () => ({ message: 'Type de service invalide' }),
  }),
  durationMin: z.number().int().positive('La durée doit être un nombre positif'),
  price: z.number().int().nonnegative('Le prix doit être positif ou nul').optional().nullable(),
  description: textSchema,
});

// Schéma de validation pour la mise à jour de service
export const updateServiceSchema = z.object({
  service: z.enum(['COIFFURE', 'TATTOUAGE', 'PIERCING', 'CILS']).optional(),
  durationMin: z.number().int().positive().optional(),
  price: z.number().int().nonnegative().optional().nullable(),
  description: textSchema,
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

// Schéma de validation pour la création de disponibilité
export const createAvailabilitySchema = z.object({
  date: z.string().datetime('Format de date invalide').or(z.date()),
  isBooked: z.boolean().optional().default(false),
  isBlocked: z.boolean().optional().default(false),
  blockedNote: textSchema,
});

// Schéma de validation pour la mise à jour de disponibilité
export const updateAvailabilitySchema = z.object({
  date: z.string().datetime().or(z.date()).optional(),
  isBooked: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  blockedNote: textSchema,
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

// Schéma de validation pour le blocage de plage
export const blockRangeSchema = z.object({
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  blockedNote: textSchema,
  timeSlots: z.array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
}).refine((data) => {
  const start = typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate;
  const end = typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate;
  return start < end;
}, {
  message: 'La date de début doit être avant la date de fin',
  path: ['endDate'],
});

// Type helpers
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type BlockRangeInput = z.infer<typeof blockRangeSchema>;
