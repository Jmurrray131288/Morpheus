// Clean TypeScript interfaces for Morpheus EMR
// No Drizzle ORM dependencies - uses direct Supabase client

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  created_at: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface PrescribedMedication {
  id: number;
  patient_id?: string;
  name?: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  start_date?: string;
  status?: string;
  discontinuation_reason?: string;
  discontinuation_date?: string;
  discontinued_by?: string;
}

export interface VisitNote {
  id: number;
  created_at: string;
  patient_id?: string;
  note?: string;
}

export interface BodyCompositionEntry {
  id: number;
  created_at: string;
  patient_id?: string;
  entry_date?: string;
  height_in?: number;
  weight_lbs?: number;
  bmi?: string;
  bmr?: string;
  tdee?: string;
  activity_level?: string;
  body_fat_percentage?: string;
  total_body_fat?: string;
  skeletal_muscle?: string;
  visceral_fat?: string;
  vo2_max?: string;
  notes?: string;
  sleep?: string;
  nutrition?: string;
  timestamp?: string;
}

export interface CardiovascularEntry {
  id: number;
  created_at: string;
  patient_id?: string;
  entry_date?: string;
  lipids?: any;
  blood_pressure?: number;
  inflammation?: any;
  other_markers?: any;
  risk_factors?: any;
  medications?: any;
  interventions?: any;
  timestamp?: string;
}

export interface MetabolicEntry {
  id: number;
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
  id: number;
  created_at: string;
  patient_id?: string;
  test_name?: string;
  result_value?: string;
  unit?: string;
  reference_range?: string;
  collected_at?: string;
  panels?: any;
  pdf_reports?: any;
  timestamp?: string;
}

export interface PeptideEntry {
  id: number;
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
  id: number;
  created_at: string;
  name?: string;
  dosage?: string;
  details?: any;
  patient_id?: string;
}

export interface IvTreatmentEntry {
  id: number;
  name?: string;
  components?: any;
  patient_id?: string;
}

// User authentication interfaces
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'staff';
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  patientIds?: string[];
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

export interface LoginCredentials {
  email: string;
  password: string;
}
