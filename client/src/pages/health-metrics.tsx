import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Activity, TrendingUp, Plus } from "lucide-react";
import AddBodyCompositionModal from "@/components/modals/add-body-composition-modal";
import AddCardiovascularModal from "@/components/modals/add-cardiovascular-modal";
import AddMetabolicModal from "@/components/modals/add-metabolic-modal";
import EditBodyCompositionModal from "@/components/modals/edit-body-composition-modal";
import type { Patient, BodyCompositionEntry, CardiovascularHealthEntry, MetabolicHealthEntry } from "@shared/schema";

export default function HealthMetricsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: bodyComposition = [] } = useQuery<BodyCompositionEntry[]>({
    queryKey: [`/api/patients/${selectedPatientId}/body-composition`],
    enabled: !!selectedPatientId,
  });

  const { data: cardiovascular = [] } = useQuery<CardiovascularHealthEntry[]>({
    queryKey: [`/api/patients/${selectedPatientId}/cardiovascular-health`],
    enabled: !!selectedPatientId,
  });

  const { data: metabolic = [] } = useQuery<MetabolicHealthEntry[]>({
    queryKey: [`/api/patients/${selectedPatientId}/metabolic-health`],
    enabled: !!selectedPatientId,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-500">Track patient health indicators and trends</p>
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
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Health Metrics for {selectedPatient.firstName} {selectedPatient.lastName}
          </h2>

          {/* Body Composition */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-500" />
                Body Composition
              </h3>
              <AddBodyCompositionModal patientId={selectedPatientId} />
            </div>
            
            {bodyComposition.length === 0 ? (
              <p className="text-gray-500">No body composition data recorded</p>
            ) : (
              <div className="space-y-4">
                {bodyComposition.map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.entryDate).toLocaleDateString()} at {new Date(entry.entryDate).toLocaleTimeString()}
                      </span>
                      <EditBodyCompositionModal patientId={selectedPatientId} entry={entry} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">BMI</div>
                        <div className="text-lg font-semibold">{entry.bmi?.toFixed(1) || "N/A"}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Body Fat %</div>
                        <div className="text-lg font-semibold">{entry.bodyFatPercentage?.toFixed(1) || "N/A"}%</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Muscle Mass</div>
                        <div className="text-lg font-semibold">{entry.skeletalMuscle?.toFixed(1) || "N/A"}%</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Weight</div>
                        <div className="text-lg font-semibold">{entry.weightPounds?.toFixed(1) || "N/A"} lbs</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cardiovascular Health */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Cardiovascular Health
              </h3>
              <AddCardiovascularModal patientId={selectedPatientId} />
            </div>
            
            {cardiovascular.length === 0 ? (
              <p className="text-gray-500">No cardiovascular data recorded</p>
            ) : (
              <div className="space-y-3">
                {cardiovascular.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Blood Pressure:</span>
                        <span className="ml-2 font-medium">
                          {entry.bloodPressure ? "Recorded" : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Lipids:</span>
                        <span className="ml-2 font-medium">
                          {entry.lipids ? "Recorded" : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Inflammation:</span>
                        <span className="ml-2 font-medium">
                          {entry.inflammation ? "Recorded" : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metabolic Health */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Metabolic Health
              </h3>
              <AddMetabolicModal patientId={selectedPatientId} />
            </div>
            
            {metabolic.length === 0 ? (
              <p className="text-gray-500">No metabolic data recorded</p>
            ) : (
              <div className="space-y-3">
                {metabolic.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Glucose:</span>
                        <span className="ml-2 font-medium">
                          {entry.glucoseMetrics ? "Recorded" : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Metabolic Markers:</span>
                        <span className="ml-2 font-medium">
                          {entry.metabolicMarkers ? "Recorded" : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Weight Management:</span>
                        <span className="ml-2 font-medium">
                          {entry.weightManagement ? "Recorded" : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="medical-card p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
          <p className="text-gray-500">Choose a patient from the dropdown above to view their health metrics</p>
        </div>
      )}
    </div>
  );
}
