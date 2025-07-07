// server/intake.routes.ts
import { Router } from "express";
import { db } from "./db"; // adjust path as needed
import { patients, insertPatientSchema } from "./schema"; // adjust path
import { z } from "zod";

const router = Router();

router.post("/intake", async (req, res) => {
  try {
    const body = req.body;
    const parsed = insertPatientSchema.parse(body);
    await db.insert(patients).values(parsed);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error handling intake form:", err);
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
