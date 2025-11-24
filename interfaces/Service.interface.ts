import { Appointment } from "./Appointment.interface";

export enum ServiceType {
  TRESSES = "TRESSES",
  TATTOUAGE = "TATTOUAGE",
  CILS = "CILS",
  SOINS_DE_LA_PEAU = "SOINS_DE_LA_PEAU",
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

