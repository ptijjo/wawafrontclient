export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
}

export interface LoginAttemptCreate {
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

export interface LoginAttemptUpdate {
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
}
