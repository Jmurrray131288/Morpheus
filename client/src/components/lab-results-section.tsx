import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabRecord } from "@shared/schema";
import UploadLabReportModal from "@/components/modals/upload-lab-report-modal";

interface LabResultsSectionProps {
  patientId: string;
  patientName?: string;
}

export default function LabResultsSection({ patientId, patientName }: LabResultsSectionProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const { data: profileData, isLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}/profile`],
  });

  const labRecords = profileData?.labRecords || [];

  if (isLoading) {
    return (
      <div className="health-section">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Lab Results</h3>
        <Button
          variant="ghost"
          className="text-primary hover:text-blue-700 text-sm font-medium"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload Report
        </Button>
      </div>

      {labRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No lab results recorded</p>
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload First Report
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Date</th>
                <th className="text-left py-2 font-medium text-gray-700">Test Results</th>
                <th className="text-left py-2 font-medium text-gray-700">Status</th>
                <th className="text-left py-2 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {labRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="py-3 text-gray-600">
                    {new Date(record.recordDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    {record.panels && typeof record.panels === 'object' ? (
                      <div className="text-sm">
                        {Object.entries(record.panels as Record<string, any>).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').trim()}: {String(value)}
                          </div>
                        ))}
                        {Object.keys(record.panels as Record<string, any>).length > 2 && (
                          <div className="text-gray-500 text-xs">
                            +{Object.keys(record.panels as Record<string, any>).length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">No results available</span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.panels ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.panels ? "Complete" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 text-xs"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
