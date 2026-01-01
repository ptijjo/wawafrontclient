import { Appointment } from "./Appointment.interface";

export enum ServiceType {
  COIFFURE = "COIFFURE",
  TATTOUAGE = "TATTOUAGE",
  PIERCING = "PIERCING",
  CILS = "CILS",
}

export interface Service {
  id: string;
  service: ServiceType;
  durationMin: number;
  price?: number | null;
  description?: string | null;
}

export interface ServiceWithRelations extends Service {
  appointments: Appointment[];
}

export interface ServiceCreate {
  service: ServiceType;
  durationMin: number;
  price?: number | null;
  description?: string | null;
}

export interface ServiceUpdate {
  service?: ServiceType;
  durationMin?: number;
  price?: number | null;
  description?: string | null;
}

