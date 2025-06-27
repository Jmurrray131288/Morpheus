import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PeptideEntry, SupplementEntry, IvTreatmentEntry } from "@shared/schema";

interface AdvancedTreatmentsSectionProps {
  patientId: string;
}

export default function AdvancedTreatmentsSection({ patientId }: AdvancedTreatmentsSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: peptides = [] } = useQuery<PeptideEntry[]>({
    queryKey: [`/api/patients/${patientId}/peptides`],
  });

  const { data: supplements = [] } = useQuery<SupplementEntry[]>({
    queryKey: [`/api/patients/${patientId}/supplements`],
  });

  const { data: ivTreatments = [] } = useQuery<IvTreatmentEntry[]>({
    queryKey: [`/api/patients/${patientId}/iv-treatments`],
  });

  // First create a medication entry, then create peptide linked to it
  const addPeptideMutation = useMutation({
    mutationFn: async () => {
      // Create medication entry first
      const medicationEntry = await apiRequest(`/api/patients/${patientId}/medication-entries`, "POST", {
        patientId,
        medicationType: "Peptide Therapy",
      });
      
      // Then create peptide linked to that entry
      return await apiRequest(`/api/patients/${patientId}/peptides`, "POST", {
        medicationEntryId: medicationEntry.id,
        name: "BPC-157",
        dosage: "250mcg",
        frequency: "Daily",
        startDate: new Date().toISOString().split('T')[0],
        status: "Active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/peptides`] });
      toast({
        title: "Success",
        description: "Sample peptide therapy added",
      });
    },
  });

  return (
    <div className="medical-card p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced Treatment Protocols</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Peptide Therapy */}
        <div className="treatment-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              <i className="fas fa-syringe mr-2 text-blue-500"></i>Peptide Therapy
            </h4>
            <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {peptides.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">No peptide treatments</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addPeptideMutation.mutate()}
                  disabled={addPeptideMutation.isPending}
                  className="w-full"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {addPeptideMutation.isPending ? "Adding..." : "Add Sample Data"}
                </Button>
              </div>
            ) : (
              peptides.map((peptide) => (
                <div key={peptide.id} className="treatment-peptide">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{peptide.name}</span>
                    <span className="text-xs text-gray-500">{peptide.status}</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Dosage: <span>{peptide.dosage}</span></div>
                    <div>Frequency: <span>{peptide.frequency}</span></div>
                    <div>Started: <span>{peptide.startDate ? new Date(peptide.startDate).toLocaleDateString() : "N/A"}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Supplements */}
        <div className="treatment-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              <i className="fas fa-capsules mr-2 text-green-500"></i>Supplements
            </h4>
            <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {supplements.length === 0 ? (
              <p className="text-sm text-gray-500">No supplements</p>
            ) : (
              supplements.map((supplement) => (
                <div key={supplement.id} className="treatment-supplement">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{supplement.name}</span>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Dosage: <span>{supplement.dosage}</span></div>
                    <div>Details: <span>{supplement.details ? JSON.stringify(supplement.details) : "N/A"}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* IV Treatments */}
        <div className="treatment-card">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              <i className="fas fa-tint mr-2 text-purple-500"></i>IV Treatments
            </h4>
            <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {ivTreatments.length === 0 ? (
              <p className="text-sm text-gray-500">No IV treatments</p>
            ) : (
              ivTreatments.map((treatment) => (
                <div key={treatment.id} className="treatment-iv">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{treatment.name}</span>
                    <span className="text-xs text-gray-500">Scheduled</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Components: <span>{treatment.components ? JSON.stringify(treatment.components) : "N/A"}</span></div>
                    <div>Next: <span>To be scheduled</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
