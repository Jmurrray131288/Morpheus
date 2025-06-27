import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBodyCompositionEntrySchema, type InsertBodyCompositionEntry } from "@shared/schema";

interface AddBodyCompositionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export default function AddBodyCompositionModal({
  open,
  onOpenChange,
  patientId,
}: AddBodyCompositionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertBodyCompositionEntry>({
    resolver: zodResolver(insertBodyCompositionEntrySchema),
    defaultValues: {
      patientId,
      entryDate: new Date(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertBodyCompositionEntry) => {
      return await apiRequest(`/api/patients/${patientId}/body-composition`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/body-composition`] });
      toast({
        title: "Success",
        description: "Body composition entry added successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add body composition entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBodyCompositionEntry) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Body Composition Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                {...form.register("height", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                {...form.register("weight", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                {...form.register("bmi", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="bodyFatPercentage">Body Fat (%)</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                step="0.1"
                {...form.register("bodyFatPercentage", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="skeletalMuscle">Skeletal Muscle (%)</Label>
              <Input
                id="skeletalMuscle"
                type="number"
                step="0.1"
                {...form.register("skeletalMuscle", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="visceralFat">Visceral Fat</Label>
              <Input
                id="visceralFat"
                type="number"
                step="0.1"
                {...form.register("visceralFat", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="entryDate">Entry Date</Label>
            <Input
              id="entryDate"
              type="date"
              {...form.register("entryDate", { valueAsDate: true })}
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
              {mutation.isPending ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}