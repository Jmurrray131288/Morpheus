import { useState } from "react";
import TodaysSchedule from "@/components/todays-schedule";
import PriorityAlerts from "@/components/priority-alerts";

import QuickSearchBar from "@/components/quick-search-bar";
import HealthMetricsCards from "@/components/health-metrics-cards";
import AddPatientModal from "@/components/modals/add-patient-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@shared/schema";

export default function Dashboard() {
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data: patients = [], isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Clinical Dashboard</h2>
            <p className="text-sm text-gray-500">Daily practice overview and patient management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setShowAddPatientModal(true)}
              className="bg-primary text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {patientsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-500">Loading dashboard...</div>
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
          <div className="space-y-6">
            {/* Patient Search Bar */}
            <QuickSearchBar onPatientSelect={handlePatientSelect} />
            
            {/* Priority Alerts - Full Width */}
            <PriorityAlerts />
            
            {/* Today's Schedule - Full Width */}
            <TodaysSchedule />

            {/* Selected Patient Health Metrics */}
            {selectedPatient && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPatient.firstName} {selectedPatient.lastName} - Health Overview
                </h3>
                <HealthMetricsCards patientId={selectedPatient.id} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddPatientModal
        open={showAddPatientModal}
        onOpenChange={setShowAddPatientModal}
      />
    </div>
  );
}