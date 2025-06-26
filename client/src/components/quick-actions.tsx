import { CalendarPlus, TestTubeDiagonal, Printer, Download } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: CalendarPlus,
      label: "Schedule Visit",
      className: "quick-action-primary",
      iconColor: "text-primary",
    },
    {
      icon: TestTubeDiagonal,
      label: "Order Labs",
      className: "quick-action-secondary",
      iconColor: "text-secondary",
    },
    {
      icon: Printer,
      label: "Print Records",
      className: "quick-action-accent",
      iconColor: "text-accent",
    },
    {
      icon: Download,
      label: "Export Data",
      className: "quick-action-purple",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="medical-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button key={action.label} className={action.className}>
            <action.icon className={`text-2xl ${action.iconColor} mb-2`} />
            <span className="text-sm font-medium text-gray-900">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
