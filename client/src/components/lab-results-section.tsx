import { useQuery } from "@tanstack/react-query";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LabRecord } from "@shared/schema";

interface LabResultsSectionProps {
  patientId: string;
}

export default function LabResultsSection({ patientId }: LabResultsSectionProps) {
  const { data: labRecords = [], isLoading } = useQuery<LabRecord[]>({
    queryKey: [`/api/patients/${patientId}/lab-records`],
  });

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
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload Report
        </Button>
      </div>

      {labRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No lab results recorded</p>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload First Report
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {labRecords.map((record) => (
            <div key={record.id} className="lab-result-item">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Lab Record</h4>
                <span className="text-xs text-gray-500">
                  {new Date(record.recordDate).toLocaleDateString()}
                </span>
              </div>
              
              {record.panels && typeof record.panels === 'object' && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(record.panels as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-blue-700 text-xs font-medium"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {record.panels ? "Complete" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
