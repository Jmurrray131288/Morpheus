import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VisitNote } from "@shared/schema";

interface VisitNotesSectionProps {
  patientId: string;
  onAddNote: () => void;
}

export default function VisitNotesSection({ patientId, onAddNote }: VisitNotesSectionProps) {
  const { data: profileData, isLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}/profile`],
  });

  const visitNotes = profileData?.visitNotes || [];

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Date</th>
                <th className="text-left py-2 font-medium text-gray-700">Note</th>
                <th className="text-left py-2 font-medium text-gray-700">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitNotes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50">
                  <td className="py-3 text-gray-600">
                    {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 text-gray-900 max-w-md">
                    <div className="truncate">{note.note}</div>
                  </td>
                  <td className="py-3 text-gray-600">Provider</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
