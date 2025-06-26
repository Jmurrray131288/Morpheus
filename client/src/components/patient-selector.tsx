import { Edit } from "lucide-react";
import { User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Patient } from "@shared/schema";
import { calculateAge } from "@/lib/medical-utils";

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: string;
  onPatientSelect: (patientId: string) => void;
  selectedPatient?: Patient;
}

export default function PatientSelector({
  patients,
  selectedPatientId,
  onPatientSelect,
  selectedPatient,
}: PatientSelectorProps) {
  return (
    <div className="mb-8">
      <div className="medical-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Patient</h3>
          <div className="flex items-center space-x-3">
            <Select value={selectedPatientId} onValueChange={onPatientSelect}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {`${patient.firstName} ${patient.lastName}`}
                    {patient.dateOfBirth && ` (DOB: ${patient.dateOfBirth})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button className="text-primary hover:text-blue-700">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedPatient && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <User className="text-gray-500 text-2xl" />
              </div>
              <h4 className="font-semibold text-gray-900">
                {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
              </h4>
              <p className="text-sm text-gray-500">
                {selectedPatient.dateOfBirth ? `${calculateAge(selectedPatient.dateOfBirth)} years old` : "Age unknown"}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Contact Info</h5>
              <p className="text-sm text-gray-600">{selectedPatient.contactNumber || "No phone"}</p>
              <p className="text-sm text-gray-600">{selectedPatient.gender || "Gender not specified"}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Latest Vitals</h5>
              <p className="text-sm text-gray-600">BP: Not recorded</p>
              <p className="text-sm text-gray-600">Weight: Not recorded</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Recent Activity</h5>
              <p className="text-sm text-gray-600">Last Visit: Not recorded</p>
              <p className="text-sm text-gray-600">Next: Not scheduled</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
