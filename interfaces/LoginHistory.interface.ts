export interface LoginHistory {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface LoginHistoryWithUser extends LoginHistory {
  user: User;
}

export interface LoginHistoryCreate {
  userId: string;
  ipAddress: string;
  userAgent: string;
}

export interface ILoginHistoryUpdate {
  ipAddress?: string;
  userAgent?: string;
}

// Import nécessaire pour la relation
import type { User } from './User.interface';
