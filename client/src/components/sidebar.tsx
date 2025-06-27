import { User, Settings, Activity, Users, Pill, TestTube, Heart, Dna, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();
  
  const navigationItems = [
    { icon: Activity, label: "Dashboard", path: "/", active: location === "/" },
    { icon: Users, label: "Patients", path: "/patients", active: location === "/patients" },
    { icon: Pill, label: "Medications", path: "/medications", active: location === "/medications" },
    { icon: TestTube, label: "Lab Records", path: "/lab-records", active: location === "/lab-records" },
    { icon: Heart, label: "Health Metrics", path: "/health-metrics", active: location === "/health-metrics" },
    { icon: Dna, label: "Precision Medicine", path: "/precision-medicine", active: location === "/precision-medicine" },
    { icon: FileText, label: "Visit Notes", path: "/visit-notes", active: location === "/visit-notes" },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Morpheus</h1>
            <p className="text-sm text-gray-500">EMR System</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Chen</p>
              <p className="text-xs text-gray-500">Healthcare Provider</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              item.active
                ? "text-primary bg-blue-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
