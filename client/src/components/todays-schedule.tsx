import { Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Appointment {
  id: string;
  patientId: string;
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
      patientId: "cb0d269d-ce37-49fe-ac8e-bfc798f6c020",
      patientName: "Sarah Johnson",
      time: "9:00 AM",
      type: "Annual Physical",
      duration: "45 min",
      status: "upcoming"
    },
    {
      id: "2", 
      patientId: "cb0d269d-ce37-49fe-ac8e-bfc798f6c020",
      patientName: "Mike Chen",
      time: "10:00 AM",
      type: "Lab Results Review",
      duration: "30 min",
      status: "upcoming"
    },
    {
      id: "3",
      patientId: "cb0d269d-ce37-49fe-ac8e-bfc798f6c020",
      patientName: "Emily Rodriguez",
      time: "11:15 AM", 
      type: "Precision Medicine Consult",
      duration: "60 min",
      status: "upcoming"
    },
    {
      id: "4",
      patientId: "cb0d269d-ce37-49fe-ac8e-bfc798f6c020",
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
    <div className="medical-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          Today's Schedule
        </h3>
        <span className="text-xs text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="space-y-2">
        {appointments.map((appointment) => (
          <div 
            key={appointment.id}
            className={`border rounded-lg p-3 ${getStatusColor(appointment.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex items-center text-sm font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {appointment.time}
                </div>
                <div className="flex items-center flex-1 min-w-0">
                  <User className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{appointment.patientName}</span>
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {appointment.type} • {appointment.duration}
                </div>
              </div>
              <Link href={`/patients/${appointment.patientId}`}>
                <Button variant="outline" size="sm" className="text-xs px-2 py-1 ml-3">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-4">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No appointments scheduled for today</p>
        </div>
      )}
    </div>
  );
}