import * as drizzle from "drizzle-orm/pg-core";
const { pgTable, text, varchar, timestamp, time, jsonb, index, uuid, doublePrecision, integer, boolean, date, serial } = drizzle;
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
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role").notNull().default("staff"),
  profileImageUrl: varchar("profile_image_url"),
  organizationId: varchar("organization_id"),
  patientIds: text("patient_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Records Schema
export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: date("date_of_birth"),
  createdAt: timestamp("created_at").defaultNow(),
  gender: text("gender"),
  email: text("email"),
  contactNum: text("contact_num"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medications = pgTable("medications", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const prescribedMedications = pgTable("prescribed_medications", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  name: text("name").notNull(),
  strength: text("strength"),
  dosage: text("dosage"),
  frequency: text("frequency"),
  duration: text("duration"),
  instructions: text("instructions"),
  startDate: date("start_date"),
  status: text("status"),
  discontinuationReason: text("discontinuation_reason"),
  discontinuationDate: text("discontinuation_date"),
  discontinuationBy: text("discontinuation_by"),
});

export const visitNotes = pgTable("visit_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  note: text("note").notNull(),
});

export const bodyCompositionEntries = pgTable("body_composition_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  entryDate: timestamp("entry_date").notNull(),
  heightIn: integer("height_in"),
  weightLbs: integer("weight_lbs"),
  bmi: text("bmi"),
  bmr: text("bmr"),
  tdee: text("tdee"),
  activityLevel: text("activity_level"),
  bodyFatPerc: text("body_fat_perc"),
  totalBodyFat: text("total_body_fat"),
  skeletalMusc: text("skeletal_musc"),
  visceralFat: text("visceral_fat"),
  vo2Max: text("vo2_max"),
  notes: text("notes"),
  sleep: text("sleep"),
  nutrition: text("nutrition"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const cardiovascular = pgTable("cardiovascular", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  entryDate: timestamp("entry_date").notNull(),
  lipids: jsonb("lipids"),
  bloodPressure: integer("blood_pressure"),
  inflammation: jsonb("inflammation"),
  otherMarkers: jsonb("other_markers"),
  riskFactors: jsonb("risk_factors"),
  medications: jsonb("medications"),
  interventions: jsonb("interventions"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Keep the old name for backward compatibility
export const cardiovascularHealthEntries = cardiovascular;

export const cardiovascularEntries = pgTable("cardiovascular_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id").notNull(),
  bloodPressure: text("blood_pressure"),
  lipids: text("lipids"),
  inflammation: text("inflammation"),
});

export const metabolic = pgTable("metabolic", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  entryDate: timestamp("entry_date"),
  glucoseMetrics: text("glucose_metrics"),
  metabolicMarkers: text("metabolic_markers"),
  weightManagement: text("weight_management"),
  glp1Therapy: text("glp1_therapy"),
  interventions: text("interventions"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const metabolicHealthEntries = pgTable("metabolic_health_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id").notNull(),
  glucoseMetrics: text("glucose_metrics"),
  metabolicMarkers: text("metabolic_markers"),
  weightManagement: text("weight_management"),
});

export const labs = pgTable("labs", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  testName: text("test_name"),
  resultValue: text("result_value"),
  unit: text("unit"),
  referenceRan: text("reference_ran"),
  collectedAt: timestamp("collected_at"),
  panels: jsonb("panels"),
  pdfReports: jsonb("pdf_reports"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Keep the old name for backward compatibility
export const labRecords = labs;

export const medicalRecords = pgTable("medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  contactNum: text("contact_num"),
  updatedAt: timestamp("updated_at").defaultNow(),
  patientId: text("patient_id"),
});

export const peptideEntries = pgTable("peptide_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  name: varchar("name"),
  dosage: varchar("dosage"),
  frequency: varchar("frequency"),
  startDate: date("start_date"),
  status: varchar("status"),
  endDate: date("end_date"),
  patientId: text("patient_id"),
});

export const protocols = pgTable("protocols", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  serviceId: text("service_id"),
  name: text("name"),
  instructions: text("instructions"),
  frequency: text("frequency"),
  durationWeeks: integer("duration_weeks"),
  patientId: text("patient_id"),
});

// Removed otherMedicationEntries table - not needed for production database

export const ivTreatments = pgTable("iv_treatments", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id").notNull(),
  name: varchar("name"),
  components: jsonb("components"),
});

// Keep the old name for backward compatibility
export const ivTreatmentEntries = ivTreatments;

export const supplementEntries = pgTable("supplement_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name"),
  dosage: text("dosage"),
  details: jsonb("details"),
  patientId: text("patient_id"),
});

