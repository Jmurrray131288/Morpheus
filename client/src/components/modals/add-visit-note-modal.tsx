import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertVisitNoteSchema, type InsertVisitNote } from "@shared/schema";
import { z } from "zod";

const visitNoteFormSchema = insertVisitNoteSchema.omit({
  patientId: true,
});

type VisitNoteFormData = z.infer<typeof visitNoteFormSchema>;

interface AddVisitNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export default function AddVisitNoteModal({ open, onOpenChange, patientId }: AddVisitNoteModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<VisitNoteFormData>({
    resolver: zodResolver(visitNoteFormSchema),
    defaultValues: {
      note: "",
    },
  });

  const createVisitNoteMutation = useMutation({
    mutationFn: async (data: VisitNoteFormData) => {
      await apiRequest("POST", `/api/patients/${patientId}/visit-notes`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/visit-notes`] });
      toast({
        title: "Success",
        description: "Visit note added successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VisitNoteFormData) => {
    createVisitNoteMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Visit Note</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Note</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter visit notes, observations, treatment plans, patient feedback, etc."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={createVisitNoteMutation.isPending}
              >
                {createVisitNoteMutation.isPending ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
