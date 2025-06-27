import { AlertTriangle, TrendingUp, Pill, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  patientName: string;
  action: string;
  timestamp: string;
}

export default function PriorityAlerts() {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "critical",
      title: "Critical Lab Result",
      description: "Elevated troponin levels detected",
      patientName: "Sarah Johnson",
      action: "Review immediately",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      type: "warning", 
      title: "Medication Interaction",
      description: "New prescription conflicts with existing therapy",
      patientName: "Mike Chen",
      action: "Adjust dosage",
      timestamp: "4 hours ago"
    },
    {
      id: "3",
      type: "info",
      title: "Follow-up Due",
      description: "Peptide therapy progress check scheduled",
      patientName: "Emily Rodriguez", 
      action: "Schedule appointment",
      timestamp: "1 day ago"
    }
  ];

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "critical": return "border-l-red-500 bg-red-50";
      case "warning": return "border-l-yellow-500 bg-yellow-50";
      case "info": return "border-l-blue-500 bg-blue-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning": return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case "info": return <FileText className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="medical-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
          Priority Alerts
        </h3>
        <span className="text-xs text-gray-500">{alerts.length} active</span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`border-l-4 p-3 rounded-r-lg ${getAlertStyle(alert.type)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{alert.title}</h4>
                    <span className="text-xs text-gray-500">• {alert.patientName}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{alert.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-gray-400">{alert.timestamp}</span>
                <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                  {alert.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-4">
          <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No priority alerts</p>
        </div>
      )}
    </div>
  );
}