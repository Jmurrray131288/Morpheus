import { User, Settings } from "lucide-react";

export default function Sidebar() {
  const navigationItems = [
    { icon: "fas fa-tachometer-alt", label: "Dashboard", active: true },
    { icon: "fas fa-users", label: "Patients" },
    { icon: "fas fa-pills", label: "Medications" },
    { icon: "fas fa-flask", label: "Lab Records" },
    { icon: "fas fa-heart", label: "Health Metrics" },
    { icon: "fas fa-dna", label: "Precision Medicine" },
    { icon: "fas fa-file-medical", label: "Visit Notes" },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Morpheus</h1>
            <p className="text-sm text-gray-500">EMR System</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              item.active
                ? "text-primary bg-blue-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <i className={`${item.icon} w-5 h-5 mr-3`}></i>
            {item.label}
          </a>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Dr. Sarah Chen</p>
            <p className="text-xs text-gray-500">Healthcare Provider</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
