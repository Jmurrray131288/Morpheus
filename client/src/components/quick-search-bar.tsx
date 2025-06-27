import { useState } from "react";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@shared/schema";

interface QuickSearchBarProps {
  onPatientSelect: (patient: Patient) => void;
}

export default function QuickSearchBar({ onPatientSelect }: QuickSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const filteredPatients = patients.filter(patient => 
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contactNumber?.includes(searchTerm)
  ).slice(0, 5);

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchTerm(`${patient.firstName} ${patient.lastName}`);
    setShowResults(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleFocus = () => {
    if (searchTerm.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding results to allow for click
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Search patients by name or phone..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-9 bg-white border-gray-300"
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handlePatientSelect(patient)}
            >
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="text-xs text-gray-500">
                  {patient.contactNumber || "No phone"}
                </div>
              </div>
            </div>
          ))}
          
          {filteredPatients.length === 0 && searchTerm && (
            <div className="text-center py-3 text-gray-500 text-sm">
              No patients found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}