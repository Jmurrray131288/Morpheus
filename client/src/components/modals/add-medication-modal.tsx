import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

        {["medication_name", "dosage", "route", "frequency", "start_date"].map((field) => (
          <input
            key={field}
            type={field === "start_date" ? "date" : "text"}
            placeholder={field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
            value={form[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full border p-2 rounded"
          />
        ))}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
