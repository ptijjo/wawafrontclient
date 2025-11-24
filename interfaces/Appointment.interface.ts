export interface Appointment {
  id: string;
  lastname: string;
  firstname: string;
  phone: string;
  email?: string | null;
  note?: string | null;
  serviceId: string;
  availabilityId?: string | null;
  createdAt: Date;
}

export interface AppointmentWithRelations extends Appointment {
  service: Service;
  availability?: Availability | null;
}

export interface AppointmentCreate {
  lastname: string;
  firstname: string;
  phone: string;
  email?: string | null;
  note?: string | null;
  serviceId: string;
  availabilityId?: string | null;
}

export interface AppointmentUpdate {
  lastname?: string;
  firstname?: string;
  phone?: string;
  email?: string | null;
  note?: string | null;
  serviceId?: string;
  availabilityId?: string | null;
}

// Imports nécessaires pour les relations
import type { Service } from './Service.interface';
import type { Availability } from './Availability.interface';
