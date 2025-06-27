import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPatientSchema,
  insertMedicationEntrySchema,
  insertPrescribedMedicationSchema,
  insertVisitNoteSchema,
  insertBodyCompositionEntrySchema,
  insertCardiovascularHealthEntrySchema,
  insertMetabolicHealthEntrySchema,
  insertLabRecordSchema,
  insertPeptideEntrySchema,
  insertSupplementEntrySchema,
  insertIvTreatmentEntrySchema,
  insertGenomicReportSchema,
  insertPrecisionLabReportSchema,
  insertPrecisionTestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient routes
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(400).json({ message: "Failed to create patient", error: error.message });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(req.params.id, validatedData);
      res.json(patient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(400).json({ message: "Failed to update patient", error: error.message });
    }
  });

  app.delete("/api/patients/:id", async (req, res) => {
    try {
      await storage.deletePatient(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Failed to delete patient" });
    }
  });

  // Medication routes
  app.get("/api/patients/:patientId/medications", async (req, res) => {
    try {
      const medications = await storage.getPatientMedications(req.params.patientId);
      res.json(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  app.post("/api/patients/:patientId/medications", async (req, res) => {
    try {
      // First create medication entry
      const medicationEntry = await storage.createMedicationEntry({
        patientId: req.params.patientId,
      });

      // Then create prescribed medication
      const validatedData = insertPrescribedMedicationSchema.parse({
        ...req.body,
        medicationEntryId: medicationEntry.id,
        patientId: req.params.patientId,
      });
      
      const medication = await storage.createPrescribedMedication(validatedData);
      res.status(201).json(medication);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(400).json({ message: "Failed to create medication", error: error.message });
    }
  });

  app.put("/api/medications/:id", async (req, res) => {
    try {
      const validatedData = insertPrescribedMedicationSchema.partial().parse(req.body);
      const medication = await storage.updatePrescribedMedication(req.params.id, validatedData);
      res.json(medication);
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(400).json({ message: "Failed to update medication", error: error.message });
    }
  });

  app.delete("/api/medications/:id", async (req, res) => {
    try {
      await storage.deletePrescribedMedication(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });

  // Visit notes routes
  app.get("/api/patients/:patientId/visit-notes", async (req, res) => {
    try {
      const notes = await storage.getPatientVisitNotes(req.params.patientId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching visit notes:", error);
      res.status(500).json({ message: "Failed to fetch visit notes" });
    }
  });

  app.post("/api/patients/:patientId/visit-notes", async (req, res) => {
    try {
      const validatedData = insertVisitNoteSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const note = await storage.createVisitNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating visit note:", error);
      res.status(400).json({ message: "Failed to create visit note", error: error.message });
    }
  });

  app.put("/api/visit-notes/:id", async (req, res) => {
    try {
      const validatedData = insertVisitNoteSchema.partial().parse(req.body);
      const note = await storage.updateVisitNote(req.params.id, validatedData);
      res.json(note);
    } catch (error) {
      console.error("Error updating visit note:", error);
      res.status(400).json({ message: "Failed to update visit note", error: error.message });
    }
  });

  app.delete("/api/visit-notes/:id", async (req, res) => {
    try {
      await storage.deleteVisitNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting visit note:", error);
      res.status(500).json({ message: "Failed to delete visit note" });
    }
  });

  // Health metrics routes
  app.get("/api/patients/:patientId/body-composition", async (req, res) => {
    try {
      const entries = await storage.getPatientBodyComposition(req.params.patientId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching body composition:", error);
      res.status(500).json({ message: "Failed to fetch body composition" });
    }
  });

  app.post("/api/patients/:patientId/body-composition", async (req, res) => {
    try {
      console.log("Body composition request body:", JSON.stringify(req.body, null, 2));
      // Auto-timestamp the entry on the backend
      const bodyData = {
        ...req.body,
        patientId: req.params.patientId,
        entryDate: new Date(), // Always use current timestamp
      };
      const validatedData = insertBodyCompositionEntrySchema.parse(bodyData);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      const entry = await storage.createBodyCompositionEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating body composition entry:", error);
      console.error("Error details:", (error as any).message);
      if ((error as any).issues) {
        console.error("Validation issues:", JSON.stringify((error as any).issues, null, 2));
      }
      res.status(400).json({ message: "Failed to create body composition entry", error: (error as any).message });
    }
  });

  app.get("/api/patients/:patientId/cardiovascular-health", async (req, res) => {
    try {
      const entries = await storage.getPatientCardiovascularHealth(req.params.patientId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching cardiovascular health:", error);
      res.status(500).json({ message: "Failed to fetch cardiovascular health" });
    }
  });

  app.post("/api/patients/:patientId/cardiovascular-health", async (req, res) => {
    try {
      const validatedData = insertCardiovascularHealthEntrySchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const entry = await storage.createCardiovascularHealthEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating cardiovascular health entry:", error);
      res.status(400).json({ message: "Failed to create cardiovascular health entry", error: error.message });
    }
  });

  app.get("/api/patients/:patientId/metabolic-health", async (req, res) => {
    try {
      const entries = await storage.getPatientMetabolicHealth(req.params.patientId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching metabolic health:", error);
      res.status(500).json({ message: "Failed to fetch metabolic health" });
    }
  });

  app.post("/api/patients/:patientId/metabolic-health", async (req, res) => {
    try {
      const validatedData = insertMetabolicHealthEntrySchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const entry = await storage.createMetabolicHealthEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating metabolic health entry:", error);
      res.status(400).json({ message: "Failed to create metabolic health entry", error: error.message });
    }
  });

  // Lab records routes
  app.get("/api/patients/:patientId/lab-records", async (req, res) => {
    try {
      const records = await storage.getPatientLabRecords(req.params.patientId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching lab records:", error);
      res.status(500).json({ message: "Failed to fetch lab records" });
    }
  });

  app.post("/api/patients/:patientId/lab-records", async (req, res) => {
    try {
      const validatedData = insertLabRecordSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const record = await storage.createLabRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating lab record:", error);
      res.status(400).json({ message: "Failed to create lab record", error: error.message });
    }
  });

  app.put("/api/lab-records/:id", async (req, res) => {
    try {
      const validatedData = insertLabRecordSchema.partial().parse(req.body);
      const record = await storage.updateLabRecord(req.params.id, validatedData);
      res.json(record);
    } catch (error) {
      console.error("Error updating lab record:", error);
      res.status(400).json({ message: "Failed to update lab record", error: error.message });
    }
  });

  app.delete("/api/lab-records/:id", async (req, res) => {
    try {
      await storage.deleteLabRecord(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lab record:", error);
      res.status(500).json({ message: "Failed to delete lab record" });
    }
  });

  // Advanced treatments routes
  app.get("/api/patients/:patientId/peptides", async (req, res) => {
    try {
      const peptides = await storage.getPatientPeptides(req.params.patientId);
      res.json(peptides);
    } catch (error) {
      console.error("Error fetching peptides:", error);
      res.status(500).json({ message: "Failed to fetch peptides" });
    }
  });

  app.post("/api/patients/:patientId/peptides", async (req, res) => {
    try {
      // First create medication entry
      const medicationEntry = await storage.createMedicationEntry({
        patientId: req.params.patientId,
      });

      const validatedData = insertPeptideEntrySchema.parse({
        ...req.body,
        medicationEntryId: medicationEntry.id,
      });
      const peptide = await storage.createPeptideEntry(validatedData);
      res.status(201).json(peptide);
    } catch (error) {
      console.error("Error creating peptide entry:", error);
      res.status(400).json({ message: "Failed to create peptide entry", error: error.message });
    }
  });

  app.get("/api/patients/:patientId/supplements", async (req, res) => {
    try {
      const supplements = await storage.getPatientSupplements(req.params.patientId);
      res.json(supplements);
    } catch (error) {
      console.error("Error fetching supplements:", error);
      res.status(500).json({ message: "Failed to fetch supplements" });
    }
  });

  app.post("/api/patients/:patientId/supplements", async (req, res) => {
    try {
      // First create medication entry
      const medicationEntry = await storage.createMedicationEntry({
        patientId: req.params.patientId,
      });

      const validatedData = insertSupplementEntrySchema.parse({
        ...req.body,
        medicationEntryId: medicationEntry.id,
      });
      const supplement = await storage.createSupplementEntry(validatedData);
      res.status(201).json(supplement);
    } catch (error) {
      console.error("Error creating supplement entry:", error);
      res.status(400).json({ message: "Failed to create supplement entry", error: error.message });
    }
  });

  app.get("/api/patients/:patientId/iv-treatments", async (req, res) => {
    try {
      const treatments = await storage.getPatientIvTreatments(req.params.patientId);
      res.json(treatments);
    } catch (error) {
      console.error("Error fetching IV treatments:", error);
      res.status(500).json({ message: "Failed to fetch IV treatments" });
    }
  });

  app.post("/api/patients/:patientId/iv-treatments", async (req, res) => {
    try {
      // First create medication entry
      const medicationEntry = await storage.createMedicationEntry({
        patientId: req.params.patientId,
      });

      const validatedData = insertIvTreatmentEntrySchema.parse({
        ...req.body,
        medicationEntryId: medicationEntry.id,
      });
      const treatment = await storage.createIvTreatmentEntry(validatedData);
      res.status(201).json(treatment);
    } catch (error) {
      console.error("Error creating IV treatment entry:", error);
      res.status(400).json({ message: "Failed to create IV treatment entry", error: error.message });
    }
  });

  // Precision medicine routes
  app.get("/api/patients/:patientId/genomic-reports", async (req, res) => {
    try {
      const reports = await storage.getPatientGenomicReports(req.params.patientId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching genomic reports:", error);
      res.status(500).json({ message: "Failed to fetch genomic reports" });
    }
  });

  app.post("/api/patients/:patientId/genomic-reports", async (req, res) => {
    try {
      const validatedData = insertGenomicReportSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const report = await storage.createGenomicReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating genomic report:", error);
      res.status(400).json({ message: "Failed to create genomic report", error: error.message });
    }
  });

  app.get("/api/patients/:patientId/precision-lab-reports", async (req, res) => {
    try {
      const reports = await storage.getPatientPrecisionLabReports(req.params.patientId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching precision lab reports:", error);
      res.status(500).json({ message: "Failed to fetch precision lab reports" });
    }
  });

  app.post("/api/patients/:patientId/precision-lab-reports", async (req, res) => {
    try {
      const validatedData = insertPrecisionLabReportSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const report = await storage.createPrecisionLabReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating precision lab report:", error);
      res.status(400).json({ message: "Failed to create precision lab report", error: error.message });
    }
  });

  app.get("/api/patients/:patientId/precision-tests", async (req, res) => {
    try {
      const tests = await storage.getPatientPrecisionTests(req.params.patientId);
      res.json(tests);
    } catch (error) {
      console.error("Error fetching precision tests:", error);
      res.status(500).json({ message: "Failed to fetch precision tests" });
    }
  });

  app.post("/api/patients/:patientId/precision-tests", async (req, res) => {
    try {
      const validatedData = insertPrecisionTestSchema.parse({
        ...req.body,
        patientId: req.params.patientId,
      });
      const test = await storage.createPrecisionTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      console.error("Error creating precision test:", error);
      res.status(400).json({ message: "Failed to create precision test", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