export const genomic = pgTable("genomic", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id").notNull(),
  reportDate: text("report_date"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Keep the old name for backward compatibility
export const genomicReports = genomic;

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

// Additional production tables to match your database
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  providerId: text("provider_id"),
  appointmentDate: time("appointment_date"),
  reason: text("reason"),
  status: text("status"),
});

export const vitals = pgTable("vitals", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  recordedAt: text("recorded_at"),
  heightIn: doublePrecision("height_in"),
  weightLbs: doublePrecision("weight_lbs"),
  bloodPressure: integer("blood_pressure"),
  bloodPressure2: integer("blood_pressure_2"),
  heartRate: integer("heart_rate"),
  temperatureF: doublePrecision("temperature_f"),
  respiratoryRate: integer("respiratory_ra"),
});

export const diagnoses = pgTable("diagnoses", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  icd10Code: text("icd10_code"),
  description: text("description"),
  diagnosedAt: timestamp("diagnosed_at"),
  providerId: text("provider_id"),
});

export const providers = pgTable("providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique(),
  phone: varchar("phone"),
  specialty: varchar("specialty"),
  licenseNumber: varchar("license_number"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name").notNull(),
  category: text("category"),
  description: text("description"),
  price: doublePrecision("price"),
  durationMins: integer("duration_mins"),
  patientId: text("patient_id"),
});

export const serviceOrders = pgTable("service_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  patientId: text("patient_id").notNull(),
  serviceId: text("service_id").notNull(),
  providerId: text("provider_id"),
  orderedAt: timestamp("ordered_at").notNull(),
  status: text("status"),
  notes: text("notes"),
});

// Aliases for table names that match your production database

// Relations
export const patientsRelations = relations(patients, ({ many }) => ({
  medications: many(medications),
  prescribedMedications: many(prescribedMedications),
  visitNotes: many(visitNotes),
  bodyCompositionEntries: many(bodyCompositionEntries),
  cardiovascular: many(cardiovascular),
  cardiovascularEntries: many(cardiovascularEntries),
  metabolic: many(metabolic),
  metabolicHealthEntries: many(metabolicHealthEntries),
  labs: many(labs),
  medicalRecords: many(medicalRecords),
  peptideEntries: many(peptideEntries),
  protocols: many(protocols),
  services: many(services),
  supplementEntries: many(supplementEntries),
  vitals: many(vitals),
  genomic: many(genomic),
  appointments: many(appointments),
  diagnoses: many(diagnoses),
  serviceOrders: many(serviceOrders),
}));

export const medicationsRelations = relations(medications, ({ one }) => ({
  patient: one(patients, {
    fields: [medications.patientId],
    references: [patients.id],
  }),
}));

export const prescribedMedicationsRelations = relations(prescribedMedications, ({ one }) => ({
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

export const cardiovascularRelations = relations(cardiovascular, ({ one }) => ({
  patient: one(patients, {
    fields: [cardiovascular.patientId],
    references: [patients.id],
  }),
}));

// Keep the old name for backward compatibility
export const cardiovascularHealthEntriesRelations = cardiovascularRelations;

export const cardiovascularEntriesRelations = relations(cardiovascularEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [cardiovascularEntries.patientId],
    references: [patients.id],
  }),
}));

export const metabolicRelations = relations(metabolic, ({ one }) => ({
  patient: one(patients, {
    fields: [metabolic.patientId],
    references: [patients.id],
  }),
}));

export const metabolicHealthEntriesRelations = relations(metabolicHealthEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [metabolicHealthEntries.patientId],
    references: [patients.id],
  }),
}));

