import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCardiovascularHealthEntrySchema } from "@shared/schema";
import type { z } from "zod";

type FormData = z.infer<typeof insertCardiovascularHealthEntrySchema>;

interface AddCardiovascularModalProps {
  patientId: string;
}

export default function AddCardiovascularModal({ patientId }: AddCardiovascularModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(insertCardiovascularHealthEntrySchema),
    defaultValues: {
      patientId,
      bloodPressure: "",
      lipids: "",
      inflammation: "",
    },
  });

  const createCardiovascularMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest(`/api/patients/${patientId}/cardiovascular-health`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/cardiovascular-health`] });
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/profile`] });
      toast({
        title: "Success",
        description: "Cardiovascular health entry added successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add cardiovascular health entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createCardiovascularMutation.mutate(data);
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
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Add Cardiovascular Health Entry
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Pressure</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 120/80 mmHg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lipids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lipids</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Total cholesterol: 180 mg/dL, LDL: 100 mg/dL, HDL: 60 mg/dL, Triglycerides: 150 mg/dL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inflammation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inflammation Markers</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., CRP: 1.2 mg/L, ESR: 15 mm/hr"
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
              <Button type="submit" disabled={createCardiovascularMutation.isPending}>
                {createCardiovascularMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
