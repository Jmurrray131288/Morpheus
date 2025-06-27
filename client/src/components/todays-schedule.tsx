import { Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  duration: string;
  status: "upcoming" | "in-progress" | "completed";
}

export default function TodaysSchedule() {
  // Mock data for now - in real app this would come from API
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      time: "9:00 AM",
      type: "Annual Physical",
      duration: "45 min",
      status: "upcoming"
    },
    {
      id: "2", 
      patientName: "Mike Chen",
      time: "10:00 AM",
      type: "Lab Results Review",
      duration: "30 min",
      status: "upcoming"
    },
    {
      id: "3",
      patientName: "Emily Rodriguez",
      time: "11:15 AM", 
      type: "Precision Medicine Consult",
      duration: "60 min",
      status: "upcoming"
    },
    {
      id: "4",
      patientName: "David Park",
      time: "1:30 PM",
      type: "Peptide Therapy Follow-up",
      duration: "30 min",
      status: "upcoming"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-50 text-blue-700 border-blue-200";
      case "in-progress": return "bg-green-50 text-green-700 border-green-200";
      case "completed": return "bg-gray-50 text-gray-500 border-gray-200";
      default: return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="medical-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Today's Schedule
        </h3>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div 
            key={appointment.id}
            className={`border rounded-lg p-4 ${getStatusColor(appointment.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="font-medium">{appointment.patientName}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {appointment.time}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">{appointment.type}</div>
                <div className="text-xs text-gray-500">{appointment.duration}</div>
              </div>
              <Button variant="outline" size="sm">
                View Patient
              </Button>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No appointments scheduled for today</p>
        </div>
      )}
    </div>
  );
}