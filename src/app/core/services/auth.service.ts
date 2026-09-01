import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthSession, StoredCredentials, User, UserRole } from '../models/user.model';
import { forkJoin, from, map, Observable, of, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { generateId, nowIso } from '../../shared/utils/id.utils';
import { SEED_CREDENTIALS, SEED_USERS } from '../../data/seed-data';

export interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
}

export interface LoginUser {
  email: string;
  password: string;
}

const USERS_KEY = 'renthub_users';
const CREDENTIALS_KEY = 'renthub_credentials';
const SESSION_KEY = 'renthub_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageService = inject(StorageService);
  currentUser = signal<User | null>(this.getStoredSession()?.user ?? null);

  isAuthenticated = computed(() => this.currentUser() !== null);
  isLandlord = computed(() => this.currentUser()?.role === UserRole.LANDLORD);
  isTenant = computed(() => this.currentUser()?.role === UserRole.TENANT);

  constructor() {
    this.seedDataAsync().subscribe();
  }

  private seedDataAsync(): Observable<boolean> {
    const existingUsers = this.getUsers();
    if (existingUsers.length > 0) {
      return of(false);
    }

    // Convert plain text seed passwords to hashes asynchronously
    const hashRequests$ = SEED_CREDENTIALS.map((cred) =>
      this.hash(cred.passwordHash).pipe(
        map((passwordHash) => ({
          userId: cred.userId,
          email: cred.email,
          passwordHash,
        }))
      )
    );

    return forkJoin(hashRequests$).pipe(
      map((hashedCredentials) => {
        this.storageService.setItem<User[]>(USERS_KEY, SEED_USERS);
        this.storageService.setItem<StoredCredentials[]>(CREDENTIALS_KEY, hashedCredentials);
        return true;
      })
    );
  }

  register(user: RegisterUser): Observable<User> {
    const existingUsers = this.getUsers();

    const userExists = existingUsers.some((u) => u.email === user.email);

    if (userExists) {
      throw new Error('User with this email already exists');
    }

    const existingCredentials = this.getCredentials();

    const newUser: User = {
      id: generateId('user'),
      email: user.email,
      firstName: user.firstName,
      lastName: user?.lastName,
      role: user.role,
      createdAt: nowIso(),
    };

    return this.hash(user.password).pipe(
      map((passwordHash) => {
        const newCredentials: StoredCredentials = {
          userId: newUser.id,
          email: user.email,
          passwordHash,
        };

        this.storageService.setItem<User[]>(USERS_KEY, [...existingUsers, newUser]);

        this.storageService.setItem<StoredCredentials[]>(CREDENTIALS_KEY, [
          ...existingCredentials,
          newCredentials,
        ]);

        return newUser;
      }),
    );
  }

  login(user: LoginUser): Observable<User> {
    const existingUsers = this.getUsers();
    const existingCredentials = this.getCredentials();

    const credentials = existingCredentials.find((c) => c.email === user.email);

    if (!credentials) {
      return throwError(() => new Error('Invalid credentials'));
    }

    const isMatch = this.verify(user.password, credentials.passwordHash);

    if (!isMatch) {
      return throwError(() => new Error('Invalid credentials'));
    }

    const loggedInUser = existingUsers.find((u) => u.id === credentials.userId);

    if (!loggedInUser) {
      return throwError(() => new Error('User not found'));
    }

    this.startSession(loggedInUser);

    return of(loggedInUser);
  }

  logout(): void{
    this.storageService.removeItem(SESSION_KEY);
    this.currentUser.set(null);
  }

  getUsers(): User[] {
    return this.storageService.getItem<User[]>(USERS_KEY) || [];
  }

  getCredentials(): StoredCredentials[] {
    return this.storageService.getItem<StoredCredentials[]>(CREDENTIALS_KEY) || [];
  }

  startSession(user: User): void {
    const session: AuthSession = {
      user,
      token: generateId('token'),
    };
    this.storageService.setItem<AuthSession>(SESSION_KEY, session);
    this.currentUser.set(user);
  }

  hash(password: string): Observable<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashPromise = crypto.subtle.digest('SHA-256', data);

    return from(hashPromise).pipe(
      map((hashBuffer) =>
        Array.from(new Uint8Array(hashBuffer))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join(''),
      ),
    );
  }

  verify(password: string, storedHash: string): Observable<boolean> {
    return this.hash(password).pipe(map((hash) => hash === storedHash));
  }

  getStoredSession(): AuthSession | null {
    return this.storageService.getItem<AuthSession>(SESSION_KEY);
  }

  getUserById(userId: string): User | undefined {
    const users = this.storageService.getItem<User[]>(USERS_KEY) ?? [];
    return users.find((u) => u.id === userId);
  }

  getDisplayName(userId: string): string {
    return this.getUserById(userId)?.firstName ?? 'Unknown user';
  }
}
