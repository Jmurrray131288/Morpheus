import { supabaseStorage } from "./supabaseStorage";
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
} from "./supabase";

// Simple interface for core EMR operations
export interface IStorage {
  // Patient operations
  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: Partial<Patient>): Promise<Patient>;
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient>;
  deletePatient(id: string): Promise<void>;

  // Medication operations
  getPatientMedications(patientId: string): Promise<PrescribedMedication[]>;
  createPrescribedMedication(medication: Partial<PrescribedMedication>): Promise<PrescribedMedication>;
  updatePrescribedMedication(id: string, medication: Partial<PrescribedMedication>): Promise<PrescribedMedication>;
  deletePrescribedMedication(id: string): Promise<void>;

  // Visit notes operations
  getPatientVisitNotes(patientId: string): Promise<VisitNote[]>;
  createVisitNote(note: Partial<VisitNote>): Promise<VisitNote>;
  updateVisitNote(id: string, note: Partial<VisitNote>): Promise<VisitNote>;
  deleteVisitNote(id: string): Promise<void>;

  // Health metrics operations
  getPatientBodyComposition(patientId: string): Promise<BodyCompositionEntry[]>;
  createBodyCompositionEntry(entry: Partial<BodyCompositionEntry>): Promise<BodyCompositionEntry>;
  updateBodyCompositionEntry(id: string, entry: Partial<BodyCompositionEntry>): Promise<BodyCompositionEntry>;
  getPatientCardiovascularHealth(patientId: string): Promise<CardiovascularEntry[]>;
  createCardiovascularHealthEntry(entry: Partial<CardiovascularEntry>): Promise<CardiovascularEntry>;
  getPatientMetabolicHealth(patientId: string): Promise<MetabolicEntry[]>;
  createMetabolicHealthEntry(entry: Partial<MetabolicEntry>): Promise<MetabolicEntry>;

  // Lab records operations
  getPatientLabRecords(patientId: string): Promise<LabEntry[]>;
  createLabRecord(record: Partial<LabEntry>): Promise<LabEntry>;
  updateLabRecord(id: string, record: Partial<LabEntry>): Promise<LabEntry>;
  deleteLabRecord(id: string): Promise<void>;

  // Advanced treatments operations
  getPatientPeptides(patientId: string): Promise<PeptideEntry[]>;
  createPeptideEntry(entry: Partial<PeptideEntry>): Promise<PeptideEntry>;
  getPatientSupplements(patientId: string): Promise<SupplementEntry[]>;
  createSupplementEntry(entry: Partial<SupplementEntry>): Promise<SupplementEntry>;
  getPatientIvTreatments(patientId: string): Promise<IvTreatmentEntry[]>;
  createIvTreatmentEntry(entry: Partial<IvTreatmentEntry>): Promise<IvTreatmentEntry>;
}

// Simple implementation that delegates to SupabaseStorage
export class DatabaseStorage implements IStorage {
  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await supabaseStorage.getPatients();
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return await supabaseStorage.getPatient(id);
  }

  async createPatient(patient: Partial<Patient>): Promise<Patient> {
    return await supabaseStorage.createPatient(patient);
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    return await supabaseStorage.updatePatient(id, patient);
  }

  async deletePatient(id: string): Promise<void> {
    return await supabaseStorage.deletePatient(id);
  }

  // Medication operations
  async getPatientMedications(patientId: string): Promise<PrescribedMedication[]> {
    return await supabaseStorage.getPatientMedications(patientId);
  }

  async createPrescribedMedication(medication: Partial<PrescribedMedication>): Promise<PrescribedMedication> {
    return await supabaseStorage.createPrescribedMedication(medication);
  }

  async updatePrescribedMedication(id: string, medication: Partial<PrescribedMedication>): Promise<PrescribedMedication> {
    return await supabaseStorage.updatePrescribedMedication(id, medication);
  }

  async deletePrescribedMedication(id: string): Promise<void> {
    return await supabaseStorage.deletePrescribedMedication(id);
  }

  // Visit notes operations
  async getPatientVisitNotes(patientId: string): Promise<VisitNote[]> {
    return await supabaseStorage.getPatientVisitNotes(patientId);
  }

  async createVisitNote(note: Partial<VisitNote>): Promise<VisitNote> {
    return await supabaseStorage.createVisitNote(note);
  }

  async updateVisitNote(id: string, note: Partial<VisitNote>): Promise<VisitNote> {
    return await supabaseStorage.updateVisitNote(id, note);
  }

  async deleteVisitNote(id: string): Promise<void> {
    return await supabaseStorage.deleteVisitNote(id);
  }

  // Health metrics operations
  async getPatientBodyComposition(patientId: string): Promise<BodyCompositionEntry[]> {
    return await supabaseStorage.getPatientBodyComposition(patientId);
  }

  async createBodyCompositionEntry(entry: Partial<BodyCompositionEntry>): Promise<BodyCompositionEntry> {
    return await supabaseStorage.createBodyCompositionEntry(entry);
  }

  async updateBodyCompositionEntry(id: string, entry: Partial<BodyCompositionEntry>): Promise<BodyCompositionEntry> {
    return await supabaseStorage.updateBodyCompositionEntry(id, entry);
  }

  async getPatientCardiovascularHealth(patientId: string): Promise<CardiovascularEntry[]> {
    return await supabaseStorage.getPatientCardiovascularHealth(patientId);
  }

  async createCardiovascularHealthEntry(entry: Partial<CardiovascularEntry>): Promise<CardiovascularEntry> {
    return await supabaseStorage.createCardiovascularHealthEntry(entry);
  }

  async getPatientMetabolicHealth(patientId: string): Promise<MetabolicEntry[]> {
    return await supabaseStorage.getPatientMetabolicHealth(patientId);
  }

  async createMetabolicHealthEntry(entry: Partial<MetabolicEntry>): Promise<MetabolicEntry> {
    return await supabaseStorage.createMetabolicHealthEntry(entry);
  }

  // Lab records operations
  async getPatientLabRecords(patientId: string): Promise<LabEntry[]> {
    return await supabaseStorage.getPatientLabRecords(patientId);
  }

  async createLabRecord(record: Partial<LabEntry>): Promise<LabEntry> {
    return await supabaseStorage.createLabRecord(record);
  }

  async updateLabRecord(id: string, record: Partial<LabEntry>): Promise<LabEntry> {
    return await supabaseStorage.updateLabRecord(id, record);
  }

  async deleteLabRecord(id: string): Promise<void> {
    return await supabaseStorage.deleteLabRecord(id);
  }

  // Advanced treatments operations
  async getPatientPeptides(patientId: string): Promise<PeptideEntry[]> {
    return await supabaseStorage.getPatientPeptides(patientId);
  }

  async createPeptideEntry(entry: Partial<PeptideEntry>): Promise<PeptideEntry> {
    return await supabaseStorage.createPeptideEntry(entry);
  }

  async getPatientSupplements(patientId: string): Promise<SupplementEntry[]> {
    return await supabaseStorage.getPatientSupplements(patientId);
  }

  async createSupplementEntry(entry: Partial<SupplementEntry>): Promise<SupplementEntry> {
    return await supabaseStorage.createSupplementEntry(entry);
  }

  async getPatientIvTreatments(patientId: string): Promise<IvTreatmentEntry[]> {
    return await supabaseStorage.getPatientIvTreatments(patientId);
  }

  async createIvTreatmentEntry(entry: Partial<IvTreatmentEntry>): Promise<IvTreatmentEntry> {
    return await supabaseStorage.createIvTreatmentEntry(entry);
  }
}

export const storage = new DatabaseStorage();
