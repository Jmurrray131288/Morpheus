import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pill, Calendar, Clock } from "lucide-react";
import type { Patient, PrescribedMedication } from "@shared/schema";

export default function MedicationsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: medications = [] } = useQuery<PrescribedMedication[]>({
    queryKey: [`/api/patients/${selectedPatientId}/medications`],
    enabled: !!selectedPatientId,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-500">Manage patient medications and prescriptions</p>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="medical-card p-6 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Patient:</label>
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPatient ? (
        <div className="medical-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Medications for {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medications.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No medications recorded</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add First Medication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{medication.name}</h3>
                    <span className={medication.status === "Active" ? "status-active" : "status-inactive"}>
                      {medication.status || "Unknown"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Pill className="w-4 h-4 mr-1" />
                        Strength
                      </div>
                      <div className="font-medium">{medication.strength || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Dosage
                      </div>
                      <div className="font-medium">{medication.dosage || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Frequency
                      </div>
                      <div className="font-medium">{medication.frequency || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        Start Date
                      </div>
                      <div className="font-medium">
                        {medication.startDate ? new Date(medication.startDate).toLocaleDateString() : "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="medical-card p-12 text-center">
          <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
          <p className="text-gray-500">Choose a patient from the dropdown above to view their medications</p>
        </div>
      )}
    </div>
  );
}