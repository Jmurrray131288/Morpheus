import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function MedicationModal({ patientId, onClose, onSaved }) {
  const [form, setForm] = useState({
    medication_name: "",
    dosage: "",
    route: "",
    frequency: "",
    start_date: "",
  });

  const handleChange = (field: string, value: string) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
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
          placeholder="Route (e.g. oral)"
          value={form.route}
          onChange={(e) => handleChange("route", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Frequency (e.g. daily)"
          value={form.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          className="w-full border p-2 rounded"
        />

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

  const handleChange = (field: string, value: string) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
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
          placeholder="Route (e.g. oral)"
          value={form.route}
          onChange={(e) => handleChange("route", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Frequency (e.g. daily)"
          value={form.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          className="w-full border p-2 rounded"
        />

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

  const handleChange = (field: string, value: string) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
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
          placeholder="Route (e.g. oral)"
          value={form.route}
          onChange={(e) => handleChange("route", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Frequency (e.g. daily)"
          value={form.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          className="w-full border p-2 rounded"
        />

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

  const handleChange = (field: string, value: string) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
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
          placeholder="Route (e.g. oral)"
          value={form.route}
          onChange={(e) => handleChange("route", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Frequency (e.g. daily)"
          value={form.frequency}
          onChange={(e) => handleChange("frequency", e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
          className="w-full border p-2 rounded"
        />

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
