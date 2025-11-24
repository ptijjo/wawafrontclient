export interface Availability {
  id: string;
  date: Date;
  isBooked: boolean;
  isBlocked: boolean;
  blockedNote?: string | null;
  createdAt: Date;
}

export interface AvailabilityWithRelations extends Availability {
  appointment?: Appointment | null;
}

export interface AvailabilityCreate {
  date: Date;
  isBooked?: boolean;
  isBlocked?: boolean;
  blockedNote?: string | null;
}

export interface AvailabilityUpdate {
  date?: Date;
  isBooked?: boolean;
  isBlocked?: boolean;
  blockedNote?: string | null;
}

// Import nécessaire pour les relations
import type { Appointment } from './Appointment.interface';
