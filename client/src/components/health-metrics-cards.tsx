import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BodyCompositionEntry, CardiovascularHealthEntry, MetabolicHealthEntry, LabRecord } from "@shared/schema";

interface HealthMetricsCardsProps {
  patientId: string;
}

export default function HealthMetricsCards({ patientId }: HealthMetricsCardsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: bodyComposition = [] } = useQuery<BodyCompositionEntry[]>({
    queryKey: [`/api/patients/${patientId}/body-composition`],
  });

  const { data: cardiovascularHealth = [] } = useQuery<CardiovascularHealthEntry[]>({
    queryKey: [`/api/patients/${patientId}/cardiovascular-health`],
  });

  const { data: metabolicHealth = [] } = useQuery<MetabolicHealthEntry[]>({
    queryKey: [`/api/patients/${patientId}/metabolic-health`],
  });

  const { data: labRecords = [] } = useQuery<LabRecord[]>({
    queryKey: [`/api/patients/${patientId}/lab-records`],
  });

  const latestBodyComp = bodyComposition[0];
  const latestCardio = cardiovascularHealth[0];
  const latestMetabolic = metabolicHealth[0];

  const pendingLabs = labRecords.filter(record => !record.panels).length;
  const completedLabs = labRecords.filter(record => record.panels).length;
  const lastLabUpdate = labRecords[0]?.recordDate;

  // Mutation to add sample body composition data
  const addBodyCompositionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/patients/${patientId}/body-composition`, "POST", {
        patientId,
        height: 175,
        weight: 70.5,
        bmi: 23.0,
        bodyFatPercentage: 15.2,
        skeletalMuscle: 42.3,
        visceralFat: 8,
        entryDate: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/body-composition`] });
      toast({
        title: "Success",
        description: "Body composition data added",
      });
    },
  });

  return (
    <div className="medical-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Health Metrics</h3>
        {bodyComposition.length === 0 && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => addBodyCompositionMutation.mutate()}
            disabled={addBodyCompositionMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            {addBodyCompositionMutation.isPending ? "Adding..." : "Add Sample Data"}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-700">Category</th>
              <th className="text-left py-2 font-medium text-gray-700">Key Metrics</th>
              <th className="text-left py-2 font-medium text-gray-700">Last Updated</th>
              <th className="text-left py-2 font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="py-3 font-medium text-blue-700">Body Composition</td>
              <td className="py-3">
                {latestBodyComp ? (
                  <span>BMI: {latestBodyComp.bmi?.toFixed(1)} • Weight: {latestBodyComp.weight}kg • Body Fat: {latestBodyComp.bodyFatPercentage?.toFixed(1)}%</span>
                ) : (
                  <span className="text-gray-500">No data available</span>
                )}
              </td>
              <td className="py-3 text-gray-600">
                {latestBodyComp ? new Date(latestBodyComp.entryDate).toLocaleDateString() : "—"}
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${latestBodyComp ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {latestBodyComp ? 'Current' : 'Pending'}
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="py-3 font-medium text-red-700">Cardiovascular</td>
              <td className="py-3">
                {latestCardio ? (
                  <span>BP: {latestCardio.bloodPressure ? 'Recorded' : 'N/A'} • Cholesterol: {latestCardio.lipids ? 'Recorded' : 'N/A'}</span>
                ) : (
                  <span className="text-gray-500">No data available</span>
                )}
              </td>
              <td className="py-3 text-gray-600">
                {latestCardio ? new Date(latestCardio.entryDate).toLocaleDateString() : "—"}
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${latestCardio ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {latestCardio ? 'Current' : 'Pending'}
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="py-3 font-medium text-green-700">Metabolic Health</td>
              <td className="py-3">
                {latestMetabolic ? (
                  <span>Glucose: {latestMetabolic.glucoseMetrics ? 'Recorded' : 'N/A'} • HbA1c: {latestMetabolic.metabolicMarkers ? 'Recorded' : 'N/A'}</span>
                ) : (
                  <span className="text-gray-500">No data available</span>
                )}
              </td>
              <td className="py-3 text-gray-600">
                {latestMetabolic ? new Date(latestMetabolic.entryDate).toLocaleDateString() : "—"}
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${latestMetabolic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {latestMetabolic ? 'Current' : 'Pending'}
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="py-3 font-medium text-purple-700">Lab Records</td>
              <td className="py-3">
                <span>Pending: {pendingLabs} • Completed: {completedLabs}</span>
              </td>
              <td className="py-3 text-gray-600">
                {lastLabUpdate ? new Date(lastLabUpdate).toLocaleDateString() : "—"}
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${completedLabs > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {completedLabs > 0 ? 'Active' : 'None'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