export const labsRelations = relations(labs, ({ one }) => ({
  patient: one(patients, {
    fields: [labs.patientId],
    references: [patients.id],
  }),
}));

// Keep the old name for backward compatibility
export const labRecordsRelations = labsRelations;

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
}));

export const peptideEntriesRelations = relations(peptideEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [peptideEntries.patientId],
    references: [patients.id],
  }),
}));

export const protocolsRelations = relations(protocols, ({ one }) => ({
  patient: one(patients, {
    fields: [protocols.patientId],
    references: [patients.id],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  patient: one(patients, {
    fields: [services.patientId],
    references: [patients.id],
  }),
}));

// Removed otherMedicationEntriesRelations as it references non-existent fields

export const ivTreatmentsRelations = relations(ivTreatments, ({ one }) => ({
  patient: one(patients, {
    fields: [ivTreatments.patientId],
    references: [patients.id],
  }),
}));

// Keep the old name for backward compatibility
export const ivTreatmentEntriesRelations = ivTreatmentsRelations;

export const supplementEntriesRelations = relations(supplementEntries, ({ one }) => ({
  patient: one(patients, {
    fields: [supplementEntries.patientId],
    references: [patients.id],
  }),
}));

export const genomicRelations = relations(genomic, ({ one }) => ({
  patient: one(patients, {
    fields: [genomic.patientId],
    references: [patients.id],
  }),
}));

// Keep the old name for backward compatibility
export const genomicReportsRelations = genomicRelations;

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

// New table relations
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  provider: one(providers, {
    fields: [appointments.providerId],
    references: [providers.id],
  }),
}));

export const vitalsRelations = relations(vitals, ({ one }) => ({
  patient: one(patients, {
    fields: [vitals.patientId],
    references: [patients.id],
  }),
}));

export const diagnosesRelations = relations(diagnoses, ({ one }) => ({
  patient: one(patients, {
    fields: [diagnoses.patientId],
    references: [patients.id],
  }),
}));

export const providersRelations = relations(providers, ({ many }) => ({
  appointments: many(appointments),
  serviceOrders: many(serviceOrders),
}));



