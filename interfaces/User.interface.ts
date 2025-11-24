import { LoginHistory } from "./LoginHistory.interface";
import { Session } from "./Session.interface";

export interface User {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  createdAt: Date;
  updatedAt: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date | null;
  desactivateAccountDate?: Date | null;
}

export interface UserWithRelations extends User {
  loginHistories: LoginHistory[];
  sessions?: Session | null;
}

export interface UserCreate {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
  desactivateAccountDate?: Date | null;
}
