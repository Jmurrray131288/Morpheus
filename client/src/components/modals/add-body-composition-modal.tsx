import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertBodyCompositionEntrySchema, type InsertBodyCompositionEntry } from "@shared/schema";

interface AddBodyCompositionModalProps {
  patientId: string;
}

// Simplified form data for essential fields only
type FormData = {
  patientId: string;
  entryDate: string;
  heightInches: number;
  weightPounds: number;
  bodyFatPercentage: number;
  skeletalMuscle: number;
  visceralFat: number;
  bmi?: number;
};

export default function AddBodyCompositionModal({ patientId }: AddBodyCompositionModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    patientId: z.string(),
    entryDate: z.string().min(1, "Entry date is required"),
    heightInches: z.number().min(1, "Height is required"),
    weightPounds: z.number().min(1, "Weight is required"),
    bodyFatPercentage: z.number().min(0, "Body fat percentage is required"),
    skeletalMuscle: z.number().min(0, "Skeletal muscle percentage is required"),
    visceralFat: z.number().min(1, "Visceral fat rating is required"),
    bmi: z.number().optional(),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId,
      entryDate: new Date().toISOString().split('T')[0],
      heightInches: 0,
      weightPounds: 0,
      bodyFatPercentage: 0,
      skeletalMuscle: 0,
      visceralFat: 1, // Default to 1 since it's required
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { heightInches, weightPounds, entryDate, ...rest } = data;
      return await apiRequest("POST", `/api/patients/${patientId}/body-composition`, {
        ...rest,
        entryDate: new Date(entryDate), // Convert string to Date
        heightInches, // Store height in inches
        weightPounds, // Store weight in pounds
        // Convert to metric for legacy fields if needed
        height: heightInches ? heightInches * 2.54 : null, // Convert inches to cm
        weight: weightPounds ? weightPounds * 0.453592 : null, // Convert lbs to kg
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/body-composition`] });
      toast({
        title: "Success",
        description: "Body composition data added successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Body composition form error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add body composition data",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Auto-calculate BMI if height and weight are provided (BMI = weight in lbs / (height in inches)^2 * 703)
    if (data.heightInches && data.weightPounds && data.heightInches > 0) {
      data.bmi = Number(((data.weightPounds / (data.heightInches * data.heightInches)) * 703).toFixed(1));
    }
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Body Composition
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Body Composition Data</DialogTitle>
          <DialogDescription>
            Enter weight, height, and body composition measurements for this patient.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heightInches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (in)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weightPounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bodyFatPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Fat (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skeletalMuscle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skeletal Muscle (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visceralFat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visceral Fat</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add Data"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}