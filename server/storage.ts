import {
  patients,
  medicationEntries,
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
  type MedicationEntry,
  type InsertMedicationEntry,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Patient operations
  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;
  deletePatient(id: string): Promise<void>;

  // Medication operations
  getPatientMedications(patientId: string): Promise<PrescribedMedication[]>;
  createMedicationEntry(entry: InsertMedicationEntry): Promise<MedicationEntry>;
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

  async createMedicationEntry(entry: InsertMedicationEntry): Promise<MedicationEntry> {
    const [newEntry] = await db.insert(medicationEntries).values(entry).returning();
    return newEntry;
  }

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
    return await db
      .select()
      .from(bodyCompositionEntries)
      .where(eq(bodyCompositionEntries.patientId, patientId))
      .orderBy(desc(bodyCompositionEntries.entryDate));
  }

  async createBodyCompositionEntry(entry: InsertBodyCompositionEntry): Promise<BodyCompositionEntry> {
    const [newEntry] = await db.insert(bodyCompositionEntries).values(entry).returning();
    return newEntry;
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
    return await db
      .select()
      .from(cardiovascularHealthEntries)
      .where(eq(cardiovascularHealthEntries.patientId, patientId))
      .orderBy(desc(cardiovascularHealthEntries.entryDate));
  }

  async createCardiovascularHealthEntry(entry: InsertCardiovascularHealthEntry): Promise<CardiovascularHealthEntry> {
    const [newEntry] = await db.insert(cardiovascularHealthEntries).values(entry).returning();
    return newEntry;
  }

  async getPatientMetabolicHealth(patientId: string): Promise<MetabolicHealthEntry[]> {
    return await db
      .select()
      .from(metabolicHealthEntries)
      .where(eq(metabolicHealthEntries.patientId, patientId))
      .orderBy(desc(metabolicHealthEntries.entryDate));
  }

  async createMetabolicHealthEntry(entry: InsertMetabolicHealthEntry): Promise<MetabolicHealthEntry> {
    const [newEntry] = await db.insert(metabolicHealthEntries).values(entry).returning();
    return newEntry;
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
      .select({
        id: peptideEntries.id,
        medicationEntryId: peptideEntries.medicationEntryId,
        name: peptideEntries.name,
        dosage: peptideEntries.dosage,
        frequency: peptideEntries.frequency,
        startDate: peptideEntries.startDate,
        status: peptideEntries.status,
      })
      .from(peptideEntries)
      .innerJoin(medicationEntries, eq(peptideEntries.medicationEntryId, medicationEntries.id))
      .where(eq(medicationEntries.patientId, patientId))
      .orderBy(desc(peptideEntries.startDate));
  }

  async createPeptideEntry(entry: InsertPeptideEntry): Promise<PeptideEntry> {
    const [newEntry] = await db.insert(peptideEntries).values(entry).returning();
    return newEntry;
  }

  async getPatientSupplements(patientId: string): Promise<SupplementEntry[]> {
    return await db
      .select({
        id: supplementEntries.id,
        medicationEntryId: supplementEntries.medicationEntryId,
        name: supplementEntries.name,
        dosage: supplementEntries.dosage,
        details: supplementEntries.details,
      })
      .from(supplementEntries)
      .innerJoin(medicationEntries, eq(supplementEntries.medicationEntryId, medicationEntries.id))
      .where(eq(medicationEntries.patientId, patientId));
  }

  async createSupplementEntry(entry: InsertSupplementEntry): Promise<SupplementEntry> {
    const [newEntry] = await db.insert(supplementEntries).values(entry).returning();
    return newEntry;
  }

  async getPatientIvTreatments(patientId: string): Promise<IvTreatmentEntry[]> {
    return await db
      .select({
        id: ivTreatmentEntries.id,
        medicationEntryId: ivTreatmentEntries.medicationEntryId,
        name: ivTreatmentEntries.name,
        components: ivTreatmentEntries.components,
      })
      .from(ivTreatmentEntries)
      .innerJoin(medicationEntries, eq(ivTreatmentEntries.medicationEntryId, medicationEntries.id))
      .where(eq(medicationEntries.patientId, patientId));
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