export const serviceOrdersRelations = relations(serviceOrders, ({ one }) => ({
  patient: one(patients, {
    fields: [serviceOrders.patientId],
    references: [patients.id],
  }),
  service: one(services, {
    fields: [serviceOrders.serviceId],
    references: [services.id],
  }),
  provider: one(providers, {
    fields: [serviceOrders.providerId],
    references: [providers.id],
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

export const insertMedicationSchema = createInsertSchema(medications).omit({
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
  createdAt: true,
  timestamp: true,
});

export const insertCardiovascularSchema = createInsertSchema(cardiovascular).omit({
  id: true,
  createdAt: true,
  timestamp: true,
});

// Keep the old name for backward compatibility
export const insertCardiovascularHealthEntrySchema = insertCardiovascularSchema;

export const insertCardiovascularEntrySchema = createInsertSchema(cardiovascularEntries).omit({
  id: true,
});

export const insertMetabolicSchema = createInsertSchema(metabolic).omit({
  id: true,
  createdAt: true,
  timestamp: true,
});

export const insertMetabolicHealthEntrySchema = createInsertSchema(metabolicHealthEntries).omit({
  id: true,
});

export const insertLabSchema = createInsertSchema(labs).omit({
  id: true,
  createdAt: true,
  timestamp: true,
});

// Keep the old name for backward compatibility
export const insertLabRecordSchema = insertLabSchema;

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPeptideEntrySchema = createInsertSchema(peptideEntries).omit({
  id: true,
  createdAt: true,
});

export const insertSupplementEntrySchema = createInsertSchema(supplementEntries).omit({
  id: true,
  createdAt: true,
});

export const insertIvTreatmentSchema = createInsertSchema(ivTreatments).omit({
  id: true,
});

// Keep the old name for backward compatibility
export const insertIvTreatmentEntrySchema = insertIvTreatmentSchema;

export const insertGenomicSchema = createInsertSchema(genomic).omit({
  id: true,
  timestamp: true,
});

// Keep the old name for backward compatibility
export const insertGenomicReportSchema = insertGenomicSchema;

export const insertPrecisionLabReportSchema = createInsertSchema(precisionLabReports).omit({
  id: true,
  timestamp: true,
});

export const insertPrecisionTestSchema = createInsertSchema(precisionTests).omit({
  id: true,
  timestamp: true,
});

// New table insert schemas
export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertVitalSchema = createInsertSchema(vitals).omit({
  id: true,
  createdAt: true,
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = typeof users.$inferSelect;

export const insertDiagnosisSchema = createInsertSchema(diagnoses).omit({
  id: true,
  createdAt: true,
});

export const insertProtocolSchema = createInsertSchema(protocols).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertServiceOrderSchema = createInsertSchema(serviceOrders).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type AuthUser = {
  id: string;
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  role: string;
};
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type PrescribedMedication = typeof prescribedMedications.$inferSelect;
export type InsertPrescribedMedication = z.infer<typeof insertPrescribedMedicationSchema>;
export type VisitNote = typeof visitNotes.$inferSelect;
export type InsertVisitNote = z.infer<typeof insertVisitNoteSchema>;
export type BodyCompositionEntry = typeof bodyCompositionEntries.$inferSelect;
export type InsertBodyCompositionEntry = z.infer<typeof insertBodyCompositionEntrySchema>;
export type Cardiovascular = typeof cardiovascular.$inferSelect;
export type InsertCardiovascular = z.infer<typeof insertCardiovascularSchema>;

// Keep the old names for backward compatibility
export type CardiovascularHealthEntry = Cardiovascular;
export type InsertCardiovascularHealthEntry = InsertCardiovascular;

export type CardiovascularEntry = typeof cardiovascularEntries.$inferSelect;
export type InsertCardiovascularEntry = z.infer<typeof insertCardiovascularEntrySchema>;
export type Metabolic = typeof metabolic.$inferSelect;
export type InsertMetabolic = z.infer<typeof insertMetabolicSchema>;

export type MetabolicHealthEntry = typeof metabolicHealthEntries.$inferSelect;
export type InsertMetabolicHealthEntry = z.infer<typeof insertMetabolicHealthEntrySchema>;
export type Lab = typeof labs.$inferSelect;
export type InsertLab = z.infer<typeof insertLabSchema>;

// Keep the old names for backward compatibility
export type LabRecord = Lab;
export type InsertLabRecord = InsertLab;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type PeptideEntry = typeof peptideEntries.$inferSelect;
export type InsertPeptideEntry = z.infer<typeof insertPeptideEntrySchema>;
export type SupplementEntry = typeof supplementEntries.$inferSelect;
export type InsertSupplementEntry = z.infer<typeof insertSupplementEntrySchema>;
export type IvTreatment = typeof ivTreatments.$inferSelect;
export type InsertIvTreatment = z.infer<typeof insertIvTreatmentSchema>;

// Keep the old names for backward compatibility
export type IvTreatmentEntry = IvTreatment;
export type InsertIvTreatmentEntry = InsertIvTreatment;
export type Genomic = typeof genomic.$inferSelect;
export type InsertGenomic = z.infer<typeof insertGenomicSchema>;

// Keep the old names for backward compatibility
export type GenomicReport = Genomic;
export type InsertGenomicReport = InsertGenomic;
export type PrecisionLabReport = typeof precisionLabReports.$inferSelect;
export type InsertPrecisionLabReport = z.infer<typeof insertPrecisionLabReportSchema>;
export type PrecisionTest = typeof precisionTests.$inferSelect;
export type InsertPrecisionTest = z.infer<typeof insertPrecisionTestSchema>;

// New table types
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Vital = typeof vitals.$inferSelect;
export type InsertVital = z.infer<typeof insertVitalSchema>;

export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = z.infer<typeof insertDiagnosisSchema>;

export type Protocol = typeof protocols.$inferSelect;
export type InsertProtocol = z.infer<typeof insertProtocolSchema>;

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type ServiceOrder = typeof serviceOrders.$inferSelect;
export type InsertServiceOrder = z.infer<typeof insertServiceOrderSchema>;
