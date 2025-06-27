import { useQuery } from "@tanstack/react-query";
import { Plus, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GenomicReport, PrecisionLabReport, PrecisionTest } from "@shared/schema";

interface PrecisionMedicineSectionProps {
  patientId: string;
}

export default function PrecisionMedicineSection({ patientId }: PrecisionMedicineSectionProps) {
  const { data: profileData } = useQuery({
    queryKey: [`/api/patients/${patientId}/profile`],
  });

  const genomicReports = profileData?.genomicReports || [];
  const precisionLabReports = profileData?.precisionLabReports || [];
  const precisionTests = profileData?.precisionTests || [];

  const latestGenomic = genomicReports[0];
  const latestPrecisionLab = precisionLabReports[0];

  return (
    <div className="health-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Precision Medicine</h3>
        <Button
          variant="ghost"
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Order Test
        </Button>
      </div>

      <div className="space-y-4">
        {/* Genomic Reports Section */}
        <div className="precision-genomic">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-purple-900">
              <i className="fas fa-dna mr-2"></i>Genomic Analysis
            </h4>
            <span className="text-xs text-purple-600">
              {latestGenomic?.reportDate ? new Date(latestGenomic.reportDate).toLocaleDateString() : "No reports"}
            </span>
          </div>
          
          {latestGenomic ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pharmacogenomics:</span>
                <span className="font-medium text-purple-700">Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disease Risk:</span>
                <span className="font-medium text-purple-700">Analyzed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drug Metabolism:</span>
                <span className="font-medium text-purple-700">Analyzed</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-purple-600 hover:text-purple-800 text-xs font-medium"
              >
                <FileText className="w-3 h-3 mr-1" />
                View Full Report
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No genomic reports available</p>
          )}
        </div>

        {/* Precision Lab Tests */}
        <div className="precision-lab">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-indigo-900">
              <i className="fas fa-microscope mr-2"></i>Precision Lab Tests
            </h4>
            <span className="text-xs text-indigo-600">
              {latestPrecisionLab?.reportDate ? new Date(latestPrecisionLab.reportDate).toLocaleDateString() : "No reports"}
            </span>
          </div>
          
          {latestPrecisionLab ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Micronutrient Panel:</span>
                <span className="font-medium text-indigo-700">Complete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Food Sensitivity:</span>
                <span className="font-medium text-indigo-700">Complete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hormonal Balance:</span>
                <span className="font-medium text-indigo-700">Complete</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                View Analysis
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No precision lab reports available</p>
          )}
        </div>
      </div>
    </div>
  );
}
