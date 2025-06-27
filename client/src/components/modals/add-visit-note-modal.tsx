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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const addVisitNoteSchema = z.object({
  note: z.string().min(1, "Visit note cannot be empty"),
});

type AddVisitNoteForm = z.infer<typeof addVisitNoteSchema>;

interface AddVisitNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName?: string;
}

export default function AddVisitNoteModal({
  open,
  onOpenChange,
  patientId,
  patientName,
}: AddVisitNoteModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddVisitNoteForm>({
    resolver: zodResolver(addVisitNoteSchema),
    defaultValues: {
      note: "",
    },
  });

  const createVisitNoteMutation = useMutation({
    mutationFn: async (data: AddVisitNoteForm) => {
      return await apiRequest("POST", `/api/patients/${patientId}/visit-notes`, {
        patientId,
        note: data.note,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/profile`] });
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
        description: "Failed to add visit note. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to add visit note:", error);
    },
  });

  const onSubmit = (data: AddVisitNoteForm) => {
    createVisitNoteMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Add Visit Note {patientName && `for ${patientName}`}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter visit notes, observations, treatment plans, or patient interactions..."
                      className="min-h-[200px]"
                      {...field}
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