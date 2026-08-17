export const enum UserRole {
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
}

export interface StoredCredentials {
  userId: string;
  email: string;
  passwordHash: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
