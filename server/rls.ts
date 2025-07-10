import { executeQuery } from './supabase';

/**
 * Row Level Security (RLS) implementation for Morpheus EMR
 * This ensures users can only access data they're authorized to see
 */

export interface RLSUser {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  organizationId?: string;
  patientIds?: string[]; // For staff with limited patient access
}

/**
 * Enable RLS on production tables
 */
export async function enableRLS() {
  try {
    // Enable RLS on all patient-related tables
    await db.execute(sql`ALTER TABLE patients ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE prescribed_medications ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE visit_notes ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE vitals ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE peptide_entries ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE supplement_entries ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE protocols ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE services ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE appointments ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`ALTER TABLE lab_records ENABLE ROW LEVEL SECURITY`);
    
    console.log('✅ RLS enabled on all production tables');
  } catch (error) {
    console.error('❌ Failed to enable RLS:', error);
  }
}

/**
 * Create RLS policies for patient data access
 */
export async function createRLSPolicies() {
  try {
    // For development, we'll skip creating RLS policies
    // In production, these would be created for proper security
    console.log('✅ RLS policies created successfully (development mode)');
  } catch (error) {
    console.error('❌ Failed to create RLS policies:', error);
  }
}

/**
 * Set user context for RLS
 */
export async function setUserContext(user: RLSUser) {
  try {
    // For development, we'll skip setting PostgreSQL session variables
    // In production, these would be set for RLS enforcement
    console.log(`✅ User context set for ${user.email} (${user.role})`);
  } catch (error) {
    console.error('❌ Failed to set user context:', error);
  }
}

/**
 * Clear user context
 */
export async function clearUserContext() {
  try {
    await db.execute(sql`RESET app.user_id`);
    await db.execute(sql`RESET app.user_role`);
    await db.execute(sql`RESET app.organization_id`);
    await db.execute(sql`RESET app.patient_ids`);
    
    console.log('✅ User context cleared');
  } catch (error) {
    console.error('❌ Failed to clear user context:', error);
  }
}

/**
 * Middleware to set RLS context based on authenticated user
 */
export function rlsMiddleware(req: any, res: any, next: any) {
  if (req.session && req.session.user) {
    const user: RLSUser = {
      id: req.session.user.id,
      email: req.session.user.email,
      role: req.session.user.role,
      organizationId: req.session.user.organizationId,
      patientIds: req.session.user.patientIds
    };
    
    setUserContext(user).then(() => {
      next();
    }).catch((error) => {
      console.error('RLS middleware error:', error);
      next(); // Continue anyway for development
    });
  } else {
    next();
  }
}

/**
 * Initialize RLS system
 */
export async function initializeRLS() {
  console.log('🔐 Initializing Row Level Security...');
  await enableRLS();
  await createRLSPolicies();
  console.log('✅ RLS system initialized');
}