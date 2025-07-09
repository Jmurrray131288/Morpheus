import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // adjust import path as needed

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
      console.error("Failed to insert medication:", error.message);
      return;
    }

    onSaved(); // optional callback to refresh parent
    onClose(); // close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Add New Medication</h2>

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
          placeholder="Route (e.g. oral, IV)"
          value={form.route}
          onChange={(e) => handleChange("route", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Frequency (e.g. once daily)"
          value={form.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={form.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onClose} className="text-sm px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Medication
          </button>
        </div>
      </div>
    </div>
  );
}
