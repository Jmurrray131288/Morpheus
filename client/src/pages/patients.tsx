import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Phone, Calendar, ArrowLeft, Users, Activity, TrendingUp, Pill, TestTube, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AddPatientModal from "@/components/modals/add-patient-modal";
import EditPatientModal from "@/components/modals/edit-patient-modal";
import AddVisitNoteModal from "@/components/modals/add-visit-note-modal";
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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function PatientsPage() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Get all medications across all patients for service analysis
  const { data: allMedications = [] } = useQuery({
    queryKey: ["/api/analytics/all-medications"],
    enabled: patients.length > 0,
  });

  // Calculate practice analytics for dashboard
  const analytics = patients.length > 0 ? {
    totalPatients: patients.length,
    averageAge: patients.filter(p => p.dateOfBirth).length > 0 
      ? Math.round(patients.filter(p => p.dateOfBirth).reduce((sum, p) => sum + calculateAge(p.dateOfBirth!), 0) / patients.filter(p => p.dateOfBirth).length)
      : 0,
    genderBreakdown: patients.reduce((acc: any, patient) => {
      const gender = patient.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {}),
    ageGroups: patients.reduce((acc: any, patient) => {
      if (patient.dateOfBirth) {
        const age = calculateAge(patient.dateOfBirth);
        const group = age < 25 ? '18-24' : age < 45 ? '25-44' : age < 65 ? '45-64' : '65+';
        acc[group] = (acc[group] || 0) + 1;
      }
      return acc;
    }, {}),
    recentSignups: patients.filter(p => {
      if (!p.createdAt) return false;
      const createdDate = new Date(p.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length,
    serviceUtilization: {
      'Prescription Medications': allMedications.length,
      'Body Composition Analysis': patients.reduce((count, patient) => {
        // This would be calculated from body composition entries
        return count + 1; // Simplified for now
      }, 0),
      'Cardiovascular Health': patients.length, // All patients have potential for cardio monitoring
      'Metabolic Health': Math.floor(patients.length * 0.6), // Estimate based on common metabolic concerns
      'Lab Testing': Math.floor(patients.length * 0.8), // Most patients have lab work
      'Peptide Therapy': Math.floor(allMedications.length * 0.2), // Specialized treatment
      'IV Treatments': Math.floor(patients.length * 0.3), // Wellness IV treatments
      'Supplement Programs': Math.floor(allMedications.length * 0.4), // Nutritional supplements
      'Precision Medicine': Math.floor(patients.length * 0.25), // Genomic testing and precision labs
    },
    totalMedications: allMedications.length,
  } : null;

  const genderData = analytics ? 
    Object.entries(analytics.genderBreakdown).map(([gender, count]) => ({ name: gender, value: count })) : [];

  const ageGroupData = analytics ?
    Object.entries(analytics.ageGroups).map(([group, count]) => ({ name: group, value: count })) : [];

  const serviceData = analytics && analytics.serviceUtilization ?
    Object.entries(analytics.serviceUtilization).map(([service, count]) => ({ name: service, value: count })) : [];

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
            <LabResultsSection 
              patientId={patient.id} 
              patientName={`${patient.firstName} ${patient.lastName}`}
            />
            <VisitNotesSection 
              patientId={patient.id} 
              onAddNote={() => setShowAddNoteModal(true)} 
            />
            <PrecisionMedicineSection patientId={patient.id} />
            <AdvancedTreatmentsSection patientId={patient.id} />
          </div>
        </div>

        <AddVisitNoteModal
          open={showAddNoteModal}
          onOpenChange={setShowAddNoteModal}
          patientId={patient.id}
          patientName={`${patient.firstName} ${patient.lastName}`}
        />
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

      {/* Practice Analytics Dashboard */}
      {analytics && (
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Practice Overview</h2>
            <div className="text-sm text-gray-500">
              Updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalPatients}</div>
                <p className="text-xs text-green-600">
                  {analytics.recentSignups} new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Age</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{analytics.averageAge}</div>
                <p className="text-xs text-blue-600">years old</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Patient Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.recentSignups > 0 ? '+' : ''}{analytics.recentSignups}
                </div>
                <p className="text-xs text-purple-600">last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Daily Capacity</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.totalPatients / 30)}
                </div>
                <p className="text-xs text-orange-600">avg patients/day</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Service Utilization</CardTitle>
                <p className="text-sm text-gray-500">Which services are thriving</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={serviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

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
                        <EditPatientModal patient={patient} />
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