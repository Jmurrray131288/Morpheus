import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uuid,
  doublePrecision,
  integer,
  boolean,
  date
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Records Schema
export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: varchar("gender"),
  contactNumber: varchar("contact_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicationEntries = pgTable("medication_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const prescribedMedications = pgTable("prescribed_medications", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationEntryId: uuid("medication_entry_id").notNull(),
  patientId: uuid("patient_id").notNull(),
  name: varchar("name").notNull(),
  strength: varchar("strength"),
  dosage: varchar("dosage"),
  frequency: varchar("frequency"),
  startDate: date("start_date"),
  status: varchar("status"),
});

export const visitNotes = pgTable("visit_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bodyCompositionEntries = pgTable("body_composition_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  entryDate: timestamp("entry_date").notNull(),
  height: doublePrecision("height"),
  heightInches: doublePrecision("height_inches"),
  weight: doublePrecision("weight"),
  weightPounds: doublePrecision("weight_pounds"),
  bmi: doublePrecision("bmi"),
  bmr: integer("bmr"),
  tdee: integer("tdee"),
  activityLevel: varchar("activity_level"),
  bodyFatPercentage: doublePrecision("body_fat_percentage"),
  totalBodyFat: doublePrecision("total_body_fat"),
  skeletalMuscle: doublePrecision("skeletal_muscle"),
  visceralFat: doublePrecision("visceral_fat"),
  vo2Max: doublePrecision("vo2_max"),
  notes: text("notes"),
  sleep: jsonb("sleep"),
  nutrition: jsonb("nutrition"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const cardiovascularHealthEntries = pgTable("cardiovascular_health_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  entryDate: timestamp("entry_date").notNull(),
  lipids: jsonb("lipids"),
  bloodPressure: jsonb("blood_pressure"),
  inflammation: jsonb("inflammation"),
  otherMarkers: jsonb("other_markers"),
  riskFactors: jsonb("risk_factors"),
  medications: jsonb("medications"),
  interventions: jsonb("interventions"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const metabolicHealthEntries = pgTable("metabolic_health_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  entryDate: timestamp("entry_date").notNull(),
  glucoseMetrics: jsonb("glucose_metrics"),
  metabolicMarkers: jsonb("metabolic_markers"),
  weightManagement: jsonb("weight_management"),
  glp1Therapy: jsonb("glp1_therapy"),
  interventions: jsonb("interventions"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const labRecords = pgTable("lab_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  recordDate: timestamp("record_date").notNull(),
  panels: jsonb("panels"),
  pdfReports: jsonb("pdf_reports"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const peptideEntries = pgTable("peptide_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationEntryId: uuid("medication_entry_id").notNull(),
  name: varchar("name"),
  dosage: varchar("dosage"),
  frequency: varchar("frequency"),
  startDate: date("start_date"),
  status: varchar("status"),
});

export const otherMedicationEntries = pgTable("other_medication_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationEntryId: uuid("medication_entry_id").notNull(),
  name: varchar("name"),
  details: jsonb("details"),
});

export const ivTreatmentEntries = pgTable("iv_treatment_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationEntryId: uuid("medication_entry_id").notNull(),
  name: varchar("name"),
  components: jsonb("components"),
});

export const supplementEntries = pgTable("supplement_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationEntryId: uuid("medication_entry_id").notNull(),
  name: varchar("name"),
  dosage: varchar("dosage"),
  details: jsonb("details"),
});

export const genomicReports = pgTable("genomic_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  reportDate: date("report_date"),
  reportData: jsonb("report_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const precisionLabReports = pgTable("precision_lab_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  reportDate: date("report_date"),
  reportData: jsonb("report_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const precisionTests = pgTable("precision_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  testDate: date("test_date"),
  testType: varchar("test_type"),
  testResult: jsonb("test_result"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const patientsRelations = relations(patients, ({ many }) => ({
  medicationEntries: many(medicationEntries),
  prescribedMedications: many(prescribedMedications),
  visitNotes: many(visitNotes),
  bodyCompositionEntries: many(bodyCompositionEntries),
  cardiovascularHealthEntries: many(cardiovascularHealthEntries),
  metabolicHealthEntries: many(metabolicHealthEntries),
  labRecords: many(labRecords),
  genomicReports: many(genomicReports),
  precisionLabReports: many(precisionLabReports),
  precisionTests: many(precisionTests),
}));

export const medicationEntriesRelations = relations(medicationEntries, ({ one, many }) => ({
  patient: one(patients, {
    fields: [medicationEntries.patientId],
    references: [patients.id],
  }),
  prescribedMedications: many(prescribedMedications),
  peptideEntries: many(peptideEntries),
  otherMedicationEntries: many(otherMedicationEntries),
  ivTreatmentEntries: many(ivTreatmentEntries),
  supplementEntries: many(supplementEntries),
}));

export const prescribedMedicationsRelations = relations(prescribedMedications, ({ one }) => ({
  medicationEntry: one(medicationEntries, {
    fields: [prescribedMedications.medicationEntryId],
    references: [medicationEntries.id],
  }),
  patient: one(patients, {
    fields: [prescribedMedications.patientId],
    references: [patients.id],
  }),
}));

export const visitNotesRelations = relations(visitNotes, ({ one }) => ({
  patient: one(patients, {
    fields: [visitNotes.patientId],
    references: [patients.id],
  }),
}));

export const bodyCompositionEntriesRelations = relations(bodyCompositionEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [bodyCompositionEntries.patientId],
    references: [patients.id],
  }),
}));

export const cardiovascularHealthEntriesRelations = relations(cardiovascularHealthEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [cardiovascularHealthEntries.patientId],
    references: [patients.id],
  }),
}));

