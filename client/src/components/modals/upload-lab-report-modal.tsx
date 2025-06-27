import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const uploadLabReportSchema = z.object({
  recordDate: z.string().min(1, "Record date is required"),
  reportName: z.string().min(1, "Report name is required"),
  notes: z.string().optional(),
});

type UploadLabReportForm = z.infer<typeof uploadLabReportSchema>;

interface UploadLabReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName: string;
}

export default function UploadLabReportModal({
  open,
  onOpenChange,
  patientId,
  patientName,
}: UploadLabReportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UploadLabReportForm>({
    resolver: zodResolver(uploadLabReportSchema),
    defaultValues: {
      recordDate: new Date().toISOString().split('T')[0],
      reportName: "",
      notes: "",
    },
  });

  const createLabReportMutation = useMutation({
    mutationFn: async (data: UploadLabReportForm & { fileData?: string; fileName?: string }) => {
      return await apiRequest("POST", `/api/patients/${patientId}/lab-records`, {
        patientId,
        recordDate: data.recordDate,
        pdfReports: uploadedFile ? {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          fileType: uploadedFile.type,
          uploadDate: new Date().toISOString(),
          fileData: uploadedFileData,
        } : null,
        panels: {
          reportName: data.reportName,
          notes: data.notes,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lab report uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/profile`] });
      onOpenChange(false);
      form.reset();
      setUploadedFile(null);
      setUploadedFileData(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload lab report. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to upload lab report:", error);
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/tiff',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, image, or Word documents only.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedFileData(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Auto-fill report name if not already filled
    if (!form.getValues("reportName")) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      form.setValue("reportName", fileName);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileData(null);
  };

  const onSubmit = (data: UploadLabReportForm) => {
    createLabReportMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Lab Report</DialogTitle>
          <p className="text-sm text-gray-600">
            Upload lab report for {patientName}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Lab Report File
              </label>
              
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your lab report here, or{" "}
                    <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                      browse files
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx"
                        onChange={handleFileInput}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, Images, Word documents up to 10MB
                  </p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="recordDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Complete Blood Panel, Lipid Panel, etc."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this lab report..."
                      {...field} 
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
                disabled={createLabReportMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLabReportMutation.isPending}
              >
                {createLabReportMutation.isPending ? "Uploading..." : "Upload Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}