import { executeQuery } from './supabase';
import bcrypt from 'bcrypt';
import { RLSUser } from './rls';
import type { AuthUser, CreateUserData, LoginCredentials } from '../shared/schema';
import { randomUUID } from 'crypto';

/**
 * Enhanced authentication system with RLS integration
 */

export interface AuthenticatedUser extends RLSUser {
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  patientIds?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  patientIds?: string[];
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password with bcrypt
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserData): Promise<AuthenticatedUser> {
  const hashedPassword = await hashPassword(userData.password);
  
  const [user] = await db.insert(users).values({
    id: randomUUID(),
    email: userData.email,
    passwordHash: hashedPassword,
    role: userData.role,
    firstName: userData.firstName,
    lastName: userData.lastName,
    organizationId: userData.organizationId,
    patientIds: userData.patientIds,
  }).returning();

  return {
    id: user.id,
    email: user.email,
    role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    organizationId: userData.organizationId,
    patientIds: userData.patientIds
  };
}

/**
 * Authenticate user login
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthenticatedUser | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))
      .limit(1);

    if (!user) {
      return null;
    }

    const passwordValid = await verifyPassword(credentials.password, user.passwordHash);
    if (!passwordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      organizationId: user.organizationId || undefined,
      patientIds: user.patientIds || undefined
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<AuthenticatedUser | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      organizationId: user.organizationId || undefined,
      patientIds: user.patientIds || undefined
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Update user data
 */
export async function updateUser(id: string, updates: Partial<CreateUserData>): Promise<AuthenticatedUser | null> {
  try {
    const updateData: any = { ...updates };
    
    if (updates.password) {
      updateData.passwordHash = await hashPassword(updates.password);
      delete updateData.password;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      organizationId: user.organizationId || undefined,
      patientIds: user.patientIds || undefined
    };
  } catch (error) {
    console.error('Update user error:', error);
    return null;
  }
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await db.delete(users).where(eq(users.id, id));
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<AuthenticatedUser[]> {
  try {
    const userList = await db.select().from(users);
    
    return userList.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      organizationId: user.organizationId || undefined,
      patientIds: user.patientIds || undefined
    }));
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
}

/**
 * Create default admin user if none exists
 */
export async function createDefaultAdmin(): Promise<void> {
  try {
    const existingUsers = await db.select().from(users).limit(1);
    
    if (existingUsers.length === 0) {
      const defaultAdmin = {
        email: 'admin@morpheus.local',
        password: 'admin123',
        role: 'admin' as const,
        firstName: 'System',
        lastName: 'Administrator'
      };

      await createUser(defaultAdmin);
      console.log('✅ Default admin user created: admin@morpheus.local / admin123');
    }
  } catch (error) {
    console.error('❌ Failed to create default admin:', error);
  }
}