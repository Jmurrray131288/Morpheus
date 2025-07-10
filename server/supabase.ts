import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';

// Direct PostgreSQL connection for compatibility with existing code
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Helper function to execute raw SQL queries
export async function executeQuery(query: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Type definitions matching your exact Prisma schema
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string; // Changed to match your schema
  created_at: string;
  gender?: string;
  email?: string;
  phone?: string; // Changed to match your schema
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface PrescribedMedication {
  id: number; // BigInt in Prisma
  patient_id?: string;
  name?: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  start_date?: string; // Date in Prisma
  status?: string;
  discontinuation_reason?: string;
  discontinued_by?: string; // Fixed field name
  discontinuation_date?: string;
  medication_entry_id?: string;
}

export interface VisitNote {
  id: number; // BigInt in Prisma
  created_at: string;
  patient_id?: string;
  note?: string;
}

export interface BodyCompositionEntry {
  id: number; // BigInt in Prisma
  created_at: string;
  patient_id?: string;
  entry_date?: string;
  height_in?: number;
  weight_lbs?: number;
  bmi?: string;
  bmr?: string;
  tdee?: string;
  activity_level?: string;
  body_fat_percentage?: string; // Correct field name from schema
  total_body_fat?: string;
  skeletal_muscle?: string; // Correct field name from schema
  visceral_fat?: string;
  vo2_max?: string;
  notes?: string;
  sleep?: string;
  nutrition?: string;
  timestamp?: string;
}

export interface CardiovascularEntry {
  id: number; // BigInt in Prisma
  created_at: string;
  patient_id?: string;
  entry_date?: string;
  lipids?: any; // JSON
  blood_pressure?: number;
  inflammation?: any; // JSON
  other_markers?: any; // JSON
  risk_factors?: any; // JSON
  medications?: any; // JSON
  interventions?: any; // JSON
  timestamp?: string;
}

export interface MetabolicEntry {
  id: number; // BigInt in Prisma
  created_at: string;
  patient_id?: string;
  entry_date?: string;
  glucose_metrics?: string;
  metabolic_markers?: string;
  weight_management?: string;
  glp1_therapy?: string;
  interventions?: string;
  timestamp?: string;
}

export interface LabEntry {
  id: number; // BigInt in Prisma
  created_at: string;
  patient_id?: string;
  test_name?: string;
  result_value?: string;
  unit?: string;
  reference_range?: string;
  collected_at?: string;
  panels?: any; // JSON
  pdf_reports?: any; // JSON
  timestamp?: string;
}

export interface PeptideEntry {
  id: number; // BigInt in Prisma
  created_at: string;
  name?: string;
  dosage?: string;
  frequency?: string;
  start_date?: string;
  status?: string;
  end_date?: string;
  patient_id?: string;
}

export interface SupplementEntry {
  id: number; // BigInt in Prisma
  created_at: string;
  name?: string;
  dosage?: string;
  details?: any; // JSON
  patient_id?: string;
}

export interface IvTreatmentEntry {
  id: number; // BigInt in Prisma
  name?: string;
  components?: any; // JSON
  patient_id?: string;
}