export const metabolicHealthEntriesRelations = relations(metabolicHealthEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [metabolicHealthEntries.patientId],
    references: [patients.id],
  }),
}));

export const labRecordsRelations = relations(labRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [labRecords.patientId],
    references: [patients.id],
  }),
}));

export const peptideEntriesRelations = relations(peptideEntries, ({ one }) => ({
  medicationEntry: one(medicationEntries, {
    fields: [peptideEntries.medicationEntryId],
    references: [medicationEntries.id],
  }),
}));

export const otherMedicationEntriesRelations = relations(otherMedicationEntries, ({ one }) => ({
  medicationEntry: one(medicationEntries, {
    fields: [otherMedicationEntries.medicationEntryId],
    references: [medicationEntries.id],
  }),
}));

export const ivTreatmentEntriesRelations = relations(ivTreatmentEntries, ({ one }) => ({
  medicationEntry: one(medicationEntries, {
    fields: [ivTreatmentEntries.medicationEntryId],
    references: [medicationEntries.id],
  }),
}));

export const supplementEntriesRelations = relations(supplementEntries, ({ one }) => ({
  medicationEntry: one(medicationEntries, {
    fields: [supplementEntries.medicationEntryId],
    references: [medicationEntries.id],
  }),
}));

export const genomicReportsRelations = relations(genomicReports, ({ one }) => ({
  patient: one(patients, {
    fields: [genomicReports.patientId],
    references: [patients.id],
  }),
}));

export const precisionLabReportsRelations = relations(precisionLabReports, ({ one }) => ({
  patient: one(patients, {
    fields: [precisionLabReports.patientId],
    references: [patients.id],
  }),
}));

export const precisionTestsRelations = relations(precisionTests, ({ one }) => ({
  patient: one(patients, {
    fields: [precisionTests.patientId],
    references: [patients.id],
  }),
}));

// Zod schemas for validation
export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  dateOfBirth: z.string().optional().transform(val => val === "" ? null : val),
  gender: z.string().optional().transform(val => val === "" ? null : val),
  contactNumber: z.string().optional().transform(val => val === "" ? null : val),
});

