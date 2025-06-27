import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit2 } from "lucide-react";
import type { BodyCompositionEntry } from "@shared/schema";

interface EditBodyCompositionModalProps {
  patientId: string;
  entry: BodyCompositionEntry;
}

type FormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  patientId: z.string(),
  heightInches: z.number().min(1, "Height is required"),
  weightPounds: z.number().min(1, "Weight is required"),
  bodyFatPercentage: z.number().min(0, "Body fat percentage is required"),
  skeletalMuscle: z.number().min(0, "Skeletal muscle percentage is required"),
  visceralFat: z.number().min(1, "Visceral fat rating is required"),
  bmi: z.number().optional(),
});

export default function EditBodyCompositionModal({ patientId, entry }: EditBodyCompositionModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId,
      heightInches: entry.heightInches || 0,
      weightPounds: entry.weightPounds || 0,
      bodyFatPercentage: entry.bodyFatPercentage || 0,
      skeletalMuscle: entry.skeletalMuscle || 0,
      visceralFat: entry.visceralFat || 1,
      bmi: entry.bmi || 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { heightInches, weightPounds, ...rest } = data;
      return await apiRequest("PUT", `/api/patients/${patientId}/body-composition/${entry.id}`, {
        ...rest,
        heightInches,
        weightPounds,
        // Convert to metric for legacy fields if needed
        height: heightInches ? heightInches * 2.54 : null,
        weight: weightPounds ? weightPounds * 0.453592 : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/patients/${patientId}/body-composition`],
      });
      toast({
        title: "Success",
        description: "Body composition updated successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Body composition form error:", error);
      toast({
        title: "Error",
        description: "Failed to update body composition",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Auto-calculate BMI if height and weight are provided
    if (data.heightInches && data.weightPounds && data.heightInches > 0) {
      data.bmi = Number(((data.weightPounds / (data.heightInches * data.heightInches)) * 703).toFixed(1));
    }
    mutation.mutate(data);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Edit2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Body Composition</DialogTitle>
            <DialogDescription>
              Update the body composition measurements for this patient.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="skeletalMuscle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skeletal Muscle (%)</FormLabel>
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
                name="visceralFat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visceral Fat</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}