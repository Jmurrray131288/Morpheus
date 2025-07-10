import { executeQuery } from './supabase';
import type {
  Patient,
  PrescribedMedication,
  VisitNote,
  BodyCompositionEntry,
  CardiovascularEntry,
  MetabolicEntry,
  LabEntry,
  PeptideEntry,
  SupplementEntry,
  IvTreatmentEntry
} from './supabase';

export class SupabaseStorage {
  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await executeQuery('SELECT * FROM patient ORDER BY created_at DESC');
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const result = await executeQuery('SELECT * FROM patient WHERE id = $1', [id]);
    return result[0];
  }

  async createPatient(patient: Partial<Patient>): Promise<Patient> {
    const { first_name, last_name, birth_date, gender, email, phone, address, city, state, zip_code } = patient;
    const result = await executeQuery(`
      INSERT INTO patient (first_name, last_name, birth_date, gender, email, phone, address, city, state, zip_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [first_name, last_name, birth_date, gender, email, phone, address, city, state, zip_code]);
    return result[0];
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    const { first_name, last_name, birth_date, gender, email, phone, address, city, state, zip_code } = patient;
    const result = await executeQuery(`
      UPDATE patient SET 
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        birth_date = COALESCE($4, birth_date),
        gender = COALESCE($5, gender),
        email = COALESCE($6, email),
        phone = COALESCE($7, phone),
        address = COALESCE($8, address),
        city = COALESCE($9, city),
        state = COALESCE($10, state),
        zip_code = COALESCE($11, zip_code)
      WHERE id = $1
      RETURNING *
    `, [id, first_name, last_name, birth_date, gender, email, phone, address, city, state, zip_code]);
    return result[0];
  }

  async deletePatient(id: string): Promise<void> {
    await executeQuery('DELETE FROM patient WHERE id = $1', [id]);
  }

  // Prescribed Medications operations using your exact table structure
  async getPatientMedications(patientId: string): Promise<PrescribedMedication[]> {
    return await executeQuery(`
      SELECT * FROM "Prescribed Medications" 
      WHERE patient_id = $1 
      ORDER BY start_date DESC
    `, [patientId]);
  }

  async createPrescribedMedication(medication: Partial<PrescribedMedication>): Promise<PrescribedMedication> {
    const { patient_id, name, strength, dosage, frequency, duration, instructions, start_date, status } = medication;
    const result = await executeQuery(`
      INSERT INTO "Prescribed Medications" 
      (patient_id, name, strength, dosage, frequency, duration, instructions, start_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [patient_id, name, strength, dosage, frequency, duration, instructions, start_date, status]);
    return result[0];
  }

  async updatePrescribedMedication(id: string, medication: Partial<PrescribedMedication>): Promise<PrescribedMedication> {
    const { name, strength, dosage, frequency, duration, instructions, start_date, status, discontinuation_reason, discontinued_by, discontinuation_date } = medication;
    const result = await executeQuery(`
      UPDATE "Prescribed Medications" SET 
        name = COALESCE($2, name),
        strength = COALESCE($3, strength),
        dosage = COALESCE($4, dosage),
        frequency = COALESCE($5, frequency),
        duration = COALESCE($6, duration),
        instructions = COALESCE($7, instructions),
        start_date = COALESCE($8, start_date),
        status = COALESCE($9, status),
        discontinuation_reason = COALESCE($10, discontinuation_reason),
        discontinued_by = COALESCE($11, discontinued_by),
        discontinuation_date = COALESCE($12, discontinuation_date)
      WHERE id = $1
      RETURNING *
    `, [id, name, strength, dosage, frequency, duration, instructions, start_date, status, discontinuation_reason, discontinued_by, discontinuation_date]);
    return result[0];
  }

  async deletePrescribedMedication(id: string): Promise<void> {
    await executeQuery('DELETE FROM "Prescribed Medications" WHERE id = $1', [id]);
  }

  // Visit Notes operations
  async getPatientVisitNotes(patientId: string): Promise<VisitNote[]> {
    return await executeQuery(`
      SELECT * FROM "Visit Notes" 
      WHERE patient_id = $1 
      ORDER BY created_at DESC
    `, [patientId]);
  }

  async createVisitNote(note: Partial<VisitNote>): Promise<VisitNote> {
    const { patient_id, note: noteText } = note;
    const result = await executeQuery(`
      INSERT INTO "Visit Notes" (patient_id, note)
      VALUES ($1, $2)
      RETURNING *
    `, [patient_id, noteText]);
    return result[0];
  }

  async updateVisitNote(id: string, note: Partial<VisitNote>): Promise<VisitNote> {
    const { note: noteText } = note;
    const result = await executeQuery(`
      UPDATE "Visit Notes" SET note = COALESCE($2, note)
      WHERE id = $1
      RETURNING *
    `, [id, noteText]);
    return result[0];
  }

  async deleteVisitNote(id: string): Promise<void> {
    await executeQuery('DELETE FROM "Visit Notes" WHERE id = $1', [id]);
  }

  // Body Composition operations
  async getPatientBodyComposition(patientId: string): Promise<BodyCompositionEntry[]> {
    return await executeQuery(`
      SELECT * FROM "Body Composition Entries" 
      WHERE patient_id = $1 
      ORDER BY entry_date DESC
    `, [patientId]);
  }

  async createBodyCompositionEntry(entry: Partial<BodyCompositionEntry>): Promise<BodyCompositionEntry> {
    const { patient_id, height_in, weight_lbs, bmi, bmr, tdee, activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, visceral_fat, vo2_max, notes, sleep, nutrition } = entry;
    const result = await executeQuery(`
      INSERT INTO "Body Composition Entries" 
      (patient_id, height_in, weight_lbs, bmi, bmr, tdee, activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, visceral_fat, vo2_max, notes, sleep, nutrition)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [patient_id, height_in, weight_lbs, bmi, bmr, tdee, activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, visceral_fat, vo2_max, notes, sleep, nutrition]);
    return result[0];
  }

  async updateBodyCompositionEntry(id: string, entry: Partial<BodyCompositionEntry>): Promise<BodyCompositionEntry> {
    const { height_in, weight_lbs, bmi, bmr, tdee, activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, visceral_fat, vo2_max, notes, sleep, nutrition } = entry;
    const result = await executeQuery(`
      UPDATE "Body Composition Entries" SET 
        height_in = COALESCE($2, height_in),
        weight_lbs = COALESCE($3, weight_lbs),
        bmi = COALESCE($4, bmi),
        bmr = COALESCE($5, bmr),
        tdee = COALESCE($6, tdee),
        activity_level = COALESCE($7, activity_level),
        body_fat_percentage = COALESCE($8, body_fat_percentage),
        total_body_fat = COALESCE($9, total_body_fat),
        skeletal_muscle = COALESCE($10, skeletal_muscle),
        visceral_fat = COALESCE($11, visceral_fat),
        vo2_max = COALESCE($12, vo2_max),
        notes = COALESCE($13, notes),
        sleep = COALESCE($14, sleep),
        nutrition = COALESCE($15, nutrition)
      WHERE id = $1
      RETURNING *
    `, [id, height_in, weight_lbs, bmi, bmr, tdee, activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, visceral_fat, vo2_max, notes, sleep, nutrition]);
    return result[0];
  }

  // Cardiovascular Health operations
  async getPatientCardiovascularHealth(patientId: string): Promise<CardiovascularEntry[]> {
    return await executeQuery(`
      SELECT * FROM cardiovascular 
      WHERE patient_id = $1 
      ORDER BY entry_date DESC
    `, [patientId]);
  }

  async createCardiovascularHealthEntry(entry: Partial<CardiovascularEntry>): Promise<CardiovascularEntry> {
    const { patient_id, lipids, blood_pressure, inflammation, other_markers, risk_factors, medications, interventions } = entry;
    const result = await executeQuery(`
      INSERT INTO cardiovascular 
      (patient_id, lipids, blood_pressure, inflammation, other_markers, risk_factors, medications, interventions)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [patient_id, JSON.stringify(lipids), blood_pressure, JSON.stringify(inflammation), JSON.stringify(other_markers), JSON.stringify(risk_factors), JSON.stringify(medications), JSON.stringify(interventions)]);
    return result[0];
  }

  // Metabolic Health operations
  async getPatientMetabolicHealth(patientId: string): Promise<MetabolicEntry[]> {
    return await executeQuery(`
      SELECT * FROM metabaolic 
      WHERE patient_id = $1 
      ORDER BY entry_date DESC
    `, [patientId]);
  }

  async createMetabolicHealthEntry(entry: Partial<MetabolicEntry>): Promise<MetabolicEntry> {
    const { patient_id, glucose_metrics, metabolic_markers, weight_management, glp1_therapy, interventions } = entry;
    const result = await executeQuery(`
      INSERT INTO metabaolic 
      (patient_id, glucose_metrics, metabolic_markers, weight_management, glp1_therapy, interventions)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [patient_id, glucose_metrics, metabolic_markers, weight_management, glp1_therapy, interventions]);
    return result[0];
  }

  // Lab Records operations
  async getPatientLabRecords(patientId: string): Promise<LabEntry[]> {
    return await executeQuery(`
      SELECT * FROM labs 
      WHERE patient_id = $1 
      ORDER BY collected_at DESC
    `, [patientId]);
  }

  async createLabRecord(record: Partial<LabEntry>): Promise<LabEntry> {
    const { patient_id, test_name, result_value, unit, reference_range, collected_at, panels, pdf_reports } = record;
    const result = await executeQuery(`
      INSERT INTO labs 
      (patient_id, test_name, result_value, unit, reference_range, collected_at, panels, pdf_reports)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [patient_id, test_name, result_value, unit, reference_range, collected_at, JSON.stringify(panels), JSON.stringify(pdf_reports)]);
    return result[0];
  }

  async updateLabRecord(id: string, record: Partial<LabEntry>): Promise<LabEntry> {
    const { test_name, result_value, unit, reference_range, collected_at, panels, pdf_reports } = record;
    const result = await executeQuery(`
      UPDATE labs SET 
        test_name = COALESCE($2, test_name),
        result_value = COALESCE($3, result_value),
        unit = COALESCE($4, unit),
        reference_range = COALESCE($5, reference_range),
        collected_at = COALESCE($6, collected_at),
        panels = COALESCE($7, panels),
        pdf_reports = COALESCE($8, pdf_reports)
      WHERE id = $1
      RETURNING *
    `, [id, test_name, result_value, unit, reference_range, collected_at, JSON.stringify(panels), JSON.stringify(pdf_reports)]);
    return result[0];
  }

  async deleteLabRecord(id: string): Promise<void> {
    await executeQuery('DELETE FROM labs WHERE id = $1', [id]);
  }

  // Advanced treatments operations
  async getPatientPeptides(patientId: string): Promise<PeptideEntry[]> {
    return await executeQuery(`
      SELECT * FROM "Peptide Entries" 
      WHERE patient_id = $1 
      ORDER BY start_date DESC
    `, [patientId]);
  }

  async createPeptideEntry(entry: Partial<PeptideEntry>): Promise<PeptideEntry> {
    const { name, dosage, frequency, start_date, status, end_date, patient_id } = entry;
    const result = await executeQuery(`
      INSERT INTO "Peptide Entries" 
      (name, dosage, frequency, start_date, status, end_date, patient_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, dosage, frequency, start_date, status, end_date, patient_id]);
    return result[0];
  }

  async getPatientSupplements(patientId: string): Promise<SupplementEntry[]> {
    return await executeQuery(`
      SELECT * FROM "Supplement Entries" 
      WHERE patient_id = $1 
      ORDER BY created_at DESC
    `, [patientId]);
  }

  async createSupplementEntry(entry: Partial<SupplementEntry>): Promise<SupplementEntry> {
    const { name, dosage, details, patient_id } = entry;
    const result = await executeQuery(`
      INSERT INTO "Supplement Entries" 
      (name, dosage, details, patient_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, dosage, JSON.stringify(details), patient_id]);
    return result[0];
  }

  async getPatientIvTreatments(patientId: string): Promise<IvTreatmentEntry[]> {
    return await executeQuery(`
      SELECT * FROM "IV Treatments" 
      WHERE patient_id = $1 
      ORDER BY id DESC
    `, [patientId]);
  }

  async createIvTreatmentEntry(entry: Partial<IvTreatmentEntry>): Promise<IvTreatmentEntry> {
    const { name, components, patient_id } = entry;
    const result = await executeQuery(`
      INSERT INTO "IV Treatments" 
      (name, components, patient_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, JSON.stringify(components), patient_id]);
    return result[0];
  }
}

export const supabaseStorage = new SupabaseStorage();
