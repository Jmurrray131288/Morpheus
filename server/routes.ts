import { executeQuery } from "./supabase";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, uploadLabReportFile } from "./fileUpload";
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
  IvTreatmentEntry,
} from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Database connection test endpoint
  app.get("/api/test-db", async (req, res) => {
    try {
      console.log("=== DATABASE CONNECTION TEST ===");
      console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
      console.log("DATABASE_URL preview:", process.env.DATABASE_URL?.substring(0, 30) + "...");
      console.log("NODE_ENV:", process.env.NODE_ENV);
      
      console.log("Testing database connection...");
      const result = await executeQuery('SELECT * FROM patients LIMIT 1');
      console.log("Query result:", result);
      
      res.json({ 
        status: "success", 
        message: "Database connection working", 
        sampleData: result.length > 0 ? "Found patients" : "No patients yet",
        count: result.length,
        environment: process.env.NODE_ENV,
        databaseConnected: true
      });
    } catch (error) {
      console.error("Database test failed:", error);
      res.status(500).json({ 
        status: "error", 
        message: "Database connection failed", 
        error: error.message,
        details: error.stack,
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + "..."
      });
    }
  });

  // Patient routes
  app.get("/api/patients", async (req, res) => {
    try {
      console.log("=== FETCHING PATIENTS ===");
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Database URL preview:", process.env.DATABASE_URL?.substring(0, 30) + "...");
      
      const patients = await storage.getPatients();
      console.log("Found patients:", patients.length);
      
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
      if (error.message.includes('relation "patients" does not exist')) {
        res.status(500).json({ 
          message: "Database tables not found. Please run database migrations first.",
          error: "Tables need to be created in the database"
        });
      } else {
        res.status(500).json({ message: "Failed to fetch patients", error: error.message });
      }
    }
  });
  app.post("/api/intake", async (req, res) => {
    try {
      const patient = await storage.createPatient(req.body);
      res.status(200).json({ success: true, patient });
    } catch (err) {
      console.error("Intake error:", err);
      res.status(400).json({ error: (err as Error).message });
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

  // Combined patient profile endpoint - fetches all patient data in one request
  app.get("/api/patients/:id/profile", async (req, res) => {
    try {
      const patientId = req.params.id;
      
      // Fetch patient basic info
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Fetch all patient data in parallel for better performance
      const [
        medications,
        visitNotes,
        bodyComposition,
        cardiovascularHealth,
        metabolicHealth,
        labRecords,
        peptides,
        supplements,
        ivTreatments,
        genomicReports,
        precisionLabReports,
        precisionTests
      ] = await Promise.all([
        storage.getPatientMedications(patientId),
        storage.getPatientVisitNotes(patientId),
        storage.getPatientBodyComposition(patientId),
        storage.getPatientCardiovascularHealth(patientId),
        storage.getPatientMetabolicHealth(patientId),
        storage.getPatientLabRecords(patientId),
        storage.getPatientPeptides(patientId),
        storage.getPatientSupplements(patientId),
        storage.getPatientIvTreatments(patientId),
        storage.getPatientGenomicReports(patientId),
        storage.getPatientPrecisionLabReports(patientId),
        storage.getPatientPrecisionTests(patientId)
      ]);

      res.json({
        patient,
        medications,
        visitNotes,
        bodyComposition,
        cardiovascularHealth,
        metabolicHealth,
        labRecords,
        peptides,
        supplements,
        ivTreatments,
        genomicReports,
        precisionLabReports,
        precisionTests
      });
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      res.status(500).json({ message: "Failed to fetch patient profile" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patient = await storage.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(400).json({ message: "Failed to create patient", error: error.message });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      console.log("Updating patient:", req.params.id, "with data:", req.body);
      const patient = await storage.updatePatient(req.params.id, req.body);
      console.log("Updated patient:", patient);
      res.json(patient);
    } catch (error) {
      console.error("Error updating patient:", error);
      console.error("Error details:", error.stack);
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

  // Analytics routes
  app.get("/api/analytics/all-medications", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      const allMedications = [];
      
      for (const patient of patients) {
        const medications = await storage.getPatientMedications(patient.id);
        allMedications.push(...medications);
      }
      
      res.json(allMedications);
    } catch (error) {
      console.error("Error fetching all medications:", error);
      res.status(500).json({ message: "Failed to fetch all medications" });
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
      console.log("Creating medication for patient:", req.params.patientId);
      console.log("Request body:", req.body);
      
      // Directly create prescribed medication without medication entry
      const medicationData = {
        patientId: req.params.patientId,
        name: req.body.name,
        strength: req.body.strength || null,
        dosage: req.body.dosage || null,
        frequency: req.body.frequency || null,
        duration: req.body.duration || null,
        instructions: req.body.instructions || null,
        startDate: req.body.startDate || null,
        status: req.body.status || "Active",
      };
      
      console.log("Processed medication data:", medicationData);
      
      const medication = await storage.createPrescribedMedication(medicationData);
      res.status(201).json(medication);
    } catch (error) {
      console.error("Error creating medication:", error);
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
      res.status(400).json({ message: "Failed to create medication", error: error.message });
    }
  });

  app.put("/api/medications/:id", async (req, res) => {
    try {
      const medication = await storage.updatePrescribedMedication(req.params.id, req.body);
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
      const noteData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const note = await storage.createVisitNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating visit note:", error);
      res.status(400).json({ message: "Failed to create visit note", error: error.message });
    }
  });

  app.put("/api/visit-notes/:id", async (req, res) => {
    try {
      const note = await storage.updateVisitNote(req.params.id, req.body);
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
      console.log("Processed data:", JSON.stringify(bodyData, null, 2));
      const entry = await storage.createBodyCompositionEntry(bodyData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating body composition entry:", error);
      console.error("Error details:", (error as any).message);
      res.status(400).json({ message: "Failed to create body composition entry", error: (error as any).message });
    }
  });

  app.put("/api/patients/:patientId/body-composition/:id", async (req, res) => {
    try {
      const entry = await storage.updateBodyCompositionEntry(req.params.id, req.body);
      res.json(entry);
    } catch (error) {
      console.error("Error updating body composition entry:", error);
      res.status(400).json({ message: "Failed to update body composition entry", error: (error as any).message });
    }
  });

  app.put("/api/patients/:patientId/body-composition/:entryId", async (req, res) => {
    try {
      console.log("Updating body composition entry:", req.params.entryId);
      console.log("Update data:", JSON.stringify(req.body, null, 2));
      
      const bodyData = {
        ...req.body,
        entryDate: new Date(), // Keep original timestamp or update as needed
      };
      
      const entry = await storage.updateBodyCompositionEntry(req.params.entryId, bodyData);
      res.json(entry);
    } catch (error) {
      console.error("Error updating body composition entry:", error);
      res.status(400).json({ message: "Failed to update body composition entry", error: (error as any).message });
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
      const entryData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const entry = await storage.createCardiovascularHealthEntry(entryData);
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
      const entryData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const entry = await storage.createMetabolicHealthEntry(entryData);
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
      const recordData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const record = await storage.createLabRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating lab record:", error);
      res.status(400).json({ message: "Failed to create lab record", error: error.message });
    }
  });

  app.put("/api/lab-records/:id", async (req, res) => {
    try {
      const record = await storage.updateLabRecord(req.params.id, req.body);
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

  // File upload route for lab reports
  app.post("/api/patients/:patientId/lab-records/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { patientId, recordDate, reportName, notes } = req.body;

      if (!patientId || !recordDate || !reportName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Upload file to cloud storage or local fallback
      const fileData = await uploadLabReportFile(req.file, patientId, reportName);

      // Create lab record in database
      const recordData = {
        patientId,
        recordDate: new Date(recordDate),
        pdfReports: {
          fileName: fileData.fileName,
          fileSize: fileData.fileSize,
          fileType: fileData.fileType,
          fileUrl: fileData.fileUrl,
          fileKey: fileData.fileKey,
          uploadDate: new Date().toISOString(),
        },
        panels: {
          reportName,
          notes: notes || null,
        },
      };

      const labRecord = await storage.createLabRecord(recordData);
      res.status(201).json(labRecord);
    } catch (error) {
      console.error("Error uploading lab report:", error);
      res.status(500).json({ message: "Failed to upload lab report", error: error.message });
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
      const entryData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const peptide = await storage.createPeptideEntry(entryData);
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
      const entryData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const supplement = await storage.createSupplementEntry(entryData);
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
      const entryData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const treatment = await storage.createIvTreatmentEntry(entryData);
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
      const reportData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const report = await storage.createGenomicReport(reportData);
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
      const reportData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const report = await storage.createPrecisionLabReport(reportData);
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
      const testData = {
        ...req.body,
        patientId: req.params.patientId,
      };
      const test = await storage.createPrecisionTest(testData);
      res.status(201).json(test);
    } catch (error) {
      console.error("Error creating precision test:", error);
      res.status(400).json({ message: "Failed to create precision test", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
