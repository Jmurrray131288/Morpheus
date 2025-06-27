import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPeptideEntrySchema, type InsertPeptideEntry } from "@shared/schema";

interface AddPeptideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export default function AddPeptideModal({
  open,
  onOpenChange,
  patientId,
}: AddPeptideModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPeptideEntry>({
    resolver: zodResolver(insertPeptideEntrySchema),
    defaultValues: {
      patientId,
      medicationEntryId: "", // This will need to be linked to a medication entry
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertPeptideEntry) => {
      return await apiRequest(`/api/patients/${patientId}/peptides`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/peptides`] });
      toast({
        title: "Success",
        description: "Peptide therapy added successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add peptide therapy",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPeptideEntry) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Peptide Therapy</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Peptide Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="e.g., BPC-157, TB-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                {...form.register("dosage")}
                placeholder="e.g., 250mcg"
              />
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                {...form.register("frequency")}
                placeholder="e.g., Daily"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="route">Route</Label>
              <Select onValueChange={(value) => form.setValue("route", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                  <SelectItem value="intramuscular">Intramuscular</SelectItem>
                  <SelectItem value="oral">Oral</SelectItem>
                  <SelectItem value="nasal">Nasal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => form.setValue("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate", { valueAsDate: true })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate", { valueAsDate: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              {...form.register("notes")}
              placeholder="Treatment goals, observations..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding..." : "Add Peptide"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}