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
        <div className="space-y-4">
          {medications.map((medication) => (
            <div key={medication.id} className="medication-item">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{medication.name}</h4>
                <span className={medication.status === "Active" ? "status-active" : "status-inactive"}>
                  {medication.status || "Unknown"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Dosage:</span> <span>{medication.dosage || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium">Frequency:</span> <span>{medication.frequency || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium">Started:</span> <span>{medication.startDate ? new Date(medication.startDate).toLocaleDateString() : "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium">Strength:</span> <span>{medication.strength || "Not specified"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
