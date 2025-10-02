export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string | null;
  birth_date?: Date;
  country?: string;
  is_verified: boolean;
  verification_token?: string;
  failed_attempts: number;
  account_locked: boolean;
  last_login?: Date;
  locked_until?: Date;
  firebase_uid?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPasswordReset {
  id: number;
  user_id: number;
  reset_token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  update(id: number, userData: Partial<IUser>): Promise<IUser>;
  delete(id: number): Promise<boolean>;
  updateLastLogin(id: number): Promise<void>;
  updateFailedAttempts(id: number, attempts: number, locked?: boolean, lockedUntil?: Date): Promise<void>;
  getPasswordHistory(userId: number): Promise<string[]>;
  addPasswordToHistory(userId: number, passwordHash: string): Promise<void>;
}

export interface IPasswordResetRepository {
  create(resetData: Partial<IPasswordReset>): Promise<IPasswordReset>;
  findByToken(token: string): Promise<IPasswordReset | null>;
  markAsUsed(id: number): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}

export interface ILogoutLog {
  id: number;
  user_id: number;
  logout_time: Date;
  ip_address?: string;
  user_agent?: string;
  session_duration?: string;
  created_at: Date;
}

export interface ILogoutLogRepository {
  create(logoutData: Partial<ILogoutLog>): Promise<ILogoutLog>;
  findByUserId(userId: number, limit?: number): Promise<ILogoutLog[]>;
  getLastLoginTime(userId: number): Promise<Date | null>;
}
