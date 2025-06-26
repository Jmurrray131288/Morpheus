import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VisitNote } from "@shared/schema";

interface VisitNotesSectionProps {
  patientId: string;
  onAddNote: () => void;
}

export default function VisitNotesSection({ patientId, onAddNote }: VisitNotesSectionProps) {
  const { data: visitNotes = [], isLoading } = useQuery<VisitNote[]>({
    queryKey: [`/api/patients/${patientId}/visit-notes`],
  });

  if (isLoading) {
    return (
      <div className="health-section">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-section">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Visit Notes</h3>
        <Button
          variant="ghost"
          onClick={onAddNote}
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Note
        </Button>
      </div>

      {visitNotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No visit notes recorded</p>
          <Button onClick={onAddNote} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add First Note
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {visitNotes.map((note, index) => (
            <div key={note.id} className={index % 2 === 0 ? "visit-note-primary" : "visit-note-secondary"}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">Provider</span>
              </div>
              <p className="text-sm text-gray-700">{note.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
