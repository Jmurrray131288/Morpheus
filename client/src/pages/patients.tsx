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
import WeightMuscleTrends from "@/components/weight-muscle-trends";
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
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {patient.profileImageUrl ? (
                    <img 
                      src={patient.profileImageUrl} 
                      alt={`${patient.firstName} ${patient.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
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
        </div>
        
        <div className="px-6">
          <div className="space-y-6">
            <HealthMetricsCards patientId={patient.id} />
            <WeightMuscleTrends patientId={patient.id} />
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
        <div className="medical-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-3 font-medium text-gray-700">Age</th>
                  <th className="text-left py-3 font-medium text-gray-700">Gender</th>
                  <th className="text-left py-3 font-medium text-gray-700">Contact</th>
                  <th className="text-left py-3 font-medium text-gray-700">DOB</th>
                  <th className="text-left py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <Link href={`/patients/${patient.id}`} className="flex items-center space-x-3 hover:text-blue-600">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                          {`${patient.firstName?.[0] || ''}${patient.lastName?.[0] || ''}`}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600">
                      {patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)}` : "—"}
                    </td>
                    <td className="py-3 text-gray-600">
                      {patient.gender || "—"}
                    </td>
                    <td className="py-3 text-gray-600">
                      {patient.contactNumber || "—"}
                    </td>
                    <td className="py-3 text-gray-600">
                      {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            View
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={(e) => e.preventDefault()}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddPatientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}