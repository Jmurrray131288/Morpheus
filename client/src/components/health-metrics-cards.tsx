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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Body Composition */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Body Composition</h4>
          <i className="fas fa-weight text-secondary"></i>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">BMI</span>
            <span className="font-medium">{latestBodyComp?.bmi?.toFixed(1) || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Body Fat</span>
            <span className="font-medium">{latestBodyComp?.bodyFatPercentage ? `${latestBodyComp.bodyFatPercentage.toFixed(1)}%` : "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Muscle Mass</span>
            <span className="font-medium">{latestBodyComp?.skeletalMuscle ? `${latestBodyComp.skeletalMuscle.toFixed(1)}%` : "N/A"}</span>
          </div>
        </div>
        {bodyComposition.length === 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => addBodyCompositionMutation.mutate()}
              disabled={addBodyCompositionMutation.isPending}
              className="w-full"
            >
              <Plus className="w-3 h-3 mr-1" />
              {addBodyCompositionMutation.isPending ? "Adding..." : "Add Sample Data"}
            </Button>
          </div>
        )}
      </div>

      {/* Cardiovascular */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Cardiovascular</h4>
          <i className="fas fa-heartbeat text-red-500"></i>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Blood Pressure</span>
            <span className="font-medium">
              {latestCardio?.bloodPressure ? "Recorded" : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Cholesterol</span>
            <span className="font-medium">
              {latestCardio?.lipids ? "Recorded" : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Heart Rate</span>
            <span className="font-medium">N/A</span>
          </div>
        </div>
      </div>

      {/* Metabolic Health */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Metabolic Health</h4>
          <i className="fas fa-chart-line text-accent"></i>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Glucose</span>
            <span className="font-medium">
              {latestMetabolic?.glucoseMetrics ? "Recorded" : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">HbA1c</span>
            <span className="font-medium">
              {latestMetabolic?.metabolicMarkers ? "Recorded" : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Insulin</span>
            <span className="font-medium">N/A</span>
          </div>
        </div>
      </div>

      {/* Lab Status */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Lab Status</h4>
          <i className="fas fa-flask text-purple-500"></i>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Pending Tests</span>
            <span className="font-medium text-accent">{pendingLabs}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed</span>
            <span className="font-medium text-secondary">{completedLabs}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Last Updated</span>
            <span className="font-medium">
              {lastLabUpdate ? new Date(lastLabUpdate).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
