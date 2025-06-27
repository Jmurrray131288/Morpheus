import { useState } from "react";
import { Search, User, Calendar, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@shared/schema";

export default function QuickPatientSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const filteredPatients = patients.filter(patient => 
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contactNumber?.includes(searchTerm)
  ).slice(0, 5);

  return (
    <div className="medical-card p-6">
      <div className="flex items-center mb-4">
        <Search className="w-5 h-5 mr-2 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Quick Patient Search</h3>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {searchTerm && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {patient.contactNumber || "No phone"}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Pill className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
          
          {filteredPatients.length === 0 && searchTerm && (
            <div className="text-center py-4 text-gray-500">
              No patients found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Start typing to search patients</p>
        </div>
      )}
    </div>
  );
}