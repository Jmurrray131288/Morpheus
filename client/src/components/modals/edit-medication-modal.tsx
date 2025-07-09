import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit2, AlertTriangle } from "lucide-react";
import type { PrescribedMedication } from "@shared/schema";

interface EditMedicationModalProps {
  medication: PrescribedMedication;
  patientId: string;
}

export default function EditMedicationModal({ medication, patientId }: EditMedicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: medication.name,
    strength: medication.strength || "",
    dosage: medication.dosage || "",
    frequency: medication.frequency || "",
    duration: medication.duration || "",
    instructions: medication.instructions || "",
    status: medication.status || "Active",
    discontinuationReason: medication.discontinuationReason || "",
    discontinuedBy: medication.discontinuedBy || "",
    discontinuationDate: medication.discontinuationDate || "",
  });
  const [staffInitials, setStaffInitials] = useState("");
  const [confirmDiscontinuation, setConfirmDiscontinuation] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMedicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/medications/${medication.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/medications`] });
      toast({
        title: "Success",
        description: "Medication updated successfully",
      });
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.error("Medication update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update medication",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.status === "Inactive" || formData.status === "Discontinued") {
      if (!formData.discontinuationReason.trim()) {
        toast({
          title: "Required Field",
          description: "Please provide a reason for discontinuing this medication",
          variant: "destructive",
        });
        return;
      }
      
      if (!staffInitials.trim()) {
        toast({
          title: "Required Field", 
          description: "Please enter your initials to confirm this change",
          variant: "destructive",
        });
        return;
      }
      
      if (!confirmDiscontinuation) {
        toast({
          title: "Confirmation Required",
          description: "Please confirm that you want to discontinue this medication",
          variant: "destructive",
        });
        return;
      }
    }

    const updateData = {
      ...formData,
      discontinuedBy: formData.status === "Inactive" || formData.status === "Discontinued" ? staffInitials : "",
      discontinuationDate: formData.status === "Inactive" || formData.status === "Discontinued" ? new Date().toISOString() : null,
    };

    updateMedicationMutation.mutate(updateData);
  };

  const isDiscontinuing = formData.status === "Inactive" || formData.status === "Discontinued";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Medication - {medication.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Medication Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="strength">Strength</Label>
              <Input
                id="strength"
                value={formData.strength}
                onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
                placeholder="e.g., 10mg, 500mg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet, 2 capsules"
              />
            </div>
            
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Twice daily, Every 8 hours"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 30 days, 2 weeks"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Special instructions for taking this medication"
              rows={3}
            />
          </div>
          
          {isDiscontinuing && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Discontinuation Information Required</span>
              </div>
              
              <div>
                <Label htmlFor="discontinuationReason">Reason for Discontinuation *</Label>
                <Textarea
                  id="discontinuationReason"
                  value={formData.discontinuationReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, discontinuationReason: e.target.value }))}
                  placeholder="Explain why this medication is being discontinued (e.g., side effects, completed treatment, patient request, etc.)"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="staffInitials">Your Initials *</Label>
                <Input
                  id="staffInitials"
                  value={staffInitials}
                  onChange={(e) => setStaffInitials(e.target.value.toUpperCase())}
                  placeholder="Enter your initials (e.g., JD)"
                  maxLength={4}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Your initials will be recorded with this change for audit purposes
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmDiscontinuation"
                  checked={confirmDiscontinuation}
                  onCheckedChange={(checked) => setConfirmDiscontinuation(checked as boolean)}
                />
                <Label htmlFor="confirmDiscontinuation" className="text-sm">
                  I confirm that I want to discontinue this medication and have provided accurate information
                </Label>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
  <Button
    type="button"
    variant="outline"
    onClick={() => onOpenChange(false)}
  >
    Cancel
  </Button>

  <Button
    type="submit"
    disabled={false} // Temporarily always enabled
  >
    {createMedicationMutation.isPending ? "Adding..." : "Add Medication"}
  </Button>
</div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
