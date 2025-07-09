import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertMetabolicHealthEntrySchema } from "@shared/schema";
import type { z } from "zod";

type FormData = z.infer<typeof insertMetabolicHealthEntrySchema>;

interface AddMetabolicModalProps {
  patientId: string;
}

export default function AddMetabolicModal({ patientId }: AddMetabolicModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertMetabolicHealthEntrySchema),
    defaultValues: {
      patientId,
      glucoseMetrics: "",
      metabolicMarkers: "",
      weightManagement: "",
    },
  });

  const createMetabolicMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest(`/api/patients/${patientId}/metabolic-health`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/metabolic-health`] });
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/profile`] });
      toast({
        title: "Success",
        description: "Metabolic health entry added successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add metabolic health entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createMetabolicMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Add Metabolic Health Entry
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="glucoseMetrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Glucose Metrics</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Fasting glucose: 95 mg/dL, HbA1c: 5.4%, Post-prandial: 140 mg/dL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metabolicMarkers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metabolic Markers</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Insulin: 8 mIU/L, HOMA-IR: 2.1, Leptin: 12 ng/mL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightManagement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Management</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., BMR: 1600 kcal/day, Body fat target: 15%, Current weight trend: stable"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMetabolicMutation.isPending}>
                {createMetabolicMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
