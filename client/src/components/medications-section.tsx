import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrescribedMedication } from "@shared/schema";

interface MedicationsSectionProps {
  patientId: string;
  onAddMedication: () => void;
}

export default function MedicationsSection({ patientId, onAddMedication }: MedicationsSectionProps) {
  const { data: medications = [], isLoading } = useQuery<PrescribedMedication[]>({
    queryKey: [`/api/patients/${patientId}/medications`],
  });

  if (isLoading) {
    return (
      <div className="health-section">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
        <Button
          variant="ghost"
          onClick={onAddMedication}
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Medication
        </Button>
      </div>

      {medications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No medications recorded</p>
          <Button onClick={onAddMedication} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add First Medication
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Medication</th>
                <th className="text-left py-2 font-medium text-gray-700">Dosage & Frequency</th>
                <th className="text-left py-2 font-medium text-gray-700">Started</th>
                <th className="text-left py-2 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medications.map((medication) => (
                <tr key={medication.id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">{medication.name}</td>
                  <td className="py-3">
                    <span>{medication.dosage || "Not specified"}</span>
                    {medication.frequency && <span className="text-gray-500"> • {medication.frequency}</span>}
                    {medication.strength && <span className="text-gray-500"> • {medication.strength}</span>}
                  </td>
                  <td className="py-3 text-gray-600">
                    {medication.startDate ? new Date(medication.startDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      medication.status === "Active" 
                        ? 'bg-green-100 text-green-800' 
                        : medication.status === "Inactive"
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {medication.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
