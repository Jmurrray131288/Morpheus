import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
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
import { insertBodyCompositionEntrySchema } from "@shared/schema";

interface AddBodyCompositionModalProps {
  patientId: string;
}

const formSchema = z.object({
  patientId: z.string(),
  entryDate: z.string().min(1, "Entry date is required"),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  bmi: z.number().min(0).optional(),
  bodyFatPercentage: z.number().min(0).optional(),
  skeletalMuscle: z.number().min(0).optional(),
  visceralFat: z.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AddBodyCompositionModal({ patientId }: AddBodyCompositionModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId,
      entryDate: new Date().toISOString().split('T')[0],
      height: undefined,
      weight: undefined,
      bmi: undefined,
      bodyFatPercentage: undefined,
      skeletalMuscle: undefined,
      visceralFat: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { entryDate, ...rest } = data;
      return await apiRequest(`/api/patients/${patientId}/body-composition`, "POST", {
        ...rest,
        entryDate: new Date(entryDate),
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
      toast({
        title: "Error",
        description: error.message || "Failed to add body composition data",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Auto-calculate BMI if height and weight are provided
    if (data.height && data.weight && data.height > 0) {
      const heightInMeters = data.height / 100;
      data.bmi = Number((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
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
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
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
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
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