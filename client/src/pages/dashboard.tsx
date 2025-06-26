import { useState } from "react";
import Sidebar from "@/components/sidebar";
import PatientSelector from "@/components/patient-selector";
import HealthMetricsCards from "@/components/health-metrics-cards";
import MedicationsSection from "@/components/medications-section";
import LabResultsSection from "@/components/lab-results-section";
import VisitNotesSection from "@/components/visit-notes-section";
import PrecisionMedicineSection from "@/components/precision-medicine-section";
import AdvancedTreatmentsSection from "@/components/advanced-treatments-section";
import QuickActions from "@/components/quick-actions";
import AddPatientModal from "@/components/modals/add-patient-modal";
import AddMedicationModal from "@/components/modals/add-medication-modal";
import AddVisitNoteModal from "@/components/modals/add-visit-note-modal";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@shared/schema";

export default function Dashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showAddVisitNoteModal, setShowAddVisitNoteModal] = useState(false);

  const { data: patients = [], isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Auto-select first patient if none selected
  if (!selectedPatientId && patients.length > 0) {
    setSelectedPatientId(patients[0].id);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Dashboard</h2>
              <p className="text-sm text-gray-500">Comprehensive patient health overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddPatientModal(true)}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
              <Button variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {patientsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Loading patients...</div>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-lg text-gray-500 mb-4">No patients found</div>
                <Button onClick={() => setShowAddPatientModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Patient
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Patient Selection */}
              <PatientSelector
                patients={patients}
                selectedPatientId={selectedPatientId}
                onPatientSelect={setSelectedPatientId}
                selectedPatient={selectedPatient}
              />

              {selectedPatient && (
                <>
                  {/* Health Metrics Overview */}
                  <HealthMetricsCards patientId={selectedPatient.id} />

                  {/* Detailed Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <MedicationsSection 
                      patientId={selectedPatient.id}
                      onAddMedication={() => setShowAddMedicationModal(true)}
                    />
                    <LabResultsSection patientId={selectedPatient.id} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <VisitNotesSection 
                      patientId={selectedPatient.id}
                      onAddNote={() => setShowAddVisitNoteModal(true)}
                    />
                    <PrecisionMedicineSection patientId={selectedPatient.id} />
                  </div>

                  {/* Advanced Treatment Tracking */}
                  <AdvancedTreatmentsSection patientId={selectedPatient.id} />

                  {/* Quick Actions */}
                  <QuickActions />
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddPatientModal
        open={showAddPatientModal}
        onOpenChange={setShowAddPatientModal}
      />
      
      {selectedPatient && (
        <>
          <AddMedicationModal
            open={showAddMedicationModal}
            onOpenChange={setShowAddMedicationModal}
            patientId={selectedPatient.id}
          />
          
          <AddVisitNoteModal
            open={showAddVisitNoteModal}
            onOpenChange={setShowAddVisitNoteModal}
            patientId={selectedPatient.id}
          />
        </>
      )}
    </div>
  );
}
