import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { BodyCompositionEntry } from "@shared/schema";

interface BodyCompositionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: BodyCompositionEntry[];
  patientName: string;
}

export default function BodyCompositionHistoryModal({
  isOpen,
  onClose,
  entries,
  patientName,
}: BodyCompositionHistoryModalProps) {
  const sortedEntries = entries.sort((a, b) => 
    new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
  );

  const getTrend = (current: number, previous: number) => {
    if (!previous) return null;
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return { icon: Minus, color: "text-gray-500", text: "No change" };
    if (diff > 0) return { icon: TrendingUp, color: "text-green-600", text: `+${diff.toFixed(1)}` };
    return { icon: TrendingDown, color: "text-red-600", text: `${diff.toFixed(1)}` };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Body Composition History - {patientName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {sortedEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No body composition entries found</p>
          ) : (
            <div className="space-y-3">
              {sortedEntries.map((entry, index) => {
                const previousEntry = sortedEntries[index + 1];
                const weightTrend = getTrend(entry.weightPounds || 0, previousEntry?.weightPounds || 0);
                const bmiTrend = getTrend(entry.bmi || 0, previousEntry?.bmi || 0);
                const bodyFatTrend = getTrend(entry.bodyFatPercentage || 0, previousEntry?.bodyFatPercentage || 0);
                const muscleTrend = getTrend(entry.skeletalMuscle || 0, previousEntry?.skeletalMuscle || 0);

                return (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">
                        {format(new Date(entry.entryDate), "MMM dd, yyyy 'at' h:mm a")}
                      </h3>
                      {index === 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          Latest
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Weight</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.weightPounds || 0} lbs</span>
                          {weightTrend && index > 0 && (
                            <div className={`flex items-center ${weightTrend.color}`}>
                              <weightTrend.icon className="w-3 h-3" />
                              <span className="text-xs ml-1">{weightTrend.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">BMI</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.bmi || 0}</span>
                          {bmiTrend && index > 0 && (
                            <div className={`flex items-center ${bmiTrend.color}`}>
                              <bmiTrend.icon className="w-3 h-3" />
                              <span className="text-xs ml-1">{bmiTrend.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Body Fat</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.bodyFatPercentage || 0}%</span>
                          {bodyFatTrend && index > 0 && (
                            <div className={`flex items-center ${bodyFatTrend.color}`}>
                              <bodyFatTrend.icon className="w-3 h-3" />
                              <span className="text-xs ml-1">{bodyFatTrend.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Muscle Mass</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.skeletalMuscle || 0} lbs</span>
                          {muscleTrend && index > 0 && (
                            <div className={`flex items-center ${muscleTrend.color}`}>
                              <muscleTrend.icon className="w-3 h-3" />
                              <span className="text-xs ml-1">{muscleTrend.text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Height</div>
                        <div className="font-medium">{entry.heightInches || 0} inches</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">Visceral Fat</div>
                        <div className="font-medium">{entry.visceralFat || 0}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}