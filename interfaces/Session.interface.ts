export interface Session {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  jti: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date | null;
}

export interface SessionWithUser extends Session {
  user: User;
}

export interface SessionCreate {
  userId: string;
  userAgent: string;
  ipAddress: string;
  jti: string;
  expiresAt: Date;
}

export interface SessionUpdate {
  userAgent?: string;
  ipAddress?: string;
  expiresAt?: Date;
  isRevoked?: boolean;
  revokedAt?: Date | null;
}

// Import nécessaire pour la relation
import type { User } from './User.interface';
