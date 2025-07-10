import { executeQuery } from './supabase';
import bcrypt from 'bcrypt';
import { RLSUser } from './rls';
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
  const userId = randomUUID();
  
  const result = await executeQuery(
    `INSERT INTO users (id, email, password_hash, role, first_name, last_name, organization_id, patient_ids) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING *`,
    [
      userId,
      userData.email,
      hashedPassword,
      userData.role,
      userData.firstName || null,
      userData.lastName || null,
      userData.organizationId || null,
      userData.patientIds || null
    ]
  );

  const user = result[0];
  return {
    id: user.id,
    email: user.email,
    role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
    firstName: user.first_name || undefined,
    lastName: user.last_name || undefined,
    organizationId: user.organization_id || undefined,
    patientIds: user.patient_ids || undefined
  };
}

/**
 * Authenticate user login
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthenticatedUser | null> {
  try {
    const result = await executeQuery(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [credentials.email]
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    const passwordValid = await verifyPassword(credentials.password, user.password_hash);
    if (!passwordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.first_name || undefined,
      lastName: user.last_name || undefined,
      organizationId: user.organization_id || undefined,
      patientIds: user.patient_ids || undefined
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
    const result = await executeQuery(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id]
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.first_name || undefined,
      lastName: user.last_name || undefined,
      organizationId: user.organization_id || undefined,
      patientIds: user.patient_ids || undefined
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
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    
    if (updates.password) {
      fields.push(`password_hash = $${paramIndex++}`);
      values.push(await hashPassword(updates.password));
    }

    if (updates.role) {
      fields.push(`role = $${paramIndex++}`);
      values.push(updates.role);
    }

    if (updates.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(updates.firstName);
    }

    if (updates.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(updates.lastName);
    }

    if (updates.organizationId !== undefined) {
      fields.push(`organization_id = $${paramIndex++}`);
      values.push(updates.organizationId);
    }

    if (updates.patientIds !== undefined) {
      fields.push(`patient_ids = $${paramIndex++}`);
      values.push(updates.patientIds);
    }

    if (fields.length === 0) {
      return await getUserById(id);
    }

    values.push(id);
    const result = await executeQuery(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.first_name || undefined,
      lastName: user.last_name || undefined,
      organizationId: user.organization_id || undefined,
      patientIds: user.patient_ids || undefined
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
    await executeQuery('DELETE FROM users WHERE id = $1', [id]);
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
    const result = await executeQuery('SELECT * FROM users');
    
    return result.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role as 'admin' | 'doctor' | 'nurse' | 'staff',
      firstName: user.first_name || undefined,
      lastName: user.last_name || undefined,
      organizationId: user.organization_id || undefined,
      patientIds: user.patient_ids || undefined
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
    const existingUsers = await executeQuery('SELECT id FROM users LIMIT 1');
    
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
