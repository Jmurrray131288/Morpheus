import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Calendar, Edit } from "lucide-react";
import AddVisitNoteModal from "@/components/modals/add-visit-note-modal";
import type { Patient, VisitNote } from "@shared/schema";

export default function VisitNotesPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: visitNotes = [] } = useQuery<VisitNote[]>({
    queryKey: [`/api/patients/${selectedPatientId}/visit-notes`],
    enabled: !!selectedPatientId,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visit Notes</h1>
          <p className="text-gray-500">Document patient encounters and observations</p>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="medical-card p-6 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Patient:</label>
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedPatient ? (
        <div className="medical-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Visit Notes for {selectedPatient.firstName} {selectedPatient.lastName}
            </h2>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          {visitNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No visit notes recorded</p>
              <Button onClick={() => setShowAddModal(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add First Note
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {visitNotes.map((note, index) => (
                <div key={note.id} className={`border-l-4 p-4 rounded-r-lg ${
                  index % 2 === 0 ? "border-primary bg-blue-50" : "border-secondary bg-green-50"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : "Date unknown"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Provider</span>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed">{note.note}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Note ID: {note.id.slice(0, 8)}...</span>
                      <span>Last updated: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "Unknown"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AddVisitNoteModal
            open={showAddModal}
            onOpenChange={setShowAddModal}
            patientId={selectedPatient.id}
          />
        </div>
      ) : (
        <div className="medical-card p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
          <p className="text-gray-500">Choose a patient from the dropdown above to view their visit notes</p>
        </div>
      )}
    </div>
  );
}