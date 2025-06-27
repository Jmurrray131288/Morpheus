import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Phone, Calendar, ArrowLeft } from "lucide-react";
import AddPatientModal from "@/components/modals/add-patient-modal";
import PatientSelector from "@/components/patient-selector";
import HealthMetricsCards from "@/components/health-metrics-cards";
import MedicationsSection from "@/components/medications-section";
import LabResultsSection from "@/components/lab-results-section";
import VisitNotesSection from "@/components/visit-notes-section";
import PrecisionMedicineSection from "@/components/precision-medicine-section";
import AdvancedTreatmentsSection from "@/components/advanced-treatments-section";
import type { Patient } from "@shared/schema";
import { calculateAge } from "@/lib/medical-utils";

export default function PatientsPage() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // If we have a patient ID in the URL, show the patient profile
  if (params.id) {
    const patient = patients.find(p => p.id === params.id);
    
    if (isLoading) {
      return (
        <div className="flex-1 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!patient) {
      return (
        <div className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/patients")}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </div>
          <div className="text-center py-12">
            <div className="text-gray-500">Patient not found</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1">
        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 w-full py-6 mb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)} years old` : "Age unknown"}</span>
                {patient.gender && <span>• {patient.gender}</span>}
                {patient.contactNumber && <span>• {patient.contactNumber}</span>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6">
          <div className="space-y-6">
            <HealthMetricsCards patientId={patient.id} />
            <MedicationsSection 
              patientId={patient.id} 
              onAddMedication={() => {}} 
            />
            <LabResultsSection patientId={patient.id} />
            <VisitNotesSection 
              patientId={patient.id} 
              onAddNote={() => {}} 
            />
            <PrecisionMedicineSection patientId={patient.id} />
            <AdvancedTreatmentsSection patientId={patient.id} />
          </div>
        </div>
      </div>
    );
  }

  // Show patient list view
  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">Manage patient records and information</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No patients found</div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Patient
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <div className="medical-card p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)} years old` : "Age unknown"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={(e) => e.preventDefault()}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {patient.contactNumber || "No phone number"}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "No DOB"}
                  </div>
                  <div className="text-gray-600">
                    Gender: {patient.gender || "Not specified"}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Record
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddPatientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}