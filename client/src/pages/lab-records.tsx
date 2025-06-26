import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, FileText, Upload, Calendar } from "lucide-react";
import type { Patient, LabRecord } from "@shared/schema";

export default function LabRecordsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: labRecords = [] } = useQuery<LabRecord[]>({
    queryKey: [`/api/patients/${selectedPatientId}/lab-records`],
    enabled: !!selectedPatientId,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Records</h1>
          <p className="text-gray-500">Manage laboratory results and reports</p>
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
              Lab Records for {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Lab Report
            </Button>
          </div>

          {labRecords.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No lab records found</p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload First Lab Report
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {labRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TestTube className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">Lab Record</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </div>
                      <span className={record.panels ? "status-active" : "status-pending"}>
                        {record.panels ? "Complete" : "Pending"}
                      </span>
                    </div>
                  </div>
                  
                  {record.panels && typeof record.panels === 'object' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {Object.entries(record.panels as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="font-semibold">{value ? String(value) : "N/A"}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {record.pdfReports && (
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View PDF Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="medical-card p-12 text-center">
          <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
          <p className="text-gray-500">Choose a patient from the dropdown above to view their lab records</p>
        </div>
      )}
    </div>
  );
}