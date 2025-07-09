import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // adjust path if needed

export default function MedicationModal({ patientId, onClose, onSaved }) {
  const [form, setForm] = useState({
    medication_name: "",
    dosage: "",
    route: "",
    frequency: "",
    start_date: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from("medications").insert({
      patient_id: patientId,
      ...form,
    });

    if (error) {
      console.error("Insert failed:", error.message);
      return;
    }

    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Add Medication</h2>

        <input
          type="text"
          placeholder="Medication Name"
          value={form.medication_name}
          onChange={(e) => handleChange("medication_name", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) => handleChange("dosage", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Route (e.g. oral