export const insertMedicationEntrySchema = createInsertSchema(medicationEntries).omit({
  id: true,
  timestamp: true,
});

export const insertPrescribedMedicationSchema = createInsertSchema(prescribedMedications).omit({
  id: true,
});

export const insertVisitNoteSchema = createInsertSchema(visitNotes).omit({
  id: true,
  createdAt: true,
});

export const insertBodyCompositionEntrySchema = createInsertSchema(bodyCompositionEntries).omit({
  id: true,
  timestamp: true,
});

export const insertCardiovascularHealthEntrySchema = createInsertSchema(cardiovascularHealthEntries).omit({
  id: true,
  timestamp: true,
});

export const insertMetabolicHealthEntrySchema = createInsertSchema(metabolicHealthEntries).omit({
  id: true,
  timestamp: true,
});

export const insertLabRecordSchema = createInsertSchema(labRecords).omit({
  id: true,
  timestamp: true,
});

export const insertPeptideEntrySchema = createInsertSchema(peptideEntries).omit({
  id: true,
});

export const insertSupplementEntrySchema = createInsertSchema(supplementEntries).omit({
  id: true,
});

export const insertIvTreatmentEntrySchema = createInsertSchema(ivTreatmentEntries).omit({
  id: true,
});

export const insertGenomicReportSchema = createInsertSchema(genomicReports).omit({
  id: true,
  timestamp: true,
});

export const insertPrecisionLabReportSchema = createInsertSchema(precisionLabReports).omit({
  id: true,
  timestamp: true,
});

export const insertPrecisionTestSchema = createInsertSchema(precisionTests).omit({
  id: true,
  timestamp: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type MedicationEntry = typeof medicationEntries.$inferSelect;
export type InsertMedicationEntry = z.infer<typeof insertMedicationEntrySchema>;
export type PrescribedMedication = typeof prescribedMedications.$inferSelect;
export type InsertPrescribedMedication = z.infer<typeof insertPrescribedMedicationSchema>;
export type VisitNote = typeof visitNotes.$inferSelect;
export type InsertVisitNote = z.infer<typeof insertVisitNoteSchema>;
export type BodyCompositionEntry = typeof bodyCompositionEntries.$inferSelect;
export type InsertBodyCompositionEntry = z.infer<typeof insertBodyCompositionEntrySchema>;
export type CardiovascularHealthEntry = typeof cardiovascularHealthEntries.$inferSelect;
export type InsertCardiovascularHealthEntry = z.infer<typeof insertCardiovascularHealthEntrySchema>;
export type MetabolicHealthEntry = typeof metabolicHealthEntries.$inferSelect;
export type InsertMetabolicHealthEntry = z.infer<typeof insertMetabolicHealthEntrySchema>;
export type LabRecord = typeof labRecords.$inferSelect;
export type InsertLabRecord = z.infer<typeof insertLabRecordSchema>;
export type PeptideEntry = typeof peptideEntries.$inferSelect;
export type InsertPeptideEntry = z.infer<typeof insertPeptideEntrySchema>;
export type SupplementEntry = typeof supplementEntries.$inferSelect;
export type InsertSupplementEntry = z.infer<typeof insertSupplementEntrySchema>;
export type IvTreatmentEntry = typeof ivTreatmentEntries.$inferSelect;
export type InsertIvTreatmentEntry = z.infer<typeof insertIvTreatmentEntrySchema>;
export type GenomicReport = typeof genomicReports.$inferSelect;
export type InsertGenomicReport = z.infer<typeof insertGenomicReportSchema>;
export type PrecisionLabReport = typeof precisionLabReports.$inferSelect;
export type InsertPrecisionLabReport = z.infer<typeof insertPrecisionLabReportSchema>;
export type PrecisionTest = typeof precisionTests.$inferSelect;
export type InsertPrecisionTest = z.infer<typeof insertPrecisionTestSchema>;
