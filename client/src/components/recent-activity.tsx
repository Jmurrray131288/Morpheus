import { Clock, FileText, Pill, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  type: "note" | "prescription" | "lab" | "vitals";
  description: string;
  patientName: string;
  timestamp: string;
  status?: string;
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "lab",
      description: "Lab results received - Comprehensive Metabolic Panel",
      patientName: "Sarah Johnson",
      timestamp: "15 minutes ago",
      status: "needs_review"
    },
    {
      id: "2",
      type: "prescription",
      description: "Prescribed BPC-157 peptide therapy",
      patientName: "Mike Chen", 
      timestamp: "1 hour ago",
      status: "completed"
    },
    {
      id: "3",
      type: "vitals",
      description: "Body composition analysis updated",
      patientName: "Emily Rodriguez",
      timestamp: "2 hours ago",
      status: "completed"
    },
    {
      id: "4",
      type: "note",
      description: "Follow-up visit note added",
      patientName: "David Park",
      timestamp: "3 hours ago", 
      status: "completed"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "note": return <FileText className="w-4 h-4 text-blue-500" />;
      case "prescription": return <Pill className="w-4 h-4 text-green-500" />;
      case "lab": return <Activity className="w-4 h-4 text-purple-500" />;
      case "vitals": return <Activity className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const styles = {
      needs_review: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      pending: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="medical-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          Recent Activity
        </h3>
        <Button variant="ghost" size="sm" className="text-sm text-gray-500">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                {getStatusBadge(activity.status)}
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{activity.patientName}</span>
                <span>•</span>
                <span>{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
}