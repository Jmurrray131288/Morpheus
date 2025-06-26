import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dna, Microscope, FileText, Plus } from "lucide-react";
import type { Patient, GenomicReport, PrecisionLabReport, PrecisionTest } from "@shared/schema";

export default function PrecisionMedicinePage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: genomicReports = [] } = useQuery<GenomicReport[]>({
    queryKey: [`/api/patients/${selectedPatientId}/genomic-reports`],
    enabled: !!selectedPatientId,
  });

  const { data: precisionLabReports = [] } = useQuery<PrecisionLabReport[]>({
    queryKey: [`/api/patients/${selectedPatientId}/precision-lab-reports`],
    enabled: !!selectedPatientId,
  });

  const { data: precisionTests = [] } = useQuery<PrecisionTest[]>({
    queryKey: [`/api/patients/${selectedPatientId}/precision-tests`],
    enabled: !!selectedPatientId,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Precision Medicine</h1>
          <p className="text-gray-500">Genomic analysis and personalized treatment insights</p>
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
            Precision Medicine for {selectedPatient.firstName} {selectedPatient.lastName}
          </h2>

          {/* Genomic Reports */}
          <div className="precision-genomic">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Dna className="w-5 h-5 mr-2 text-purple-600" />
                Genomic Analysis
              </h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Order Genomic Test
              </Button>
            </div>
            
            {genomicReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No genomic reports available</p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Order First Genomic Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {genomicReports.map((report) => (
                  <div key={report.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-purple-900">Genomic Report</h4>
                      <span className="text-sm text-purple-600">
                        {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "Date unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Pharmacogenomics:</span>
                        <span className="ml-2 font-medium text-purple-700">Available</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Disease Risk:</span>
                        <span className="ml-2 font-medium text-purple-700">Analyzed</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Drug Metabolism:</span>
                        <span className="ml-2 font-medium text-purple-700">Analyzed</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                      <FileText className="w-4 h-4 mr-1" />
                      View Full Report
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Precision Lab Reports */}
          <div className="precision-lab">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Microscope className="w-5 h-5 mr-2 text-indigo-600" />
                Precision Lab Tests
              </h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Order Lab Test
              </Button>
            </div>
            
            {precisionLabReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No precision lab reports available</p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Order First Precision Test
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {precisionLabReports.map((report) => (
                  <div key={report.id} className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-indigo-900">Precision Lab Report</h4>
                      <span className="text-sm text-indigo-600">
                        {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "Date unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Micronutrient Panel:</span>
                        <span className="ml-2 font-medium text-indigo-700">Complete</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Food Sensitivity:</span>
                        <span className="ml-2 font-medium text-indigo-700">Complete</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hormonal Balance:</span>
                        <span className="ml-2 font-medium text-indigo-700">Complete</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">
                      <FileText className="w-4 h-4 mr-1" />
                      View Analysis
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Precision Tests */}
          <div className="medical-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Additional Precision Tests</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Test Result
              </Button>
            </div>
            
            {precisionTests.length === 0 ? (
              <p className="text-gray-500">No additional precision tests recorded</p>
            ) : (
              <div className="space-y-3">
                {precisionTests.map((test) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{test.testType || "Precision Test"}</h4>
                      <span className="text-sm text-gray-500">
                        {test.testDate ? new Date(test.testDate).toLocaleDateString() : "Date unknown"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Results: {test.testResult ? "Available" : "Pending"}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <FileText className="w-4 h-4 mr-1" />
                      View Results
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="medical-card p-12 text-center">
          <Dna className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
          <p className="text-gray-500">Choose a patient from the dropdown above to view their precision medicine data</p>
        </div>
      )}
    </div>
  );
}