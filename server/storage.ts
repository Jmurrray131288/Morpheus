import {
  patients,
  medications,
  prescribedMedications,
  visitNotes,
  bodyCompositionEntries,
  cardiovascularHealthEntries,
  metabolicHealthEntries,
  labRecords,
  peptideEntries,
  supplementEntries,
  ivTreatmentEntries,
  genomicReports,
  precisionLabReports,
  precisionTests,
  users,
  type User,
  type UpsertUser,
  type Patient,
  type InsertPatient,
  type Medication,
  type InsertMedication,
  type PrescribedMedication,
  type InsertPrescribedMedication,
  type VisitNote,
  type InsertVisitNote,
  type BodyCompositionEntry,
  type InsertBodyCompositionEntry,
  type CardiovascularHealthEntry,
  type InsertCardiovascularHealthEntry,
  type MetabolicHealthEntry,
  type InsertMetabolicHealthEntry,
  type LabRecord,
  type InsertLabRecord,
  type PeptideEntry,
  type InsertPeptideEntry,
  type SupplementEntry,
  type InsertSupplementEntry,
  type IvTreatmentEntry,
  type InsertIvTreatmentEntry,
  type GenomicReport,
  type InsertGenomicReport,
  type PrecisionLabReport,
  type InsertPrecisionLabReport,
  type PrecisionTest,
  type InsertPrecisionTest,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Patient operations
  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;
  deletePatient(id: string): Promise<void>;

  // Medication operations
  getPatientMedications(patientId: string): Promise<PrescribedMedication[]>;
  createPrescribedMedication(medication: InsertPrescribedMedication): Promise<PrescribedMedication>;
  updatePrescribedMedication(id: string, medication: Partial<InsertPrescribedMedication>): Promise<PrescribedMedication>;
  deletePrescribedMedication(id: string): Promise<void>;

  // Visit notes operations
  getPatientVisitNotes(patientId: string): Promise<VisitNote[]>;
  createVisitNote(note: InsertVisitNote): Promise<VisitNote>;
  updateVisitNote(id: string, note: Partial<InsertVisitNote>): Promise<VisitNote>;
  deleteVisitNote(id: string): Promise<void>;

  // Health metrics operations
  getPatientBodyComposition(patientId: string): Promise<BodyCompositionEntry[]>;
  createBodyCompositionEntry(entry: InsertBodyCompositionEntry): Promise<BodyCompositionEntry>;
  updateBodyCompositionEntry(id: string, entry: Partial<InsertBodyCompositionEntry>): Promise<BodyCompositionEntry>;
  getPatientCardiovascularHealth(patientId: string): Promise<CardiovascularHealthEntry[]>;
  createCardiovascularHealthEntry(entry: InsertCardiovascularHealthEntry): Promise<CardiovascularHealthEntry>;
  getPatientMetabolicHealth(patientId: string): Promise<MetabolicHealthEntry[]>;
  createMetabolicHealthEntry(entry: InsertMetabolicHealthEntry): Promise<MetabolicHealthEntry>;

  // Lab records operations
  getPatientLabRecords(patientId: string): Promise<LabRecord[]>;
  createLabRecord(record: InsertLabRecord): Promise<LabRecord>;
  updateLabRecord(id: string, record: Partial<InsertLabRecord>): Promise<LabRecord>;
  deleteLabRecord(id: string): Promise<void>;

  // Advanced treatments operations
  getPatientPeptides(patientId: string): Promise<PeptideEntry[]>;
  createPeptideEntry(entry: InsertPeptideEntry): Promise<PeptideEntry>;
  getPatientSupplements(patientId: string): Promise<SupplementEntry[]>;
  createSupplementEntry(entry: InsertSupplementEntry): Promise<SupplementEntry>;
  getPatientIvTreatments(patientId: string): Promise<IvTreatmentEntry[]>;
  createIvTreatmentEntry(entry: InsertIvTreatmentEntry): Promise<IvTreatmentEntry>;

  // Precision medicine operations
  getPatientGenomicReports(patientId: string): Promise<GenomicReport[]>;
  createGenomicReport(report: InsertGenomicReport): Promise<GenomicReport>;
  getPatientPrecisionLabReports(patientId: string): Promise<PrecisionLabReport[]>;
  createPrecisionLabReport(report: InsertPrecisionLabReport): Promise<PrecisionLabReport>;
  getPatientPrecisionTests(patientId: string): Promise<PrecisionTest[]>;
  createPrecisionTest(test: InsertPrecisionTest): Promise<PrecisionTest>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userData.id || crypto.randomUUID(),
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.createdAt));
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient> {
    const [updatedPatient] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  async deletePatient(id: string): Promise<void> {
    await db.delete(patients).where(eq(patients.id, id));
  }

  // Medication operations
  async getPatientMedications(patientId: string): Promise<PrescribedMedication[]> {
    return await db
      .select()
      .from(prescribedMedications)
      .where(eq(prescribedMedications.patientId, patientId))
      .orderBy(desc(prescribedMedications.startDate));
  }

  // Removed createMedicationEntry - not needed for production database

  async createPrescribedMedication(medication: InsertPrescribedMedication): Promise<PrescribedMedication> {
    const [newMedication] = await db.insert(prescribedMedications).values(medication).returning();
    return newMedication;
  }

  async updatePrescribedMedication(id: string, medication: Partial<InsertPrescribedMedication>): Promise<PrescribedMedication> {
    const [updatedMedication] = await db
      .update(prescribedMedications)
      .set(medication)
      .where(eq(prescribedMedications.id, id))
      .returning();
    return updatedMedication;
  }

  async deletePrescribedMedication(id: string): Promise<void> {
    await db.delete(prescribedMedications).where(eq(prescribedMedications.id, id));
  }

  // Visit notes operations
  async getPatientVisitNotes(patientId: string): Promise<VisitNote[]> {
    return await db
      .select()
      .from(visitNotes)
      .where(eq(visitNotes.patientId, patientId))
      .orderBy(desc(visitNotes.createdAt));
  }

  async createVisitNote(note: InsertVisitNote): Promise<VisitNote> {
    const [newNote] = await db.insert(visitNotes).values(note).returning();
    return newNote;
  }

  async updateVisitNote(id: string, note: Partial<InsertVisitNote>): Promise<VisitNote> {
    const [updatedNote] = await db
      .update(visitNotes)
      .set(note)
      .where(eq(visitNotes.id, id))
      .returning();
    return updatedNote;
  }

  async deleteVisitNote(id: string): Promise<void> {
    await db.delete(visitNotes).where(eq(visitNotes.id, id));
  }

  // Health metrics operations
  async getPatientBodyComposition(patientId: string): Promise<BodyCompositionEntry[]> {
    const result = await db.execute(sql`
      SELECT id, patient_id, entry_date, height_in, weight_lbs, bmi, bmr, tdee, 
             activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, 
             visceral_fat, vo2_max, notes, sleep, nutrition, created_at, timestamp
      FROM "Body Composition Entries" 
      WHERE patient_id = ${patientId}
      ORDER BY entry_date DESC
    `);
    
    return result.rows.map((row: any) => ({
      id: row.id.toString(),
      patientId: row.patient_id,
      entryDate: row.entry_date,
      heightIn: row.height_in,
      weightLbs: row.weight_lbs,
      bmi: row.bmi,
      bmr: row.bmr,
      tdee: row.tdee,
      activityLevel: row.activity_level,
      bodyFatPerc: row.body_fat_percentage,
      totalBodyFat: row.total_body_fat,
      skeletalMusc: row.skeletal_muscle,
      visceralFat: row.visceral_fat,
      vo2Max: row.vo2_max,
      notes: row.notes,
      sleep: row.sleep,
      nutrition: row.nutrition,
      createdAt: row.created_at,
      timestamp: row.timestamp
    }));
  }

  async createBodyCompositionEntry(entry: InsertBodyCompositionEntry): Promise<BodyCompositionEntry> {
    const result = await db.execute(sql`
      INSERT INTO "Body Composition Entries" (patient_id, entry_date, height_in, weight_lbs, bmi, body_fat_percentage, skeletal_muscle, visceral_fat, notes)
      VALUES (${entry.patientId}, ${entry.entryDate || new Date()}, ${entry.heightIn || 0}, ${entry.weightLbs || 0}, ${entry.bmi || ""}, ${entry.bodyFatPerc || ""}, ${entry.skeletalMusc || ""}, ${entry.visceralFat || ""}, ${entry.notes || ""})
      RETURNING id, patient_id, entry_date, height_in, weight_lbs, bmi, bmr, tdee, 
                activity_level, body_fat_percentage, total_body_fat, skeletal_muscle, 
                visceral_fat, vo2_max, notes, sleep, nutrition, created_at, timestamp
    `);
    
    const row = result.rows[0] as any;
    return {
      id: row.id.toString(),
      patientId: row.patient_id,
      entryDate: row.entry_date,
      heightIn: row.height_in,
      weightLbs: row.weight_lbs,
      bmi: row.bmi,
      bmr: row.bmr,
      tdee: row.tdee,
      activityLevel: row.activity_level,
      bodyFatPerc: row.body_fat_percentage,
      totalBodyFat: row.total_body_fat,
      skeletalMusc: row.skeletal_muscle,
      visceralFat: row.visceral_fat,
      vo2Max: row.vo2_max,
      notes: row.notes,
      sleep: row.sleep,
      nutrition: row.nutrition,
      createdAt: row.created_at,
      timestamp: row.timestamp
    };
  }

  async updateBodyCompositionEntry(id: string, entry: Partial<InsertBodyCompositionEntry>): Promise<BodyCompositionEntry> {
    const [updatedEntry] = await db
      .update(bodyCompositionEntries)
      .set(entry)
      .where(eq(bodyCompositionEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async getPatientCardiovascularHealth(patientId: string): Promise<CardiovascularHealthEntry[]> {
    const result = await db.execute(sql`
      SELECT id, patient_id, entry_date, lipids, blood_pressure, inflammation, 
             other_markers, risk_factors, medications, interventions, created_at, timestamp
      FROM cardiovascular 
      WHERE patient_id = ${patientId}
      ORDER BY entry_date DESC
    `);
    
    return result.rows.map((row: any) => ({
      id: row.id.toString(),
      patientId: row.patient_id,
      entryDate: row.entry_date,
      lipids: row.lipids,
      bloodPressure: row.blood_pressure,
      inflammation: row.inflammation,
      otherMarkers: row.other_markers,
      riskFactors: row.risk_factors,
      medications: row.medications,
      interventions: row.interventions,
      createdAt: row.created_at,
      timestamp: row.timestamp
    }));
  }

  async createCardiovascularHealthEntry(entry: InsertCardiovascularHealthEntry): Promise<CardiovascularHealthEntry> {
    const result = await db.execute(sql`
      INSERT INTO cardiovascular (patient_id, entry_date, lipids, blood_pressure, inflammation)
      VALUES (${entry.patientId}, ${entry.entryDate || new Date()}, ${entry.lipids || {}}, ${entry.bloodPressure || 120}, ${entry.inflammation || {}})
      RETURNING id, patient_id, entry_date, lipids, blood_pressure, inflammation, 
                other_markers, risk_factors, medications, interventions, created_at, timestamp
    `);
    
    const row = result.rows[0] as any;
    return {
      id: row.id.toString(),
      patientId: row.patient_id,
      entryDate: row.entry_date,
      lipids: row.lipids,
      bloodPressure: row.blood_pressure,
      inflammation: row.inflammation,
      otherMarkers: row.other_markers,
      riskFactors: row.risk_factors,
      medications: row.medications,
      interventions: row.interventions,
      createdAt: row.created_at,
      timestamp: row.timestamp
    };
  }

  async getPatientMetabolicHealth(patientId: string): Promise<MetabolicHealthEntry[]> {
    const result = await db.execute(sql`
      SELECT id, patient_id, entry_date, glucose_metrics, metabolic_markers, 
             weight_management, glp1_therapy, interventions, created_at, timestamp
      FROM metabaolic 
      WHERE patient_id = ${patientId}
      ORDER BY entry_date DESC
    `);
    
    return result.rows.map((row: any) => ({
      id: row.id.toString(),
      patientId: row.patient_id,
      entryDate: row.entry_date,
      glucoseMetrics: row.glucose_metrics,
      metabolicMarkers: row.metabolic_markers,
      weightManagement: row.weight_management,
      glp1Therapy: row.glp1_therapy,
      interventions: row.interventions,
      createdAt: row.created_at,
      timestamp: row.timestamp
    }));
  }

  async createMetabolicHealthEntry(entry: InsertMetabolicHealthEntry): Promise<MetabolicHealthEntry> {
    const result = await db.execute(sql`
      INSERT INTO metabaolic (patient_id, entry_date, glucose_metrics, metabolic_markers, weight_management)
      VALUES (${entry.patientId}, ${entry.entryDate || new Date()}, ${entry.glucoseMetrics || ""}, ${entry.metabolicMarkers || ""}, ${entry.weightManagement || ""})
      RETURNING id, patient_id, entry_date, glucose_metrics, metabolic_markers, 
                weight_management, glp1_therapy, interventions, created_at, timestamp
    `);
    
    const row = result.rows[0] as any;
    return {
      id: row.id.toString(),
      patientId: row.patient_id,
      entryDate: row.entry_date,
      glucoseMetrics: row.glucose_metrics,
      metabolicMarkers: row.metabolic_markers,
      weightManagement: row.weight_management,
      glp1Therapy: row.glp1_therapy,
      interventions: row.interventions,
      createdAt: row.created_at,
      timestamp: row.timestamp
    };
  }

  // Lab records operations
  async getPatientLabRecords(patientId: string): Promise<LabRecord[]> {
    return await db
      .select()
      .from(labRecords)
      .where(eq(labRecords.patientId, patientId))
      .orderBy(desc(labRecords.recordDate));
  }

  async createLabRecord(record: InsertLabRecord): Promise<LabRecord> {
    const [newRecord] = await db.insert(labRecords).values(record).returning();
    return newRecord;
  }

  async updateLabRecord(id: string, record: Partial<InsertLabRecord>): Promise<LabRecord> {
    const [updatedRecord] = await db
      .update(labRecords)
      .set(record)
      .where(eq(labRecords.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteLabRecord(id: string): Promise<void> {
    await db.delete(labRecords).where(eq(labRecords.id, id));
  }

  // Advanced treatments operations
  async getPatientPeptides(patientId: string): Promise<PeptideEntry[]> {
    return await db
      .select()
      .from(peptideEntries)
      .where(eq(peptideEntries.patientId, patientId))
      .orderBy(desc(peptideEntries.startDate));
  }

  async createPeptideEntry(entry: InsertPeptideEntry): Promise<PeptideEntry> {
    const [newEntry] = await db.insert(peptideEntries).values(entry).returning();
    return newEntry;
  }

  async getPatientSupplements(patientId: string): Promise<SupplementEntry[]> {
    return await db
      .select()
      .from(supplementEntries)
      .where(eq(supplementEntries.patientId, patientId));
  }

  async createSupplementEntry(entry: InsertSupplementEntry): Promise<SupplementEntry> {
    const [newEntry] = await db.insert(supplementEntries).values(entry).returning();
    return newEntry;
  }

  async getPatientIvTreatments(patientId: string): Promise<IvTreatmentEntry[]> {
    return await db
      .select()
      .from(ivTreatmentEntries)
      .where(eq(ivTreatmentEntries.patientId, patientId));
  }

  async createIvTreatmentEntry(entry: InsertIvTreatmentEntry): Promise<IvTreatmentEntry> {
    const [newEntry] = await db.insert(ivTreatmentEntries).values(entry).returning();
    return newEntry;
  }

  // Precision medicine operations
  async getPatientGenomicReports(patientId: string): Promise<GenomicReport[]> {
    return await db
      .select()
      .from(genomicReports)
      .where(eq(genomicReports.patientId, patientId))
      .orderBy(desc(genomicReports.reportDate));
  }

  async createGenomicReport(report: InsertGenomicReport): Promise<GenomicReport> {
    const [newReport] = await db.insert(genomicReports).values(report).returning();
    return newReport;
  }

  async getPatientPrecisionLabReports(patientId: string): Promise<PrecisionLabReport[]> {
    return await db
      .select()
      .from(precisionLabReports)
      .where(eq(precisionLabReports.patientId, patientId))
      .orderBy(desc(precisionLabReports.reportDate));
  }

  async createPrecisionLabReport(report: InsertPrecisionLabReport): Promise<PrecisionLabReport> {
    const [newReport] = await db.insert(precisionLabReports).values(report).returning();
    return newReport;
  }

  async getPatientPrecisionTests(patientId: string): Promise<PrecisionTest[]> {
    return await db
      .select()
      .from(precisionTests)
      .where(eq(precisionTests.patientId, patientId))
      .orderBy(desc(precisionTests.testDate));
  }

  async createPrecisionTest(test: InsertPrecisionTest): Promise<PrecisionTest> {
    const [newTest] = await db.insert(precisionTests).values(test).returning();
    return newTest;
  }
}

export const storage = new DatabaseStorage();
