import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Pill, Calendar, Clock, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import QuickSearchBar from "@/components/quick-search-bar";
import AddMedicationModal from "@/components/modals/add-medication-modal";
import EditMedicationModal from "@/components/modals/edit-medication-modal";
import type { Patient, PrescribedMedication } from "@shared/schema";

export default function MedicationsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: medications = [] } = useQuery<PrescribedMedication[]>({
    queryKey: [`/api/patients/${selectedPatientId}/medications`],
    enabled: !!selectedPatientId,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const deleteMedicationMutation = useMutation({
    mutationFn: async (medicationId: string) => {
      await apiRequest("DELETE", `/api/medications/${medicationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/medications`] });
      toast({
        title: "Success",
        description: "Medication removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove medication",
        variant: "destructive",
      });
    },
  });

  const handleDeleteMedication = (medicationId: string, medicationName: string) => {
    if (window.confirm(`Are you sure you want to remove ${medicationName}?`)) {
      deleteMedicationMutation.mutate(medicationId);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-500">Manage patient medications and prescriptions</p>
        </div>
      </div>

      {/* Patient Search */}
      <div className="medical-card p-6 mb-6">
        <QuickSearchBar 
          onPatientSelect={(patient) => setSelectedPatientId(patient.id)} 
        />
      </div>

      {selectedPatient ? (
        <div className="medical-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Medications for {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medications.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No medications recorded</p>
              <Button variant="outline" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Medication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => (
                <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{medication.name}</h3>
                      {(medication.status === "Inactive" || medication.status === "Discontinued") && (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={medication.status === "Active" ? "status-active" : "status-inactive"}>
                        {medication.status || "Unknown"}
                      </span>
                      <EditMedicationModal medication={medication} patientId={selectedPatientId} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedication(medication.id, medication.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteMedicationMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
      
      {/* Add Medication Modal */}
      {selectedPatientId && (
        <AddMedicationModal 
          open={showAddModal}
          onOpenChange={setShowAddModal}
          patientId={selectedPatientId}
        />
      )}
    </div>
  );
}